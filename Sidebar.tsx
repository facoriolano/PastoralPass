import React from 'react';
import { Home, Users, ClipboardList, PieChart, LogOut, Menu, Github } from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isOpen: boolean;
  toggleOpen: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, isOpen, toggleOpen }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Painel', icon: Home },
    { id: 'students', label: 'Alunos', icon: Users },
    { id: 'reports', label: 'Relatórios', icon: ClipboardList },
    { id: 'insights', label: 'IA Insights', icon: PieChart },
    { id: 'help', label: 'GitHub / Ajuda', icon: Github },
  ];

  return (
    <>
      {/* Mobile Toggle */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-white border-b flex items-center px-4 z-40">
        <button onClick={toggleOpen} className="p-2 text-gray-600">
          <Menu size={24} />
        </button>
        <span className="ml-3 font-bold text-lg text-blue-900">PastoralPass</span>
      </div>

      {/* Sidebar Container */}
      <aside className={`
        fixed md:static inset-y-0 left-0 z-40
        w-64 bg-slate-900 text-white transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        md:translate-x-0 flex flex-col
      `}>
        <div className="h-16 flex items-center px-6 border-b border-slate-700 bg-slate-950">
           <span className="font-bold text-xl tracking-tight">PastoralPass</span>
        </div>

        <nav className="flex-1 py-6 px-3 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  if (window.innerWidth < 768) toggleOpen();
                }}
                className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg transition-colors ${
                  isActive 
                    ? 'bg-blue-600 text-white' 
                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <Icon size={20} />
                <span className="font-medium">{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-700">
          <button className="flex items-center gap-3 text-slate-400 hover:text-white transition-colors w-full px-3 py-2">
            <LogOut size={20} />
            <span>Sair</span>
          </button>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={toggleOpen}
        />
      )}
    </>
  );
};

export default Sidebar;