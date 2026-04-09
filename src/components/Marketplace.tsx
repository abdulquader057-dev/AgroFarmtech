import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  ShoppingBag, 
  Search, 
  Filter, 
  MapPin, 
  Star, 
  ShoppingCart, 
  ArrowRight,
  ShieldCheck,
  Truck,
  DollarSign
} from 'lucide-react';
import { mockProducts } from '../lib/mockData';
import { Product } from '../types';
import { motion } from 'motion/react';
import { toast } from 'sonner';

export default function Marketplace() {
  const [searchTerm, setSearchTerm] = useState('');
  const [products, setProducts] = useState<Product[]>(mockProducts);

  const handleAddToCart = (product: Product) => {
    toast.success(`Added ${product.name} to cart`, {
      description: "Direct from farmer price applied."
    });
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h2 className="text-3xl font-bold text-foreground">F2C Marketplace</h2>
          <p className="text-muted-foreground">Direct from farmers. Transparent pricing. No middlemen.</p>
        </div>
        <div className="flex w-full md:w-auto gap-3">
          <div className="relative flex-1 md:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input 
              placeholder="Search organic produce..." 
              className="pl-10 rounded-2xl border-muted-foreground/20"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button variant="outline" size="icon" className="rounded-2xl shrink-0">
            <Filter className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Benefits Banner */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { icon: ShieldCheck, title: 'Verified Farmers', desc: 'Directly from certified rural farms', color: 'text-green-600', bg: 'bg-green-50' },
          { icon: DollarSign, title: 'Fair Pricing', desc: 'Farmers get 100% of the price', color: 'text-blue-600', bg: 'bg-blue-50' },
          { icon: Truck, title: 'Local Delivery', desc: 'Coordinated local logistics', color: 'text-orange-600', bg: 'bg-orange-50' },
        ].map((benefit, i) => (
          <div key={i} className={`${benefit.bg} p-4 rounded-2xl flex items-center gap-4`}>
            <div className={`p-2 bg-white rounded-xl shadow-sm`}>
              <benefit.icon className={`w-5 h-5 ${benefit.color}`} />
            </div>
            <div>
              <h4 className="text-sm font-bold">{benefit.title}</h4>
              <p className="text-[10px] text-muted-foreground">{benefit.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product, i) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Card className="border-none shadow-sm hover:shadow-xl transition-all duration-300 rounded-3xl overflow-hidden group">
              <div className="aspect-[4/3] relative overflow-hidden">
                <img 
                  src={product.imageUrl} 
                  alt={product.name} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-4 left-4">
                  <Badge className="bg-white/80 backdrop-blur-md text-primary border-none font-bold">
                    {product.category}
                  </Badge>
                </div>
                <div className="absolute bottom-4 right-4">
                  <div className="bg-primary text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
                    ₹{product.price}/{product.unit}
                  </div>
                </div>
              </div>
              <CardContent className="p-6 space-y-4">
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xl font-bold text-foreground">{product.name}</h4>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-accent fill-accent" />
                      <span className="text-xs font-bold">4.8</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <MapPin className="w-3 h-3" />
                    <span className="text-xs">{product.location}</span>
                  </div>
                </div>

                <p className="text-sm text-muted-foreground line-clamp-2">
                  {product.description}
                </p>

                <div className="flex items-center gap-3 pt-2">
                  <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-xs font-bold text-primary">
                    {product.farmerName[0]}
                  </div>
                  <span className="text-xs font-medium text-muted-foreground">Sold by <span className="text-foreground font-bold">{product.farmerName}</span></span>
                </div>

                <div className="pt-4 flex gap-2">
                  <Button 
                    onClick={() => handleAddToCart(product)}
                    className="flex-1 rounded-xl bg-primary hover:bg-primary/90 font-bold"
                  >
                    Add to Cart
                  </Button>
                  <Button variant="outline" size="icon" className="rounded-xl border-primary/20 text-primary">
                    <ShoppingCart className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
