import mongoose from "mongoose";
import Project from "../models/projectModel.js";
import Workspace from "../models/workspaceModel.js";
import Task from "../models/taskModel.js";

const createProject = async (req, res) => {
  try {
    const { workspaceId } = req.params;
    const { title, description, status, startDate, dueDate, tags, members } =
      req.body;

    const workspace = await Workspace.findById(workspaceId);

    if (!workspace) {
      return res.status(404).json({
        message: "Workspace not found",
      });
    }

    const isMember = workspace.members.some(
      (member) => member.user.toString() === req.user._id.toString()
    );

    if (!isMember) {
      return res.status(403).json({
        message: "You are not a member of this workspace",
      });
    }

    const newProject = await Project.create({
      createdBy: req.user._id,
      title,
      description,
      status,
      startDate,
      dueDate,
      tags,
      members,
      workspace: workspaceId,
    });

    workspace.projects.push(newProject._id);
    await workspace.save();

    return res.status(201).json(newProject);
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

const getProjectWithTasks = async (req, res) => {
  try {
    const { projectId } = req.params;

    const project = await Project.findById(projectId)
      .populate("createdBy", "name email profilePicture")
      .populate("members.user", "name email profilePicture");

    if (!project) {
      return res.status(404).json({
        message: "Project not found",
      });
    }

    // Get workspace separately to avoid populate issues
    const workspace = await Workspace.findById(project.workspace);
    if (!workspace) {
      return res.status(404).json({
        message: "Workspace not found",
      });
    }

    // Check if user is a member of the workspace
    const isMember = workspace.members.some(
      (member) => member.user.toString() === req.user._id.toString()
    );

    if (!isMember) {
      return res.status(403).json({
        message: "You are not authorized to access this project",
      });
    }

    const tasks = await Task.find({ project: projectId })
      .populate("assignees", "name email profilePicture")
      .populate("createdBy", "name email profilePicture");

    return res.status(200).json({
      project,
      tasks,
    });
  } catch (error) {
    console.error("Error in getProjectWithTasks:", error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

export { createProject, getProjectWithTasks };
