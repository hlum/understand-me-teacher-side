/** @type {import('tailwindcss').Config} */
export default {
	darkMode: "class",
	content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
	theme: {
		extend: {
			colors: {
				bg: "var(--color-bg)",
				"bg-secondary": "var(--color-bg-secondary)",
				text: "var(--color-text)",
				"text-secondary": "var(--color-text-secondary)",
				primary: "var(--color-primary)",
				"primary-hover": "var(--color-primary-hover)",
				accent: "var(--color-accent)",
			},
		},
	},
	plugins: [],
};
