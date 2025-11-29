import React, { useState } from 'react';
import { Download, Filter, FileText, Check, X as XIcon } from 'lucide-react';
import { Student, AttendanceRecord, PastoralType } from '../types';

interface ReportsProps {
  students: Student[];
  attendance: AttendanceRecord[];
}

const Reports: React.FC<ReportsProps> = ({ students, attendance }) => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [pastoralFilter, setPastoralFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'present' | 'absent'>('all');

  // Logic to build the report
  const reportData = students.map(student => {
    const isPresent = attendance.some(
      r => r.studentId === student.id && r.dateString === selectedDate
    );
    return { ...student, isPresent };
  });

  const filteredData = reportData.filter(item => {
    if (pastoralFilter !== 'all' && item.pastoral !== pastoralFilter) return false;
    if (statusFilter === 'present' && !item.isPresent) return false;
    if (statusFilter === 'absent' && item.isPresent) return false;
    return true;
  });

  const exportCSV = () => {
    const headers = ['ID', 'Nome', 'Pastoral', 'Data', 'Status'];
    const rows = filteredData.map(d => [
      d.id,
      d.name,
      d.pastoral,
      selectedDate,
      d.isPresent ? 'PRESENTE' : 'FALTA'
    ]);

    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `presenca_${selectedDate}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Relatórios</h1>
          <p className="text-gray-500">Comparativo de presença vs faltas.</p>
        </div>
        <button 
          onClick={exportCSV}
          className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
        >
          <Download size={20} />
          Exportar CSV
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Data</label>
          <input 
            type="date" 
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Pastoral</label>
          <select 
            value={pastoralFilter}
            onChange={(e) => setPastoralFilter(e.target.value)}
            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white"
          >
            <option value="all">Todas</option>
            {Object.values(PastoralType).map(p => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Status</label>
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button 
              onClick={() => setStatusFilter('all')}
              className={`flex-1 py-1 text-sm rounded-md transition-colors ${statusFilter === 'all' ? 'bg-white shadow-sm text-blue-700 font-medium' : 'text-gray-500'}`}
            >
              Todos
            </button>
            <button 
              onClick={() => setStatusFilter('present')}
              className={`flex-1 py-1 text-sm rounded-md transition-colors ${statusFilter === 'present' ? 'bg-white shadow-sm text-green-700 font-medium' : 'text-gray-500'}`}
            >
              Presentes
            </button>
            <button 
              onClick={() => setStatusFilter('absent')}
              className={`flex-1 py-1 text-sm rounded-md transition-colors ${statusFilter === 'absent' ? 'bg-white shadow-sm text-red-700 font-medium' : 'text-gray-500'}`}
            >
              Faltas
            </button>
          </div>
        </div>
      </div>

      {/* Stats Summary for Filtered View */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-blue-50 p-4 rounded-lg text-center">
          <span className="text-sm text-blue-600 font-medium">Total Listado</span>
          <p className="text-2xl font-bold text-blue-800">{filteredData.length}</p>
        </div>
        <div className="bg-green-50 p-4 rounded-lg text-center">
          <span className="text-sm text-green-600 font-medium">Presentes</span>
          <p className="text-2xl font-bold text-green-800">
            {filteredData.filter(d => d.isPresent).length}
          </p>
        </div>
        <div className="bg-red-50 p-4 rounded-lg text-center">
          <span className="text-sm text-red-600 font-medium">Faltas</span>
          <p className="text-2xl font-bold text-red-800">
            {filteredData.filter(d => !d.isPresent).length}
          </p>
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-gray-600 font-medium text-sm">
              <tr>
                <th className="px-6 py-3">Aluno</th>
                <th className="px-6 py-3">Pastoral</th>
                <th className="px-6 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredData.length > 0 ? (
                filteredData.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium text-gray-900">{item.name}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{item.pastoral}</td>
                    <td className="px-6 py-4">
                      {item.isPresent ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          <Check size={12} />
                          Presente
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                          <XIcon size={12} />
                          Ausente
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                   <td colSpan={3} className="px-6 py-8 text-center text-gray-400">
                    Nenhum registro para este filtro.
                   </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Reports;
