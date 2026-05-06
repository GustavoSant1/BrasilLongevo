
// COMPONENTE — src/components/StatusBadge.tsx
// Badge colorido que aparece em vários lugares:
// na tabela de pacientes e dentro do modal de detalhes.
// Por isso fica em um arquivo separado (evita repetição).


import { CheckCircle, AlertCircle, Clock, AlertTriangle } from "lucide-react";
import type { PatientStatus } from "../types/Patient";

// Cada status tem: texto, cor do texto, cor de fundo e ícone
export const STATUS_CONFIG = {
  ok:      { label: "Remédios em Dia",      color: "#22c55e", bg: "#dcfce7", Icon: CheckCircle },
  partial: { label: "Parcialmente em Dia",  color: "#f59e0b", bg: "#fef3c7", Icon: AlertCircle },
  late:    { label: "Atrasado — 1 dose",    color: "#f97316", bg: "#ffedd5", Icon: Clock },
  urgent:  { label: "Urgente — 2 doses",    color: "#ef4444", bg: "#fee2e2", Icon: AlertTriangle },
};

interface Props {
  status: PatientStatus;
}

export default function StatusBadge({ status }: Props) {
  const { label, color, bg, Icon } = STATUS_CONFIG[status];

  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 5,
        background: bg,
        color: color,
        padding: "4px 10px",
        borderRadius: 20,
        fontSize: 12,
        fontWeight: 600,
      }}
    >
      <Icon size={13} />
      {label}
    </span>
  );
}