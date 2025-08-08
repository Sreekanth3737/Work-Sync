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
import { useState } from "react";
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

  if (isLoading) {
    return (
      <div>
        <Loader />
      </div>
    );
  }

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

  const updateTaskStatusHandler = (taskId: string, newStatus: TaskStatus) => {
    const projectQueryKey = ["project", projectId];

    // Optimistic update
    queryClient.setQueryData(projectQueryKey, (oldData: any) => {
      if (!oldData) return oldData;

      return {
        ...oldData,
        tasks: oldData.tasks.map((task: Task) =>
          task._id === taskId ? { ...task, status: newStatus } : task
        ),
      };
    });

    updateTaskStatus(
      { taskId, status: newStatus },
      {
        onSuccess: () => {
          toast.success(`Task moved to ${newStatus}`);
        },
        onError: (error: any) => {
          queryClient.invalidateQueries({ queryKey: projectQueryKey });
          toast.error(
            error.response?.data?.message || "Failed to update task status"
          );
        },
      }
    );
  };

  const handleDragStart = (e: React.DragEvent, task: Task) => {
    setDraggedTask(task);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", task._id);

    if (e.target instanceof HTMLElement) {
      e.target.style.opacity = "0.5";
    }
  };

  const handleDragOver = (e: React.DragEvent, status: TaskStatus) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setDragOverStatus(status);
  };

  const handleDragLeave = () => {
    setDragOverStatus(null);
  };

  const handleDrop = (e: React.DragEvent, targetStatus: TaskStatus) => {
    e.preventDefault();
    setDragOverStatus(null);

    if (!draggedTask || draggedTask.status === targetStatus) {
      setDraggedTask(null);
      return;
    }

    updateTaskStatusHandler(draggedTask._id, targetStatus);
    setDraggedTask(null);
  };

  const handleDragEnd = () => {
    setDraggedTask(null);
    setDragOverStatus(null);

    // Reset opacity
    const draggedElements = document.querySelectorAll('[draggable="true"]');
    draggedElements.forEach((el) => {
      if (el instanceof HTMLElement) {
        el.style.opacity = "1";
      }
    });
  };

  const taskCounts = {
    todo: tasks.filter((task) => task.status === "To Do").length,
    inProgress: tasks.filter((task) => task.status === "In Progress").length,
    done: tasks.filter((task) => task.status === "Done").length,
  };

  return (
    <div className="space-y-8">
      {/* Header Section */}
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

      {/* Tasks Section */}
      <Tabs defaultValue="all" className="w-full">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <TabsList>
            <TabsTrigger value="all">All Tasks</TabsTrigger>
            <TabsTrigger value="todo">To Do</TabsTrigger>
            <TabsTrigger value="in-progress">In Progress</TabsTrigger>
            <TabsTrigger value="done">Done</TabsTrigger>
          </TabsList>

          <div className="flex items-center gap-2 text-sm">
            <span className="text-muted-foreground">Status:</span>
            <Badge variant="outline" className="bg-background">
              {taskCounts.todo} To Do
            </Badge>
            <Badge variant="outline" className="bg-background">
              {taskCounts.inProgress} In Progress
            </Badge>
            <Badge variant="outline" className="bg-background">
              {taskCounts.done} Done
            </Badge>
          </div>
        </div>

        {/* All Tasks View - Kanban Board */}
        <TabsContent value="all" className="m-0">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <TaskColumn
              title="To Do"
              status="To Do"
              tasks={tasks.filter((task) => task.status === "To Do")}
              onTaskClick={handleTaskClick}
              onTaskStatusUpdate={updateTaskStatusHandler}
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
              status="In Progress"
              tasks={tasks.filter((task) => task.status === "In Progress")}
              onTaskClick={handleTaskClick}
              onTaskStatusUpdate={updateTaskStatusHandler}
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
              status="Done"
              tasks={tasks.filter((task) => task.status === "Done")}
              onTaskClick={handleTaskClick}
              onTaskStatusUpdate={updateTaskStatusHandler}
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

        {/* Individual Status Views */}
        <TabsContent value="todo" className="m-0">
          <TaskGrid
            tasks={tasks.filter((task) => task.status === "To Do")}
            onTaskClick={handleTaskClick}
            onTaskStatusUpdate={updateTaskStatusHandler}
            isUpdatingStatus={isUpdatingStatus}
          />
        </TabsContent>

        <TabsContent value="in-progress" className="m-0">
          <TaskGrid
            tasks={tasks.filter((task) => task.status === "In Progress")}
            onTaskClick={handleTaskClick}
            onTaskStatusUpdate={updateTaskStatusHandler}
            isUpdatingStatus={isUpdatingStatus}
          />
        </TabsContent>

        <TabsContent value="done" className="m-0">
          <TaskGrid
            tasks={tasks.filter((task) => task.status === "Done")}
            onTaskClick={handleTaskClick}
            onTaskStatusUpdate={updateTaskStatusHandler}
            isUpdatingStatus={isUpdatingStatus}
          />
        </TabsContent>
      </Tabs>

      {/* Create Task Dialog */}
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

// Task Column Component for Kanban View
interface TaskColumnProps {
  title: string;
  status: TaskStatus;
  tasks: Task[];
  onTaskClick: (taskId: string) => void;
  onTaskStatusUpdate: (taskId: string, status: TaskStatus) => void;
  onDragStart: (e: React.DragEvent, task: Task) => void;
  onDragOver: (e: React.DragEvent, status: TaskStatus) => void;
  onDragLeave: () => void;
  onDrop: (e: React.DragEvent, status: TaskStatus) => void;
  onDragEnd: () => void;
  draggedTask: Task | null;
  dragOverStatus: TaskStatus | null;
  isUpdatingStatus: boolean;
}

const TaskColumn = ({
  title,
  status,
  tasks,
  onTaskClick,
  onTaskStatusUpdate,
  onDragStart,
  onDragOver,
  onDragLeave,
  onDrop,
  onDragEnd,
  draggedTask,
  dragOverStatus,
  isUpdatingStatus,
}: TaskColumnProps) => {
  const isDragOver = dragOverStatus === status;

  return (
    <div
      className={cn(
        "space-y-4 transition-all duration-200 rounded-lg p-4 border-2 border-dashed border-transparent min-h-[400px]",
        isDragOver &&
          "bg-blue-50 dark:bg-blue-950/20 border-blue-300 dark:border-blue-700",
        isUpdatingStatus && "opacity-50 pointer-events-none"
      )}
      onDragOver={(e) => onDragOver(e, status)}
      onDragLeave={onDragLeave}
      onDrop={(e) => onDrop(e, status)}
    >
      <div className="flex items-center justify-between">
        <h2 className="font-medium text-lg">{title}</h2>
        <Badge variant="outline">{tasks.length}</Badge>
      </div>

      <div className="space-y-3">
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
              onStatusUpdate={onTaskStatusUpdate}
              onDragStart={(e) => onDragStart(e, task)}
              onDragEnd={onDragEnd}
              isDragging={draggedTask?._id === task._id}
              showStatusActions={true}
            />
          ))
        )}
      </div>
    </div>
  );
};

