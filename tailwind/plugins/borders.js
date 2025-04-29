// borders.js - Tailwind plugin for borders based on the design system
const plugin = require('tailwindcss/plugin');

// Border width values
const width = {
  '0': '0',
  '1': '1px',
  '2': '2px',
  '4': '4px',
};

// Border colors
const colors = {
  'default': '#CCCCCC',
  'light': '#EEEEEE',
};

// Border radius values
const radius = {
  'none': '0',
  'sm': '0.125rem',    // 2px
  'DEFAULT': '0.25rem', // 4px
  'md': '0.375rem',    // 6px
  'lg': '0.5rem',      // 8px
  'xl': '0.75rem',     // 12px
  '2xl': '1rem',       // 16px
  'full': '9999px',
};

// Custom plugin to add design system border utilities
const bordersPlugin = plugin(function({ addUtilities, theme }) {
  // Default border utilities
  const defaultBorderUtilities = {
    // All sides border
    '.border-1': { 
      borderWidth: theme('borderWidth.1'),
      borderStyle: 'solid',
      borderColor: theme('borderColor.default')
    },
    
    // Top border
    '.border-1-t': { 
      borderTopWidth: theme('borderWidth.1'),
      borderTopStyle: 'solid',
      borderTopColor: theme('borderColor.default')
    },
    
    // Right border
    '.border-1-r': { 
      borderRightWidth: theme('borderWidth.1'),
      borderRightStyle: 'solid',
      borderRightColor: theme('borderColor.default')
    },
    
    // Bottom border
    '.border-1-b': { 
      borderBottomWidth: theme('borderWidth.1'),
      borderBottomStyle: 'solid',
      borderBottomColor: theme('borderColor.default')
    },
    
    // Left border
    '.border-1-l': { 
      borderLeftWidth: theme('borderWidth.1'),
      borderLeftStyle: 'solid',
      borderLeftColor: theme('borderColor.default')
    },
  };

  // Light border utilities
  const lightBorderUtilities = {
    // All sides light border
    '.border-1-light': { 
      borderWidth: theme('borderWidth.1'),
      borderStyle: 'solid',
      borderColor: theme('borderColor.light')
    },
    
    // Top light border
    '.border-1-t-light': { 
      borderTopWidth: theme('borderWidth.1'),
      borderTopStyle: 'solid',
      borderTopColor: theme('borderColor.light')
    },
    
    // Right light border
    '.border-1-r-light': { 
      borderRightWidth: theme('borderWidth.1'),
      borderRightStyle: 'solid',
      borderRightColor: theme('borderColor.light')
    },
    
    // Bottom light border
    '.border-1-b-light': { 
      borderBottomWidth: theme('borderWidth.1'),
      borderBottomStyle: 'solid',
      borderBottomColor: theme('borderColor.light')
    },
    
    // Left light border
    '.border-1-l-light': { 
      borderLeftWidth: theme('borderWidth.1'),
      borderLeftStyle: 'solid',
      borderLeftColor: theme('borderColor.light')
    },
  };

  // Dashed border utilities
  const dashedBorderUtilities = {
    // All sides dashed border
    '.border-dashed': { 
      borderWidth: theme('borderWidth.1'),
      borderStyle: 'dashed',
      borderColor: theme('borderColor.default')
    },
    
    // Top dashed border
    '.border-dashed-t': { 
      borderTopWidth: theme('borderWidth.1'),
      borderTopStyle: 'dashed',
      borderTopColor: theme('borderColor.default')
    },
    
    // Right dashed border
    '.border-dashed-r': { 
      borderRightWidth: theme('borderWidth.1'),
      borderRightStyle: 'dashed',
      borderRightColor: theme('borderColor.default')
    },
    
    // Bottom dashed border
    '.border-dashed-b': { 
      borderBottomWidth: theme('borderWidth.1'),
      borderBottomStyle: 'dashed',
      borderBottomColor: theme('borderColor.default')
    },
    
    // Left dashed border
    '.border-dashed-l': { 
      borderLeftWidth: theme('borderWidth.1'),
      borderLeftStyle: 'dashed',
      borderLeftColor: theme('borderColor.default')
    },
  };

  // Border radius utilities
  const borderRadiusUtilities = {
    '.rounded-none': { borderRadius: theme('borderRadius.none') },
    '.rounded-sm': { borderRadius: theme('borderRadius.sm') },
    '.rounded': { borderRadius: theme('borderRadius.DEFAULT') },
    '.rounded-md': { borderRadius: theme('borderRadius.md') },
    '.rounded-lg': { borderRadius: theme('borderRadius.lg') },
    '.rounded-xl': { borderRadius: theme('borderRadius.xl') },
    '.rounded-2xl': { borderRadius: theme('borderRadius.2xl') },
    '.rounded-full': { borderRadius: theme('borderRadius.full') },
    
    // Individual corners
    '.rounded-t-none': { 
      borderTopLeftRadius: theme('borderRadius.none'),
      borderTopRightRadius: theme('borderRadius.none')
    },
    '.rounded-r-none': { 
      borderTopRightRadius: theme('borderRadius.none'),
      borderBottomRightRadius: theme('borderRadius.none')
    },
    '.rounded-b-none': { 
      borderBottomRightRadius: theme('borderRadius.none'),
      borderBottomLeftRadius: theme('borderRadius.none')
    },
    '.rounded-l-none': { 
      borderTopLeftRadius: theme('borderRadius.none'),
      borderBottomLeftRadius: theme('borderRadius.none')
    },
    
    '.rounded-t': { 
      borderTopLeftRadius: theme('borderRadius.DEFAULT'),
      borderTopRightRadius: theme('borderRadius.DEFAULT')
    },
    '.rounded-r': { 
      borderTopRightRadius: theme('borderRadius.DEFAULT'),
      borderBottomRightRadius: theme('borderRadius.DEFAULT')
    },
    '.rounded-b': { 
      borderBottomRightRadius: theme('borderRadius.DEFAULT'),
      borderBottomLeftRadius: theme('borderRadius.DEFAULT')
    },
    '.rounded-l': { 
      borderTopLeftRadius: theme('borderRadius.DEFAULT'),
      borderBottomLeftRadius: theme('borderRadius.DEFAULT')
    },
    
    '.rounded-t-lg': { 
      borderTopLeftRadius: theme('borderRadius.lg'),
      borderTopRightRadius: theme('borderRadius.lg')
    },
    '.rounded-r-lg': { 
      borderTopRightRadius: theme('borderRadius.lg'),
      borderBottomRightRadius: theme('borderRadius.lg')
    },
    '.rounded-b-lg': { 
      borderBottomRightRadius: theme('borderRadius.lg'),
      borderBottomLeftRadius: theme('borderRadius.lg')
    },
    '.rounded-l-lg': { 
      borderTopLeftRadius: theme('borderRadius.lg'),
      borderBottomLeftRadius: theme('borderRadius.lg')
    },
  };

  addUtilities({
    ...defaultBorderUtilities,
    ...lightBorderUtilities,
    ...dashedBorderUtilities,
    ...borderRadiusUtilities,
  });
});

module.exports = {
  width,
  colors,
  radius,
  plugin: bordersPlugin
};
