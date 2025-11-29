import { GoogleGenAI } from "@google/genai";
import { AttendanceRecord, Student } from "../types";

// In a real app, never expose keys in client code. This is for demo context.
const apiKey = process.env.API_KEY || ''; 

let ai: GoogleGenAI | null = null;
try {
    if (apiKey) {
        ai = new GoogleGenAI({ apiKey });
    }
} catch (error) {
    console.error("Failed to initialize Gemini:", error);
}

export const generateAttendanceInsights = async (
  students: Student[], 
  attendance: AttendanceRecord[]
): Promise<string> => {
  if (!ai) {
    return "API Key do Gemini não configurada. Configure process.env.API_KEY para ver insights de IA.";
  }

  // Prepare a concise summary for the model
  const totalStudents = students.length;
  const totalRecords = attendance.length;
  
  // Group by date
  const byDate: Record<string, number> = {};
  attendance.forEach(r => {
    byDate[r.dateString] = (byDate[r.dateString] || 0) + 1;
  });

  const prompt = `
    Atue como um analista de dados de uma paróquia. Analise os seguintes dados de presença da Catequese/Crisma:
    
    Total de Alunos Matriculados: ${totalStudents}
    Total de Registros de Presença: ${totalRecords}
    Presença por dia: ${JSON.stringify(byDate)}
    
    Lista de Alunos: ${JSON.stringify(students.map(s => ({name: s.name, pastoral: s.pastoral})))}
    
    Por favor, forneça:
    1. Uma análise breve da tendência de presença.
    2. Identifique qual pastoral parece ter melhor engajamento (baseado na proporção).
    3. Sugira uma ação para melhorar a presença se os números estiverem baixos (invente algo motivacional).
    
    Responda em formato Markdown, curto e direto. Use emojis.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    return response.text || "Não foi possível gerar insights no momento.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Erro ao comunicar com a Inteligência Artificial. Verifique sua conexão ou chave de API.";
  }
};
