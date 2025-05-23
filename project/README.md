# 🌟 Luxe Intimates - Premium E-commerce Platform

A modern, full-featured e-commerce platform built with Next.js 13, TypeScript, and Tailwind CSS. Features a complete admin panel, analytics integration, and production-ready deployment configuration.

## ✨ Features

### 🛍️ Customer Features
- **Product Catalog** - Browse premium intimate products with advanced filtering
- **Shopping Cart** - Add/remove items with persistent storage
- **Wishlist** - Save favorite products for later
- **Product Reviews** - Read and write product reviews
- **Responsive Design** - Optimized for all devices
- **Search & Filter** - Find products by category, price, and features

### 🔧 Admin Panel
- **Dashboard** - Overview of sales, orders, and analytics
- **Product Management** - CRUD operations with image upload
- **Order Management** - Track and update order status
- **Customer Management** - View customer data and order history
- **Analytics Dashboard** - Sales trends and business insights
- **Settings Panel** - Configure store settings and preferences

### 📊 Analytics & SEO
- **Google Analytics 4** - Enhanced e-commerce tracking
- **Vercel Analytics** - Real-time performance insights
- **SEO Optimized** - Meta tags, sitemap, robots.txt
- **Performance Monitoring** - Core Web Vitals tracking

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Git

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/luxe-intimates.git
cd luxe-intimates

# Install dependencies
npm install

# Start development server
npm run dev
```

Visit `http://localhost:3000` to see the application.

## 🏗️ Tech Stack

- **Framework:** Next.js 13 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **UI Components:** Radix UI + Shadcn/ui
- **State Management:** Zustand
- **Data Fetching:** SWR
- **Analytics:** Google Analytics 4 + Vercel Analytics
- **Deployment:** Vercel

## 📁 Project Structure

```
project/
├── app/                    # Next.js 13 app directory
│   ├── admin/             # Admin panel pages
│   ├── api/               # API routes
│   ├── auth/              # Authentication pages
│   ├── checkout/          # Checkout process
│   ├── products/          # Product pages
│   └── layout.tsx         # Root layout
├── components/            # Reusable components
│   ├── admin/            # Admin-specific components
│   ├── auth/             # Authentication components
│   ├── cart/             # Shopping cart components
│   ├── layout/           # Layout components
│   ├── products/         # Product components
│   └── ui/               # Base UI components
├── lib/                  # Utility libraries
│   ├── analytics.ts      # Analytics configuration
│   └── store.ts          # Zustand store
├── hooks/                # Custom React hooks
├── types/                # TypeScript type definitions
└── public/               # Static assets
```

## 🌐 Deployment

### Vercel Deployment (Recommended)

1. **Push to GitHub:**
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Deploy to Vercel:**
   - Visit [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Configure environment variables (see below)
   - Deploy!

### Environment Variables

Create these environment variables in your Vercel dashboard:

```env
# Required
NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app
NEXT_PUBLIC_APP_NAME=Luxe Intimates
NODE_ENV=production

# Analytics (Optional)
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
NEXT_PUBLIC_VERCEL_ANALYTICS_ID=your_vercel_analytics_id
NEXT_PUBLIC_ENABLE_ANALYTICS=true

# Feature Flags
NEXT_PUBLIC_ENABLE_PAYMENTS=true
NEXT_PUBLIC_MAINTENANCE_MODE=false
```

### Custom Domain Setup

1. In Vercel Dashboard → Settings → Domains
2. Add your custom domain
3. Configure DNS:
   ```
   Type: CNAME
   Name: www
   Value: cname.vercel-dns.com
   ```

## 📊 Analytics Setup

### Google Analytics 4

1. Create GA4 property at [analytics.google.com](https://analytics.google.com)
2. Get your Measurement ID (G-XXXXXXXXXX)
3. Add to environment variables
4. Enhanced e-commerce tracking is pre-configured

### Vercel Analytics

1. Enable in Vercel Dashboard → Analytics
2. Real-time performance insights included
3. No additional configuration needed

## 🛠️ Development

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript checks
```

### Adding New Features

1. **New Pages:** Add to `app/` directory
2. **Components:** Add to `components/` directory
3. **API Routes:** Add to `app/api/` directory
4. **Styles:** Use Tailwind CSS classes

## 🔒 Security Features

- **Security Headers** - XSS protection, content type options
- **CORS Configuration** - Proper API access control
- **Input Validation** - Form validation with Zod
- **Environment Variables** - Secure configuration management

## 🎯 Performance Optimizations

- **Image Optimization** - WebP/AVIF formats, lazy loading
- **Code Splitting** - Dynamic imports for better performance
- **Caching** - Static generation and API caching
- **Bundle Analysis** - Optimized bundle sizes

## 📱 Mobile Optimization

- **Responsive Design** - Mobile-first approach
- **Touch Interactions** - Optimized for mobile devices
- **Performance** - Fast loading on mobile networks
- **PWA Ready** - Progressive Web App capabilities

## 🧪 Testing

```bash
# Run tests (when implemented)
npm test

# Run type checking
npm run type-check

# Run linting
npm run lint
```

## 📈 Monitoring

- **Vercel Analytics** - Real-time performance monitoring
- **Google Analytics** - User behavior tracking
- **Error Tracking** - Built-in error boundaries
- **Performance Metrics** - Core Web Vitals monitoring

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:

1. Check the [documentation](DEPLOYMENT.md)
2. Review [GitHub Issues](https://github.com/yourusername/luxe-intimates/issues)
3. Contact the development team

## 🎉 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- UI components from [Shadcn/ui](https://ui.shadcn.com/)
- Icons from [Lucide React](https://lucide.dev/)
- Deployed on [Vercel](https://vercel.com/)

---

**Made with ❤️ for premium e-commerce experiences** 