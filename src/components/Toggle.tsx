import React from "react";

interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  disabled?: boolean;
  size?: "sm" | "md";
}

const Toggle: React.FC<ToggleProps> = ({
  checked,
  onChange,
  label,
  disabled = false,
  size = "md",
}) => {
  const sizeClasses = {
    sm: {
      track: "w-9 h-5 p-0.5",
      thumb: "w-4 h-4",
      translate: "translate-x-4",
    },
    md: {
      track: "w-11 h-6 p-0.5",
      thumb: "w-5 h-5",
      translate: "translate-x-5",
    },
  };

  const currentSize = sizeClasses[size];

  return (
    <label
      className={`inline-flex items-center gap-2.5 cursor-pointer select-none {
        disabled ? "opacity-50 cursor-not-allowed" : ""
      }`}
    >
      <input
        type="checkbox"
        className="hidden"
        checked={checked}
        disabled={disabled}
        onChange={(e) => onChange(e.target.checked)}
      />
      <span
        className={`relative inline-flex items-center rounded-full transition-colors duration-200 flex-shrink-0 {
          currentSize.track
        } {checked ? "bg-primary" : "bg-border"}`}
      >
        <span
          className={`rounded-full bg-white shadow-sm transition-transform duration-200 flex-shrink-0 {
            currentSize.thumb
          } {checked ? currentSize.translate : "translate-x-0"}`}
        />
      </span>
      {label && (
        <span className="text-base text-text-primary font-medium">{label}</span>
      )}
    </label>
  );
};

export default Toggle;
