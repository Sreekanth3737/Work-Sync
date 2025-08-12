import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  CheckCircle,
  Users,
  ArrowRight,
  Star,
  Sparkles,
  FolderOpen,
  MessageSquare,
  Archive,
  Eye,
  Move3D,
  UserPlus,
  ChevronUp,
} from "lucide-react";

export function meta() {
  return [
    { title: "WorkSync - Where Productivity Meets Simplicity" },
    {
      name: "description",
      content:
        "Transform your workflow with WorkSync - the ultimate task management platform for modern teams.",
    },
  ];
}

// Constants
const FEATURES_DATA = [
  {
    icon: <FolderOpen className="w-6 h-6" />,
    title: "Workspace & Projects",
    desc: "Organize with multi-level structure",
  },
  {
    icon: <Users className="w-6 h-6" />,
    title: "Team Collaboration",
    desc: "Invite members & work together",
  },
  {
    icon: <Move3D className="w-6 h-6" />,
    title: "Drag & Drop",
    desc: "Intuitive task management",
  },
];

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

// Components
const FloatingElement = ({
  delay,
  children,
  className = "",
}: {
  delay: number;
  children: React.ReactNode;
  className?: string;
}) => (
  <div
    className={`absolute animate-bounce ${className}`}
    style={{
      animationDelay: `${delay}s`,
      animationDuration: "3s",
    }}
  >
    {children}
  </div>
);

const Navigation = ({
  isVisible,
  onSectionClick,
}: {
  isVisible: boolean;
  onSectionClick: (section: string) => void;
}) => (
  <nav className="flex justify-between items-center p-6 md:p-8">
    <div
      className={`flex items-center space-x-3 transition-all duration-1000 ${
        isVisible ? "translate-x-0 opacity-100" : "-translate-x-20 opacity-0"
      }`}
    >
      <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
        <CheckCircle className="w-7 h-7 text-white" />
      </div>
      <span className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
        WorkSync
      </span>
    </div>

    <div
      className={`hidden md:flex space-x-8 transition-all duration-1000 delay-200 ${
        isVisible ? "translate-x-0 opacity-100" : "translate-x-20 opacity-0"
      }`}
    >
      <button
        onClick={() => onSectionClick("features")}
        className="text-gray-600 hover:text-blue-600 transition-colors font-medium"
      >
        Features
      </button>
      <button
        onClick={() => onSectionClick("about")}
        className="text-gray-600 hover:text-blue-600 transition-colors font-medium"
      >
        About
      </button>
    </div>
  </nav>
);

const HeroSection = ({
  isVisible,
  currentFeature,
}: {
  isVisible: boolean;
  currentFeature: number;
}) => (
  <div className="flex-1 flex items-center justify-center px-6">
    <div className="max-w-6xl mx-auto text-center">
      <div
        className={`transition-all duration-1000 delay-300 ${
          isVisible ? "translate-y-0 opacity-100" : "translate-y-20 opacity-0"
        }`}
      >
        <div className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium mb-6">
          <Sparkles className="w-4 h-4 mr-2" />
          Welcome to the future of productivity
        </div>

        <h1 className="text-5xl md:text-7xl font-bold mb-6 text-gray-900 leading-tight">
          Organize Your Tasks
          <br />
          <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Like Never Before
          </span>
        </h1>

        <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
          Your personal productivity companion. Organize tasks, track progress,
          and stay focused on what matters most to you.
        </p>
      </div>

      {/* Main CTA Section */}
      <div
        className={`mb-16 transition-all duration-1000 delay-500 ${
          isVisible ? "scale-100 opacity-100" : "scale-90 opacity-0"
        }`}
      >
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 md:p-12 border border-gray-200 shadow-2xl max-w-2xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">
            Start Organizing Your Life Today
          </h2>

          <div className="flex flex-col md:flex-row gap-4 justify-center items-center mb-8">
            <Button
              className="group bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-10 py-4 text-lg font-semibold rounded-xl shadow-xl transform transition-all hover:scale-105 hover:shadow-blue-500/25 w-full md:w-auto"
              onClick={() => (window.location.href = "/sign-up")}
            >
              Sign Up Free
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>

            <Button
              variant="outline"
              className="group border-2 border-blue-600 text-blue-600 hover:bg-blue-50 px-10 py-4 text-lg font-semibold rounded-xl transition-all hover:scale-105 w-full md:w-auto"
              onClick={() => (window.location.href = "/sign-in")}
            >
              Login
            </Button>
          </div>

          <p className="text-gray-500 text-sm">
            ✨ Get started in seconds • Organize your tasks effortlessly
          </p>
        </div>
      </div>

      {/* Feature Showcase */}
      <div
        className={`flex justify-center mb-12 transition-all duration-1000 delay-700 ${
          isVisible ? "scale-100 opacity-100" : "scale-90 opacity-0"
        }`}
      >
        <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-gray-200 shadow-lg">
          <div className="flex items-center justify-center space-x-4 mb-4">
            <div className="text-blue-600 bg-blue-100 p-3 rounded-lg">
              {FEATURES_DATA[currentFeature].icon}
            </div>
            <div className="text-left">
              <h3 className="text-lg font-semibold text-gray-900">
                {FEATURES_DATA[currentFeature].title}
              </h3>
              <p className="text-gray-600">
                {FEATURES_DATA[currentFeature].desc}
              </p>
            </div>
          </div>
          <div className="flex space-x-2 justify-center">
            {FEATURES_DATA.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === currentFeature ? "bg-blue-500" : "bg-gray-300"
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Social Proof */}
      <div
        className={`transition-all duration-1000 delay-900 ${
          isVisible ? "opacity-100" : "opacity-0"
        }`}
      >
        <p className="text-gray-500 mb-6 font-medium">
          Your personal task management solution
        </p>
        <div className="flex justify-center items-center space-x-8 opacity-70">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="w-12 h-12 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-xl flex items-center justify-center border border-gray-200"
            >
              <Star className="w-6 h-6 text-blue-500 fill-blue-500" />
            </div>
          ))}
        </div>

        <div className="mt-8 grid grid-cols-2 gap-8 max-w-xl mx-auto text-center">
          <div>
            <div className="text-2xl font-bold text-blue-600">99.9%</div>
            <div className="text-gray-600 text-sm">Uptime</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-indigo-600">4.8★</div>
            <div className="text-gray-600 text-sm">User Rating</div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

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

