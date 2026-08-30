import { ArrowRight } from "lucide-react-native";
import { Text, View } from "react-native";
import { Card } from "@components/primitives/Card";
import { useAppTheme } from "@theme/useAppTheme";
import { styles } from "./styles";
import { getHomeActionCardColors } from "./utils/getHomeActionCardColors";
import { getHomeActionCardSizeStyles } from "./utils/getHomeActionCardSizeStyles";
import type { HomeActionCardProps } from "./types";

export function HomeActionCard({
  testID = "homeActionCard",
  title,
  description,
  actionLabel,
  icon: Icon,
  variant = "default",
  size = "md",
  orientation = "horizontal",
  showArrow = true,
  showDecoration,
  disabled = false,
  onPress,
  style,
  iconContainerStyle,
  contentStyle,
  titleStyle,
  descriptionStyle,
  actionStyle,
  actionTextStyle,
}: HomeActionCardProps) {
  const { theme } = useAppTheme();
  const colors = getHomeActionCardColors(variant, theme);

  const sizeStyles = getHomeActionCardSizeStyles(size);

  const shouldShowDecoration =
    showDecoration ?? variant === "hero";

  const isVertical = orientation === "vertical";

  return (
    <Card
      testID={testID}
      onPress={onPress}
      disabled={disabled}
      style={[
        styles.card,

        isVertical ? styles.vertical : styles.horizontal,

        sizeStyles.container,

        {
          backgroundColor: colors.backgroundColor,
          borderColor: colors.borderColor,
        },

        style,
      ]}
    >
      {shouldShowDecoration ? (
        <View
          testID={`${testID}Decoration`}
          pointerEvents="none"
          style={styles.decoration}
        >
          <View style={styles.decorationLarge} />

          <View style={styles.decorationSmall} />
        </View>
      ) : null}

      {Icon ? (
        <View
          testID={`${testID}IconContainer`}
          style={[
            styles.iconContainer,

            sizeStyles.iconContainer,

            {
              backgroundColor: colors.iconBackgroundColor,
            },

            iconContainerStyle,
          ]}
        >
          <Icon
            testID={`${testID}Icon`}
            size={sizeStyles.iconSize}
            color={colors.iconColor}
          />
        </View>
      ) : null}

      <View
        testID={`${testID}Content`}
        style={[styles.content, contentStyle]}
      >
        <Text
          testID={`${testID}Title`}
          style={[
            styles.title,
            sizeStyles.title,
            {
              color: colors.titleColor,
            },
            titleStyle,
          ]}
        >
          {title}
        </Text>

        {description ? (
          <Text
            testID={`${testID}Description`}
            style={[
              styles.description,
              sizeStyles.description,
              {
                color: colors.descriptionColor,
              },
              descriptionStyle,
            ]}
          >
            {description}
          </Text>
        ) : null}

        {actionLabel ? (
          <View
            testID={`${testID}Action`}
            style={[styles.action, actionStyle]}
          >
            <Text
              testID={`${testID}ActionText`}
              style={[
                styles.actionText,
                {
                  color: colors.actionColor,
                },
                actionTextStyle,
              ]}
            >
              {actionLabel}
            </Text>

            <ArrowRight
              testID={`${testID}ActionArrow`}
              size={sizeStyles.arrowSize}
              color={colors.arrowColor}
            />
          </View>
        ) : null}
      </View>

      {!actionLabel && showArrow ? (
        <View style={styles.arrowContainer}>
          <ArrowRight
            testID={`${testID}Arrow`}
            size={sizeStyles.arrowSize}
            color={colors.arrowColor}
          />
        </View>
      ) : null}
    </Card>
  );
}
