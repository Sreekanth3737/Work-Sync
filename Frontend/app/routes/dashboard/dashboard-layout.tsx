import React, { useState } from "react";
import { useAuth } from "@/provider/auth-context";
import { Navigate, Outlet } from "react-router";
import { Loader } from "@/components/customReusable/loader";
import { Header } from "@/components/layout/header";
import type { workspace } from "@/types";
import { Sidebar } from "@/components/layout/sidebar";
import { Createworkspace } from "@/components/Workspace/create-workspace";
import { fetchData } from "@/lib/fetch-util";

export const clientLoader = async () => {
  try {
    const [workspaces] = await Promise.all([fetchData("/workspaces")]);
    return { workspaces };
  } catch (error) {
    console.log(error);
  }
};

const DashboardLayout = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const [isCreatingworkspace, setIsCreatingworkspace] = useState(false);
  const [currentworkspace, setCurrentworkspace] = useState<workspace | null>(
    null
  );

  if (isLoading) {
    return <Loader />;
  }
  if (!isAuthenticated) {
    return <Navigate to="/sign-in" />;
  }

  const handleworkspaceSelected = (workspace: workspace) => {
    setCurrentworkspace(workspace);
  };

  return (
    <div className="flex h-screen w-full">
      {/* Sidebar Component */}
      <Sidebar currentworkspace={currentworkspace} />
      <div className="flex flex-1 flex-col h-full">
        {/* Header */}
        <Header
          onworkspaceSelected={handleworkspaceSelected}
          selectedworkspace={currentworkspace}
          onCreatedworkspace={() => setIsCreatingworkspace(true)}
        />
        <main className="flex-1 overflow-y-auto h-full w-full">
          <div className="mx-auto container px-2 sm:px-6 lg:px-8 py-0 md:py-8 w-full h-full">
            <Outlet context={{ currentworkspace, setCurrentworkspace }} />
          </div>
        </main>
      </div>
      <Createworkspace
        isCreatingworkspace={isCreatingworkspace}
        setIsCreatingworkspace={setIsCreatingworkspace}
      />
    </div>
  );
};

export default DashboardLayout;
