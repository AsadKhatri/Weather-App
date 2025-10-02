
import { Colors } from '@/constants/theme';

export function useThemeColor(
  colorName: keyof typeof Colors.light
) {
  return Colors.light[colorName];
}
