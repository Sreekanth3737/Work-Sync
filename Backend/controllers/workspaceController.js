import Workspace from "../models/workspaceModel.js";
import Project from "../models/projectModel.js";
import Task from "../models/taskModel.js";
import User from "../models/userModel.js";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

const createWorkspace = async (req, res) => {
  try {
    const { name, description, color } = req.body;
    const workspace = await Workspace.create({
      name,
      description,
      color,
      owner: req.user._id,
      members: [{ user: req.user._id, role: "owner", joinedAt: new Date() }],
    });
    res.status(201).json(workspace);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

const getWorkspaces = async (req, res) => {
  try {
    const workspaces = await Workspace.find({
      "members.user": req.user._id,
    }).sort({ createdAt: -1 });
    res.status(200).json(workspaces);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

const getWorkspaceByID = async (req, res) => {
  try {
    const { workspaceId } = req.params;
    const { search } = req.query;

    if (
      !workspaceId ||
      workspaceId === "null" ||
      !mongoose.Types.ObjectId.isValid(workspaceId)
    ) {
      return res
        .status(400)
        .json({ message: "Valid workspace ID is required" });
    }

    const workspaceDetail = await Workspace.findOne({
      _id: workspaceId,
      "members.user": req.user._id,
    }).populate("members.user", "name email profilePicture");

    if (!workspaceDetail) {
      return res.status(404).json({ message: "Workspace not found" });
    }

    // Filter members by search term if provided
    if (search && typeof search === "string" && search.trim()) {
      const searchTerm = search.toLowerCase().trim();
      workspaceDetail.members = workspaceDetail.members.filter((member) => {
        const user = member.user;
        return (
          user.name.toLowerCase().includes(searchTerm) ||
          user.email.toLowerCase().includes(searchTerm) ||
          member.role.toLowerCase().includes(searchTerm)
        );
      });
    }

    res.status(200).json(workspaceDetail);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

const getWorkspaceProjects = async (req, res) => {
  try {
    const { workspaceId } = req.params;
    if (
      !workspaceId ||
      workspaceId === "null" ||
      !mongoose.Types.ObjectId.isValid(workspaceId)
    ) {
      return res
        .status(400)
        .json({ message: "Valid workspace ID is required" });
    }

    const workspaceDetail = await Workspace.findOne({
      _id: workspaceId,
      "members.user": req.user._id,
    }).populate("members.user", "name email profilePicture");

    if (!workspaceDetail) {
      return res.status(404).json({ message: "Workspace not found" });
    }
    const projects = await Project.find({
      workspace: workspaceId,
      isArchieved: false,
      // members: { $in: [req.user._id] },
    })
      .populate("members.user", "name email profilePicture")
      .populate("createdBy", "name email profilePicture")
      .sort({ createdAt: -1 });

    res.status(200).json({ projects, workspace: workspaceDetail });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

const getWorkspaceStats = async (req, res) => {
  try {
    const { workspaceId } = req.params;
    if (
      !workspaceId ||
      workspaceId === "null" ||
      !mongoose.Types.ObjectId.isValid(workspaceId)
    ) {
      return res
        .status(400)
        .json({ message: "Valid workspace ID is required" });
    }

    // Verify user is a member of the workspace
    const workspace = await Workspace.findOne({
      _id: workspaceId,
      "members.user": req.user._id,
    });

    if (!workspace) {
      return res.status(404).json({ message: "Workspace not found" });
    }

    // Get projects in the workspace
    const projects = await Project.find({ workspace: workspaceId });
    const projectIds = projects.map((project) => project._id);

    // Get tasks for these projects
    const tasks = await Task.find({ project: { $in: projectIds } });

    // Calculate stats
    const totalProjects = projects.length;
    const totalTasks = tasks.length;
    const totalProjectInProgress = projects.filter(
      (p) => p.status === "In Progress"
    ).length;
    const totalTaskCompleted = tasks.filter((t) => t.status === "Done").length;
    const totalTaskToDo = tasks.filter((t) => t.status === "To Do").length;
    const totalTaskInProgress = tasks.filter(
      (t) => t.status === "In Progress"
    ).length;

    // Mock data for charts (you can implement real chart data logic)
    const taskTrendsData = [
      {
        name: "Completed",
        completed: totalTaskCompleted,
        inProgress: totalTaskInProgress,
        todo: totalTaskToDo,
      },
    ];

    const projectStatusData = [
      { name: "In Progress", value: totalProjectInProgress, color: "#3b82f6" },
      {
        name: "Completed",
        value: projects.filter((p) => p.status === "Completed").length,
        color: "#10b981",
      },
      {
        name: "Planning",
        value: projects.filter((p) => p.status === "Planning").length,
        color: "#f59e0b",
      },
    ];

    const taskPriorityData = [
      {
        name: "High",
        value: tasks.filter((t) => t.priority === "High").length,
        color: "#ef4444",
      },
      {
        name: "Medium",
        value: tasks.filter((t) => t.priority === "Medium").length,
        color: "#f59e0b",
      },
      {
        name: "Low",
        value: tasks.filter((t) => t.priority === "Low").length,
        color: "#10b981",
      },
    ];

    const workspaceProductivityData = [
      {
        name: workspace.name,
        completed: totalTaskCompleted,
        total: totalTasks,
      },
    ];

    // Get upcoming tasks (due within 7 days)
    const upcomingTasks = await Task.find({
      project: { $in: projectIds },
      dueDate: {
        $gte: new Date(),
        $lte: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    })
      .populate("project")
      .limit(5);

    // Get recent projects
    const recentProjects = await Project.find({ workspace: workspaceId })
      .sort({ createdAt: -1 })
      .limit(5);

    res.status(200).json({
      stats: {
        totalProjects,
        totalTasks,
        totalProjectInProgress,
        totalTaskCompleted,
        totalTaskToDo,
        totalTaskInProgress,
      },
      taskTrendsData,
      projectStatusData,
      taskPriorityData,
      workspaceProductivityData,
      upcomingTasks,
      recentProjects,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

const inviteMember = async (req, res) => {
  try {
    const { workspaceId } = req.params;
    const { email, role } = req.body;

    const workspace = await Workspace.findById(workspaceId);
    if (!workspace) {
      return res.status(404).json({ message: "Workspace not found" });
    }

    // Check if user is admin or owner
    const userRole = workspace.members.find(
      (member) => member.user.toString() === req.user._id.toString()
    )?.role;

    if (!userRole || (userRole !== "admin" && userRole !== "owner")) {
      return res.status(403).json({ message: "Insufficient permissions" });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if user is already a member
    const isAlreadyMember = workspace.members.some(
      (member) => member.user.toString() === existingUser._id.toString()
    );

    if (isAlreadyMember) {
      return res.status(400).json({ message: "User is already a member" });
    }

    // Add user to workspace
    workspace.members.push({
      user: existingUser._id,
      role,
      joinedAt: new Date(),
    });

    await workspace.save();

    res.status(200).json({ message: "Member invited successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

const acceptInviteByToken = async (req, res) => {
  try {
    const { token } = req.body;

    // Verify token (you might want to implement proper token verification)
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Add user to workspace logic here
    res.status(200).json({ message: "Invitation accepted" });
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "Invalid invitation token" });
  }
};

const acceptGenerateInvite = async (req, res) => {
  try {
    const { workspaceId } = req.params;

    const workspace = await Workspace.findById(workspaceId);
    if (!workspace) {
      return res.status(404).json({ message: "Workspace not found" });
    }

    // Check if user is already a member
    const isAlreadyMember = workspace.members.some(
      (member) => member.user.toString() === req.user._id.toString()
    );

    if (isAlreadyMember) {
      return res.status(400).json({ message: "You are already a member" });
    }

    // Add user to workspace
    workspace.members.push({
      user: req.user._id,
      role: "member",
      joinedAt: new Date(),
    });

    await workspace.save();

    res.status(200).json({ message: "Joined workspace successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

const removeMember = async (req, res) => {
  try {
    const { workspaceId, memberId } = req.params;

    const workspace = await Workspace.findById(workspaceId);
    if (!workspace) {
      return res.status(404).json({ message: "Workspace not found" });
    }

    // Check if user is admin or owner
    const userRole = workspace.members.find(
      (member) => member.user.toString() === req.user._id.toString()
    )?.role;

    if (!userRole || (userRole !== "admin" && userRole !== "owner")) {
      return res.status(403).json({ message: "Insufficient permissions" });
    }

    // Check if trying to remove owner
    const memberToRemove = workspace.members.find(
      (member) => member._id.toString() === memberId
    );

    if (!memberToRemove) {
      return res.status(404).json({ message: "Member not found" });
    }

    if (memberToRemove.role === "owner") {
      return res.status(403).json({ message: "Cannot remove workspace owner" });
    }

    // Check if trying to remove yourself
    if (memberToRemove.user.toString() === req.user._id.toString()) {
      return res.status(403).json({ message: "Cannot remove yourself" });
    }

    // Remove member
    workspace.members = workspace.members.filter(
      (member) => member._id.toString() !== memberId
    );

    await workspace.save();

    res.status(200).json({ message: "Member removed successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

const updateMemberRole = async (req, res) => {
  try {
    const { workspaceId, memberId } = req.params;
    const { role } = req.body;

    const workspace = await Workspace.findById(workspaceId);
    if (!workspace) {
      return res.status(404).json({ message: "Workspace not found" });
    }

    // Check if user is admin or owner
    const userRole = workspace.members.find(
      (member) => member.user.toString() === req.user._id.toString()
    )?.role;

    if (!userRole || (userRole !== "admin" && userRole !== "owner")) {
      return res.status(403).json({ message: "Insufficient permissions" });
    }

    // Find the member to update
    const memberToUpdate = workspace.members.find(
      (member) => member._id.toString() === memberId
    );

    if (!memberToUpdate) {
      return res.status(404).json({ message: "Member not found" });
    }

    // Check if trying to change owner role
    if (memberToUpdate.role === "owner") {
      return res.status(403).json({ message: "Cannot change owner role" });
    }

    // Update role
    memberToUpdate.role = role;

    await workspace.save();

    res.status(200).json({ message: "Member role updated successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};

export {
  createWorkspace,
  getWorkspaces,
  getWorkspaceByID,
  getWorkspaceProjects,
  getWorkspaceStats,
  inviteMember,
  acceptInviteByToken,
  acceptGenerateInvite,
  removeMember,
  updateMemberRole,
};
