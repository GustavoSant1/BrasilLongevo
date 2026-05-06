
// COMPONENTE — src/components/modals/PatientModal.tsx  (novo)
// Modal de detalhes do paciente. Abre ao clicar em "Ver".
// Mostra: info pessoal, condições, medicamentos com doses,
// observações e status geral.


import {
  X, Edit3, Phone, MapPin, Calendar, Stethoscope,
  Activity, Pill, CheckCircle, FileText,
} from "lucide-react";
import type { Patient } from "../../types/Patient";
import StatusBadge from "../Statusbadge";

interface Props {
  patient: Patient | null;
  onClose: () => void;
  onEdit: (patient: Patient) => void;
}

export default function PatientModal({ patient, onClose, onEdit }: Props) {
  // Se não há paciente selecionado, não renderiza nada
  if (!patient) return null;

  return (
    // Fundo escuro semitransparente (overlay)
    <div
      onClick={onClose} // fecha ao clicar fora
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(255, 255, 255, 0.55)",
        zIndex: 100,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backdropFilter: "blur(4px)",
        padding: 20,
      }}
    >
      {/* Caixa do modal — para o clique aqui para não fechar */}
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "#fff",
          borderRadius: 20,
          width: "100%",
          maxWidth: 620,
          maxHeight: "90vh",
          overflowY: "auto",
          boxShadow: "0 25px 60px rgba(0,0,0,0.2)",
          fontFamily: "inherit",
        }}
      >
        {/* Cabeçalho azul */}
        <div
          style={{
            background: "linear-gradient(135deg, #000000, #3b82f6)",
            borderRadius: "20px 20px 0 0",
            padding: "24px 28px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
          }}
        >
          {/* Avatar + nome */}
          <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
            <div
              style={{
                width: 52,
                height: 52,
                borderRadius: "50%",
                background: "rgba(255,255,255,0.25)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 22,
                color: "#fff",
                fontWeight: 700,
              }}
            >
              {patient.name[0]}
            </div>
            <div>
              <div style={{ color: "#fff", fontSize: 20, fontWeight: 700 }}>
                {patient.name}
              </div>
              <div style={{ color: "rgba(255,255,255,0.8)", fontSize: 13 }}>
                {patient.age} anos • {patient.doctor}
              </div>
            </div>
          </div>

          {/* Botões do cabeçalho */}
          <div style={{ display: "flex", gap: 8 }}>
            <button
              onClick={() => onEdit(patient)}
              style={{
                background: "rgba(255,255,255,0.2)",
                border: "none",
                borderRadius: 10,
                color: "#fff",
                padding: "8px 14px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 6,
                fontSize: 13,
                fontWeight: 600,
              }}
            >
              <Edit3 size={14} />
              Editar
            </button>

            <button
              onClick={onClose}
              style={{
                background: "rgba(255,255,255,0.2)",
                border: "none",
                borderRadius: 10,
                color: "#fff",
                width: 36,
                height: 36,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Corpo do modal */}
        <div style={{ padding: 28 }}>
          {/* Grade de informações pessoais */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 12,
              marginBottom: 24,
            }}
          >
            {[
              { Icon: Phone,       label: "Telefone",        value: patient.phone },
              { Icon: MapPin,      label: "Endereço",         value: patient.address },
              { Icon: Calendar,    label: "Última Consulta",  value: patient.lastVisit },
              { Icon: Stethoscope, label: "Médico",           value: patient.doctor },
            ].map(({ Icon, label, value }) => (
              <div
                key={label}
                style={{
                  background: "#f8fafc",
                  borderRadius: 12,
                  padding: "12px 14px",
                  display: "flex",
                  gap: 10,
                  alignItems: "flex-start",
                }}
              >
                <Icon size={16} style={{ color: "#3b82f6", marginTop: 2, flexShrink: 0 }} />
                <div>
                  <div
                    style={{
                      fontSize: 11,
                      color: "#94a3b8",
                      fontWeight: 600,
                      textTransform: "uppercase",
                      letterSpacing: 0.5,
                    }}
                  >
                    {label}
                  </div>
                  <div style={{ fontSize: 13, color: "#1e293b", fontWeight: 500 }}>
                    {value}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Condições de saúde */}
          <SectionTitle>Condições de Saúde</SectionTitle>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 20 }}>
            {patient.conditions.map((condition) => (
              <span
                key={condition}
                style={{
                  background: "#eff6ff",
                  color: "#2563eb",
                  border: "1px solid #bfdbfe",
                  borderRadius: 20,
                  padding: "4px 12px",
                  fontSize: 13,
                  fontWeight: 600,
                  display: "flex",
                  alignItems: "center",
                  gap: 5,
                }}
              >
                <Activity size={12} />
                {condition}
              </span>
            ))}
          </div>

          {/* Medicamentos com status de dose */}
          <SectionTitle>Medicamentos e Doses</SectionTitle>
          <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 20 }}>
            {patient.medications.map((med, index) => (
              <div
                key={index}
                style={{
                  border: "1px solid #e2e8f0",
                  borderRadius: 12,
                  padding: "14px 16px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    marginBottom: 10,
                  }}
                >
                  <Pill size={14} style={{ color: "#3b82f6" }} />
                  <span style={{ fontSize: 14, fontWeight: 600, color: "#1e293b" }}>
                    {med.name}
                  </span>
                </div>

                {/* Horários com indicador tomado/não tomado */}
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  {med.schedule.map((time, i) => (
                    <span
                      key={i}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 5,
                        background: med.taken[i] ? "#dcfce7" : "#fee2e2",
                        color: med.taken[i] ? "#15803d" : "#dc2626",
                        borderRadius: 8,
                        padding: "4px 10px",
                        fontSize: 12,
                        fontWeight: 600,
                      }}
                    >
                      {med.taken[i] ? <CheckCircle size={11} /> : <X size={11} />}
                      {time}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Observações */}
          <SectionTitle>Observações</SectionTitle>
          <div
            style={{
              background: patient.status === "urgent" ? "#fff1f2" : "#f8fafc",
              border: `1px solid ${patient.status === "urgent" ? "#fecdd3" : "#e2e8f0"}`,
              borderRadius: 12,
              padding: "12px 14px",
              fontSize: 13,
              color: "#334155",
              lineHeight: 1.6,
              marginBottom: 20,
            }}
          >
            <FileText size={13} style={{ marginRight: 6, color: "#94a3b8" }} />
            {patient.notes}
          </div>

          {/* Rodapé: status + botão confirmar doses */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <StatusBadge status={patient.status} />

            <button
              style={{
                background: "#1d4ed8",
                color: "#fff",
                border: "none",
                borderRadius: 10,
                padding: "10px 18px",
                cursor: "pointer",
                fontSize: 13,
                fontWeight: 600,
                display: "flex",
                alignItems: "center",
                gap: 6,
              }}
            >
              <CheckCircle size={14} />
              Confirmar Doses
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Título de seção reutilizável dentro do modal
function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        fontSize: 12,
        color: "#94a3b8",
        fontWeight: 700,
        textTransform: "uppercase",
        letterSpacing: 0.8,
        marginBottom: 10,
      }}
    >
      {children}
    </div>
  );
}