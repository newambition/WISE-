// Define theme colors using OKLCH values
export const themeColors = {
  // Base colors
  'base-100': 'oklch(94.951% 0.002 17.197)',
  'base-200': 'oklch(93.951% 0.002 17.197)',
  'base-300': 'oklch(90.938% 0.001 17.197)',
  'base-content': 'oklch(16.961% 0.001 17.32)',
  
  // Intent colors
  error: 'oklch(0.69 0.2015 22.48)',
  warning: 'oklch(0.78 0.168 66.2)',
  success: 'oklch(0.82 0.0625 137.3)',
  info: 'oklch(72.06% 0.191 231.6)',
};

// Export specific color mappings for charts
export const chartColors = {
  blatant: themeColors.error,
  borderline: themeColors.warning,
  legitimate: themeColors.success,
  baseContent: themeColors['base-content'],
  base300: themeColors['base-300'],
  info: themeColors.info,
  default: themeColors['base-300']
};

// Export intent color mapping
export const intentColorMap = {
  'Blatant Manipulation': themeColors.error,
  'Borderline Manipulation': themeColors.warning,
  'Legitimate Use': themeColors.success,
  'default': themeColors['base-300']
}; 