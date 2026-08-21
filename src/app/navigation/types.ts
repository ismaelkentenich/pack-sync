import { Package } from "@infrastructure/database/packages/packages";

export type RootStackParamList = {
  Login: undefined;
  Home: undefined;
  Scan: undefined;
  PackagesList: undefined;
  PackageDetails: { pkg: Package };
  SignUp: undefined;
};
