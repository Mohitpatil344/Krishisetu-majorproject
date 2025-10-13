/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  darkMode: 'class', // Enable class-based dark mode
  theme: {
    extend: {
      colors: {
        // Dark mode colors
        background: {
          'dark': 'var(--bg-dark)',
          'medium': 'var(--bg-medium)', 
          'light': 'var(--bg-light)',
        },
        text: {
          'primary': 'var(--text-primary)',
          'secondary': 'var(--text-secondary)',
          'muted': 'var(--text-muted)',
        },
        primary: {
          DEFAULT: 'var(--primary)',
          'dark': 'var(--primary-dark)',
          'light': 'var(--primary-light)',
        },
        secondary: {
          DEFAULT: 'var(--secondary)',
          'dark': 'var(--secondary-dark)',
          'light': 'var(--secondary-light)',
        },
        success: 'var(--success)',
        warning: 'var(--warning)',
        error: 'var(--error)',
        // Light mode specific colors
        'light-bg': {
          'primary': '#ffffff',
          'secondary': '#e4e5e6',
          'tertiary': '#f1f5f9',
        },
        'light-text': {
          'primary': '#1e293b',
          'secondary': '#475569',
          'muted': '#64748b',
        }
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'pulse-slow': 'pulse 3s infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideUp: {
          '0%': { transform: 'translateY(100%)' },
          '100%': { transform: 'translateY(0)' },
        }
      }
    },
  },
  plugins: [],
}