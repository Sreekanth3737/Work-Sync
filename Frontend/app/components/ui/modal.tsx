import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from "./dialog";
import { Button } from "./button";

interface ModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  showCancelButton?: boolean;
  onCancel?: () => void;
  cancelLabel?: string;
}

export const Modal = ({
  open,
  onOpenChange,
  title,
  description,
  children,
  footer,
  showCancelButton = true,
  onCancel,
  cancelLabel = "Cancel",
}: ModalProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange} modal>
      <DialogContent className="max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>
        <div className="py-4 space-y-4">{children}</div>
        <DialogFooter className="flex gap-2 justify-end">
          {showCancelButton && (
            <Button variant="outline" onClick={onCancel}>
              {cancelLabel}
            </Button>
          )}
          {footer}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
