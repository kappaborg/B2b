"use client";

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

export default function Newsletter() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate subscription
    setTimeout(() => {
      toast({
        title: "Successfully subscribed!",
        description: "Thank you for subscribing to our newsletter.",
      });
      setEmail('');
      setIsSubmitting(false);
    }, 1000);
  };

  return (
    <section className="container mx-auto px-4 py-16">
      <div className="bg-card rounded-lg shadow-md p-8 md:p-12">
        <div className="flex flex-col md:flex-row gap-8 md:gap-12 items-center">
          <div className="flex-1">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">Subscribe to Our Newsletter</h2>
            <p className="text-muted-foreground mb-6">
              Stay updated with our latest products, exclusive offers, and intimate tips.
            </p>
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
              <Input 
                type="email" 
                placeholder="Enter your email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="flex-1"
              />
              <Button 
                type="submit" 
                className="bg-purple-600 hover:bg-purple-700"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Subscribing...' : 'Subscribe'}
              </Button>
            </form>
            <p className="text-sm text-muted-foreground mt-4">
              By subscribing, you agree to our privacy policy and consent to receive updates from our company.
            </p>
          </div>
          <div className="flex-1 hidden md:block">
            <img 
              src="https://images.pexels.com/photos/6311381/pexels-photo-6311381.jpeg?auto=compress&cs=tinysrgb&w=1600" 
              alt="Newsletter" 
              className="rounded-lg object-cover h-60 w-full" 
            />
          </div>
        </div>
      </div>
    </section>
  );
}