import React from "react";
import { CheckCircle, Users, Move3D, Sparkles } from "lucide-react";

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

const FloatingElements = () => (
  <div className="absolute inset-0 overflow-hidden">
    <FloatingElement delay={0} className="top-20 left-10 text-blue-200/40">
      <CheckCircle size={60} />
    </FloatingElement>
    <FloatingElement delay={1} className="top-40 right-20 text-indigo-200/40">
      <Users size={80} />
    </FloatingElement>
    <FloatingElement delay={2} className="bottom-32 left-20 text-blue-200/40">
      <Move3D size={70} />
    </FloatingElement>
    <FloatingElement
      delay={0.5}
      className="bottom-20 right-10 text-indigo-200/40"
    >
      <Sparkles size={50} />
    </FloatingElement>
  </div>
);

export default FloatingElements;
