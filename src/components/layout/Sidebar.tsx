const menuItems = [
  { label: "Dashboard", href: "#" },
  { label: "Clientes", href: "#" },
  { label: "Serviços", href: "#" },
  { label: "Emitir NFS-e", href: "#" },
  { label: "Notas fiscais", href: "#" },
  { label: "Financeiro", href: "#" },
  { label: "Configurações", href: "#" },
];

export function Sidebar() {
  return (
    <aside className="hidden min-h-screen w-64 border-r border-slate-800 bg-slate-950 px-4 py-6 lg:block">
      <div className="mb-8">
        <h1 className="text-xl font-bold text-slate-50">
          Sola<span className="text-lime-400">Bridge</span>
        </h1>
        <p className="mt-1 text-xs text-slate-500">
          Gestão contábil e NFS-e
        </p>
      </div>

      <nav className="space-y-1">
        {menuItems.map((item, index) => (
          <a
            key={item.label}
            href={item.href}
            className={`block rounded-lg px-3 py-2 text-sm transition ${
              index === 0
                ? "bg-lime-400 text-slate-950 font-medium"
                : "text-slate-400 hover:bg-slate-900 hover:text-slate-100"
            }`}
          >
            {item.label}
          </a>
        ))}
      </nav>
    </aside>
  );
}