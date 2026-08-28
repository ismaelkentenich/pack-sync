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
import Theme from "@theme/theme";
import { styles } from "./styles";
import type {
  AnimatedCircleBackgroundProps,
  AnimatedCircleConfig,
} from "./types";

const DEFAULT_CIRCLES: AnimatedCircleConfig[] = [
  {
    id: "primary-large",
    size: 360,
    top: 70,
    left: -220,
    color: Theme.colors.primary[600],
    opacity: 0.18,
    translateX: 90,
    translateY: 60,
    duration: 11000,
    scaleFrom: 1,
    scaleTo: 1.14,
  },
  {
    id: "secondary-large",
    size: 280,
    top: 500,
    right: -130,
    color: Theme.colors.secondary[200],
    opacity: 0.35,
    translateX: -70,
    translateY: -100,
    duration: 14000,
    delay: 1000,
    scaleFrom: 0.95,
    scaleTo: 1.1,
  },
  {
    id: "primary-medium",
    size: 140,
    top: 300,
    right: -45,
    color: Theme.colors.primary[400],
    opacity: 0.2,
    translateX: -80,
    translateY: 70,
    duration: 9000,
    delay: 1800,
    scaleFrom: 0.9,
    scaleTo: 1.12,
  },
  {
    id: "secondary-medium",
    size: 120,
    top: 720,
    left: 30,
    color: Theme.colors.secondary[400],
    opacity: 0.2,
    translateX: 110,
    translateY: -80,
    duration: 12000,
    delay: 500,
    scaleFrom: 1,
    scaleTo: 1.18,
  },
  {
    id: "primary-small",
    size: 72,
    top: 180,
    right: 45,
    color: Theme.colors.primary[300],
    opacity: 0.24,
    translateX: -45,
    translateY: 80,
    duration: 8000,
    delay: 2200,
    scaleFrom: 0.9,
    scaleTo: 1.1,
  },
  {
    id: "secondary-small",
    size: 56,
    bottom: 100,
    right: 80,
    color: Theme.colors.secondary[300],
    opacity: 0.25,
    translateX: -60,
    translateY: -60,
    duration: 10000,
    delay: 3000,
    scaleFrom: 0.85,
    scaleTo: 1.15,
  },
];

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
  circles = DEFAULT_CIRCLES,
  testID = "animatedCircleBackground",
}: AnimatedCircleBackgroundProps) {
  return (
    <View
      testID={testID}
      pointerEvents="none"
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      style={styles.container}
    >
      {circles.map((circle) => (
        <AnimatedCircle key={circle.id} config={circle} />
      ))}
    </View>
  );
}
