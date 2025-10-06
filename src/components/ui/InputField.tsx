import clsx from "clsx";
import type React from "react";
import { forwardRef } from "react";

// interface InputProps {
//   type?: "text" | "number" | "email" | "password" | "date" | "time" | string;
//   id?: string;
//   name?: string;
//   placeholder?: string;
//   defaultValue?: string | number;
//   onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
//   className?: string;
//   min?: string | number;
//   max?: string | number;
//   step?: number;
//   disabled?: boolean;
//   success?: boolean;
//   error?: boolean;
//   hint?: string;
// }

// const Input = forwardRef<HTMLInputElement, InputProps>(
//   (
//     {
//       type = "text",
//       id,
//       name,
//       placeholder,
//       defaultValue,
//       onChange,
//       className = "",
//       min,
//       max,
//       step,
//       disabled = false,
//       success = false,
//       error = false,
//       hint,
//     },
//     ref
//   ) => {
//     const base =
//       // sizing / layout
//       "h-11 w-full rounded-lg border px-4 py-2.5 text-sm shadow-theme-xs transition-colors " +
//       // default (light)
//       "bg-white text-zinc-900 placeholder-gray-400 border-zinc-300 " +
//       "focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 " +
//       // default (dark)
//       "dark:bg-zinc-900 dark:text-zinc-100 dark:placeholder-gray-400 dark:border-zinc-400 " +
//       "dark:focus:border-brand-400 dark:focus:ring-brand-400/25 " +
//       // caret + native controls awareness
//       "caret-zinc-900 dark:caret-zinc-100 [color-scheme:light] dark:[color-scheme:dark]";

//     const state = clsx({
//       // disabled
//       "opacity-50 cursor-not-allowed bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400":
//         disabled && !error && !success,
//       // error
//       "border-red-500 focus:border-red-500 focus:ring-red-500/20 dark:border-red-500 dark:focus:border-red-400":
//         error,
//       // success
//       "border-green-500 focus:border-green-500 focus:ring-green-500/20 dark:border-green-500 dark:focus:border-green-400":
//         success,
//     });

//     return (
//       <div className="relative">
//         <input
//           ref={ref} // ✅ important for react-hook-form
//           type={type}
//           id={id}
//           name={name}
//           placeholder={placeholder}
//           defaultValue={defaultValue}
//           onChange={onChange}
//           min={min}
//           max={max}
//           step={step}
//           disabled={disabled}
//           className={clsx(base, state, className)}
//         />
//         {hint && (
//           <p
//             className={clsx(
//               "mt-1.5 text-xs",
//               error
//                 ? "text-red-600 dark:text-red-400"
//                 : success
//                 ? "text-green-600 dark:text-green-400"
//                 : "text-zinc-500 dark:text-zinc-400"
//             )}
//           >
//             {hint}
//           </p>
//         )}
//       </div>
//     );
//   }
// );

// Input.displayName = "Input";

// export default Input;

/** Add your custom props on top of the native input props */
export type InputProps = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "size"
> & {
  /** visual state helpers */
  success?: boolean;
  error?: boolean;
  hint?: string;
};

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      disabled = false,
      success = false,
      error = false,
      hint,
      id,
      ...props
    },
    ref
  ) => {
    const base =
      // sizing / layout
      "h-11 w-full rounded-lg border px-4 py-2.5 text-sm shadow-theme-xs transition-colors " +
      // default (light)
      "bg-white text-zinc-900 placeholder-gray-400 border-zinc-300 " +
      "focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 " +
      // default (dark)
      "dark:bg-zinc-900 dark:text-zinc-100 dark:placeholder-gray-400 dark:border-zinc-400 " +
      "dark:focus:border-brand-400 dark:focus:ring-brand-400/25 " +
      // caret + native controls awareness
      "caret-zinc-900 dark:caret-zinc-100 [color-scheme:light] dark:[color-scheme:dark]";

    const state = clsx({
      "opacity-50 cursor-not-allowed bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400":
        disabled && !error && !success,
      "border-red-500 focus:border-red-500 focus:ring-red-500/20 dark:border-red-500 dark:focus:border-red-400":
        error,
      "border-green-500 focus:border-green-500 focus:ring-green-500/20 dark:border-green-500 dark:focus:border-green-400":
        success,
    });

    // Accessible hint link if provided
    const hintId = hint ? `${id ?? "input"}-hint` : undefined;

    return (
      <div className="relative">
        <input
          ref={ref}
          id={id}
          disabled={disabled}
          className={clsx(base, state, className)}
          aria-invalid={error || undefined}
          aria-describedby={hintId}
          {...props} // <-- all native props/events (inputMode, onWheel, onKeyDown, etc.)
        />
        {hint && (
          <p
            id={hintId}
            className={clsx(
              "mt-1.5 text-xs",
              error
                ? "text-red-600 dark:text-red-400"
                : success
                ? "text-green-600 dark:text-green-400"
                : "text-zinc-500 dark:text-zinc-400"
            )}
          >
            {hint}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
export default Input;
