export type NavigationItem = {
  label: string;
  href: string;
  end?: boolean;
};

export type NavigationGroup = {
  title?: string;
  items: NavigationItem[];
};

export const navigationGroups: NavigationGroup[] = [
  {
    items: [{ label: "Dashboard", href: "/", end: true }],
  },
  {
    title: "NFS-e",
    items: [
      { label: "Clientes", href: "/customers" },
      { label: "Serviços", href: "/services" },
      { label: "Emitir NFS-e", href: "/invoices/new" },
      { label: "Notas fiscais", href: "/invoices", end: true },
    ],
  },
  {
    title: "Contabilidade",
    items: [
      { label: "Plano de Contas", href: "/accounts" },
      { label: "Lançamentos", href: "/ledger" },
    ],
  },
  {
    title: "Relatórios",
    items: [
      { label: "Balanço Patrimonial", href: "/balanco" },
      { label: "DRE", href: "/dre" },
      { label: "Liquidez Corrente", href: "/liquidez" },
      { label: "Extrato / Razão", href: "/extrato" },
    ],
  },
  {
    items: [{ label: "Configurações", href: "/settings" }],
  },
];