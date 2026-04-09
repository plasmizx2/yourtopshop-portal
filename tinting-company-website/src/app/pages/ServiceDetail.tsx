import { useParams, Link } from "react-router";
import { motion } from "motion/react";
import { Button } from "../components/ui/button";
import { CheckCircle2, ChevronRight, Share2, Info } from "lucide-react";

const serviceData: Record<string, any> = {
  "vinyl-wrap": {
    title: "Vinyl Wrap",
    subtitle: "services",
    description: "Vinyl wrap is a customizable, adhesive film applied to a vehicle's exterior to change its color or finish without permanent paint alterations. Available in a wide range of colors, textures, and finishes—including gloss, matte, satin, and carbon fiber—vinyl wrap allows for a fully personalized look. It's a popular choice for both aesthetic upgrades and branding, offering a cost-effective alternative to repainting.",
    description2: "In addition to its visual appeal, vinyl wrap provides a layer of protection against minor scratches, UV rays, and environmental damage. The material is durable yet removable, making it easy to switch styles or restore the vehicle to its original finish without damaging the paint. Whether for a bold transformation or subtle enhancement, vinyl wrapping is a versatile and practical solution.",
    image: "/images/real-optimized/gallery-wrap-01.jpg",
    features: ["Color Change Wraps", "Partial Wraps", "Chrome Delete", "Interior Trim Wrapping", "Custom Branding & Decals"],
  },
  "window-tint": {
    title: "Window Tint",
    subtitle: "protection",
    description: "Enhance your privacy and protect against harmful UV rays with our professional window tinting service. We offer a variety of tint shades to suit your preferences, from subtle to maximum privacy.",
    description2: "Our high-performance ceramic films reduce interior heat, prevent upholstery fading, and provide a sleek, uniform look. All installations are performed with surgical precision to ensure no bubbling or peeling for years to come.",
    image: "/images/tint.jpg",
    features: ["Ceramic Heat Rejection", "Carbon Privacy Tint", "UV Protection (99%)", "Glar Reduction", "Lifetime Warranty"],
  },
  "ceramic-coating": {
    title: "Ceramic Coating",
    subtitle: "solutions",
    description: "Give your vehicle long-lasting protection with our Ceramic Pro coating. This advanced ceramic coating creates a durable barrier against dirt, UV rays, and the environmental elements.",
    description2: "The hydrophobic properties make washing your car effortless, while the intense gloss enhancement gives your paint a deep, mirror-like finish that lasts for years, not months.",
    image: "/images/ceramic.jpg",
    features: ["9H Hardness", "Self-Cleaning Properties", "UV & Chemical Resistance", "Intense Gloss Enhancement", "3-5 Year Durability"],
  },
  "detailing": {
    title: "Auto Detailing",
    subtitle: "restoration",
    description: "Our comprehensive detailing services restore your vehicle to its showroom condition. We go beyond a simple wash, focusing on every deep-clean aspect of your car's interior and exterior.",
    description2: "From leather conditioning and steam cleaning to paint decontamination and hand polishing, we treat every inch of your vehicle with the care it deserves.",
    image: "/images/real-optimized/gallery-detail-01.jpg",
    features: ["Interior Steam Cleaning", "Leather Reconditioning", "Paint Decontamination", "Clay Bar Treatment", "Hand Polish & Wax"],
  }
};

export function ServiceDetail() {
  const { id } = useParams();
  const service = serviceData[id || "vinyl-wrap"] || serviceData["vinyl-wrap"];

  return (
    <div className="w-full text-foreground min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[60vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={service.image}
            alt={service.title}
            className="w-full h-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#121416] via-transparent to-[#121416]/70" />
        </div>
        
        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 pt-24 text-center">
          <motion.h1 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-7xl md:text-9xl font-black tracking-tighter opacity-10 absolute left-1/2 -top-12 -translate-x-1/2 whitespace-nowrap uppercase select-none pointer-events-none"
          >
            {service.title} {service.subtitle}
          </motion.h1>

          <Button asChild size="lg" className="bg-white text-black hover:bg-white/90 font-black px-12 py-8 text-xl rounded-none tracking-widest uppercase transition-transform hover:scale-105 shadow-2xl">
            <Link to="/book-service">Book Service Now!</Link>
          </Button>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-24 max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-start">
          {/* Left Column: Title & Text */}
          <div className="space-y-12">
            <div>
              <h2 className="text-6xl md:text-8xl font-black tracking-tighter leading-none mb-4 uppercase">
                {service.title}
                <br />
                <span className="text-yellow-400 block">{service.subtitle}</span>
              </h2>
              <div className="w-24 h-2 bg-yellow-400" />
            </div>

            <div className="space-y-8 text-gray-400 text-lg leading-relaxed font-light">
              <p>{service.description}</p>
              <p>{service.description2}</p>
            </div>

            <div className="flex gap-4 pt-4">
              <Button variant="outline" className="border-gray-800 text-white rounded-none flex gap-2">
                <Share2 className="w-4 h-4 text-yellow-400" /> Share Project
              </Button>
              <Button variant="outline" className="border-gray-800 text-white rounded-none flex gap-2">
                <Info className="w-4 h-4 text-yellow-400" /> Quality Specs
              </Button>
            </div>
          </div>

          {/* Right Column: Features & CTA */}
          <div className="space-y-12 bg-zinc-950 p-12 border border-gray-900">
            <h3 className="text-2xl font-bold tracking-widest uppercase flex items-center gap-3">
              <ChevronRight className="text-yellow-400" /> What's Included
            </h3>
            <ul className="space-y-6">
              {service.features.map((feature: string, i: number) => (
                <li key={i} className="flex items-start gap-4 text-lg">
                  <CheckCircle2 className="w-6 h-6 text-yellow-400 flex-shrink-0 mt-1" />
                  <span className="font-light">{feature}</span>
                </li>
              ))}
            </ul>

            <div className="pt-12 border-t border-gray-900 mt-12">
              <p className="text-sm text-gray-500 uppercase tracking-widest mb-6">Experience the transformation</p>
              <Button asChild className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-black py-8 text-lg rounded-none tracking-widest uppercase">
                <Link to="/book-service">Secure Your Appointment</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Related Section */}
      <section className="py-24 border-t border-gray-900">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-black mb-12 uppercase tracking-tighter">Explore More Solutions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {Object.keys(serviceData).filter(key => key !== id).slice(0, 4).map((key) => {
              const s = serviceData[key];
              return (
                <Link key={key} to={`/services/${key}`} className="group relative aspect-[3/4] overflow-hidden bg-zinc-950">
                  <img src={s.image} alt={s.title} className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-8 text-left">
                    <h4 className="text-xl font-bold uppercase tracking-tighter leading-tight">{s.title}<br/>{s.subtitle}</h4>
                    <ChevronRight className="text-yellow-400 w-6 h-6 mt-4 group-hover:translate-x-2 transition-transform" />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
