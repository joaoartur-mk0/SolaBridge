import type { CustomerType } from "../../types/common";
import { cn } from "../../utils/cn";

const personTypes: CustomerType[] = ["Pessoa Física", "Pessoa Jurídica"];

type PersonTypeToggleProps = {
  value: CustomerType;
  onChange: (type: CustomerType) => void;
};

export function PersonTypeToggle({ value, onChange }: PersonTypeToggleProps) {
  return (
    <div className="inline-flex rounded-lg border border-slate-700 bg-slate-950 p-1">
      {personTypes.map((type) => (
        <button
          key={type}
          type="button"
          onClick={() => onChange(type)}
          className={cn(
            "rounded-md px-4 py-1.5 text-sm font-medium transition",
            value === type
              ? "bg-brand text-slate-50"
              : "text-slate-400 hover:text-slate-100"
          )}
        >
          {type}
        </button>
      ))}
    </div>
  );
}
