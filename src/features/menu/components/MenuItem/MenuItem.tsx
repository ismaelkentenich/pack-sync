import { ChevronRight } from "lucide-react-native";
import { Text, TouchableOpacity, View } from "react-native";
import Theme from "@theme/theme";
import { useAppTheme } from "@theme/useAppTheme";
import { styles } from "./styles";
import type { MenuItemProps } from "./types";

export function MenuItem({
  title,
  description,
  icon: Icon,
  onPress,
  destructive = false,
  showChevron = true,
  testID,
  accessibilityLabel,
}: MenuItemProps) {
  const { theme } = useAppTheme();

  const iconColor = destructive
    ? theme.colors.status.error.foreground
    : theme.colors.icon.brand;

  return (
    <TouchableOpacity
      testID={testID ?? "menuItem"}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? title}
      activeOpacity={0.72}
      onPress={onPress}
      style={styles.container}
    >
      <View
        style={[
          styles.iconContainer,
          {
            backgroundColor: destructive
              ? theme.colors.status.error.background
              : theme.colors.surface.subtle,
          },
        ]}
      >
        <Icon
          size={Theme.sizing.icon.md}
          color={iconColor}
          strokeWidth={2}
        />
      </View>

      <View style={styles.content}>
        <Text
          style={[
            styles.title,
            {
              color: destructive
                ? theme.colors.status.error.foreground
                : theme.colors.text.primary,
            },
          ]}
        >
          {title}
        </Text>

        {description ? (
          <Text
            style={[
              styles.description,
              { color: theme.colors.text.secondary },
            ]}
          >
            {description}
          </Text>
        ) : null}
      </View>

      {showChevron ? (
        <ChevronRight
          size={Theme.sizing.icon.sm}
          color={theme.colors.icon.secondary}
          strokeWidth={2}
        />
      ) : null}
    </TouchableOpacity>
  );
}
