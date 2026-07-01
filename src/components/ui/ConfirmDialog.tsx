"use client";

import { Modal } from "./Modal";
import { Button } from "./Button";

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
  open, title, description, confirmLabel = "Confirmer", cancelLabel = "Annuler",
  destructive, onCancel, onConfirm,
}: Props) {
  return (
    <Modal
      open={open}
      onClose={onCancel}
      title={title}
      description={description}
      size="sm"
      footer={
        <>
          <Button variant="ghost" onClick={onCancel}>{cancelLabel}</Button>
          <Button
            variant={destructive ? "danger" : "primary"}
            onClick={onConfirm}
          >
            {confirmLabel}
          </Button>
        </>
      }
    >
      <div />
    </Modal>
  );
}
