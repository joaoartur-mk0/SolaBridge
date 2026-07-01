import type { InputHTMLAttributes } from "react";
import { cn } from "../../utils/cn";

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  error?: string;
};

export function Input({ label, error, className, id, ...props }: InputProps) {
  return (
    <div className="space-y-2">
      {label && (
        <label htmlFor={id} className="text-sm font-medium text-slate-200">
          {label}
        </label>
      )}

      <input
        id={id}
        className={cn(
          "w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 outline-none transition placeholder:text-slate-500 focus:border-lime-400 focus:ring-2 focus:ring-lime-400/20",
          error && "border-red-400 focus:border-red-400 focus:ring-red-400/20",
          className
        )}
        {...props}
      />

      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  );
}