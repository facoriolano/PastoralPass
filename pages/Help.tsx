import React from 'react';
import { Github, Terminal, Copy, Check } from 'lucide-react';

const HelpPage: React.FC = () => {
  const [copiedIndex, setCopiedIndex] = React.useState<number | null>(null);

  const steps = [
    {
      title: "1. Inicializar o Git",
      cmd: "git init",
      desc: "Inicia o monitoramento de versões na pasta do projeto."
    },
    {
      title: "2. Adicionar arquivos",
      cmd: "git add .",
      desc: "Prepara todos os arquivos do projeto para serem salvos."
    },
    {
      title: "3. Salvar versão (Commit)",
      cmd: 'git commit -m "Versão inicial do App"',
      desc: "Salva o estado atual do código com uma mensagem."
    },
    {
      title: "4. Definir branch principal",
      cmd: "git branch -M main",
      desc: "Renomeia o ramo principal para 'main' (padrão atual)."
    },
    {
      title: "5. Conectar ao GitHub",
      cmd: "git remote add origin https://github.com/SEU-USUARIO/NOME-DO-REPO.git",
      desc: "Substitua a URL pela do repositório que você criou no site do GitHub."
    },
    {
      title: "6. Enviar código",
      cmd: "git push -u origin main",
      desc: "Envia seus arquivos para a nuvem."
    }
  ];

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center gap-4 border-b border-gray-200 pb-6">
        <div className="p-3 bg-gray-900 rounded-lg text-white">
          <Github size={32} />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Configuração do GitHub</h1>
          <p className="text-gray-500">Siga o guia abaixo para publicar seu app na nuvem.</p>
        </div>
      </div>

      <div className="grid gap-6">
        {steps.map((step, idx) => (
          <div key={idx} className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex flex-col md:flex-row gap-6 items-start">
            <div className="flex-1">
              <h3 className="font-bold text-gray-800 text-lg mb-1">{step.title}</h3>
              <p className="text-gray-500 text-sm">{step.desc}</p>
            </div>
            <div className="w-full md:w-1/2 bg-gray-900 rounded-lg p-4 relative group">
              <div className="flex items-center gap-2 text-green-400 font-mono text-sm mb-2 opacity-50">
                <Terminal size={14} />
                <span>bash</span>
              </div>
              <code className="text-gray-100 font-mono text-sm break-all">
                {step.cmd}
              </code>
              <button 
                onClick={() => copyToClipboard(step.cmd, idx)}
                className="absolute top-3 right-3 p-2 bg-gray-800 text-gray-400 rounded hover:text-white hover:bg-gray-700 transition-all"
                title="Copiar comando"
              >
                {copiedIndex === idx ? <Check size={16} className="text-green-400" /> : <Copy size={16} />}
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-blue-50 border border-blue-100 rounded-xl p-6 mt-8">
        <h3 className="font-bold text-blue-900 mb-2">Dica Importante</h3>
        <p className="text-blue-700">
          Certifique-se de ter criado um repositório vazio no site do GitHub antes de executar o passo 5. 
          Se precisar de ajuda para instalar o Git no seu computador, acesse <a href="https://git-scm.com/downloads" target="_blank" rel="noreferrer" className="underline font-semibold hover:text-blue-900">git-scm.com</a>.
        </p>
      </div>
    </div>
  );
};

export default HelpPage;
