import { Link, NavLink } from "react-router";
import { Menu, X, Phone } from "lucide-react";
import { useState } from "react";
import { Button } from "./ui/button";

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const logoSrc = "/images/real/logo-wide-01.png";

  const navLinks = [
    { to: "/", label: "HOME" },
    { to: "/book-service", label: "BOOK SERVICE" },
    { to: "/services", label: "OUR SERVICES" },
    { to: "/about", label: "ABOUT" },
    { to: "/contact", label: "CONTACT" },
    { to: "/private-policy", label: "PRIVATE POLICY" },
  ];

  return (
    <nav className="bg-black border-b border-gray-900 sticky top-0 z-50 py-4">
      <div className="max-w-[1400px] mx-auto px-6">
        <div className="flex justify-between items-center">
          {/* Menu Links - Desktop (Two rows on left) */}
          <div className="hidden lg:grid grid-cols-3 gap-x-8 gap-y-2 text-[11px] font-bold tracking-[0.2em]">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `transition-colors hover:text-yellow-400 ${
                    isActive ? "text-yellow-400 underline underline-offset-8" : "text-white"
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </div>

          {/* Logo - Center */}
          <Link to="/" className="flex items-center justify-center">
            <img
              src={logoSrc}
              alt="Your Top Shop"
              className="h-10 md:h-12 w-auto object-contain"
            />
          </Link>

          {/* Right Button */}
          <div className="hidden lg:flex items-center gap-4">
            <Button asChild variant="outline" className="border-zinc-800 text-zinc-500 hover:text-white hover:border-zinc-600 font-bold px-6 py-6 text-[10px] rounded-none tracking-widest uppercase transition-all">
              <Link to="/admin">Admin</Link>
            </Button>
            <Button asChild className="bg-yellow-400 hover:bg-yellow-500 text-black font-bold px-8 py-6 text-sm rounded-none tracking-widest uppercase">
              <Link to="/book-service">Book Service</Link>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-2 text-white"
          >
            {isOpen ? <X className="w-8 h-8" /> : <Menu className="w-8 h-8" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="lg:hidden mt-4 pb-6 space-y-4 border-t border-gray-900 pt-6">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                onClick={() => setIsOpen(false)}
                className={({ isActive }) =>
                  `block text-sm font-bold tracking-widest ${
                    isActive ? "text-yellow-400" : "text-white"
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
            <div className="flex flex-col gap-3 py-4">
              <Button asChild variant="outline" className="w-full border-zinc-800 text-zinc-500 hover:text-white py-6 rounded-none tracking-widest uppercase">
                <Link to="/admin" onClick={() => setIsOpen(false)}>Admin Portal</Link>
              </Button>
              <Button asChild className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-6 rounded-none tracking-widest uppercase">
                <Link to="/book-service" onClick={() => setIsOpen(false)}>Book Service Now</Link>
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}