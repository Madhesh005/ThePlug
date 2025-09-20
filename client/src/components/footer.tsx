import { Microchip } from "lucide-react";
import { FaTwitter, FaInstagram, FaYoutube } from "react-icons/fa";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export default function Footer() {
  return (
    <footer className="bg-card border-t border-border py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center mb-4">
              <Microchip className="text-2xl text-primary mr-3 h-8 w-8" />
              <span className="text-xl font-bold">TechMart</span>
            </div>
            <p className="text-muted-foreground mb-4">
              Cutting-edge electronics to power your setup.
            </p>
            <div className="flex space-x-4">
              <Link href="#">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-muted-foreground hover:text-primary p-2"
                  data-testid="link-twitter"
                >
                  <FaTwitter className="h-5 w-5" />
                </Button>
              </Link>
              <Link href="#">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-muted-foreground hover:text-primary p-2"
                  data-testid="link-instagram"
                >
                  <FaInstagram className="h-5 w-5" />
                </Button>
              </Link>
              <Link href="#">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-muted-foreground hover:text-primary p-2"
                  data-testid="link-youtube"
                >
                  <FaYoutube className="h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Support</h4>
            <ul className="space-y-2 text-muted-foreground">
              <li>
                <Link href="/contact">
                  <Button 
                    variant="link" 
                    className="text-muted-foreground hover:text-primary p-0 h-auto"
                    data-testid="link-contact"
                  >
                    Contact
                  </Button>
                </Link>
              </li>
              <li>
                <Link href="#">
                  <Button 
                    variant="link" 
                    className="text-muted-foreground hover:text-primary p-0 h-auto"
                    data-testid="link-faq"
                  >
                    FAQ
                  </Button>
                </Link>
              </li>
              <li>
                <Link href="#">
                  <Button 
                    variant="link" 
                    className="text-muted-foreground hover:text-primary p-0 h-auto"
                    data-testid="link-shipping"
                  >
                    Shipping
                  </Button>
                </Link>
              </li>
              <li>
                <Link href="#">
                  <Button 
                    variant="link" 
                    className="text-muted-foreground hover:text-primary p-0 h-auto"
                    data-testid="link-returns"
                  >
                    Returns
                  </Button>
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Company</h4>
            <ul className="space-y-2 text-muted-foreground">
              <li>
                <Link href="#">
                  <Button 
                    variant="link" 
                    className="text-muted-foreground hover:text-primary p-0 h-auto"
                    data-testid="link-about"
                  >
                    About
                  </Button>
                </Link>
              </li>
              <li>
                <Link href="#">
                  <Button 
                    variant="link" 
                    className="text-muted-foreground hover:text-primary p-0 h-auto"
                    data-testid="link-careers"
                  >
                    Careers
                  </Button>
                </Link>
              </li>
              <li>
                <Link href="#">
                  <Button 
                    variant="link" 
                    className="text-muted-foreground hover:text-primary p-0 h-auto"
                    data-testid="link-press"
                  >
                    Press
                  </Button>
                </Link>
              </li>
              <li>
                <Link href="#">
                  <Button 
                    variant="link" 
                    className="text-muted-foreground hover:text-primary p-0 h-auto"
                    data-testid="link-blog"
                  >
                    Blog
                  </Button>
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Follow</h4>
            <ul className="space-y-2 text-muted-foreground">
              <li>
                <Link href="#">
                  <Button 
                    variant="link" 
                    className="text-muted-foreground hover:text-primary p-0 h-auto flex items-center"
                    data-testid="link-twitter-follow"
                  >
                    <FaTwitter className="mr-2 h-4 w-4" />
                    Twitter
                  </Button>
                </Link>
              </li>
              <li>
                <Link href="#">
                  <Button 
                    variant="link" 
                    className="text-muted-foreground hover:text-primary p-0 h-auto flex items-center"
                    data-testid="link-instagram-follow"
                  >
                    <FaInstagram className="mr-2 h-4 w-4" />
                    Instagram
                  </Button>
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        <hr className="border-border my-8" />
        
        <div className="flex flex-col md:flex-row justify-between items-center text-sm text-muted-foreground">
          <p data-testid="text-copyright">&copy; 2024 TechMart. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link href="#">
              <Button 
                variant="link" 
                className="text-muted-foreground hover:text-primary p-0 h-auto text-sm"
                data-testid="link-privacy"
              >
                Privacy Policy
              </Button>
            </Link>
            <Link href="#">
              <Button 
                variant="link" 
                className="text-muted-foreground hover:text-primary p-0 h-auto text-sm"
                data-testid="link-terms"
              >
                Terms of Service
              </Button>
            </Link>
            <Link href="#">
              <Button 
                variant="link" 
                className="text-muted-foreground hover:text-primary p-0 h-auto text-sm"
                data-testid="link-cookies"
              >
                Cookie Policy
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
