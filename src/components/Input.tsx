import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
}

const Input: React.FC<InputProps> = ({
  label,
  error,
  hint,
  icon,
  iconPosition = "left",
  className = "",
  id,
  ...props
}) => {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");

  const errorClasses = error
    ? "border-danger focus:ring-danger/10"
    : "border-border focus:border-primary focus:ring-primary/10";

  const iconPadding = icon
    ? iconPosition === "left"
      ? "pl-10"
      : "pr-10"
    : "px-3.5";

  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && (
        <label
          className="text-sm font-semibold text-text-primary font-body"
          htmlFor={inputId}
        >
          {label}
        </label>
      )}
      <div className="relative">
        {icon && iconPosition === "left" && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted flex items-center">
            {icon}
          </span>
        )}
        <input
          id={inputId}
          className={`w-full py-2.5 ${iconPadding} border-[1.5px] rounded-md bg-bg text-text-primary text-base font-body outline-none transition-all duration-150 focus:ring-[3px] placeholder-text-muted ${errorClasses}`}
          {...props}
        />
        {icon && iconPosition === "right" && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted flex items-center">
            {icon}
          </span>
        )}
      </div>
      {error && (
        <span className="text-xs text-danger font-medium">{error}</span>
      )}
      {hint && !error && (
        <span className="text-xs text-text-muted">{hint}</span>
      )}
    </div>
  );
};

export default Input;
