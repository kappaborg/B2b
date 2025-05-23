"use client";

import Link from 'next/link';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useCart } from '@/components/cart/cart-provider';
import { ShoppingCart } from 'lucide-react';

// Sample product data - in a real app this would come from an API
const allProducts = [
  {
    id: 1,
    name: 'Silk Elegance Set',
    price: 89.99,
    originalPrice: 129.99,
    image: 'https://images.pexels.com/photos/6311603/pexels-photo-6311603.jpeg?auto=compress&cs=tinysrgb&w=1600',
    isNew: true,
    isSale: true,
    category: 'Lingerie',
  },
  {
    id: 2,
    name: 'Premium Vibrator',
    price: 69.99,
    originalPrice: null,
    image: 'https://images.pexels.com/photos/6310484/pexels-photo-6310484.jpeg?auto=compress&cs=tinysrgb&w=1600',
    isNew: true,
    isSale: false,
    category: 'Toys',
  },
  {
    id: 3,
    name: 'Lace Body Suit',
    price: 59.99,
    originalPrice: 79.99,
    image: 'https://images.pexels.com/photos/8069185/pexels-photo-8069185.jpeg?auto=compress&cs=tinysrgb&w=1600',
    isNew: false,
    isSale: true,
    category: 'Lingerie',
  },
  {
    id: 4,
    name: 'Massage Oil Set',
    price: 32.99,
    originalPrice: null,
    image: 'https://images.pexels.com/photos/4465124/pexels-photo-4465124.jpeg?auto=compress&cs=tinysrgb&w=1600',
    isNew: false,
    isSale: false,
    category: 'Wellness',
  },
  {
    id: 5,
    name: 'Satin Restraints',
    price: 24.99,
    originalPrice: 34.99,
    image: 'https://images.pexels.com/photos/10450731/pexels-photo-10450731.jpeg?auto=compress&cs=tinysrgb&w=1600',
    isNew: false,
    isSale: true,
    category: 'Accessories',
  },
];

interface RelatedProductsProps {
  currentProductId: number;
}

export default function RelatedProducts({ currentProductId }: RelatedProductsProps) {
  const { toast } = useToast();
  const { addToCart } = useCart();
  
  // Filter out current product and get 4 random products
  const relatedProducts = allProducts
    .filter(product => product.id !== currentProductId)
    .sort(() => 0.5 - Math.random())
    .slice(0, 4);
  
  const handleAddToCart = (product: any) => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: 1,
    });
    
    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart`,
    });
  };
  
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {relatedProducts.map((product) => (
        <Card key={product.id} className="group overflow-hidden border-0 shadow-md transition-all duration-300 hover:shadow-lg">
          <div className="relative">
            {/* Product badges */}
            <div className="absolute top-2 left-2 z-10 flex flex-col gap-1">
              {product.isNew && (
                <Badge className="bg-purple-600 hover:bg-purple-700">New</Badge>
              )}
              {product.isSale && (
                <Badge className="bg-pink-600 hover:bg-pink-700">Sale</Badge>
              )}
            </div>
            
            {/* Product image */}
            <Link href={`/products/${product.id}`}>
              <div className="relative h-48 overflow-hidden">
                <img 
                  src={product.image} 
                  alt={product.name} 
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" 
                />
              </div>
            </Link>
          </div>
          
          <CardContent className="p-4">
            <div className="mb-1 text-sm text-muted-foreground">{product.category}</div>
            <Link href={`/products/${product.id}`}>
              <h3 className="font-medium group-hover:text-primary transition-colors">{product.name}</h3>
            </Link>
            <div className="mt-2 flex items-center gap-2">
              <span className="font-semibold">${product.price.toFixed(2)}</span>
              {product.originalPrice && (
                <span className="text-sm text-muted-foreground line-through">${product.originalPrice.toFixed(2)}</span>
              )}
            </div>
          </CardContent>
          
          <CardFooter className="p-4 pt-0">
            <Button 
              onClick={() => handleAddToCart(product)}
              className="w-full bg-purple-600 hover:bg-purple-700"
              size="sm"
            >
              <ShoppingCart size={14} className="mr-2" /> Add to Cart
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}