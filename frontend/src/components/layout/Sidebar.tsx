import { NavLink } from "react-router-dom";

import { cn } from "../../utils/cn";
import { navigationGroups } from "./navigation";

export function Sidebar() {
  return (
    <aside className="hidden min-h-screen w-72 border-r border-slate-800 bg-slate-950 px-4 py-6 lg:block">
      <div className="mb-8">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-brand-light">
          SolaBridge
        </p>

        <h1 className="mt-2 text-xl font-bold text-slate-50">
          Gestão contábil
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          Financeiro, serviços e NFS-e
        </p>
      </div>

      <nav className="space-y-5">
        {navigationGroups.map((group, groupIndex) => (
          <div key={group.title ?? groupIndex} className="space-y-1">
            {group.title && (
              <p className="px-3 text-xs font-semibold uppercase tracking-wider text-slate-600">
                {group.title}
              </p>
            )}

            {group.items.map((item) => (
              <NavLink
                key={item.href}
                to={item.href}
                end={item.end ?? false}
                className={({ isActive }) =>
                  cn(
                    "flex items-center rounded-xl px-3 py-2.5 text-sm font-medium transition",
                    isActive
                      ? "bg-brand text-slate-50"
                      : "text-slate-400 hover:bg-slate-900 hover:text-slate-100"
                  )
                }
              >
                {item.label}
              </NavLink>
            ))}
          </div>
        ))}
      </nav>
    </aside>
  );
}