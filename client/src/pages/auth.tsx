import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Redirect } from "wouter";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { Microchip } from "lucide-react";
import Login from "@/components/login";
import Register from "@/components/register";

export default function AuthPage() {
  const { user, isLoading } = useAuth();
  const [isLogin, setIsLogin] = useState(true);

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div>
        <Navbar />
        <main>
          <section className="py-16 min-h-screen bg-muted/30">
            <div className="container mx-auto px-4">
              <div className="flex justify-center items-center min-h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              </div>
            </div>
          </section>
        </main>
        <Footer />
      </div>
    );
  }

  // Redirect if already logged in
  if (user) {
    return <Redirect to="/" />;
  }

  return (
    <div>
      <Navbar />

      <main>
        <section className="py-16 min-h-screen bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* Left Side - Form */}
              <div className="order-2 lg:order-1">
                {isLogin ? (
                  <Login onSwitchToRegister={() => setIsLogin(false)} />
                ) : (
                  <Register onSwitchToLogin={() => setIsLogin(true)} />
                )}
              </div>

              {/* Right Side - Branding */}
              <div className="order-1 lg:order-2 text-center lg:text-left">
                <div className="mb-8">
                  <div className="inline-flex items-center gap-2 mb-4">
                    <Microchip className="h-8 w-8 text-primary" />
                    <span className="text-2xl font-bold">The PluG</span>
                  </div>
                  <h1 className="text-4xl lg:text-5xl font-bold mb-4">
                    {isLogin ? "Welcome Back to" : "Join"}{" "}
                    <span className="text-primary">The PluG</span>
                  </h1>
                  <p className="text-xl text-muted-foreground mb-8">
                    {isLogin
                      ? "Continue your tech journey with us"
                      : "Discover the latest in technology and innovation"}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4 text-center">
                  <div className="p-4 bg-background rounded-lg border">
                    <div className="text-2xl font-bold text-primary">10k+</div>
                    <div className="text-sm text-muted-foreground">Products</div>
                  </div>
                  <div className="p-4 bg-background rounded-lg border">
                    <div className="text-2xl font-bold text-primary">50k+</div>
                    <div className="text-sm text-muted-foreground">Customers</div>
                  </div>
                  <div className="p-4 bg-background rounded-lg border">
                    <div className="text-2xl font-bold text-primary">99%</div>
                    <div className="text-sm text-muted-foreground">Satisfaction</div>
                  </div>
                  <div className="p-4 bg-background rounded-lg border">
                    <div className="text-2xl font-bold text-primary">24/7</div>
                    <div className="text-sm text-muted-foreground">Support</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}