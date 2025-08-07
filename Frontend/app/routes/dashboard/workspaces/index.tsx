import React, { useState } from "react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Loader } from "@/components/customReusable/loader";
import { Createworkspace } from "@/components/Workspace/create-workspace";
import { useGetWorkspacesQuery } from "@/hooks/use-workspace";
import type { workspace } from "@/types";
import { PlusCircle, Users } from "lucide-react";
import { NoDataFound } from "@/components/customReusable/no-data-found";
import { Link } from "react-router";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { workspaceAvatar as WorkspaceAvatar } from "@/components/Workspace/Workspace-avatar";

const WorkspaceCard = ({ workspace }: { workspace: workspace }) => {
  return (
    <Link to={`/workspaces/${workspace._id}`}>
      <Card className="transition-all hover:shadow-md hover:translate-y-1">
        <CardHeader className="pb-2 ">
          <div className="flex items-center justify-between">
            <div className="flex gap-2 ">
              <WorkspaceAvatar name={workspace.name} color={workspace.color} />
              <div>
                <CardTitle>{workspace.name}</CardTitle>
                <span className="text-sm text-muted-foreground">
                  Created at {format(workspace.createdAt, "MMM d,yyyy h:mm a")}
                </span>
              </div>
            </div>
            <div className="flex items-center text-muted-foreground">
              <Users className="size-4 mr-1" />
              <span className="text-xs">{workspace.members.length}</span>
            </div>
          </div>
          <CardDescription>
            {workspace.description || "No description"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-muted-foreground">
            View workspace details and projects
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

const Workspaces = () => {
  const [isCreatingworkspace, setIsCreatingworkspace] = useState(false);
  const { data: workspaces, isLoading } = useGetWorkspacesQuery() as {
    data: workspace[];
    isLoading: boolean;
  };

  if (isLoading) {
    return <Loader />;
  }

  return (
    <>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <h2 className="text-xl md:text-3xl font-bold">workspaces</h2>
          <Button onClick={() => setIsCreatingworkspace(true)}>
            <PlusCircle className="size-4 mr-2" /> New workspace
          </Button>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {workspaces.map((useworkspace) => (
            <WorkspaceCard key={useworkspace._id} workspace={useworkspace} />
          ))}
          {workspaces.length === 0 && (
            <NoDataFound
              title="No workspaces found"
              description="Create a new workspaces to get started"
              buttonText="Create workspace"
              buttonAction={() => setIsCreatingworkspace(true)}
            />
          )}
        </div>
      </div>

      <Createworkspace
        isCreatingworkspace={isCreatingworkspace}
        setIsCreatingworkspace={setIsCreatingworkspace}
      />
    </>
  );
};

export default Workspaces;
