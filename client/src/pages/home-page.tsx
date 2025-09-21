import { useQuery } from "@tanstack/react-query";
import { Product } from "@shared/schema";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import ProductCard from "@/components/product-card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

interface ProductsResponse {
  products: Product[];
}

export default function HomePage() {
  const { data: productsData, isLoading } = useQuery<ProductsResponse>({
    queryKey: ["/api/products"],
    queryFn: async () => {
      const response = await fetch("/api/products");
      if (!response.ok) {
        throw new Error("Failed to fetch products");
      }
      return response.json();
    },
  });

  const products = productsData?.products || [];
  const featuredProducts = products.slice(0, 4);

  const categories = [
    {
      name: "Monitors",
      slug: "monitors",
      description: "4K & Gaming Displays",
      image: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=120",
    },
    {
      name: "Keyboards",
      slug: "keyboards",
      description: "Mechanical & Wireless",
      image: "https://images.unsplash.com/photo-1541140532154-b024d705b90a?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=120",
    },
    {
      name: "Mice",
      slug: "mice",
      description: "Gaming & Precision",
      image: "https://images.unsplash.com/photo-1527814050087-3793815479db?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=120",
    },
    {
      name: "Audio",
      slug: "audio",
      description: "Headphones & Speakers",
      image: "https://images.unsplash.com/photo-1484704849700-f032a568e944?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=120",
    },
    {
      name: "Accessories",
      slug: "accessories",
      description: "Cables & More",
      image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&h=120",
    },
  ];

  return (
    <div>
      <Navbar />

      <main>
        {/* Hero Section */}
        <section className="py-8">
          <div className="container mx-auto px-4 mb-12">
            <div className="hero-gradient rounded-2xl p-8 md:p-12 text-white relative overflow-hidden">
              <div className="relative z-10">
                <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
                  <div className="lg:w-1/2 mb-8 lg:mb-0">
                    <div className="inline-flex items-center bg-white/20 rounded-full px-4 py-2 mb-4">
                      <span className="text-sm font-medium">⚡ Deal of the Day</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">
                      Power your setup with pro-level gear
                    </h1>
                    <p className="text-lg mb-6 text-white/90">
                      4K monitors, hot-swap keyboards, low-latency mice, and studio-grade audio. Built for creators and competitive gamers.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4">
                      <Link href="/products">
                        <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100" data-testid="button-shop-deals">
                          Shop Top Deals
                        </Button>
                      </Link>
                      <Link href="/products">
                        <Button variant="outline" size="lg" className="border-white/30 hover:bg-white/10 text-white" data-testid="button-browse-categories">
                          Browse Categories
                        </Button>
                      </Link>
                    </div>
                  </div>

                  {/* Single Featured Product Showcase */}
                  <div className="lg:w-1/2 flex justify-center">
                    <div className="bg-white/10 backdrop-blur rounded-2xl p-8 w-full max-w-lg h-80 relative overflow-hidden group hover:bg-white/15 transition-all duration-500 border border-white/20">
                      <img
                        src="https://images.unsplash.com/photo-1593640408182-31c70c8268f5?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&h=300"
                        alt="Premium Gaming Setup"
                        className="absolute inset-0 w-full h-full object-cover rounded-xl opacity-75 group-hover:opacity-85 transition-opacity duration-500 group-hover:scale-105"
                      />
                      
                      {/* Overlay Content */}
                      <div className="relative z-10 h-full flex flex-col justify-between">
                        {/* Top Section - Badges */}
                        <div className="flex justify-between items-start">
                          <div className="flex gap-2">
                            <span className="text-xs bg-green-500 px-3 py-1.5 rounded-full font-semibold">Limited Time</span>
                            <span className="text-xs bg-red-500 px-3 py-1.5 rounded-full font-semibold">Hot Deal</span>
                          </div>
                          <span className="text-lg font-bold bg-black/60 backdrop-blur-sm px-3 py-1.5 rounded-full">40% OFF</span>
                        </div>

                        {/* Bottom Section - Product Info */}
                        <div className="bg-black/80 backdrop-blur-md rounded-xl p-6 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                          <div className="mb-4">
                            <h3 className="font-bold text-xl mb-2">Ultimate Gaming Arsenal</h3>
                            <p className="text-sm text-white/90 leading-relaxed">
                              Complete battlestation with 4K monitor, mechanical keyboard, precision mouse, and studio headphones
                            </p>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <div className="flex flex-col">
                              <span className="text-sm text-white/70 line-through">₹1,299</span>
                              <span className="text-2xl font-bold text-white">₹779</span>
                            </div>
                            <Link href="/products">
                              <Button size="lg" className="bg-white text-black hover:bg-gray-100 font-semibold px-6">
                                Shop Bundle
                              </Button>
                            </Link>
                          </div>

                          {/* Feature highlights */}
                          <div className="flex gap-4 mt-4 text-xs">
                            <span className="bg-white/20 px-2 py-1 rounded">✓ 4K Display</span>
                            <span className="bg-white/20 px-2 py-1 rounded">✓ Mechanical Keys</span>
                            <span className="bg-white/20 px-2 py-1 rounded">✓ Pro Audio</span>
                          </div>
                        </div>
                      </div>

                      {/* Floating elements for visual interest */}
                      <div className="absolute top-4 right-4 w-2 h-2 bg-white/40 rounded-full animate-pulse"></div>
                      <div className="absolute top-8 right-8 w-1 h-1 bg-white/60 rounded-full animate-pulse delay-500"></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Background decorative elements */}
              <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full blur-2xl"></div>
              <div className="absolute top-1/2 left-1/2 w-32 h-32 bg-white/3 rounded-full blur-xl"></div>
            </div>
          </div>

          {/* Stats Section */}
          <div className="container mx-auto px-4 mb-12">
            <div className="bg-card rounded-xl border border-border p-6 shadow-sm">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                <div className="group hover:scale-105 transition-transform duration-200">
                  <div className="text-2xl md:text-3xl font-bold text-primary mb-2 group-hover:text-blue-600 transition-colors">500K+</div>
                  <div className="text-sm text-muted-foreground">Happy Customers</div>
                </div>
                <div className="group hover:scale-105 transition-transform duration-200">
                  <div className="text-2xl md:text-3xl font-bold text-primary mb-2 group-hover:text-blue-600 transition-colors">10K+</div>
                  <div className="text-sm text-muted-foreground">Products</div>
                </div>
                <div className="group hover:scale-105 transition-transform duration-200">
                  <div className="text-2xl md:text-3xl font-bold text-primary mb-2 group-hover:text-blue-600 transition-colors">99.9%</div>
                  <div className="text-sm text-muted-foreground">Uptime</div>
                </div>
                <div className="group hover:scale-105 transition-transform duration-200">
                  <div className="text-2xl md:text-3xl font-bold text-primary mb-2 group-hover:text-blue-600 transition-colors">24/7</div>
                  <div className="text-sm text-muted-foreground">Support</div>
                </div>
              </div>
            </div>
          </div>

          {/* Categories Section */}
          <div className="container mx-auto px-4 mb-12">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold">Shop by Category</h2>
              <Link href="/products">
                <Button variant="link" className="text-primary hover:underline" data-testid="link-view-all-categories">
                  View All
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
              {categories.map((category) => (
                <Link key={category.slug} href={`/products?category=₹{category.slug}`}>
                  <div className="group cursor-pointer" data-testid={`category-₹{category.slug}`}>
                    <div className="bg-card hover:bg-card/80 rounded-xl p-6 text-center border border-border transition-all duration-200 hover:scale-105 hover:shadow-md">
                      <img
                        src={category.image}
                        alt={category.name}
                        className="w-16 h-16 mx-auto mb-4 rounded-lg object-cover group-hover:scale-110 transition-transform duration-200"
                      />
                      <h3 className="font-semibold mb-1">{category.name}</h3>
                      <p className="text-sm text-muted-foreground">{category.description}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Featured Products */}
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold">You may also like</h2>
              <Link href="/products">
                <Button variant="link" className="text-primary hover:underline">
                  View All Products
                </Button>
              </Link>
            </div>
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[...Array(4)].map((_, i) => (
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
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {featuredProducts.map((product) => (
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