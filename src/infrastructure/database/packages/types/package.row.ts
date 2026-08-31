export type PackageRow = {
  id: number | string;
  code: string;
  status: string;
  deliveryStatus: string;
  clientCode: string;
  scanned_at: string;
  sent_at?: string | null;
  receiverName?: string | null;
  syncVersion?: number | null;
};
