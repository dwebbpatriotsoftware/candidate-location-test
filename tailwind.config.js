// tailwind.config.js
const colors = require('./tailwind/plugins/colors');
const typography = require('./tailwind/plugins/typography');
const spacing = require('./tailwind/plugins/spacing');
const borders = require('./tailwind/plugins/borders');

module.exports = {
  content: [
    './components/**/*.{js,vue,ts}',
    './layouts/**/*.vue',
    './pages/**/*.vue',
    './plugins/**/*.{js,ts}',
    './nuxt.config.{js,ts}',
    './app.vue',
  ],
  theme: {
    extend: {
      colors: colors.values,
      fontFamily: typography.fontFamily,
      fontSize: typography.fontSize,
      fontWeight: typography.fontWeight,
      spacing: spacing.values,
      borderWidth: borders.width,
      borderColor: borders.colors,
      borderRadius: borders.radius,
    },
  },
  plugins: [
    colors.plugin,
    typography.plugin,
    spacing.plugin,
    borders.plugin,
  ],
}
