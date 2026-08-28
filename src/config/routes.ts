export const Routes = {
  Login: "Login",
  SignUp: "SignUp",

  MainTabs: "MainTabs",

  Home: "Home",
  Scan: "Scan",
  Menu: "Menu",

  Packages: "Packages",
  PackagesList: "PackagesList",
  PackageDetails: "PackageDetails",
} as const;

export type RouteName =
  (typeof Routes)[keyof typeof Routes];
