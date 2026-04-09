import { GoogleGenAI, Type } from "@google/genai";
import { LandData, WeatherData, CropRecommendation, PestDetectionResult, Product } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export async function estimateSoilMoisture(
  location: string,
  soilType: string,
  weatherData: WeatherData
): Promise<{ moisture: number; reasoning: string }> {
  const prompt = `Estimate the current soil moisture percentage for a farm in ${location} with ${soilType} soil.
  Current Weather: ${weatherData.temp}°C, ${weatherData.condition}, Humidity: ${weatherData.humidity}%
  Recent Forecast: ${JSON.stringify(weatherData.forecast)}
  
  Provide a realistic estimate (0-100) and a brief reasoning based on evaporation rates and recent weather. Return as JSON with 'moisture' and 'reasoning'.`;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          moisture: { type: Type.NUMBER },
          reasoning: { type: Type.STRING },
        },
        required: ["moisture", "reasoning"],
      },
    },
  });

  return JSON.parse(response.text);
}

export async function getMarketplaceInsight(
  product: Product,
  competitorPrices: number[]
): Promise<{ suggestedPrice: number; reasoning: string }> {
  const prompt = `Analyze the marketplace for ${product.name}. 
  Farmer's Price: ₹${product.price}/${product.unit}
  Competitor Prices: ${competitorPrices.join(', ')}
  
  Suggest a transparent, fair price that benefits both the farmer and consumer by removing middlemen. Return JSON with 'suggestedPrice' and 'reasoning'.`;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          suggestedPrice: { type: Type.NUMBER },
          reasoning: { type: Type.STRING },
        },
        required: ["suggestedPrice", "reasoning"],
      },
    },
  });

  return JSON.parse(response.text);
}

export async function getCropRecommendations(
  landData: LandData,
  weatherData: WeatherData
): Promise<CropRecommendation[]> {
  const prompt = `Based on the following data, recommend the top 3 crops for a farmer in ${landData.location}.
  Soil Type: ${landData.soilType}
  Estimated Moisture: ${landData.estimatedMoisture}%
  Soil Nutrients: N:${landData.nutrients.n}, P:${landData.nutrients.p}, K:${landData.nutrients.k}
  Current Weather: ${weatherData.temp}°C, ${weatherData.condition}
  
  Provide the recommendations in JSON format with fields: crop, suitability (0-100), reasoning, and plantingTime.`;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            crop: { type: Type.STRING },
            suitability: { type: Type.NUMBER },
            reasoning: { type: Type.STRING },
            plantingTime: { type: Type.STRING },
          },
          required: ["crop", "suitability", "reasoning", "plantingTime"],
        },
      },
    },
  });

  return JSON.parse(response.text);
}

export async function detectPest(imageBase64: string): Promise<PestDetectionResult> {
  const imagePart = {
    inlineData: {
      mimeType: "image/jpeg",
      data: imageBase64.split(",")[1],
    },
  };
  
  const textPart = {
    text: "Identify the crop disease or pest in this image. Provide the disease name, confidence score (0-1), a suggested solution, and severity level (low, medium, high). Return as JSON.",
  };

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: { parts: [imagePart, textPart] },
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          disease: { type: Type.STRING },
          confidence: { type: Type.NUMBER },
          solution: { type: Type.STRING },
          severity: { type: Type.STRING, enum: ["low", "medium", "high"] },
        },
        required: ["disease", "confidence", "solution", "severity"],
      },
    },
  });

  return JSON.parse(response.text);
}

export async function getIrrigationInsight(
  landData: LandData,
  weatherData: WeatherData
): Promise<{ recommendation: string; confidence: number }> {
  const prompt = `Analyze estimated soil moisture (${landData.estimatedMoisture}%) and forecast weather (${weatherData.forecast[0].condition}, ${weatherData.forecast[0].temp}°C) to predict if irrigation is needed today. Return JSON with 'recommendation' and 'confidence' (0-100).`;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          recommendation: { type: Type.STRING },
          confidence: { type: Type.NUMBER },
        },
        required: ["recommendation", "confidence"],
      },
    },
  });

  return JSON.parse(response.text);
}
