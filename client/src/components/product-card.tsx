import { useMutation } from "@tanstack/react-query";
import { Product } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, StarHalf } from "lucide-react";
import { useLocation } from "wouter";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [, navigate] = useLocation();

  const addToCartMutation = useMutation({
    mutationFn: async () => {
      if (!user) {
        navigate("/auth");
        return;
      }
      const response = await apiRequest("POST", "/api/cart", {
        productId: product.id,
        quantity: 1,
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to add to cart');
      }
      
      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cart"] });
      toast({
        title: "Added to cart!",
        description: `${product.name} has been added to your cart.`,
      });
    },
    onError: (error: Error) => {
      if (!user) {
        toast({
          title: "Please log in",
          description: "You need to be logged in to add items to your cart.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Failed to add to cart",
          description: error.message,
          variant: "destructive",
        });
      }
    },
  });

  const handleAddToCart = () => {
    addToCartMutation.mutate();
  };

  const renderRating = (rating: string | null | undefined) => {
    const ratingNum = rating ? parseFloat(rating) : 0;
    const fullStars = Math.floor(ratingNum);
    const hasHalfStar = ratingNum % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    return (
      <div className="flex items-center rating-stars">
        {[...Array(fullStars)].map((_, i) => (
          <Star key={`full-${i}`} className="h-4 w-4 fill-current text-yellow-400" />
        ))}
        {hasHalfStar && <StarHalf className="h-4 w-4 fill-current text-yellow-400" />}
        {[...Array(emptyStars)].map((_, i) => (
          <Star key={`empty-${i}`} className="h-4 w-4 text-muted-foreground" />
        ))}
      </div>
    );
  };

  // Safe parsing of prices with better error handling
  const price = product.price ? parseFloat(String(product.price)) : 0;
  const originalPrice = product.originalPrice ? parseFloat(String(product.originalPrice)) : null;
  const hasDiscount = originalPrice && originalPrice > price;
  const inStock = product.inStock ?? 0;
  const isOutOfStock = inStock <= 0;

  // Handle missing images
  const imageUrl = product.image || 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300';

  // Debug logging
  console.log('Product Card Data:', {
    id: product.id,
    name: product.name,
    price: product.price,
    originalPrice: product.originalPrice,
    inStock: product.inStock,
    category: product.category,
    rating: product.rating
  });

  return (
    <Card className="product-card bg-card rounded-xl border border-border overflow-hidden group hover:shadow-lg transition-shadow duration-300" data-testid={`card-product-${product.id}`}>
      <div className="relative">
        <img
          src={imageUrl}
          alt={product.name || 'Product image'}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            // Fallback image if the main image fails to load
            e.currentTarget.src = 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300';
          }}
        />
        {hasDiscount && (
          <Badge variant="destructive" className="absolute top-2 right-2" data-testid={`badge-sale-${product.id}`}>
            Sale
          </Badge>
        )}
        {isOutOfStock && (
          <Badge variant="secondary" className="absolute top-2 left-2" data-testid={`badge-out-of-stock-${product.id}`}>
            Out of Stock
          </Badge>
        )}
      </div>
      <CardContent className="p-4">
        <h3 className="font-semibold mb-2 line-clamp-2 min-h-[3rem]" data-testid={`text-product-name-${product.id}`}>
          {product.name || 'Unknown Product'}
        </h3>
        
        {product.rating && (
          <div className="flex items-center mb-2">
            {renderRating(product.rating)}
            <span className="text-sm text-muted-foreground ml-2" data-testid={`text-rating-${product.id}`}>
              {product.rating}
            </span>
          </div>
        )}
        
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <span className="text-lg font-bold text-primary" data-testid={`text-price-${product.id}`}>
              ₹{price.toFixed(2)}
            </span>
            {hasDiscount && (
              <span className="text-sm text-muted-foreground line-through" data-testid={`text-original-price-${product.id}`}>
                ₹{originalPrice!.toFixed(2)}
              </span>
            )}
          </div>
        </div>
        
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm text-muted-foreground capitalize">
            {product.category || 'uncategorized'}
          </span>
          <span className="text-sm text-muted-foreground">
            Stock: {inStock}
          </span>
        </div>
        
        {product.description && (
          <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
            {product.description}
          </p>
        )}
        
        <Button
          onClick={handleAddToCart}
          disabled={addToCartMutation.isPending || isOutOfStock}
          className="w-full"
          variant={isOutOfStock ? "secondary" : "default"}
        >
          {addToCartMutation.isPending 
            ? "Adding..." 
            : isOutOfStock 
            ? "Out of Stock" 
            : "Add to Cart"}
        </Button>

      </CardContent>
    </Card>
  );
}