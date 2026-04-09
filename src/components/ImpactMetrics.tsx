import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Globe, Droplets, TrendingUp, DollarSign, Leaf, Zap } from 'lucide-react';
import { motion } from 'motion/react';

export default function ImpactMetrics() {
  const metrics = [
    { label: 'Water Saved', value: '1.2M Liters', icon: Droplets, color: 'text-blue-500', bg: 'bg-blue-50', sub: 'vs traditional methods' },
    { label: 'Yield Increase', value: '+24%', icon: TrendingUp, color: 'text-green-500', bg: 'bg-green-50', sub: 'Average across all crops' },
    { label: 'Cost Reduction', value: '₹45,000', icon: DollarSign, color: 'text-orange-500', bg: 'bg-orange-50', sub: 'Saved on fertilizers & water' },
    { label: 'Carbon Offset', value: '2.5 Tons', icon: Leaf, color: 'text-teal-500', bg: 'bg-teal-50', sub: 'CO2 equivalent reduced' },
  ];

  return (
    <div className="space-y-8">
      <div className="text-center max-w-2xl mx-auto space-y-4">
        <h2 className="text-4xl font-bold text-foreground">Your Impact</h2>
        <p className="text-muted-foreground">
          See how Smart Farming AI is helping you build a more sustainable and profitable future.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((m, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
          >
            <Card className="border-none shadow-sm rounded-3xl overflow-hidden h-full">
              <CardContent className="p-8 flex flex-col items-center text-center space-y-4">
                <div className={`w-16 h-16 rounded-2xl ${m.bg} flex items-center justify-center`}>
                  <m.icon className={`w-8 h-8 ${m.color}`} />
                </div>
                <div className="space-y-1">
                  <h4 className="text-3xl font-bold text-foreground">{m.value}</h4>
                  <p className="text-sm font-bold text-primary uppercase tracking-wider">{m.label}</p>
                </div>
                <p className="text-xs text-muted-foreground">{m.sub}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="border-none shadow-sm rounded-3xl overflow-hidden earthy-gradient text-white">
          <CardContent className="p-10 space-y-6">
            <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="text-3xl font-bold">Sustainability Score</h3>
            <div className="flex items-end gap-4">
              <span className="text-7xl font-black">88</span>
              <span className="text-2xl font-bold text-white/60 mb-2">/ 100</span>
            </div>
            <p className="text-white/80 leading-relaxed">
              Your farm is performing better than 92% of regional farms in water efficiency and nutrient management.
            </p>
            <Button className="bg-white text-primary hover:bg-white/90 rounded-xl px-8">
              Download Sustainability Report
            </Button>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm rounded-3xl overflow-hidden bg-white">
          <CardHeader>
            <CardTitle className="text-xl font-bold">Community Benchmarking</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {[
              { label: 'Water Efficiency', value: 94 },
              { label: 'Soil Health', value: 72 },
              { label: 'Market Timing', value: 85 },
            ].map((item, i) => (
              <div key={i} className="space-y-2">
                <div className="flex justify-between text-sm font-bold">
                  <span>{item.label}</span>
                  <span className="text-primary">{item.value}%</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${item.value}%` }}
                    transition={{ duration: 1, delay: 0.5 + i * 0.1 }}
                    className="h-full bg-primary"
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
