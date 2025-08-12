import { useState } from "react";
import { useGetArchivedTasksQuery } from "@/hooks/use-task";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Loader2, Search } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";

const Archived = () => {
  const { data: tasks, isLoading, isError } = useGetArchivedTasksQuery();
  const [search, setSearch] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");
  console.log(tasks);
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-40">
        <Loader2 className="animate-spin w-6 h-6 text-gray-500" />
      </div>
    );
  }

  if (isError) {
    return <div className="text-red-500">Failed to load archived tasks.</div>;
  }

  // Filter tasks by search & priority
  const filteredTasks = tasks?.filter((task) => {
    const matchesSearch = task.title
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesPriority = priorityFilter
      ? (task.priority || "").toLowerCase() === priorityFilter.toLowerCase()
      : true;

    return matchesSearch && matchesPriority;
  });

  return (
    <div className="space-y-6 ">
      <h1 className="text-2xl font-bold mb-4">Archived Tasks</h1>

      {/* Search & Filter */}
      <div className="flex flex-col md:flex-row gap-3 mb-5">
        <div className="relative ">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search tasks..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8"
          />
        </div>

        <select
          value={priorityFilter}
          onChange={(e) => setPriorityFilter(e.target.value)}
          className="border rounded-md px-3 py-2 text-sm"
        >
          <option value="">All Priorities</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>
      </div>

      {filteredTasks?.length === 0 ? (
        <p className="text-gray-500">No archived tasks found.</p>
      ) : (
        <Accordion type="single" collapsible className="w-full space-y-3">
          {filteredTasks?.map((task) => (
            <AccordionItem
              key={task._id}
              value={task._id}
              className="border rounded-lg px-3 last:border"
            >
              <AccordionTrigger>
                <div className="flex items-center justify-between w-full pr-3">
                  <span className="font-medium">{task.title}</span>
                  <Badge variant="secondary">{task.status}</Badge>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-3 p-2 border-t pt-3">
                  {/* Description */}
                  <div>
                    <p className="text-gray-600">
                      {task.description || "No description"}
                    </p>
                  </div>

                  {/* Priority */}
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">Priority:</span>
                    <Badge
                      variant={
                        task.priority === "High"
                          ? "destructive"
                          : task.priority === "Medium"
                          ? "secondary"
                          : "outline"
                      }
                    >
                      {task.priority || "Not set"}
                    </Badge>
                  </div>

                  {/* Assignees */}
                  <div>
                    <span className="text-sm font-medium">Assignees:</span>
                    <div className="flex gap-2 mt-1">
                      {task.assignees?.length > 0 ? (
                        task.assignees.map((user) => {
                          if (typeof user === "string") return null;
                          return (
                            <Avatar key={user._id} className="h-8 w-8">
                              <AvatarImage
                                src={user?.avatar || ""}
                                alt={user.name || "User"}
                              />
                              <AvatarFallback>
                                {user.name?.[0] || "?"}
                              </AvatarFallback>
                            </Avatar>
                          );
                        })
                      ) : (
                        <span className="text-gray-500 text-sm">None</span>
                      )}
                    </div>
                  </div>

                  {/* Dates */}
                  <div className="text-xs text-gray-500">
                    Created: {new Date(task.createdAt).toLocaleDateString()} |
                    Updated: {new Date(task.updatedAt).toLocaleDateString()}
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      )}
    </div>
  );
};

export default Archived;
