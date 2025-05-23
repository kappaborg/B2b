"use client";

import { useState, useEffect } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

const categories = [
  { id: 'lingerie', name: 'Lingerie' },
  { id: 'toys', name: 'Adult Toys' },
  { id: 'accessories', name: 'Accessories' },
  { id: 'wellness', name: 'Wellness' },
  { id: 'gift-sets', name: 'Gift Sets' },
];

export default function ProductFilter() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  const [activeFilters, setActiveFilters] = useState({
    category: searchParams.get('category') || '',
    sale: searchParams.get('sale') === 'true',
    new: searchParams.get('new') === 'true',
  });
  
  // Update URL when filters change
  useEffect(() => {
    const params = new URLSearchParams(searchParams);
    
    if (activeFilters.category) {
      params.set('category', activeFilters.category);
    } else {
      params.delete('category');
    }
    
    if (activeFilters.sale) {
      params.set('sale', 'true');
    } else {
      params.delete('sale');
    }
    
    if (activeFilters.new) {
      params.set('new', 'true');
    } else {
      params.delete('new');
    }
    
    router.push(`${pathname}?${params.toString()}`);
  }, [activeFilters, pathname, router, searchParams]);
  
  const clearFilters = () => {
    setActiveFilters({
      category: '',
      sale: false,
      new: false,
    });
  };
  
  const toggleCategory = (category: string) => {
    setActiveFilters(prev => ({
      ...prev,
      category: prev.category === category ? '' : category,
    }));
  };
  
  const toggleSale = () => {
    setActiveFilters(prev => ({
      ...prev,
      sale: !prev.sale,
    }));
  };
  
  const toggleNew = () => {
    setActiveFilters(prev => ({
      ...prev,
      new: !prev.new,
    }));
  };
  
  const hasActiveFilters = activeFilters.category || activeFilters.sale || activeFilters.new;
  
  return (
    <div className="sticky top-20">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium">Filters</h3>
        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={clearFilters}>
            <X size={16} className="mr-1" /> Clear
          </Button>
        )}
      </div>
      
      <div className="space-y-6">
        <Accordion type="multiple" defaultValue={['categories', 'promotions']}>
          <AccordionItem value="categories">
            <AccordionTrigger>Categories</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-2 pt-1">
                {categories.map(category => (
                  <div key={category.id} className="flex items-center space-x-2">
                    <Checkbox 
                      id={`category-${category.id}`} 
                      checked={activeFilters.category === category.id}
                      onCheckedChange={() => toggleCategory(category.id)}
                    />
                    <Label
                      htmlFor={`category-${category.id}`}
                      className="text-sm cursor-pointer"
                    >
                      {category.name}
                    </Label>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="promotions">
            <AccordionTrigger>Promotions</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-2 pt-1">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="sale-items" 
                    checked={activeFilters.sale}
                    onCheckedChange={toggleSale}
                  />
                  <Label
                    htmlFor="sale-items"
                    className="text-sm cursor-pointer"
                  >
                    Sale Items
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="new-arrivals" 
                    checked={activeFilters.new}
                    onCheckedChange={toggleNew}
                  />
                  <Label
                    htmlFor="new-arrivals"
                    className="text-sm cursor-pointer"
                  >
                    New Arrivals
                  </Label>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  );
}