// tailwind.config.js
const defaultTheme = require('tailwindcss/defaultTheme');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    // --- Overriding Colors ---
    // Only these colors will be available via Tailwind classes (e.g., bg-primary, text-base-content)
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      black: 'oklch(0.32 0 0)',
      white: 'oklch(90% 0 0)',

      'base-100': 'oklch(94.951% 0.002 17.197)', // Main background
      'base-200': 'oklch(93.951% 0.002 17.197)',  // Slightly darker bg
      'base-300': 'oklch(90.938% 0.001 17.197)', // Even darker bg / borders
      'base-content': 'oklch(16.961% 0.001 17.32)', // Default text
      'base-content-alt': 'oklch(35.961% 0.001 17.32)', // Default text

      primary: 'oklch(45% 0.24 277.023)',
      'primary-content': 'oklch(88% 0 0)',

      secondary: 'oklch(72.06% 0.191 231.6)',
      'secondary-content': 'oklch(89.699% 0.022 355.095)',

      accent: 'oklch(56.273% 0.054 154.39)',
      'accent-content': 'oklch(100% 0 0)',

      neutral: 'oklch(24.155% 0.049 89.07)',
      'neutral-content': 'oklch(92.951% 0.002 17.197)',

      info: 'oklch(72.06% 0.191 231.6)',
      'info-content': 'oklch(0% 0 0)',
      'info-blend': 'oklch(72.06% 0.191 231.6 / 10%)',
      // Consider adding info-bg, info-border if needed

      success: 'oklch(0.82 0.0625 137.3)',
      'success-content': 'oklch(0% 0 0)',
      // Defines legitimate use Consider adding success-bg, success-border

      warning: 'oklch(0.78 0.168 66.2)',
      'warning-content': 'oklch(0% 0 0)',
      //Defines borderline use Consider adding warning-bg, warning-border

      error: 'oklch(0.69 0.2015 22.48)',
      'error-content': 'oklch(0% 0 0)',
      // Defines blatant use Consider adding error-bg, error-border

      // Define a default border color using base-300
      'border-color': 'oklch(79.938% 0.001 17.197)', // Updated to match new base-300
    },

    // --- Overriding Border Radius ---
    // Only these radius values will be available (rounded, rounded-lg, rounded-2xl)
    borderRadius: {
      DEFAULT: '0.25rem', // --radius-field (maps to .rounded)
      lg: '0.5rem',    // --radius-box (maps to .rounded-lg)
      '2xl': '1rem',     // --radius-selector (maps to .rounded-2xl)
      full: '9999px', // Keep full for circles
    },

    // --- Overriding Font Family ---
    // Using your existing font definitions as the only options
    fontFamily: {
      sans: ['Raleway', ...defaultTheme.fontFamily.sans],
      heading: ['Montserrat', 'sans-serif'],
      body: ['Raleway', 'sans-serif'],
      title: ['Titan One', 'sans-serif'],
    },

    extend: {
      // === Tactic Library Custom Gradients ===
      backgroundImage: {
        'tactic-card-gradient': 'linear-gradient(135deg, var(--tw-gradient-from, oklch(94.951% 0.002 17.197)) 0%, var(--tw-gradient-to, oklch(93.951% 0.002 17.197)) 100%)',
        'tactic-header-gradient': 'linear-gradient(90deg, oklch(45% 0.24 277.023 / 0.10) 0%, oklch(45% 0.24 277.023 / 0.05) 100%)',
        'tactic-header-fade': 'linear-gradient(90deg, oklch(45% 0.24 277.023 / 0.10) 0%, transparent 100%)',
        'tactic-section-gradient': 'linear-gradient(90deg, oklch(45% 0.24 277.023 / 0.10) 0%, oklch(45% 0.24 277.023 / 0.05) 100%)',
      },
      // === Tactic Library Muted Text ===
      textColor: {
        'tactic-muted': 'oklch(16.961% 0.001 17.32 / 0.7)',
        'tactic-muted-strong': 'oklch(16.961% 0.001 17.32 / 0.8)',
      },
      // === Tactic Library Soft Backgrounds ===
      backgroundColor: {
        'tactic-primary-5': 'oklch(45% 0.24 277.023 / 0.05)',
        'tactic-primary-10': 'oklch(45% 0.24 277.023 / 0.10)',
        'tactic-base-200-50': 'oklch(93.951% 0.002 17.197 / 0.5)',
        'tactic-base-100': 'oklch(94.951% 0.002 17.197)',
        'tactic-base-50': 'oklch(97% 0.002 17.197)',
      },
      // === Tactic Library Borders ===
      borderColor: {
        'tactic-primary-10': 'oklch(45% 0.24 277.023 / 0.10)',
        'tactic-base-300-50': 'oklch(90.938% 0.001 17.197 / 0.5)',
        'tactic-base-200-50': 'oklch(93.951% 0.002 17.197 / 0.5)',
      },
      // === Tactic Library Rings ===
      ringColor: {
        'tactic-primary-10': 'oklch(45% 0.24 277.023 / 0.10)',
        'tactic-primary-5': 'oklch(45% 0.24 277.023 / 0.05)',
      },
    },
  },
  plugins: [],
}