export type HomeStatVariant =
  "neutral" | "success" | "warning";

export type HomeStatItem = {
  label: string;
  value: number;
  variant?: HomeStatVariant;
};

export type HomeStatsProps = {
  items: HomeStatItem[];
};

export type StatColors = {
  backgroundColor: string;
  borderColor: string;
  valueColor: string;
  labelColor: string;
};
