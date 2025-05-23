"use client";

import AuthModal from '@/components/auth/auth-modal';
import { useAuth } from '@/components/auth/auth-provider';
import { useCart } from '@/components/cart/cart-provider';
import { ThemeToggle } from '@/components/theme-toggle';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import SearchBar from '@/components/ui/search-bar';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useToast } from '@/hooks/use-toast';
import { useStore } from '@/lib/store';
import { Heart, LogOut, Menu, Package, Search, Settings, ShoppingCart, Sparkles, User, X } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState<'login' | 'register'>('login');
  const pathname = usePathname();
  const { itemCount } = useCart();
  const { user, isAuthenticated, logout, isLoading } = useAuth();
  const { toast } = useToast();
  const { getFavoriteCount } = useStore();

  // Handle scroll effect for header
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      toast({
        title: "Logged out",
        description: "You have been successfully logged out.",
      });
    } catch (error) {
      toast({
        title: "Logout failed",
        description: "There was a problem logging you out.",
        variant: "destructive",
      });
    }
  };

  const openAuthModal = (tab: 'login' | 'register') => {
    setAuthModalTab(tab);
    setIsAuthModalOpen(true);
  };
  
  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'Lingerie', href: '/products?category=lingerie' },
    { name: 'Intimates', href: '/products?category=toys' },
    { name: 'Accessories', href: '/products?category=accessories' },
    { name: 'About', href: '/about' },
  ];

  const favoriteCount = getFavoriteCount();

  return (
    <>
      <header 
        className={`sticky top-0 z-50 w-full transition-all duration-300 ${
          isScrolled 
            ? 'bg-background/95 backdrop-blur-md shadow-lg border-b border-pink-100 dark:border-pink-900/20' 
            : 'bg-transparent'
        }`}
      >
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center font-bold text-xl group">
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Sparkles className="w-6 h-6 text-pink-500 group-hover:text-pink-400 transition-colors" />
                  <div className="absolute -top-1 -right-1 w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
                </div>
                <span className="elegant-text text-2xl">
                  <span className="bg-gradient-to-r from-pink-500 via-purple-500 to-red-500 bg-clip-text text-transparent">
                    Luxe
                  </span>
                  <span className="ml-1 script-text text-purple-600 dark:text-purple-400">
                    Intimates
                  </span>
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`text-sm font-medium transition-all duration-200 hover:text-pink-500 relative group ${
                    pathname === item.href 
                      ? 'text-pink-500' 
                      : 'text-foreground/80 hover:text-foreground'
                  }`}
                >
                  {item.name}
                  <span className={`absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-pink-500 to-purple-500 transition-all duration-300 group-hover:w-full ${
                    pathname === item.href ? 'w-full' : ''
                  }`} />
                </Link>
              ))}
            </nav>

            {/* Actions */}
            <div className="flex items-center space-x-3">
              <button 
                onClick={() => setIsSearchOpen(true)} 
                className="hidden md:flex text-foreground/70 hover:text-pink-500 transition-colors p-2 rounded-full hover:bg-pink-50 dark:hover:bg-pink-950/20"
                aria-label="Search"
              >
                <Search size={20} />
              </button>
              
              <Link 
                href="/wishlist" 
                className="hidden md:flex text-foreground/70 hover:text-pink-500 transition-colors p-2 rounded-full hover:bg-pink-50 dark:hover:bg-pink-950/20 relative"
                aria-label="Wishlist"
              >
                <Heart size={20} />
                {favoriteCount > 0 && (
                  <span className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center rounded-full bg-gradient-to-r from-red-500 to-pink-600 text-white text-xs font-semibold animate-pulse-soft">
                    {favoriteCount}
                  </span>
                )}
              </Link>
              
              {/* User Authentication */}
              <div className="hidden md:flex">
                {isAuthenticated && user ? (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="flex items-center gap-2 hover:bg-purple-50 dark:hover:bg-purple-950/20">
                        {user.avatar ? (
                          <Image
                            src={user.avatar}
                            alt={user.name}
                            width={24}
                            height={24}
                            className="rounded-full"
                          />
                        ) : (
                          <User size={20} className="text-purple-500" />
                        )}
                        <span className="text-sm font-medium truncate max-w-20">{user.name.split(' ')[0]}</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                      <DropdownMenuLabel className="flex items-center gap-2">
                        {user.avatar && (
                          <Image
                            src={user.avatar}
                            alt={user.name}
                            width={32}
                            height={32}
                            className="rounded-full"
                          />
                        )}
                        <div>
                          <div className="font-medium">{user.name}</div>
                          <div className="text-xs text-muted-foreground">{user.email}</div>
                        </div>
                      </DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link href="/account" className="flex items-center gap-2">
                          <Settings size={16} />
                          My Account
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href="/orders" className="flex items-center gap-2">
                          <Package size={16} />
                          My Orders
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href="/wishlist" className="flex items-center gap-2">
                          <Heart size={16} />
                          Wishlist
                          {favoriteCount > 0 && (
                            <span className="ml-auto text-xs bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400 px-1.5 py-0.5 rounded-full">
                              {favoriteCount}
                            </span>
                          )}
                        </Link>
                      </DropdownMenuItem>
                      {user?.role === 'admin' && (
                        <>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem asChild>
                            <Link href="/admin" className="flex items-center gap-2 text-purple-600 dark:text-purple-400">
                              <Settings size={16} />
                              Admin Panel
                            </Link>
                          </DropdownMenuItem>
                        </>
                      )}
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={handleLogout} className="flex items-center gap-2 text-red-600 dark:text-red-400">
                        <LogOut size={16} />
                        Sign Out
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
                  <div className="flex items-center gap-2">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => openAuthModal('login')}
                      className="text-purple-600 hover:text-purple-700 hover:bg-purple-50 dark:hover:bg-purple-950/20"
                      disabled={isLoading}
                    >
                      Sign In
                    </Button>
                    <Button 
                      size="sm" 
                      onClick={() => openAuthModal('register')}
                      className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
                      disabled={isLoading}
                    >
                      Join Us
                    </Button>
                  </div>
                )}
              </div>
              
              <div className="hidden md:flex">
                <ThemeToggle />
              </div>
              
              <Link href="/cart" className="relative group" aria-label="Cart">
                <div className="p-2 rounded-full hover:bg-pink-50 dark:hover:bg-pink-950/20 transition-colors">
                  <ShoppingCart size={20} className="text-foreground/70 group-hover:text-pink-500 transition-colors" />
                  {itemCount > 0 && (
                    <span className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center rounded-full bg-gradient-to-r from-pink-500 to-purple-600 text-white text-xs font-semibold animate-pulse-soft">
                      {itemCount}
                    </span>
                  )}
                </div>
              </Link>
              
              {/* Mobile menu */}
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="md:hidden hover:bg-pink-50 dark:hover:bg-pink-950/20">
                    <Menu size={20} />
                    <span className="sr-only">Toggle menu</span>
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="bg-background/95 backdrop-blur-md border-l border-pink-100 dark:border-pink-900/20">
                  <div className="flex flex-col gap-6 py-6">
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-semibold elegant-text gradient-text">Menu</span>
                    </div>
                    
                    {/* Mobile Auth Section */}
                    {isAuthenticated && user ? (
                      <div className="flex items-center gap-3 p-3 bg-purple-50 dark:bg-purple-950/20 rounded-lg">
                        {user.avatar ? (
                          <Image
                            src={user.avatar}
                            alt={user.name}
                            width={32}
                            height={32}
                            className="rounded-full"
                          />
                        ) : (
                          <User size={24} className="text-purple-500" />
                        )}
                        <div>
                          <div className="font-medium text-sm">{user.name}</div>
                          <div className="text-xs text-muted-foreground">{user.email}</div>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col gap-2">
                        <Button 
                          variant="outline" 
                          onClick={() => openAuthModal('login')}
                          disabled={isLoading}
                          className="justify-start"
                        >
                          Sign In
                        </Button>
                        <Button 
                          onClick={() => openAuthModal('register')}
                          disabled={isLoading}
                          className="justify-start bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
                        >
                          Join Us
                        </Button>
                      </div>
                    )}
                    
                    <nav className="flex flex-col gap-4">
                      {navigation.map((item) => (
                        <Link
                          key={item.name}
                          href={item.href}
                          className={`text-base font-medium transition-colors hover:text-pink-500 ${
                            pathname === item.href ? 'text-pink-500' : 'text-foreground/80'
                          }`}
                        >
                          {item.name}
                        </Link>
                      ))}
                    </nav>
                    <div className="flex flex-col gap-4 pt-4 border-t border-pink-100 dark:border-pink-900/20">
                      <Link href="/search" className="flex items-center gap-3 text-base font-medium text-foreground/80 hover:text-pink-500 transition-colors">
                        <Search size={18} />
                        Search
                      </Link>
                      {isAuthenticated && (
                        <>
                          <Link href="/account" className="flex items-center gap-3 text-base font-medium text-foreground/80 hover:text-purple-500 transition-colors">
                            <Settings size={18} />
                            Account
                          </Link>
                          <Link href="/orders" className="flex items-center gap-3 text-base font-medium text-foreground/80 hover:text-purple-500 transition-colors">
                            <Package size={18} />
                            Orders
                          </Link>
                        </>
                      )}
                      <Link href="/wishlist" className="flex items-center gap-3 text-base font-medium text-foreground/80 hover:text-pink-500 transition-colors">
                        <Heart size={18} />
                        Wishlist {favoriteCount > 0 && `(${favoriteCount})`}
                      </Link>
                      <Link href="/cart" className="flex items-center gap-3 text-base font-medium text-foreground/80 hover:text-pink-500 transition-colors">
                        <ShoppingCart size={18} />
                        Cart {itemCount > 0 && `(${itemCount})`}
                      </Link>
                      <div className="flex items-center gap-3 text-base font-medium text-foreground/80">
                        <ThemeToggle />
                        <span>Theme</span>
                      </div>
                      {isAuthenticated && (
                        <Button 
                          variant="ghost" 
                          onClick={handleLogout}
                          className="justify-start text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/20"
                        >
                          <LogOut size={18} className="mr-3" />
                          Sign Out
                        </Button>
                      )}
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
        
        {/* Search Overlay */}
        {isSearchOpen && (
          <div className="fixed inset-0 bg-background/95 backdrop-blur-md z-50 flex items-start justify-center pt-20">
            <div className="container mx-auto px-4">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-xl font-semibold elegant-text gradient-text">Search Products</h2>
                <Button variant="ghost" size="icon" onClick={() => setIsSearchOpen(false)} className="hover:bg-pink-50 dark:hover:bg-pink-950/20">
                  <X size={20} />
                </Button>
              </div>
              <SearchBar onClose={() => setIsSearchOpen(false)} />
            </div>
          </div>
        )}
      </header>

      {/* Authentication Modal */}
      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
        defaultTab={authModalTab}
      />
    </>
  );
};

export default Header;