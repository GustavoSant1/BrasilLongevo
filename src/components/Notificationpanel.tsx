// ============================================================
// COMPONENTE — src/components/NotificationPanel.tsx  (novo)
// Painel lateral que desliza da direita ao clicar no sino.
// Lista automaticamente os pacientes com status "late" ou "urgent".
// ============================================================

import { Bell, X, CheckCircle, Eye } from "lucide-react";
import type { Patient } from "../types/patient";
import StatusBadge, { STATUS_CONFIG } from "./Statusbadge";

interface Props {
  patients: Patient[];
  onClose: () => void;
  onViewPatient: (patient: Patient) => void; // abre o PatientModal
}

export default function NotificationPanel({
  patients,
  onClose,
  onViewPatient,
}: Props) {
  // Filtra apenas os que precisam de atenção
  const alerts = patients.filter(
    (p) => p.status === "late" || p.status === "urgent"
  );

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        right: 0,
        bottom: 0,
        width: 340,
        background: "#fff",
        boxShadow: "-4px 0 30px rgba(0,0,0,0.12)",
        zIndex: 90,
        display: "flex",
        flexDirection: "column",
        fontFamily: "inherit",
      }}
    >
      {/* Cabeçalho do painel */}
      <div
        style={{
          background: "linear-gradient(135deg, #1d4ed8, #3b82f6)",
          padding: "22px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10, color: "#fff" }}>
          <Bell size={18} />
          <span style={{ fontSize: 17, fontWeight: 700 }}>
            Alertas ({alerts.length})
          </span>
        </div>

        <button
          onClick={onClose}
          style={{
            background: "rgba(255,255,255,0.2)",
            border: "none",
            borderRadius: 10,
            color: "#fff",
            width: 34,
            height: 34,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <X size={15} />
        </button>
      </div>

      {/* Lista de alertas */}
      <div style={{ overflowY: "auto", flex: 1, padding: 16 }}>
        {alerts.length === 0 ? (
          // Mensagem quando não há alertas
          <div
            style={{
              textAlign: "center",
              padding: 40,
              color: "#94a3b8",
            }}
          >
            <CheckCircle size={32} style={{ marginBottom: 8, color: "#22c55e" }} />
            <div style={{ fontSize: 14 }}>Nenhum alerta pendente</div>
          </div>
        ) : (
          alerts.map((patient) => {
            const { bg, color } = STATUS_CONFIG[patient.status];
            return (
              <div
                key={patient.id}
                style={{
                  background: bg,
                  border: `1px solid ${color}33`,
                  borderRadius: 14,
                  padding: 14,
                  marginBottom: 12,
                }}
              >
                {/* Nome e status */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    marginBottom: 8,
                  }}
                >
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: "#1e293b" }}>
                      {patient.name}
                    </div>
                    <div style={{ fontSize: 12, color: "#64748b", marginTop: 2 }}>
                      {patient.age} anos
                    </div>
                  </div>
                  <StatusBadge status={patient.status} />
                </div>

                {/* Nota do paciente */}
                <div
                  style={{
                    fontSize: 12,
                    color: "#475569",
                    lineHeight: 1.5,
                    marginBottom: 10,
                  }}
                >
                  {patient.notes}
                </div>

                {/* Botão para abrir o modal desse paciente */}
                <button
                  onClick={() => {
                    onViewPatient(patient);
                    onClose();
                  }}
                  style={{
                    width: "100%",
                    padding: "8px",
                    borderRadius: 10,
                    border: `1.5px solid ${color}`,
                    background: "#fff",
                    color: color,
                    cursor: "pointer",
                    fontSize: 12,
                    fontWeight: 700,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 6,
                  }}
                >
                  <Eye size={12} />
                  Ver Detalhes
                </button>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}