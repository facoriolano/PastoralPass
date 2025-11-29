import React, { useState, useEffect, useMemo } from 'react';
import ReactDOM from 'react-dom/client';
import { 
  Home, Users, ClipboardList, PieChart, LogOut, Menu, Github, 
  Scan, X, CheckCircle, AlertTriangle, Plus, Trash2, Search, QrCode,
  UserCheck, UserX, Calendar, Sparkles, ScanLine, Download, Check, X as XIcon,
  Terminal, Copy
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid 
} from 'recharts';
import { GoogleGenAI } from "@google/genai";

// --- TYPES ---

interface Student {
  id: string;
  name: string;
  pastoral: string;
  qrCodeValue: string;
}

interface AttendanceRecord {
  id: string;
  studentId: string;
  studentName: string;
  pastoral: string;
  timestamp: number;
  dateString: string;
}

enum PastoralType {
  CATEQUESE_INFANTIL = "Catequese Infantil",
  CRISMA = "Crisma",
  EUCARISTIA = "Eucaristia",
  JUVENTUDE = "Grupo de Jovens",
  OUTROS = "Outros"
}

// --- SERVICES: STORAGE ---

const STUDENTS_KEY = 'pastoral_students';
const ATTENDANCE_KEY = 'pastoral_attendance';

const generateId = () => Math.random().toString(36).substr(2, 9);

const getStudents = (): Student[] => {
  const data = localStorage.getItem(STUDENTS_KEY);
  if (!data) {
    const seed: Student[] = [
      { id: '101', name: 'Maria Silva', pastoral: PastoralType.CRISMA, qrCodeValue: '101' },
      { id: '102', name: 'João Santos', pastoral: PastoralType.CATEQUESE_INFANTIL, qrCodeValue: '102' },
      { id: '103', name: 'Pedro Costa', pastoral: PastoralType.CRISMA, qrCodeValue: '103' },
      { id: '104', name: 'Ana Oliveira', pastoral: PastoralType.EUCARISTIA, qrCodeValue: '104' },
      { id: '105', name: 'Lucas Pereira', pastoral: PastoralType.JUVENTUDE, qrCodeValue: '105' },
    ];
    localStorage.setItem(STUDENTS_KEY, JSON.stringify(seed));
    return seed;
  }
  return JSON.parse(data);
};

const addStudent = (student: Omit<Student, 'id' | 'qrCodeValue'>): Student => {
  const students = getStudents();
  const newStudent: Student = {
    ...student,
    id: generateId(),
    qrCodeValue: `${generateId()}-${student.name}`
  };
  students.push(newStudent);
  localStorage.setItem(STUDENTS_KEY, JSON.stringify(students));
  return newStudent;
};

const deleteStudent = (id: string) => {
  let students = getStudents();
  students = students.filter(s => s.id !== id);
  localStorage.setItem(STUDENTS_KEY, JSON.stringify(students));
};

const getAttendance = (): AttendanceRecord[] => {
  const data = localStorage.getItem(ATTENDANCE_KEY);
  return data ? JSON.parse(data) : [];
};

