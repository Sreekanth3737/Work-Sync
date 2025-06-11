import mongoose, { model, Schema } from "mongoose";

const projectSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    workspace: {
      type: Schema.Types.ObjectId,
      ref: "Wrokspace",
      required: true,
    },
    status: {
      type: String,
      enum: ["Planning", "In Progress", "On Hold", "Completed", "Cancelled"],
      default: "Planning",
    },
    startDate: {
      type: Date,
    },
    dueDate: { type: Date },
    progress: { type: Number, min: 0, max: 100, default: 0 },
    tasks: [{ type: Schema.Types.ObjectId, ref: "Task" }],
    members: [
      {
        user: {
          type: mongoose.Types.ObjectId,
          ref: "User",
        },
        role: {
          type: String,
          enum: ["manager", "contributer", "viewer"],
          default: "contributer",
        },
      },
    ],
    tags: [{ type: String }],
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    isArchieved: { type: Boolean, default: false },
  },
  { timestamps: true }
);
const Project = model("Project", projectSchema);
export default Project;
