import { Loader } from "@/components/customReusable/loader";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useGetWorkspaceDetailsQuery } from "@/hooks/use-workspace";
import {
  useRemoveMemberMutation,
  useUpdateMemberRoleMutation,
} from "@/hooks/use-workspace";
import { InviteMemberDialog } from "@/components/Workspace/invite-member-dialog";
import type { workspace } from "@/types";
import { format } from "date-fns";
import { MoreHorizontal, Plus, UserPlus, Search } from "lucide-react";
import React, { useEffect, useState, useMemo } from "react";
import { useSearchParams } from "react-router";
import { toast } from "sonner";
import { useAuth } from "@/provider/auth-context";

const Members = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { user } = useAuth();
  const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false);

  const workspaceId = searchParams.get("workspaceId");
  const initialSearch = searchParams.get("search") || "";
  const [search, setSearch] = useState<string>(initialSearch);
  const [debouncedSearch, setDebouncedSearch] = useState<string>(initialSearch);

  const { mutate: removeMember } = useRemoveMemberMutation();
  const { mutate: updateMemberRole } = useUpdateMemberRoleMutation();

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 300);

    return () => clearTimeout(timer);
  }, [search]);

  // Update URL when debounced search changes
  useEffect(() => {
    const params = new URLSearchParams(searchParams);

    if (debouncedSearch.trim()) {
      params.set("search", debouncedSearch);
    } else {
      params.delete("search");
    }

    setSearchParams(params, { replace: true });
  }, [debouncedSearch, setSearchParams]);

  // Sync search state with URL
  useEffect(() => {
    const urlSearch = searchParams.get("search") || "";
    if (urlSearch !== search) {
      setSearch(urlSearch);
    }
  }, [searchParams]);

  // Early return if no workspaceId
  if (!workspaceId) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">No Workspace Selected</h2>
          <p className="text-gray-500">
            Please select a workspace to view members.
          </p>
        </div>
      </div>
    );
  }

  const { data, isLoading } = useGetWorkspaceDetailsQuery(
    workspaceId,
    debouncedSearch
  ) as {
    data: workspace;
    isLoading: boolean;
  };

  if (isLoading)
    return (
      <div>
        <Loader />
      </div>
    );

  if (!data) return <div>No workspace found</div>;

  // Get current user's role in this workspace
  const currentUserMember = data?.members?.find(
    (member) => member.user._id === user?._id
  );
  const canManageMembers =
    currentUserMember?.role === "admin" || currentUserMember?.role === "owner";

  // Use the members directly from the API response (already filtered server-side)
  const filteredMembers = data?.members || [];

  const handleRemoveMember = (memberId: string, memberName: string) => {
    if (
      confirm(
        `Are you sure you want to remove ${memberName} from the workspace?`
      )
    ) {
      removeMember(
        { workspaceId, memberId },
        {
          onSuccess: () => {
            toast.success("Member removed successfully");
          },
          onError: (error: any) => {
            toast.error(
              error.response?.data?.message || "Failed to remove member"
            );
          },
        }
      );
    }
  };

  const handleUpdateRole = (memberId: string, newRole: string) => {
    updateMemberRole(
      { workspaceId, memberId, role: newRole },
      {
        onSuccess: () => {
          toast.success("Member role updated successfully");
        },
        onError: (error: any) => {
          toast.error(error.response?.data?.message || "Failed to update role");
        },
      }
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start md:items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Workspace Members</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage members and their roles in {data.name}
          </p>
        </div>
        {canManageMembers && (
          <Button onClick={() => setIsInviteDialogOpen(true)}>
            <UserPlus className="w-4 h-4 mr-2" />
            Invite Member
          </Button>
        )}
      </div>

      <div className="flex gap-4">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search members..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        {debouncedSearch && (
          <div className="text-sm text-gray-500 flex items-center">
            {filteredMembers.length} result
            {filteredMembers.length !== 1 ? "s" : ""} found
          </div>
        )}
      </div>

      <Tabs defaultValue="list">
        <TabsList>
          <TabsTrigger value="list">List View</TabsTrigger>
          <TabsTrigger value="board">Board View</TabsTrigger>
        </TabsList>

        {/* LIST VIEW */}
        <TabsContent value="list">
          <Card>
            <CardHeader>
              <CardTitle>Members</CardTitle>
              <CardDescription>
                {filteredMembers.length} member
                {filteredMembers.length !== 1 ? "s" : ""} in your workspace
                {debouncedSearch && ` matching "${debouncedSearch}"`}
              </CardDescription>
            </CardHeader>

            <CardContent>
              {filteredMembers.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">
                    {debouncedSearch
                      ? `No members found matching "${debouncedSearch}"`
                      : "No members found"}
                  </p>
                </div>
              ) : (
                <div className="divide-y">
                  {filteredMembers.map((member) => (
                    <div
                      key={member.user._id}
                      className="flex flex-col md:flex-row items-center justify-between p-4 gap-3"
                    >
                      <div className="flex items-center space-x-4">
                        <Avatar className="bg-gray-500">
                          <AvatarImage src={member.user.profilePicture} />
                          <AvatarFallback>
                            {member.user.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{member.user.name}</p>
                          <p className="text-sm text-gray-500">
                            {member.user.email}
                          </p>
                          <p className="text-xs text-gray-400">
                            Joined{" "}
                            {format(new Date(member.joinedAt), "MMM d, yyyy")}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Badge
                          variant={
                            member.role === "owner"
                              ? "default"
                              : member.role === "admin"
                              ? "destructive"
                              : "secondary"
                          }
                          className="capitalize"
                        >
                          {member.role}
                        </Badge>

                        {canManageMembers &&
                          member.user._id !== user?._id &&
                          member.role !== "owner" && (
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  <MoreHorizontal className="w-4 h-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuSeparator />

                                {/* Role Management */}
                                <DropdownMenuLabel>
                                  Change Role
                                </DropdownMenuLabel>
                                {member.role !== "admin" && (
                                  <DropdownMenuItem
                                    onClick={() =>
                                      handleUpdateRole(member._id, "admin")
                                    }
                                  >
                                    Make Admin
                                  </DropdownMenuItem>
                                )}
                                {member.role !== "member" && (
                                  <DropdownMenuItem
                                    onClick={() =>
                                      handleUpdateRole(member._id, "member")
                                    }
                                  >
                                    Make Member
                                  </DropdownMenuItem>
                                )}
                                {member.role !== "viewer" && (
                                  <DropdownMenuItem
                                    onClick={() =>
                                      handleUpdateRole(member._id, "viewer")
                                    }
                                  >
                                    Make Viewer
                                  </DropdownMenuItem>
                                )}

                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  className="text-red-600"
                                  onClick={() =>
                                    handleRemoveMember(
                                      member._id,
                                      member.user.name
                                    )
                                  }
                                >
                                  Remove Member
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* BOARD VIEW */}
        <TabsContent value="board">
          {filteredMembers.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">
                {debouncedSearch
                  ? `No members found matching "${debouncedSearch}"`
                  : "No members found"}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredMembers.map((member) => (
                <Card key={member.user._id} className="relative">
                  <CardContent className="p-6 flex flex-col items-center text-center">
                    <Avatar className="bg-gray-500 size-20 mb-4">
                      <AvatarImage src={member.user.profilePicture} />
                      <AvatarFallback className="uppercase">
                        {member.user.name.substring(0, 2)}
                      </AvatarFallback>
                    </Avatar>

                    <h3 className="text-lg font-medium mb-2">
                      {member.user.name}
                    </h3>

                    <p className="text-sm text-gray-500 mb-2">
                      {member.user.email}
                    </p>

                    <p className="text-xs text-gray-400 mb-4">
                      Joined {format(new Date(member.joinedAt), "MMM d, yyyy")}
                    </p>

                    <Badge
                      variant={
                        member.role === "owner"
                          ? "default"
                          : member.role === "admin"
                          ? "destructive"
                          : "secondary"
                      }
                      className="capitalize"
                    >
                      {member.role}
                    </Badge>

                    {canManageMembers &&
                      member.user._id !== user?._id &&
                      member.role !== "owner" && (
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="absolute top-2 right-2"
                            >
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator />

                            {/* Role Management */}
                            <DropdownMenuLabel>Change Role</DropdownMenuLabel>
                            {member.role !== "admin" && (
                              <DropdownMenuItem
                                onClick={() =>
                                  handleUpdateRole(member._id, "admin")
                                }
                              >
                                Make Admin
                              </DropdownMenuItem>
                            )}
                            {member.role !== "member" && (
                              <DropdownMenuItem
                                onClick={() =>
                                  handleUpdateRole(member._id, "member")
                                }
                              >
                                Make Member
                              </DropdownMenuItem>
                            )}
                            {member.role !== "viewer" && (
                              <DropdownMenuItem
                                onClick={() =>
                                  handleUpdateRole(member._id, "viewer")
                                }
                              >
                                Make Viewer
                              </DropdownMenuItem>
                            )}

                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className="text-red-600"
                              onClick={() =>
                                handleRemoveMember(member._id, member.user.name)
                              }
                            >
                              Remove Member
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      <InviteMemberDialog
        isOpen={isInviteDialogOpen}
        onOpenChange={setIsInviteDialogOpen}
        workspaceId={workspaceId}
      />
    </div>
  );
};

export default Members;
