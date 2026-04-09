import { motion } from "motion/react";
import { Link } from "react-router";
import { Button } from "../components/ui/button";
import { ChevronRight, Calendar } from "lucide-react";

export function Services() {
  const visualGrid = [
    { title: "VINYL WRAP", image: "/images/real-optimized/gallery-wrap-01.jpg", to: "/services/vinyl-wrap" },
    { title: "AUTO DETAILING", image: "/images/real-optimized/gallery-detail-01.jpg", to: "/services/detailing" },
    { title: "CERAMIC TINT", image: "/images/tint.jpg", to: "/services/window-tint" },
    { title: "PAINT PROTECTION", image: "/images/ppf.jpg", to: "/services/ppf" },
    { title: "CERAMIC COATING", image: "/images/ceramic.jpg", to: "/services/ceramic-coating" },
    { title: "CHROME DELETE", image: "/images/real/gallery-commercial-01.png", to: "/services/chrome-delete" },
  ];

  const popularServices = [
    {
      id: "window-tint",
      title: "WINDOW TINT",
      image: "/images/tint.jpg",
      desc: "Enhance your privacy and protect against harmful UV rays with our professional window tinting service. Choose from a variety of tint shades to suit your preferences."
    },
    {
      id: "ceramic-coating",
      title: "CERAMIC COATING",
      image: "/images/ceramic.jpg",
      desc: "Give your vehicle long-lasting protection with our Ceramic Pro coating. This advanced ceramic coating creates a durable barrier against dirt, UV rays, and the environmental elements."
    },
    {
      id: "ppf",
      title: "PAINT PROTECTION FILM",
      image: "/images/ppf.jpg",
      desc: "Safeguard your vehicle's paint from chips, scratches, and road debris with our high-quality paint protection film. This transparent film provides an invisible shield for your vehicle."
    }
  ];

  return (
    <div className="w-full text-foreground min-h-screen">
      {/* Header Info */}
      <section className="camo-surface py-8 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 text-center">
            <h1 className="text-4xl md:text-7xl font-black uppercase tracking-tighter leading-none mb-2">
              OUR SERVICES - <span className="text-yellow-400">BOOK ONLINE</span>
            </h1>
        </div>
      </section>

      {/* Hero Visual Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {visualGrid.map((service, i) => (
          <Link 
            key={i} 
            to={service.to}
            className="group relative aspect-[4/3] overflow-hidden border border-black"
          >
            <img 
              src={service.image} 
              alt={service.title} 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-60 group-hover:opacity-100" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80" />
            <div className="absolute inset-0 flex items-center justify-center p-8 text-center">
              <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter leading-tight drop-shadow-2xl">
                {service.title}
              </h2>
            </div>
            <div className="absolute bottom-6 right-6 translate-x-12 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all">
              <ChevronRight className="w-8 h-8 text-yellow-400" />
            </div>
          </Link>
        ))}
      </section>

      {/* Most Popular Services */}
      <section className="py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter mb-4 inline-block relative">
              MOST POPULAR SERVICES
              <div className="absolute -bottom-2 left-0 right-0 h-1 bg-yellow-400" />
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-16">
            {popularServices.map((service, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.2 }}
                className="flex flex-col h-full"
              >
                <div className="aspect-[4/3] bg-zinc-900 border border-gray-900 overflow-hidden mb-8">
                  <img src={service.image} alt={service.title} className="w-full h-full object-cover" />
                </div>
                <h3 className="text-lg font-bold mb-4 tracking-widest text-white border-b-2 border-yellow-400 inline-block self-start pb-1">
                  {service.title}
                </h3>
                <p className="text-gray-400 font-light text-base leading-relaxed mb-8 flex-1">
                  {service.desc}
                </p>
                <Button asChild size="lg" className="bg-yellow-400 hover:bg-yellow-500 text-black font-black py-8 text-lg rounded-none tracking-widest uppercase shadow-xl transition-shadow hover:shadow-yellow-900/20">
                  <Link to="/book-service" className="flex items-center gap-3">
                    <Calendar className="w-5 h-5" />
                    Book Online Today!
                  </Link>
                </Button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Bottom */}
      <section className="relative camo-surface py-32 border-t border-white/10 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-b from-[#121416] via-[#121416] to-[#121416]/95" />
          <div className="absolute -top-24 left-1/2 h-64 w-[900px] -translate-x-1/2 bg-yellow-400/5 blur-[120px]" />
        </div>
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-5xl font-black mb-8 uppercase tracking-tighter">
            NOT FINDING WHAT YOU'RE LOOKING FOR?
          </h2>
          <p className="text-xl text-gray-400 mb-10 font-light tracking-[0.1em]">
            WE OFFER CUSTOM COLOR WRAPS, CHROME DELETE, INTERIOR PROTECTION AND MORE.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Button asChild size="lg" className="bg-white text-black hover:bg-gray-200 font-black px-12 py-8 text-lg rounded-none tracking-widest uppercase">
              <Link to="/contact">Contact Support</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-black font-black px-12 py-8 text-lg rounded-none tracking-widest uppercase transition-colors">
              <Link to="/contact">Request a Quote</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
