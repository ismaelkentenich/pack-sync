export type AnimatedCircleConfig = {
  id: string;
  size: number;
  top?: number;
  bottom?: number;
  left?: number;
  right?: number;
  color: string;
  opacity: number;
  translateX: number;
  translateY: number;
  duration: number;
  delay?: number;
  scaleFrom?: number;
  scaleTo?: number;
};

export type AnimatedCircleBackgroundProps = {
  circles?: AnimatedCircleConfig[];
  testID?: string;
};
