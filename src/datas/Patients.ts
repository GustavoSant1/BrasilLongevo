// ============================================================
// DADOS — src/data/patients.ts
// Lista inicial de pacientes.

 
import type { Patient } from "../types/Patient";

export const PATIENTS_DATA: Patient[] = [
  {
    id: 1,
    name: "João Silva",
    age: 78,
    phone: "(14) 99123-4567",
    address: "Rua das Flores, 123",
    doctor: "Dr. Roberto Mendes",
    conditions: ["Pressão Alta", "Diabetes"],
    medications: [
      { name: "Losartana 50mg",    schedule: ["08:00", "20:00"],         taken: [true, true] },
      { name: "Metformina 500mg",  schedule: ["08:00", "14:00", "20:00"], taken: [true, true, false] },
    ],
    nextDose: "08:00, 14:00, 20:00",
    status: "ok",
    missedDoses: 0,
    notes: "Paciente controlado. Revisão mensal.",
    lastVisit: "15/04/2025",
  },
  {
    id: 2,
    name: "Maria Souza",
    age: 72,
    phone: "(14) 98765-4321",
    address: "Av. Brasil, 456",
    doctor: "Dra. Carla Ferreira",
    conditions: ["Pressão Alta"],
    medications: [
      { name: "Enalapril 10mg", schedule: ["08:00", "18:00"], taken: [true, false] },
    ],
    nextDose: "08:00, 18:00",
    status: "partial",
    missedDoses: 1,
    notes: "Observar pressão à tarde.",
    lastVisit: "10/04/2025",
  },
  {
    id: 3,
    name: "Carlos Lima",
    age: 65,
    phone: "(14) 97654-3210",
    address: "Rua Palmeiras, 789",
    doctor: "Dr. Roberto Mendes",
    conditions: ["Diabetes", "Colesterol"],
    medications: [
      { name: "Glibenclamida 5mg", schedule: ["09:00", "15:00", "21:00"], taken: [true, true, true] },
      { name: "Sinvastatina 20mg", schedule: ["21:00"],                   taken: [true] },
    ],
    nextDose: "09:00, 15:00, 21:00",
    status: "ok",
    missedDoses: 0,
    notes: "Dieta controlada. Boa adesão.",
    lastVisit: "22/04/2025",
  },
  {
    id: 4,
    name: "Ana Pereira",
    age: 80,
    phone: "(14) 96543-2109",
    address: "Rua do Ipê, 321",
    doctor: "Dra. Carla Ferreira",
    conditions: ["Pressão Alta", "Colesterol"],
    medications: [
      { name: "Anlodipino 5mg",    schedule: ["08:00", "12:00", "18:00"], taken: [true, true, false] },
      { name: "Atorvastatina 40mg", schedule: ["18:00"],                  taken: [false] },
    ],
    nextDose: "08:00, 12:00, 18:00",
    status: "late",
    missedDoses: 1,
    notes: "Acompanhar adesão. Risco elevado.",
    lastVisit: "08/04/2025",
  },
  {
    id: 5,
    name: "José Martins",
    age: 70,
    phone: "(14) 95432-1098",
    address: "Av. Paulista, 654",
    doctor: "Dr. Marcos Alves",
    conditions: ["Diabetes"],
    medications: [
      { name: "Insulina NPH", schedule: ["10:00", "22:00"], taken: [false, false] },
    ],
    nextDose: "10:00, 22:00",
    status: "urgent",
    missedDoses: 2,
    notes: "URGENTE: 2 doses não tomadas. Contato imediato.",
    lastVisit: "01/04/2025",
  },
];