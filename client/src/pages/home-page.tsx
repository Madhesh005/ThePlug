import { useQuery } from "@tanstack/react-query";
import { Product } from "@shared/schema";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import ProductCard from "@/components/product-card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export default function HomePage() {
  const { data: products = [], isLoading } = useQuery<Product[]>({
    queryKey: ["/api/products"],
  });

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
                <div className="flex flex-col lg:flex-row items-center justify-between">
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
                  <div className="lg:w-1/2 flex justify-center space-x-4">
                    <div className="hidden lg:flex space-x-4">
                      <div className="bg-white/10 backdrop-blur rounded-xl p-4 w-48 h-32 flex items-center justify-center">
                        <span className="text-center text-sm">Featured Banner 1</span>
                      </div>
                      <div className="bg-white/10 backdrop-blur rounded-xl p-4 w-48 h-32 flex items-center justify-center">
                        <span className="text-center text-sm">Featured Banner 2</span>
                      </div>
                    </div>
                  </div>
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
                <Link key={category.slug} href={`/products?category=${category.slug}`}>
                  <div className="group cursor-pointer" data-testid={`category-${category.slug}`}>
                    <div className="bg-card hover:bg-card/80 rounded-xl p-6 text-center border border-border transition-all duration-200 hover:scale-105">
                      <img 
                        src={category.image} 
                        alt={category.name}
                        className="w-16 h-16 mx-auto mb-4 rounded-lg object-cover"
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
            <h2 className="text-2xl font-bold mb-8">You may also like</h2>
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="bg-card rounded-xl border border-border h-80 animate-pulse" />
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
