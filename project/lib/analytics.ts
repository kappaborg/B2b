import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';

// Extend Window interface for Google Analytics
declare global {
  interface Window {
    dataLayer: any[];
    gtag: (...args: any[]) => void;
  }
}

// Google Analytics utility functions
export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

// Initialize Google Analytics
export const initGA = () => {
  if (typeof window !== 'undefined' && GA_MEASUREMENT_ID) {
    // Load Google Analytics script
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
    document.head.appendChild(script);

    // Initialize gtag
    window.dataLayer = window.dataLayer || [];
    const gtag = (...args: any[]) => {
      window.dataLayer.push(args);
    };
    gtag('js', new Date());
    gtag('config', GA_MEASUREMENT_ID, {
      page_title: document.title,
      page_location: window.location.href,
    });

    // Make gtag available globally
    window.gtag = gtag;
  }
};

// Track page views
export const trackPageView = (url: string, title?: string) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('config', GA_MEASUREMENT_ID, {
      page_title: title || document.title,
      page_location: url,
    });
  }
};

// Track events
export const trackEvent = (action: string, category: string, label?: string, value?: number) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  }
};

// E-commerce tracking
export const trackPurchase = (transactionId: string, value: number, currency: string = 'USD', items: any[]) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'purchase', {
      transaction_id: transactionId,
      value: value,
      currency: currency,
      items: items.map(item => ({
        item_id: item.id,
        item_name: item.name,
        category: item.category,
        quantity: item.quantity,
        price: item.price,
      })),
    });
  }
};

// Track product views
export const trackProductView = (itemId: string, itemName: string, category: string, value: number) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'view_item', {
      currency: 'USD',
      value: value,
      items: [{
        item_id: itemId,
        item_name: itemName,
        category: category,
        price: value,
      }],
    });
  }
};

// Track add to cart
export const trackAddToCart = (itemId: string, itemName: string, category: string, value: number, quantity: number) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'add_to_cart', {
      currency: 'USD',
      value: value * quantity,
      items: [{
        item_id: itemId,
        item_name: itemName,
        category: category,
        quantity: quantity,
        price: value,
      }],
    });
  }
};

// Track checkout process
export const trackBeginCheckout = (value: number, items: any[]) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'begin_checkout', {
      currency: 'USD',
      value: value,
      items: items.map(item => ({
        item_id: item.id,
        item_name: item.name,
        category: item.category,
        quantity: item.quantity,
        price: item.price,
      })),
    });
  }
};

// Track user sign up
export const trackSignUp = (method: string) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'sign_up', {
      method: method,
    });
  }
};

// Track user login
export const trackLogin = (method: string) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'login', {
      method: method,
    });
  }
};

// Track search
export const trackSearch = (searchTerm: string) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'search', {
      search_term: searchTerm,
    });
  }
};

// Analytics Components
export const VercelAnalytics = Analytics;
export const VercelSpeedInsights = SpeedInsights;

// Custom hook for analytics
export const useAnalytics = () => {
  return {
    trackPageView,
    trackEvent,
    trackPurchase,
    trackProductView,
    trackAddToCart,
    trackBeginCheckout,
    trackSignUp,
    trackLogin,
    trackSearch,
  };
};

// Analytics configuration
export const analyticsConfig = {
  enabled: process.env.NEXT_PUBLIC_ENABLE_ANALYTICS === 'true',
  debug: process.env.NODE_ENV === 'development',
  gaId: GA_MEASUREMENT_ID,
  vercelAnalytics: process.env.NEXT_PUBLIC_VERCEL_ANALYTICS_ID,
}; 