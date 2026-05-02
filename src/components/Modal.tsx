import React, { useEffect } from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: "sm" | "md" | "lg";
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  size = "md",
}) => {
  useEffect(() => {
    if (isOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const sizeClasses = {
    sm: "max-w-[420px]",
    md: "max-w-[560px]",
    lg: "max-w-[720px]",
  };

  return (
    <div
      className="fixed inset-0 bg-black/45 backdrop-blur-[4px] flex items-center justify-center z-[1000] p-4 animate-[fadeIn_0.2s_ease]"
      onClick={onClose}
    >
      <div
        className={`bg-card rounded-2xl shadow-xl w-full max-h-[90vh] overflow-y-auto animate-[slideUp_0.3s_cubic-bezier(0.34,1.56,0.64,1)] ${sizeClasses[size]}`}
        onClick={(e) => e.stopPropagation()}
      >
        {title && (
          <div className="flex items-center justify-between p-6 border-b border-border">
            <h3 className="text-xl font-heading font-bold text-text-primary m-0">
              {title}
            </h3>
            <button
              className="w-8 h-8 flex items-center justify-center rounded-md bg-transparent text-text-muted border-none cursor-pointer transition-colors duration-150 hover:bg-bg hover:text-text-primary"
              onClick={onClose}
              aria-label="Close"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
};

export default Modal;
