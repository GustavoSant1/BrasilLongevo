// ============================================================
// COMPONENTE — src/components/TabelaPacientes.tsx  (já existia)
// Tabela com a lista de pacientes.
// Cada linha tem 3 botões de ação: Ver, Editar, Excluir.
// Recebe os pacientes filtrados do App.tsx via props.
// ============================================================

import { Pill, Clock, Eye, Edit3, Trash2, Plus } from "lucide-react";
import type { Patient } from "../types/patient";
import StatusBadge from "./Statusbadge";

interface Props {
  patients: Patient[];                    // lista já filtrada pela busca
  onView: (patient: Patient) => void;     // abre PatientModal
  onEdit: (patient: Patient) => void;     // abre edição (pode ser o mesmo modal)
  onDelete: (id: number) => void;         // remove paciente da lista
  onAdd: () => void;                      // abre AddPatientModal
}

export default function TabelaPacientes({
  patients = [],
  onView,
  onEdit,
  onDelete,
  onAdd,
}: Props) {
  return (
    <div
      style={{
        background: "#fff",
        borderRadius: 18,
        boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
      }}
    >
      {/* Cabeçalho da tabela */}
      <div
        style={{
          padding: "18px 24px",
          borderBottom: "1px solid #f1f5f9",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div>
          <div style={{ fontSize: 16, fontWeight: 700, color: "#1e293b" }}>
            Lista de Pacientes
          </div>
          <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 2 }}>
            {patients.length} encontrado(s)
          </div>
        </div>

        {/* Botão adicionar paciente */}
        <button
          onClick={onAdd}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 7,
            padding: "10px 18px",
            border: "none",
            borderRadius: 12,
            background: "linear-gradient(135deg, #1d4ed8, #3b82f6)",
            color: "#fff",
            fontWeight: 700,
            fontSize: 13,
            cursor: "pointer",
          }}
        >
          <Plus size={14} />
          Adicionar Paciente
        </button>
      </div>

      {/* Títulos das colunas */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "2fr 1.4fr 1.4fr 1.4fr auto",
          padding: "12px 24px",
          gap: 12,
        }}
      >
        {["Paciente", "Medicamentos", "Próxima Dose", "Status", "Ações"].map(
          (header) => (
            <div
              key={header}
              style={{
                fontSize: 11,
                color: "#94a3b8",
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: 0.6,
              }}
            >
              {header}
            </div>
          )
        )}
      </div>

      {/* Linhas dos pacientes */}
      {patients.map((patient, index) => (
        <PatientRow
          key={patient.id}
          patient={patient}
          isEven={index % 2 === 0}
          onView={onView}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}

      {/* Mensagem quando a busca não encontra nada */}
      {patients.length === 0 && (
        <div
          style={{
            textAlign: "center",
            padding: "40px 0",
            color: "#94a3b8",
            fontSize: 14,
          }}
        >
          Nenhum paciente encontrado.
        </div>
      )}
    </div>
  );
}

// ── Sub-componente: linha individual da tabela ──────────────
// Separado aqui para não deixar o JSX da tabela gigante.
interface RowProps {
  patient: Patient;
  isEven: boolean;
  onView: (p: Patient) => void;
  onEdit: (p: Patient) => void;
  onDelete: (id: number) => void;
}

function PatientRow({ patient, isEven, onView, onEdit, onDelete }: RowProps) {
  const baseBackground = isEven ? "#fff" : "#fafafa";

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "2fr 1.4fr 1.4fr 1.4fr auto",
        padding: "14px 24px",
        gap: 12,
        alignItems: "center",
        borderTop: "1px solid #f8fafc",
        background: baseBackground,
        transition: "background 0.15s",
      }}
      onMouseEnter={(e) =>
        (e.currentTarget.style.background = "#f0f9ff")
      }
      onMouseLeave={(e) =>
        (e.currentTarget.style.background = baseBackground)
      }
    >
      {/* Nome e avatar */}
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div
          style={{
            width: 38,
            height: 38,
            borderRadius: "50%",
            background: "linear-gradient(135deg, #bfdbfe, #93c5fd)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: 700,
            color: "#1d4ed8",
            fontSize: 14,
            flexShrink: 0,
          }}
        >
          {patient.name[0]}
        </div>
        <div>
          <div style={{ fontSize: 14, fontWeight: 600, color: "#1e293b" }}>
            {patient.name}
          </div>
          <div style={{ fontSize: 12, color: "#94a3b8" }}>{patient.age} anos</div>
        </div>
      </div>

      {/* Condições/medicamentos */}
      <div>
        {patient.conditions.map((condition) => (
          <div
            key={condition}
            style={{
              fontSize: 12,
              color: "#475569",
              display: "flex",
              alignItems: "center",
              gap: 4,
            }}
          >
            <Pill size={11} style={{ color: "#3b82f6" }} />
            {condition}
          </div>
        ))}
      </div>

      {/* Próxima dose */}
      <div
        style={{
          fontSize: 13,
          color: "#475569",
          display: "flex",
          alignItems: "center",
          gap: 5,
        }}
      >
        <Clock size={12} style={{ color: "#94a3b8" }} />
        {patient.nextDose}
      </div>

      {/* Badge de status */}
      <div>
        <StatusBadge status={patient.status} />
      </div>

      {/* Botões de ação */}
      <div style={{ display: "flex", gap: 6 }}>
        {/* Ver detalhes — abre o PatientModal */}
        <button
          onClick={() => onView(patient)}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 5,
            padding: "7px 12px",
            borderRadius: 8,
            border: "1.5px solid #dbeafe",
            background: "#eff6ff",
            color: "#2563eb",
            cursor: "pointer",
            fontSize: 12,
            fontWeight: 600,
          }}
        >
          <Eye size={12} />
          Ver
        </button>

        {/* Editar */}
        <button
          onClick={() => onEdit(patient)}
          style={{
            padding: "7px 9px",
            borderRadius: 8,
            border: "1.5px solid #e2e8f0",
            background: "#fff",
            color: "#64748b",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
          }}
        >
          <Edit3 size={12} />
        </button>

        {/* Excluir */}
        <button
          onClick={() => onDelete(patient.id)}
          style={{
            padding: "7px 9px",
            borderRadius: 8,
            border: "1.5px solid #fee2e2",
            background: "#fff",
            color: "#ef4444",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
          }}
        >
          <Trash2 size={12} />
        </button>
      </div>
    </div>
  );
}