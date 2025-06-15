import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from "../ui/dialog";
import { Button } from "../ui/button";

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
  size?:
    | "xs"
    | "sm"
    | "md"
    | "lg"
    | "xl"
    | "2xl"
    | "3xl"
    | "4xl"
    | "5xl"
    | "full";
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
  size = "lg",
}: ModalProps) => {
  const sizeValues = {
    xs: "320px", // 20rem - Extra small
    sm: "384px", // 24rem - Small
    md: "512px", // 28rem - Medium (default)
    lg: "576px", // 32rem - Large
    xl: "672px", // 36rem - Extra large
    "2xl": "768px", // 42rem - 2X large
    "3xl": "896px", // 48rem - 3X large
    "4xl": "1024px", // 56rem - 4X large
    "5xl": "1152px", // 64rem - 5X large
    full: "95vw", // Almost full viewport width
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange} modal>
      <DialogContent
        className="max-h-[80vh] overflow-y-auto"
        style={{
          maxWidth: sizeValues[size],
          width: "100%",
        }}
      >
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>
        <div className="py-4 space-y-4">{children}</div>
        <DialogFooter className="flex gap-2 justify-end">
          {showCancelButton && (
            <Button
              className="cursor-pointer"
              variant="outline"
              onClick={onCancel}
            >
              {cancelLabel}
            </Button>
          )}
          {footer}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
