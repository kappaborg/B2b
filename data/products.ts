// Mock ürün verisi
export const products = [
  {
    id: 1,
    name: 'Seductive Lace Bra Set',
    price: 89.99,
    originalPrice: 129.99,
    images: [
      '/images/product_1.png',
      '/images/product_2.png',
      '/images/product_3.png',
    ],
    isNew: true,
    isSale: true,
    category: 'Lingerie',
    tags: ['silk', 'set', 'elegant', 'lace', 'sexy'],
    description: "Indulge in luxury with our Seductive Lace Bra Set. Crafted from premium silk with delicate lace detailing, this exquisite lingerie set combines comfort with sensuality. The intricate lace patterns and adjustable straps ensure a perfect fit, while the soft fabric feels gentle against your skin. Designed to make you feel confident and alluring.",
    specs: [
      { name: 'Material', value: '100% Premium Silk with Lace Detailing' },
      { name: 'Colors', value: 'Black, Red, Pearl White' },
      { name: 'Sizes', value: 'XS, S, M, L, XL' },
      { name: 'Care', value: 'Hand wash cold, hang dry' },
    ],
    inStock: true,
    stock: 12,
    variations: {
      colors: ['Black', 'Red', 'Pearl White'],
      sizes: ['XS', 'S', 'M', 'L', 'XL'],
    },
    estimatedDelivery: '3-5 business days',
    rating: 4.8,
    reviewCount: 124,
  },
  {
    id: 2,
    name: 'Luxury Intimate Vibrator',
    price: 69.99,
    originalPrice: 99.99,
    images: [
      '/images/product_4.png',
      '/images/product_5.png',
      '/images/product_6.png',
    ],
    isNew: false,
    isSale: true,
    category: 'Toys',
    tags: ['vibrator', 'premium', 'luxury', 'pleasure'],
    description: "Experience ultimate pleasure with our Luxury Intimate Vibrator. Made from body-safe medical silicone, this premium toy features 10 different vibration modes to suit your desires. Whisper-quiet motor and waterproof design make it perfect for discreet enjoyment. USB rechargeable for convenience.",
    specs: [
      { name: 'Material', value: 'Medical Grade Silicone' },
      { name: 'Colors', value: 'Purple, Black, Rose Gold' },
      { name: 'Modes', value: '10 Vibration Patterns' },
      { name: 'Battery', value: 'USB Rechargeable, 2+ hours runtime' },
    ],
    inStock: true,
    stock: 7,
    variations: {
      colors: ['Purple', 'Black', 'Rose Gold'],
      sizes: [],
    },
    estimatedDelivery: '2-4 business days',
    rating: 4.6,
    reviewCount: 87,
  },
  {
    id: 3,
    name: 'Passionate Lace Bodysuit',
    price: 59.99,
    originalPrice: 79.99,
    images: [
      '/images/product_7.png',
      '/images/product_8.png',
      '/images/product_9.png',
    ],
    isNew: true,
    isSale: false,
    category: 'Lingerie',
    tags: ['lace', 'bodysuit', 'passionate', 'sexy'],
    description: "Embrace your sensuality with our Passionate Lace Bodysuit. This stunning one-piece features intricate floral lace patterns that accentuate your curves beautifully. The snap closure bottom and adjustable straps provide comfort and convenience. Perfect for intimate moments or layering under your favorite outfit.",
    specs: [
      { name: 'Material', value: 'Premium Stretch Lace' },
      { name: 'Colors', value: 'Black, White, Burgundy' },
      { name: 'Sizes', value: 'S, M, L, XL' },
      { name: 'Features', value: 'Snap closure, adjustable straps' },
    ],
    inStock: true,
    stock: 4,
    variations: {
      colors: ['Black', 'White', 'Burgundy'],
      sizes: ['S', 'M', 'L', 'XL'],
    },
    estimatedDelivery: '4-7 business days',
    rating: 4.9,
    reviewCount: 102,
  },
  {
    id: 4,
    name: 'Sensual Massage Oil Collection',
    price: 32.99,
    originalPrice: 39.99,
    images: [
      '/images/product_10.png',
      '/images/product_11.png',
    ],
    isNew: false,
    isSale: false,
    category: 'Wellness',
    tags: ['massage', 'oil', 'wellness', 'sensual', 'couples'],
    description: "Enhance your intimate moments with our Sensual Massage Oil Collection. This curated set includes three luxurious massage oils with aphrodisiac scents. Made with natural ingredients and skin-nourishing oils, they provide smooth glide and leave skin feeling soft and aromatic. Perfect for couples seeking to deepen their connection.",
    specs: [
      { name: 'Volume', value: '100ml x 3 bottles' },
      { name: 'Scents', value: 'Lavender, Vanilla, Rose' },
      { name: 'Ingredients', value: 'Natural oils, Vitamin E' },
      { name: 'Features', value: 'Non-sticky, skin safe' },
    ],
    inStock: true,
    stock: 20,
    variations: {
      colors: [],
      sizes: [],
    },
    estimatedDelivery: '2-3 business days',
    rating: 4.7,
    reviewCount: 55,
  },
  {
    id: 5,
    name: 'Enchanting Teddy Lingerie',
    price: 44.99,
    originalPrice: 64.99,
    images: [
      '/images/product_12.png',
      '/images/product_13.png',
    ],
    isNew: true,
    isSale: true,
    category: 'Lingerie',
    tags: ['teddy', 'enchanting', 'lingerie', 'romantic'],
    description: "Captivate with our Enchanting Teddy Lingerie. This alluring one-piece features sheer mesh panels and delicate embroidery that highlights your natural beauty. The comfortable stretch fabric and flattering cut make it perfect for special occasions or intimate evenings.",
    specs: [
      { name: 'Material', value: 'Stretch Mesh with Embroidery' },
      { name: 'Colors', value: 'Black, Red, Navy' },
      { name: 'Sizes', value: 'XS, S, M, L, XL' },
      { name: 'Features', value: 'Adjustable straps, hook closure' },
    ],
    inStock: true,
    stock: 8,
    variations: {
      colors: ['Black', 'Red', 'Navy'],
      sizes: ['XS', 'S', 'M', 'L', 'XL'],
    },
    estimatedDelivery: '3-5 business days',
    rating: 4.5,
    reviewCount: 73,
  },
  {
    id: 6,
    name: 'Tempting Silk Chemise',
    price: 76.99,
    originalPrice: 99.99,
    images: [
      '/images/product_14.png',
      '/images/product_15.png',
      '/images/product.png',
    ],
    isNew: false,
    isSale: true,
    category: 'Lingerie',
    tags: ['silk', 'chemise', 'tempting', 'elegant'],
    description: "Indulge in luxury with our Tempting Silk Chemise. Made from pure mulberry silk, this elegant nightwear piece drapes beautifully on your body. The lace trim and adjustable straps add feminine touches while ensuring the perfect fit. Feel sophisticated and sensual every night.",
    specs: [
      { name: 'Material', value: '100% Mulberry Silk' },
      { name: 'Colors', value: 'Champagne, Black, Blush Pink' },
      { name: 'Sizes', value: 'S, M, L, XL' },
      { name: 'Care', value: 'Dry clean or hand wash in cold water' },
    ],
    inStock: true,
    stock: 6,
    variations: {
      colors: ['Champagne', 'Black', 'Blush Pink'],
      sizes: ['S', 'M', 'L', 'XL'],
    },
    estimatedDelivery: '4-6 business days',
    rating: 4.8,
    reviewCount: 91,
  },
]; 