import React, { useEffect, useState, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { productsAPI, categoriesAPI } from '../services/api';
import ProductCard from '../components/products/ProductCard';

const sortOptions = [
  { value: '', label: 'Relevancia' },
  { value: 'price_asc', label: 'Precio: Menor a Mayor' },
  { value: 'price_desc', label: 'Precio: Mayor a Menor' },
  { value: 'rating', label: 'Mejor Calificación' },
  { value: 'newest', label: 'Más Nuevos' },
];

export default function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [pagination, setPagination] = useState({ total: 0, totalPages: 1, page: 1 });
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);

  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [category, setCategory] = useState(searchParams.get('category') || 'all');
  const [sort, setSort] = useState(searchParams.get('sort') || '');
  const [page, setPage] = useState(1);

  // Cargar categorías una vez
  useEffect(() => {
    categoriesAPI.getAll()
      .then(r => setCategories(r.data.categories))
      .catch(console.error);
  }, []);

  // Cargar productos cuando cambian filtros
  const loadProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page, limit: 12 };
      if (search) params.search = search;
      if (category && category !== 'all') params.category = category;
      if (sort) params.sort = sort;

      const res = await productsAPI.getAll(params);
      setProducts(res.data.products);
      setPagination(res.data.pagination);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [search, category, sort, page]);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  // Sync URL params
  useEffect(() => {
    const params = {};
    if (search) params.search = search;
    if (category !== 'all') params.category = category;
    if (sort) params.sort = sort;
    setSearchParams(params, { replace: true });
    setPage(1);
  }, [search, category, sort]);

  const clearFilters = () => {
    setSearch('');
    setCategory('all');
    setSort('');
    setPage(1);
  };

  const hasFilters = search || category !== 'all' || sort;

  return (
    <div className="bg-zen-pattern min-h-screen">
      {/* Header */}
      <div className="bg-zen-950 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="font-display text-4xl font-bold text-cream-100 mb-2">
            Catálogo de Productos
          </h1>
          <p className="font-body text-sage-300">
            {pagination.total} productos disponibles para transformar tu hogar
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search + sort bar */}
        <div className="flex gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-sage-400" />
            <input
              type="text"
              placeholder="Buscar productos..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="input-zen pl-10 h-11"
            />
          </div>
          <select
            value={sort}
            onChange={e => setSort(e.target.value)}
            className="input-zen w-auto h-11 cursor-pointer"
          >
            {sortOptions.map(o => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`md:hidden h-11 w-11 flex items-center justify-center rounded-xl border transition-colors ${
              showFilters ? 'bg-zen-700 border-zen-700 text-white' : 'border-cream-400 bg-white text-zen-700'
            }`}
          >
            <SlidersHorizontal className="w-5 h-5" />
          </button>
        </div>

        <div className="flex gap-6">
          {/* Sidebar filters */}
          <aside className={`w-56 shrink-0 ${showFilters ? 'block' : 'hidden md:block'}`}>
            <div className="card-zen p-4 sticky top-24">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-body text-sm font-semibold text-zen-900">Categorías</h3>
                {hasFilters && (
                  <button
                    onClick={clearFilters}
                    className="text-xs text-terra-600 hover:text-terra-700 font-medium flex items-center gap-1"
                  >
                    <X className="w-3 h-3" /> Limpiar
                  </button>
                )}
              </div>

              <ul className="space-y-1">
                {[{ id: 'all', name: 'Todos', icon: '🏠', productCount: pagination.total }, ...categories].map(cat => (
                  <li key={cat.id}>
                    <button
                      onClick={() => setCategory(cat.id)}
                      className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-body transition-colors ${
                        category === cat.id
                          ? 'bg-zen-700 text-white font-medium'
                          : 'text-zen-700 hover:bg-cream-200'
                      }`}
                    >
                      <span>{cat.icon}</span>
                      <span className="flex-1 text-left">{cat.name}</span>
                      {cat.productCount !== undefined && (
                        <span className={`text-xs ${category === cat.id ? 'text-zen-200' : 'text-sage-400'}`}>
                          {cat.productCount}
                        </span>
                      )}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </aside>

          {/* Products grid */}
          <main className="flex-1">
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {Array(9).fill(null).map((_, i) => (
                  <div key={i} className="card-zen h-72 animate-pulse bg-cream-200" />
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="font-display text-2xl text-zen-900 mb-2">Sin resultados</h3>
                <p className="font-body text-sage-500 mb-6">No encontramos productos con esos filtros.</p>
                <button onClick={clearFilters} className="btn-primary">Limpiar filtros</button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                  {products.map(product => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>

                {/* Pagination */}
                {pagination.totalPages > 1 && (
                  <div className="flex justify-center gap-2 mt-10">
                    {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map(p => (
                      <button
                        key={p}
                        onClick={() => setPage(p)}
                        className={`w-9 h-9 rounded-full font-body text-sm font-medium transition-colors ${
                          page === p
                            ? 'bg-zen-700 text-white'
                            : 'bg-white text-zen-700 border border-cream-300 hover:bg-cream-200'
                        }`}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                )}
              </>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
