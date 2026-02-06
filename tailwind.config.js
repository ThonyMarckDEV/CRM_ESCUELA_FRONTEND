/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#000000', // Negro absoluto (Acciones principales)
          hover: '#27272a',   // Zinc-800 (Hover suave)
          light: '#f4f4f5',   // Zinc-100 (Fondos de selección suave)
        },
        secondary: {
          DEFAULT: '#ffffff', // Blanco
          text: '#374151',    // Gris-700 (Texto legible)
          muted: '#9ca3af',   // Gris-400 (Textos secundarios)
        }
      },
    }
  },
  plugins: [],
}