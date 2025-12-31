
import { GoogleGenAI, Type } from "@google/genai";
import { Judgment } from "../types";

const SYSTEM_PROMPT = `
Ты — ироничный, но разумный оценщик жизненных решений.
Пользователь описывает ситуацию и свой выбор.

Твоя задача:
1. Выбрать одну категорию из списка: "Смело", "Разумно", "Сомнительно", "Рискованно", "Ты точно подумал?", "Это может сработать… но".
2. Добавить короткий комментарий (максимум 2-3 предложения).
3. Допускается лёгкая ирония, сарказм без злобы и разговорный стиль.
4. Будь как ироничный, но любящий друг. Не читай морали.

ОТВЕЧАЙ ТОЛЬКО В ФОРМАТЕ JSON.
`;

export async function evaluateDecision(decision: string): Promise<Judgment> {
  // Важно: создаем инстанс прямо перед использованием
  // process.env.API_KEY внедряется автоматически средой выполнения
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || "" });
  
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Ситуация: ${decision}`,
      config: {
        systemInstruction: SYSTEM_PROMPT,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            category: {
              type: Type.STRING,
              description: "Одна из заданных категорий оценки",
            },
            commentary: {
              type: Type.STRING,
              description: "Ироничный комментарий",
            }
          },
          required: ["category", "commentary"],
        },
      },
    });

    const text = response.text;
    if (!text) throw new Error("Модель не вернула текст приговора.");
    
    return JSON.parse(text) as Judgment;
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("Не удалось получить совет от вселенной. Возможно, стоит попробовать еще раз.");
  }
}
