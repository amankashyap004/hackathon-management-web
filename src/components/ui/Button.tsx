import React, { ReactNode } from "react";

interface ButtonProps {
  children: ReactNode;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  className?: string;
  variant?: "primary" | "secondary";
  disabled?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  className = "",
  type = "button",
  variant = "primary",
  disabled = false,
}) => {
  const variants = {
    primary:
      "bg-[#424242] shadow-[#ffffff50_0px_-1px_1px_1px,#42424250_0px_-2px_2px_1px_inset]",
    secondary:
      "text-black bg-[#F9FB44] shadow-[#F9FB4480_0px_-1px_1px_1px,#3423AA50_0px_-1px_2px_1px_inset]",
  };

  return (
    <button
      onClick={onClick}
      type={type}
      disabled={disabled}
      className={`flex justify-center items-center gap-2 px-6 py-3 text-sm font-bold rounded-2xl drop-shadow-md transition-all duration-300 w-full text-nowrap active:scale-105 hover:opacity-85 ${
        variants[variant]
      } ${className} ${
        disabled ? "cursor-not-allowed opacity-50 hover:opacity-50" : "cursor-pointer"
      }`}
    >
      {children}
    </button>
  );
};

export default Button;
