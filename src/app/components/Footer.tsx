import { Link } from "react-router";
import { Facebook, Instagram, Twitter, MapPin, Phone, Mail } from "lucide-react";

export function Footer() {
  const logoSrc = "/images/real/logo-wide-transparent.png";

  return (
    <footer className="bg-black text-gray-400 border-t border-gray-800 font-light">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Company Info */}
          <div className="space-y-6">
            <div className="flex flex-col gap-3">
              <img
                src={logoSrc}
                alt="Your Top Shop"
                className="h-12 w-auto object-contain"
              />
              <span className="text-yellow-400 font-bold tracking-widest uppercase">Premium Automotive Solutions</span>
            </div>
            <p className="text-sm leading-relaxed">
              Rhode Island's premier destination for professional window tinting, precision vinyl wraps, and advanced paint protection. Certified craftsmanship for the automotive enthusiast.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-bold text-white text-sm uppercase tracking-widest mb-6">Explore</h3>
            <ul className="space-y-3 text-sm">
              <li><Link to="/" className="hover:text-yellow-400 transition-colors">Home</Link></li>
              <li><Link to="/book-service" className="hover:text-yellow-400 transition-colors">Book Service</Link></li>
              <li><Link to="/services" className="hover:text-yellow-400 transition-colors">Our Services</Link></li>
              <li><Link to="/about" className="hover:text-yellow-400 transition-colors">About Us</Link></li>
              <li><Link to="/contact" className="hover:text-yellow-400 transition-colors">Contact</Link></li>
              <li><Link to="/private-policy" className="hover:text-yellow-400 transition-colors">Private Policy</Link></li>
              <li><Link to="/admin" className="hover:text-yellow-400 transition-colors text-zinc-600/50">Admin Portal</Link></li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="font-bold text-white text-sm uppercase tracking-widest mb-6">Capabilities</h3>
            <ul className="space-y-3 text-sm">
              <li><Link to="/services/ceramic-tint" className="hover:text-yellow-400 transition-colors">Ceramic Window Tinting</Link></li>
              <li><Link to="/services/vinyl-wrap" className="hover:text-yellow-400 transition-colors">Vinyl Wraps & Color Changes</Link></li>
              <li><Link to="/services/detailing" className="hover:text-yellow-400 transition-colors">Auto Detailing</Link></li>
              <li><Link to="/services/ceramic-coating" className="hover:text-yellow-400 transition-colors">Ceramic Coating</Link></li>
              <li><Link to="/services/ppf" className="hover:text-yellow-400 transition-colors">Paint Protection Film</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-bold text-white text-sm uppercase tracking-widest mb-6">HQ</h3>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-yellow-400 flex-shrink-0" />
                <span>99 Fletcher Ave<br />Cranston, RI 02920</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-yellow-400 flex-shrink-0" />
                <a href="tel:+14014560006" className="hover:text-yellow-400 transition-colors">
                  (401) 456-0006
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-yellow-400 flex-shrink-0" />
                <a href="mailto:info@yourtopshop.com" className="hover:text-yellow-400 transition-colors">
                  info@yourtopshop.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-900 mt-16 pt-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-xs uppercase tracking-widest">© 2026 Your Top Shop. Crafted for Excellence.</p>
          <div className="flex gap-6">
            <a href="https://www.facebook.com/yourtopshopp/" target="_blank" rel="noopener noreferrer" className="hover:text-yellow-400 transition-primary"><Facebook className="w-5 h-5" /></a>
            <a href="https://www.instagram.com/yourtopshop_/" target="_blank" rel="noopener noreferrer" className="hover:text-yellow-400 transition-primary"><Instagram className="w-5 h-5" /></a>
          </div>
        </div>
      </div>
    </footer>
  );
}