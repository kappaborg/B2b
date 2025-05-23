"use client";

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, ImagePlus, Save, Trash2, X } from 'lucide-react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import useSWR from 'swr';

const fetcher = (url: string) => fetch(url).then(res => res.json());

interface ProductForm {
  id: number;
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
  tags: string[];
  sku: string;
  weight: number;
  dimensions: {
    length: number;
    width: number;
    height: number;
  };
  seo: {
    metaTitle: string;
    metaDescription: string;
    metaKeywords: string[];
  };
  inventory: {
    trackQuantity: boolean;
    allowBackorder: boolean;
    lowStockThreshold: number;
  };
  shipping: {
    requiresShipping: boolean;
    shippingClass: string;
    freeShipping: boolean;
  };
}

const categories = ['lingerie', 'toys', 'accessories'];
const availableSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
const availableColors = ['Black', 'White', 'Red', 'Pink', 'Purple', 'Blue', 'Green', 'Gold', 'Silver'];
const shippingClasses = ['standard', 'fragile', 'heavy', 'oversized'];

export default function EditProduct() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  
  const { data: product, error } = useSWR(
    params.id ? `/api/products/${params.id}` : null,
    fetcher
  );

  const [form, setForm] = useState<ProductForm>({
    id: 0,
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
    tags: [],
    sku: '',
    weight: 0,
    dimensions: {
      length: 0,
      width: 0,
      height: 0,
    },
    seo: {
      metaTitle: '',
      metaDescription: '',
      metaKeywords: [],
    },
    inventory: {
      trackQuantity: true,
      allowBackorder: false,
      lowStockThreshold: 5,
    },
    shipping: {
      requiresShipping: true,
      shippingClass: 'standard',
      freeShipping: false,
    },
  });

  // Load product data into form when available
  useEffect(() => {
    if (product) {
      setForm({
        id: product.id,
        name: product.name || '',
        description: product.description || '',
        price: product.price || 0,
        originalPrice: product.originalPrice,
        category: product.category || 'lingerie',
        sizes: product.sizes || [],
        colors: product.colors || [],
        stock: product.stock || 0,
        images: product.images || [],
        isNew: product.isNew || false,
        isSale: product.isSale || false,
        materials: product.materials || [],
        careInstructions: product.careInstructions || [],
        tags: product.tags || [],
        sku: product.sku || `SKU-${product.id}`,
        weight: product.weight || 0,
        dimensions: product.dimensions || {
          length: 0,
          width: 0,
          height: 0,
        },
        seo: product.seo || {
          metaTitle: product.name || '',
          metaDescription: product.description || '',
          metaKeywords: [],
        },
        inventory: product.inventory || {
          trackQuantity: true,
          allowBackorder: false,
          lowStockThreshold: 5,
        },
        shipping: product.shipping || {
          requiresShipping: true,
          shippingClass: 'standard',
          freeShipping: false,
        },
      });
    }
  }, [product]);

  const handleInputChange = (field: keyof ProductForm, value: any) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleNestedInputChange = (parent: keyof ProductForm, field: string, value: any) => {
    setForm(prev => ({
      ...prev,
      [parent]: {
        ...(prev[parent] as any),
        [field]: value
      }
    }));
  };

  const handleArrayChange = (field: 'sizes' | 'colors' | 'materials' | 'careInstructions' | 'tags', value: string) => {
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
    
    if (!form.name || !form.description || form.price <= 0) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "Product Updated",
        description: `${form.name} has been successfully updated.`,
      });
      
      router.push('/admin/products');
    } catch (error) {
      toast({
        title: "Update Failed",
        description: "There was a problem updating the product.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm(`Are you sure you want to delete "${form.name}"? This action cannot be undone.`)) {
      return;
    }

    setIsDeleting(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast({
        title: "Product Deleted",
        description: `${form.name} has been deleted successfully.`,
      });
      
      router.push('/admin/products');
    } catch (error) {
      toast({
        title: "Delete Failed",
        description: "There was a problem deleting the product.",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  if (!params.id) {
    return <div>Invalid product ID</div>;
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Product not found</h2>
          <p className="text-muted-foreground mb-4">
            The product you're looking for doesn't exist.
          </p>
          <Button asChild>
            <Link href="/admin/products">
              <ArrowLeft size={16} className="mr-2" />
              Back to Products
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-48 bg-gray-200 rounded"></div>
              ))}
            </div>
            <div className="space-y-6">
              {[...Array(2)].map((_, i) => (
                <div key={i} className="h-32 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

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
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold elegant-text mb-2">Edit Product</h1>
            <p className="text-muted-foreground">Update product information and settings</p>
          </div>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            <Trash2 size={16} className="mr-2" />
            {isDeleting ? 'Deleting...' : 'Delete Product'}
          </Button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
                <CardDescription>Essential product details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    <Label htmlFor="sku">SKU</Label>
                    <Input
                      id="sku"
                      value={form.sku}
                      onChange={(e) => handleInputChange('sku', e.target.value)}
                      placeholder="Product SKU"
                    />
                  </div>
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
                    <Label htmlFor="tags">Tags (comma separated)</Label>
                    <Input
                      id="tags"
                      value={form.tags.join(', ')}
                      onChange={(e) => handleInputChange('tags', e.target.value.split(',').map(t => t.trim()).filter(t => t))}
                      placeholder="luxury, silk, elegant"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Pricing */}
            <Card>
              <CardHeader>
                <CardTitle>Pricing & Stock</CardTitle>
                <CardDescription>Set pricing and inventory</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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

                <div className="flex flex-wrap gap-4">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="isSale"
                      checked={form.isSale}
                      onCheckedChange={(checked) => handleInputChange('isSale', checked)}
                    />
                    <Label htmlFor="isSale">On Sale</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="isNew"
                      checked={form.isNew}
                      onCheckedChange={(checked) => handleInputChange('isNew', checked)}
                    />
                    <Label htmlFor="isNew">Mark as New</Label>
                  </div>
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

            {/* SEO */}
            <Card>
              <CardHeader>
                <CardTitle>SEO Settings</CardTitle>
                <CardDescription>Search engine optimization</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="metaTitle">Meta Title</Label>
                  <Input
                    id="metaTitle"
                    value={form.seo.metaTitle}
                    onChange={(e) => handleNestedInputChange('seo', 'metaTitle', e.target.value)}
                    placeholder="SEO-friendly title"
                  />
                </div>

                <div>
                  <Label htmlFor="metaDescription">Meta Description</Label>
                  <Textarea
                    id="metaDescription"
                    value={form.seo.metaDescription}
                    onChange={(e) => handleNestedInputChange('seo', 'metaDescription', e.target.value)}
                    placeholder="SEO-friendly description"
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="metaKeywords">Meta Keywords (comma separated)</Label>
                  <Input
                    id="metaKeywords"
                    value={form.seo.metaKeywords.join(', ')}
                    onChange={(e) => handleNestedInputChange('seo', 'metaKeywords', e.target.value.split(',').map(k => k.trim()).filter(k => k))}
                    placeholder="lingerie, silk, luxury"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Images */}
            <Card>
              <CardHeader>
                <CardTitle>Product Images</CardTitle>
                <CardDescription>Upload and manage product photos</CardDescription>
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
                        {index === 0 && (
                          <span className="absolute bottom-1 left-1 bg-blue-500 text-white text-xs px-1 rounded">
                            Main
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Product Details */}
            <Card>
              <CardHeader>
                <CardTitle>Product Details</CardTitle>
                <CardDescription>Materials and care</CardDescription>
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

                <div>
                  <Label htmlFor="weight">Weight (kg)</Label>
                  <Input
                    id="weight"
                    type="number"
                    min="0"
                    step="0.01"
                    value={form.weight}
                    onChange={(e) => handleInputChange('weight', Number(e.target.value))}
                    placeholder="0.00"
                  />
                </div>

                <div>
                  <Label>Dimensions (cm)</Label>
                  <div className="grid grid-cols-3 gap-2 mt-1">
                    <Input
                      type="number"
                      min="0"
                      step="0.1"
                      value={form.dimensions.length}
                      onChange={(e) => handleNestedInputChange('dimensions', 'length', Number(e.target.value))}
                      placeholder="L"
                    />
                    <Input
                      type="number"
                      min="0"
                      step="0.1"
                      value={form.dimensions.width}
                      onChange={(e) => handleNestedInputChange('dimensions', 'width', Number(e.target.value))}
                      placeholder="W"
                    />
                    <Input
                      type="number"
                      min="0"
                      step="0.1"
                      value={form.dimensions.height}
                      onChange={(e) => handleNestedInputChange('dimensions', 'height', Number(e.target.value))}
                      placeholder="H"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Inventory */}
            <Card>
              <CardHeader>
                <CardTitle>Inventory Settings</CardTitle>
                <CardDescription>Stock management</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="trackQuantity">Track Quantity</Label>
                    <p className="text-sm text-muted-foreground">Monitor stock levels</p>
                  </div>
                  <Switch
                    id="trackQuantity"
                    checked={form.inventory.trackQuantity}
                    onCheckedChange={(checked) => handleNestedInputChange('inventory', 'trackQuantity', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="allowBackorder">Allow Backorder</Label>
                    <p className="text-sm text-muted-foreground">Accept orders when out of stock</p>
                  </div>
                  <Switch
                    id="allowBackorder"
                    checked={form.inventory.allowBackorder}
                    onCheckedChange={(checked) => handleNestedInputChange('inventory', 'allowBackorder', checked)}
                  />
                </div>

                <div>
                  <Label htmlFor="lowStockThreshold">Low Stock Threshold</Label>
                  <Input
                    id="lowStockThreshold"
                    type="number"
                    min="0"
                    value={form.inventory.lowStockThreshold}
                    onChange={(e) => handleNestedInputChange('inventory', 'lowStockThreshold', Number(e.target.value))}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Shipping */}
            <Card>
              <CardHeader>
                <CardTitle>Shipping Settings</CardTitle>
                <CardDescription>Delivery options</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="requiresShipping">Requires Shipping</Label>
                    <p className="text-sm text-muted-foreground">Physical product needs delivery</p>
                  </div>
                  <Switch
                    id="requiresShipping"
                    checked={form.shipping.requiresShipping}
                    onCheckedChange={(checked) => handleNestedInputChange('shipping', 'requiresShipping', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="freeShipping">Free Shipping</Label>
                    <p className="text-sm text-muted-foreground">No shipping cost for this item</p>
                  </div>
                  <Switch
                    id="freeShipping"
                    checked={form.shipping.freeShipping}
                    onCheckedChange={(checked) => handleNestedInputChange('shipping', 'freeShipping', checked)}
                  />
                </div>

                <div>
                  <Label htmlFor="shippingClass">Shipping Class</Label>
                  <Select value={form.shipping.shippingClass} onValueChange={(value) => handleNestedInputChange('shipping', 'shippingClass', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {shippingClasses.map(cls => (
                        <SelectItem key={cls} value={cls}>
                          {cls.charAt(0).toUpperCase() + cls.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <div className="space-y-3">
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
                disabled={isSaving}
              >
                <Save size={16} className="mr-2" />
                {isSaving ? 'Updating...' : 'Update Product'}
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