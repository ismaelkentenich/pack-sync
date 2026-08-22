import { ArrowRight, Package } from "lucide-react-native";
import { Text, View } from "react-native";
import { Card } from "@components/primitives/Card";
import Theme from "@theme/theme";
import { styles } from "./styles";
import type { HomeActionCardProps } from "./types";

export function HomeActionCard({
  testID,
  title,
  description,
  actionLabel,
  icon: Icon,
  variant = "secondary",
  onPress,
}: HomeActionCardProps) {
  if (variant === "hero") {
    return (
      <Card
        testID={testID}
        onPress={onPress}
        style={styles.heroCard}
      >
        <View
          pointerEvents="none"
          testID={`${testID}Decoration`}
          style={styles.heroDecoration}
        >
          <View style={styles.heroDecorationCircleLarge} />

          <View style={styles.heroDecorationCircleSmall} />

          <View style={styles.heroPackageIllustration}>
            <Package
              testID={`${testID}PackageIllustration`}
              size={Theme.sizing.icon.lg}
              color={Theme.colors.neutral[900]}
            />
          </View>
        </View>

        <View
          testID={`${testID}TopRow`}
          style={styles.heroTopRow}
        >
          <View
            testID={`${testID}IconContainer`}
            style={styles.heroIconContainer}
          >
            <Icon
              testID={`${testID}Icon`}
              size={Theme.sizing.icon.lg}
              color={Theme.colors.neutral[50]}
            />
          </View>
        </View>

        <View
          testID={`${testID}Content`}
          style={styles.heroContent}
        >
          <Text
            testID={`${testID}Title`}
            style={styles.heroTitle}
          >
            {title}
          </Text>

          <Text
            testID={`${testID}Description`}
            style={styles.heroDescription}
          >
            {description}
          </Text>
        </View>

        {actionLabel ? (
          <View
            testID={`${testID}Action`}
            style={styles.heroAction}
          >
            <Text
              testID={`${testID}ActionText`}
              style={styles.heroActionText}
            >
              {actionLabel}
            </Text>

            <ArrowRight
              testID={`${testID}ActionArrow`}
              size={Theme.sizing.icon.sm}
              color={Theme.colors.neutral[50]}
            />
          </View>
        ) : null}
      </Card>
    );
  }

  return (
    <Card
      testID={testID}
      onPress={onPress}
      style={styles.secondaryCard}
    >
      <View
        testID={`${testID}IconContainer`}
        style={styles.secondaryIconContainer}
      >
        <Icon
          testID={`${testID}Icon`}
          size={Theme.sizing.icon.md}
          color={Theme.colors.primary[600]}
        />
      </View>

      <View
        testID={`${testID}Content`}
        style={styles.secondaryContent}
      >
        <Text
          testID={`${testID}Title`}
          style={styles.secondaryTitle}
        >
          {title}
        </Text>

        <Text
          testID={`${testID}Description`}
          style={styles.secondaryDescription}
        >
          {description}
        </Text>
      </View>

      <View style={styles.secondaryArrowContainer}>
        <ArrowRight
          testID={`${testID}Arrow`}
          size={Theme.sizing.icon.sm}
          color={Theme.colors.primary[600]}
        />
      </View>
    </Card>
  );
}
