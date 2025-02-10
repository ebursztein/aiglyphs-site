/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
	theme: {
		extend: {},
	},
	plugins: [require('daisyui')],
	daisyui: {
    	themes: ["cupcake", "dark"],
    	darkTheme: "dark", // name of one of the included themes for dark mode
    	base: true, // applies background color and foreground color for root element by default
		styled: true, // include daisyUI colors and design decisions for all components
    	utils: true, // adds responsive and modifier utility classes
		primary: "#0891b2", // cyan-600
        secondary: "#a855f7", // purple-500
    	prefix: "", // prefix for daisyUI classnames (components, modifiers and responsive class names. Not colors)
    	logs: true, // Shows info about daisyUI version and used config in the console when building your CSS
    	themeRoot: ":root", // The element that receives theme color CSS variables
  },
}
