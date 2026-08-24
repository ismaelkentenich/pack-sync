import {
  DeliveryStatus,
  PackageStatus,
} from "./package.enums";

export type Package = {
  id?: string;
  code: string;
  status: PackageStatus;
  deliveryStatus: DeliveryStatus;
  clientCode: string;
  scanned_at: string;
  sent_at?: string;
  receiverName?: string;
};
