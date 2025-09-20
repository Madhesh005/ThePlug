import { useQuery, useMutation } from "@tanstack/react-query";
import { Cart, Product } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Minus, Plus, Trash2 } from "lucide-react";
import { Link } from "wouter";

type CartItem = Cart & { product: Product };

export default function CartPage() {
  const { user } = useAuth();
  const { toast } = useToast();

  const { data: cartItems = [], isLoading } = useQuery<CartItem[]>({
    queryKey: ["/api/cart"],
    enabled: !!user,
  });

  const updateQuantityMutation = useMutation({
    mutationFn: async ({ productId, quantity }: { productId: string; quantity: number }) => {
      const res = await apiRequest("PUT", `/api/cart/${productId}`, { quantity });
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cart"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to update quantity",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const removeItemMutation = useMutation({
    mutationFn: async (productId: string) => {
      await apiRequest("DELETE", `/api/cart/${productId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cart"] });
      toast({
        title: "Item removed",
        description: "Item has been removed from your cart.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to remove item",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const clearCartMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("DELETE", "/api/cart");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cart"] });
      toast({
        title: "Cart cleared",
        description: "All items have been removed from your cart.",
      });
    },
  });

  const subtotal = cartItems.reduce((sum, item) => sum + (parseFloat(item.product.price) * item.quantity), 0);
  const tax = subtotal * 0.08; // 8% tax
  const total = subtotal + tax;

  const handleQuantityChange = (productId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeItemMutation.mutate(productId);
    } else {
      updateQuantityMutation.mutate({ productId, quantity: newQuantity });
    }
  };

  if (isLoading) {
    return (
      <div>
        <Navbar />
        <main className="py-8">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="bg-card rounded-xl border border-border h-32 animate-pulse" />
              ))}
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      
      <main>
        <section className="py-8">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold mb-8">Shopping Cart</h2>
            
            {cartItems.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground text-lg mb-4">Your cart is empty</p>
                <Link href="/products">
                  <Button data-testid="button-continue-shopping">Continue Shopping</Button>
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-4">
                  {cartItems.map((item) => (
                    <Card key={item.id}>
                      <CardContent className="p-6">
                        <div className="flex items-center space-x-4">
                          <img 
                            src={item.product.image} 
                            alt={item.product.name}
                            className="w-20 h-20 object-cover rounded-lg"
                          />
                          <div className="flex-1">
                            <h3 className="font-semibold mb-1" data-testid={`text-product-name-${item.product.id}`}>
                              {item.product.name}
                            </h3>
                            <p className="text-sm text-muted-foreground mb-2 capitalize">
                              {item.product.category}
                            </p>
                            <div className="flex items-center space-x-4">
                              <div className="flex items-center border border-border rounded-lg">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleQuantityChange(item.productId, item.quantity - 1)}
                                  disabled={updateQuantityMutation.isPending}
                                  data-testid={`button-decrease-${item.product.id}`}
                                >
                                  <Minus className="h-4 w-4" />
                                </Button>
                                <span className="px-3 py-1 border-x border-border min-w-[3rem] text-center" data-testid={`text-quantity-${item.product.id}`}>
                                  {item.quantity}
                                </span>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleQuantityChange(item.productId, item.quantity + 1)}
                                  disabled={updateQuantityMutation.isPending}
                                  data-testid={`button-increase-${item.product.id}`}
                                >
                                  <Plus className="h-4 w-4" />
                                </Button>
                              </div>
                              <span className="font-semibold text-primary" data-testid={`text-price-${item.product.id}`}>
                                ${item.product.price}
                              </span>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => removeItemMutation.mutate(item.productId)}
                                disabled={removeItemMutation.isPending}
                                className="text-destructive hover:text-destructive/80 ml-auto"
                                data-testid={`button-remove-${item.product.id}`}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
                
                {/* Order Summary */}
                <div className="lg:col-span-1">
                  <Card className="sticky top-24">
                    <CardContent className="p-6">
                      <h3 className="text-lg font-semibold mb-4">Order Summary</h3>
                      <div className="space-y-3 mb-4">
                        <div className="flex justify-between">
                          <span>Subtotal</span>
                          <span data-testid="text-subtotal">${subtotal.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Shipping</span>
                          <span>Free</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Tax</span>
                          <span data-testid="text-tax">${tax.toFixed(2)}</span>
                        </div>
                        <Separator />
                        <div className="flex justify-between font-semibold text-lg">
                          <span>Total</span>
                          <span className="text-primary" data-testid="text-total">${total.toFixed(2)}</span>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <Link href="/order">
                          <Button className="w-full" size="lg" data-testid="button-proceed-to-order">
                            Proceed to Order
                          </Button>
                        </Link>
                        <Link href="/products">
                          <Button variant="outline" className="w-full" data-testid="button-continue-shopping-summary">
                            Continue Shopping
                          </Button>
                        </Link>
                        <Button 
                          variant="outline" 
                          className="w-full" 
                          onClick={() => clearCartMutation.mutate()}
                          disabled={clearCartMutation.isPending}
                          data-testid="button-clear-cart"
                        >
                          Clear Cart
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
