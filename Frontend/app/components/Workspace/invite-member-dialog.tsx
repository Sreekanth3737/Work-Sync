import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useInviteMemberMutation } from "@/hooks/use-workspace";
import { useState } from "react";
import { toast } from "sonner";
import { Switch } from "@/components/ui/switch";
import { Copy } from "lucide-react";

interface InviteMemberDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  workspaceId: string;
}

export const InviteMemberDialog = ({
  isOpen,
  onOpenChange,
  workspaceId,
}: InviteMemberDialogProps) => {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("member");
  const [sendLink, setSendLink] = useState(false);

  const { mutate: inviteMember, isPending } = useInviteMemberMutation();

  const inviteLink = `${window.location.origin}/workspace-invite/${workspaceId}?role=${role}`;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!sendLink) {
      if (!email.trim()) {
        toast.error("Email is required");
        return;
      }
      inviteMember(
        {
          email: email.trim(),
          role,
          workspaceId,
        },
        {
          onSuccess: () => {
            toast.success("Invitation sent successfully");
            setEmail("");
            setRole("member");
            onOpenChange(false);
          },
          onError: (error: any) => {
            toast.error(
              error.response?.data?.message || "Failed to send invitation"
            );
          },
        }
      );
    } else {
      // Send link mode
      toast.success("Invite link generated!");
      onOpenChange(false);
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(inviteLink);
      toast.success("Link copied to clipboard");
    } catch {
      toast.error("Failed to copy link");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Invite Member</DialogTitle>
          <DialogDescription>
            Invite via email or share a link to join your workspace.
          </DialogDescription>
        </DialogHeader>

        <div className="flex items-center justify-between mb-4">
          <Label>Send Link</Label>
          <Switch checked={sendLink} onCheckedChange={setSendLink} />
        </div>

        <form onSubmit={handleSubmit}>
          {!sendLink ? (
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="role">Role</Label>
                <Select value={role} onValueChange={setRole}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="member">Member</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="viewer">Viewer</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          ) : (
            <div className="grid gap-2 py-4">
              <Label>Invite Link</Label>
              <div className="flex items-center gap-2">
                <Input value={inviteLink} readOnly />
                <Button
                  type="button"
                  size="icon"
                  variant="outline"
                  onClick={handleCopy}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isPending && !sendLink}>
              {sendLink ? "Done" : isPending ? "Sending..." : "Send Invitation"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
