import { Badge } from "../ui/Badge";

type StatusBadgeProps = {
  status: "issued" | "pending" | "rejected" | "cancelled" | "draft";
};

const statusMap = {
  issued: {
    label: "Emitida",
    variant: "success",
  },
  pending: {
    label: "Pendente",
    variant: "warning",
  },
  rejected: {
    label: "Rejeitada",
    variant: "danger",
  },
  cancelled: {
    label: "Cancelada",
    variant: "default",
  },
  draft: {
    label: "Rascunho",
    variant: "info",
  },
} as const;

export function StatusBadge({ status }: StatusBadgeProps) {
  const currentStatus = statusMap[status];

  return (
    <Badge variant={currentStatus.variant}>
      {currentStatus.label}
    </Badge>
  );
}