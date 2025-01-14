import React from "react";

type InputProps = {
  inputId?: string;
  label?: string;
  name?: string;
  type?: "text" | "email" | "password" | "date" | "file";
  placeholder?: string;
  required?: boolean;
  accept?: string;
  disabled?: boolean;
  value?: string;
  min?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
};

const Input = ({
  inputId,
  label,
  name,
  type = "text",
  placeholder,
  required,
  value,
  onChange,
  accept,
  disabled,
  min,
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
        name={name}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        type={type}
        value={value}
        accept={accept}
        min={min}
        onChange={onChange}
        className={`w-full px-4 py-2.5 outline-none rounded-md border bg-transparent ${className}`}
      />
    </div>
  );
};

export default Input;
