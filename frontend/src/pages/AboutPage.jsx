import React from 'react';
import { Target, Eye, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const values = [
  {
    icon: '🤝',
    name: 'Responsabilidad',
    desc: 'Cumplimos con los compromisos de nuestros clientes de manera eficiente y profesional.',
  },
  {
    icon: '💡',
    name: 'Innovación',
    desc: 'Buscamos constantemente nuevas ideas y soluciones creativas para la organización del hogar.',
  },
  {
    icon: '⭐',
    name: 'Calidad',
    desc: 'Ofrecemos productos y servicios funcionales, duraderos y de excelente presentación.',
  },
  {
    icon: '💪',
    name: 'Compromiso',
    desc: 'Trabajamos con dedicación para garantizar la satisfacción y bienestar de los clientes.',
  },
  {
    icon: '🌟',
    name: 'Honestidad',
    desc: 'Actuamos con transparencia, ética y respeto en todas las actividades de la empresa.',
  },
  {
    icon: '🌿',
    name: 'Armonía',
    desc: 'Promovemos ambientes organizados y tranquilos que contribuyen al bienestar emocional y familiar.',
  },
];

const teamMembers = [
  {
    name: 'Zabdiel Córdova Alejandro',
    role: 'Fundador y Director General',
    bio: 'Estudiante de Ingeniería en Sistemas Computacionales de la UJAT. Responsable de la dirección estratégica, coordinación general y desarrollo integral del proyecto Espacios Zen.',
    emoji: '👨‍💼',
  },
  {
    name: 'Oswaldo Jair Martínez Hernández',
    role: 'Director de Marketing y Ventas',
    bio: 'Estudiante de Ingeniería en Sistemas Computacionales de la UJAT. Encargado de la promoción digital, estrategias comerciales y posicionamiento de la marca.',
    emoji: '👨‍💼',
  },
  {
    name: 'Diego Jacinto Domínguez',
    role: 'Coordinador de Logística y Operaciones',
    bio: 'Estudiante de Ingeniería en Sistemas Computacionales de la UJAT. Responsable de la gestión operativa, organización de procesos y control de inventario.',
    emoji: '👨‍💼',
  },
  {
    name: 'Guillermo Álvarez Arias',
    role: 'Responsable de Atención al Cliente',
    bio: 'Estudiante de Ingeniería en Sistemas Computacionales de la UJAT. Encargado del seguimiento de pedidos, soporte y satisfacción de los clientes.',
    emoji: '👨‍💼',
  },
];

export default function AboutPage() {
  return (
    <div className="bg-zen-pattern min-h-screen">
      {/* Hero */}
      <div className="bg-zen-950 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <h1 className="font-display text-5xl font-bold text-cream-100 mb-4">
              Nuestra Historia
            </h1>
            <p className="font-body text-sage-300 text-lg leading-relaxed">
              Espacios Zen nació de una necesidad real: ayudar a las personas a crear hogares
              más ordenados, funcionales y armoniosos en Villahermosa, Tabasco.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-20">

        {/* Misión y Visión */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="card-zen p-8">
            <div className="w-12 h-12 bg-zen-700 rounded-xl flex items-center justify-center mb-5">
              <Target className="w-6 h-6 text-cream-100" />
            </div>
            <h2 className="font-display text-2xl font-bold text-zen-900 mb-3">
              Misión
            </h2>
            <p className="font-body text-sage-600 leading-relaxed text-justify">
              Brindar soluciones inteligentes de organización para el hogar mediante productos y
              servicios innovadores, funcionales y accesibles, que permitan transformar los espacios
              en ambientes ordenados, cómodos y armoniosos, contribuyendo al bienestar y calidad de
              vida de nuestros clientes.
            </p>
          </div>

          <div className="card-zen p-8">
            <div className="w-12 h-12 bg-terra-500 rounded-xl flex items-center justify-center mb-5">
              <Eye className="w-6 h-6 text-white" />
            </div>
            <h2 className="font-display text-2xl font-bold text-zen-900 mb-3">
              Visión
            </h2>
            <p className="font-body text-sage-600 leading-relaxed text-justify">
              Ser una empresa reconocida a nivel regional y nacional por ofrecer soluciones innovadoras
              de organización del hogar, destacándose por la calidad de sus productos, la satisfacción
              de sus clientes y su compromiso con la creación de espacios funcionales y armoniosos.
            </p>
          </div>
        </div>

        {/* Filosofía */}
        <div className="bg-zen-950 rounded-3xl p-10 md:p-14 text-white text-center">
          <div className="max-w-2xl mx-auto">
            <div className="text-5xl mb-6">🌿</div>
            <h2 className="font-display text-4xl font-bold text-cream-100 mb-4">
              Nuestra Filosofía
            </h2>
            <p className="font-body text-sage-300 text-lg leading-relaxed mb-6">
              En Espacios Zen creemos que un espacio ordenado transforma la vida de las personas.
              El orden influye directamente en el estado emocional, la productividad y la convivencia
              familiar.
            </p>
            <p className="font-display text-2xl italic text-terra-300">
              "Transforma tu espacio, transforma tu vida."
            </p>
          </div>
        </div>

        {/* Valores */}
        <div>
          <div className="text-center mb-12">
            <h2 className="section-title">Nuestros Valores</h2>
            <p className="section-subtitle">
              Los principios que guían cada decisión que tomamos
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {values.map(({ icon, name, desc }) => (
              <div
                key={name}
                className="card-zen p-6 hover:border-zen-300 transition-colors"
              >
                <div className="text-4xl mb-3">{icon}</div>
                <h3 className="font-body text-base font-bold text-zen-900 mb-2">
                  {name}
                </h3>
                <p className="font-body text-sm text-sage-500 leading-relaxed">
                  {desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Equipo */}
        <div>
          <div className="text-center mb-12">
            <h2 className="section-title">Nuestro Equipo</h2>
            <p className="section-subtitle">
              Las personas detrás de Espacios Zen
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {teamMembers.map(({ name, role, bio, emoji }) => (
              <div key={name} className="card-zen p-8 text-center">
                <div className="w-24 h-24 bg-zen-100 rounded-full flex items-center justify-center text-5xl mx-auto mb-4">
                  {emoji}
                </div>

                <h3 className="font-body text-lg font-bold text-zen-900 mb-1">
                  {name}
                </h3>

                <p className="font-body text-sm text-terra-600 font-medium mb-3">
                  {role}
                </p>

                <p className="font-body text-sm text-sage-500 leading-relaxed text-justify">
  {bio}
</p>

                <div className="mt-4">
                  <span className="text-xs bg-zen-100 text-zen-700 px-3 py-1 rounded-full font-medium">
                    ISC • UJAT
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center py-10">
          <h2 className="font-display text-3xl text-zen-900 mb-4">
            ¿Quieres saber más?
          </h2>

          <p className="font-body text-sage-500 mb-8">
            Contáctanos o conoce nuestros productos
          </p>

          <div className="flex justify-center gap-4 flex-wrap">
            <Link to="/contacto" className="btn-primary flex items-center gap-2">
              Contáctanos <ArrowRight className="w-4 h-4" />
            </Link>

            <Link to="/productos" className="btn-secondary">
              Ver Productos
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}