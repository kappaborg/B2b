"use client";

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { getSearchSuggestions } from '@/lib/search-utils';
import type { Product } from '@/types';
import { Search, TrendingUp, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import useSWR from 'swr';

interface SearchBarProps {
  onClose?: () => void;
}

export default function SearchBar({ onClose }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedSuggestion, setSelectedSuggestion] = useState(-1);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  // Fetch products for suggestions
  const { data: products } = useSWR<Product[]>('/api/products', (url: string) => 
    fetch(url).then(res => res.json())
  );

  // Popular search terms
  const popularSearches = [
    'Seductive Lingerie',
    'Intimate Toys', 
    'Massage Oil',
    'Luxury Vibrator',
    'Lace Bodysuit',
    'Silk Chemise'
  ];

  // Update suggestions when query changes
  useEffect(() => {
    if (query.length > 1 && products) {
      const newSuggestions = getSearchSuggestions(products, query);
      setSuggestions(newSuggestions);
      setShowSuggestions(true);
      setSelectedSuggestion(-1);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [query, products]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!showSuggestions) return;

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setSelectedSuggestion(prev => 
            prev < suggestions.length - 1 ? prev + 1 : prev
          );
          break;
        case 'ArrowUp':
          e.preventDefault();
          setSelectedSuggestion(prev => prev > 0 ? prev - 1 : -1);
          break;
        case 'Enter':
          e.preventDefault();
          if (selectedSuggestion >= 0) {
            handleSuggestionClick(suggestions[selectedSuggestion]);
          } else {
            handleSearch(e as any);
          }
          break;
        case 'Escape':
          setShowSuggestions(false);
          setSelectedSuggestion(-1);
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [showSuggestions, suggestions, selectedSuggestion]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/products?search=${encodeURIComponent(query.trim())}`);
      setShowSuggestions(false);
      if (onClose) {
        onClose();
      }
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion);
    router.push(`/products?search=${encodeURIComponent(suggestion)}`);
    setShowSuggestions(false);
    if (onClose) {
      onClose();
    }
  };

  const handlePopularSearchClick = (term: string) => {
    setQuery(term);
    router.push(`/products?search=${encodeURIComponent(term)}`);
    if (onClose) {
      onClose();
    }
  };

  const clearSearch = () => {
    setQuery('');
    setShowSuggestions(false);
    inputRef.current?.focus();
  };

  return (
    <div className="w-full relative">
      <form onSubmit={handleSearch} className="w-full">
        <div className="relative">
          <Input
            ref={inputRef}
            type="text"
            placeholder="Search for lingerie, toys, accessories..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => query.length > 1 && setShowSuggestions(true)}
            className="w-full py-6 pl-12 pr-20 text-lg border-2 focus:border-pink-300 dark:focus:border-pink-600"
            autoFocus
          />
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={20} />
          
          {query && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={clearSearch}
              className="absolute right-14 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <X size={16} />
            </Button>
          )}
          
          <Button 
            type="submit" 
            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
          >
            Search
          </Button>
        </div>
      </form>

      {/* Search Suggestions Dropdown */}
      {showSuggestions && suggestions.length > 0 && (
        <div 
          ref={suggestionsRef}
          className="absolute top-full left-0 right-0 bg-background border border-border rounded-lg shadow-lg z-50 mt-1 max-h-60 overflow-y-auto"
        >
          {suggestions.map((suggestion, index) => (
            <button
              key={suggestion}
              type="button"
              onClick={() => handleSuggestionClick(suggestion)}
              className={`w-full text-left px-4 py-3 hover:bg-muted transition-colors flex items-center gap-3 ${
                index === selectedSuggestion ? 'bg-muted' : ''
              }`}
            >
              <Search size={16} className="text-muted-foreground" />
              <span className="truncate">{suggestion}</span>
            </button>
          ))}
        </div>
      )}

      {/* Popular Searches */}
      {!showSuggestions && (
        <div className="mt-8">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp size={18} className="text-pink-500" />
            <h3 className="text-sm font-medium">Popular Searches</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {popularSearches.map((term) => (
              <button
                key={term}
                type="button"
                className="px-4 py-2 bg-gradient-to-r from-pink-50 to-purple-50 dark:from-pink-950/20 dark:to-purple-950/20 text-foreground rounded-full text-sm hover:from-pink-100 hover:to-purple-100 dark:hover:from-pink-950/40 dark:hover:to-purple-950/40 transition-all duration-200 border border-pink-200 dark:border-pink-800"
                onClick={() => handlePopularSearchClick(term)}
              >
                {term}
              </button>
            ))}
          </div>
          
          {/* Search Tips */}
          <div className="mt-6 p-4 bg-muted/50 rounded-lg">
            <h4 className="text-sm font-medium mb-2">Search Tips:</h4>
            <ul className="text-xs text-muted-foreground space-y-1">
              <li>• Try searching by product type: "lingerie", "toys", "accessories"</li>
              <li>• Use specific terms: "lace", "silk", "massage oil"</li>
              <li>• Browse by category or use filters for better results</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}