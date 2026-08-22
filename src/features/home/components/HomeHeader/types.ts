export type HomeHeaderProps = {
  greeting: string;
  email?: string;
  logoutAccessibilityLabel: string;
  onLogout: () => void | Promise<void>;
};
