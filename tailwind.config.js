/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['var(--font-display)', 'Georgia', 'serif'],
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-mono)', 'monospace'],
      },
      colors: {
        ink: {
          950: '#05060a',
          900: '#0a0c14',
          800: '#0f1220',
          700: '#161a2c',
          600: '#1f2440',
        },
        gold: {
          50: '#fffaf0',
          100: '#fff1d6',
          200: '#ffe1a8',
          300: '#ffcc70',
          400: '#f5b342',
          500: '#d99528',
          600: '#a86f17',
          700: '#7a4f0e',
        },
      },
      backgroundImage: {
        'radial-gold': 'radial-gradient(ellipse at top, rgba(245,179,66,0.18), transparent 60%)',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'gradient-x': {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        'pulse-slow': {
          '0%, 100%': { opacity: '0.5' },
          '50%': { opacity: '1' },
        },
        'border-spin': {
          '100%': { transform: 'rotate(-360deg)' },
        },
      },
      animation: {
        shimmer: 'shimmer 2.5s linear infinite',
        float: 'float 6s ease-in-out infinite',
        'gradient-x': 'gradient-x 8s ease infinite',
        'pulse-slow': 'pulse-slow 4s ease-in-out infinite',
        'border-spin': 'border-spin 7s linear infinite',
      },
    },
  },
  plugins: [],
};
