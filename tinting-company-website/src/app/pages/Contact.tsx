import { useState } from "react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { Label } from "../components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { MapPin, Phone, Mail, Clock, CheckCircle, Calendar, MessageSquare, Facebook, Instagram } from "lucide-react";
import { motion } from "motion/react";

export function Contact() {
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const directionsUrl =
    "https://www.google.com/maps/dir/?api=1&destination=99+Fletcher+Ave%2C+Cranston%2C+RI+02920";
  const mapEmbedUrl =
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2999.7236935721947!2d-71.45033!3d41.76845!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89e4456c67adecb1%3A0x8677f5f9be88a2f4!2s99%20Fletcher%20Ave%2C%20Cranston%2C%20RI%2002920!5e0!3m2!1sen!2sus!4v1712350000000!5m2!1sen!2sus";
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    service: "",
    message: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    try {
      const API_BASE = '';
      await fetch(`${API_BASE}/api/inquiries`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      setFormSubmitted(true);
      setFormData({ firstName: "", lastName: "", email: "", phone: "", service: "", message: "" });
      setTimeout(() => setFormSubmitted(false), 8000);
    } catch (err) {
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="w-full text-foreground min-h-screen">
      {/* Hero Section */}
      <section className="camo-surface py-24 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-6xl md:text-8xl font-black uppercase tracking-tighter mb-6"
          >
            CONTACT US
          </motion.h1>
          <p className="text-xl text-gray-500 font-light uppercase tracking-widest max-w-2xl mx-auto">
            Have questions or ready to start a project? Reach out to our team of experts in Cranston, RI.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
            
            {/* Left: Contact Info */}
            <div className="lg:col-span-5 space-y-12">
              <div>
                <h2 className="text-3xl font-black uppercase tracking-tight mb-8">Direct Channels</h2>
                <div className="space-y-8">
                  <div className="flex items-start gap-6 group">
                    <div className="w-14 h-14 bg-zinc-950 border border-gray-900 flex items-center justify-center flex-shrink-0 group-hover:border-yellow-400 transition-colors">
                      <MapPin className="w-6 h-6 text-yellow-400" />
                    </div>
                    <div>
                      <h3 className="font-bold uppercase tracking-widest text-sm mb-2 text-gray-400">Our Shop</h3>
                      <p className="text-lg font-light leading-relaxed">
                        99 Fletcher Ave<br />Cranston, RI 02920
                      </p>
                    </div>
                  </div>

                  {/* Map + Directions */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
                    <div className="aspect-square bg-zinc-950 border border-gray-900 overflow-hidden">
                      <iframe
                        src={mapEmbedUrl}
                        width="100%"
                        height="100%"
                        style={{ border: 0 }}
                        allowFullScreen
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                        title="Your Top Shop Location"
                        className="w-full h-full grayscale hover:grayscale-0 transition-all duration-700 opacity-90"
                      />
                    </div>
                    <div className="bg-zinc-950 border border-gray-900 p-6 flex flex-col justify-between">
                      <div>
                        <h3 className="font-bold uppercase tracking-widest text-sm mb-2 text-gray-400">Directions</h3>
                        <p className="text-sm text-gray-400 font-light leading-relaxed">
                          Tap below to open turn-by-turn directions to our Cranston shop.
                        </p>
                      </div>
                      <Button asChild className="mt-6 bg-yellow-400 hover:bg-yellow-500 text-black font-black py-6 rounded-none tracking-widest uppercase">
                        <a href={directionsUrl} target="_blank" rel="noopener noreferrer">
                          Get Directions
                        </a>
                      </Button>
                    </div>
                  </div>

                  <div className="flex items-start gap-6 group">
                    <div className="w-14 h-14 bg-zinc-950 border border-gray-900 flex items-center justify-center flex-shrink-0 group-hover:border-yellow-400 transition-colors">
                      <Phone className="w-6 h-6 text-yellow-400" />
                    </div>
                    <div>
                      <h3 className="font-bold uppercase tracking-widest text-sm mb-2 text-gray-400">Phone</h3>
                      <a href="tel:+14014560006" className="text-lg font-light hover:text-yellow-400 transition-colors">
                        (401) 456-0006
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-6 group">
                    <div className="w-14 h-14 bg-zinc-950 border border-gray-900 flex items-center justify-center flex-shrink-0 group-hover:border-yellow-400 transition-colors">
                      <Mail className="w-6 h-6 text-yellow-400" />
                    </div>
                    <div>
                      <h3 className="font-bold uppercase tracking-widest text-sm mb-2 text-gray-400">Email</h3>
                      <a href="mailto:info@yourtopshop.com" className="text-lg font-light hover:text-yellow-400 transition-colors">
                        info@yourtopshop.com
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-6 group">
                    <div className="w-14 h-14 bg-zinc-950 border border-gray-900 flex items-center justify-center flex-shrink-0 group-hover:border-yellow-400 transition-colors">
                      <Instagram className="w-6 h-6 text-yellow-400" />
                    </div>
                    <div>
                      <h3 className="font-bold uppercase tracking-widest text-sm mb-2 text-gray-400">Social</h3>
                      <div className="flex gap-4">
                        <a href="https://www.instagram.com/yourtopshop_/" target="_blank" rel="noopener noreferrer" className="text-lg font-light hover:text-yellow-400 transition-colors uppercase tracking-widest text-xs">Instagram</a>
                        <span className="text-zinc-800">/</span>
                        <a href="https://www.facebook.com/yourtopshopp/" target="_blank" rel="noopener noreferrer" className="text-lg font-light hover:text-yellow-400 transition-colors uppercase tracking-widest text-xs">Facebook</a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-3xl font-black uppercase tracking-tight mb-8">Business Hours</h2>
                <div className="grid grid-cols-2 gap-4 text-sm font-light tracking-widest">
                  <div className="text-gray-500 uppercase">Mon - Fri</div>
                  <div>9:00 AM - 6:00 PM</div>
                  <div className="text-gray-500 uppercase">Saturday</div>
                  <div>10:00 AM - 4:00 PM</div>
                  <div className="text-gray-500 uppercase">Sunday</div>
                  <div className="text-yellow-400">CLOSED</div>
                </div>
              </div>

              <div className="p-8 bg-zinc-950 border border-gray-900">
                <Calendar className="w-8 h-8 text-yellow-400 mb-4" />
                <h3 className="text-xl font-bold uppercase mb-2">Preferred Method</h3>
                <p className="text-gray-400 font-light text-sm mb-6 leading-relaxed">
                  For the fastest service and real-time availability, we recommend using our automated booking system.
                </p>
                <Button asChild className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-black py-6 rounded-none tracking-widest uppercase">
                  <a href="https://booksy.com/en-us/instant-experiences/widget/857294?instant_experiences_enabled=true&ig_ix=true" target="_blank" rel="noopener noreferrer">
                    Book on Booksy
                  </a>
                </Button>
              </div>
            </div>

            {/* Right: Contact Form */}
            <div className="lg:col-span-7">
              <div className="bg-zinc-950 border border-gray-900 p-10 md:p-12">
                <div className="flex items-center gap-4 mb-8">
                  <MessageSquare className="w-8 h-8 text-yellow-400" />
                  <h2 className="text-4xl font-black uppercase tracking-tighter">Request a Quote</h2>
                </div>

                {formSubmitted ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="py-24 text-center border border-dashed border-yellow-400/30"
                  >
                    <CheckCircle className="w-16 h-16 text-yellow-400 mx-auto mb-6" />
                    <h3 className="text-3xl font-black mb-4 uppercase">Message Received</h3>
                    <p className="text-gray-400 font-light max-w-sm mx-auto">
                      Thank you for reaching out. A specialist from our Cranston facility will contact you within 24 business hours.
                    </p>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-3">
                        <Label htmlFor="firstName" className="uppercase tracking-widest text-[10px] font-bold text-gray-500">First Name</Label>
                        <Input id="firstName" value={formData.firstName} onChange={(e) => setFormData({...formData, firstName: e.target.value})} className="bg-input-background border-white/10 rounded-none h-14" required />
                      </div>
                      <div className="space-y-3">
                        <Label htmlFor="lastName" className="uppercase tracking-widest text-[10px] font-bold text-gray-500">Last Name</Label>
                        <Input id="lastName" value={formData.lastName} onChange={(e) => setFormData({...formData, lastName: e.target.value})} className="bg-input-background border-white/10 rounded-none h-14" required />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-3">
                        <Label htmlFor="email" className="uppercase tracking-widest text-[10px] font-bold text-gray-500">Email Address</Label>
                        <Input id="email" type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="bg-input-background border-white/10 rounded-none h-14" required />
                      </div>
                      <div className="space-y-3">
                        <Label htmlFor="phone" className="uppercase tracking-widest text-[10px] font-bold text-gray-500">Phone Number</Label>
                        <Input id="phone" type="tel" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} className="bg-input-background border-white/10 rounded-none h-14" required />
                      </div>
                    </div>

                    <div className="space-y-3">
                      <Label htmlFor="service" className="uppercase tracking-widest text-[10px] font-bold text-gray-500">Service Interest</Label>
                      <Select value={formData.service} onValueChange={(val) => setFormData({...formData, service: val})} required>
                        <SelectTrigger id="service" className="bg-input-background border-white/10 rounded-none h-14">
                          <SelectValue placeholder="Select service type" />
                        </SelectTrigger>
                        <SelectContent className="bg-zinc-950 border-gray-900 text-white rounded-none">
                          <SelectItem value="window-tint">Window Tinting</SelectItem>
                          <SelectItem value="detailing">Auto Detailing</SelectItem>
                          <SelectItem value="vinyl">Vinyl Wrap</SelectItem>
                          <SelectItem value="ceramic">Ceramic Coating</SelectItem>
                          <SelectItem value="ppf">Paint Protection</SelectItem>
                          <SelectItem value="other">Other Inquiry</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-3">
                      <Label htmlFor="message" className="uppercase tracking-widest text-[10px] font-bold text-gray-500">Project Details</Label>
                      <Textarea
                        id="message"
                        value={formData.message}
                        onChange={(e) => setFormData({...formData, message: e.target.value})}
                        className="bg-input-background border-white/10 rounded-none min-h-[160px]"
                        placeholder="Tell us about your vehicle and what you're looking to achieve..."
                        required
                      />
                    </div>

                    <Button type="submit" disabled={isProcessing} className="w-full bg-white text-black hover:bg-yellow-400 hover:text-black font-black py-8 rounded-none tracking-[0.2em] uppercase transition-all text-lg shadow-2xl">
                      {isProcessing ? "Processing..." : "Send Inquiry"}
                    </Button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
