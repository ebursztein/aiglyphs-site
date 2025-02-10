export interface IconProps {
  name: string;
  body: string;
  description: string;
  hasVariant: boolean;
  aiVariantBody?: string;
}

export interface IconColor {
  value: string;
  target: 'base' | 'ai';
}

export interface ThemeState {
  isDark: boolean;
  backgroundColor: string;
  iconColor: string;
}

export type ColorHistoryAction = {
  type: 'ADD' | 'UNDO' | 'REDO';
  color?: string;
};
