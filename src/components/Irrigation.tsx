import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Droplets, Calendar, Zap, CheckCircle2, AlertCircle } from 'lucide-react';
import { getIrrigationInsight } from '../lib/gemini';
import { mockLandData, mockWeatherData } from '../lib/mockData';

export default function Irrigation() {
  const [loading, setLoading] = useState(false);
  const [insight, setInsight] = useState<{ recommendation: string; confidence: number } | null>(null);

  const analyzeIrrigation = async () => {
    setLoading(true);
    try {
      const res = await getIrrigationInsight(mockLandData, mockWeatherData);
      setInsight(res);
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
          <h2 className="text-3xl font-bold text-foreground">Smart Irrigation</h2>
          <p className="text-muted-foreground">AI-powered water management based on land data.</p>
        </div>
        <Button 
          onClick={analyzeIrrigation} 
          disabled={loading}
          className="bg-primary hover:bg-primary/90 rounded-2xl px-6 py-6 h-auto font-bold shadow-lg shadow-primary/20"
        >
          {loading ? 'Analyzing...' : 'Run AI Analysis'}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Status Card */}
        <Card className="border-none shadow-sm rounded-3xl overflow-hidden">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Droplets className="text-blue-500 w-5 h-5" />
              Land Status
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between text-sm font-medium">
                <span>Estimated Moisture</span>
                <span>{mockLandData.estimatedMoisture}%</span>
              </div>
              <div className="h-3 bg-muted rounded-full overflow-hidden">
                <div 
                  className="h-full bg-blue-500 transition-all duration-1000" 
                  style={{ width: `${mockLandData.estimatedMoisture}%` }} 
                />
              </div>
              <p className="text-[10px] text-muted-foreground">Threshold: 40% (Critical below 25%)</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-muted/30 p-4 rounded-2xl">
                <p className="text-xs text-muted-foreground font-bold uppercase">Last Watered</p>
                <p className="text-lg font-bold">6h ago</p>
              </div>
              <div className="bg-muted/30 p-4 rounded-2xl">
                <p className="text-xs text-muted-foreground font-bold uppercase">Next Cycle</p>
                <p className="text-lg font-bold">Pending</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* AI Recommendation */}
        <Card className="lg:col-span-2 border-none shadow-sm rounded-3xl overflow-hidden bg-white">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="text-accent w-5 h-5" />
              AI Recommendation
            </CardTitle>
            <CardDescription>Based on real-time soil and weather data</CardDescription>
          </CardHeader>
          <CardContent>
            {insight ? (
              <div className="space-y-6">
                <div className="p-6 bg-primary/5 rounded-3xl border border-primary/10">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-primary/10 rounded-2xl">
                      <CheckCircle2 className="text-primary w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="text-xl font-bold text-primary mb-2">Recommendation</h4>
                      <p className="text-foreground/80 leading-relaxed">{insight.recommendation}</p>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-4 bg-muted/30 rounded-2xl">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold">Confidence Score</span>
                    <Badge variant="secondary" className="bg-accent/20 text-accent-foreground border-none">
                      {insight.confidence}%
                    </Badge>
                  </div>
                  <Button className="rounded-xl">Execute Now</Button>
                </div>
              </div>
            ) : (
              <div className="h-48 flex flex-col items-center justify-center text-center space-y-4">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center">
                  <Zap className="text-muted-foreground w-8 h-8" />
                </div>
                <p className="text-muted-foreground max-w-xs">
                  Click 'Run AI Analysis' to get real-time irrigation recommendations.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