// Task Grid Component for Individual Status Views
interface TaskGridProps {
  tasks: Task[];
  onTaskClick: (taskId: string) => void;
  onTaskStatusUpdate: (taskId: string, status: TaskStatus) => void;
  isUpdatingStatus: boolean;
}

const TaskGrid = ({
  tasks,
  onTaskClick,
  onTaskStatusUpdate,
  isUpdatingStatus,
}: TaskGridProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {tasks.length === 0 ? (
        <div className="col-span-full text-center text-sm text-muted-foreground py-8">
          No tasks found
        </div>
      ) : (
        tasks.map((task) => (
          <TaskCard
            key={task._id}
            task={task}
            onClick={() => onTaskClick(task._id)}
            onStatusUpdate={onTaskStatusUpdate}
            showStatusActions={true}
            isUpdatingStatus={isUpdatingStatus}
          />
        ))
      )}
    </div>
  );
};

// Task Card Component
interface TaskCardProps {
  task: Task;
  onClick: () => void;
  onStatusUpdate?: (taskId: string, status: TaskStatus) => void;
  onDragStart?: (e: React.DragEvent) => void;
  onDragEnd?: () => void;
  isDragging?: boolean;
  showStatusActions?: boolean;
  isUpdatingStatus?: boolean;
}

