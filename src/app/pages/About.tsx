import { motion } from "motion/react";
import { Shield, Award, Users, Star } from "lucide-react";

export function About() {
  return (
    <div className="w-full text-foreground">
      {/* Hero Section */}
      <section className="relative h-[60vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0 bg-[#1e2228]">
          <img
            src="/images/hero.jpg"
            alt="Workshop"
            className="w-full h-full object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#1e2228]/70 via-transparent to-[#1e2228]" />
        </div>
        <div className="relative z-10 text-center px-4">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-6xl md:text-8xl font-black tracking-tighter mb-4"
          >
            OUR STORY
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-xl md:text-2xl text-gray-400 font-light tracking-[0.2em] uppercase"
          >
            Precision. Passion. Performance.
          </motion.p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-24 max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-4xl font-black mb-8 tracking-tight">CRAFTING EXCELLENCE <span className="text-yellow-400">SINCE 2018</span></h2>
            <div className="space-y-6 text-gray-400 leading-relaxed text-lg font-light">
              <p>
                At Your Top Shop, we don't just modify vehicles; we elevate them. Located in the heart of Cranston, Rhode Island, our facility has become the premier destination for owners who demand the absolute best for their automotive investments.
              </p>
              <p>
                Our journey began with a simple mission: to bridge the gap between ordinary customization and factory-quality excellence. Today, we specialize in advanced ceramic window tinting, precision vinyl wraps, and state-of-the-art paint protection.
              </p>
              <p>
                Every vehicle that enters our shop is treated with the same meticulous attention to detail as our own gallery-worthy projects. We use only industrial-leading materials and the latest application techniques to ensure results that don't just look incredible today, but stay that way for years to come.
              </p>
            </div>
          </div>
          <div className="relative">
            <div className="aspect-square camo-surface rounded-2xl overflow-hidden shadow-2xl skew-y-3 border border-white/10">
              <img
                src="/images/real-optimized/gallery-detail-02.jpg"
                alt="Detailing work"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-8 -left-8 bg-yellow-400 p-8 rounded-xl shadow-xl hidden md:block">
              <p className="text-4xl font-black">5+ YEARS</p>
              <p className="text-sm font-bold tracking-widest uppercase">Of Dedicated Service</p>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-24 camo-surface">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-black tracking-widest uppercase mb-4">Our Core Values</h2>
            <div className="w-24 h-1 bg-yellow-400 mx-auto" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { icon: Shield, title: "INTEGRITY", desc: "Honest advice and transparent pricing on every project." },
              { icon: Award, title: "QUALITY", desc: "Using only the world's finest automotive materials." },
              { icon: Users, title: "COMMUNITY", desc: "Building lasting relationships with our local car culture." },
              { icon: Star, title: "MASTERY", desc: "Continuous training and refinement in all application methods." },
            ].map((item, i) => (
              <div key={i} className="p-8 camo-surface border border-white/10 hover:border-yellow-400/50 transition-colors">
                <item.icon className="w-10 h-10 text-yellow-400 mb-6" />
                <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                <p className="text-gray-500 font-light text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
