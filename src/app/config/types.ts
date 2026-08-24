import { Routes } from "./routes";
import type { Package } from "@features/packages/domain/package.types";
import type { NavigatorScreenParams } from "@react-navigation/native";

export type PackagesStackParamList = {
  [Routes.PackagesList]: undefined;
  [Routes.PackageDetails]: {
    pkg: Package;
  };
};

export type MainTabParamList = {
  [Routes.Home]: undefined;
  [Routes.Scan]: undefined;
  [Routes.Packages]:
    | NavigatorScreenParams<PackagesStackParamList>
    | undefined;
};

export type RootStackParamList = {
  [Routes.MainTabs]: NavigatorScreenParams<MainTabParamList>;
};

export type AuthStackParamList = {
  [Routes.Login]: undefined;
  [Routes.SignUp]: undefined;
};
