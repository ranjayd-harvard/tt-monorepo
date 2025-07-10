
const config = require('@repo/config/tailwind');

module.exports = {
  ...config,
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    '../../packages/ui/src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
};
