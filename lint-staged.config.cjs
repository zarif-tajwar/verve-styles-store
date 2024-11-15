module.exports = {
  '*/**/*.{js,jsx,ts,tsx}': ['prettier --write', 'eslint'],
  '*/**/*.{json,css,md}': ['prettier --write'],
};
