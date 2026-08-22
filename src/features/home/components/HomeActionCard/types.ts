import type { LucideIcon } from "lucide-react-native";

export type HomeActionCardVariant = "hero" | "secondary";

export type HomeActionCardProps = {
  testID: string;
  title: string;
  description: string;
  actionLabel?: string;
  icon: LucideIcon;
  variant?: HomeActionCardVariant;
  onPress: () => void;
};
