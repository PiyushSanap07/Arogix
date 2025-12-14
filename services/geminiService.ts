import { GoogleGenAI, Chat, GenerateContentResponse } from "@google/genai";

let chatSession: Chat | null = null;

const getAiClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.error("API Key not found in environment variables.");
    return null;
  }
  return new GoogleGenAI({ apiKey });
};

export const initializeChat = async () => {
  const ai = getAiClient();
  if (!ai) return null;

  chatSession = ai.chats.create({
    model: 'gemini-2.5-flash',
    config: {
      systemInstruction: `You are 'Arogix AI', a helpful, calm, and professional medical assistant for a telemedicine platform. 
      Your goal is to help patients understand their symptoms and guide them to the right specialist.
      
      RULES:
      1. Always be empathetic and professional.
      2. Ask clarifying questions if symptoms are vague.
      3. Suggest potential causes but ALWAYS include a disclaimer that you are an AI and this is not a medical diagnosis.
      4. Recommend the type of specialist they should book an appointment with (e.g., Dermatologist, Cardiologist).
      5. If symptoms sound life-threatening (chest pain, trouble breathing, etc.), immediately advise them to call emergency services.
      6. Keep responses concise and easy to read.`,
    },
  });
  return chatSession;
};

export const sendMessageToAi = async (message: string): Promise<string> => {
  if (!chatSession) {
    await initializeChat();
  }

  if (!chatSession) {
    return "I'm having trouble connecting to the medical database right now. Please try again later.";
  }

  try {
    const result: GenerateContentResponse = await chatSession.sendMessage({ message });
    return result.text || "I couldn't generate a response. Please try again.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "I apologize, but I'm unable to process your request at the moment.";
  }
};
