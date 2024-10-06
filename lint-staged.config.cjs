module.exports = {
  '*/**/*.{js,jsx,ts,tsx}': [
    () => 'tsc --noEmit',
    'prettier --write',
    'eslint',
  ],
  '*/**/*.{json,css,md}': ['prettier --write'],
};
