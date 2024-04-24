import type { Config } from 'tailwindcss'
import { fontFamily } from 'tailwindcss/defaultTheme'

const config: Config = {
  prefix: 'drivly-',
  content: [
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-sans)', ...fontFamily.sans],
        IBM: [`var(--font-IBM_Plex_Sans)`, ...fontFamily.sans],
        Monty: [`var(--font-Montserrat)`, ...fontFamily.sans],
      },
    },
  },
  plugins: [],
  corePlugins: {
    preflight: false, // false to build library
  },
}
export default config
