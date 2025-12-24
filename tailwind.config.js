/** @type {import('tailwindcss').Config} */
const config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          "var(--font-nunito)",
          "var(--font-open-sans)",
          "var(--font-noto-sans-sc)",
          "var(--font-wqy-zenhei)",
          "var(--font-geist-sans)",
          "sans-serif",
        ],
        display: [
          "var(--font-quicksand)",
          "var(--font-nunito)",
          "var(--font-open-sans)",
          "var(--font-geist-sans)",
          "sans-serif",
        ],
      },
      colors: {
        kawaii: {
          bg: "#fff1f2",
          card: "#ffffff",
          text: "#4c1d95",
          pink: "#fb7185",
          pinkLight: "#fce7f3",
          purple: "#a78bfa",
          purpleLight: "#ede9fe",
          blue: "#60a5fa",
          mint: "#34d399",
          yellow: "#fbbf24",
        },
      },
      boxShadow: {
        soft: "0 10px 40px -10px rgba(251, 113, 133, 0.15)",
        pop: "0 4px 0px 0px rgba(0,0,0,0.1)",
        "pop-hover": "0 6px 0px 0px rgba(0,0,0,0.1)",
        card:
          "0 20px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.01)",
      },
      borderRadius: {
        32: "32px",
      },
    },
  },
};

export default config;
