import type { ComponentType } from "react";

export type MenuItemIconProps = {
  size?: number;
  color?: string;
  strokeWidth?: number;
};

export type MenuItemProps = {
  title: string;
  description?: string;
  icon: ComponentType<MenuItemIconProps>;
  onPress: () => void;
  destructive?: boolean;
  showChevron?: boolean;
  testID?: string;
  accessibilityLabel?: string;
};
