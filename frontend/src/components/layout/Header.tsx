import { useNavigate } from "react-router-dom";

import { useAuth } from "../../contexts/AuthContext";
import { Dropdown } from "../ui/Dropdown";

function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

export function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/login", { replace: true });
  }

  return (
    <header className="flex h-16 items-center justify-between border-b border-slate-800 bg-slate-950/80 px-6 backdrop-blur">
      <div>
        <p className="text-sm text-slate-400">Bem-vindo ao</p>
        <h2 className="text-base font-semibold text-slate-100">SolaBridge</h2>
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden text-right sm:block">
          <p className="text-sm font-medium text-slate-100">{user?.name ?? "Usuário"}</p>
          <p className="text-xs text-slate-500">{user?.role ?? "—"}</p>
        </div>

        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-lime-400 text-sm font-bold text-slate-950">
          {user ? getInitials(user.name) : "SB"}
        </div>

        <Dropdown items={[{ label: "Sair", onClick: handleLogout, variant: "danger" }]} />
      </div>
    </header>
  );
}