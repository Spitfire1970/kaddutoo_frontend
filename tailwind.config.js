/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    darkMode: 'class',
    screens: {
      'sm': '640px',
      // => @media (min-width: 640px) { ... }

      'md': '768px',
      // => @media (min-width: 768px) { ... }

      'lg': '1024px',
      // => @media (min-width: 1024px) { ... }

      'xl': '1280px',
      // => @media (min-width: 1280px) { ... }

      '2xl': '1536px',
      // => @media (min-width: 1536px) { ... }  
    },
    extend: {
      colors: {
        'accent': '#3DD3AE'
      },
      fontSize: {
        'dynamic': 'max(1.6vw, 15px)',
      },
      keyframes: {
        'tag-pulse': {
          '0%': { backgroundColor: '#3DD3AE', transform: 'translateX(0)' },
          '25%': { backgroundColor: 'rgb(138, 138, 249)', transform: 'translateX(2.5px)' },
          '50%': { backgroundColor: 'rgb(253, 253, 157)', transform: 'translateX(2.5px)' },
          '75%': { backgroundColor: 'rgb(146, 255, 146)', transform: 'translateX(0)' },
          '100%': { backgroundColor: '#3DD3AE', transform: 'translateX(0)' },
        }
      },
      animation: {
        'tag-pulse': 'tag-pulse 0.5s infinite',
      }
    },
  },
  plugins: [],
  
}