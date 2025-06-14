import { Loader } from "@/components/customReusable/loader";
import { CreateProject } from "@/components/project/create-project";
import { ProjectList } from "@/components/Workspace/project-list";
import { WorkspaceHeader } from "@/components/Workspace/workspace-header";
import { useGetWorkspaceByIdQuery } from "@/hooks/use-workspace";
import type { Project, Workspace } from "@/types";
import { useState } from "react";
import { useParams } from "react-router";

const WorkspaceDetails = () => {
  const { workspaceId } = useParams<{ workspaceId: string }>();
  const [isCreateProject, setIsCreateProject] = useState(false);
  const [isInviteMember, setIsInviteMember] = useState(false);
  if (!workspaceId) {
    return <div>No Workspace found</div>;
  }
  const { data, isLoading } = useGetWorkspaceByIdQuery(workspaceId) as {
    data: {
      workspace: Workspace;
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
export default WorkspaceDetails;
