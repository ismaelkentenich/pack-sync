import { useEffect } from "react";
import { View } from "react-native";
import Animated, {
  cancelAnimation,
  Easing,
  interpolate,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withDelay,
  withRepeat,
  withTiming,
} from "react-native-reanimated";
import { styles } from "./styles";
import { getCircleVariantConfig } from "./variants";
import type {
  AnimatedCircleBackgroundProps,
  AnimatedCircleConfig,
} from "./types";

function AnimatedCircle({
  config,
}: {
  config: AnimatedCircleConfig;
}) {
  const reducedMotion = useReducedMotion();

  const movement = useSharedValue(0);

  useEffect(() => {
    if (reducedMotion) {
      movement.value = 0;
      return;
    }

    movement.value = withDelay(
      config.delay ?? 0,
      withRepeat(
        withTiming(1, {
          duration: config.duration,
          easing: Easing.inOut(Easing.sin),
        }),
        -1,
        true,
      ),
    );

    return () => {
      cancelAnimation(movement);
    };
  }, [
    config.delay,
    config.duration,
    movement,
    reducedMotion,
  ]);

  const animatedStyle = useAnimatedStyle(() => {
    const translateX = interpolate(
      movement.value,
      [0, 1],
      [0, config.translateX],
    );

    const translateY = interpolate(
      movement.value,
      [0, 1],
      [0, config.translateY],
    );

    const scale = interpolate(
      movement.value,
      [0, 1],
      [config.scaleFrom ?? 1, config.scaleTo ?? 1.1],
    );

    return {
      transform: [
        { translateX },
        { translateY },
        { scale },
      ],
    };
  });

  return (
    <Animated.View
      testID={`animatedCircle-${config.id}`}
      style={[
        styles.circle,
        {
          width: config.size,
          height: config.size,
          borderRadius: config.size / 2,

          top: config.top,
          bottom: config.bottom,
          left: config.left,
          right: config.right,

          backgroundColor: config.color,
          opacity: config.opacity,
        },
        animatedStyle,
      ]}
    />
  );
}

export function AnimatedCircleBackground({
  variant = "default",
  circles,
  testID = "animatedCircleBackground",
}: AnimatedCircleBackgroundProps) {
  const resolvedCircles =
    circles ?? getCircleVariantConfig(variant);

  return (
    <View
      testID={testID}
      pointerEvents="none"
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      style={styles.container}
    >
      {resolvedCircles.map((circle) => (
        <AnimatedCircle key={circle.id} config={circle} />
      ))}
    </View>
  );
}
