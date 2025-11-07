import { RootStackParamList } from "./types";

export const Routes = Object.freeze({
  Login: "Login",
  Home: "Home",
  Scan: "Scan",
  PackagesList: "PackagesList",
} as const);

export type RouteName = keyof RootStackParamList;
