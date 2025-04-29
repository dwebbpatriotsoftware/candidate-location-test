// colors.js - Tailwind plugin for colors based on the design system
const plugin = require('tailwindcss/plugin');

// Color values extracted from the design system
const values = {
  // Gray scale
  'gray-0': '#FFFFFF',
  'gray-100': '#F7F7F7',
  'gray-200': '#EEEEEE',
  'gray-400': '#CCCCCC',
  'gray-500': '#949494',
  'gray-600': '#888888',
  'gray-700': '#555555',
  'gray-800': '#333333',
  'gray-900': '#000000',
  'table-0': '#F9FAFB',
  'table-50': '#E5E7EB',
  'table-600': '#6B7280',

  // Notifications
  'notification-alert-500': '#C53030',
  'notification-attention-50': '#FFFAF0',
  'notification-attention-300': '#F6AD55',
  'notification-error-50': '#FFF5F5',
  'notification-pending-50': '#EBF8FF',
  'notification-pending-500': '#4299E1',
  'notification-success-50': '#E6FFFA',
  'notification-success-600': '#14807E',
  'notification-tip-50': '#FFFFF0',
  'notification-tip-700': '#e3b400',

  // Primary / Brand Specific
  'primary-50': '#F8F3FD',
  'primary-100': '#E1C3FF',
  'primary-300': '#FFFFFF',
  'primary-500': '#8430D9',
  'primary-800': '#600DB1',
  'primary-900': '#4E0593',
  'primary-950': '#3B0073',
  'accent-800': '#4610C1',
  'accent-900': '#270082',

  // Status
  'status-1-light': '#eff9fe',
  'status-1-primary': '#5ec0f8',
  'status-2-light': '#f3faf3',
  'status-2-primary': '#88D18A',
  'status-3-light': '#eff5ea',
  'status-3-primary': '#5b9b30',
  'status-4-light': '#fff5ee',
  'status-4-primary': '#ff9b54',
  'status-5-light': '#fceeeb',
  'status-5-primary': '#e55934',
  'status-6-light': '#f2ecfa',
  'status-6-primary': '#7D40CF',
  'status-7-light': '#f8f8f8',
  'status-7-primary': '#bbbbbb',

  // User feedback
  'bad-dark': '#ad0014',
  'bad-light': '#f2dddc',
  'good-light-50': '#E2F3D7',
  'good-dark-700': '#148260',

  // Simplified aliases for common use
  'white': '#FFFFFF',
  'black': '#000000',
  'primary': '#8430D9',
  'primary-light': '#F8F3FD',
  'accent': '#4610C1',
  'dark-accent': '#270082',
  'light-gray': '#949494',
  'medium-gray': '#888888',
  'dark-gray': '#555555',
  'alert': '#C53030',
  'alert-light': '#FFF5F5',
  'attention': '#F6AD55',
  'attention-light': '#FFFAF0',
  'confirm': '#14807E',
  'confirm-light': '#E6FFFA',
  'hint': '#8e44ad',
  'hint-light': '#F2ECFA',
  'completed': '#5b9b30',
  'pending': '#4299E1',
  'total': '#333333',
  'total-light': '#F7F7F7',
};

// Custom plugin to add design system color utilities
const colorPlugin = plugin(function({ addUtilities, theme }) {
  // Background color utilities
  const backgroundUtilities = Object.entries(theme('colors')).reduce((acc, [key, value]) => {
    if (typeof value === 'string') {
      acc[`.bg-${key}`] = { backgroundColor: value };
    }
    return acc;
  }, {});

  // Text color utilities
  const textUtilities = Object.entries(theme('colors')).reduce((acc, [key, value]) => {
    if (typeof value === 'string') {
      acc[`.color-${key}`] = { color: value };
    }
    return acc;
  }, {});

  // Special background classes from the design system
  const specialBackgroundUtilities = {
    '.bg-white': { backgroundColor: values['gray-0'] },
    '.bg-1': { backgroundColor: values['gray-100'] },
    '.bg-2': { backgroundColor: values['gray-200'] },
    '.bg-3': { backgroundColor: values['gray-400'] },
    '.bg-light-gray': { backgroundColor: values['gray-500'] },
    '.bg-medium-gray': { backgroundColor: values['gray-600'] },
    '.bg-dark-gray': { backgroundColor: values['gray-700'] },
    '.bg-alert': { backgroundColor: values['alert'] },
    '.bg-alert-light': { backgroundColor: values['alert-light'] },
    '.bg-attention-light': { backgroundColor: values['attention-light'] },
    '.bg-confirm-light': { backgroundColor: values['confirm-light'] },
    '.bg-hint-light': { backgroundColor: values['hint-light'] },
    '.bg-pending': { backgroundColor: values['pending'] },
    '.bg-total': { backgroundColor: values['total'] },
    '.bg-total-light': { backgroundColor: values['total-light'] },
    '.bg-gradient-primary': { 
      backgroundImage: `linear-gradient(to right, ${values['primary']}, ${values['primary-800']})` 
    },
    '.bg-gradient-completed': { 
      backgroundImage: `linear-gradient(to right, ${values['completed']}, ${values['status-3-primary']})` 
    },
  };

  // Special text color classes from the design system
  const specialTextUtilities = {
    '.color-white': { color: values['gray-0'] },
    '.color-black': { color: values['gray-900'] },
    '.color-light-gray': { color: values['gray-500'] },
    '.color-medium-gray': { color: values['gray-600'] },
    '.color-dark-gray': { color: values['gray-700'] },
    '.color-action': { color: values['primary'] },
    '.color-primary': { color: values['primary'] },
    '.color-accent': { color: values['accent'] },
    '.color-dark-accent': { color: values['dark-accent'] },
    '.color-confirm': { color: values['confirm'] },
    '.color-alert': { color: values['alert'] },
    '.color-attention': { color: values['attention'] },
    '.color-hint': { color: values['hint'] },
    '.color-completed': { color: values['completed'] },
    '.color-pending': { color: values['pending'] },
    '.color-light-primary': { color: values['primary-100'] },
  };

  addUtilities({
    ...backgroundUtilities,
    ...textUtilities,
    ...specialBackgroundUtilities,
    ...specialTextUtilities
  });
});

module.exports = {
  values,
  plugin: colorPlugin
};
