"use client";
import { useCart } from '@/components/cart/cart-provider';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { useAnalytics } from '@/lib/analytics';
import { useStore } from '@/lib/store';
import { ArrowLeft, Heart, Minus, Package, Plus, ShoppingCart, Star, Truck } from 'lucide-react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

const RelatedProducts = dynamic(() => import('@/components/products/related-products'), { ssr: false, loading: () => <div>Yükleniyor...</div> });
const Testimonials = dynamic(() => import('@/components/home/testimonials'), { ssr: false, loading: () => <div>Yorumlar yükleniyor...</div> });

export default function ProductClient({ product, reviews }: { product: any, reviews: any[] }) {
  const router = useRouter();
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const { toast } = useToast();
  const { addToCart } = useCart();
  const { isFavorite, addToWishlist, removeFromWishlist } = useStore();
  const { trackProductView, trackAddToCart } = useAnalytics();
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewText, setReviewText] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [submittingReview, setSubmittingReview] = useState(false);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);

  // Track product view on component mount
  useEffect(() => {
    if (product) {
      trackProductView(
        product.id.toString(),
        product.name,
        product.category,
        product.price
      );
    }
  }, [product, trackProductView]);

  if (!product) return <div>Ürün bulunamadı.</div>;

  const isWishlisted = isFavorite(product.id);

  const incrementQuantity = () => setQuantity(prev => prev + 1);
  const decrementQuantity = () => { if (quantity > 1) setQuantity(prev => prev - 1); };
  
  const handleAddToCart = () => {
    // Track add to cart event for analytics
    trackAddToCart(
      product.id.toString(),
      product.name,
      product.category,
      product.price,
      quantity
    );

    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.images[0],
      quantity,
    });
    toast({ 
      title: "Added to cart", 
      description: `${product.name} has been added to your cart` 
    });
  };
  
  const toggleWishlist = () => {
    if (isWishlisted) {
      removeFromWishlist(product.id);
      toast({
        title: "Removed from wishlist",
        description: `${product.name} has been removed from your wishlist`,
      });
    } else {
      addToWishlist(product.id);
      toast({
        title: "Added to wishlist",
        description: `${product.name} has been added to your wishlist`,
      });
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Button
        variant="ghost"
        size="sm"
        className="mb-6"
        onClick={() => router.back()}
      >
        <ArrowLeft size={16} className="mr-2" /> Back to Products
      </Button>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        {/* Product Images */}
        <div className="space-y-4">
          <div className="aspect-square overflow-hidden rounded-lg bg-muted relative">
            <Image 
              src={product.images[selectedImage]}
              alt={product.name}
              fill
              className="h-full w-full object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
            />
            {/* Wishlist overlay button */}
            <button
              onClick={toggleWishlist}
              className={`absolute top-4 right-4 p-3 rounded-full shadow-lg transition-all duration-200 ${
                isWishlisted 
                  ? 'bg-red-500 text-white hover:bg-red-600' 
                  : 'bg-white/90 text-gray-600 hover:bg-white hover:text-red-500'
              }`}
              aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
              type="button"
            >
              <Heart size={20} className={isWishlisted ? "fill-current" : ""} />
            </button>
          </div>
          <div className="flex space-x-4">
            {product.images.map((image: string, index: number) => (
              <button
                key={index}
                className={`aspect-square w-20 overflow-hidden rounded-md transition-all ${
                  selectedImage === index 
                    ? 'ring-2 ring-primary' 
                    : 'opacity-70 hover:opacity-100'
                }`}
                onClick={() => setSelectedImage(index)}
                aria-label={`Show image ${index + 1}`}
                tabIndex={0}
                type="button"
              >
                <Image 
                  src={image}
                  alt={`${product.name} thumbnail ${index + 1}`}
                  width={80}
                  height={80}
                  className="h-full w-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>
        
        {/* Product Info */}
        <div>
          <div className="mb-4 flex flex-wrap gap-2">
            {product.isNew && (
              <Badge className="bg-purple-600 hover:bg-purple-700">New</Badge>
            )}
            {product.isSale && (
              <Badge className="bg-pink-600 hover:bg-pink-700">Sale</Badge>
            )}
            {isWishlisted && (
              <Badge className="bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400 border-red-200 dark:border-red-800">
                <Heart size={12} className="mr-1 fill-current" />
                In Wishlist
              </Badge>
            )}
            <Badge variant="outline">{product.category}</Badge>
          </div>
          
          <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
          
          <div className="flex items-center space-x-2 mb-4">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star 
                  key={i} 
                  size={16} 
                  className={i < Math.floor(product.rating) ? "fill-yellow-500 text-yellow-500" : "text-gray-300"} 
                />
              ))}
            </div>
            <span className="text-sm text-muted-foreground">
              {product.rating} ({product.reviewCount} reviews)
            </span>
          </div>
          
          <div className="flex items-center gap-4 mb-6">
            <span className="text-2xl font-bold">${product.price.toFixed(2)}</span>
            {product.originalPrice && (
              <span className="text-lg text-muted-foreground line-through">
                ${product.originalPrice.toFixed(2)}
              </span>
            )}
            {product.originalPrice && (
              <span className="text-pink-600 font-medium">
                Save ${(product.originalPrice - product.price).toFixed(2)}
              </span>
            )}
          </div>
          
          <div className="mb-4">
            {product.variations?.colors?.length > 0 && (
              <div className="mb-2">
                <span className="font-medium mr-2">Color:</span>
                {product.variations.colors.map((color: string) => (
                  <button
                    key={color}
                    type="button"
                    className={`px-3 py-1 rounded border mr-2 transition-all ${
                      selectedColor === color 
                        ? 'bg-purple-600 text-white border-purple-600' 
                        : 'bg-white text-black border-gray-300 hover:border-purple-300'
                    }`}
                    onClick={() => setSelectedColor(color)}
                    aria-label={`Select color ${color}`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            )}
            {product.variations?.sizes?.length > 0 && (
              <div>
                <span className="font-medium mr-2">Size:</span>
                {product.variations.sizes.map((size: string) => (
                  <button
                    key={size}
                    type="button"
                    className={`px-3 py-1 rounded border mr-2 transition-all ${
                      selectedSize === size 
                        ? 'bg-purple-600 text-white border-purple-600' 
                        : 'bg-white text-black border-gray-300 hover:border-purple-300'
                    }`}
                    onClick={() => setSelectedSize(size)}
                    aria-label={`Select size ${size}`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            )}
          </div>
          
          <div className="flex items-center gap-4 mb-6">
            <div className="flex items-center border rounded px-2 py-1">
              <button 
                onClick={decrementQuantity} 
                aria-label="Decrease quantity" 
                type="button"
                className="p-1 hover:bg-gray-100 rounded transition-colors"
                disabled={quantity <= 1}
              >
                <Minus size={16} />
              </button>
              <span className="mx-3 min-w-[2rem] text-center">{quantity}</span>
              <button 
                onClick={incrementQuantity} 
                aria-label="Increase quantity" 
                type="button"
                className="p-1 hover:bg-gray-100 rounded transition-colors"
              >
                <Plus size={16} />
              </button>
            </div>
            <Button 
              onClick={handleAddToCart} 
              className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 flex-1" 
              aria-label="Add to cart" 
              type="button"
              disabled={product.stock <= 0}
            >
              <ShoppingCart size={16} className="mr-2" /> 
              {product.stock <= 0 ? 'Out of Stock' : 'Add to Cart'}
            </Button>
            <Button 
              onClick={toggleWishlist} 
              variant="outline" 
              aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'} 
              type="button"
              className={`${
                isWishlisted 
                  ? 'bg-red-50 border-red-200 text-red-600 hover:bg-red-100 dark:bg-red-950/10 dark:border-red-800 dark:text-red-400' 
                  : 'hover:bg-red-50 hover:border-red-200 hover:text-red-600'
              }`}
            >
              <Heart size={16} className={isWishlisted ? "fill-current" : ""} />
            </Button>
          </div>
          
          <div className="mb-6">
            <span className="font-medium">Stock:</span> 
            <span className={`ml-2 ${product.stock <= 0 ? 'text-red-600' : product.stock <= 5 ? 'text-orange-600' : 'text-green-600'}`}>
              {product.stock > 0 ? `${product.stock} available` : 'Out of stock'}
            </span>
            {product.stock > 0 && product.stock <= 5 && (
              <span className="ml-2 text-orange-600 text-sm">(Low stock!)</span>
            )}
          </div>
          
          <div className="mb-6 flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Truck size={16} />
              <span>Estimated delivery: {product.estimatedDelivery || '2-5 days'}</span>
            </div>
            <div className="flex items-center gap-2">
              <Package size={16} />
              <span>Free shipping on orders over $50</span>
            </div>
          </div>
          
          <div className="mb-8">
            <Tabs defaultValue="description">
              <TabsList>
                <TabsTrigger value="description">Description</TabsTrigger>
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="reviews">Reviews</TabsTrigger>
              </TabsList>
              <TabsContent value="description">
                <p>{product.description}</p>
              </TabsContent>
              <TabsContent value="details">
                <ul className="list-disc pl-5">
                  {product.details?.map((detail: string, i: number) => (
                    <li key={i}>{detail}</li>
                  ))}
                </ul>
              </TabsContent>
              <TabsContent value="reviews">
                <div>
                  {reviews && reviews.length > 0 ? (
                    <ul className="space-y-4">
                      {reviews.map((review: any, i: number) => (
                        <li key={i} className="border-b pb-2">
                          <div className="flex items-center gap-2 mb-1">
                            {[...Array(5)].map((_, j) => (
                              <Star key={j} size={14} className={j < review.rating ? "fill-yellow-500 text-yellow-500" : "text-gray-300"} />
                            ))}
                            <span className="text-xs text-muted-foreground ml-2">{review.date}</span>
                          </div>
                          <div className="text-sm">{review.text}</div>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div>No reviews yet.</div>
                  )}
                  <Button className="mt-4" onClick={() => setShowReviewForm(true)} type="button">Write a Review</Button>
                  {showReviewForm && (
                    <form className="mt-4 space-y-2" onSubmit={async (e) => {
                      e.preventDefault();
                      setSubmittingReview(true);
                      // Yorum gönderme işlemi burada yapılabilir
                      setTimeout(() => {
                        setSubmittingReview(false);
                        setShowReviewForm(false);
                        setReviewText('');
                        setReviewRating(5);
                        toast({ title: "Review submitted!", description: "Thank you for your feedback." });
                      }, 1000);
                    }}>
                      <div className="flex gap-2">
                        {[1,2,3,4,5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setReviewRating(star)}
                            aria-label={`Set rating to ${star}`}
                          >
                            <Star size={20} className={reviewRating >= star ? "fill-yellow-500 text-yellow-500" : "text-gray-300"} />
                          </button>
                        ))}
                      </div>
                      <textarea
                        className="w-full border rounded p-2"
                        rows={3}
                        value={reviewText}
                        onChange={e => setReviewText(e.target.value)}
                        placeholder="Write your review..."
                        required
                      />
                      <Button type="submit" disabled={submittingReview} className="bg-purple-600 hover:bg-purple-700">
                        {submittingReview ? 'Submitting...' : 'Submit Review'}
                      </Button>
                      <Button type="button" variant="outline" onClick={() => setShowReviewForm(false)}>
                        Cancel
                      </Button>
                    </form>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </div>
          <div className="mb-8">
            <RelatedProducts currentProductId={product.id} />
          </div>
          <div>
            <Testimonials />
          </div>
        </div>
      </div>
    </div>
  );
} 