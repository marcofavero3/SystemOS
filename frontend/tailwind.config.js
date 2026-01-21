/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        // Base dark theme palette matching the reference
        background: '#09090b', // Very dark, almost black
        surface: '#121212',    // Slightly lighter for sidebar/cards
        surface_hover: '#1e1e1e', // Hover state
        
        primary: {
          DEFAULT: '#2563eb', // Blue-600
          hover: '#1d4ed8',   // Blue-700
          light: '#3b82f6',   // Blue-500
        },
        
        // Status colors
        success: '#22c55e', // Green
        warning: '#f59e0b', // Orange/Yellow
        danger: '#ef4444',  // Red
        info: '#3b82f6',    // Blue
        purple: '#a855f7',  // For "Entregue" status
      }
    },
  },
  plugins: [],
}
