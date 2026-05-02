import React from "react";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  padding?: "none" | "sm" | "md" | "lg";
  hoverable?: boolean;
  onClick?: () => void;
}

const Card: React.FC<CardProps> = ({
  children,
  className = "",
  padding = "md",
  hoverable = false,
  onClick,
}) => {
  const paddingClasses = {
    none: "p-0",
    sm: "p-4",
    md: "p-6",
    lg: "p-8",
  };

  const hoverClasses = hoverable
    ? "cursor-pointer hover:-translate-y-[2px] hover:shadow-md transition-all duration-200"
    : "";

  return (
    <div
      className={`bg-card border border-border rounded-xl shadow-sm {paddingClasses[padding]} {hoverClasses} {className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

export default Card;
