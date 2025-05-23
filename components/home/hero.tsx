"use client";

import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { Heart, Sparkles } from 'lucide-react';
import Link from 'next/link';

export default function Hero() {
  return (
    <section className="relative overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('https://images.pexels.com/photos/914668/pexels-photo-914668.jpeg?auto=compress&cs=tinysrgb&w=1600')",
        }}
      />
      
      {/* Overlay with gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-pink-900/85 via-purple-900/80 to-red-900/75 dark:from-pink-950/90 dark:via-purple-950/85 dark:to-red-950/80" />
      
      {/* Decorative elements */}
      <div className="absolute top-10 left-10 w-20 h-20 bg-pink-300/20 rounded-full blur-xl animate-pulse-soft" />
      <div className="absolute bottom-20 right-20 w-32 h-32 bg-purple-300/20 rounded-full blur-xl animate-pulse-soft" style={{ animationDelay: '1s' }} />
      <div className="absolute top-1/3 right-10 w-16 h-16 bg-red-300/20 rounded-full blur-xl animate-pulse-soft" style={{ animationDelay: '2s' }} />
      
      {/* Content */}
      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col items-start justify-center min-h-[85vh] py-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="max-w-2xl"
          >
            {/* Premium badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-effect text-white/90 text-sm font-medium mb-6"
            >
              <Sparkles className="w-4 h-4" />
              Premium Intimates Collection
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="text-4xl md:text-5xl lg:text-7xl font-bold text-white mb-6 elegant-text leading-tight"
            >
              <span className="gradient-text text-shadow">Seduce</span>
              <br />
              <span className="text-white text-shadow">Your Senses</span>
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-lg md:text-xl text-white/95 mb-8 leading-relaxed max-w-lg font-light"
            >
              Discover our exclusive collection of <span className="font-semibold text-pink-200">luxury lingerie</span> and 
              <span className="font-semibold text-purple-200"> intimate accessories</span> designed to awaken your confidence and passion.
            </motion.p>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Button 
                asChild 
                size="lg" 
                className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-semibold px-8 py-4 rounded-full shadow-2xl hover-lift border-0 text-base"
              >
                <Link href="/products" className="flex items-center gap-2">
                  <Heart className="w-5 h-5" />
                  Explore Collection
                </Link>
              </Button>
              
              <Button 
                asChild 
                variant="outline" 
                size="lg" 
                className="border-2 border-white/30 text-white hover:bg-white/10 backdrop-blur-sm font-semibold px-8 py-4 rounded-full hover-lift text-base bg-white/5"
              >
                <Link href="/categories">Browse Categories</Link>
              </Button>
            </motion.div>
            
            {/* Trust indicators */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.7 }}
              className="flex items-center gap-6 mt-12 text-white/80 text-sm"
            >
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                Discreet Shipping
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                Premium Quality
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                Private & Secure
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
      
      {/* Bottom fade effect */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
}