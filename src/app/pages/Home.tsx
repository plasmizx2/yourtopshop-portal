import { Link } from "react-router";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { Button } from "../components/ui/button";
import { motion } from "motion/react";
import { 
  Shield, 
  Award, 
  Clock,
  ArrowRight,
  Instagram,
  Star,
  ChevronRight,
  ShieldCheck,
  Zap,
  Globe
} from "lucide-react";

export function Home() {
  const brandHeroImage = "/images/hero.jpg";

  const featuredServices = [
    {
      id: "window-tint",
      title: "CERAMIC WINDOW TINT",
      description: "Advanced heat rejection and maximum privacy for the ultimate driving experience.",
      image: "/images/tint.jpg",
    },
    {
      id: "vinyl-wrap",
      title: "PREMIUM VINYL WRAPS",
      description: "Complete color transformations and custom finishes with world-class materials.",
      image: "/images/ppf.jpg",
    },
    {
      id: "ceramic-coating",
      title: "CERAMIC PROTECTION",
      description: "High-gloss, hydrophobic barrier that protects your vehicle's finish for years.",
      image: "/images/ceramic.jpg",
    },
  ];

  return (
    <div className="w-full bg-black text-white overflow-hidden">
      {/* Hero Section */}
      <section className="relative h-[90vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <ImageWithFallback
            src={brandHeroImage}
            alt="Luxury vehicle"
            className="w-full h-full object-cover opacity-60 scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-black/60" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 pt-24 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="flex items-center justify-center gap-4 mb-8">
              <div className="h-[2px] w-12 bg-yellow-400" />
              <span className="text-yellow-400 font-black tracking-[0.4em] uppercase text-xs md:text-sm">Cranston, Rhode Island</span>
              <div className="h-[2px] w-12 bg-yellow-400" />
            </div>
            <h1 className="text-6xl md:text-9xl font-black mb-8 tracking-tighter leading-[0.85] uppercase">
              YOUR TOP<br />
              <span className="text-yellow-400">SHOP</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-400 mb-12 font-light max-w-2xl mx-auto uppercase tracking-widest leading-relaxed">
              PRECISION CUSTOMIZATION & AUTOMOTIVE PROTECTION SPECIALISTS
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Button asChild size="lg" className="bg-yellow-400 hover:bg-yellow-500 text-black font-black px-12 py-10 text-xl rounded-none tracking-widest uppercase transition-all hover:scale-105 shadow-2xl">
                <Link to="/book-service">Book Service Now</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-black font-black px-12 py-10 text-xl rounded-none tracking-widest uppercase transition-all shadow-xl">
                <Link to="/services">Explore Solutions</Link>
              </Button>
            </div>
          </motion.div>
        </div>
        
        {/* Scroll Indicator */}
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 opacity-50">
          <span className="text-[10px] font-bold tracking-[0.5em] uppercase vertical-text">SCROLL</span>
          <div className="w-[1px] h-12 bg-white/20 animate-pulse" />
        </div>
      </section>

      {/* Stats Bar */}
      <motion.section 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="bg-zinc-950 border-y border-gray-900 py-12"
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { label: "PROJECTS COMPLETED", value: "2,500+" },
              { label: "GOOGLE RATING", value: "5.0 ★" },
              { label: "YEARS EXPERIENCE", value: "10+" },
              { label: "WARRANTY", value: "LIFETIME" },
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <div className="text-3xl font-black text-white mb-1">{stat.value}</div>
                <div className="text-[10px] font-bold text-gray-500 tracking-[0.2em]">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* About Brief */}
      <section className="py-32 bg-black border-b border-gray-900 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-yellow-400/5 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center"
          >
            <div>
              <h2 className="text-5xl md:text-7xl font-black tracking-tighter mb-8 uppercase leading-tight">
                WE DON'T JUST CUSTOMIZE.<br />
                <span className="text-yellow-400">WE PERFECT.</span>
              </h2>
              <div className="w-24 h-2 bg-yellow-400 mb-12" />
              <p className="text-xl text-gray-400 font-light leading-relaxed mb-8">
                At Your Top Shop, we've built our reputation on an uncompromising commitment to quality. Every vehicle that enters our shop is treated with surgical precision, utilizing the world's most advanced materials.
              </p>
              <Button asChild variant="outline" className="border-gray-800 text-white rounded-none tracking-widest font-black uppercase py-8 px-10 hover:border-yellow-400 hover:text-yellow-400 group transition-all">
                <Link to="/about" className="flex items-center gap-3">
                  Check Out Our Story <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="aspect-square bg-zinc-900 border border-gray-800 overflow-hidden group">
                   <img src="https://images.unsplash.com/photo-1549399542-7db3f01f05ad?q=80&w=800&auto=format&fit=crop" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-60 group-hover:opacity-100" alt="Work" />
                </div>
                <div className="aspect-[3/4] bg-zinc-900 border border-gray-800 overflow-hidden group">
                   <img src="https://images.unsplash.com/photo-1621359953476-b1645f783bb1?q=80&w=800&auto=format&fit=crop" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-60 group-hover:opacity-100" alt="Work" />
                </div>
              </div>
              <div className="space-y-4 pt-12">
                <div className="aspect-[3/4] bg-zinc-900 border border-gray-800 overflow-hidden group">
                   <img src="https://images.unsplash.com/photo-1690022676526-2762ac826843?q=80&w=800&auto=format&fit=crop" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-60 group-hover:opacity-100" alt="Work" />
                </div>
                <div className="aspect-square bg-zinc-900 border border-gray-800 overflow-hidden group">
                   <img src="https://images.unsplash.com/photo-1768024175254-373f5069324d?q=80&w=800&auto=format&fit=crop" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-60 group-hover:opacity-100" alt="Work" />
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Featured Services */}
      <section className="py-32 px-6 bg-zinc-950">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-end justify-between mb-24 gap-8">
            <div className="max-w-2xl">
              <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tighter mb-4 leading-none">CORE SPECIALTIES</h2>
              <p className="text-gray-500 font-bold tracking-[0.2em] uppercase text-sm">Industrial-leading materials, master-level installation.</p>
            </div>
            <Button asChild size="lg" className="bg-yellow-400 text-black hover:bg-yellow-500 font-black px-12 py-8 text-sm rounded-none tracking-widest uppercase mb-2 shadow-xl">
              <Link to="/services">View All Solutions</Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-1">
            {featuredServices.map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="group relative h-[600px] overflow-hidden bg-black border border-white/5"
              >
                <img
                  src={service.image}
                  alt={service.title}
                  className="w-full h-full object-cover opacity-60 group-hover:opacity-80 group-hover:scale-105 transition-all duration-1000"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-12 translate-y-12 group-hover:translate-y-0 transition-transform duration-500">
                  <h3 className="text-3xl font-black mb-4 uppercase tracking-tighter">{service.title}</h3>
                  <p className="text-gray-400 mb-8 font-light text-sm leading-relaxed opacity-0 group-hover:opacity-100 transition-opacity delay-200">
                    {service.description}
                  </p>
                  <Button asChild variant="outline" className="border-yellow-400 text-yellow-400 rounded-none w-full tracking-widest font-black uppercase py-6 hover:bg-yellow-400 hover:text-black transition-all">
                    <Link to={`/services/${service.id}`}>Details</Link>
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-32 px-6 border-b border-gray-900 bg-black">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
             {[
               { icon: ShieldCheck, title: "LIFETIME WARRANTY", desc: "We stand behind every square inch of our work with a comprehensive industry-leading guarantee." },
               { icon: Zap, title: "CERAMIC TECHNOLOGY", desc: "Utilizing latest-gen ceramic films and coatings for unmatched IR heat rejection and UV protection." },
               { icon: Globe, title: "WORLD CLASS MATERIALS", desc: "Exclusively installing premium films from the industry's most trusted manufacturers." }
             ].map((val, i) => (
               <div key={i} className="space-y-6">
                 <val.icon className="w-12 h-12 text-yellow-400" />
                 <h3 className="text-2xl font-black uppercase tracking-tight">{val.title}</h3>
                 <p className="text-gray-500 font-light leading-relaxed">{val.desc}</p>
               </div>
             ))}
          </div>
        </div>
      </section>

      {/* Instagram Feed / Portfolio */}
      <section className="py-32 px-6">
        <div className="max-w-7xl mx-auto text-center mb-24">
          <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tighter mb-4 inline-block relative">
            FOLLOW THE CULTURE
            <div className="absolute -bottom-2 left-0 right-0 h-1 bg-yellow-400" />
          </h2>
          <p className="text-gray-500 font-bold tracking-[0.2em] uppercase text-sm mt-8">DAILY PROJECT UPDATES & AUTOMOTIVE ART @YOURTOPSHOP_</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-1">
          {[
            featuredServices[0].image,
            featuredServices[1].image,
            featuredServices[2].image,
            brandHeroImage,
            featuredServices[0].image,
          ].map((img, i) => (
            <a key={i} href="https://www.instagram.com/yourtopshop_/" target="_blank" rel="noopener noreferrer" className="aspect-square relative group overflow-hidden bg-zinc-950">
               <img src={img} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700" alt="Instagram" />
               <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-yellow-400/20">
                  <Instagram className="w-8 h-8 text-white" />
               </div>
            </a>
          ))}
        </div>
      </section>

      {/* CTA Bottom Section */}
      <section className="bg-yellow-400 py-32 px-6">
        <div className="max-w-4xl mx-auto text-center text-black">
          <h2 className="text-5xl md:text-8xl font-black mb-12 uppercase tracking-tighter leading-tight">
            ELEVATE YOUR<br />STREET PRESENCE.
          </h2>
          <Button asChild size="lg" className="bg-black text-white hover:bg-black/80 font-black px-16 py-10 text-2xl rounded-none tracking-widest uppercase transition-transform hover:scale-105 shadow-2xl">
            <Link to="/book-service">Secure Your Spot</Link>
          </Button>
          <div className="mt-16 flex flex-wrap justify-center gap-12 text-sm font-black tracking-widest uppercase pointer-events-none opacity-80">
            <span>99 FLETCHER AVE, CRANSTON</span>
            <span>(401) 456-0006</span>
            <span>OPEN 9AM - 6PM</span>
          </div>
        </div>
      </section>
    </div>
  );
}