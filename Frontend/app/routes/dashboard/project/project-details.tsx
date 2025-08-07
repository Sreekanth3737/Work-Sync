import { BackButton } from "@/components/customReusable/back-button";
import { Loader } from "@/components/customReusable/loader";
import { CreateTaskDialog } from "@/components/task/create-task-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useProjectQuery } from "@/hooks/use-project";
import { useUpdateTaskStatusMutation } from "@/hooks/use-task";
import { getProjectProgress } from "@/lib";
import { cn } from "@/lib/utils";
import type { Project, Task, TaskStatus } from "@/types";
import { format } from "date-fns";
import {
  AlertCircle,
  Calendar,
  CheckCircle,
  Clock,
  GripVertical,
} from "lucide-react";
import { useState, useRef } from "react";
import { useNavigate, useParams } from "react-router";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

const ProjectDetails = () => {
  const { projectId, workspaceId } = useParams<{
    projectId: string;
    workspaceId: string;
  }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [isCreateTask, setIsCreateTask] = useState(false);
  const [taskFilter, setTaskFilter] = useState<TaskStatus | "All">("All");
  const [draggedTask, setDraggedTask] = useState<Task | null>(null);
  const [dragOverStatus, setDragOverStatus] = useState<TaskStatus | null>(null);

  const { data, isLoading } = useProjectQuery(projectId!) as {
    data: {
      tasks: Task[];
      project: Project;
    };
    isLoading: boolean;
  };

  const { mutate: updateTaskStatus, isPending: isUpdatingStatus } =
    useUpdateTaskStatusMutation();

  if (isLoading)
    return (
      <div>
        <Loader />
      </div>
    );

  if (!data) {
    return <div>Project not found</div>;
  }

  const { project, tasks } = data;
  const projectProgress = getProjectProgress(tasks);

  const handleTaskClick = (taskId: string) => {
    navigate(
      `/workspaces/${workspaceId}/projects/${projectId}/tasks/${taskId}`
    );
  };

  const handleDragStart = (e: React.DragEvent, task: Task) => {
    setDraggedTask(task);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", task._id);

    // Add visual feedback
    if (e.target instanceof HTMLElement) {
      e.target.style.opacity = "0.5";
    }
  };

  const handleDragOver = (e: React.DragEvent, status: TaskStatus) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setDragOverStatus(status);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOverStatus(null);
  };

  const handleDrop = (e: React.DragEvent, targetStatus: TaskStatus) => {
    e.preventDefault();
    setDragOverStatus(null);

    if (!draggedTask || draggedTask.status === targetStatus) {
      return;
    }

    // Optimistic update - immediately update the UI
    const projectQueryKey = ["project", projectId];

    // Optimistically update the cache
    queryClient.setQueryData(projectQueryKey, (oldData: any) => {
      if (!oldData) return oldData;

      return {
        ...oldData,
        tasks: oldData.tasks.map((task: Task) =>
          task._id === draggedTask._id
            ? { ...task, status: targetStatus }
            : task
        ),
      };
    });

    updateTaskStatus(
      {
        taskId: draggedTask._id,
        status: targetStatus,
      },
      {
        onSuccess: () => {
          toast.success(`Task moved to ${targetStatus}`);
          setDraggedTask(null);
        },
        onError: (error: any) => {
          // Revert optimistic update on error
          queryClient.invalidateQueries({ queryKey: projectQueryKey });
          toast.error(
            error.response?.data?.message || "Failed to update task status"
          );
          setDraggedTask(null);
        },
      }
    );
  };

  const handleDragEnd = () => {
    setDraggedTask(null);
    setDragOverStatus(null);

    // Reset opacity
    const draggedElement = document.querySelector('[draggable="true"]');
    if (draggedElement instanceof HTMLElement) {
      draggedElement.style.opacity = "1";
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <BackButton />
          <div className="flex items-center gap-3">
            <h1 className="text-xl md:text-2xl font-bold">{project.title}</h1>
          </div>
          {project.description && (
            <p className="text-sm text-gray-500">{project.description}</p>
          )}
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex items-center gap-2 min-w-32">
            <div className="text-sm text-muted-foreground">Progress:</div>
            <div className="flex-1">
              <Progress value={projectProgress} className="h-2" />
            </div>
            <span className="text-sm text-muted-foreground">
              {projectProgress}%
            </span>
          </div>

          <Button onClick={() => setIsCreateTask(true)}>Add Task</Button>
        </div>
      </div>

      {/* Drag and Drop Instructions */}
      <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
        <div className="flex items-center gap-2 text-blue-700 dark:text-blue-300">
          <GripVertical className="w-4 h-4" />
          <span className="text-sm font-medium">Drag and Drop</span>
        </div>
        <p className="text-sm text-blue-600 dark:text-blue-400 mt-1">
          Drag tasks between columns to update their status. Tasks will
          automatically move to the new status.
        </p>
      </div>

      <div className="flex items-center justify-between">
        <Tabs defaultValue="all" className="w-full">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <TabsList>
              <TabsTrigger value="all" onClick={() => setTaskFilter("All")}>
                All Tasks
              </TabsTrigger>
              <TabsTrigger value="todo" onClick={() => setTaskFilter("To Do")}>
                To Do
              </TabsTrigger>
              <TabsTrigger
                value="in-progress"
                onClick={() => setTaskFilter("In Progress")}
              >
                In Progress
              </TabsTrigger>
              <TabsTrigger value="done" onClick={() => setTaskFilter("Done")}>
                Done
              </TabsTrigger>
            </TabsList>

            <div className="flex items-center text-sm">
              <span className="text-muted-foreground">Status:</span>
              <div>
                <Badge variant="outline" className="bg-background">
                  {tasks.filter((task) => task.status === "To Do").length} To Do
                </Badge>
                <Badge variant="outline" className="bg-background">
                  {tasks.filter((task) => task.status === "In Progress").length}{" "}
                  In Progress
                </Badge>
                <Badge variant="outline" className="bg-background">
                  {tasks.filter((task) => task.status === "Done").length} Done
                </Badge>
              </div>
            </div>
          </div>

          <TabsContent value="all" className="m-0">
            <div className="grid grid-cols-3 gap-4">
              <TaskColumn
                title="To Do"
                tasks={tasks.filter((task) => task.status === "To Do")}
                onTaskClick={handleTaskClick}
                onDragStart={handleDragStart}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onDragEnd={handleDragEnd}
                draggedTask={draggedTask}
                dragOverStatus={dragOverStatus}
                isUpdatingStatus={isUpdatingStatus}
              />

              <TaskColumn
                title="In Progress"
                tasks={tasks.filter((task) => task.status === "In Progress")}
                onTaskClick={handleTaskClick}
                onDragStart={handleDragStart}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onDragEnd={handleDragEnd}
                draggedTask={draggedTask}
                dragOverStatus={dragOverStatus}
                isUpdatingStatus={isUpdatingStatus}
              />

              <TaskColumn
                title="Done"
                tasks={tasks.filter((task) => task.status === "Done")}
                onTaskClick={handleTaskClick}
                onDragStart={handleDragStart}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onDragEnd={handleDragEnd}
                draggedTask={draggedTask}
                dragOverStatus={dragOverStatus}
                isUpdatingStatus={isUpdatingStatus}
              />
            </div>
          </TabsContent>

          <TabsContent value="todo" className="m-0">
            <div className="grid md:grid-cols-1 gap-4">
              <TaskColumn
                title="To Do"
                tasks={tasks.filter((task) => task.status === "To Do")}
                onTaskClick={handleTaskClick}
                onDragStart={handleDragStart}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onDragEnd={handleDragEnd}
                draggedTask={draggedTask}
                dragOverStatus={dragOverStatus}
                isUpdatingStatus={isUpdatingStatus}
                isFullWidth
              />
            </div>
          </TabsContent>

          <TabsContent value="in-progress" className="m-0">
            <div className="grid md:grid-cols-1 gap-4">
              <TaskColumn
                title="In Progress"
                tasks={tasks.filter((task) => task.status === "In Progress")}
                onTaskClick={handleTaskClick}
                onDragStart={handleDragStart}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onDragEnd={handleDragEnd}
                draggedTask={draggedTask}
                dragOverStatus={dragOverStatus}
                isUpdatingStatus={isUpdatingStatus}
                isFullWidth
              />
            </div>
          </TabsContent>

          <TabsContent value="done" className="m-0">
            <div className="grid md:grid-cols-1 gap-4">
              <TaskColumn
                title="Done"
                tasks={tasks.filter((task) => task.status === "Done")}
                onTaskClick={handleTaskClick}
                onDragStart={handleDragStart}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onDragEnd={handleDragEnd}
                draggedTask={draggedTask}
                dragOverStatus={dragOverStatus}
                isUpdatingStatus={isUpdatingStatus}
                isFullWidth
              />
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* create    task dialog */}
      <CreateTaskDialog
        open={isCreateTask}
        onOpenChange={setIsCreateTask}
        projectId={projectId!}
        projectMembers={project.members as any}
      />
    </div>
  );
};

