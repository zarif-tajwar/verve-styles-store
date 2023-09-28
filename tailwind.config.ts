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
