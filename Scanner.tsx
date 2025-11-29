import React, { useState, useEffect } from 'react';
import { Scan, X, CheckCircle, AlertTriangle } from 'lucide-react';
import { findStudentByQR, markAttendance } from '../services/storage';

interface ScannerProps {
  onClose: () => void;
  onSuccess: () => void;
}

const Scanner: React.FC<ScannerProps> = ({ onClose, onSuccess }) => {
  const [inputVal, setInputVal] = useState('');
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  // Auto-focus input for hardware scanners
  useEffect(() => {
    const input = document.getElementById('qr-input');
    if (input) input.focus();
  }, []);

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
          onSuccess(); // Trigger refresh on parent
        }, 2000);
      } catch (err: any) {
        setStatus('error');
        setMessage(err.message);
      }
    } else {
      setStatus('error');
      setMessage('Aluno não encontrado. Verifique o cadastro.');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/90 z-50 flex flex-col items-center justify-center p-4">
      <button 
        onClick={onClose}
        className="absolute top-4 right-4 text-white p-2 hover:bg-white/10 rounded-full"
      >
        <X size={32} />
      </button>

      <div className="w-full max-w-md bg-white rounded-2xl p-6 text-center shadow-2xl animate-in fade-in zoom-in duration-300">
        <div className="mb-6 flex justify-center">
          <div className={`p-4 rounded-full ${status === 'success' ? 'bg-green-100 text-green-600' : status === 'error' ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'}`}>
            {status === 'success' ? <CheckCircle size={48} /> : status === 'error' ? <AlertTriangle size={48} /> : <Scan size={48} />}
          </div>
        </div>

        <h2 className="text-2xl font-bold text-gray-800 mb-2">Leitor de Presença</h2>
        <p className="text-gray-500 mb-6">Aponte o leitor de código de barras ou digite o ID manualmente.</p>

        <form onSubmit={handleScan} className="relative">
          <input
            id="qr-input"
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            placeholder="Aguardando leitura..."
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none text-lg text-center"
            autoComplete="off"
          />
          <button 
            type="submit"
            className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-xl transition-colors"
          >
            Registrar Manualmente
          </button>
        </form>

        {message && (
          <div className={`mt-4 p-3 rounded-lg text-sm font-medium ${status === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
            {message}
          </div>
        )}

        <div className="mt-6 pt-6 border-t border-gray-100">
           <p className="text-xs text-gray-400">Dica: Use códigos como "101", "102" para testar.</p>
        </div>
      </div>
    </div>
  );
};

export default Scanner;