const markAttendance = (student: Student): AttendanceRecord => {
  const records = getAttendance();
  const now = new Date();
  const todayStr = now.toISOString().split('T')[0];
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

const findStudentByQR = (qrContent: string): Student | undefined => {
  const students = getStudents();
  let found = students.find(s => s.qrCodeValue === qrContent);
  if (!found) found = students.find(s => s.id === qrContent);
  if (!found) {
    const parts = qrContent.split('-');
    if (parts.length > 0) found = students.find(s => s.id === parts[0]);
  }
  return found;
};

// --- SERVICES: GEMINI AI ---

const generateAttendanceInsights = async (students: Student[], attendance: AttendanceRecord[]): Promise<string> => {
  const apiKey = process.env.API_KEY || ''; 
  if (!apiKey) return "⚠️ API Key não configurada. Adicione process.env.API_KEY ou configure no código.";

  try {
    const ai = new GoogleGenAI({ apiKey });
    const byDate: Record<string, number> = {};
    attendance.forEach(r => { byDate[r.dateString] = (byDate[r.dateString] || 0) + 1; });

    const prompt = `
      Atue como analista de paróquia. Dados:
      Total Alunos: ${students.length}
      Total Presenças: ${attendance.length}
      Histórico: ${JSON.stringify(byDate)}
      
      Forneça:
      1. Análise breve de tendência.
      2. Qual pastoral engaja mais.
      3. Sugestão motivacional curta.
      Use emojis.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    return response.text || "Sem insights no momento.";
  } catch (error) {
    console.error(error);
    return "Erro ao conectar com a IA.";
  }
};

// --- COMPONENTS ---

const Scanner: React.FC<{ onClose: () => void; onSuccess: () => void; }> = ({ onClose, onSuccess }) => {
  const [inputVal, setInputVal] = useState('');
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  useEffect(() => { document.getElementById('qr-input')?.focus(); }, []);

  const handleScan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputVal.trim()) return;
    const student = findStudentByQR(inputVal);
    if (student) {
      try {
        markAttendance(student);
        setStatus('success');
        setMessage(`${student.name} - Presença Confirmada!`);
        setTimeout(() => {
          setStatus('idle');
          setInputVal('');
          setMessage('');
          onSuccess();
        }, 2000);
      } catch (err: any) {
        setStatus('error');
        setMessage(err.message);
      }
    } else {
      setStatus('error');
      setMessage('Aluno não encontrado.');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/90 z-50 flex flex-col items-center justify-center p-4">
      <button onClick={onClose} className="absolute top-4 right-4 text-white p-2 hover:bg-white/10 rounded-full"><X size={32} /></button>
      <div className="w-full max-w-md bg-white rounded-2xl p-6 text-center shadow-2xl animate-in">
        <div className="mb-6 flex justify-center">
          <div className={`p-4 rounded-full ${status === 'success' ? 'bg-green-100 text-green-600' : status === 'error' ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'}`}>
            {status === 'success' ? <CheckCircle size={48} /> : status === 'error' ? <AlertTriangle size={48} /> : <Scan size={48} />}
          </div>
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Leitor de Presença</h2>
        <form onSubmit={handleScan}>
          <input id="qr-input" type="text" value={inputVal} onChange={(e) => setInputVal(e.target.value)} placeholder="Digite o ID ou escaneie..." className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-lg text-center mb-4" autoComplete="off" />
          <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-xl">Registrar</button>
        </form>
        {message && <div className={`mt-4 p-3 rounded-lg text-sm font-medium ${status === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>{message}</div>}
      </div>
    </div>
  );
};

const Sidebar: React.FC<{ activeTab: string; setActiveTab: (t: string) => void; isOpen: boolean; toggleOpen: () => void; }> = ({ activeTab, setActiveTab, isOpen, toggleOpen }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Painel', icon: Home },
    { id: 'students', label: 'Alunos', icon: Users },
    { id: 'reports', label: 'Relatórios', icon: ClipboardList },
    { id: 'insights', label: 'IA Insights', icon: PieChart },
    { id: 'help', label: 'GitHub / Ajuda', icon: Github },
  ];

  return (
    <>
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-white border-b flex items-center px-4 z-40">
        <button onClick={toggleOpen} className="p-2 text-gray-600"><Menu size={24} /></button>
        <span className="ml-3 font-bold text-lg text-blue-900">PastoralPass</span>
      </div>
      <aside className={`fixed md:static inset-y-0 left-0 z-40 w-64 bg-slate-900 text-white transition-transform duration-300 ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 flex flex-col`}>
        <div className="h-16 flex items-center px-6 border-b border-slate-700 bg-slate-950"><span className="font-bold text-xl">PastoralPass</span></div>
        <nav className="flex-1 py-6 px-3 space-y-2">
          {menuItems.map((item) => (
            <button key={item.id} onClick={() => { setActiveTab(item.id); if (window.innerWidth < 768) toggleOpen(); }} className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg transition-colors ${activeTab === item.id ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-slate-800'}`}>
              <item.icon size={20} /><span>{item.label}</span>
            </button>
          ))}
        </nav>
      </aside>
      {isOpen && <div className="fixed inset-0 bg-black/50 z-30 md:hidden" onClick={toggleOpen} />}
    </>
  );
};

// --- PAGES ---

