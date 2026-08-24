import { ChevronRight } from "lucide-react-native";
import { Text, TouchableOpacity, View } from "react-native";
import Theme from "@theme/theme";
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
  const iconColor = destructive
    ? Theme.colors.error[500]
    : Theme.colors.primary[600];

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
          destructive && styles.destructiveIconContainer,
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
            destructive && styles.destructiveTitle,
          ]}
        >
          {title}
        </Text>

        {description ? (
          <Text style={styles.description}>
            {description}
          </Text>
        ) : null}
      </View>

      {showChevron ? (
        <ChevronRight
          size={Theme.sizing.icon.sm}
          color={Theme.colors.neutral[400]}
          strokeWidth={2}
        />
      ) : null}
    </TouchableOpacity>
  );
}
