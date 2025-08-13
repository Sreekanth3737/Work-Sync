import React from "react";
import {
  FolderOpen,
  Users,
  Move3D,
  MessageSquare,
  Activity,
  Archive,
  Eye,
  Bell,
  Calendar,
} from "lucide-react";

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
  {
    icon: <MessageSquare className="w-8 h-8 text-green-600" />,
    bgColor: "bg-green-100",
    title: "Real-time Comments",
    subtitle: "Discuss and provide feedback instantly",
  },
  {
    icon: <Activity className="w-8 h-8 text-orange-600" />,
    bgColor: "bg-orange-100",
    title: "Activity Logs",
    subtitle: "Track all changes and updates",
  },
  {
    icon: <Archive className="w-8 h-8 text-gray-600" />,
    bgColor: "bg-gray-100",
    title: "Smart Archiving",
    subtitle: "Keep completed projects organized",
  },
  {
    icon: <Eye className="w-8 h-8 text-cyan-600" />,
    bgColor: "bg-cyan-100",
    title: "Project Watching",
    subtitle: "Stay updated on important projects",
  },
  {
    icon: <Bell className="w-8 h-8 text-pink-600" />,
    bgColor: "bg-pink-100",
    title: "Smart Notifications",
    subtitle: "Never miss important updates",
  },
  {
    icon: <Calendar className="w-8 h-8 text-red-600" />,
    bgColor: "bg-red-100",
    title: "Timeline Tracking",
    subtitle: "Monitor deadlines and milestones",
  },
];

const AboutSection = () => (
  <section id="about" className="py-20 bg-white overflow-hidden">
    <div className="max-w-6xl mx-auto px-6 text-center">
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

        <div className="relative overflow-hidden">
          <div className="flex animate-scroll-left space-x-6">
            {/* First set of highlights */}
            {ABOUT_HIGHLIGHTS.map((highlight, index) => (
              <div
                key={index}
                className="flex-shrink-0 bg-white p-6 rounded-2xl shadow-lg border border-gray-100 w-64 text-center hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
              >
                <div
                  className={`${highlight.bgColor} p-4 rounded-full w-fit mx-auto mb-4`}
                >
                  {highlight.icon}
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  {highlight.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {highlight.subtitle}
                </p>
              </div>
            ))}
            {/* Duplicate set for seamless loop */}
            {ABOUT_HIGHLIGHTS.map((highlight, index) => (
              <div
                key={`duplicate-${index}`}
                className="flex-shrink-0 bg-white p-6 rounded-2xl shadow-lg border border-gray-100 w-64 text-center hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
              >
                <div
                  className={`${highlight.bgColor} p-4 rounded-full w-fit mx-auto mb-4`}
                >
                  {highlight.icon}
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  {highlight.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {highlight.subtitle}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>

    <style
      dangerouslySetInnerHTML={{
        __html: `
        @keyframes scroll-left {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        
        .animate-scroll-left {
          animation: scroll-left 30s linear infinite;
        }
        
        .animate-scroll-left:hover {
          animation-play-state: paused;
        }
      `,
      }}
    />
  </section>
);

export default AboutSection;