const Dashboard: React.FC<{ students: Student[]; attendance: AttendanceRecord[] }> = ({ students, attendance }) => {
  const stats = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    const presentToday = attendance.filter(r => r.dateString === today).length;
    const chartData = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dStr = d.toISOString().split('T')[0];
      const count = attendance.filter(r => r.dateString === dStr).length;
      chartData.push({ name: d.toLocaleDateString('pt-BR', { weekday: 'short' }), presentes: count });
    }
    return { total: students.length, present: presentToday, absent: students.length - presentToday, chartData };
  }, [students, attendance]);

  const StatCard = ({ title, value, icon: Icon, color }: any) => (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 flex justify-between items-start">
      <div><p className="text-sm font-medium text-gray-500 mb-1">{title}</p><h3 className="text-3xl font-bold text-gray-900">{value}</h3></div>
      <div className={`p-3 rounded-lg ${color}`}><Icon size={24} className="text-white" /></div>
    </div>
  );

  return (
    <div className="space-y-6 animate-in">
      <div><h1 className="text-2xl font-bold text-gray-900">Dashboard</h1><p className="text-gray-500">Visão geral.</p></div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Alunos" value={stats.total} icon={Users} color="bg-blue-500" />
        <StatCard title="Presentes" value={stats.present} icon={UserCheck} color="bg-green-500" />
        <StatCard title="Faltas" value={stats.absent} icon={UserX} color="bg-red-500" />
        <StatCard title="Registros" value={attendance.length} icon={Calendar} color="bg-purple-500" />
      </div>
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-80">
        <h3 className="font-bold mb-4">Frequência Semanal</h3>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={stats.chartData}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="name" axisLine={false} tickLine={false} />
            <YAxis axisLine={false} tickLine={false} />
            <Tooltip cursor={{fill: '#f3f4f6'}} contentStyle={{borderRadius: '8px', border:'none'}} />
            <Bar dataKey="presentes" fill="#3b82f6" radius={[4,4,0,0]} barSize={40} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

const StudentsPage: React.FC<{ students: Student[]; refreshData: () => void }> = ({ students, refreshData }) => {
  const [term, setTerm] = useState('');
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState({ name: '', pastoral: PastoralType.CATEQUESE_INFANTIL });

  const filtered = students.filter(s => s.name.toLowerCase().includes(term.toLowerCase()));

  const save = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name) return;
    addStudent({ name: form.name, pastoral: form.pastoral as string });
    setModal(false); setForm({ name: '', pastoral: PastoralType.CATEQUESE_INFANTIL }); refreshData();
  };

  return (
    <div className="space-y-6 animate-in">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Alunos</h1>
        <button onClick={() => setModal(true)} className="bg-blue-600 text-white px-4 py-2 rounded-lg flex gap-2"><Plus size={20} /> Novo</button>
      </div>
      <div className="bg-white rounded-xl shadow-sm border p-4">
        <div className="relative mb-4">
          <Search className="absolute left-3 top-3 text-gray-400" size={20} />
          <input type="text" placeholder="Buscar..." value={term} onChange={e => setTerm(e.target.value)} className="w-full pl-10 p-2 border rounded-lg" />
        </div>
        <div className="overflow-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-gray-600 font-medium text-sm">
              <tr><th className="p-4">ID</th><th className="p-4">Nome</th><th className="p-4">Pastoral</th><th className="p-4">Ação</th></tr>
            </thead>
            <tbody>
              {filtered.map(s => (
                <tr key={s.id} className="border-t hover:bg-gray-50">
                  <td className="p-4 font-mono text-sm text-gray-500">#{s.id}</td>
                  <td className="p-4 font-medium">{s.name}</td>
                  <td className="p-4 text-sm">{s.pastoral}</td>
                  <td className="p-4"><button onClick={() => { if(confirm('Excluir?')) { deleteStudent(s.id); refreshData(); } }} className="text-red-400 hover:text-red-600"><Trash2 size={18}/></button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {modal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Novo Aluno</h2>
            <form onSubmit={save} className="space-y-4">
              <input type="text" placeholder="Nome" value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="w-full p-2 border rounded" required />
              <select value={form.pastoral} onChange={e => setForm({...form, pastoral: e.target.value as PastoralType})} className="w-full p-2 border rounded bg-white">
                {Object.values(PastoralType).map(p => <option key={p} value={p}>{p}</option>)}
              </select>
              <div className="flex justify-end gap-2">
                <button type="button" onClick={() => setModal(false)} className="px-4 py-2 text-gray-600">Cancelar</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">Salvar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

const Reports: React.FC<{ students: Student[]; attendance: AttendanceRecord[] }> = ({ students, attendance }) => {
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const data = students.map(s => ({ ...s, isPresent: attendance.some(r => r.studentId === s.id && r.dateString === date) }));

  const download = () => {
    const csv = "data:text/csv;charset=utf-8," + ["ID,Nome,Pastoral,Status", ...data.map(d => `${d.id},${d.name},${d.pastoral},${d.isPresent?'PRESENTE':'FALTA'}`)].join('\n');
    const link = document.createElement("a"); link.href = encodeURI(csv); link.download = `relatorio_${date}.csv`; link.click();
  };

  return (
    <div className="space-y-6 animate-in">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Relatórios</h1>
        <button onClick={download} className="bg-green-600 text-white px-4 py-2 rounded flex gap-2"><Download size={20} /> CSV</button>
      </div>
      <div className="bg-white p-4 rounded-xl border flex gap-4">
        <input type="date" value={date} onChange={e => setDate(e.target.value)} className="p-2 border rounded" />
      </div>
      <div className="grid grid-cols-3 gap-4 text-center">
        <div className="bg-blue-50 p-4 rounded">Total <strong className="block text-xl">{data.length}</strong></div>
        <div className="bg-green-50 p-4 rounded">Presentes <strong className="block text-xl">{data.filter(d=>d.isPresent).length}</strong></div>
        <div className="bg-red-50 p-4 rounded">Faltas <strong className="block text-xl">{data.filter(d=>!d.isPresent).length}</strong></div>
      </div>
      <div className="bg-white rounded-xl border overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 text-gray-600 font-medium text-sm"><tr><th className="p-4">Aluno</th><th className="p-4">Status</th></tr></thead>
          <tbody>
            {data.map(s => (
              <tr key={s.id} className="border-t hover:bg-gray-50">
                <td className="p-4">{s.name} <span className="text-gray-400 text-xs block">{s.pastoral}</span></td>
                <td className="p-4">{s.isPresent ? <span className="text-green-600 bg-green-50 px-2 py-1 rounded text-xs font-bold">PRESENTE</span> : <span className="text-red-600 bg-red-50 px-2 py-1 rounded text-xs font-bold">FALTA</span>}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const HelpPage = () => {
  const copy = (text: string) => navigator.clipboard.writeText(text);
  return (
    <div className="space-y-6 animate-in">
      <h1 className="text-2xl font-bold">Ajuda & GitHub</h1>
      {[
        { t: "1. Inicializar", c: "git init" },
        { t: "2. Adicionar", c: "git add ." },
        { t: "3. Commit", c: 'git commit -m "Update"' },
        { t: "4. Branch", c: "git branch -M main" },
        { t: "5. Remote", c: "git remote add origin https://github.com/SEU_USER/REPO.git" },
        { t: "6. Push", c: "git push -u origin main" }
      ].map((s,i) => (
        <div key={i} className="bg-white p-4 rounded border flex justify-between items-center">
          <div><h3 className="font-bold">{s.t}</h3><code className="bg-gray-100 p-1 rounded text-sm">{s.c}</code></div>
          <button onClick={() => copy(s.c)} className="p-2 text-gray-400 hover:text-blue-600"><Copy size={20} /></button>
        </div>
      ))}
    </div>
  );
};

// --- APP ROOT ---

function App() {
  const [tab, setTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [scanner, setScanner] = useState(false);
  const [students, setStudents] = useState<Student[]>([]);
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [insight, setInsight] = useState('');
  const [loadingAi, setLoadingAi] = useState(false);

  const refresh = () => { setStudents(getStudents()); setAttendance(getAttendance()); };
  useEffect(() => refresh(), []);

  const handleAi = async () => {
    setLoadingAi(true);
    const res = await generateAttendanceInsights(students, attendance);
    setInsight(res); setLoadingAi(false);
  };

  const Content = () => {
    if (tab === 'dashboard') return <Dashboard students={students} attendance={attendance} />;
    if (tab === 'students') return <StudentsPage students={students} refreshData={refresh} />;
    if (tab === 'reports') return <Reports students={students} attendance={attendance} />;
    if (tab === 'help') return <HelpPage />;
    if (tab === 'insights') return (
      <div className="space-y-6 animate-in">
        <div className="bg-gradient-to-r from-violet-600 to-indigo-600 rounded-xl p-8 text-white shadow-lg">
          <h2 className="text-2xl font-bold flex gap-2 items-center"><Sparkles className="text-yellow-300"/> Inteligência Pastoral</h2>
          <p className="mt-2 mb-6 opacity-90">Análise de dados com IA.</p>
          <button onClick={handleAi} disabled={loadingAi} className="bg-white text-indigo-600 px-6 py-2 rounded-lg font-bold hover:bg-opacity-90">{loadingAi ? '...' : 'Gerar Análise'}</button>
        </div>
        {insight && <div className="bg-white p-6 rounded-xl border prose">{insight}</div>}
      </div>
    );
    return null;
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar activeTab={tab} setActiveTab={setTab} isOpen={sidebarOpen} toggleOpen={() => setSidebarOpen(!sidebarOpen)} />
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        <div className="h-16 md:hidden" />
        <div className="flex-1 overflow-auto p-4 md:p-8 pb-24"><div className="max-w-7xl mx-auto"><Content /></div></div>
        <button onClick={() => setScanner(true)} className="fixed bottom-6 right-6 md:bottom-8 md:right-8 bg-blue-600 text-white p-4 md:px-6 md:py-3 rounded-full shadow-lg hover:bg-blue-700 flex items-center gap-2 z-30 font-bold transition-transform hover:scale-105">
          <ScanLine size={24} /> <span className="hidden md:inline">Escanear</span>
        </button>
      </main>
      {scanner && <Scanner onClose={() => setScanner(false)} onSuccess={refresh} />}
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root')!);
root.render(<React.StrictMode><App /></React.StrictMode>);
