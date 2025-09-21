import { Mail, MessageCircle } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import ThePlug from "../attached_assets/ThePlug.png"

export default function Footer() {
  return (
    <footer className="bg-card border-t border-border py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Logo + tagline */}
          <div className="flex items-center space-x-3">
            <img
              src={ThePlug}
              alt="business_logo"
              className="h-10 w-auto object-contain"
            />
            <span className="text-xl font-bold">The PluG</span>
          </div>
          <p className="text-sm text-muted-foreground text-center md:text-left">
            © 2025 The Plug. All rights reserved.
          </p>

          {/* Contact links */}
          <div className="flex space-x-4">
            {/* WhatsApp */}
            <a 
              href="https://wa.me/918939117117" 
              target="_blank" 
              rel="noopener noreferrer"
              title="Contact us on WhatsApp"
            >
              <Button
                variant="ghost"
                size="sm"
                className="text-muted-foreground hover:text-green-600 hover:bg-green-50 dark:hover:bg-green-950 p-2 transition-colors"
              >
                <MessageCircle className="h-5 w-5" />
              </Button>
            </a>

            {/* Gmail */}
            <a 
              href="mailto:Subramani2692@gmail.com" 
              target="_blank" 
              rel="noopener noreferrer"
              title="Send us an email"
            >
              <Button
                variant="ghost"
                size="sm"
                className="text-muted-foreground hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950 p-2 transition-colors"
              >
                <Mail className="h-5 w-5" />
              </Button>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}