import { LogOut, User } from "lucide-react-native";
import { Text, TouchableOpacity, View } from "react-native";
import Theme from "@theme/theme";
import { styles } from "./styles";
import type { HomeHeaderProps } from "./types";

export function HomeHeader({
  greeting,
  email,
  logoutAccessibilityLabel,
  onLogout,
}: HomeHeaderProps) {
  return (
    <View testID="homeHeader" style={styles.container}>
      <View style={styles.userContainer}>
        <View
          testID="homeUserAvatar"
          style={styles.userAvatar}
        >
          <User
            testID="homeUserIcon"
            size={Theme.sizing.icon.sm}
            color={Theme.colors.neutral[50]}
          />
        </View>

        <View
          testID="homeHeaderUserContent"
          style={styles.userContent}
        >
          <Text
            testID="homeGreeting"
            style={styles.greeting}
          >
            {greeting}
          </Text>

          <Text
            testID="homeUserEmail"
            style={styles.email}
            numberOfLines={1}
          >
            {email ?? ""}
          </Text>
        </View>
      </View>

      <TouchableOpacity
        testID="homeLogoutButton"
        accessibilityRole="button"
        accessibilityLabel={logoutAccessibilityLabel}
        onPress={onLogout}
        style={styles.logoutButton}
      >
        <LogOut
          testID="homeLogoutIcon"
          size={Theme.sizing.icon.sm}
          color={Theme.colors.primary[800]}
        />
      </TouchableOpacity>
    </View>
  );
}
