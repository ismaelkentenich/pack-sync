import React from "react";
import { useTranslation } from "react-i18next";
import { useShowAlert } from "@store/useAlertStore";
import { CustomAlert } from "./CustomAlert";

export function GlobalAlert() {
  const { t } = useTranslation();

  const visible = useShowAlert((state) => state.visible);
  const message = useShowAlert((state) => state.message);
  const hide = useShowAlert((state) => state.hide);

  return (
    <CustomAlert
      visible={visible}
      message={message}
      onClose={hide}
      confirmText={t("common.ok")}
    />
  );
}
