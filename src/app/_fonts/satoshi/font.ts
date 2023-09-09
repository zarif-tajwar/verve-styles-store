import LocalFont from 'next/font/local';

const font = LocalFont({
  src: [
    { path: 'Satoshi-Regular.woff', weight: '400' },
    { path: 'Satoshi-Medium.woff', weight: '500' },
    { path: 'Satoshi-Bold.woff', weight: '700' },
  ],
  variable: '--font-satoshi',
});

export default font;
