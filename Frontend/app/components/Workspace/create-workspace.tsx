import { workspaceSchema } from "@/lib/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import type { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Button } from "../ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { cn } from "@/lib/utils";
import { DynamicForm, type FormElement } from "../ui/dynamicForm";
import { Modal } from "../ui/modal";
import { INPUT_TYPES } from "@/lib/constants";

interface CreateWorkspaceProps {
  isCreatingWorkspace: boolean;
  setIsCreatingWorkspace: (isCreatingWorkspace: boolean) => void;
}

export const COLOR_OPTIONS = [
  "#FF5733", // Red-Orange
  "#33C1FF", // Blue
  "#28A745", // Green
  "#FFC300", // Yellow
  "#8E44AD", // Purple
  "#E67E22", // Orange
  "#2ECC71", // Light Green
  "#34495E", // Navy
];

type WorkspaceForm = z.infer<typeof workspaceSchema>;

const elements: FormElement<WorkspaceForm>[] = [
  {
    name: "name",
    label: "Name",
    type: INPUT_TYPES.TEXT,
    placeholder: "Workspace Name",
  },
  {
    name: "description",
    label: "Description",
    type: INPUT_TYPES.TEXTAREA,
    placeholder: "Describe your workspace",
    rows: 3,
  },
  {
    name: "color",
    label: "Color",
    type: INPUT_TYPES.COLOR_PICKER,
    options: COLOR_OPTIONS.map((color) => ({
      label: color,
      value: color,
    })),
  },
];

export const CreateWorkspace = ({
  isCreatingWorkspace,
  setIsCreatingWorkspace,
}: CreateWorkspaceProps) => {
  const isPending = false;

  const form = useForm<WorkspaceForm>({
    resolver: zodResolver(workspaceSchema),
    defaultValues: {
      name: "",
      description: "",
      color: COLOR_OPTIONS[0],
    },
  });

  const onSubmit = (data: WorkspaceForm) => {
    console.log(data);
  };

  return (
    <Modal
      open={isCreatingWorkspace}
      onOpenChange={setIsCreatingWorkspace}
      title="Create Workspace"
      onCancel={() => setIsCreatingWorkspace(false)}
      footer={
        <Button onClick={form.handleSubmit(onSubmit)} disabled={isPending}>
          {isPending ? "Creating..." : "Create"}
        </Button>
      }
    >
      <Form {...form}>
        <DynamicForm
          form={form}
          elements={elements}
          onSubmit={onSubmit}
          isPending={isPending}
          hideSubmitButton
        />
      </Form>
    </Modal>
  );
};
