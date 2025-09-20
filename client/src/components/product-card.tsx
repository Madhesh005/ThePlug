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
      const res = await apiRequest("POST", "/api/cart", {
        productId: product.id,
        quantity: 1,
      });
      return await res.json();
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

  const renderRating = (rating: string) => {
    const ratingNum = parseFloat(rating);
    const fullStars = Math.floor(ratingNum);
    const hasHalfStar = ratingNum % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    return (
      <div className="flex items-center rating-stars">
        {[...Array(fullStars)].map((_, i) => (
          <Star key={`full-${i}`} className="h-4 w-4 fill-current" />
        ))}
        {hasHalfStar && <StarHalf className="h-4 w-4 fill-current" />}
        {[...Array(emptyStars)].map((_, i) => (
          <Star key={`empty-${i}`} className="h-4 w-4 text-muted-foreground" />
        ))}
      </div>
    );
  };

  const hasDiscount = product.originalPrice && parseFloat(product.originalPrice) > parseFloat(product.price);

  return (
    <Card className="product-card bg-card rounded-xl border border-border overflow-hidden group" data-testid={`card-product-${product.id}`}>
      <div className="relative">
        <img 
          src={product.image} 
          alt={product.name}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {hasDiscount && (
          <Badge variant="destructive" className="absolute top-2 right-2" data-testid={`badge-sale-${product.id}`}>
            Sale
          </Badge>
        )}
        {product.inStock <= 0 && (
          <Badge variant="secondary" className="absolute top-2 left-2" data-testid={`badge-out-of-stock-${product.id}`}>
            Out of Stock
          </Badge>
        )}
      </div>
      <CardContent className="p-4">
        <h3 className="font-semibold mb-2 line-clamp-2" data-testid={`text-product-name-${product.id}`}>
          {product.name}
        </h3>
        <div className="flex items-center mb-2">
          {renderRating(product.rating)}
          <span className="text-sm text-muted-foreground ml-2" data-testid={`text-rating-${product.id}`}>
            {product.rating}
          </span>
        </div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <span className="text-lg font-bold text-primary" data-testid={`text-price-${product.id}`}>
              ${product.price}
            </span>
            {hasDiscount && (
              <span className="text-sm text-muted-foreground line-through" data-testid={`text-original-price-${product.id}`}>
                ${product.originalPrice}
              </span>
            )}
          </div>
        </div>
        <Button 
          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
          onClick={handleAddToCart}
          disabled={addToCartMutation.isPending || product.inStock <= 0}
          data-testid={`button-add-to-cart-${product.id}`}
        >
          {addToCartMutation.isPending 
            ? "Adding..." 
            : product.inStock <= 0 
            ? "Out of Stock" 
            : "Add to Cart"
          }
        </Button>
      </CardContent>
    </Card>
  );
}
