import type { Package } from "@features/packages/domain/package.types";

export type PackageCardProps = {
  item: Package;
  onPress?: () => void;
  showButtons?: boolean;
  onPressUpdate?: () => void;
  pressable?: boolean;
  testID?: string;
};
