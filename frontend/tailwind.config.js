/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {
      colors: {
        // Grounded Community Forest Green (#2F6B4F)
        brand: {
          50: '#F4F7F5',
          100: '#E8EFEA',
          200: '#C8DCD0',
          300: '#94BCA7',
          400: '#5D9A7C',
          500: '#2F6B4F', // Core Primary Accent
          600: '#265740',
          700: '#1E4432',
          800: '#173426',
          900: '#0F2219',
          950: '#08130E',
        },
        // Warm Off-White Surfaces (#F7F6F2)
        surface: {
          base: '#F7F6F2',
          muted: '#EFECE6',
          card: '#FFFFFF',
          border: '#E5E1D8',
          hover: '#F2EFE9',
        },
        // Deep Charcoal Typography (#1C1C1A)
        ink: {
          primary: '#1C1C1A',
          secondary: '#55544E',
          muted: '#8A877E',
          subtle: '#B5B2A9',
        },
        // Warm Earthy Neutral (#D9CBB8)
        earth: {
          light: '#F5EFE6',
          sand: '#D9CBB8',
          warm: '#C2B19B',
          deep: '#8C7A65',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
