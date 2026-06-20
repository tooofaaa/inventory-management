"use client";
import * as React from "react";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary";
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, children, variant = "primary", ...props }, ref) => {
    const baseStyles =
      "cursor-pointer font-medium rounded-xl py-2.5 px-5 transition-all duration-300 transform hover:-translate-y-0.5 shadow-sm hover:shadow-md active:translate-y-0 active:shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none flex items-center justify-center gap-2";
    const disabledStyles =
      "disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none disabled:hover:shadow-none";
    const variantStyles =
      variant === "primary"
        ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 border border-transparent"
        : "bg-white text-gray-800 border border-gray-200 hover:border-gray-300 hover:bg-gray-50 shadow-sm";

    const mergedClasses = [baseStyles, disabledStyles, variantStyles, className]
      .filter(Boolean)
      .join(" ");

    return (
      <button className={mergedClasses} ref={ref} {...props}>
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";

export { Button };
