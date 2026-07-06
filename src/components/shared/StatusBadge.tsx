import { Badge } from "../ui/Badge";

type StatusBadgeProps = {
  status: "issued" | "cancelled" | "draft" | "contingency";
};

const statusMap = {
  issued: {
    label: "Emitida",
    variant: "success",
  },
  cancelled: {
    label: "Cancelada",
    variant: "default",
  },
  draft: {
    label: "Rascunho",
    variant: "info",
  },
  contingency: {
    label: "Contingência",
    variant: "warning",
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
