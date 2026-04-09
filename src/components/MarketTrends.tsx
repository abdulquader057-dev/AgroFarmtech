import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, Minus, ArrowRight } from 'lucide-react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';
import { mockMarketPrices } from '../lib/mockData';

export default function MarketTrends() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-foreground">Market Price Prediction</h2>
        <p className="text-muted-foreground">Real-time crop prices and future trend analysis.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Price List */}
        <div className="space-y-4">
          {mockMarketPrices.map((item, i) => (
            <Card key={i} className="border-none shadow-sm rounded-3xl overflow-hidden hover:shadow-md transition-shadow">
              <CardContent className="p-6 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-muted/50 flex items-center justify-center font-bold text-primary">
                    {item.crop[0]}
                  </div>
                  <div>
                    <h4 className="font-bold text-lg">{item.crop}</h4>
                    <p className="text-xs text-muted-foreground">Current Rate</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xl font-bold">₹{item.currentPrice}</p>
                  <div className={`flex items-center justify-end gap-1 text-xs font-bold ${
                    item.trend === 'up' ? 'text-green-600' : item.trend === 'down' ? 'text-red-600' : 'text-muted-foreground'
                  }`}>
                    {item.trend === 'up' && <TrendingUp className="w-3 h-3" />}
                    {item.trend === 'down' && <TrendingDown className="w-3 h-3" />}
                    {item.trend === 'stable' && <Minus className="w-3 h-3" />}
                    {item.trend.toUpperCase()}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
          
          <Button variant="outline" className="w-full rounded-2xl py-6 h-auto border-dashed border-2 hover:bg-muted/50">
            Add Custom Crop Track
          </Button>
        </div>

        {/* Chart Section */}
        <Card className="lg:col-span-2 border-none shadow-sm rounded-3xl overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-xl font-bold">Price Trends (Rice)</CardTitle>
              <p className="text-xs text-muted-foreground">Historical data for the last 30 days</p>
            </div>
            <Badge className="bg-green-100 text-green-700 border-none">+4.5% this month</Badge>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={mockMarketPrices[0].history}>
                  <defs>
                    <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2D5A27" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#2D5A27" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E8E4D9" />
                  <XAxis 
                    dataKey="date" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 10, fill: '#6B6B6B' }}
                    dy={10}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 10, fill: '#6B6B6B' }}
                    dx={-10}
                  />
                  <Tooltip 
                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="price" 
                    stroke="#2D5A27" 
                    strokeWidth={3}
                    fillOpacity={1} 
                    fill="url(#colorPrice)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div className="mt-8 p-6 bg-primary/5 rounded-3xl border border-primary/10 flex items-center justify-between">
              <div>
                <h5 className="font-bold text-primary">AI Prediction</h5>
                <p className="text-sm text-foreground/70">Rice prices are expected to rise by 2-3% next week due to supply constraints.</p>
              </div>
              <Button size="sm" className="rounded-xl">Sell Now <ArrowRight className="ml-2 w-4 h-4" /></Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
