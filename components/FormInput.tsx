import React from "react";

interface FormInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  helperText?: string;
}

export default function FormInput({
  label,
  error,
  helperText,
  id,
  className = "",
  required,
  ...props
}: FormInputProps) {
  const inputId = id || label.toLowerCase().replace(/\s+/g, "-");

  return (
    <div className="w-full flex flex-col gap-1.5">
      <label
        htmlFor={inputId}
        className="text-sm font-semibold text-gray-700 flex items-center gap-1"
      >
        {label}
        {required && <span className="text-emerald-600">*</span>}
      </label>
      <input
        id={inputId}
        required={required}
        className={`w-full px-4 py-2.5 rounded-xl border ${
          error
            ? "border-red-400 focus:ring-red-200 focus:border-red-500"
            : "border-gray-200 focus:ring-emerald-200 focus:border-emerald-600"
        } bg-white text-gray-800 placeholder-gray-400 text-sm shadow-sm transition-all duration-150 focus:outline-none focus:ring-4 ${className}`}
        {...props}
      />
      {error && <span className="text-xs text-red-600 font-medium">{error}</span>}
      {helperText && !error && (
        <span className="text-xs text-gray-500">{helperText}</span>
      )}
    </div>
  );
}

