// spacing.js - Tailwind plugin for spacing based on the design system
const plugin = require('tailwindcss/plugin');

// Spacing values extracted from the design system
// The design system uses a scale from 0 to 8
const values = {
  '0': '0',
  '1': '0.25rem',  // 4px
  '2': '0.5rem',   // 8px
  '3': '0.75rem',  // 12px
  '4': '1rem',     // 16px
  '5': '1.5rem',   // 24px
  '6': '2rem',     // 32px
  '7': '3rem',     // 48px
  '8': '4rem',     // 64px
};

// Custom plugin to add design system spacing utilities
const spacingPlugin = plugin(function({ addUtilities, theme }) {
  // Padding utilities
  const paddingUtilities = {
    // All sides padding
    '.p-0': { padding: theme('spacing.0') },
    '.p-1': { padding: theme('spacing.1') },
    '.p-2': { padding: theme('spacing.2') },
    '.p-3': { padding: theme('spacing.3') },
    '.p-4': { padding: theme('spacing.4') },
    '.p-5': { padding: theme('spacing.5') },
    '.p-6': { padding: theme('spacing.6') },
    '.p-7': { padding: theme('spacing.7') },
    '.p-8': { padding: theme('spacing.8') },

    // Padding top
    '.pt-0': { paddingTop: theme('spacing.0') },
    '.pt-1': { paddingTop: theme('spacing.1') },
    '.pt-2': { paddingTop: theme('spacing.2') },
    '.pt-3': { paddingTop: theme('spacing.3') },
    '.pt-4': { paddingTop: theme('spacing.4') },
    '.pt-5': { paddingTop: theme('spacing.5') },
    '.pt-6': { paddingTop: theme('spacing.6') },
    '.pt-7': { paddingTop: theme('spacing.7') },
    '.pt-8': { paddingTop: theme('spacing.8') },

    // Padding right
    '.pr-0': { paddingRight: theme('spacing.0') },
    '.pr-1': { paddingRight: theme('spacing.1') },
    '.pr-2': { paddingRight: theme('spacing.2') },
    '.pr-3': { paddingRight: theme('spacing.3') },
    '.pr-4': { paddingRight: theme('spacing.4') },
    '.pr-5': { paddingRight: theme('spacing.5') },
    '.pr-6': { paddingRight: theme('spacing.6') },
    '.pr-7': { paddingRight: theme('spacing.7') },
    '.pr-8': { paddingRight: theme('spacing.8') },

    // Padding bottom
    '.pb-0': { paddingBottom: theme('spacing.0') },
    '.pb-1': { paddingBottom: theme('spacing.1') },
    '.pb-2': { paddingBottom: theme('spacing.2') },
    '.pb-3': { paddingBottom: theme('spacing.3') },
    '.pb-4': { paddingBottom: theme('spacing.4') },
    '.pb-5': { paddingBottom: theme('spacing.5') },
    '.pb-6': { paddingBottom: theme('spacing.6') },
    '.pb-7': { paddingBottom: theme('spacing.7') },
    '.pb-8': { paddingBottom: theme('spacing.8') },

    // Padding left
    '.pl-0': { paddingLeft: theme('spacing.0') },
    '.pl-1': { paddingLeft: theme('spacing.1') },
    '.pl-2': { paddingLeft: theme('spacing.2') },
    '.pl-3': { paddingLeft: theme('spacing.3') },
    '.pl-4': { paddingLeft: theme('spacing.4') },
    '.pl-5': { paddingLeft: theme('spacing.5') },
    '.pl-6': { paddingLeft: theme('spacing.6') },
    '.pl-7': { paddingLeft: theme('spacing.7') },
    '.pl-8': { paddingLeft: theme('spacing.8') },

    // Padding horizontal (left and right)
    '.px-0': { paddingLeft: theme('spacing.0'), paddingRight: theme('spacing.0') },
    '.px-1': { paddingLeft: theme('spacing.1'), paddingRight: theme('spacing.1') },
    '.px-2': { paddingLeft: theme('spacing.2'), paddingRight: theme('spacing.2') },
    '.px-3': { paddingLeft: theme('spacing.3'), paddingRight: theme('spacing.3') },
    '.px-4': { paddingLeft: theme('spacing.4'), paddingRight: theme('spacing.4') },
    '.px-5': { paddingLeft: theme('spacing.5'), paddingRight: theme('spacing.5') },
    '.px-6': { paddingLeft: theme('spacing.6'), paddingRight: theme('spacing.6') },
    '.px-7': { paddingLeft: theme('spacing.7'), paddingRight: theme('spacing.7') },
    '.px-8': { paddingLeft: theme('spacing.8'), paddingRight: theme('spacing.8') },

    // Padding vertical (top and bottom)
    '.py-0': { paddingTop: theme('spacing.0'), paddingBottom: theme('spacing.0') },
    '.py-1': { paddingTop: theme('spacing.1'), paddingBottom: theme('spacing.1') },
    '.py-2': { paddingTop: theme('spacing.2'), paddingBottom: theme('spacing.2') },
    '.py-3': { paddingTop: theme('spacing.3'), paddingBottom: theme('spacing.3') },
    '.py-4': { paddingTop: theme('spacing.4'), paddingBottom: theme('spacing.4') },
    '.py-5': { paddingTop: theme('spacing.5'), paddingBottom: theme('spacing.5') },
    '.py-6': { paddingTop: theme('spacing.6'), paddingBottom: theme('spacing.6') },
    '.py-7': { paddingTop: theme('spacing.7'), paddingBottom: theme('spacing.7') },
    '.py-8': { paddingTop: theme('spacing.8'), paddingBottom: theme('spacing.8') },
  };

  // Margin utilities
  const marginUtilities = {
    // All sides margin
    '.m-0': { margin: theme('spacing.0') },
    '.m-1': { margin: theme('spacing.1') },
    '.m-2': { margin: theme('spacing.2') },
    '.m-3': { margin: theme('spacing.3') },
    '.m-4': { margin: theme('spacing.4') },
    '.m-5': { margin: theme('spacing.5') },
    '.m-6': { margin: theme('spacing.6') },
    '.m-7': { margin: theme('spacing.7') },
    '.m-8': { margin: theme('spacing.8') },

    // Margin top
    '.mt-0': { marginTop: theme('spacing.0') },
    '.mt-1': { marginTop: theme('spacing.1') },
    '.mt-2': { marginTop: theme('spacing.2') },
    '.mt-3': { marginTop: theme('spacing.3') },
    '.mt-4': { marginTop: theme('spacing.4') },
    '.mt-5': { marginTop: theme('spacing.5') },
    '.mt-6': { marginTop: theme('spacing.6') },
    '.mt-7': { marginTop: theme('spacing.7') },
    '.mt-8': { marginTop: theme('spacing.8') },

    // Margin right
    '.mr-0': { marginRight: theme('spacing.0') },
    '.mr-1': { marginRight: theme('spacing.1') },
    '.mr-2': { marginRight: theme('spacing.2') },
    '.mr-3': { marginRight: theme('spacing.3') },
    '.mr-4': { marginRight: theme('spacing.4') },
    '.mr-5': { marginRight: theme('spacing.5') },
    '.mr-6': { marginRight: theme('spacing.6') },
    '.mr-7': { marginRight: theme('spacing.7') },
    '.mr-8': { marginRight: theme('spacing.8') },

    // Margin bottom
    '.mb-0': { marginBottom: theme('spacing.0') },
    '.mb-1': { marginBottom: theme('spacing.1') },
    '.mb-2': { marginBottom: theme('spacing.2') },
    '.mb-3': { marginBottom: theme('spacing.3') },
    '.mb-4': { marginBottom: theme('spacing.4') },
    '.mb-5': { marginBottom: theme('spacing.5') },
    '.mb-6': { marginBottom: theme('spacing.6') },
    '.mb-7': { marginBottom: theme('spacing.7') },
    '.mb-8': { marginBottom: theme('spacing.8') },

    // Margin left
    '.ml-0': { marginLeft: theme('spacing.0') },
    '.ml-1': { marginLeft: theme('spacing.1') },
    '.ml-2': { marginLeft: theme('spacing.2') },
    '.ml-3': { marginLeft: theme('spacing.3') },
    '.ml-4': { marginLeft: theme('spacing.4') },
    '.ml-5': { marginLeft: theme('spacing.5') },
    '.ml-6': { marginLeft: theme('spacing.6') },
    '.ml-7': { marginLeft: theme('spacing.7') },
    '.ml-8': { marginLeft: theme('spacing.8') },

    // Margin horizontal (left and right)
    '.mx-0': { marginLeft: theme('spacing.0'), marginRight: theme('spacing.0') },
    '.mx-1': { marginLeft: theme('spacing.1'), marginRight: theme('spacing.1') },
    '.mx-2': { marginLeft: theme('spacing.2'), marginRight: theme('spacing.2') },
    '.mx-3': { marginLeft: theme('spacing.3'), marginRight: theme('spacing.3') },
    '.mx-4': { marginLeft: theme('spacing.4'), marginRight: theme('spacing.4') },
    '.mx-5': { marginLeft: theme('spacing.5'), marginRight: theme('spacing.5') },
    '.mx-6': { marginLeft: theme('spacing.6'), marginRight: theme('spacing.6') },
    '.mx-7': { marginLeft: theme('spacing.7'), marginRight: theme('spacing.7') },
    '.mx-8': { marginLeft: theme('spacing.8'), marginRight: theme('spacing.8') },
    '.mx-auto': { marginLeft: 'auto', marginRight: 'auto' },

    // Margin vertical (top and bottom)
    '.my-0': { marginTop: theme('spacing.0'), marginBottom: theme('spacing.0') },
    '.my-1': { marginTop: theme('spacing.1'), marginBottom: theme('spacing.1') },
    '.my-2': { marginTop: theme('spacing.2'), marginBottom: theme('spacing.2') },
    '.my-3': { marginTop: theme('spacing.3'), marginBottom: theme('spacing.3') },
    '.my-4': { marginTop: theme('spacing.4'), marginBottom: theme('spacing.4') },
    '.my-5': { marginTop: theme('spacing.5'), marginBottom: theme('spacing.5') },
    '.my-6': { marginTop: theme('spacing.6'), marginBottom: theme('spacing.6') },
    '.my-7': { marginTop: theme('spacing.7'), marginBottom: theme('spacing.7') },
    '.my-8': { marginTop: theme('spacing.8'), marginBottom: theme('spacing.8') },
  };

  // Space between utilities
  const spaceBetweenUtilities = {
    '.space-y-0 > :not([hidden]) ~ :not([hidden])': {
      '--tw-space-y-reverse': '0',
      'marginTop': 'calc(0px * calc(1 - var(--tw-space-y-reverse)))',
      'marginBottom': 'calc(0px * var(--tw-space-y-reverse))',
    },
    '.space-y-1 > :not([hidden]) ~ :not([hidden])': {
      '--tw-space-y-reverse': '0',
      'marginTop': `calc(${theme('spacing.1')} * calc(1 - var(--tw-space-y-reverse)))`,
      'marginBottom': `calc(${theme('spacing.1')} * var(--tw-space-y-reverse))`,
    },
    '.space-y-2 > :not([hidden]) ~ :not([hidden])': {
      '--tw-space-y-reverse': '0',
      'marginTop': `calc(${theme('spacing.2')} * calc(1 - var(--tw-space-y-reverse)))`,
      'marginBottom': `calc(${theme('spacing.2')} * var(--tw-space-y-reverse))`,
    },
    '.space-y-4 > :not([hidden]) ~ :not([hidden])': {
      '--tw-space-y-reverse': '0',
      'marginTop': `calc(${theme('spacing.4')} * calc(1 - var(--tw-space-y-reverse)))`,
      'marginBottom': `calc(${theme('spacing.4')} * var(--tw-space-y-reverse))`,
    },
    '.space-y-6 > :not([hidden]) ~ :not([hidden])': {
      '--tw-space-y-reverse': '0',
      'marginTop': `calc(${theme('spacing.6')} * calc(1 - var(--tw-space-y-reverse)))`,
      'marginBottom': `calc(${theme('spacing.6')} * var(--tw-space-y-reverse))`,
    },
    '.space-y-8 > :not([hidden]) ~ :not([hidden])': {
      '--tw-space-y-reverse': '0',
      'marginTop': `calc(${theme('spacing.8')} * calc(1 - var(--tw-space-y-reverse)))`,
      'marginBottom': `calc(${theme('spacing.8')} * var(--tw-space-y-reverse))`,
    },
    '.space-x-0 > :not([hidden]) ~ :not([hidden])': {
      '--tw-space-x-reverse': '0',
      'marginRight': 'calc(0px * var(--tw-space-x-reverse))',
      'marginLeft': 'calc(0px * calc(1 - var(--tw-space-x-reverse)))',
    },
    '.space-x-1 > :not([hidden]) ~ :not([hidden])': {
      '--tw-space-x-reverse': '0',
      'marginRight': `calc(${theme('spacing.1')} * var(--tw-space-x-reverse))`,
      'marginLeft': `calc(${theme('spacing.1')} * calc(1 - var(--tw-space-x-reverse)))`,
    },
    '.space-x-2 > :not([hidden]) ~ :not([hidden])': {
      '--tw-space-x-reverse': '0',
      'marginRight': `calc(${theme('spacing.2')} * var(--tw-space-x-reverse))`,
      'marginLeft': `calc(${theme('spacing.2')} * calc(1 - var(--tw-space-x-reverse)))`,
    },
    '.space-x-4 > :not([hidden]) ~ :not([hidden])': {
      '--tw-space-x-reverse': '0',
      'marginRight': `calc(${theme('spacing.4')} * var(--tw-space-x-reverse))`,
      'marginLeft': `calc(${theme('spacing.4')} * calc(1 - var(--tw-space-x-reverse)))`,
    },
    '.space-x-6 > :not([hidden]) ~ :not([hidden])': {
      '--tw-space-x-reverse': '0',
      'marginRight': `calc(${theme('spacing.6')} * var(--tw-space-x-reverse))`,
      'marginLeft': `calc(${theme('spacing.6')} * calc(1 - var(--tw-space-x-reverse)))`,
    },
    '.space-x-8 > :not([hidden]) ~ :not([hidden])': {
      '--tw-space-x-reverse': '0',
      'marginRight': `calc(${theme('spacing.8')} * var(--tw-space-x-reverse))`,
      'marginLeft': `calc(${theme('spacing.8')} * calc(1 - var(--tw-space-x-reverse)))`,
    },
  };

  addUtilities({
    ...paddingUtilities,
    ...marginUtilities,
    ...spaceBetweenUtilities,
  });
});

module.exports = {
  values,
  plugin: spacingPlugin
};