const TaskCard = ({
  task,
  onClick,
  onStatusUpdate,
  onDragStart,
  onDragEnd,
  isDragging = false,
  showStatusActions = false,
  isUpdatingStatus = false,
}: TaskCardProps) => {
  const handleStatusChange = (e: React.MouseEvent, newStatus: TaskStatus) => {
    e.stopPropagation();
    if (onStatusUpdate) {
      onStatusUpdate(task._id, newStatus);
    }
  };

  return (
    <Card
      onClick={onClick}
      draggable={!!onDragStart}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      className={cn(
        "cursor-pointer hover:shadow-md transition-all duration-300 hover:-translate-y-1 group",
        isDragging && "opacity-50 scale-95 rotate-2",
        isUpdatingStatus && "opacity-50 pointer-events-none"
      )}
    >
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {onDragStart && (
              <GripVertical className="w-4 h-4 text-gray-400 group-hover:text-gray-600 cursor-grab active:cursor-grabbing" />
            )}
            <Badge
              variant="outline"
              className={cn(
                task.priority === "High" &&
                  "bg-red-500 text-white border-red-500",
                task.priority === "Medium" &&
                  "bg-orange-500 text-white border-orange-500",
                task.priority === "Low" &&
                  "bg-green-500 text-white border-green-500"
              )}
            >
              {task.priority}
            </Badge>
          </div>

          {showStatusActions && (
            <div className="flex gap-1">
              {task.status !== "To Do" && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 w-7 p-0"
                  onClick={(e) => handleStatusChange(e, "To Do")}
                  title="Mark as To Do"
                  disabled={isUpdatingStatus}
                >
                  <AlertCircle className="h-3 w-3" />
                </Button>
              )}
              {task.status !== "In Progress" && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 w-7 p-0"
                  onClick={(e) => handleStatusChange(e, "In Progress")}
                  title="Mark as In Progress"
                  disabled={isUpdatingStatus}
                >
                  <Clock className="h-3 w-3" />
                </Button>
              )}
              {task.status !== "Done" && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 w-7 p-0"
                  onClick={(e) => handleStatusChange(e, "Done")}
                  title="Mark as Done"
                  disabled={isUpdatingStatus}
                >
                  <CheckCircle className="h-3 w-3" />
                </Button>
              )}
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <h4 className="font-medium mb-2">{task.title}</h4>

        {task.description && (
          <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
            {task.description}
          </p>
        )}

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {task.assignees && task.assignees.length > 0 && (
                <div className="flex -space-x-2">
                  {task.assignees.slice(0, 3).map((member) => (
                    <Avatar
                      key={member._id}
                      className="relative h-6 w-6 border-2 border-background"
                      title={member.name}
                    >
                      <AvatarImage src={member.profilePicture} />
                      <AvatarFallback className="text-xs">
                        {member.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                  ))}
                  {task.assignees.length > 3 && (
                    <div className="flex items-center justify-center h-6 w-6 rounded-full bg-muted border-2 border-background">
                      <span className="text-xs text-muted-foreground">
                        +{task.assignees.length - 3}
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>

            {task.dueDate && (
              <div className="text-xs text-muted-foreground flex items-center">
                <Calendar className="h-3 w-3 mr-1" />
                {format(new Date(task.dueDate), "MMM d")}
              </div>
            )}
          </div>

          {task.subtasks && task.subtasks.length > 0 && (
            <div className="text-xs text-muted-foreground">
              <span className="font-medium">
                {task.subtasks.filter((subtask) => subtask.completed).length}
              </span>
              /{task.subtasks.length} subtasks completed
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
