module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f8f9fa',
          100: '#e9ecef',
          200: '#dee2e6',
          300: '#ced4da',
          400: '#adb5bd',
          500: '#6c757d',
          600: '#495057',
          700: '#343a40',
          800: '#212529',
          900: '#0e121b',
        },
        dark: {
          DEFAULT: '#0e121b',
          50: '#1a1f2e',
          100: '#252b3d',
          200: '#2f3649',
          300: '#3a4255',
        },
      },
    },
  },
  plugins: [],
}

