import { useState } from "react";
import { NavLink } from "react-router-dom";
import { LayoutDashboard, FileText, ReceiptText, Menu, X } from "lucide-react";

import { cn } from "../../utils/cn";
import { navigationGroups } from "./navigation";

const primaryItems = [
  { label: "Dashboard", href: "/", icon: LayoutDashboard, end: true },
  { label: "Notas", href: "/invoices", icon: FileText, end: true },
];

export function MobileNav() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <>
      {isMenuOpen && (
        <button
          type="button"
          aria-label="Fechar menu"
          onClick={() => setIsMenuOpen(false)}
          className="fixed inset-0 z-40 bg-slate-950/70 backdrop-blur-sm lg:hidden"
        />
      )}

      {isMenuOpen && (
        <div className="fixed inset-x-0 bottom-0 z-50 max-h-[75vh] overflow-y-auto rounded-t-2xl border-t border-slate-800 bg-slate-950 pb-[max(1rem,env(safe-area-inset-bottom))] pt-4 lg:hidden">
          <div className="flex items-center justify-between px-5 pb-3">
            <p className="text-sm font-semibold text-slate-100">Menu</p>

            <button
              type="button"
              onClick={() => setIsMenuOpen(false)}
              aria-label="Fechar menu"
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-700 text-slate-400 transition hover:bg-slate-800"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <nav className="space-y-5 px-5 pb-2">
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
                    onClick={() => setIsMenuOpen(false)}
                    className={({ isActive }) =>
                      cn(
                        "flex items-center rounded-xl px-3 py-2.5 text-sm font-medium transition",
                        isActive
                          ? "bg-lime-400 text-slate-950"
                          : "text-slate-300 hover:bg-slate-900"
                      )
                    }
                  >
                    {item.label}
                  </NavLink>
                ))}
              </div>
            ))}
          </nav>
        </div>
      )}

      <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-slate-800 bg-slate-950/95 backdrop-blur lg:hidden">
        <div className="mx-auto flex max-w-md items-center justify-around px-2 pb-[env(safe-area-inset-bottom)] pt-1.5">
          {primaryItems.map((item) => (
            <NavLink
              key={item.href}
              to={item.href}
              end={item.end}
              className="flex flex-1 flex-col items-center gap-1 py-2 text-xs font-medium"
            >
              {({ isActive }) => (
                <>
                  <item.icon
                    className={cn("h-5 w-5", isActive ? "text-lime-400" : "text-slate-500")}
                  />
                  <span className={isActive ? "text-lime-400" : "text-slate-500"}>
                    {item.label}
                  </span>
                </>
              )}
            </NavLink>
          ))}

          <NavLink
            to="/invoices/new"
            className="flex flex-1 flex-col items-center gap-1 py-1 text-xs font-medium"
          >
            <span className="-mt-5 flex h-11 w-11 items-center justify-center rounded-full border-4 border-slate-950 bg-lime-400 text-slate-950 shadow-lg">
              <ReceiptText className="h-5 w-5" />
            </span>
            <span className="text-slate-300">Emitir</span>
          </NavLink>

          <button
            type="button"
            onClick={() => setIsMenuOpen(true)}
            className="flex flex-1 flex-col items-center gap-1 py-2 text-xs font-medium text-slate-500"
          >
            <Menu className="h-5 w-5" />
            <span>Mais</span>
          </button>
        </div>
      </nav>
    </>
  );
}