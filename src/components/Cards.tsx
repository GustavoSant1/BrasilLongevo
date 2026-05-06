// ============================================================
// COMPONENTE — src/components/Cards.tsx  (arquivo já existia)
// Exibe os 4 cards de resumo no topo da página:
// Total, Em Dia, Atrasados, Urgente.
// Recebe os dados calculados do App.tsx via props.
// ============================================================

import { Users, CheckCircle, Clock, AlertTriangle } from "lucide-react";

interface Props {
  total: number;
  onTime: number;  // pacientes com status "ok"
  late: number;    // pacientes com status "late" ou "partial"
  urgent: number;  // pacientes com status "urgent"
}

// Cada card tem: rótulo, valor, ícone, cor e cor de fundo do ícone
const CARD_CONFIG = [
  { key: "total",   label: "Total de Pacientes", Icon: Users,         color: "#3b82f6", bg: "#eff6ff" },
  { key: "onTime",  label: "Remédios em Dia",    Icon: CheckCircle,   color: "#22c55e", bg: "#f0fdf4" },
  { key: "late",    label: "Atrasados",           Icon: Clock,         color: "#f59e0b", bg: "#fffbeb" },
  { key: "urgent",  label: "Urgente",             Icon: AlertTriangle, color: "#ef4444", bg: "#fff1f2" },
];

export default function Cards({ total, onTime, late, urgent }: Props) {
  const values: Record<string, number> = { total, onTime, late, urgent };

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(4, 1fr)",
        gap: 16,
        marginBottom: 24,
      }}
    >
      {CARD_CONFIG.map(({ key, label, Icon, color, bg }) => (
        <div
          key={key}
          style={{
            background: "#fff",
            borderRadius: 16,
            padding: "18px 20px",
            boxShadow: "0 1px 4px rgba(255, 255, 255, 0.06)",
            display: "flex",
            alignItems: "center",
            gap: 14,
          }}
        >
          {/* Ícone com fundo colorido */}
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: 12,
              background: bg,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Icon size={20} color={color} />
          </div>

          {/* Texto */}
          <div>
            <div style={{ fontSize: 12, color: "#94a3b8", fontWeight: 600 }}>
              {label}
            </div>
            <div style={{ fontSize: 26, fontWeight: 800, color }}>
              {values[key]}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}