import type { ReactNode } from "react";

type SectionHeaderProps = {
  title: string;
  description?: string;
  action?: ReactNode;
};

export function SectionHeader({ title, description, action }: SectionHeaderProps) {
  return (
    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
      <div>
        <h2 className="text-lg font-semibold text-slate-100">{title}</h2>

        {description && (
          <p className="mt-1 text-sm text-slate-400">{description}</p>
        )}
      </div>

      {action && <div>{action}</div>}
    </div>
  );
}