export default ProjectDetails;

interface TaskColumnProps {
  title: string;
  tasks: Task[];
  onTaskClick: (taskId: string) => void;
  onDragStart: (e: React.DragEvent, task: Task) => void;
  onDragOver: (e: React.DragEvent, status: TaskStatus) => void;
  onDragLeave: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent, status: TaskStatus) => void;
  onDragEnd: () => void;
  draggedTask: Task | null;
  dragOverStatus: TaskStatus | null;
  isUpdatingStatus: boolean;
  isFullWidth?: boolean;
}

const TaskColumn = ({
  title,
  tasks,
  onTaskClick,
  onDragStart,
  onDragOver,
  onDragLeave,
  onDrop,
  onDragEnd,
  draggedTask,
  dragOverStatus,
  isUpdatingStatus,
  isFullWidth = false,
}: TaskColumnProps) => {
  const columnStatus = title as TaskStatus;
  const isDragOver = dragOverStatus === columnStatus;
  const isDragging = draggedTask !== null;

  return (
    <div
      className={
        isFullWidth
          ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
          : ""
      }
    >
      <div
        className={cn(
          "space-y-4 transition-all duration-200 rounded-lg",
          !isFullWidth ? "h-full" : "col-span-full mb-4",
          isDragOver &&
            "bg-blue-50 dark:bg-blue-950/20 border-2 border-dashed border-blue-300 dark:border-blue-700 p-2",
          isUpdatingStatus && "opacity-50 pointer-events-none"
        )}
        onDragOver={(e) => onDragOver(e, columnStatus)}
        onDragLeave={onDragLeave}
        onDrop={(e) => onDrop(e, columnStatus)}
      >
        {!isFullWidth && (
          <div className="flex items-center justify-between">
            <h1 className="font-medium">{title}</h1>
            <Badge variant="outline">{tasks.length}</Badge>
          </div>
        )}

        <div
          className={cn(
            "space-y-3 min-h-[200px]",
            isFullWidth && "grid grid-cols-2 lg:grid-cols-3 gap-4"
          )}
        >
          {tasks.length === 0 ? (
            <div className="text-center text-sm text-muted-foreground py-8">
              {isDragOver ? (
                <div className="flex flex-col items-center gap-2">
                  <GripVertical className="w-6 h-6 text-blue-500" />
                  <span>Drop task here</span>
                </div>
              ) : (
                "No tasks yet"
              )}
            </div>
          ) : (
            tasks.map((task) => (
              <TaskCard
                key={task._id}
                task={task}
                onClick={() => onTaskClick(task._id)}
                onDragStart={(e) => onDragStart(e, task)}
                onDragEnd={onDragEnd}
                isDragging={draggedTask?._id === task._id}
                isDragOver={isDragOver}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

const TaskCard = ({
  task,
  onClick,
  onDragStart,
  onDragEnd,
  isDragging,
  isDragOver,
}: {
  task: Task;
  onClick: () => void;
  onDragStart: (e: React.DragEvent) => void;
  onDragEnd: () => void;
  isDragging: boolean;
  isDragOver: boolean;
}) => {
  return (
    <Card
      onClick={onClick}
      draggable
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      className={cn(
        "cursor-pointer hover:shadow-md transition-all duration-300 hover:translate-y-1 group",
        isDragging && "opacity-50 scale-95 rotate-2",
        isDragOver && "ring-2 ring-blue-500 ring-opacity-50"
      )}
    >
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <GripVertical className="w-4 h-4 text-gray-400 group-hover:text-gray-600 cursor-grab active:cursor-grabbing" />
            <Badge
              className={
                task.priority === "High"
                  ? "bg-red-500 text-white"
                  : task.priority === "Medium"
                  ? "bg-orange-500 text-white"
                  : "bg-slate-500 text-white"
              }
            >
              {task.priority}
            </Badge>
          </div>

          <div className="flex gap-1">
            {task.status !== "To Do" && (
              <Button
                variant={"ghost"}
                size={"icon"}
                className="size-6"
                onClick={(e) => {
                  e.stopPropagation();
                  console.log("mark as to do");
                }}
                title="Mark as To Do"
              >
                <AlertCircle className={cn("size-4")} />
                <span className="sr-only">Mark as To Do</span>
              </Button>
            )}
            {task.status !== "In Progress" && (
              <Button
                variant={"ghost"}
                size={"icon"}
                className="size-6"
                onClick={(e) => {
                  e.stopPropagation();
                  console.log("mark as in progress");
                }}
                title="Mark as In Progress"
              >
                <Clock className={cn("size-4")} />
                <span className="sr-only">Mark as In Progress</span>
              </Button>
            )}
            {task.status !== "Done" && (
              <Button
                variant={"ghost"}
                size={"icon"}
                className="size-6"
                onClick={(e) => {
                  e.stopPropagation();
                  console.log("mark as done");
                }}
                title="Mark as Done"
              >
                <CheckCircle className={cn("size-4")} />
                <span className="sr-only">Mark as Done</span>
              </Button>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <h4 className="ont-medium mb-2">{task.title}</h4>

        {task.description && (
          <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
            {task.description}
          </p>
        )}

        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            {task.assignees && task.assignees.length > 0 && (
              <div className="flex -space-x-2">
                {task.assignees.slice(0, 5).map((member) => (
                  <Avatar
                    key={member._id}
                    className="relative size-8 bg-gray-700 rounded-full border-2 border-background overflow-hidden"
                    title={member.name}
                  >
                    <AvatarImage src={member.profilePicture} />
                    <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                ))}

                {task.assignees.length > 5 && (
                  <span className="text-xs text-muted-foreground">
                    + {task.assignees.length - 5}
                  </span>
                )}
              </div>
            )}
          </div>

          {task.dueDate && (
            <div className="text-xs text-muted-foreground flex items-center">
              <Calendar className="size-3 mr-1" />
              {format(new Date(task.dueDate), "MMM d, yyyy")}
            </div>
          )}
        </div>
        {/* 5/10 subtasks */}
        {task.subtasks && task.subtasks.length > 0 && (
          <div className="mt-2 text-xs text-muted-foreground">
            {task.subtasks.filter((subtask) => subtask.completed).length} /{" "}
            {task.subtasks.length} subtasks
          </div>
        )}
      </CardContent>
    </Card>
  );
};
