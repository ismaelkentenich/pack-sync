import { Package } from "@features/packages/domain/package.types";

export type RootStackParamList = {
  Login: undefined;
  Home: undefined;
  Scan: undefined;
  PackagesList: undefined;
  PackageDetails: { pkg: Package };
  SignUp: undefined;
};