const ScrollToTopButton = ({
  showScrollTop,
  onScrollTop,
}: {
  showScrollTop: boolean;
  onScrollTop: () => void;
}) => (
  <div
    className={`fixed bottom-8 right-8 z-50 transition-all duration-300 ${
      showScrollTop
        ? "opacity-100 translate-y-0"
        : "opacity-0 translate-y-4 pointer-events-none"
    }`}
  >
    <button
      onClick={onScrollTop}
      className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-3 rounded-full shadow-2xl hover:shadow-blue-500/25 transform hover:scale-110 transition-all duration-200"
      aria-label="Scroll to top"
    >
      <ChevronUp className="w-6 h-6" />
    </button>
  </div>
);

// Main Component
const Homepage = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [currentFeature, setCurrentFeature] = useState(0);
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    setIsVisible(true);

    const interval = setInterval(() => {
      setCurrentFeature((prev) => (prev + 1) % FEATURES_DATA.length);
    }, 3000);

    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      clearInterval(interval);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 overflow-hidden relative">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <FloatingElement delay={0} className="top-20 left-10 text-blue-200/40">
          <CheckCircle size={60} />
        </FloatingElement>
        <FloatingElement
          delay={1}
          className="top-40 right-20 text-indigo-200/40"
        >
          <Users size={80} />
        </FloatingElement>
        <FloatingElement
          delay={2}
          className="bottom-32 left-20 text-blue-200/40"
        >
          <Move3D size={70} />
        </FloatingElement>
        <FloatingElement
          delay={0.5}
          className="bottom-20 right-10 text-indigo-200/40"
        >
          <Sparkles size={50} />
        </FloatingElement>
      </div>

      {/* Gradient Orbs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-200/30 rounded-full filter blur-3xl animate-pulse"></div>
      <div
        className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-200/30 rounded-full filter blur-3xl animate-pulse"
        style={{ animationDelay: "2s" }}
      ></div>

      <div className="relative z-10 min-h-screen flex flex-col">
        <Navigation isVisible={isVisible} onSectionClick={scrollToSection} />
        <HeroSection isVisible={isVisible} currentFeature={currentFeature} />

        {/* Bottom Decorative Wave */}
        <div className="absolute bottom-0 left-0 right-0 h-24 opacity-30">
          <svg viewBox="0 0 1200 120" className="w-full h-full">
            <path
              d="M0,60 C200,20 400,100 600,60 C800,20 1000,100 1200,60 L1200,120 L0,120 Z"
              className="fill-blue-200"
            />
          </svg>
        </div>
      </div>

      <FeaturesSection />
      <AboutSection />
      <ScrollToTopButton
        showScrollTop={showScrollTop}
        onScrollTop={scrollToTop}
      />
    </div>
  );
};

export default Homepage;
