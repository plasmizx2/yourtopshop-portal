import { useState } from "react";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { Button } from "../components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Instagram } from "lucide-react";
import { motion } from "motion/react";
import { Link } from "react-router";

export function Gallery() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const categories = {
    all: "ALL WORK",
    automotive: "AUTOMOTIVE",
    commercial: "COMMERCIAL",
    wraps: "VINYL WRAPS",
  };

  const galleryItems = [
    {
      src: "/images/gallery_porsche.png",
      title: "Porsche GT3 - Ultimate Ceramic Protection",
      category: "automotive",
    },
    {
      src: "/images/gallery_tesla.png",
      title: "Tesla Model Y - Signature Matte Black Wrap",
      category: "wraps",
    },
    {
      src: "/images/gallery_bmw.png",
      title: "BMW M4 - Executive Ceramic Tint",
      category: "automotive",
    },
    {
      src: "/images/tint.jpg",
      title: "Luxury Sedan - High Heat Rejection",
      category: "automotive",
    },
    {
      src: "/images/ppf.jpg",
      title: "Satin Finish Protection Film",
      category: "wraps",
    },
    {
      src: "/images/ceramic.jpg",
      title: "Hydrophobic Glass Shield",
      category: "automotive",
    },
    {
      src: "/images/hero.jpg",
      title: "Custom Showroom Build",
      category: "wraps",
    },
    {
      src: "/images/real/gallery-shop-01.png",
      title: "Full Vehicle Restoration",
      category: "automotive",
    },
    {
      src: "/images/real/gallery-shop-02.png",
      title: "In-Shop Tint Install — Quality Control",
      category: "automotive",
    },
    {
      src: "/images/real/gallery-shop-03.png",
      title: "Fresh Tint — Gloss Finish & Clean Lines",
      category: "automotive",
    },
    {
      src: "/images/real/gallery-wrap-01.png",
      title: "Vinyl Wrap Install — Precision Application",
      category: "wraps",
    },
    {
      src: "/images/real/gallery-detail-01.png",
      title: "Detailing — Foam Wash Prep",
      category: "automotive",
    },
    {
      src: "/images/real/gallery-detail-02.png",
      title: "Detailing — Final Gloss Finish",
      category: "automotive",
    },
    {
      src: "/images/real/gallery-commercial-01.png",
      title: "Commercial Wrap — Branded Fleet Work",
      category: "commercial",
    },
  ];

  const filterItems = (category: string) => {
    if (category === "all") return galleryItems;
    return galleryItems.filter((item) => item.category === category);
  };

  return (
    <div className="w-full bg-black text-white min-h-screen">
      {/* Hero Section */}
      <section className="bg-black py-24 border-b border-gray-900">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-6xl md:text-8xl font-black uppercase tracking-tighter mb-6"
          >
            OUR GALLERY
          </motion.h1>
          <div className="flex flex-col md:flex-row items-center justify-center gap-8">
            <p className="text-xl text-gray-500 font-light uppercase tracking-widest">
              Showcasing the gold standard in automotive excellence
            </p>
            <a
              href="https://www.instagram.com/yourtopshop_/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 text-yellow-400 hover:text-white transition-colors font-bold uppercase tracking-widest text-sm"
            >
              <Instagram className="w-5 h-5" />
              <span>Follow @yourtopshop_</span>
            </a>
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="flex flex-wrap justify-center gap-4 mb-16 bg-transparent h-auto">
              {Object.entries(categories).map(([key, value]) => (
                <TabsTrigger
                  key={key}
                  value={key}
                  className="px-8 py-3 bg-zinc-950 border border-gray-900 rounded-none data-[state=active]:bg-yellow-400 data-[state=active]:text-black font-black tracking-widest uppercase text-xs transition-all"
                >
                  {value}
                </TabsTrigger>
              ))}
            </TabsList>

            {Object.keys(categories).map((category) => (
              <TabsContent key={category} value={category}>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-1">
                  {filterItems(category).map((item, index) => (
                    <motion.div
                      key={index}
                      className="group relative aspect-[4/3] overflow-hidden bg-zinc-950 cursor-pointer"
                      onClick={() => setSelectedImage(item.src)}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.4 }}
                    >
                      <ImageWithFallback
                        src={item.src}
                        alt={item.title}
                        className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                          <h3 className="text-xl font-bold uppercase tracking-tighter">{item.title}</h3>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 bg-zinc-950 border-t border-gray-900 text-center">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-4xl md:text-6xl font-black mb-12 uppercase tracking-tighter text-white">
            READY TO TRANSFORM<br /><span className="text-yellow-400">YOUR VEHICLE?</span>
          </h2>
          <Button asChild size="lg" className="bg-yellow-400 hover:bg-yellow-500 text-black font-black px-16 py-10 text-2xl rounded-none tracking-widest uppercase transition-transform hover:scale-105">
            <Link to="/book-service">Book Your Session Now</Link>
          </Button>
        </div>
      </section>

      {/* Image Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black/98 z-50 flex items-center justify-center p-4 cursor-zoom-out"
          onClick={() => setSelectedImage(null)}
        >
          <button
            className="absolute top-8 right-8 text-white hover:text-yellow-400 transition-colors"
            onClick={() => setSelectedImage(null)}
          >
            <X className="w-12 h-12" />
          </button>
          <img
            src={selectedImage}
            alt="Gallery preview"
            className="max-w-full max-h-[90vh] object-contain shadow-2xl"
          />
        </div>
      )}
    </div>
  );
}

function X({ className }: { className?: string }) {
  return (
    <svg 
      className={className} 
      xmlns="http://www.w3.org/2000/svg" 
      width="24" 
      height="24" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}
