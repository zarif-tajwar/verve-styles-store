import type { Config } from 'tailwindcss';
import { fontFamily } from 'tailwindcss/defaultTheme';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/lib/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        'integral-cf': ['var(--font-integral-cf)', ...fontFamily.sans],
        'plus-jakarta-sans': [
          'var(--font-plus-jakarta-sans)',
          ...fontFamily.sans,
        ],
      },
      colors: {
        offwhite: '#F0F0F0',
        primary: {
          0: 'var(--primary-0)',
          50: 'var(--primary-50)',
          100: 'var(--primary-100)',
          200: 'var(--primary-200)',
          300: 'var(--primary-300)',
          400: 'var(--primary-400)',
          500: 'var(--primary-500)',
          600: 'var(--primary-600)',
          700: 'var(--primary-700)',
          800: 'var(--primary-800)',
          900: 'var(--primary-900)',
        },
      },
      screens: {
        container: '1304px',
      },
      borderRadius: {
        main: '1.25rem',
      },
    },
  },
};
export default config;
