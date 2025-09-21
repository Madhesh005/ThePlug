import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Product } from "@shared/schema";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import ProductCard from "@/components/product-card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search } from "lucide-react";

interface ProductsResponse {
  products: Product[];
}

export default function ProductsPage() {
  const [location] = useLocation();
  const searchParams = new URLSearchParams(location.split('?')[1] || '');
  const categoryFilter = searchParams.get('category') || '';

  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("popular");
  const [stockFilter, setStockFilter] = useState("in-stock");

  const { data: productsData, isLoading, error, isError } = useQuery<ProductsResponse>({
    queryKey: ["/api/products", categoryFilter],
    queryFn: async () => {
      console.log('Fetching products from API...');
      const API_BASE_URL = import.meta.env.VITE_API_URL || "";

      const response = await fetch(
        `${API_BASE_URL}/api/products${categoryFilter ? `?category=${categoryFilter}` : ''}`
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Failed to fetch products:', response.status, errorText);
        throw new Error(`Failed to fetch products: ${response.status}`);
      }

      const data = await response.json();
      console.log('Received products data:', data);

      // Validate the response structure
      if (!data || !Array.isArray(data.products)) {
        console.error('Invalid products response structure:', data);
        throw new Error('Invalid response structure');
      }

      return data;
    },
    retry: 3,
    retryDelay: 1000,
  });

  const products = productsData?.products || [];

  // Debug logging
  console.log('Products Page State:', {
    isLoading,
    isError,
    error: error?.message,
    productsCount: products.length,
    categoryFilter,
    searchTerm,
    sortBy,
    stockFilter
  });

  // Filter and sort products
  const filteredProducts = products.filter(product => {
    const matchesSearch = (product.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (product.category || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (product.description || '').toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStock = stockFilter === "all" || (product.inStock != null && product.inStock > 0);
    return matchesSearch && matchesStock;
  })
    .sort((a, b) => {
      switch (sortBy) {
        case "price-low":
          const priceA = a.price ? parseFloat(String(a.price)) : 0;
          const priceB = b.price ? parseFloat(String(b.price)) : 0;
          return priceA - priceB;
        case "price-high":
          const priceA2 = a.price ? parseFloat(String(a.price)) : 0;
          const priceB2 = b.price ? parseFloat(String(b.price)) : 0;
          return priceB2 - priceA2;
        case "rating":
          const aRating = a.rating ? parseFloat(String(a.rating)) : 0;
          const bRating = b.rating ? parseFloat(String(b.rating)) : 0;
          return bRating - aRating;
        case "name":
          return (a.name || '').localeCompare(b.name || '');
        default:
          return 0;
      }
    });

  const pageTitle = categoryFilter
    ? `${categoryFilter.charAt(0).toUpperCase() + categoryFilter.slice(1)} Products`
    : 'All Products';

  return (
    <div>
      <Navbar />

      <main>
        <section className="py-8 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8">
              <h2 className="text-2xl font-bold mb-4 lg:mb-0">
                {pageTitle}
              </h2>
              <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
                {/* Search Bar */}
                <div className="relative lg:hidden">
                  <Input
                    type="text"
                    placeholder="Search products, brands, SKU..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                    data-testid="input-search-mobile"
                  />
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                </div>

                {/* Desktop Search */}
                <div className="relative hidden lg:block w-80">
                  <Input
                    type="text"
                    placeholder="Search products, brands, SKU..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                    data-testid="input-search-desktop"
                  />
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                </div>

                {/* Filters */}
                <div className="flex gap-2">
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-48" data-testid="select-sort">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="popular">Sort Popular</SelectItem>
                      <SelectItem value="name">Name A-Z</SelectItem>
                      <SelectItem value="price-low">Price: Low to High</SelectItem>
                      <SelectItem value="price-high">Price: High to Low</SelectItem>
                      <SelectItem value="rating">Rating</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={stockFilter} onValueChange={setStockFilter}>
                    <SelectTrigger className="w-32" data-testid="select-stock">
                      <SelectValue placeholder="Stock" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="in-stock">In Stock</SelectItem>
                      <SelectItem value="all">All Items</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <div className="text-sm text-muted-foreground mb-6" data-testid="text-product-count">
              {isLoading ? 'Loading...' : `Showing ${filteredProducts.length} products`}
            </div>

            {/* Error State */}
            {isError && (
              <div className="text-center py-12">
                <p className="text-red-500 text-lg mb-2">Failed to load products</p>
                <p className="text-muted-foreground mb-4">{error?.message || 'Unknown error occurred'}</p>
                <button
                  onClick={() => window.location.reload()}
                  className="px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90"
                >
                  Retry
                </button>
              </div>
            )}

            {/* Loading State */}
            {isLoading && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="bg-card rounded-xl border border-border h-80 animate-pulse">
                    <div className="h-48 bg-muted rounded-t-xl mb-4"></div>
                    <div className="p-4 space-y-2">
                      <div className="h-4 bg-muted rounded w-3/4"></div>
                      <div className="h-4 bg-muted rounded w-1/2"></div>
                      <div className="h-8 bg-muted rounded w-full"></div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* No Products State */}
            {!isLoading && !isError && filteredProducts.length === 0 && products.length === 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground text-lg mb-4">No products available.</p>
                <p className="text-sm text-muted-foreground">Please try again later or contact support.</p>
              </div>
            )}

            {/* No Search Results */}
            {!isLoading && !isError && filteredProducts.length === 0 && products.length > 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground text-lg mb-2">No products found matching your criteria.</p>
                <p className="text-sm text-muted-foreground mb-4">Try adjusting your search term or filters.</p>
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setStockFilter('in-stock');
                    setSortBy('popular');
                  }}
                  className="px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90"
                >
                  Clear Filters
                </button>
              </div>
            )}

            {/* Product Grid */}
            {!isLoading && !isError && filteredProducts.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}