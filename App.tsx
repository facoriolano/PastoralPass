import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import StudentsPage from './pages/Students';
import Reports from './pages/Reports';
import Scanner from './components/Scanner';
import HelpPage from './pages/Help';
import { getStudents, getAttendance } from './services/storage';
import { generateAttendanceInsights } from './services/gemini';
import { Sparkles, ScanLine } from 'lucide-react';
import { Student, AttendanceRecord } from './types';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showScanner, setShowScanner] = useState(false);
  const [students, setStudents] = useState<Student[]>([]);
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  
  // AI State
  const [aiInsight, setAiInsight] = useState('');
  const [isLoadingAi, setIsLoadingAi] = useState(false);

  // Load Data
  const refreshData = () => {
    setStudents(getStudents());
    setAttendance(getAttendance());
  };

  useEffect(() => {
    refreshData();
  }, []);

  const handleAiAnalysis = async () => {
    setIsLoadingAi(true);
    const result = await generateAttendanceInsights(students, attendance);
    setAiInsight(result);
    setIsLoadingAi(false);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard students={students} attendance={attendance} />;
      case 'students':
        return <StudentsPage students={students} refreshData={refreshData} />;
      case 'reports':
        return <Reports students={students} attendance={attendance} />;
      case 'help':
        return <HelpPage />;
      case 'insights':
        return (
          <div className="space-y-6">
             <div className="bg-gradient-to-r from-violet-600 to-indigo-600 rounded-xl p-8 text-white shadow-lg">
                <div className="flex items-center gap-3 mb-4">
                  <Sparkles className="text-yellow-300" />
                  <h2 className="text-2xl font-bold">Inteligência Pastoral</h2>
                </div>
                <p className="mb-6 text-indigo-100 max-w-2xl">
                  Utilize nossa IA para analisar padrões de frequência, identificar alunos em risco de evasão e sugerir melhorias para os encontros.
                </p>
                <button 
                  onClick={handleAiAnalysis}
                  disabled={isLoadingAi}
                  className="bg-white text-indigo-600 px-6 py-3 rounded-lg font-bold hover:bg-indigo-50 transition-colors disabled:opacity-70 flex items-center gap-2"
                >
                  {isLoadingAi ? 'Analisando...' : 'Gerar Relatório Inteligente'}
                </button>
             </div>

             {aiInsight && (
               <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 prose max-w-none">
                 <h3 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2">Resultado da Análise</h3>
                 <div className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                   {aiInsight}
                 </div>
               </div>
             )}
          </div>
        );
      default:
        return <Dashboard students={students} attendance={attendance} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        isOpen={isSidebarOpen} 
        toggleOpen={() => setIsSidebarOpen(!isSidebarOpen)} 
      />

      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Mobile Header Spacer - Sidebar handles the actual header visual on mobile */}
        <div className="h-16 md:hidden"></div>

        <div className="flex-1 overflow-auto p-4 md:p-8">
          <div className="max-w-7xl mx-auto pb-20 md:pb-0">
             {renderContent()}
          </div>
        </div>

        {/* Floating Action Button for Scanner (Mobile Primary Action) */}
        <button
          onClick={() => setShowScanner(true)}
          className="fixed bottom-6 right-6 md:hidden bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition-transform active:scale-95 z-30"
          aria-label="Escanear QR Code"
        >
          <ScanLine size={28} />
        </button>

         {/* Desktop Scanner Button (Top Right absolute or fixed usually, but let's put it in a fixed corner for access) */}
         <button
          onClick={() => setShowScanner(true)}
          className="hidden md:flex fixed bottom-8 right-8 bg-blue-600 text-white px-6 py-3 rounded-full shadow-lg hover:bg-blue-700 transition-transform hover:-translate-y-1 items-center gap-2 z-30 font-semibold"
        >
          <ScanLine size={20} />
          Escanear Presença
        </button>
      </main>

      {showScanner && (
        <Scanner 
          onClose={() => setShowScanner(false)} 
          onSuccess={refreshData}
        />
      )}
    </div>
  );
}

export default App;