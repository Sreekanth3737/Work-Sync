import { Loader } from "@/components/customReusable/loader";
import { CreateProject } from "@/components/project/create-project";
import { ProjectList } from "@/components/Workspace/project-list";
import { workspaceHeader as WorkspaceHeader } from "@/components/Workspace/workspace-header";
import { useGetWorkspaceQuery } from "@/hooks/use-workspace";
import type { Project, workspace } from "@/types";
import { useState } from "react";
import { useParams } from "react-router";

const workspaceDetails = () => {
  const { workspaceId } = useParams<{ workspaceId: string }>();
  const [isCreateProject, setIsCreateProject] = useState(false);
  const [isInviteMember, setIsInviteMember] = useState(false);
  if (!workspaceId) {
    return <div>No workspace found</div>;
  }
  const { data, isLoading } = useGetWorkspaceQuery(workspaceId) as {
    data: {
      workspace: workspace;
      projects: Project[];
    };
    isLoading: boolean;
  };
  if (isLoading) {
    return (
      <div>
        <Loader />
      </div>
    );
  }
  return (
    <div className="space-y-8">
      <WorkspaceHeader
        workspace={data?.workspace}
        members={data?.workspace?.members as any}
        onCreateProject={() => setIsCreateProject(true)}
        onInviteMember={() => setIsInviteMember(true)}
      />
      <ProjectList
        workspaceId={workspaceId}
        onCreateProject={() => setIsCreateProject(true)}
        projects={data.projects}
      />
      <CreateProject
        isOpen={isCreateProject}
        onOpenChange={setIsCreateProject}
        workspaceId={workspaceId}
        workspaceMembers={data.workspace.members as any}
      />
    </div>
  );
};
export default workspaceDetails;
