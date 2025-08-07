import type React from "react";
import type { workspace } from "@/types";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { useLocation, useNavigate } from "react-router";

interface SidebarNavProps extends React.HTMLAttributes<HTMLElement> {
  items: {
    title: string;
    href: string;
    icon: LucideIcon;
  }[];
  isCollapsed: boolean;
  className?: string;
  currentworkspace: workspace | null;
}

export const SidebarNav = ({
  items,
  isCollapsed,
  className,
  currentworkspace,
  ...props
}: SidebarNavProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  return (
    <nav className={cn("flex flex-col gap-y-2", className)} {...props}>
      {items.map((useElement) => {
        const Icon = useElement.icon;
        const isActive = location.pathname === useElement.href;
        const handleClick = () => {
          if (useElement.href === "/workspaces") {
            navigate(useElement.href);
          } else if (currentworkspace && currentworkspace._id) {
            navigate(`${useElement.href}?workspaceId=${currentworkspace._id}`);
          } else {
            navigate(useElement.href);
          }
        };
        return (
          <Button
            className={cn(
              "justify-start",
              isActive && "bg-blue-800/20 text-blue-600 font-medium"
            )}
            onClick={handleClick}
            variant={isActive ? "outline" : "ghost"}
            key={useElement.href}
          >
            <Icon className="mr-2 size-4" />
            {isCollapsed ? (
              <span className="sr-only">{useElement.title}</span>
            ) : (
              useElement.title
            )}
          </Button>
        );
      })}
    </nav>
  );
};
