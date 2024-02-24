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
        geist: ['var(--font-geist-sans)', ...fontFamily.sans],
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
          900: 'var(--primary-900)',
        },
      },
      screens: {
        container: '90rem',
      },
      borderRadius: {
        main: '1.25rem',
      },
      boxShadow: {
        drop: '0px 0px 8px 0px rgba(0, 0, 0, 0.1)',
        'light-drop': '0px 0px 10px 0px rgba(0, 0, 0, 0.03)',
        ghosting:
          '5px 5px hsl(0,0%,0%), 10px 10px hsl(0,0%,20%), 15px 15px hsl(0,0%,40%), 20px 20px hsl(0,0%,60%), 25px 25px hsl(0,0%,80%)',
      },
      keyframes: {
        scaleFromTopRight: {
          from: { opacity: '0', transform: 'scale(0.8)' },
          to: { opacity: '1', transform: 'scale(1)' },
        },
        shrinkToTopRight: {
          from: { opacity: '1', transform: 'scale(1)' },
          to: { opacity: '0', transform: 'scale(0.8)' },
        },
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
      },
      animation: {
        scaleFromTopRightAnim:
          'scaleFromTopRight 200ms cubic-bezier(0.34, 1.56, 0.64, 1)',
        shrinkToTopRightAnim: 'shrinkToTopRight 100ms ease',
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
      transitionTimingFunction: {
        subtleSpring: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
      },
    },
  },
  plugins: [
    require('@tailwindcss/container-queries'),
    require('tailwindcss-animate'),
    require('tailwindcss-easing'),
  ],
};
export default config;
