import React from "react";
import { FolderOpen, Users, Move3D } from "lucide-react";

const ABOUT_HIGHLIGHTS = [
  {
    icon: <FolderOpen className="w-8 h-8 text-blue-600" />,
    bgColor: "bg-blue-100",
    title: "Structured Organization",
    subtitle: "Workspaces → Projects → Tasks",
  },
  {
    icon: <Users className="w-8 h-8 text-indigo-600" />,
    bgColor: "bg-indigo-100",
    title: "Team Collaboration",
    subtitle: "Invite, assign, and collaborate",
  },
  {
    icon: <Move3D className="w-8 h-8 text-purple-600" />,
    bgColor: "bg-purple-100",
    title: "Intuitive Interface",
    subtitle: "Drag, drop, and manage easily",
  },
];

const AboutSection = () => (
  <section id="about" className="py-20 bg-white">
    <div className="max-w-4xl mx-auto px-6 text-center">
      <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">
        About WorkSync
      </h2>

      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-8 md:p-12 rounded-3xl border border-gray-200">
        <p className="text-lg md:text-xl text-gray-700 leading-relaxed mb-6">
          WorkSync is a comprehensive project management platform that brings
          structure to your work. With a hierarchical approach - from workspaces
          to projects to tasks - it provides the perfect balance of organization
          and flexibility for both personal and team productivity.
        </p>

        <p className="text-lg text-gray-600 leading-relaxed mb-8">
          Built with modern collaboration in mind, WorkSync includes team
          invitation features, real-time updates, drag-and-drop task management,
          commenting systems, and advanced organizational tools like archiving
          and project watching capabilities.
        </p>

        <div className="grid md:grid-cols-3 gap-6 text-center">
          {ABOUT_HIGHLIGHTS.map((highlight, index) => (
            <div key={index}>
              <div
                className={`${highlight.bgColor} p-4 rounded-full w-fit mx-auto mb-3`}
              >
                {highlight.icon}
              </div>
              <h3 className="font-semibold text-gray-900">{highlight.title}</h3>
              <p className="text-gray-600 text-sm">{highlight.subtitle}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  </section>
);

export default AboutSection;
