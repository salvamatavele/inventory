import { useState } from "react";
import { Button } from "./button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./dialog";
import { labels } from "@/config/labels";

interface ConfirmDeleteProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  loading?: boolean;
}

export function ConfirmDelete({
  isOpen,
  onClose,
  onConfirm,
  loading
}: ConfirmDeleteProps) {
  const [isLoading, setIsLoading] = useState(loading);

  const handleConfirm = async () => {
    try {
      setIsLoading(true);
      await onConfirm();
      onClose();
    } catch (error) {
      // Error will be handled by parent
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{labels.common.confirmDelete.title}</DialogTitle>
        </DialogHeader>
        <div className="pt-6 space-x-2 flex items-center justify-end w-full">
          <Button disabled={isLoading} variant="outline" onClick={onClose}>
            {labels.common.confirmDelete.cancel}
          </Button>
          <Button disabled={isLoading} variant="destructive" onClick={handleConfirm}>
            {isLoading ? labels.common.loading : labels.common.confirmDelete.confirm}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
