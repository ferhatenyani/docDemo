"use client";

import { Modal } from "./Modal";
import { Button } from "./Button";
import { useT } from "@/lib/i18n";

interface Props {
  open: boolean;
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  destructive?: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

export function ConfirmDialog({
  open, title, description, confirmLabel, cancelLabel,
  destructive, onCancel, onConfirm,
}: Props) {
  const t = useT();
  const confirm = confirmLabel ?? t("confirm");
  const cancel = cancelLabel ?? t("cancel");
  return (
    <Modal
      open={open}
      onClose={onCancel}
      title={title}
      description={description}
      size="sm"
      footer={
        <>
          <Button variant="ghost" onClick={onCancel}>{cancel}</Button>
          <Button
            variant={destructive ? "danger" : "primary"}
            onClick={onConfirm}
          >
            {confirm}
          </Button>
        </>
      }
    >
      <div />
    </Modal>
  );
}
