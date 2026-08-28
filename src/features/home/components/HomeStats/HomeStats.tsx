import { Text, View } from "react-native";
import { useAppTheme } from "@theme/useAppTheme";
import { styles } from "./styles";
import { getStatColors } from "./utils/getStatColors";
import type { HomeStatItem, HomeStatsProps } from "./types";

function HomeStatCard({
  item,
  index,
}: {
  item: HomeStatItem;
  index: number;
}) {
  const { theme } = useAppTheme();
  const variant = item.variant ?? "neutral";

  const colors = getStatColors(variant, theme);

  return (
    <View
      testID={`homeStatCard-${index}`}
      style={[
        styles.card,
        {
          backgroundColor: colors.backgroundColor,
          borderColor: colors.borderColor,
        },
      ]}
      accessible
      accessibilityLabel={`${item.label}: ${item.value}`}
    >
      <Text
        testID={`homeStatValue-${index}`}
        style={[
          styles.value,
          {
            color: colors.valueColor,
          },
        ]}
      >
        {item.value}
      </Text>

      <Text
        testID={`homeStatLabel-${index}`}
        style={[
          styles.label,
          {
            color: colors.labelColor,
          },
        ]}
      >
        {item.label}
      </Text>
    </View>
  );
}

export function HomeStats({ items }: HomeStatsProps) {
  return (
    <View testID="homeStats" style={styles.container}>
      {items.map((item, index) => (
        <HomeStatCard
          key={`${item.label}-${index}`}
          item={item}
          index={index}
        />
      ))}
    </View>
  );
}
