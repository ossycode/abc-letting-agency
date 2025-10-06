import React, { forwardRef } from "react";
import clsx from "clsx";

export type TextAreaProps = Omit<
  React.TextareaHTMLAttributes<HTMLTextAreaElement>,
  "rows"
> & {
  error?: boolean;
  hint?: string;
  rows?: number; // optional, with a default
  /** Optional convenience: fires with the string value only */
  onValueChange?: (value: string) => void;
};

const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
  (
    {
      className,
      disabled = false,
      error = false,
      hint,
      id,
      rows = 3,
      onChange,
      onValueChange,
      ...props
    },
    ref
  ) => {
    const base =
      "w-full rounded-lg border px-4 py-2.5 text-sm shadow-theme-xs " +
      "transition-colors focus:outline-none " +
      "bg-transparent text-gray-900 placeholder-gray-400 border-gray-300 " +
      "focus:border-brand-300 focus:ring-2 focus:ring-brand-500/10 " +
      "dark:bg-gray-900 dark:text-white/90 dark:placeholder-gray-400 dark:border-gray-700 " +
      "dark:focus:border-brand-800";

    const state = clsx({
      "opacity-50 cursor-not-allowed bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400":
        disabled && !error,
      "border-error-500 focus:border-error-500 focus:ring-error-500/15 dark:border-error-500 dark:focus:border-error-400":
        error,
    });

    const hintId = hint ? `${id ?? "textarea"}-hint` : undefined;

    const handleChange: React.ChangeEventHandler<HTMLTextAreaElement> = (e) => {
      onValueChange?.(e.target.value);
      onChange?.(e);
    };

    return (
      <div className="relative">
        <textarea
          ref={ref}
          id={id}
          rows={rows}
          disabled={disabled}
          aria-invalid={error || undefined}
          aria-describedby={hintId}
          className={clsx(base, state, className)}
          onChange={handleChange}
          {...props}
        />
        {hint && (
          <p
            id={hintId}
            className={clsx(
              "mt-1.5 text-xs",
              error ? "text-error-500" : "text-gray-500 dark:text-gray-400"
            )}
          >
            {hint}
          </p>
        )}
      </div>
    );
  }
);

TextArea.displayName = "TextArea";
export default TextArea;
