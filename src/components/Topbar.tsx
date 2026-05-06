// ============================================================
// COMPONENTE — src/components/Topbar.tsx  (arquivo já existia)
// Cabeçalho com: campo de busca, botão exportar,
// sino de notificações (com contador) e avatar do usuário.
// ============================================================

import { Search, Bell, ExternalLink } from "lucide-react";

interface Props {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  alertCount: number;          // número de pacientes urgentes/atrasados
  onToggleNotifications: () => void;
  notificationsOpen: boolean;
}

export default function Topbar({
  searchQuery,
  onSearchChange,
  alertCount,
  onToggleNotifications,
  notificationsOpen,
}: Props) {
  return (
    <header
      style={{
        background: "#fff",
        borderBottom: "1px solid #e2e8f0",
        padding: "16px 28px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      {/* Campo de busca */}
      <div style={{ position: "relative", width: 320 }}>
        <Search
          size={15}
          style={{
            position: "absolute",
            left: 13,
            top: "50%",
            transform: "translateY(-50%)",
            color: "#94a3b8",
          }}
        />
        <input
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Buscar paciente ou condição..."
          style={{
            width: "100%",
            padding: "10px 12px 10px 36px",
            border: "1.5px solid #ffffff",
            borderRadius: 12,
            fontSize: 13,
            outline: "none",
            boxSizing: "border-box",
            fontFamily: "inherit",
          }}
        />
      </div>

      <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
        {/* Botão Exportar — conecte aqui com geração de CSV ou chamada de API */}
        <button
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            padding: "9px 14px",
            border: "1.5px solid #e2e8f0",
            borderRadius: 10,
            background: "#fff",
            cursor: "pointer",
            fontSize: 13,
            fontWeight: 600,
            color: "#475569",
          }}
        >
          <ExternalLink size={13} />
          Exportar
        </button>

        {/* Sino de notificações com contador vermelho */}
        <button
          onClick={onToggleNotifications}
          style={{
            position: "relative",
            background: notificationsOpen ? "#eff6ff" : "#f8fafc",
            border: `1.5px solid ${notificationsOpen ? "#bfdbfe" : "#e2e8f0"}`,
            borderRadius: 10,
            width: 40,
            height: 40,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Bell size={16} color={notificationsOpen ? "#2563eb" : "#64748b"} />

          {/* Bolinha vermelha só aparece se houver alertas */}
          {alertCount > 0 && (
            <span
              style={{
                position: "absolute",
                top: -4,
                right: -4,
                background: "#ef4444",
                color: "#fff",
                borderRadius: "50%",
                width: 18,
                height: 18,
                fontSize: 10,
                fontWeight: 700,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                border: "2px solid #fff",
              }}
            >
              {alertCount}
            </span>
          )}
        </button>

        {/* Avatar — pode virar um dropdown de perfil futuramente */}
        <div
          style={{
            width: 38,
            height: 38,
            borderRadius: "50%",
            background: "linear-gradient(135deg, #1d4ed8, #3b82f6)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#fff",
            fontWeight: 700,
            fontSize: 14,
            cursor: "pointer",
          }}
        >
          
        </div>
      </div>
    </header>
  );
}