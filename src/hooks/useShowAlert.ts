import { create } from "zustand";

type AlertType = "success" | "error" | "info";

type ShowAlertState = {
  visible: boolean;
  message: string;
  type: AlertType;
  show: (message: string, type?: AlertType) => void;
  hide: () => void;
};

export const useShowAlert = create<ShowAlertState>((set) => ({
  visible: false,
  message: "",
  type: "info",
  show: (message, type = "info") => set({ visible: true, message, type }),
  hide: () => set({ visible: false, message: "" }),
}));
