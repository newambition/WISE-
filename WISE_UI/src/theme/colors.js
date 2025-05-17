// Import the tailwind config
const tailwindConfig = require('../../tailwind.config.js');

// Export the colors directly from the config
export const themeColors = tailwindConfig.theme.colors;

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