import {
  DeliveryStatus,
  PackageStatus,
} from "@features/packages/domain/package.enums";
import { buildUpdatedPackage } from "../buildUpdatedPackage";
import type { Package } from "@features/packages/domain/package.types";

const basePackage: Package = {
  id: 1,
  code: "PKG-001",
  status: PackageStatus.COLETADO,
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
      status: PackageStatus.EM_ROTA_DE_ENTREGA,
    });

    expect(result.status).toBe(
      PackageStatus.EM_ROTA_DE_ENTREGA,
    );
  });

  it("resets delivery status to pending", () => {
    const result = buildUpdatedPackage({
      packageData: basePackage,
      status: PackageStatus.EM_ROTA_DE_ENTREGA,
    });

    expect(result.deliveryStatus).toBe(
      DeliveryStatus.PENDING,
    );
  });

  it("clears sent_at", () => {
    const result = buildUpdatedPackage({
      packageData: basePackage,
      status: PackageStatus.EM_ROTA_DE_ENTREGA,
    });

    expect(result.sent_at).toBeUndefined();
  });

  it("keeps receiver name for delivered status", () => {
    const result = buildUpdatedPackage({
      packageData: basePackage,
      status: PackageStatus.ENTREGUE,
      receiverName: "John Doe",
    });

    expect(result.receiverName).toBe("John Doe");
  });

  it("trims receiver name", () => {
    const result = buildUpdatedPackage({
      packageData: basePackage,
      status: PackageStatus.ENTREGUE,
      receiverName: "  John Doe  ",
    });

    expect(result.receiverName).toBe("John Doe");
  });

  it("removes receiver name when status is not delivered", () => {
    const result = buildUpdatedPackage({
      packageData: basePackage,
      status: PackageStatus.COLETADO,
      receiverName: "John Doe",
    });

    expect(result.receiverName).toBeUndefined();
  });

  it("preserves unrelated package fields", () => {
    const result = buildUpdatedPackage({
      packageData: basePackage,
      status: PackageStatus.EM_ROTA_DE_ENTREGA,
    });

    expect(result.id).toBe(basePackage.id);
    expect(result.code).toBe(basePackage.code);
    expect(result.clientCode).toBe(basePackage.clientCode);
    expect(result.scanned_at).toBe(basePackage.scanned_at);
  });
});
