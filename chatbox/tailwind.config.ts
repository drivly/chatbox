import type { Config } from 'tailwindcss'
import { fontFamily } from 'tailwindcss/defaultTheme'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      boxShadow: {
        chatbox: '0 2px 6px 0 rgb(6 6 17 / 0.12)',
      },
      colors: {
        accent: {
          DEFAULT: '	#F1F5F9',
          foreground: '	#0F172A',
        },
        background: '#F8FAFD',
        badge: '#F3F4F6',
        border: {
          DEFAULT: '#CCCCD3',
          light: '#EFF2F7',
          vdp: '#EFF2F5',
        },
        checked: {
          DEFAULT: '#E5EBF0',
          dark: '#D8D8D8',
        },
        card: {
          DEFAULT: '#FFFFFF',
          border: '#F0F6FB',
          foreground: '#0F172A',
          hover: '#F0F6FB',
        },
        component: {
          divider: '#EDEDED',
        },
        destructive: {
          DEFAULT: '#FF0000',
          foreground: '#F8FAFC',
        },
        divider: {
          DEFAULT: '#D8D8D8',
          content: '#EFF2F5',
        },
        error: {
          text: '#643235',
          border: '#FFE0E1',
          bg: '#F7E9EA',
        },
        foreground: '#060611',
        gray: {
          100: '#F0F6FB',
          200: '#EDEDF2',
          300: '#D1D5DB',
          400: '#CCCCD4',
          500: '#ABABA4',
          600: '#717180',
          700: '#494956',
          800: '#35353E',
          900: '#09090A',
        },
        heart: '#D10335',
        icon: '#212A30',
        input: {
          DEFAULT: '#58667E',
          border: '#E5EBF0',
        },
        list: {
          hover: '#F7FAFC',
        },
        muted: {
          DEFAULT: '#F1F5F9',
          foreground: '#64748B',
        },
        normal: {
          text: '#171717',
          border: '	#F3F3F3',
        },
        popover: {
          DEFAULT: '#F5F5F5',
          hover: '#EDEDED',
          foreground: '#0F172A',
        },
        primary: {
          DEFAULT: '#060611',
          hover: '#F7FAFC',
          detail: '#16162A',
        },

        ring: '#94A3B8',
        secondary: {
          DEFAULT: '#425466',
          foreground: '#F1F5F9',
        },
        Stroke: {
          3: '#EDEDF3',
          2: '#E4E6E9',
        },
        success: {
          text: '#326458',
          border: '#d3fde5',
          bg: '#e9f7f4',
        },
      },
      fontFamily: {
        sans: ['var(--font-sans)', ...fontFamily.sans],
        IBM: [`var(--font-IBM_Plex_Sans)`, ...fontFamily.sans],
        Monty: [`var(--font-Montserrat)`, ...fontFamily.sans],
      },
    },
  },
  plugins: [],
}
export default config
