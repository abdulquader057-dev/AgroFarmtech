import React, { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Camera, Upload, Bug, ShieldCheck, AlertTriangle, RefreshCw } from 'lucide-react';
import { detectPest } from '../lib/gemini';
import { PestDetectionResult } from '../types';

export default function PestDetection() {
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<PestDetectionResult | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
        setResult(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const analyzeImage = async () => {
    if (!image) return;
    setLoading(true);
    try {
      const res = await detectPest(image);
      setResult(res);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const severityColors = {
    low: 'bg-green-100 text-green-700',
    medium: 'bg-orange-100 text-orange-700',
    high: 'bg-red-100 text-red-700',
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-foreground">Pest & Disease Detection</h2>
        <p className="text-muted-foreground">Upload a photo of your crop to identify issues and get solutions.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Upload Section */}
        <Card className="border-none shadow-sm rounded-3xl overflow-hidden">
          <CardContent className="p-8">
            <div 
              className={`relative aspect-square rounded-3xl border-2 border-dashed transition-all flex flex-col items-center justify-center gap-4 overflow-hidden ${
                image ? 'border-primary' : 'border-muted-foreground/20 bg-muted/10'
              }`}
            >
              {image ? (
                <>
                  <img src={image} alt="Upload" className="absolute inset-0 w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                    <Button variant="secondary" onClick={() => fileInputRef.current?.click()} className="rounded-xl">
                      Change Photo
                    </Button>
                  </div>
                </>
              ) : (
                <>
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                    <Camera className="text-primary w-8 h-8" />
                  </div>
                  <div className="text-center">
                    <p className="font-bold">Take a Photo or Upload</p>
                    <p className="text-xs text-muted-foreground mt-1">Supports JPG, PNG (Max 5MB)</p>
                  </div>
                  <Button onClick={() => fileInputRef.current?.click()} className="rounded-xl">
                    Select Image
                  </Button>
                </>
              )}
              <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                accept="image/*" 
                onChange={handleImageUpload} 
              />
            </div>

            <Button 
              className="w-full mt-6 bg-primary hover:bg-primary/90 rounded-2xl py-6 h-auto font-bold shadow-lg shadow-primary/20"
              disabled={!image || loading}
              onClick={analyzeImage}
            >
              {loading ? (
                <>
                  <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
                  Analyzing with AI...
                </>
              ) : (
                'Identify Pest/Disease'
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Result Section */}
        <div className="space-y-6">
          {result ? (
            <Card className="border-none shadow-sm rounded-3xl overflow-hidden bg-white">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="text-2xl font-bold">{result.disease}</CardTitle>
                  <Badge className={`${severityColors[result.severity]} border-none rounded-full px-4`}>
                    {result.severity.toUpperCase()} SEVERITY
                  </Badge>
                </div>
                <CardDescription>AI Confidence: {Math.round(result.confidence * 100)}%</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="p-6 bg-muted/30 rounded-3xl">
                  <h4 className="font-bold text-foreground mb-3 flex items-center gap-2">
                    <ShieldCheck className="text-primary w-5 h-5" />
                    Recommended Solution
                  </h4>
                  <p className="text-muted-foreground leading-relaxed">
                    {result.solution}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <Button variant="outline" className="rounded-xl">Order Treatment</Button>
                  <Button variant="outline" className="rounded-xl">Talk to Expert</Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center p-12 bg-muted/20 rounded-3xl border-2 border-dashed border-muted">
              <Bug className="w-16 h-16 text-muted-foreground/30 mb-4" />
              <h4 className="text-lg font-bold text-muted-foreground">No Analysis Yet</h4>
              <p className="text-sm text-muted-foreground mt-2">
                Upload a photo of the affected crop to see AI-generated diagnosis and treatment plans.
              </p>
            </div>
          )}

          {/* Tips Card */}
          <Card className="border-none shadow-sm rounded-3xl overflow-hidden bg-primary text-white">
            <CardContent className="p-6 flex gap-4 items-start">
              <div className="p-2 bg-white/10 rounded-xl">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <p className="font-bold">Pro Tip</p>
                <p className="text-xs text-white/70 mt-1">
                  Ensure the image is well-lit and the affected area is in focus for the best AI accuracy.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
