import {
  DeliveryStatus,
  PackageStatus,
} from "@features/packages/domain/package.enums";
import { Package } from "@features/packages/domain/package.types";

export const mockPackages: Package[] = [
  {
    id: "1",
    code: "PKG-000001",
    clientCode: "CLI-123",
    status: PackageStatus.COLLECTED,
    deliveryStatus: DeliveryStatus.PENDING,
    scanned_at: new Date().toISOString(),
  },
  {
    id: "2",
    code: "PKG-000002",
    clientCode: "CLI-456",
    status: PackageStatus.IN_DELIVERY,
    deliveryStatus: DeliveryStatus.PENDING,
    scanned_at: new Date().toISOString(),
  },
  {
    id: "3",
    code: "PKG-000003",
    clientCode: "CLI-789",
    status: PackageStatus.DELIVERED,
    deliveryStatus: DeliveryStatus.SENT,
    scanned_at: new Date().toISOString(),
    sent_at: new Date().toISOString(),
    receiverName: "João Silva",
  },
];
