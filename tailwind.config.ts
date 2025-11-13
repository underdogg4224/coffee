import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        coffee: {
          50: '#f8f6f4',
          100: '#e8e1d8',
          200: '#d4c4b0',
          300: '#bfa688',
          400: '#a6876a',
          500: '#8b6f47',
          600: '#6f5839',
          700: '#54422c',
          800: '#3a2d1f',
          900: '#221a12',
        },
      },
    },
  },
  plugins: [],
}
export default config
