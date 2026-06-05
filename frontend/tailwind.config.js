/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        zen: {
          50:  '#f2f9f3',
          100: '#e3f2e5',
          200: '#c7e4cb',
          300: '#9dd0a3',
          400: '#6cb374',
          500: '#4a9354',
          600: '#3a7a43',
          700: '#2d5f35',
          800: '#264d2c',
          900: '#1c3a20',
          950: '#0f2012',
        },
        sage: {
          50:  '#f4f8f4',
          100: '#e8f2e8',
          200: '#d3e5d3',
          300: '#aecfaf',
          400: '#82b184',
          500: '#5a8a60',
          600: '#46704a',
          700: '#395a3d',
          800: '#304832',
          900: '#273c2b',
        },
        terra: {
          50:  '#fdf5f0',
          100: '#fbe9df',
          200: '#f7d0bb',
          300: '#f1af8a',
          400: '#e98456',
          500: '#d4845a',
          600: '#c46840',
          700: '#a35133',
          800: '#83422d',
          900: '#6b3827',
        },
        cream: {
          50:  '#fefcf9',
          100: '#faf7f2',
          200: '#f5efe4',
          300: '#ede4d4',
          400: '#e2d4be',
          500: '#d4c0a2',
        },
      },
      fontFamily: {
        display: ['Cormorant Garamond', 'Georgia', 'serif'],
        body: ['Plus Jakarta Sans', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'slide-in-right': 'slideInRight 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideInRight: {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(0)' },
        },
      },
    },
  },
  plugins: [],
};
