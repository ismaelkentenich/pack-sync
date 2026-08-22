import { Package } from "./package.types";

export type PackageSyncResult = {
  success: boolean;
};

export interface PackageSyncGateway {
  send(pkg: Package): Promise<PackageSyncResult>;
}
