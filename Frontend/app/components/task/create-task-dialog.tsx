import { useCreateTaskMutation } from "@/hooks/use-task";
import { createTaskSchema } from "@/lib/schema";
import { INPUT_TYPES } from "@/lib/constants";
import type { ProjectMemberRole, User } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type { z } from "zod";
import { Button } from "../ui/button";
import { Form } from "../ui/form";
import { Modal } from "../customReusable/modal";
import { DynamicForm, type FormElement } from "../customReusable/dynamicForm";

interface CreateTaskDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projectId: string;
  projectMembers: { user: User; role: ProjectMemberRole }[];
}

export type CreateTaskFormData = z.infer<typeof createTaskSchema>;

export const CreateTaskDialog = ({
  open,
  onOpenChange,
  projectId,
  projectMembers,
}: CreateTaskDialogProps) => {
  const form = useForm<CreateTaskFormData>({
    resolver: zodResolver(createTaskSchema),
    defaultValues: {
      title: "",
      description: "",
      status: "To Do",
      priority: "Medium",
      dueDate: "",
      assignees: [],
    },
  });

  const { mutate, isPending } = useCreateTaskMutation();

  const onSubmit = (values: CreateTaskFormData) => {
    mutate(
      {
        projectId,
        taskData: values,
      },
      {
        onSuccess: () => {
          toast.success("Task created successfully");
          form.reset();
          onOpenChange(false);
        },
        onError: (error: any) => {
          const errorMessage = error.response.data.message;
          toast.error(errorMessage);
          console.log(error);
        },
      }
    );
  };

  const handleCancel = () => {
    form.reset();
    onOpenChange(false);
  };

  // Convert project members to options format for multiselect
  const assigneeOptions = projectMembers.map((member) => ({
    label: member.user.name,
    value: member.user._id,
  }));

  // Define form elements using the FormElement interface
  const formElements: FormElement<CreateTaskFormData>[] = [
    {
      name: "title",
      label: "Title",
      type: INPUT_TYPES.TEXT,
      placeholder: "Enter task title",
    },
    {
      name: "description",
      label: "Description",
      type: INPUT_TYPES.TEXTAREA,
      placeholder: "Enter task description",
      rows: 3,
    },
    {
      name: "status",
      label: "Status",
      type: INPUT_TYPES.SELECT,
      placeholder: "Select status",
      options: [
        { label: "To Do", value: "To Do" },
        { label: "In Progress", value: "In Progress" },
        { label: "Done", value: "Done" },
      ],
    },
    {
      name: "priority",
      label: "Priority",
      type: INPUT_TYPES.SELECT,
      placeholder: "Select priority",
      options: [
        { label: "Low", value: "Low" },
        { label: "Medium", value: "Medium" },
        { label: "High", value: "High" },
      ],
    },
    {
      name: "dueDate",
      label: "Due Date",
      type: INPUT_TYPES.DATE,
      placeholder: "Pick a date",
    },
    {
      name: "assignees",
      label: "Assignees",
      type: INPUT_TYPES.MULTISELECT_WITH_OPTIONS,
      placeholder: "Select assignees",
      options: assigneeOptions,
      simpleValues: true,
    },
  ];

  const modalFooter = (
    <Button
      type="button"
      onClick={() => form.handleSubmit(onSubmit)()}
      disabled={isPending}
    >
      {isPending ? "Creating..." : "Create Task"}
    </Button>
  );

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title="Create Task"
      description="Create a new task for your project"
      onCancel={handleCancel}
      footer={modalFooter}
      size="lg"
    >
      <Form {...form}>
        <DynamicForm
          form={form}
          elements={formElements}
          onSubmit={onSubmit}
          hideSubmitButton={true}
          isPending={isPending}
          containerClassName="space-y-6"
        />
      </Form>
    </Modal>
  );
};
