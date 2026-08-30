import { PackageRepository } from "@features/packages/domain/package.repository";

export function createPackageRepositoryMock(): jest.Mocked<PackageRepository> {
  return {
    findById: jest.fn(),
    findByCode: jest.fn(),
    findAllByUser: jest.fn(),
    findByDeliveryStatus: jest.fn(),
    create: jest.fn(),
    updateStatus: jest.fn(),
    markAsSent: jest.fn(),
    countByDeliveryStatus: jest.fn(),
    delete: jest.fn(),
    batchUpdateStatus: jest.fn(),
  };
}
