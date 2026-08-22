import { PackageSyncGateway } from "@features/packages/domain/package-sync.gateway";

export function createPackageSyncGatewayMock(): jest.Mocked<PackageSyncGateway> {
  return {
    send: jest.fn(),
  };
}
