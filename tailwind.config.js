module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx}',
    './src/app/**/*.{js,ts,jsx,tsx}',
    './src/components/**/*.{js,ts,jsx,tsx}',
  ],
  darkMode: "className",
  theme: {
    extend: {
      fontFamily: {
        serif: ['DM Serif Display', 'serif'],
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      colors: {
        gold: '#bfa06a',
        'gold-light': '#e5c79e',
        'off-white': '#f8f7f4',
        'soft-black': '#181716',
        'gray': {
          50: '#f9fafb',
          100: '#f3f4f6',
          200: '#e5e7eb',
          300: '#d1d5db',
          400: '#9ca3af',
          500: '#6b7280',
          600: '#4b5563',
          700: '#374151',
          800: '#1f2937',
          900: '#111827',
        },
        'brand': {
          primary: '#0A0704',
          secondary: '#a0c444',
          accent: '#8bb33a',
        }
      },
      textColor: {
        'primary': '#111827',
        'secondary': '#374151',
        'tertiary': '#6b7280',
        'muted': '#9ca3af',
      },
      backgroundColor: {
        'primary': '#ffffff',
        'secondary': '#f9fafb',
        'tertiary': '#f3f4f6',
      }
    },
  },
  plugins: [require("tailwind-scrollbar-hide")],
};
