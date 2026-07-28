import { useState, type FormEvent } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Loader2, ReceiptText, ShieldCheck, Wallet } from "lucide-react";

import { useAuth } from "../../contexts/AuthContext";

import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { Input } from "../../components/ui/Input";

const highlights = [
  {
    icon: ReceiptText,
    title: "Emissão de NFS-e",
    description: "DANFSe fiel à Nota Técnica 008, do wizard de emissão ao PDF final.",
  },
  {
    icon: Wallet,
    title: "Contabilidade de partidas dobradas",
    description: "Plano de contas, lançamentos, balanço, DRE, liquidez e extrato.",
  },
  {
    icon: ShieldCheck,
    title: "Multi-tenant",
    description: "Cada empresa prestadora de serviço com seus próprios dados isolados.",
  },
];

type LocationState = {
  from?: { pathname: string };
};

export function LoginPage() {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (user) {
    const redirectTo = (location.state as LocationState | null)?.from?.pathname ?? "/";
    return <Navigate to={redirectTo} replace />;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    const result = await login({ email, password });

    setIsSubmitting(false);

    if (!result.success) {
      setError(result.message ?? "Não foi possível entrar. Tente novamente.");
      return;
    }

    const redirectTo = (location.state as LocationState | null)?.from?.pathname ?? "/";
    navigate(redirectTo, { replace: true });
  }

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-100">
      <div className="relative hidden w-1/2 flex-col justify-between overflow-hidden border-r border-slate-800 bg-slate-900/40 p-12 lg:flex">
        <div
          className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-brand/10 blur-3xl"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute bottom-0 right-0 h-96 w-96 rounded-full bg-brand/5 blur-3xl"
          aria-hidden
        />

        <div className="relative">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-brand-light">
            SolaBridge
          </p>
          <h1 className="mt-3 max-w-md text-3xl font-bold leading-tight text-slate-50">
            Gestão contábil e emissão de NFS-e para prestadores de serviço
          </h1>
          <p className="mt-4 max-w-sm text-sm text-slate-400">
            Centralize clientes, serviços, notas fiscais e a contabilidade da sua empresa em um
            só lugar.
          </p>
        </div>

        <div className="relative space-y-6">
          {highlights.map((highlight) => (
            <div key={highlight.title} className="flex items-start gap-4">
              <div className="flex h-10 w-10 flex-none items-center justify-center rounded-xl border border-brand/30 bg-brand/10 text-brand-light">
                <highlight.icon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-100">{highlight.title}</p>
                <p className="mt-0.5 text-sm text-slate-400">{highlight.description}</p>
              </div>
            </div>
          ))}
        </div>

        <p className="relative text-xs text-slate-600">
          © {new Date().getFullYear()} SolaBridge. Projeto acadêmico de gestão contábil.
        </p>
      </div>

      <div className="flex w-full flex-1 flex-col items-center justify-center px-6 py-12 lg:w-1/2">
        <div className="w-full max-w-sm">
          <div className="mb-8 text-center lg:text-left">
            <div className="mx-auto mb-4 flex h-11 w-11 items-center justify-center rounded-full bg-brand text-sm font-bold text-slate-50 lg:mx-0">
              SB
            </div>
            <h2 className="text-xl font-semibold text-slate-50">Entrar no SolaBridge</h2>
            <p className="mt-1 text-sm text-slate-400">
              Acesse com o e-mail e a senha da sua conta.
            </p>
          </div>

          <Card>
            <form className="space-y-5" onSubmit={handleSubmit} noValidate>
              <Input
                label="E-mail"
                id="email"
                type="email"
                autoComplete="username"
                placeholder="voce@empresa.com"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
              />

              <div className="relative">
                <Input
                  label="Senha"
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  className="pr-10"
                  required
                />

                <button
                  type="button"
                  onClick={() => setShowPassword((current) => !current)}
                  className="absolute right-3 top-8.5 text-slate-500 transition hover:text-slate-300"
                  aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>

              {error && (
                <p className="rounded-lg border border-danger/30 bg-danger/10 px-3 py-2 text-sm text-danger">
                  {error}
                </p>
              )}

              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Entrando…
                  </>
                ) : (
                  "Entrar"
                )}
              </Button>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
}