/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'agri-primary': '#1b5e20',
        'agri-dark': '#0a3d12',
        'agri-accent': '#ff8f00',
        'agri-light': '#f3f5f7',
        'agri-success': '#059669',
        'agri-danger': '#dc2626',
        'agri-warning': '#f59e0b',
      },
      fontFamily: {
        sans: ['var(--font-inter)'],
      },
      backgroundImage: {
        'sidebar-gradient': 'linear-gradient(135deg, #0a3d12 0%, #1b5e20 100%)',
      },
      boxShadow: {
        'card': '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
        'card-hover': '0 4px 12px 0 rgba(0, 0, 0, 0.15)',
      },
    },
  },
  plugins: [],
};
