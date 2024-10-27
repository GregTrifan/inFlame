/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}", "./utils/**/*.{js,ts,jsx,tsx}"],
  plugins: [require("daisyui")],
  darkTheme: "light",
  darkMode: ["selector", "[data-theme='dark']"],
  // DaisyUI theme colors
  daisyui: {
    themes: [
      {
        light: {
          primary: "#FFFFFF",
          "primary-content": "#000000",
          secondary: "#F0F0F0",
          "secondary-content": "#000000",
          accent: "#00f58c", // Neon green
          "accent-content": "#000000",
          neutral: "#000000",
          "neutral-content": "#FFFFFF",
          "base-100": "#FFFFFF",
          "base-200": "#F7F7F7",
          "base-300": "#E5E5E5",
          "base-content": "#000000",
          info: "#85A2FF", // Light blue
          success: "#34D399", // Soft green
          warning: "#FBBF24", // Amber
          error: "#FB7185", // Soft red

          "--rounded-btn": "0.5rem", // Slightly rounded buttons

          ".tooltip": {
            "--tooltip-tail": "4px",
          },
          ".link": {
            textUnderlineOffset: "2px",
            color: "var(--accent)",
          },
          ".link:hover": {
            opacity: "75%",
          },
        },
      },
    ],
  },
  theme: {
    extend: {
      boxShadow: {
        center: "0 0 12px -2px rgba(0, 0, 0, 0.08)", // subtle shadow for elegance
      },
      animation: {
        "pulse-fast": "pulse 0.8s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
    },
  },
};
