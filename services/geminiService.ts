
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const analyzeMarket = async (symbol: string, assetType: string) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `Perform an ultra-professional, institutional-grade market analysis for ${symbol} (${assetType}). 
      1. Use Google Search to find the latest real-time news, economic data, and sentiment regarding ${symbol}.
      2. Analyze recent headlines to determine if the overall market sentiment is BULLISH, BEARISH, or NEUTRAL.
      3. Evaluate technical indicators (RSI, MACD) and order book depth simulation.
      4. Provide a clear signal: BUY, SELL, or HOLD.
      5. Formulate a rationale that includes specific news events or data points found.`,
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            signal: { type: Type.STRING, description: 'BUY, SELL, or HOLD' },
            sentiment: { type: Type.STRING, description: 'BULLISH, BEARISH, or NEUTRAL' },
            confidence: { type: Type.NUMBER, description: 'Percentage 0-100' },
            indicators: {
              type: Type.OBJECT,
              properties: {
                rsi: { type: Type.NUMBER },
                macd: { type: Type.STRING }
              }
            },
            summary: { type: Type.STRING },
            suggestedSL: { type: Type.NUMBER },
            suggestedTP: { type: Type.NUMBER },
            headlines: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: 'Top 3 recent news headlines analyzed'
            }
          },
          required: ['signal', 'sentiment', 'confidence', 'summary', 'headlines']
        }
      }
    });

    const text = response.text;
    if (!text) return null;

    const analysis = JSON.parse(text);
    // Extract grounding URLs as per guidelines
    const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks
      ?.map(chunk => chunk.web)
      .filter(Boolean) || [];

    return { analysis, sources };
  } catch (error) {
    console.error("Analysis failed", error);
    return null;
  }
};
