import React, { ReactNode } from "react";

interface ButtonProps {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
  variant?: "primary" | "secondary";
}

const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  className = "",
  variant = "primary",
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
      className={`flex justify-center items-center gap-2 px-6 py-3 text-sm font-bold rounded-2xl drop-shadow-md transition-all duration-300 w-full text-nowrap active:scale-105 hover:opacity-85 ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
};

export default Button;
