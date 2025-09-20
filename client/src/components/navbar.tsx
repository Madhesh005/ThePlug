import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { Cart, Product } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Microchip, Search, ShoppingCart, Menu, User, Phone, Mail } from "lucide-react";
import { Link, useLocation } from "wouter";

type CartItem = Cart & { product: Product };

export default function Navbar() {
  const [location, navigate] = useLocation();
  const { user, logoutMutation } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const { data: cartItems = [] } = useQuery<CartItem[]>({
    queryKey: ["/api/cart"],
    enabled: !!user,
  });

  const cartItemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  const handleLogout = () => {
    logoutMutation.mutate();
    setIsMobileMenuOpen(false);
  };

  const navLinks = [
    { href: "/", label: "Home", active: location === "/" },
    { href: "/products", label: "Products", active: location.startsWith("/products") },
    { href: "/contact", label: "Contact Us", active: location === "/contact" },
  ];

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur border-b border-border">
      <div className="container mx-auto px-4">
        {/* Top Bar - Desktop Only */}
        <div className="hidden md:flex justify-between items-center py-2 text-sm text-muted-foreground border-b border-border">
          <div className="flex items-center space-x-6">
            <span className="flex items-center">
              <Phone className="mr-2 h-4 w-4" />
              +1 (800) 555-0130
            </span>
            <span className="flex items-center">
              <Mail className="mr-2 h-4 w-4" />
              support@techmart.com
            </span>
          </div>
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <span>Welcome, {user.firstName}!</span>
                <Button 
                  variant="link" 
                  className="text-muted-foreground hover:text-primary p-0 h-auto"
                  onClick={handleLogout}
                  disabled={logoutMutation.isPending}
                  data-testid="button-logout"
                >
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link href="/auth">
                  <Button variant="link" className="text-muted-foreground hover:text-primary p-0 h-auto" data-testid="link-login">
                    Login
                  </Button>
                </Link>
                <Link href="/auth">
                  <Button variant="link" className="text-muted-foreground hover:text-primary p-0 h-auto" data-testid="link-signup">
                    Sign up
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
        
        {/* Main Navigation */}
        <div className="flex items-center justify-between py-4">
          <div className="flex items-center space-x-8">
            {/* Logo */}
            <Link href="/">
              <div className="flex items-center cursor-pointer" data-testid="logo">
                <Microchip className="text-2xl text-primary mr-3 h-8 w-8" />
                <span className="text-xl font-bold">TechMart</span>
              </div>
            </Link>
            
            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-6">
              {navLinks.map((link) => (
                <Link key={link.href} href={link.href}>
                  <Button 
                    variant="link" 
                    className={`hover:text-primary transition-colors p-0 h-auto ${
                      link.active ? "text-primary font-medium" : ""
                    }`}
                    data-testid={`nav-${link.label.toLowerCase().replace(" ", "-")}`}
                  >
                    {link.label}
                  </Button>
                </Link>
              ))}
            </nav>
          </div>
          
          {/* Search Bar - Desktop */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <form onSubmit={handleSearch} className="relative w-full">
              <Input
                type="text"
                placeholder="Search electronics: keyboards, monitors, audio..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
                data-testid="input-search"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            </form>
          </div>
          
          {/* Right Side Actions */}
          <div className="flex items-center space-x-4">
            {/* Account Button (Desktop) */}
            {user && (
              <Button variant="secondary" className="hidden md:flex items-center space-x-2" data-testid="button-account">
                <User className="h-4 w-4" />
                <span>Account</span>
              </Button>
            )}
            
            {/* Cart */}
            <Link href="/cart">
              <Button variant="ghost" className="relative p-2" data-testid="button-cart">
                <ShoppingCart className="h-6 w-6 text-primary" />
                {cartItemCount > 0 && (
                  <span 
                    className="absolute -top-1 -right-1 cart-badge text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold"
                    data-testid="text-cart-count"
                  >
                    {cartItemCount}
                  </span>
                )}
              </Button>
            </Link>
            
            {/* Mobile Menu Toggle */}
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="lg:hidden" data-testid="button-mobile-menu">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-64">
                <div className="flex items-center mb-6">
                  <Microchip className="text-2xl text-primary mr-3 h-8 w-8" />
                  <span className="text-xl font-bold">TechMart</span>
                </div>
                
                {/* Mobile Search */}
                <form onSubmit={handleSearch} className="relative w-full mb-6">
                  <Input
                    type="text"
                    placeholder="Search products..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                    data-testid="input-search-mobile"
                  />
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                </form>
                
                <nav className="space-y-4">
                  {navLinks.map((link) => (
                    <Link key={link.href} href={link.href}>
                      <Button 
                        variant="ghost" 
                        className={`w-full justify-start ${link.active ? "bg-accent" : ""}`}
                        onClick={() => setIsMobileMenuOpen(false)}
                        data-testid={`mobile-nav-${link.label.toLowerCase().replace(" ", "-")}`}
                      >
                        {link.label}
                      </Button>
                    </Link>
                  ))}
                  
                  <hr className="border-border" />
                  
                  {user ? (
                    <>
                      <div className="px-4 py-2 text-sm text-muted-foreground">
                        Welcome, {user.firstName}!
                      </div>
                      <Button 
                        variant="ghost" 
                        className="w-full justify-start"
                        onClick={handleLogout}
                        disabled={logoutMutation.isPending}
                        data-testid="button-mobile-logout"
                      >
                        Logout
                      </Button>
                    </>
                  ) : (
                    <>
                      <Link href="/auth">
                        <Button 
                          variant="ghost" 
                          className="w-full justify-start"
                          onClick={() => setIsMobileMenuOpen(false)}
                          data-testid="button-mobile-login"
                        >
                          Login
                        </Button>
                      </Link>
                      <Link href="/auth">
                        <Button 
                          variant="ghost" 
                          className="w-full justify-start"
                          onClick={() => setIsMobileMenuOpen(false)}
                          data-testid="button-mobile-signup"
                        >
                          Sign Up
                        </Button>
                      </Link>
                    </>
                  )}
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
