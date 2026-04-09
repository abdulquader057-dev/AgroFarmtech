export interface LandData {
  location: string;
  soilType: string;
  lastRainfall: string;
  estimatedMoisture: number;
  nutrients: {
    n: number;
    p: number;
    k: number;
  };
  timestamp: string;
}

export interface Product {
  id: string;
  farmerId: string;
  farmerName: string;
  name: string;
  description: string;
  price: number;
  unit: string;
  category: string;
  stock: number;
  imageUrl: string;
  location: string;
  createdAt: string;
}

export interface Order {
  id: string;
  productId: string;
  productName: string;
  buyerId: string;
  buyerName: string;
  sellerId: string;
  quantity: number;
  totalPrice: number;
  status: 'pending' | 'shipped' | 'delivered' | 'cancelled';
  deliveryAddress: string;
  createdAt: string;
}

export interface WeatherData {
  temp: number;
  condition: string;
  humidity: number;
  windSpeed: number;
  forecast: {
    day: string;
    temp: number;
    condition: string;
  }[];
}

export interface CropRecommendation {
  crop: string;
  suitability: number;
  reasoning: string;
  plantingTime: string;
}

export interface MarketPrice {
  crop: string;
  currentPrice: number;
  trend: 'up' | 'down' | 'stable';
  history: { date: string; price: number }[];
}

export interface PestDetectionResult {
  disease: string;
  confidence: number;
  solution: string;
  severity: 'low' | 'medium' | 'high';
}

export type Language = 'en' | 'te' | 'hi';
