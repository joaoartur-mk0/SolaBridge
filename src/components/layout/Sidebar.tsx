import { NavLink } from "react-router-dom";

import { cn } from "../../utils/cn";

const navigationItems = [
  {
    label: "Dashboard",
    href: "/",
  },
  {
    label: "Clientes",
    href: "/customers",
  },
  {
    label: "Serviços",
    href: "/services",
  },
  {
    label: "Emitir NFS-e",
    href: "/invoices/new",
  },
  {
    label: "Notas fiscais",
    href: "/invoices",
    end: true,
  },
  {
    label: "Plano de Contas",
    href: "/accounts",
  },
  {
    label: "Lançamentos",
    href: "/ledger",
  },
  {
    label: "Configurações",
    href: "/settings",
  },
];

export function Sidebar() {
  return (
    <aside className="hidden min-h-screen w-72 border-r border-slate-800 bg-slate-950 px-4 py-6 lg:block">
      <div className="mb-8">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-lime-400">
          SolaBridge
        </p>

        <h1 className="mt-2 text-xl font-bold text-slate-50">
          Gestão contábil
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          Financeiro, serviços e NFS-e
        </p>
      </div>

      <nav className="space-y-1">
        {navigationItems.map((item) => (
          <NavLink
            key={item.href}
            to={item.href}
            end={item.end ?? item.href === "/"}
            className={({ isActive }) =>
              cn(
                "flex items-center rounded-xl px-3 py-2.5 text-sm font-medium transition",
                isActive
                  ? "bg-lime-400 text-slate-950"
                  : "text-slate-400 hover:bg-slate-900 hover:text-slate-100"
              )
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}