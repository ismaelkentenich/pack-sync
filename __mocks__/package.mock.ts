import {
  DeliveryStatus,
  PackageStatus,
} from "@features/packages/domain/package.enums";
import { Package } from "@features/packages/domain/package.types";

export const MOCK_PACKAGES: Package[] = [
  {
    id: "mock-001",
    code: "BR123456789BR",
    clientCode: "mock-user",
    status: PackageStatus.COLLECTED,
    deliveryStatus: DeliveryStatus.PENDING,
    receiverName: null,
    scanned_at: "2026-08-24T08:30:00.000Z",
    sent_at: null,
  },
  {
    id: "mock-002",
    code: "BR987654321BR",
    clientCode: "mock-user",
    status: PackageStatus.IN_DELIVERY,
    deliveryStatus: DeliveryStatus.PENDING,
    receiverName: null,
    scanned_at: "2026-08-24T09:15:00.000Z",
    sent_at: null,
  },
  {
    id: "mock-003",
    code: "BR456789123BR",
    clientCode: "mock-user",
    status: PackageStatus.DELIVERED,
    deliveryStatus: DeliveryStatus.SENT,
    receiverName: "João da Silva",
    scanned_at: "2026-08-24T10:20:00.000Z",
    sent_at: "2026-08-24T11:05:00.000Z",
  },
  {
    id: "mock-004",
    code: "BR123456789012345678901234567890BR",
    clientCode: "mock-user",
    status: PackageStatus.DELIVERED,
    deliveryStatus: DeliveryStatus.PENDING,
    receiverName:
      "João da Silva Oliveira dos Santos Almeida",
    scanned_at: "2026-08-23T18:45:00.000Z",
    sent_at: null,
  },
];
