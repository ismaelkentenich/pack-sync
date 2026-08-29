import { Package } from "./package.types";

export type PackageSyncResult = {
  success: boolean;
  status?: number;
  error?: string;
};

export interface PackageSyncGateway {
  send(pkg: Package): Promise<PackageSyncResult>;
}
