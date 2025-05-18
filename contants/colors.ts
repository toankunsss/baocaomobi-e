// d:/appclother/contants/colors.ts
export const lightColors = {
  background: '#FFFFFF',
  text: '#222222',
  primary: '#EB3030',
  secondary: '#F83758',
  card: '#FAFBFC',
  border: '#E0E0E0',
  icon: '#000000',
};

export const darkColors = {
  background: '#18191A',
  text: '#F5F5F5',
  primary: '#EB3030',
  secondary: '#F83758',
  card: '#23272F',
  border: '#33383B',
  icon: '#FFFFFF',
};

export type ColorScheme = 'light' | 'dark';

export const getColors = (scheme: ColorScheme) =>
  scheme === 'dark' ? darkColors : lightColors;
