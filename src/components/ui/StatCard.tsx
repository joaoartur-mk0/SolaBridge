import type { ReactNode } from "react";
import { Card, CardContent } from "./Card";

type StatCardProps = {
  title: string;
  value: ReactNode;
  description?: string;
  icon?: ReactNode;
};

export function StatCard({ title, value, description, icon }: StatCardProps) {
  return (
    <Card>
      <CardContent>
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-slate-400">{title}</p>
            <p className="mt-2 text-2xl font-bold text-slate-50">{value}</p>

            {description && (
              <p className="mt-1 text-xs text-slate-500">{description}</p>
            )}
          </div>

          {icon && (
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-lime-400/10 text-lime-300">
              {icon}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}