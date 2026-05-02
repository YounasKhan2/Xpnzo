import React from "react";

type BadgeVariant =
  | "success"
  | "danger"
  | "warning"
  | "info"
  | "primary"
  | "neutral";
type BadgeSize = "sm" | "md";

interface BadgeProps {
  variant?: BadgeVariant;
  size?: BadgeSize;
  children: React.ReactNode;
  dot?: boolean;
  className?: string;
}

const Badge: React.FC<BadgeProps> = ({
  variant = "neutral",
  size = "sm",
  children,
  dot = false,
  className = "",
}) => {
  const sizeClasses = {
    sm: "px-2.5 py-1 text-xs",
    md: "px-3.5 py-1.5 text-sm",
  };

  const variantClasses = {
    success: "bg-success-light text-green-700",
    danger: "bg-danger-light text-red-700",
    warning: "bg-warning-light text-amber-800",
    info: "bg-info-light text-blue-700",
    primary: "bg-primary-light text-primary",
    neutral: "bg-bg text-text-secondary",
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-semibold rounded-full whitespace-nowrap ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
    >
      {dot && (
        <span className="w-1.5 h-1.5 rounded-full bg-current flex-shrink-0" />
      )}
      {children}
    </span>
  );
};

export default Badge;
