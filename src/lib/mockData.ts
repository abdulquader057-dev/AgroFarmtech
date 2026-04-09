import { LandData, WeatherData, MarketPrice, Product } from "../types";

export const mockLandData: LandData = {
  location: "Guntur, Andhra Pradesh",
  soilType: "Black Cotton Soil",
  lastRainfall: "2 days ago",
  estimatedMoisture: 42,
  nutrients: { n: 45, p: 30, k: 55 },
  timestamp: new Date().toISOString(),
};

export const mockWeatherData: WeatherData = {
  temp: 30,
  condition: "Sunny",
  humidity: 60,
  windSpeed: 12,
  forecast: [
    { day: "Tomorrow", temp: 31, condition: "Partly Cloudy" },
    { day: "Friday", temp: 29, condition: "Showers" },
    { day: "Saturday", temp: 28, condition: "Sunny" },
  ],
};

export const mockMarketPrices: MarketPrice[] = [
  {
    crop: "Rice",
    currentPrice: 2200,
    trend: "up",
    history: [
      { date: "2024-03-01", price: 2100 },
      { date: "2024-03-15", price: 2150 },
      { date: "2024-04-01", price: 2200 },
    ],
  },
  {
    crop: "Wheat",
    currentPrice: 2400,
    trend: "stable",
    history: [
      { date: "2024-03-01", price: 2380 },
      { date: "2024-03-15", price: 2400 },
      { date: "2024-04-01", price: 2400 },
    ],
  },
  {
    crop: "Cotton",
    currentPrice: 7500,
    trend: "down",
    history: [
      { date: "2024-03-01", price: 7800 },
      { date: "2024-03-15", price: 7650 },
      { date: "2024-04-01", price: 7500 },
    ],
  },
];

export const mockProducts: Product[] = [
  {
    id: '1',
    farmerId: 'farmer123',
    farmerName: 'Ramesh Kumar',
    name: 'Organic Sona Masuri Rice',
    description: 'Freshly harvested, chemical-free organic rice direct from the fields of Guntur.',
    price: 65,
    unit: 'kg',
    category: 'Grains',
    stock: 500,
    imageUrl: 'https://picsum.photos/seed/rice/400/300',
    location: 'Guntur, AP',
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    farmerId: 'farmer456',
    farmerName: 'Suresh Babu',
    name: 'Natural Turmeric Powder',
    description: 'High curcumin content turmeric, sun-dried and stone-ground.',
    price: 180,
    unit: 'kg',
    category: 'Spices',
    stock: 50,
    imageUrl: 'https://picsum.photos/seed/turmeric/400/300',
    location: 'Nizamabad, TS',
    createdAt: new Date().toISOString(),
  },
];
