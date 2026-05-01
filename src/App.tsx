// ============================================================
// COMPONENTE RAIZ — src/App.tsx
// Aqui ficam SOMENTE os estados e a montagem dos componentes.
// Toda a lógica visual está dentro de cada componente separado.
//
// FLUXO DE DADOS:
//   App.tsx (estado) → props → Componentes filhos
//   Componentes filhos → callbacks (onXxx) → App.tsx atualiza estado

import { useState, useEffect } from "react";
import type { Patient } from "./types/patient";
import { PATIENTS_DATA } from "./datas/patients";
import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";
import Cards from "./components/Cards";
import TabelaPacientes from "./components/TabelaPacientes";
import PatientModal from "./components/modals/PatientModal";
import AddPatientModal from "./components/modals/Addpatientmodal";
import NotificationPanel from "./components/Notificationpanel";

export default function App() {
  const [patients, setPatients] = useState<Patient[]>(PATIENTS_DATA);
 

  // Qual paciente está aberto no modal de detalhes (null = fechado)
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);

  // Controla se o modal de adicionar paciente está aberto
  const [showAddModal, setShowAddModal] = useState(false);

  // Controla se o painel de notificações está aberto
  const [showNotifications, setShowNotifications] = useState(false);

  // Texto digitado na barra de busca
  const [searchQuery, setSearchQuery] = useState("");

  // Qual aba do menu lateral está ativa
  const [activeNav, setActiveNav] = useState("Pacientes");

  // ── DADOS DERIVADOS (calculados a partir do estado) ────────
  // Pacientes filtrados pela busca (nome ou condição)
  const filteredPatients = patients.filter((p) => {
    const query = searchQuery.toLowerCase();
    return (
      p.name.toLowerCase().includes(query) ||
      p.conditions.some((c) => c.toLowerCase().includes(query))
    );
  });

  // Contadores para os Cards de resumo
  const stats = {
    total:  patients.length,
    onTime: patients.filter((p) => p.status === "ok").length,
    late:   patients.filter((p) => p.status === "late" || p.status === "partial").length,
    urgent: patients.filter((p) => p.status === "urgent").length,
  };

  // Quantidade de alertas para o contador no sino
  const alertCount = patients.filter(
    (p) => p.status === "late" || p.status === "urgent"
  ).length;

  // ── FUNÇÕES DE MANIPULAÇÃO ─────────────────────────────────
  const handleAddPatient = (newPatient: Patient) => {
    setPatients((prev) => [...prev, newPatient]);
  };

  const handleDeletePatient = (id: number) => {
    setPatients((prev) => prev.filter((p) => p.id !== id));
  };

  // ── RENDER ─────────────────────────────────────────────────
  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        background: "#f1f5f9",
        fontFamily: "'DM Sans', sans-serif",
        overflow: "hidden",
        width: "100%",
      }}
    >
      {/* Fonte do Google Fonts */}
      <link
        href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap"
        rel="stylesheet"
      />

      {/* ── Sidebar (menu lateral) ─────────────────────────── */}
      <Sidebar
        activeNav={activeNav}
        onNavChange={setActiveNav}
        onAddPatient={() => setShowAddModal(true)}
      />

      {/* ── Área principal ─────────────────────────────────── */}
      <main style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>

        {/* Topbar (header com busca e sino) */}
        <Topbar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          alertCount={alertCount}
          onToggleNotifications={() => setShowNotifications((prev) => !prev)}
          notificationsOpen={showNotifications}
        />

        {/* Conteúdo com scroll */}
        <div style={{ flex: 1, overflowY: "auto", padding: 28 }}>

          {/* Cards de resumo */}
          <Cards
            total={stats.total}
            onTime={stats.onTime}
            late={stats.late}
            urgent={stats.urgent}
          />

          {/* Tabela de pacientes */}
          <TabelaPacientes
            patients={filteredPatients}
            onView={setSelectedPatient}
            onEdit={setSelectedPatient}   // por enquanto abre o modal de detalhes
            onDelete={handleDeletePatient}
            onAdd={() => setShowAddModal(true)}
          />
        </div>
      </main>

      {/* ── Modais e painéis (renderizados por cima de tudo) ── */}

      {/* Modal de detalhes do paciente */}
      <PatientModal
        patient={selectedPatient}
        onClose={() => setSelectedPatient(null)}
        onEdit={(p) => alert(`Editar: ${p.name}`)} // substitua por lógica de edição
      />

      {/* Modal de adicionar paciente */}
      {showAddModal && (
        <AddPatientModal
          onClose={() => setShowAddModal(false)}
          onSave={handleAddPatient}
        />
      )}

      {/* Painel lateral de notificações */}
      {showNotifications && (
        <NotificationPanel
          patients={patients}
          onClose={() => setShowNotifications(false)}
          onViewPatient={(p) => {
            setSelectedPatient(p);
            setShowNotifications(false);
          }}
        />
      )}
    </div>
  );
}