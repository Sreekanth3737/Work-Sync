import { projectSchema } from "@/lib/schema";
import { ProjectStatus, type MemberProps } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import type { z } from "zod";
import { Modal } from "../customReusable/modal";
import { Form } from "../ui/form";
import { DynamicForm, type FormElement } from "../customReusable/dynamicForm";
import { Button } from "../ui/button";
import { INPUT_TYPES } from "@/lib/constants";
import { useCreateProject } from "@/hooks/use-project";
import { toast } from "sonner";

interface CreateProjectProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  workspaceId: string;
  workspaceMembers: MemberProps[];
}

export interface ProjectCreateInput {
  title: string;
  status: string;
  description?: string;
  startDate: string;
  dueDate: string;
  tags?: { tag: string; color: string }[];
  members?: { user: string; role: "manager" | "contributor" | "viewer" }[];
}

export type CreateProjectFormData = z.infer<typeof projectSchema>;

export const CreateProject = ({
  isOpen,
  onOpenChange,
  workspaceId,
  workspaceMembers,
}: CreateProjectProps) => {
  const form = useForm<CreateProjectFormData>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      title: "",
      description: "",
      dateGroup: { dueDate: "", startDate: "" },
      status: ProjectStatus.PLANNING,
      tags: [],
      members: [],
    },
  });
  const elements: FormElement<CreateProjectFormData>[] = [
    {
      name: "title",
      label: "Project Title",
      type: INPUT_TYPES.TEXT,
      placeholder: "workspace Name",
    },
    {
      name: "description",
      label: "Project Description",
      type: INPUT_TYPES.TEXTAREA,
      placeholder: "Describe your Project Description",
      rows: 3,
    },
    {
      name: "status",
      label: "Status",
      type: INPUT_TYPES.SELECT,
      options: Object.values(ProjectStatus).map((status) => ({
        label: status,
        value: status,
      })),
    },

    {
      name: "dateGroup",
      type: INPUT_TYPES.GROUP,
      elementContainerClassName: "grid grid-cols-2 gap-4",
      children: [
        {
          name: "dateGroup.startDate",
          label: "Start Date",
          type: INPUT_TYPES.DATE,
        },
        {
          name: "dateGroup.dueDate",
          label: "Due Date",
          type: INPUT_TYPES.DATE,
        },
      ],
    },
    {
      name: "tags",
      label: "Tags",
      type: INPUT_TYPES.TAG,
      placeholder: "Add Tags",
    },
    {
      name: "members",
      label: "Select Members",
      type: INPUT_TYPES.MULTISELECT_WITH_OPTIONS,
      options: workspaceMembers.map((m) => ({
        label: `${m?.user?.name} (${m?.role})`,
        value: m?.user?._id,
      })),
      subOptionKey: "role",
      subOptions: [
        { label: "Manager", value: "manager" },
        { label: "Contributor", value: "contributor" },
        { label: "Viewer", value: "viewer" },
      ],
      placeholder: "Select Members",
    },
  ];

  const { mutate, isPending } = useCreateProject();

  const onSubmit = (data: CreateProjectFormData) => {
    if (!workspaceId) return;

    const formattedData: ProjectCreateInput = {
      title: data.title,
      status: data.status,
      description: data.description,
      startDate: data.dateGroup.startDate,
      dueDate: data.dateGroup.dueDate,
      tags: data.tags,
      members: data.members?.map((m) => ({
        user: m.value,
        role: m.role,
      })),
    };
    mutate(
      {
        projectData: formattedData,
        workspaceId,
      },
      {
        onSuccess: () => {
          toast.success("Project created successfully");
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
  return (
    <Modal
      size="xl"
      open={isOpen}
      onOpenChange={onOpenChange}
      title="Create Project"
      description="Create a new project to get started"
      onCancel={() => {
        onOpenChange(false);
        form.reset();
      }}
      footer={
        <Button
          className="cursor-pointer"
          onClick={form.handleSubmit(onSubmit)}
          disabled={isPending}
        >
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
          containerClassName="space-y-6"
        />
      </Form>
    </Modal>
  );
};
