import type { ProjectStatus } from "@/types";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getTaskStatusColor = (status: ProjectStatus) => {
  const statusColor: Record<ProjectStatus, string> = {
    "In Progress":
      "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
    Completed:
      "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
    Cancelled: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
    Planning:
      "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300",
    "On Hold":
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
  };
  return (
    statusColor[status] ||
    "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300"
  );
};
