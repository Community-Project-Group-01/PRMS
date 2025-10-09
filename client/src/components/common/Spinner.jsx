// components/ui/Spinner.jsx
import React from "react";

const Spinner = ({
  size = "medium",
  variant = "primary",
  className = "",
  showText = false,
  text = "Loading...",
}) => {
  const sizeClasses = {
    small: "w-4 h-4",
    medium: "w-8 h-8",
    large: "w-12 h-12",
  };

  const variantClasses = {
    primary: "text-primary",
    secondary: "text-secondary",
    white: "text-white",
    dark: "text-primary-dark",
  };

  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <div
        className={`${sizeClasses[size]} ${variantClasses[variant]} animate-spin rounded-full border-2 border-current border-t-transparent`}
      />
      {showText && (
        <p className={`mt-2 text-sm ${variantClasses[variant]} font-medium`}>
          {text}
        </p>
      )}
    </div>
  );
};

// Full Page Spinner
export const FullPageSpinner = ({ text = "Loading patient records..." }) => (
  <div className="fixed inset-0 bg-white/80 backdrop-blur-sm z-50 flex items-center justify-center">
    <div className="text-center">
      <Spinner size="large" variant="primary" />
      <p className="mt-4 text-lg font-semibold text-gray-700">{text}</p>
    </div>
  </div>
);

// Inline Spinner for buttons and small spaces
export const InlineSpinner = ({ size = "small", variant = "white" }) => (
  <Spinner
    size={size}
    variant={variant}
    className="inline-flex"
    showText={false}
  />
);

export default Spinner;
