import { StyleSheet, View, type StyleProp, type TextStyle, type ViewStyle } from 'react-native';
import { spacing } from '@/theme';
import { AppText } from './AppText';

type SectionHeaderProps = {
  eyebrow: string;
  title: string;
  style?: StyleProp<ViewStyle>;
  eyebrowStyle?: StyleProp<TextStyle>;
  titleStyle?: StyleProp<TextStyle>;
};

export function SectionHeader({ eyebrow, title, style, eyebrowStyle, titleStyle }: SectionHeaderProps) {
  return (
    <View style={[styles.container, style]}>
      <AppText variant="eyebrow" style={eyebrowStyle}>{eyebrow}</AppText>
      <AppText variant="title" style={titleStyle}>{title}</AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: spacing.xs },
});
