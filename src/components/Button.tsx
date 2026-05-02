import React from "react";

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger" | "outline";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
  fullWidth?: boolean;
  loading?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  variant = "primary",
  size = "md",
  icon,
  iconPosition = "left",
  fullWidth = false,
  loading = false,
  children,
  className = "",
  disabled,
  ...props
}) => {
  const baseClasses =
    "inline-flex items-center justify-center gap-2 font-body font-semibold transition-all duration-200 whitespace-nowrap rounded-lg relative overflow-hidden";

  const sizeClasses = {
    sm: "px-3.5 py-1.5 text-sm rounded-md",
    md: "px-5 py-2.5 text-base",
    lg: "px-7 py-3 text-lg rounded-xl",
  };

  const variantClasses = {
    primary:
      "bg-primary text-white hover:bg-primary-hover hover:shadow-[0_4px_12px_rgba(91,103,202,0.35)] hover:-translate-y-px",
    secondary:
      "bg-primary-light text-primary hover:bg-[rgba(91,103,202,0.2)] hover:-translate-y-px",
    ghost:
      "bg-transparent text-text-secondary hover:bg-bg hover:text-text-primary",
    outline:
      "bg-transparent text-primary border-2 border-primary hover:bg-primary-light hover:-translate-y-px",
    danger:
      "bg-danger text-white hover:bg-[#dc2626] hover:shadow-[0_4px_12px_rgba(239,68,68,0.35)] hover:-translate-y-px",
  };

  const widthClass = fullWidth ? "w-full" : "";
  const disabledClass =
    disabled || loading
      ? "opacity-50 cursor-not-allowed pointer-events-none"
      : "";

  const classes = `${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${widthClass} ${disabledClass} ${className}`;

  return (
    <button className={classes} disabled={disabled || loading} {...props}>
      {loading && (
        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin flex-shrink-0" />
      )}
      {!loading && icon && iconPosition === "left" && (
        <span className="flex items-center flex-shrink-0">{icon}</span>
      )}
      {children && <span className="flex-1">{children}</span>}
      {!loading && icon && iconPosition === "right" && (
        <span className="flex items-center flex-shrink-0">{icon}</span>
      )}
    </button>
  );
};

export default Button;
