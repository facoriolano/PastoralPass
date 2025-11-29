import { Student, AttendanceRecord, PastoralType } from '../types.ts';

// Keys for LocalStorage
const STUDENTS_KEY = 'pastoral_students';
const ATTENDANCE_KEY = 'pastoral_attendance';

// Helper to generate IDs
const generateId = () => Math.random().toString(36).substr(2, 9);

// --- Students Methods ---

export const getStudents = (): Student[] => {
  const data = localStorage.getItem(STUDENTS_KEY);
  if (!data) {
    // Seed initial data if empty for demo purposes
    const seed: Student[] = [
      { id: '101', name: 'Maria Silva', pastoral: PastoralType.CRISMA, qrCodeValue: '101-Maria Silva-Crisma' },
      { id: '102', name: 'João Santos', pastoral: PastoralType.CATEQUESE_INFANTIL, qrCodeValue: '102-João Santos-Catequese' },
      { id: '103', name: 'Pedro Costa', pastoral: PastoralType.CRISMA, qrCodeValue: '103-Pedro Costa-Crisma' },
      { id: '104', name: 'Ana Oliveira', pastoral: PastoralType.EUCARISTIA, qrCodeValue: '104-Ana Oliveira-Eucaristia' },
      { id: '105', name: 'Lucas Pereira', pastoral: PastoralType.JUVENTUDE, qrCodeValue: '105-Lucas Pereira-Juventude' },
    ];
    localStorage.setItem(STUDENTS_KEY, JSON.stringify(seed));
    return seed;
  }
  return JSON.parse(data);
};

export const addStudent = (student: Omit<Student, 'id' | 'qrCodeValue'>): Student => {
  const students = getStudents();
  const newStudent: Student = {
    ...student,
    id: generateId(),
    qrCodeValue: `${generateId()}-${student.name}-${student.pastoral}`
  };
  students.push(newStudent);
  localStorage.setItem(STUDENTS_KEY, JSON.stringify(students));
  return newStudent;
};

export const deleteStudent = (id: string) => {
  let students = getStudents();
  students = students.filter(s => s.id !== id);
  localStorage.setItem(STUDENTS_KEY, JSON.stringify(students));
};

// --- Attendance Methods ---

export const getAttendance = (): AttendanceRecord[] => {
  const data = localStorage.getItem(ATTENDANCE_KEY);
  return data ? JSON.parse(data) : [];
};

export const markAttendance = (student: Student): AttendanceRecord => {
  const records = getAttendance();
  const now = new Date();
  const todayStr = now.toISOString().split('T')[0];

  // Check if already present today
  const alreadyPresent = records.find(r => r.studentId === student.id && r.dateString === todayStr);
  
  if (alreadyPresent) {
    throw new Error(`${student.name} já registrou presença hoje!`);
  }

  const newRecord: AttendanceRecord = {
    id: generateId(),
    studentId: student.id,
    studentName: student.name,
    pastoral: student.pastoral,
    timestamp: now.getTime(),
    dateString: todayStr
  };

  records.push(newRecord);
  localStorage.setItem(ATTENDANCE_KEY, JSON.stringify(records));
  return newRecord;
};

// --- Mock Scanner Logic ---

export const findStudentByQR = (qrContent: string): Student | undefined => {
  const students = getStudents();
  // Strategy 1: Exact match on stored QR value
  let found = students.find(s => s.qrCodeValue === qrContent);
  
  // Strategy 2: If QR content is simple ID
  if (!found) {
    found = students.find(s => s.id === qrContent);
  }

  // Strategy 3: Loose name match (for demo flexibility)
  if (!found) {
    const parts = qrContent.split('-');
    if (parts.length > 1) {
       // Assume format ID-NAME-PASTORAL, try to find by ID part
       found = students.find(s => s.id === parts[0]);
    }
  }

  return found;
};
