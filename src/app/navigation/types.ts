import { Package } from "@services/database/packages/packages";

export type RootStackParamList = {
  Login: undefined;
  Home: undefined;
  Scan: undefined;
  PackagesList: undefined;
  PackageDetails: { pkg: Package };
};
