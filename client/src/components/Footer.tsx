import { Link } from "react-router-dom";
import { Instagram, Facebook, Mail, Phone, MapPin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-foreground text-background py-16 md:py-24">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="mb-6">
              <span className="text-xl font-serif">House of De</span>
              <p className="text-[10px] uppercase tracking-[0.3em] opacity-60 mt-1">
                The White Shirt Atelier
              </p>
            </div>
            <p className="text-sm opacity-60 leading-relaxed">
              Crafting the perfect white shirt for the discerning gentleman since 2024.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="text-xs uppercase tracking-[0.2em] mb-6">Navigation</h4>
            <nav className="flex flex-col gap-3">
              <a href="#collection" className="text-sm opacity-60 hover:opacity-100 transition-opacity">
                Collection
              </a>
              <a href="#story" className="text-sm opacity-60 hover:opacity-100 transition-opacity">
                Our Story
              </a>
              <Link to="/blog" className="text-sm opacity-60 hover:opacity-100 transition-opacity">
                Journal
              </Link>
              <Link to="/appointment" className="text-sm opacity-60 hover:opacity-100 transition-opacity">
                Appointment
              </Link>
            </nav>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-xs uppercase tracking-[0.2em] mb-6">Contact</h4>
            <div className="flex flex-col gap-3">
              <a href="mailto:hello@houseofde.com" className="flex items-center gap-2 text-sm opacity-60 hover:opacity-100 transition-opacity">
                <Mail size={14} />
                hello@houseofde.com
              </a>
              <a href="tel:+919876543210" className="flex items-center gap-2 text-sm opacity-60 hover:opacity-100 transition-opacity">
                <Phone size={14} />
                +91 98765 43210
              </a>
              <div className="flex items-start gap-2 text-sm opacity-60">
                <MapPin size={14} className="mt-1 flex-shrink-0" />
                <span>123 Fashion Street, Bandra West, Mumbai 400050</span>
              </div>
            </div>
          </div>

          {/* Social */}
          <div>
            <h4 className="text-xs uppercase tracking-[0.2em] mb-6">Follow Us</h4>
            <div className="flex gap-4">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 border border-background/20 hover:bg-background hover:text-foreground transition-all duration-300"
              >
                <Instagram size={18} />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 border border-background/20 hover:bg-background hover:text-foreground transition-all duration-300"
              >
                <Facebook size={18} />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-16 pt-8 border-t border-background/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs opacity-40">
            © 2024 House of De. All rights reserved.
          </p>
          <div className="flex gap-6">
            <a href="#" className="text-xs opacity-40 hover:opacity-100 transition-opacity">
              Privacy Policy
            </a>
            <a href="#" className="text-xs opacity-40 hover:opacity-100 transition-opacity">
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
