import { workspaceSchema } from "@/lib/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import type { z } from "zod";
import { Button } from "../ui/button";
import { Form } from "../ui/form";
import { DynamicForm, type FormElement } from "../customReusable/dynamicForm";
import { Modal } from "../customReusable/modal";
import { INPUT_TYPES } from "@/lib/constants";
import { useCreateWorkspace } from "@/hooks/use-workspace";
import { toast } from "sonner";
import { useNavigate } from "react-router";

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

export type WorkspaceForm = z.infer<typeof workspaceSchema>;

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
    elementContainerClassName: "flex gap-3 flex-wrap",
  },
];

export const CreateWorkspace = ({
  isCreatingWorkspace,
  setIsCreatingWorkspace,
}: CreateWorkspaceProps) => {
  const navigate = useNavigate();
  const { mutate, isPending } = useCreateWorkspace();

  const form = useForm<WorkspaceForm>({
    resolver: zodResolver(workspaceSchema),
    defaultValues: {
      name: "",
      description: "",
      color: COLOR_OPTIONS[0],
    },
  });

  const onSubmit = (data: WorkspaceForm) => {
    mutate(data, {
      onSuccess: (data: any) => {
        form.reset();
        setIsCreatingWorkspace(false);
        toast.success("Workspace created successfully");
        navigate(`/workspaces/${data._id}`);
      },
      onError: (error: any) => {
        const errorMessage = error.response?.data?.message;
        toast.error(errorMessage);
        console.log(error);
      },
    });
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
          containerClassName="space-y-4 py-4"
        />
      </Form>
    </Modal>
  );
};
