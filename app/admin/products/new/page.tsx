"use client";

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, ImagePlus, Save, X } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

interface ProductForm {
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  category: string;
  sizes: string[];
  colors: string[];
  stock: number;
  images: string[];
  isNew: boolean;
  isSale: boolean;
  materials: string[];
  careInstructions: string[];
}

const categories = ['lingerie', 'toys', 'accessories'];
const availableSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
const availableColors = ['Black', 'White', 'Red', 'Pink', 'Purple', 'Blue', 'Green', 'Gold', 'Silver'];

export default function NewProduct() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [form, setForm] = useState<ProductForm>({
    name: '',
    description: '',
    price: 0,
    originalPrice: undefined,
    category: 'lingerie',
    sizes: [],
    colors: [],
    stock: 0,
    images: [],
    isNew: false,
    isSale: false,
    materials: [],
    careInstructions: [],
  });

  const handleInputChange = (field: keyof ProductForm, value: any) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleArrayChange = (field: 'sizes' | 'colors' | 'materials' | 'careInstructions', value: string) => {
    setForm(prev => ({
      ...prev,
      [field]: prev[field].includes(value) 
        ? prev[field].filter(item => item !== value)
        : [...prev[field], value]
    }));
  };

  const handleImageAdd = () => {
    const imageUrl = prompt('Enter image URL (or use local /pics/ folder):');
    if (imageUrl) {
      setForm(prev => ({
        ...prev,
        images: [...prev.images, imageUrl]
      }));
    }
  };

  const handleImageRemove = (index: number) => {
    setForm(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!form.name || !form.description || form.price <= 0 || form.images.length === 0) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields and add at least one image.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "Product Created",
        description: `${form.name} has been successfully created.`,
      });
      
      router.push('/admin/products');
    } catch (error) {
      toast({
        title: "Creation Failed",
        description: "There was a problem creating the product.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <Button variant="ghost" asChild>
            <Link href="/admin/products">
              <ArrowLeft size={16} className="mr-2" />
              Back to Products
            </Link>
          </Button>
        </div>
        <h1 className="text-3xl font-bold elegant-text mb-2">Add New Product</h1>
        <p className="text-muted-foreground">Create a new product for your store</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Basic Information */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
                <CardDescription>Essential product details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="name">Product Name *</Label>
                  <Input
                    id="name"
                    value={form.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="Enter product name"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    value={form.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    placeholder="Enter product description"
                    rows={4}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="category">Category *</Label>
                    <Select value={form.category} onValueChange={(value) => handleInputChange('category', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map(category => (
                          <SelectItem key={category} value={category}>
                            {category.charAt(0).toUpperCase() + category.slice(1)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="stock">Stock Quantity *</Label>
                    <Input
                      id="stock"
                      type="number"
                      min="0"
                      value={form.stock}
                      onChange={(e) => handleInputChange('stock', Number(e.target.value))}
                      placeholder="0"
                      required
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Pricing */}
            <Card>
              <CardHeader>
                <CardTitle>Pricing</CardTitle>
                <CardDescription>Set your product pricing</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="price">Price ($) *</Label>
                    <Input
                      id="price"
                      type="number"
                      min="0"
                      step="0.01"
                      value={form.price}
                      onChange={(e) => handleInputChange('price', Number(e.target.value))}
                      placeholder="0.00"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="originalPrice">Original Price ($)</Label>
                    <Input
                      id="originalPrice"
                      type="number"
                      min="0"
                      step="0.01"
                      value={form.originalPrice || ''}
                      onChange={(e) => handleInputChange('originalPrice', e.target.value ? Number(e.target.value) : undefined)}
                      placeholder="0.00"
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="isSale"
                    checked={form.isSale}
                    onCheckedChange={(checked) => handleInputChange('isSale', checked)}
                  />
                  <Label htmlFor="isSale">On Sale</Label>
                </div>
              </CardContent>
            </Card>

            {/* Variants */}
            <Card>
              <CardHeader>
                <CardTitle>Product Variants</CardTitle>
                <CardDescription>Available sizes and colors</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Sizes</Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {availableSizes.map(size => (
                      <Button
                        key={size}
                        type="button"
                        variant={form.sizes.includes(size) ? "default" : "outline"}
                        size="sm"
                        onClick={() => handleArrayChange('sizes', size)}
                      >
                        {size}
                      </Button>
                    ))}
                  </div>
                </div>

                <div>
                  <Label>Colors</Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {availableColors.map(color => (
                      <Button
                        key={color}
                        type="button"
                        variant={form.colors.includes(color) ? "default" : "outline"}
                        size="sm"
                        onClick={() => handleArrayChange('colors', color)}
                      >
                        {color}
                      </Button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Images */}
            <Card>
              <CardHeader>
                <CardTitle>Product Images</CardTitle>
                <CardDescription>Add product photos</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button type="button" variant="outline" onClick={handleImageAdd}>
                  <ImagePlus size={16} className="mr-2" />
                  Add Image
                </Button>

                {form.images.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {form.images.map((image, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={image}
                          alt={`Product ${index + 1}`}
                          className="w-full h-24 object-cover rounded-lg border"
                        />
                        <Button
                          type="button"
                          size="sm"
                          variant="destructive"
                          className="absolute top-1 right-1 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => handleImageRemove(index)}
                        >
                          <X size={12} />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Settings */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Product Settings</CardTitle>
                <CardDescription>Additional product options</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="isNew"
                    checked={form.isNew}
                    onCheckedChange={(checked) => handleInputChange('isNew', checked)}
                  />
                  <Label htmlFor="isNew">Mark as New</Label>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Product Details</CardTitle>
                <CardDescription>Materials and care instructions</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="materials">Materials (comma separated)</Label>
                  <Input
                    id="materials"
                    value={form.materials.join(', ')}
                    onChange={(e) => handleInputChange('materials', e.target.value.split(',').map(m => m.trim()).filter(m => m))}
                    placeholder="Cotton, Silk, Lace"
                  />
                </div>

                <div>
                  <Label htmlFor="careInstructions">Care Instructions (comma separated)</Label>
                  <Textarea
                    id="careInstructions"
                    value={form.careInstructions.join(', ')}
                    onChange={(e) => handleInputChange('careInstructions', e.target.value.split(',').map(c => c.trim()).filter(c => c))}
                    placeholder="Hand wash, Dry clean only"
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>

            <div className="space-y-3">
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
                disabled={isLoading}
              >
                <Save size={16} className="mr-2" />
                {isLoading ? 'Creating...' : 'Create Product'}
              </Button>

              <Button type="button" variant="outline" className="w-full" asChild>
                <Link href="/admin/products">Cancel</Link>
              </Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
} 