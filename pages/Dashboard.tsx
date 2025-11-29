import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { Users, UserCheck, UserX, Calendar } from 'lucide-react';
import { Student, AttendanceRecord } from '../types';

interface DashboardProps {
  students: Student[];
  attendance: AttendanceRecord[];
}

const StatCard: React.FC<{ title: string; value: string | number; icon: any; color: string }> = ({ title, value, icon: Icon, color }) => (
  <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 flex items-start justify-between">
    <div>
      <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
      <h3 className="text-3xl font-bold text-gray-900">{value}</h3>
    </div>
    <div className={`p-3 rounded-lg ${color}`}>
      <Icon size={24} className="text-white" />
    </div>
  </div>
);

const Dashboard: React.FC<DashboardProps> = ({ students, attendance }) => {
  const stats = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    const totalStudents = students.length;
    const presentToday = attendance.filter(r => r.dateString === today).length;
    const absentToday = totalStudents - presentToday;
    
    // Group attendance by date for the chart (last 7 days)
    const chartData = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dStr = d.toISOString().split('T')[0];
      const count = attendance.filter(r => r.dateString === dStr).length;
      chartData.push({
        name: d.toLocaleDateString('pt-BR', { weekday: 'short' }),
        presentes: count,
        total: totalStudents
      });
    }

    return { totalStudents, presentToday, absentToday, chartData };
  }, [students, attendance]);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500">Visão geral da presença hoje.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total de Alunos" 
          value={stats.totalStudents} 
          icon={Users} 
          color="bg-blue-500" 
        />
        <StatCard 
          title="Presentes Hoje" 
          value={stats.presentToday} 
          icon={UserCheck} 
          color="bg-green-500" 
        />
        <StatCard 
          title="Faltantes Hoje" 
          value={stats.absentToday} 
          icon={UserX} 
          color="bg-red-500" 
        />
        <StatCard 
          title="Presenças no Mês" 
          value={attendance.length} 
          icon={Calendar} 
          color="bg-purple-500" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-gray-800 mb-6">Frequência Semanal</h3>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip 
                   cursor={{fill: '#f3f4f6'}}
                   contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="presentes" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Atividade Recente</h3>
          <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2">
            {attendance.length === 0 ? (
               <p className="text-sm text-gray-400">Nenhuma atividade registrada.</p>
            ) : (
              attendance.slice().reverse().slice(0, 10).map((record) => (
                <div key={record.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{record.studentName}</p>
                    <p className="text-xs text-gray-500">{new Date(record.timestamp).toLocaleTimeString()} - {record.pastoral}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
