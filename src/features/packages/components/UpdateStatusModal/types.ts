import type { Package } from "@features/packages/domain/package.types";

export type UpdateStatusModalProps = {
  handleCloseModal: () => void;
  packageData: Package;
  userId: string;
};
