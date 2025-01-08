import React from "react";

type InputProps = {
  inputId?: string;
  label?: string;
  type?: "text" | "email" | "password" | "date";
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
};

const Input = ({
  inputId,
  label,
  type = "text",
  placeholder,
  value,
  onChange,
  className,
}: InputProps) => {
  return (
    <div className="flex flex-col gap-2 w-full">
      {label && (
        <label htmlFor={inputId} className="lg:text-lg font-medium">
          {label}
        </label>
      )}
      <input
        id={inputId}
        placeholder={placeholder}
        type={type}
        value={value}
        onChange={onChange}
        className={`w-full px-4 py-2.5 outline-none rounded-md border bg-transparent ${className}`}
      />
    </div>
  );
};

export default Input;
