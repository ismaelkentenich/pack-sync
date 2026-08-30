import {
  DeliveryStatus,
  PackageStatus,
} from "@features/packages/domain/package.enums";
import { buildUpdatedPackage } from "../buildUpdatedPackage";
import type { Package } from "@features/packages/domain/package.types";

const basePackage: Package = {
  id: "1",
  code: "PKG-001",
  status: PackageStatus.COLLECTED,
  deliveryStatus: DeliveryStatus.SENT,
  clientCode: "user-1",
  receiverName: "Old Receiver",
  scanned_at: "2026-08-22T14:30:00.000Z",
  sent_at: "2026-08-22T15:00:00.000Z",
};

describe("buildUpdatedPackage", () => {
  it("updates the package status", () => {
    const result = buildUpdatedPackage({
      packageData: basePackage,
      status: PackageStatus.IN_DELIVERY,
    });

    expect(result.status).toBe(PackageStatus.IN_DELIVERY);
  });

  it("resets delivery status to pending", () => {
    const result = buildUpdatedPackage({
      packageData: basePackage,
      status: PackageStatus.IN_DELIVERY,
    });

    expect(result.deliveryStatus).toBe(
      DeliveryStatus.PENDING,
    );
  });

  it("clears sent_at", () => {
    const result = buildUpdatedPackage({
      packageData: basePackage,
      status: PackageStatus.IN_DELIVERY,
    });

    expect(result.sent_at).toBeUndefined();
  });

  it("keeps receiver name for delivered status", () => {
    const result = buildUpdatedPackage({
      packageData: basePackage,
      status: PackageStatus.DELIVERED,
      receiverName: "John Doe",
    });

    expect(result.receiverName).toBe("John Doe");
  });

  it("trims receiver name", () => {
    const result = buildUpdatedPackage({
      packageData: basePackage,
      status: PackageStatus.DELIVERED,
      receiverName: "  John Doe  ",
    });

    expect(result.receiverName).toBe("John Doe");
  });

  it("removes receiver name when status is not delivered", () => {
    const result = buildUpdatedPackage({
      packageData: basePackage,
      status: PackageStatus.COLLECTED,
      receiverName: "John Doe",
    });

    expect(result.receiverName).toBeUndefined();
  });

  it("preserves unrelated package fields", () => {
    const result = buildUpdatedPackage({
      packageData: basePackage,
      status: PackageStatus.IN_DELIVERY,
    });

    expect(result.id).toBe(basePackage.id);
    expect(result.code).toBe(basePackage.code);
    expect(result.clientCode).toBe(basePackage.clientCode);
    expect(result.scanned_at).toBe(basePackage.scanned_at);
  });
});
