import type { Config } from 'tailwindcss'

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
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      boxShadow: {
        chatbox: '0 2px 6px 0 rgb(6 6 17 / 0.12)',
      },
      colors: {
        dark: {
          100: '#060611',
          200: '#16162A',
          300: '#35353E',
          400: '#494956',
          500: '#717180',
        },
        light: {
          100: '#ABABA4',
          200: `#E2E2E7`,
          300: `#E4E6E9`,
          400: `#EDEDF2`,
          500: `#EDEDF3`,
          600: '#F7FAFC',
          700: '#F8FAFC',
        },
        accent: {
          DEFAULT: '#F1F5F9',
          green: '#00CAB9',
        },
        background: {
          DEFAULT: '#F8FAFD',
          100: '#F3F4F6',
          200: '#F0F6FB',
        },
        destructive: '#FF0000',

        error: {
          bg: 'rgb(var(--error-bg))',
          border: 'rgb(var(--error-border))',
          text: 'rgb(var(--error-text))',
        },
        heart: '#D10335',
        normal: {
          text: 'rgb(var(--normal-text))',
          border: 'rgb(var(--normal-border))',
        },
        success: {
          bg: 'rgb(var(--success-bg))',
          text: 'rgb(var(--success-text))',
          border: 'rgb(var(--success-border))',
        },

        // need to figure out
        // undetermined colors
        border: {
          DEFAULT: '#CCCCD3',
          light: '#EFF2F7',
        },
        divider: {
          DEFAULT: '#D8D8D8',
          content: '#EFF2F5',
        },
        grey: {
          300: '#D1D5DB',
          400: '#CCCCD4',
          900: '#09090A',
        },
        input: {
          DEFAULT: '#58667E',
          border: '#E5EBF0',
        },
        muted: {
          foreground: '#64748B',
        },
        popover: {
          DEFAULT: '#F5F5F5',
          hover: '#EDEDED',
        },
        ring: '#94A3B8',
        secondary: '#425466',
      },
    },
  },
  plugins: [],
}
export default config
