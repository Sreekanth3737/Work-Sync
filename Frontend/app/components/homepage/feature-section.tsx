import React from "react";
import {
  FolderOpen,
  CheckCircle,
  UserPlus,
  Move3D,
  MessageSquare,
  Archive,
  Eye,
} from "lucide-react";

const FEATURE_CARDS = [
  {
    icon: <FolderOpen className="w-8 h-8 text-blue-600" />,
    bgColor: "bg-blue-100",
    title: "Workspace Management",
    description:
      "Create workspaces to organize your work. Inside each workspace, create multiple projects and manage everything in a structured hierarchy.",
  },
  {
    icon: <CheckCircle className="w-8 h-8 text-indigo-600" />,
    bgColor: "bg-indigo-100",
    title: "Task & Subtask Management",
    description:
      "Create tasks within projects, break them down into subtasks, set priorities, and track progress with detailed task management features.",
  },
  {
    icon: <UserPlus className="w-8 h-8 text-purple-600" />,
    bgColor: "bg-purple-100",
    title: "Team Collaboration",
    description:
      "Invite team members to projects, assign tasks, and collaborate seamlessly with your team on shared projects and workspaces.",
  },
  {
    icon: <Move3D className="w-8 h-8 text-green-600" />,
    bgColor: "bg-green-100",
    title: "Drag & Drop Interface",
    description:
      "Intuitive drag and drop functionality to update task status, reorder priorities, and move tasks between different project stages effortlessly.",
  },
  {
    icon: <MessageSquare className="w-8 h-8 text-orange-600" />,
    bgColor: "bg-orange-100",
    title: "Comments & Communication",
    description:
      "Add comments to tasks, communicate with team members, and keep track of discussions and updates all in one place.",
  },
  {
    icon: (
      <div className="flex space-x-1">
        <Archive className="w-4 h-4 text-gray-600" />
        <Eye className="w-4 h-4 text-gray-600" />
      </div>
    ),
    bgColor: "bg-gray-100",
    title: "Archive & Watch Features",
    description:
      "Archive completed projects to keep your workspace clean, and watch projects to stay updated on important changes and activities.",
  },
];

const FeatureCard = ({ feature }: { feature: (typeof FEATURE_CARDS)[0] }) => (
  <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-200 hover:shadow-xl transition-shadow">
    <div className={`${feature.bgColor} p-3 rounded-lg w-fit mb-4`}>
      {feature.icon}
    </div>
    <h3 className="text-xl font-semibold text-gray-900 mb-3">
      {feature.title}
    </h3>
    <p className="text-gray-600">{feature.description}</p>
  </div>
);

const FeaturesSection = () => (
  <section id="features" className="py-20 bg-gray-50">
    <div className="max-w-6xl mx-auto px-6">
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          Complete Project Management Solution
        </h2>
        <p className="text-xl text-gray-600">
          From workspaces to tasks - everything you need to manage projects
          efficiently
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {FEATURE_CARDS.map((feature, index) => (
          <FeatureCard key={index} feature={feature} />
        ))}
      </div>
    </div>
  </section>
);

export default FeaturesSection;
