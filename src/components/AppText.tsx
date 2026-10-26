import { Text, type TextProps, type TextStyle } from 'react-native';
import { colors, fonts } from '@/theme';

type Variant = 'eyebrow' | 'title' | 'heading' | 'body' | 'small' | 'button';

const variants: Record<Variant, TextStyle> = {
  eyebrow: { fontFamily: fonts.semibold, fontSize: 11, letterSpacing: 1.6, color: colors.primary, textTransform: 'uppercase' },
  title: { fontFamily: fonts.bold, fontSize: 26, lineHeight: 34, color: colors.navy },
  heading: { fontFamily: fonts.semibold, fontSize: 17, lineHeight: 24, color: colors.navy },
  body: { fontFamily: fonts.regular, fontSize: 14, lineHeight: 22, color: colors.ink },
  small: { fontFamily: fonts.regular, fontSize: 12, lineHeight: 18, color: colors.muted },
  button: { fontFamily: fonts.semibold, fontSize: 14, color: colors.white },
};

export function AppText({ variant = 'body', style, ...rest }: TextProps & { variant?: Variant }) {
  return <Text {...rest} style={[variants[variant], style]} />;
}
