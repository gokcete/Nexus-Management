// const {
//   default: flattenColorPalette,
// } = require("tailwindcss/lib/util/flattenColorPalette");

// /** @type {import('tailwindcss').Config} */
// export default {
//   content: [
//     "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
//     "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
//     "./src/app/**/*.{js,ts,jsx,tsx,mdx}",

//     // Or if using `src` directory:
//     "./src/**/*.{js,ts,jsx,tsx,mdx}",
//   ],
//   // darkMode: "class",
//   theme: {
//     extend: {
//       backgroundImage: {
//         "hero-pattern": "url('/src/assets/bg.png')",
//         "hero-pattern1": "url('/src/assets/bg1.png')",
//       },
//     },
//   },
//   plugins: [require("daisyui"), addVariablesForColors],
// };
// // This plugin adds each Tailwind color as a global CSS variable, e.g. var(--gray-200).
// function addVariablesForColors({ addBase, theme }: any) {
//   let allColors = flattenColorPalette(theme("colors"));
//   let newVars = Object.fromEntries(
//     Object.entries(allColors).map(([key, val]) => [`--${key}`, val])
//   );

//   addBase({
//     ":root": newVars,
//   });
// }

const colors = require("tailwindcss/colors");
const {
  default: flattenColorPalette,
} = require("tailwindcss/lib/util/flattenColorPalette");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    // Merge content paths from both configurations
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{ts,tsx}",
  ],
  darkMode: "class", // Enable dark mode in class-based way

  theme: {
    extend: {
      // Extend the background image settings from the first file
      backgroundImage: {
        "hero-pattern": "url('/src/assets/bg.png')",
        "hero-pattern1": "url('/src/assets/bg1.png')",
        "hero-pattern2": "url('/src/assets/bg2.png')",
        "hero-pattern3": "url('/src/assets/bg3.png')",
        "hero-pattern4": "url('/src/assets/bg4.png')",
      },
      // Add more theme settings here if required from the third-party library
    },
  },

  plugins: [
    // Combine plugins from both configurations
    require("daisyui"),
    addVariablesForColors,
  ],
};

/**
 * This plugin adds each Tailwind color as a global CSS variable, e.g., var(--gray-200).
 * Keeping the plugin function from both configurations.
 */
function addVariablesForColors({ addBase, theme }: any) {
  let allColors = flattenColorPalette(theme("colors"));
  let newVars = Object.fromEntries(
    Object.entries(allColors).map(([key, val]) => [`--${key}`, val])
  );

  addBase({
    ":root": newVars,
  });
}
