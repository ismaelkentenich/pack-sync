import {
  DeliveryStatus,
  PackageStatus,
} from "./package.enums";

export type Package = {
  id?: number;
  code: string;
  status: PackageStatus;
  deliveryStatus: DeliveryStatus;
  clientCode?: string;
  scanned_at: string;
  sent_at?: string;
  receiverName?: string;
};
