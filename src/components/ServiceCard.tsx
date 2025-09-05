import React from "react";
import { CustomButton } from "./ui/custom-button";

interface ServiceCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  isActive?: boolean;
  onClick?: () => void;
  services?: string[];
}

export const ServiceCard: React.FC<ServiceCardProps> = ({
  icon,
  title,
  description,
  isActive = false,
  onClick,
  services = [],
}) => {
  return (
    <div className={cn(
      "relative p-6 rounded-2xl gradient-card border border-border shadow-card transition-smooth cursor-pointer",
      "hover:shadow-[var(--shadow-hover)] hover:-translate-y-1",
      isActive && "ring-2 ring-primary shadow-[var(--shadow-hover)]"
    )} onClick={onClick}>
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
          {icon}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-lg text-foreground mb-2">{title}</h3>
          <p className="text-sm text-muted-foreground mb-4">{description}</p>
          {services.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {services.slice(0, 3).map((service, index) => (
                <span
                  key={index}
                  className="text-xs bg-primary/10 text-primary px-3 py-1 rounded-full font-medium"
                >
                  {service}
                </span>
              ))}
              {services.length > 3 && (
                <span className="text-xs text-muted-foreground">
                  +{services.length - 3} more
                </span>
              )}
            </div>
          )}
        </div>
      </div>
      <div className="absolute top-4 right-4">
        <div className="w-3 h-3 rounded-full bg-secondary"></div>
      </div>
    </div>
  );
};

// Helper function - need to import
import { cn } from "@/lib/utils";