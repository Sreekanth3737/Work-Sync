import { RecentProjects } from "@/components/dashboard/latest-project";
import { StatsCard } from "@/components/dashboard/stat-card";
import { StatisticsCharts } from "@/components/dashboard/charts";
import { Loader } from "@/components/customReusable/loader";
import { UpcomingTasks } from "@/components/customReusable/upcommiing-tasks";
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

interface OutletContext {
  currentworkspace: workspace | null;
  setCurrentworkspace: (workspace: workspace | null) => void;
}

const Dashboard = () => {
  const { currentworkspace } = useOutletContext<OutletContext>();

  if (!currentworkspace) {
    return (
      <div className="flex items-center justify-center h-64 ">
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

  const { data, isPending } = useGetWorkspaceStatsQuery(
    currentworkspace._id
  ) as {
    data: {
      stats: StatsCardProps;
      taskTrendsData: TaskTrendsData[];
      projectStatusData: ProjectStatusData[];
      taskPriorityData: TaskPriorityData[];
      workspaceProductivityData: workspaceProductivityData[];
      upcomingTasks: Task[];
      recentProjects: Project[];
    };
    isPending: boolean;
  };

  if (isPending) {
    return (
      <div>
        <Loader />
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

      <StatsCard data={data.stats} />

      <StatisticsCharts
        stats={data.stats}
        taskTrendsData={data.taskTrendsData}
        projectStatusData={data.projectStatusData}
        taskPriorityData={data.taskPriorityData}
        workspaceProductivityData={data.workspaceProductivityData}
      />

      <div className="grid gap-6 lg:grid-cols-2 my-4">
        <RecentProjects data={data.recentProjects} />
        <UpcomingTasks data={data.upcomingTasks} />
      </div>
    </div>
  );
};

export default Dashboard;
