export function Header() {
  return (
    <header className="flex h-16 items-center justify-between border-b border-slate-800 bg-slate-950/80 px-6 backdrop-blur">
      <div>
        <p className="text-sm text-slate-400">Bem-vindo ao</p>
        <h2 className="text-base font-semibold text-slate-100">SolaBridge</h2>
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden text-right sm:block">
          <p className="text-sm font-medium text-slate-100">Usuário Demo</p>
          <p className="text-xs text-slate-500">Empresa de Serviços</p>
        </div>

        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-lime-400 text-sm font-bold text-slate-950">
          SB
        </div>
      </div>
    </header>
  );
}