import { Suspense, lazy } from "react";
import { StatsCard } from "@/components/dashboard/stat-card";
import { Loader } from "@/components/customReusable/loader";
import { useGetWorkspaceStatsQuery } from "@/hooks/use-workspace";
import type {
  Project,
  ProjectStatusData,
  StatsCardProps,
  Task,
  TaskPriorityData,
  TaskTrendsData,
  workspaceProductivityData,
} from "@/types";
import { useOutletContext } from "react-router";
import type { workspace } from "@/types";

// Lazy load heavy components
const StatisticsCharts = lazy(() =>
  import("@/components/dashboard/charts").then((module) => ({
    default: module.StatisticsCharts,
  }))
);

const RecentProjects = lazy(() =>
  import("@/components/dashboard/latest-project").then((module) => ({
    default: module.RecentProjects,
  }))
);

const UpcomingTasks = lazy(() =>
  import("@/components/customReusable/upcommiing-tasks").then((module) => ({
    default: module.UpcomingTasks,
  }))
);

// Component-specific loading fallbacks
const ChartSkeleton = () => (
  <div className="space-y-4">
    <div className="h-4 bg-gray-200 rounded animate-pulse w-1/4"></div>
    <div className="h-64 bg-gray-200 rounded animate-pulse"></div>
  </div>
);

const CardSkeleton = () => (
  <div className="p-6 border rounded-lg space-y-3">
    <div className="h-4 bg-gray-200 rounded animate-pulse w-1/3"></div>
    <div className="space-y-2">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="h-3 bg-gray-200 rounded animate-pulse"></div>
      ))}
    </div>
  </div>
);

interface OutletContext {
  currentworkspace: workspace | null;
  setCurrentworkspace: (workspace: workspace | null) => void;
}

const Dashboard = () => {
  const { currentworkspace } = useOutletContext<OutletContext>();

  // Always call the hook, but disable it when no workspace is selected
  const { data, isPending } = useGetWorkspaceStatsQuery(
    currentworkspace?._id || ""
  ) as {
    data:
      | {
          stats: StatsCardProps;
          taskTrendsData: TaskTrendsData[];
          projectStatusData: ProjectStatusData[];
          taskPriorityData: TaskPriorityData[];
          workspaceProductivityData: workspaceProductivityData[];
          upcomingTasks: Task[];
          recentProjects: Project[];
        }
      | undefined;
    isPending: boolean;
  };

  // Early return after all hooks have been called
  if (!currentworkspace) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">No Workspace Selected</h2>
          <p className="text-gray-500">
            Please select a workspace from the dropdown in the header to view
            the dashboard.
          </p>
        </div>
      </div>
    );
  }

  if (isPending) {
    return (
      <div className="space-y-8 2xl:space-y-12">
        {/* Header skeleton */}
        <div className="flex items-center justify-between">
          <div className="h-8 bg-gray-200 rounded animate-pulse w-32"></div>
          <div className="h-4 bg-gray-200 rounded animate-pulse w-48"></div>
        </div>

        {/* Stats cards skeleton */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="p-6 border rounded-lg">
              <div className="h-4 bg-gray-200 rounded animate-pulse w-1/2 mb-2"></div>
              <div className="h-8 bg-gray-200 rounded animate-pulse w-3/4"></div>
            </div>
          ))}
        </div>

        {/* Charts skeleton */}
        <ChartSkeleton />

        {/* Bottom cards skeleton */}
        <div className="grid gap-6 lg:grid-cols-2">
          <CardSkeleton />
          <CardSkeleton />
        </div>
      </div>
    );
  }

  // Add safety check for data
  if (!data) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">No Data Available</h2>
          <p className="text-gray-500">
            Unable to load workspace data at this time.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 2xl:space-y-12">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <div className="text-sm text-muted-foreground">
          Workspace: {currentworkspace.name}
        </div>
      </div>

      {/* Load stats immediately - lightweight component */}
      <StatsCard data={data.stats} />

      {/* Lazy load heavy chart components */}
      <Suspense fallback={<ChartSkeleton />}>
        <StatisticsCharts
          stats={data.stats}
          taskTrendsData={data.taskTrendsData}
          projectStatusData={data.projectStatusData}
          taskPriorityData={data.taskPriorityData}
          workspaceProductivityData={data.workspaceProductivityData}
        />
      </Suspense>

      {/* Lazy load bottom section components */}
      <div className="grid gap-6 lg:grid-cols-2 my-4">
        <Suspense fallback={<CardSkeleton />}>
          <RecentProjects data={data.recentProjects} />
        </Suspense>

        <Suspense fallback={<CardSkeleton />}>
          <UpcomingTasks data={data.upcomingTasks} />
        </Suspense>
      </div>
    </div>
  );
};

export default Dashboard;
