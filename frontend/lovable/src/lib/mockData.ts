export interface Patient {
  id: string;
  name: string;
  symptom: string;
  triage: 1 | 2 | 3 | 4 | 5;
  arrivedAt: number;
}

export interface QueuedPatient {
  id: string;
  name: string;
  score: number;
}

export type HospitalKind = "public" | "private";

export interface Hospital {
  id: string;
  name: string;
  kind: HospitalKind;
  capacity: number;
  queue: QueuedPatient[];
  // legacy abstract coords (kept so old code doesn't break)
  x: number;
  y: number;
  // real geo coords for Johannesburg map
  lat: number;
  lng: number;
}

const NAMES = ["A. Morales", "K. Tanaka", "J. Park", "S. Okafor", "L. Romano", "E. Singh", "M. Dubois", "R. Hassan", "T. Nguyen", "C. Becker", "I. Petrov", "O. Adeyemi"];
const SYMPTOMS = ["Chest pain", "Lacerations", "Respiratory distress", "Cardiac arrest", "Severe fracture", "Stroke symptoms", "Sepsis suspect", "Head trauma", "Allergic reaction", "Burns"];

export function randomPatient(): Patient {
  return {
    id: crypto.randomUUID(),
    name: NAMES[Math.floor(Math.random() * NAMES.length)],
    symptom: SYMPTOMS[Math.floor(Math.random() * SYMPTOMS.length)],
    triage: (Math.floor(Math.random() * 5) + 1) as Patient["triage"],
    arrivedAt: Date.now(),
  };
}

// Real Johannesburg hospitals — public (default visible) and private (hidden by default)
export const HOSPITALS: Hospital[] = [
  // PUBLIC
  { id: "h1", name: "Chris Hani Baragwanath Academic Hospital", kind: "public", capacity: 32, queue: seedQueue(22), x: 22, y: 30, lat: -26.2614, lng: 27.9389 },
  { id: "h2", name: "Charlotte Maxeke Johannesburg Academic Hospital", kind: "public", capacity: 26, queue: seedQueue(16), x: 62, y: 58, lat: -26.1773, lng: 28.0451 },
  { id: "h3", name: "Helen Joseph Hospital", kind: "public", capacity: 20, queue: seedQueue(12), x: 80, y: 22, lat: -26.1745, lng: 28.0107 },
  { id: "h4", name: "Rahima Moosa Mother and Child Hospital", kind: "public", capacity: 18, queue: seedQueue(10), x: 40, y: 70, lat: -26.1791, lng: 27.9942 },
  // PRIVATE
  { id: "h5", name: "Netcare Milpark Hospital", kind: "private", capacity: 16, queue: seedQueue(8), x: 55, y: 40, lat: -26.1820, lng: 28.0241 },
  { id: "h6", name: "Mediclinic Morningside", kind: "private", capacity: 16, queue: seedQueue(7), x: 70, y: 35, lat: -26.0726, lng: 28.0561 },
];

// Random pickup point somewhere in the JHB metro area
export function randomJhbCoord(): { lat: number; lng: number } {
  return {
    lat: -26.2041 + (Math.random() - 0.5) * 0.18,
    lng: 28.0473 + (Math.random() - 0.5) * 0.22,
  };
}

function seedQueue(n: number): QueuedPatient[] {
  return Array.from({ length: n }, () => ({
    id: crypto.randomUUID(),
    name: NAMES[Math.floor(Math.random() * NAMES.length)],
    score: Math.round(Math.random() * 90 + 10),
  })).sort((a, b) => b.score - a.score);
}

export function shuffleQueue(q: QueuedPatient[]): QueuedPatient[] {
  return [...q]
    .map((p) => ({ ...p, score: Math.max(1, Math.min(100, p.score + Math.round((Math.random() - 0.5) * 30))) }))
    .sort((a, b) => b.score - a.score);
}
