import type { Package } from "@features/packages/domain/package.types";

export type PackageCardProps = {
  item: Package;
  onPress?: () => void;
  showButtons?: boolean;
  onPressUpdate?: () => void;
  showRemoveButton?: boolean;
  onPressRemove?: () => void;
  pressable?: boolean;
  testID?: string;
};
