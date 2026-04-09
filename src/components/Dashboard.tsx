import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Thermometer, 
  Droplets, 
  Wind, 
  Sun, 
  Sprout, 
  AlertTriangle,
  ArrowUpRight,
  ArrowDownRight,
  CloudSun,
  MapPin,
  RefreshCw,
  Zap,
  Info
} from 'lucide-react';
import { mockLandData, mockWeatherData } from '../lib/mockData';
import { estimateSoilMoisture } from '../lib/gemini';
import { Language } from '../types';

interface DashboardProps {
  language: Language;
}

export default function Dashboard({ language }: DashboardProps) {
  const [estimating, setEstimating] = useState(false);
  const [moistureData, setMoistureData] = useState({
    moisture: mockLandData.estimatedMoisture,
    reasoning: "Based on recent rainfall and soil type."
  });

  const runEstimation = async () => {
    setEstimating(true);
    try {
      const res = await estimateSoilMoisture(mockLandData.location, mockLandData.soilType, mockWeatherData);
      setMoistureData(res);
    } catch (error) {
      console.error(error);
    } finally {
      setEstimating(false);
    }
  };

  const stats = [
    { label: 'Estimated Moisture', value: `${moistureData.moisture}%`, icon: Droplets, color: 'text-blue-500', bg: 'bg-blue-50', status: 'AI Predicted' },
    { label: 'Soil Type', value: mockLandData.soilType, icon: MapPin, color: 'text-orange-500', bg: 'bg-orange-50', status: 'Verified' },
    { label: 'Last Rainfall', value: mockLandData.lastRainfall, icon: Wind, color: 'text-teal-500', bg: 'bg-teal-50', status: 'Guntur Station' },
    { label: 'Nutrients (N)', value: `${mockLandData.nutrients.n} mg/kg`, icon: Sprout, color: 'text-green-500', bg: 'bg-green-50', status: 'Optimal' },
  ];

  return (
    <div className="space-y-8">
      {/* Hero Alert */}
      <div className="relative overflow-hidden rounded-3xl earthy-gradient p-8 text-white shadow-xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <Badge variant="secondary" className="bg-white/20 text-white border-none hover:bg-white/30">
              AI Insight
            </Badge>
            <h3 className="text-3xl font-bold">No Sensors Needed</h3>
            <p className="text-white/80 max-w-md">
              We use satellite data and weather patterns to estimate your soil moisture with 92% accuracy.
            </p>
          </div>
          <Button 
            onClick={runEstimation}
            disabled={estimating}
            className="bg-white text-primary hover:bg-white/90 rounded-2xl px-8 py-6 h-auto font-bold text-lg shadow-lg"
          >
            {estimating ? <RefreshCw className="w-5 h-5 animate-spin mr-2" /> : <Zap className="w-5 h-5 mr-2" />}
            Refresh AI Estimate
          </Button>
        </div>
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-48 h-48 bg-accent/20 rounded-full blur-2xl" />
      </div>

      {/* AI Reasoning Card */}
      {moistureData.reasoning && (
        <Card className="border-none shadow-sm bg-blue-50/50 rounded-3xl overflow-hidden">
          <CardContent className="p-6 flex items-start gap-4">
            <div className="p-2 bg-blue-100 rounded-xl">
              <Info className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-bold text-blue-900">AI Reasoning</p>
              <p className="text-xs text-blue-700 mt-1">{moistureData.reasoning}</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <Card key={i} className="border-none shadow-sm hover:shadow-md transition-shadow rounded-3xl overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-2xl ${stat.bg}`}>
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
                <Badge variant="outline" className="rounded-full font-medium">
                  {stat.status}
                </Badge>
              </div>
              <div className="space-y-1">
                <p className="text-muted-foreground text-sm font-medium">{stat.label}</p>
                <h4 className="text-xl font-bold text-foreground truncate">{stat.value}</h4>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Weather Card */}
        <Card className="lg:col-span-2 border-none shadow-sm rounded-3xl overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xl font-bold">Weather Forecast</CardTitle>
            <Button variant="ghost" size="sm" className="text-primary font-bold">
              Full Report
            </Button>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-8 items-center py-4">
              <div className="flex items-center gap-6">
                <div className="w-24 h-24 bg-accent/10 rounded-full flex items-center justify-center">
                  <Sun className="w-12 h-12 text-accent" />
                </div>
                <div>
                  <h5 className="text-4xl font-bold">{mockWeatherData.temp}°C</h5>
                  <p className="text-muted-foreground font-medium">{mockWeatherData.condition}</p>
                </div>
              </div>
              
              <div className="flex-1 grid grid-cols-3 gap-4 w-full">
                {mockWeatherData.forecast.map((f, i) => (
                  <div key={i} className="bg-muted/30 rounded-2xl p-4 text-center space-y-2">
                    <p className="text-xs font-bold text-muted-foreground uppercase">{f.day}</p>
                    <div className="flex justify-center">
                      <CloudSun className="w-6 h-6 text-primary/60" />
                    </div>
                    <p className="font-bold">{f.temp}°C</p>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Alerts Card */}
        <Card className="border-none shadow-sm rounded-3xl overflow-hidden">
          <CardHeader>
            <CardTitle className="text-xl font-bold">Recent Alerts</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-4 p-4 bg-red-50 rounded-2xl border border-red-100">
              <div className="p-2 bg-red-100 rounded-xl h-fit">
                <AlertTriangle className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <p className="text-sm font-bold text-red-900">Low Soil Nitrogen</p>
                <p className="text-xs text-red-700 mt-1">Field B requires fertilization within 3 days.</p>
              </div>
            </div>
            <div className="flex gap-4 p-4 bg-orange-50 rounded-2xl border border-orange-100">
              <div className="p-2 bg-orange-100 rounded-xl h-fit">
                <Droplets className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <p className="text-sm font-bold text-orange-900">Irrigation Needed</p>
                <p className="text-xs text-orange-700 mt-1">Predicted dry spell starting tomorrow.</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
