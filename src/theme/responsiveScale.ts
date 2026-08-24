import { Dimensions, PixelRatio } from "react-native";

const BASE_WIDTH = 390;
const BASE_HEIGHT = 844;

const MIN_SCALE = 0.85;
const MAX_SCALE = 1.2;

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function getWindowDimensions() {
  return Dimensions.get("window");
}

export function horizontalScale(size: number): number {
  const { width } = getWindowDimensions();

  const scale = clamp(
    width / BASE_WIDTH,
    MIN_SCALE,
    MAX_SCALE,
  );

  return PixelRatio.roundToNearestPixel(size * scale);
}

export function verticalScale(size: number): number {
  const { height } = getWindowDimensions();

  const scale = clamp(
    height / BASE_HEIGHT,
    MIN_SCALE,
    MAX_SCALE,
  );

  return PixelRatio.roundToNearestPixel(size * scale);
}

export function moderateScale(
  size: number,
  factor = 0.5,
): number {
  const scaled = horizontalScale(size);

  return PixelRatio.roundToNearestPixel(
    size + (scaled - size) * factor,
  );
}
