import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sprout, MapPin, Search, Star, Info } from 'lucide-react';
import { getCropRecommendations } from '../lib/gemini';
import { mockLandData, mockWeatherData } from '../lib/mockData';
import { CropRecommendation as CropType } from '../types';

export default function CropRecommendation() {
  const [loading, setLoading] = useState(false);
  const [recommendations, setRecommendations] = useState<CropType[]>([]);

  const fetchRecommendations = async () => {
    setLoading(true);
    try {
      const res = await getCropRecommendations(mockLandData, mockWeatherData);
      setRecommendations(res);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold text-foreground">Crop Recommendation</h2>
          <p className="text-muted-foreground">Find the most profitable and sustainable crops for your land.</p>
        </div>
        <div className="flex gap-3">
          <div className="flex items-center gap-2 px-4 py-2 bg-white border rounded-2xl shadow-sm">
            <MapPin className="text-primary w-4 h-4" />
            <span className="text-sm font-medium">{mockLandData.location}</span>
          </div>
          <Button 
            onClick={fetchRecommendations} 
            disabled={loading}
            className="bg-primary hover:bg-primary/90 rounded-2xl px-6 py-6 h-auto font-bold"
          >
            {loading ? 'Consulting AI...' : 'Get Recommendations'}
          </Button>
        </div>
      </div>

      {recommendations.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {recommendations.map((item, i) => (
            <Card key={i} className="border-none shadow-sm hover:shadow-xl transition-all duration-300 rounded-3xl overflow-hidden group">
              <div className="h-32 earthy-gradient relative">
                <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors" />
                <div className="absolute bottom-4 left-6 flex items-center gap-2">
                  <Badge className="bg-white/20 backdrop-blur-md text-white border-none">
                    {item.suitability}% Match
                  </Badge>
                </div>
              </div>
              <CardContent className="p-6 space-y-4">
                <div className="flex justify-between items-start">
                  <h4 className="text-2xl font-bold text-foreground">{item.crop}</h4>
                  <div className="flex gap-0.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} className={`w-4 h-4 ${star <= Math.round(item.suitability/20) ? 'text-accent fill-accent' : 'text-muted'}`} />
                    ))}
                  </div>
                </div>
                
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {item.reasoning}
                </p>

                <div className="pt-4 border-t space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground font-medium">Planting Time</span>
                    <span className="font-bold text-primary">{item.plantingTime}</span>
                  </div>
                  <Button variant="outline" className="w-full rounded-xl border-primary/20 text-primary hover:bg-primary hover:text-white">
                    View Sowing Guide
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="border-none shadow-sm rounded-3xl overflow-hidden opacity-50">
              <div className="h-32 bg-muted" />
              <CardContent className="p-6 space-y-4">
                <div className="h-6 w-24 bg-muted rounded-md" />
                <div className="h-20 bg-muted rounded-md" />
                <div className="h-10 bg-muted rounded-md" />
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Info Section */}
      <Card className="border-none shadow-sm rounded-3xl overflow-hidden bg-secondary text-white">
        <CardContent className="p-8 flex flex-col md:flex-row items-center gap-8">
          <div className="w-20 h-20 rounded-2xl bg-white/10 flex items-center justify-center shrink-0">
            <Info className="w-10 h-10" />
          </div>
          <div className="space-y-2 text-center md:text-left">
            <h4 className="text-xl font-bold">How it works?</h4>
            <p className="text-white/70 leading-relaxed">
              Our AI model analyzes 10 years of regional weather patterns, your current soil nutrient profile, 
              and real-time market demand to suggest crops that offer the highest yield and profit potential.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
