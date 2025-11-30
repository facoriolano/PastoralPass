import React from 'react';
import { Quote, Wifi } from 'lucide-react';

const Dedication: React.FC = () => {
  return (
    <div className="w-full mb-8 relative group">
      {/* Background Gradient Effect */}
      <div className="absolute -inset-0.5 bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 rounded-xl opacity-30 group-hover:opacity-60 transition duration-500 blur-sm"></div>
      
      <div className="relative bg-surface border border-border rounded-xl p-8 overflow-hidden">
        {/* Decorative Pixel Corners */}
        <div className="absolute top-2 left-2 w-2 h-2 bg-yellow-500/50"></div>
        <div className="absolute top-2 right-2 w-2 h-2 bg-yellow-500/50"></div>
        <div className="absolute bottom-2 left-2 w-2 h-2 bg-yellow-500/50"></div>
        <div className="absolute bottom-2 right-2 w-2 h-2 bg-yellow-500/50"></div>

        <div className="flex flex-col items-center text-center z-10 relative">
          
          <div className="mb-6 p-3 bg-yellow-500/10 rounded-full border border-yellow-500/20">
             <Wifi className="text-yellow-500" size={24} />
          </div>

          <h3 className="font-pixel text-xs md:text-sm text-yellow-500 mb-6 uppercase tracking-widest">
            Dedicatória Especial
          </h3>

          <div className="relative mb-6">
            <Quote size={20} className="absolute -top-3 -left-4 text-gray-600 transform -scale-x-100" />
            <p className="font-pixel text-sm md:text-base lg:text-lg leading-loose text-gray-200 max-w-2xl px-4">
              "A Eucaristia é a minha autoestrada para o Céu."
            </p>
            <Quote size={20} className="absolute -bottom-3 -right-4 text-gray-600" />
          </div>

          <div className="w-16 h-0.5 bg-gradient-to-r from-transparent via-gray-600 to-transparent mb-6"></div>

          <p className="font-sans text-sm text-gray-400 italic max-w-xl mx-auto leading-relaxed">
            Dedicado a <strong className="text-white">São Carlo Acutis</strong> (Canonizado em 12/10/2025), padroeiro da Internet, e à <strong className="text-white">Turma de Crisma 26</strong>. Que este aplicativo seja um instrumento digital para aproximar corações de Deus.
          </p>
          
          <div className="mt-6 flex gap-2">
            <span className="px-2 py-1 bg-surface border border-gray-700 text-[10px] text-gray-500 font-pixel rounded">
              #SaoCarloAcutis
            </span>
            <span className="px-2 py-1 bg-surface border border-gray-700 text-[10px] text-gray-500 font-pixel rounded">
              #Crisma26
            </span>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Dedication;
