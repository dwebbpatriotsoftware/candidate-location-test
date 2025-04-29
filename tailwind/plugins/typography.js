// typography.js - Tailwind plugin for typography based on the design system
const plugin = require('tailwindcss/plugin');

// Font family definition from the design system
const fontFamily = {
  'sans': [
    '-apple-system', 
    'BlinkMacSystemFont', 
    '"Segoe UI"', 
    'Roboto', 
    'Helvetica', 
    'Arial', 
    'sans-serif', 
    '"Apple Color Emoji"', 
    '"Segoe UI Emoji"', 
    '"Segoe UI Symbol"'
  ],
  'mono': ['monospace']
};

// Font size definitions from the design system
const fontSize = {
  'largest': ['1.75rem', { lineHeight: '1.2' }],  // 28px
  'large': ['1.5rem', { lineHeight: '1.2' }],     // 24px
  'medium': ['1.125rem', { lineHeight: '1.3' }],  // 18px
  'normal': ['1rem', { lineHeight: '1.4' }],      // 16px
  'small': ['0.875rem', { lineHeight: '1.4' }],   // 14px
  'smallest': ['0.75rem', { lineHeight: '1.4' }], // 12px
};

// Font weight definitions
const fontWeight = {
  'normal': 400,
  'bold': 700
};

// Custom plugin to add design system typography utilities
const typographyPlugin = plugin(function({ addUtilities, theme }) {
  // Font size utilities
  const fontSizeUtilities = {
    '.font-size-largest': { 
      fontSize: theme('fontSize.largest[0]'),
      lineHeight: theme('fontSize.largest[1].lineHeight')
    },
    '.font-size-large': { 
      fontSize: theme('fontSize.large[0]'),
      lineHeight: theme('fontSize.large[1].lineHeight')
    },
    '.font-size-medium': { 
      fontSize: theme('fontSize.medium[0]'),
      lineHeight: theme('fontSize.medium[1].lineHeight')
    },
    '.font-size-normal': { 
      fontSize: theme('fontSize.normal[0]'),
      lineHeight: theme('fontSize.normal[1].lineHeight')
    },
    '.font-size-small': { 
      fontSize: theme('fontSize.small[0]'),
      lineHeight: theme('fontSize.small[1].lineHeight')
    },
    '.font-size-smallest': { 
      fontSize: theme('fontSize.smallest[0]'),
      lineHeight: theme('fontSize.smallest[1].lineHeight')
    },
  };

  // Font weight utilities
  const fontWeightUtilities = {
    '.font-normal': { fontWeight: theme('fontWeight.normal') },
    '.font-bold': { fontWeight: theme('fontWeight.bold') },
  };

  // Text formatting utilities
  const textFormattingUtilities = {
    '.uppercase': { textTransform: 'uppercase' },
    '.lowercase': { textTransform: 'lowercase' },
    '.nowrap': { whiteSpace: 'nowrap' },
    '.monospace': { fontFamily: 'monospace' },
    '.code-font': {
      backgroundColor: '#f5f2f0',
      fontFamily: 'monospace',
      fontWeight: 'normal',
      padding: '2px 5px',
      position: 'relative',
      borderRadius: '0.3em',
      color: '#c92c2c',
      border: '1px solid rgba(0, 0, 0, 0.1)',
      fontSize: '16px',
      whiteSpace: 'nowrap',
    },
    '.underlinedTitle': {
      borderBottom: '1px solid #ccc',
      paddingBottom: '0.5rem',
      marginBottom: '1rem',
      fontWeight: theme('fontWeight.bold'),
    },
  };

  // Heading styles
  const headingUtilities = {
    'h1': {
      fontSize: '2.625rem', // 42px
      fontWeight: '700',
      marginBottom: '0.5rem',
      lineHeight: '1.2',
    },
    'h2': {
      fontSize: '1.75rem', // 28px
      fontWeight: '400',
      marginBottom: '2rem',
      lineHeight: '1.2',
    },
    'h3': {
      fontSize: '1.25rem', // 20px
      fontWeight: '400',
      margin: '3rem 0 2rem',
      lineHeight: '1.3',
    },
    'h4': {
      fontSize: '1.125rem', // 18px
      fontWeight: '500',
      marginBottom: '1rem',
      lineHeight: '1.3',
    },
    'h5': {
      fontSize: '1rem', // 16px
      fontWeight: '600',
      marginBottom: '0.75rem',
      lineHeight: '1.4',
    },
    'h6': {
      fontSize: '0.875rem', // 14px
      fontWeight: '700',
      marginBottom: '0.5rem',
      lineHeight: '1.4',
    },
  };

  addUtilities({
    ...fontSizeUtilities,
    ...fontWeightUtilities,
    ...textFormattingUtilities,
  });
});

module.exports = {
  fontFamily,
  fontSize,
  fontWeight,
  plugin: typographyPlugin
};
