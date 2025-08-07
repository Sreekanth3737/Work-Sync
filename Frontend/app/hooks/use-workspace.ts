import type { WorkspaceForm } from "@/components/Workspace/create-workspace";
import { fetchData, postData, updateData, deleteData } from "@/lib/fetch-util";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useCreateWorkspace = () => {
  return useMutation({
    mutationFn: async (data: WorkspaceForm) => postData("/workspaces", data),
  });
};

export const useGetWorkspacesQuery = () => {
  return useQuery({
    queryKey: ["workspaces"],
    queryFn: async () => fetchData("/workspaces"),
  });
};

export const useGetWorkspaceQuery = (workspaceId: string) => {
  return useQuery({
    queryKey: ["workspace", workspaceId],
    queryFn: async () => fetchData(`/workspaces/${workspaceId}/projects`),
  });
};

export const useGetWorkspaceStatsQuery = (workspaceId: string) => {
  return useQuery({
    queryKey: ["workspace", workspaceId, "stats"],
    queryFn: async () => fetchData(`/workspaces/${workspaceId}/stats`),
  });
};

export const useGetWorkspaceDetailsQuery = (
  workspaceId: string,
  search?: string
) => {
  return useQuery({
    queryKey: ["workspace", workspaceId, "details", search],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (search && search.trim()) {
        params.set("search", search.trim());
      }
      const queryString = params.toString();
      const url = `/workspaces/${workspaceId}${
        queryString ? `?${queryString}` : ""
      }`;
      return fetchData(url);
    },
  });
};

export const useInviteMemberMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { email: string; role: string; workspaceId: string }) =>
      postData(`/workspaces/${data.workspaceId}/invite-member`, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["workspace", variables.workspaceId, "details"],
      });
    },
  });
};

export const useRemoveMemberMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { workspaceId: string; memberId: string }) =>
      deleteData(`/workspaces/${data.workspaceId}/members/${data.memberId}`),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["workspace", variables.workspaceId, "details"],
      });
    },
  });
};

export const useUpdateMemberRoleMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: {
      workspaceId: string;
      memberId: string;
      role: string;
    }) =>
      updateData(
        `/workspaces/${data.workspaceId}/members/${data.memberId}/role`,
        { role: data.role }
      ),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["workspace", variables.workspaceId, "details"],
      });
    },
  });
};

export const useAcceptInviteByTokenMutation = () => {
  return useMutation({
    mutationFn: (token: string) =>
      postData(`/workspaces/accept-invite-token`, {
        token,
      }),
  });
};

export const useAcceptGenerateInviteMutation = () => {
  return useMutation({
    mutationFn: (workspaceId: string) =>
      postData(`/workspaces/${workspaceId}/accept-generate-invite`, {}),
  });
};
