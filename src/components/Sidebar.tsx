// ============================================================
// COMPONENTE — src/components/Sidebar.tsx  (arquivo já existia)
// Barra lateral com logo, links de navegação e botão "+ Novo Paciente".
// Recebe qual aba está ativa e uma função para abrir o modal de adição.
// ============================================================

import { Users, Pill, Stethoscope, FileText, Settings, Plus, Heart } from "lucide-react";

// Cada item do menu tem um rótulo e um ícone
const NAV_ITEMS = [
  { label: "Pacientes",     Icon: Users },
  { label: "Medicamentos",  Icon: Pill },
  { label: "Consultas",     Icon: Stethoscope },
  { label: "Relatórios",    Icon: FileText },
  { label: "Configurações", Icon: Settings },
];

interface Props {
  activeNav: string;
  onNavChange: (label: string) => void;
  onAddPatient: () => void;  // abre o modal AddPatientModal
}

export default function Sidebar({ activeNav, onNavChange, onAddPatient }: Props) {
  return (
    <aside
      style={{
        width: 220,
        background: "#fff",
        borderRight: "1px solid #e2e8f0",
        display: "flex",
        flexDirection: "column",
        flexShrink: 0,
        height: "100vh",
      }}
    >
      {/* Logo */}
      <div
        style={{
          padding: "22px 20px",
          display: "flex",
          alignItems: "center",
          gap: 10,
          borderBottom: "1px solid #f1f5f9",
        }}
      >
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: 10,
            background: "linear-gradient(135deg, #1d4ed8, #3b82f6)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Heart size={18} color="#fff" />
        </div>
        <span style={{ fontSize: 14, fontWeight: 700, color: "#1e293b" }}>
          Controle de Pacientes
        </span>
      </div>

      {/* Links de navegação */}
      <nav style={{ padding: "16px 12px", flex: 1 }}>
        {NAV_ITEMS.map(({ label, Icon }) => {
          const isActive = activeNav === label;
          return (
            <button
              key={label}
              onClick={() => onNavChange(label)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                width: "100%",
                padding: "10px 12px",
                borderRadius: 10,
                border: "none",
                cursor: "pointer",
                marginBottom: 4,
                background: isActive
                  ? "linear-gradient(135deg, #1d4ed8, #3b82f6)"
                  : "transparent",
                color: isActive ? "#fff" : "#64748b",
                fontWeight: isActive ? 700 : 500,
                fontSize: 14,
                textAlign: "left",
              }}
            >
              <Icon size={16} />
              {label}
            </button>
          );
        })}
      </nav>

      {/* Botão "+ Novo Paciente" no rodapé da sidebar */}
      <div style={{ padding: "16px 12px", borderTop: "1px solid #f1f5f9" }}>
        <button
          onClick={onAddPatient}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            width: "100%",
            padding: "11px 14px",
            borderRadius: 12,
            border: "none",
            background: "linear-gradient(135deg, #1d4ed8, #3b82f6)",
            color: "#fff",
            fontWeight: 700,
            fontSize: 13,
            cursor: "pointer",
          }}
        >
          <Plus size={15} />
          Novo Paciente
        </button>
      </div>
    </aside>
  );
}