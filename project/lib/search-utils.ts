import type { Product } from '@/types';

// Fuzzy search function that calculates relevance score
export function calculateSearchRelevance(product: Product, searchTerm: string): number {
  if (!searchTerm.trim()) return 0;
  
  const term = searchTerm.toLowerCase();
  const words = term.split(' ').filter(word => word.length > 0);
  
  let score = 0;
  
  // Exact name match gets highest score
  if (product.name.toLowerCase() === term) {
    score += 100;
  }
  
  // Name contains full search term
  if (product.name.toLowerCase().includes(term)) {
    score += 50;
  }
  
  // Name starts with search term
  if (product.name.toLowerCase().startsWith(term)) {
    score += 40;
  }
  
  // Category exact match
  if (product.category.toLowerCase() === term) {
    score += 30;
  }
  
  // Category contains term
  if (product.category.toLowerCase().includes(term)) {
    score += 20;
  }
  
  // Word-by-word matching in name
  words.forEach(word => {
    if (product.name.toLowerCase().includes(word)) {
      score += 10;
    }
    if (product.category.toLowerCase().includes(word)) {
      score += 5;
    }
    // Tags matching
    if (product.tags && Array.isArray(product.tags)) {
      product.tags.forEach(tag => {
        if (typeof tag === 'string' && tag.toLowerCase().includes(word)) {
          score += 8;
        }
      });
    }
    // Description matching (lower priority)
    if (product.description?.toLowerCase().includes(word)) {
      score += 3;
    }
  });
  
  return score;
}

// Advanced search function with fuzzy matching
export function searchProducts(products: Product[], searchTerm: string): Product[] {
  if (!searchTerm.trim()) return products;
  
  const productsWithScore = products.map(product => ({
    product,
    score: calculateSearchRelevance(product, searchTerm)
  }));
  
  // Filter products with score > 0 and sort by relevance
  return productsWithScore
    .filter(item => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .map(item => item.product);
}

// Function to highlight matching text
export function highlightText(text: string, searchTerm: string): string {
  if (!searchTerm.trim()) return text;
  
  const words = searchTerm.toLowerCase().split(' ').filter(word => word.length > 0);
  let highlightedText = text;
  
  words.forEach(word => {
    const regex = new RegExp(`(${escapeRegExp(word)})`, 'gi');
    highlightedText = highlightedText.replace(regex, '<mark class="bg-yellow-200 dark:bg-yellow-800 px-1 rounded">$1</mark>');
  });
  
  return highlightedText;
}

// Escape special regex characters
function escapeRegExp(string: string): string {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// Get search suggestions based on current input
export function getSearchSuggestions(products: Product[], query: string): string[] {
  if (!query.trim()) return [];
  
  const suggestions = new Set<string>();
  const term = query.toLowerCase();
  
  products.forEach(product => {
    // Add product names that start with or contain the query
    if (product.name.toLowerCase().includes(term)) {
      suggestions.add(product.name);
    }
    
    // Add category suggestions
    if (product.category.toLowerCase().includes(term)) {
      suggestions.add(product.category);
    }
    
    // Add tag suggestions
    if (product.tags && Array.isArray(product.tags)) {
      product.tags.forEach(tag => {
        if (typeof tag === 'string' && tag.toLowerCase().includes(term)) {
          suggestions.add(tag);
        }
      });
    }
  });
  
  return Array.from(suggestions).slice(0, 5); // Limit to 5 suggestions
}

// Extract keywords from search term for better matching
export function extractKeywords(searchTerm: string): string[] {
  return searchTerm
    .toLowerCase()
    .split(/[^\w]+/)
    .filter(word => word.length > 2)
    .slice(0, 5); // Limit to 5 keywords
}

// Check if product matches any of the keywords
export function matchesKeywords(product: Product, keywords: string[]): boolean {
  const searchText = [
    product.name,
    product.category,
    product.description || '',
    ...(Array.isArray(product.tags) ? product.tags : [])
  ].join(' ').toLowerCase();
  
  return keywords.some(keyword => searchText.includes(keyword));
} 