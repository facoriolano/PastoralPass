export interface Student {
  id: string;
  name: string;
  pastoral: string;
  qrCodeValue: string; // Typically "ID-NAME-PASTORAL" or a UUID
}

export interface AttendanceRecord {
  id: string;
  studentId: string;
  studentName: string;
  pastoral: string;
  timestamp: number; // Unix timestamp
  dateString: string; // ISO Date YYYY-MM-DD
}

export enum PastoralType {
  CATEQUESE_INFANTIL = "Catequese Infantil",
  CRISMA = "Crisma",
  EUCARISTIA = "Eucaristia",
  JUVENTUDE = "Grupo de Jovens",
  OUTROS = "Outros"
}

export interface DailyStat {
  date: string;
  present: number;
  total: number;
}
