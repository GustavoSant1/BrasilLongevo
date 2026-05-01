// ============================================================
// TIPOS — src/types/patient.ts
// Define o formato de cada paciente no sistema.
// Se adicionar um campo novo no objeto, adicione aqui também.
// ============================================================

export type PatientStatus = "ok" | "partial" | "late" | "urgent";

export interface Medication {
  name: string;
  schedule: string[];  // horários, ex: ["08:00", "14:00"]
  taken: boolean[];    // se cada horário foi tomado
}

export interface Patient {
  id: number;
  name: string;
  age: number;
  phone: string;
  address: string;
  doctor: string;
  conditions: string[];
  medications: Medication[];
  nextDose: string;
  status: PatientStatus;
  missedDoses: number;
  notes: string;
  lastVisit: string;
}