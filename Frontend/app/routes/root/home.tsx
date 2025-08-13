import React, { useState, useEffect, lazy, Suspense } from "react";
import { Button } from "@/components/ui/button";
import { CheckCircle, ArrowRight, Sparkles } from "lucide-react";

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

const FeaturesSection = lazy(
  () => import("../../components/homepage/feature-section")
);
const AboutSection = lazy(
  () => import("../../components/homepage/about-section")
);
const FloatingElements = lazy(
  () => import("../../components/homepage/floating-elements")
);

// Critical above-fold component (loads immediately)
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

// Critical hero section (loads immediately)
const HeroSection = ({ isVisible }: { isVisible: boolean }) => (
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
    </div>
  </div>
);

// Loading component
const SectionLoading = () => (
  <div className="flex justify-center items-center py-20">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
  </div>
);

// Main Component - Much smaller now
const Homepage = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    setIsVisible(true);

    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
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
      {/* Lazy load background elements */}
      <Suspense fallback={null}>
        <FloatingElements />
      </Suspense>

      {/* Gradient Orbs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-200/30 rounded-full filter blur-3xl animate-pulse"></div>
      <div
        className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-200/30 rounded-full filter blur-3xl animate-pulse"
        style={{ animationDelay: "2s" }}
      ></div>

      <div className="relative z-10 min-h-screen flex flex-col">
        <Navigation isVisible={isVisible} onSectionClick={scrollToSection} />
        <HeroSection isVisible={isVisible} />

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

      {/* Lazy load below-fold sections */}
      <Suspense fallback={<SectionLoading />}>
        <FeaturesSection />
      </Suspense>

      <Suspense fallback={<SectionLoading />}>
        <AboutSection />
      </Suspense>

      {/* Scroll to top button */}
      <div
        className={`fixed bottom-8 right-8 z-50 transition-all duration-300 ${
          showScrollTop
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-4 pointer-events-none"
        }`}
      >
        <button
          onClick={scrollToTop}
          className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-3 rounded-full shadow-2xl hover:shadow-blue-500/25 transform hover:scale-110 transition-all duration-200"
          aria-label="Scroll to top"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 15l7-7 7 7"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default Homepage;
