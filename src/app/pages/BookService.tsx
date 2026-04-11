import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Calendar as LucideCalendar, Clock, Check, ReceiptText, CreditCard, ExternalLink } from "lucide-react";
import { handleStripeCheckout, logManualBooking } from "../lib/stripe";
import { Button } from "../components/ui/button";
import { Calendar } from "../components/ui/calendar";
import { format, isSunday, isSaturday, startOfToday } from "date-fns";
import { useSearchParams } from "react-router";

export function BookService() {
  const [searchParams] = useSearchParams();
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [selectedSubCategory, setSelectedSubCategory] = useState<string | null>(null);
  const [selectedConfig, setSelectedConfig] = useState<string | null>(null);
  const [bookingMethod, setBookingMethod] = useState<"booksy" | "direct" | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isQuoteSubmitted, setIsQuoteSubmitted] = useState(false);

  const [availability, setAvailability] = useState<{
    bookedSlots: { date: string, time: string }[];
    blockedDays: string[];
    blockedTimes: { date: string, time: string }[];
  }>({ bookedSlots: [], blockedDays: [], blockedTimes: [] });

  useEffect(() => {
    const API_BASE = '';
    fetch(`${API_BASE}/api/availability`)
      .then(res => res.json())
      .then(setAvailability)
      .catch(console.error);
  }, []);

  // Check if returning from Stripe
  const isSuccess = searchParams.get("success") === "true";
  const isCanceled = searchParams.get("canceled") === "true";
  const returnService = searchParams.get("service");
  const returnDate = searchParams.get("date");
  const returnTime = searchParams.get("time");
  
  const customService = searchParams.get("customService");
  const customPrice = searchParams.get("customPrice");

  const [quoteData, setQuoteData] = useState({
    name: "", email: "", phone: "", year: "", make: "", model: "", notes: ""
  });

  useEffect(() => {
    if (customService && customPrice) {
      setTimeout(() => {
        document.getElementById('step-4')?.scrollIntoView({ behavior: 'smooth' });
      }, 500);
    }
  }, [customService, customPrice]);

  const services = [
    { id: "tinting", title: "WINDOW TINTING", desc: "Vehicle, Commercial & Residential Services" },
    { id: "vinyl", title: "VINYL WORK", desc: "Custom Headlight & Accents" },
    { id: "detailing", title: "AUTO DETAILING", desc: "11+ Professional Packages" },
    { id: "protection", title: "CERAMIC & PROTECTION", desc: "Long-term Shielding & PPF" },
  ];

  const subCategories: Record<string, { id: string; title: string; desc: string }[]> = {
    tinting: [
      { id: "vehicle", title: "VEHICLE TINT", desc: "Automotive Window Protection" },
      { id: "commercial", title: "COMMERCIAL", desc: "Business & Real Estate Solutions" },
      { id: "residential", title: "RESIDENTIAL", desc: "Home Window Privacy & Heat Control" },
    ],
    vinyl: [
      { id: "standard", title: "SERVICE TYPE", desc: "Select specific vinyl service" },
    ],
    detailing: [
      { id: "standard", title: "SERVICE TYPE", desc: "Select detailing or package" },
    ],
    protection: [
      { id: "standard", title: "SERVICE TYPE", desc: "Protection & Maintainance" },
    ],
  };

  const configSets: Record<string, { id: string; title: string; desc: string; time: string; price?: string; link: string }[]> = {
    "tinting-vehicle": [
      { id: "mobile", title: "MOBILE TINTING", desc: "Don't want to travel and want us to come to you⁉️", time: "4h 30min", link: "https://booksy.com/en-us/instant-experiences/widget/857294?instant_experiences_enabled=true&ig_ix=true" },
      { id: "removal", title: "TINT REMOVAL", desc: "Pricing varies on all tint removal! All depending on how many windows, how long the prior tint been on, and labor.", time: "1h", price: "Varies", link: "https://booksy.com/en-us/instant-experiences/widget/857294?instant_experiences_enabled=true&ig_ix=true" },
      { id: "one-window", title: "ONE WINDOW", desc: "Single window replacement or match service.", time: "45min", link: "https://booksy.com/en-us/instant-experiences/widget/857294?instant_experiences_enabled=true&ig_ix=true" },
      { id: "sun-strip", title: "FRONT SUN STRIP", desc: "6in Sun strip (eye brow). Not a full windshield tint.", time: "1h 30min", link: "https://booksy.com/en-us/instant-experiences/widget/857294?instant_experiences_enabled=true&ig_ix=true" },
      { id: "front-side", title: "DRIVER/PASSENGER", desc: "Front two side windows only.", time: "2h", link: "https://booksy.com/en-us/instant-experiences/widget/857294?instant_experiences_enabled=true&ig_ix=true" },
      { id: "front-wind", title: "FRONT WINDSHIELD", desc: "This is a 1 hour process.", time: "2h", link: "https://booksy.com/en-us/instant-experiences/widget/857294?instant_experiences_enabled=true&ig_ix=true" },
      { id: "back-wind", title: "BACK WINDSHIELD", desc: "Full rear windshield coverage.", time: "1h 30min", link: "https://booksy.com/en-us/instant-experiences/widget/857294?instant_experiences_enabled=true&ig_ix=true" },
      { id: "front-3", title: "FRONT 3", desc: "Driver, Passenger windows & windshield.", time: "2h", link: "https://booksy.com/en-us/instant-experiences/widget/857294?instant_experiences_enabled=true&ig_ix=true" },
      { id: "sides-only", title: "SIDE WINDOWS ONLY", desc: "Side door windows only! No front or back windshields applied with this service.", time: "1h 30min", price: "Varies", link: "https://booksy.com/en-us/instant-experiences/widget/857294?instant_experiences_enabled=true&ig_ix=true" },
      { id: "sides-back", title: "SIDE & BACK", desc: "Side windows and back windshield (No front windshield).", time: "2h", link: "https://booksy.com/en-us/instant-experiences/widget/857294?instant_experiences_enabled=true&ig_ix=true" },
      { id: "full", title: "ALL AROUND SERVICE", desc: "Including front windshield. Includes 3 year warranty.", time: "2h", price: "Varies", link: "https://booksy.com/en-us/instant-experiences/widget/857294?instant_experiences_enabled=true&ig_ix=true" },
    ],
    "tinting-commercial": [
      { id: "business", title: "BUSINESS", desc: "Custom entrance doors and partial storefront solutions.", time: "1h 30min", link: "https://booksy.com/en-us/instant-experiences/widget/857294?instant_experiences_enabled=true&ig_ix=true" },
      { id: "quote", title: "COMMERCIAL QUOTE", desc: "Storefront Decal & Window Tint Quote. Get accurate pricing for your business needs.", time: "1h", price: "Free", link: "https://booksy.com/en-us/instant-experiences/widget/857294?instant_experiences_enabled=true&ig_ix=true" },
    ],
    "tinting-residential": [
      { id: "residential-quote", title: "RESIDENTIAL QUOTE", desc: "In-home consultation for privacy and solar control. Expert measurements and film selection.", time: "1h", price: "Free", link: "https://booksy.com/en-us/instant-experiences/widget/857294?instant_experiences_enabled=true&ig_ix=true" },
    ],
    "vinyl-standard": [
      { id: "headlight", title: "HEADLIGHT TINT", desc: "Varies on size of the light and the shade preferred.", time: "2h 35min", price: "Varies", link: "https://booksy.com/en-us/instant-experiences/widget/857294?instant_experiences_enabled=true&ig_ix=true" },
      { id: "taillight", title: "TAILLIGHT TINT", desc: "Varies on size of the light and the shade preferred.", time: "2h 35min", price: "Varies", link: "https://booksy.com/en-us/instant-experiences/widget/857294?instant_experiences_enabled=true&ig_ix=true" },
      { id: "chrome", title: "CHROME DELETE", desc: "Black Vinyl Chrome delete application.", time: "2h 30min", price: "Varies", link: "https://booksy.com/en-us/instant-experiences/widget/857294?instant_experiences_enabled=true&ig_ix=true" },
    ],
    "detailing-standard": [
      { id: "premium-int", title: "PREMIUM INTERIOR", desc: "2x wipe down, Leather shine, Deep vacuum, Air filter clean.", time: "2h", link: "https://booksy.com/en-us/instant-experiences/widget/857294?instant_experiences_enabled=true&ig_ix=true" },
      { id: "foam-bath", title: "EXTERIOR FOAM BATH", desc: "No brushes! Handwash, Power Wash, Iron remover, Wax coat.", time: "45min", link: "https://booksy.com/en-us/instant-experiences/widget/857294?instant_experiences_enabled=true&ig_ix=true" },
      { id: "shampoo", title: "FULL SHAMPOO", desc: "Deep cleaning for Seats & Rugs.", time: "2h 30min", price: "$140.00+", link: "https://booksy.com/en-us/instant-experiences/widget/857294?instant_experiences_enabled=true&ig_ix=true" },
      { id: "vacuum", title: "QUICK VACUUM", desc: "Add-on service for quick cleaning of dirt and pet hair.", time: "30min", price: "$20.00+", link: "https://booksy.com/en-us/instant-experiences/widget/857294?instant_experiences_enabled=true&ig_ix=true" },
      { id: "leather", title: "LEATHER RECONDITIONED", desc: "Restore leather to its original brand new look.", time: "2h", price: "Varies", link: "https://booksy.com/en-us/instant-experiences/widget/857294?instant_experiences_enabled=true&ig_ix=true" },
      { id: "headlight-rest", title: "HEADLIGHT RESTORATION", desc: "Restore clarity to your headlights.", time: "1h 30min", link: "https://booksy.com/en-us/instant-experiences/widget/857294?instant_experiences_enabled=true&ig_ix=true" },
      { id: "bronze", title: "BRONZE PACKAGE", desc: "Professional Foam Hand Wash detailing.", time: "3h", price: "$99.99+", link: "https://booksy.com/en-us/instant-experiences/widget/857294?instant_experiences_enabled=true&ig_ix=true" },
      { id: "silver", title: "SILVER PACKAGE", desc: "Advanced detailing and exterior protection.", time: "4h", price: "$185.95+", link: "https://booksy.com/en-us/instant-experiences/widget/857294?instant_experiences_enabled=true&ig_ix=true" },
      { id: "gold", title: "GOLD PACKAGE", desc: "The ultimate detailing and showroom finish.", time: "5h", price: "$259.95+", link: "https://booksy.com/en-us/instant-experiences/widget/857294?instant_experiences_enabled=true&ig_ix=true" },
      { id: "engine", title: "ENGINE BAY CLEANING", desc: "Deep detail cleaning dedicated to your engine bay.", time: "30min", price: "$74.99", link: "https://booksy.com/en-us/instant-experiences/widget/857294?instant_experiences_enabled=true&ig_ix=true" },
      { id: "in-out", title: "COMPLIMENTARY IN/OUT", desc: "Efficient quick detail wash and wipe service.", time: "1h", price: "$75.00+", link: "https://booksy.com/en-us/instant-experiences/widget/857294?instant_experiences_enabled=true&ig_ix=true" },
    ],
    "protection-standard": [
      { id: "ceramic", title: "CERAMIC COATING", desc: "Prolong paint life and create a high-gloss shield.", time: "23h", price: "$600.00+", link: "https://booksy.com/en-us/instant-experiences/widget/857294?instant_experiences_enabled=true&ig_ix=true" },
      { id: "comp-int", title: "COMP INTERIOR DETAIL", desc: "Complimentary interior touch-up service.", time: "30min", price: "Free", link: "https://booksy.com/en-us/instant-experiences/widget/857294?instant_experiences_enabled=true&ig_ix=true" },
      { id: "ppf-windshield", title: "FRONT WINDSHIELD SCREEN", desc: "Windshield screen protector to avoid chips and cracks.", time: "2h", link: "https://booksy.com/en-us/instant-experiences/widget/857294?instant_experiences_enabled=true&ig_ix=true" },
    ],
  };

  // ─── Handlers ───
  const handleServiceSelect = (id: string) => {
    setSelectedService(id);
    setSelectedSubCategory(null);
    setSelectedConfig(null);
    setBookingMethod(null);
    setIsQuoteSubmitted(false);
    setSelectedDate(undefined);
    setSelectedTime(null);
  };

  const handleSubCategorySelect = (id: string) => {
    setSelectedSubCategory(id);
    setSelectedConfig(null);
    setBookingMethod(null);
    setIsQuoteSubmitted(false);
    setSelectedDate(undefined);
    setSelectedTime(null);
  };

  const handleConfigSelect = (id: string) => {
    setSelectedConfig(id);
    setBookingMethod(null);
    setIsQuoteSubmitted(false);
    setSelectedDate(undefined);
    setSelectedTime(null);
    setTimeout(() => {
      document.getElementById('step-4')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const isTimeUnavailable = (timeStr: string) => {
    if (!selectedDate) return false;
    const formattedDate = format(selectedDate, 'MMMM do, yyyy');
    const isBooked = availability.bookedSlots.some(b => b.date === formattedDate && b.time === timeStr);
    const isBlocked = availability.blockedTimes.some(b => b.date === formattedDate && b.time === timeStr);
    return isBooked || isBlocked;
  };

  const generateTimeSlots = (date: Date) => {
    const slots = [];
    if (isSunday(date)) return [];
    const startHour = isSaturday(date) ? 7 : 10;
    const endHour = isSaturday(date) ? 12 : 17;
    for (let h = startHour; h <= endHour; h++) {
      const displayHour = h > 12 ? h - 12 : h;
      const ampm = h >= 12 ? 'PM' : 'AM';
      slots.push(`${displayHour}:00 ${ampm}`);
      if (h !== endHour) slots.push(`${displayHour}:30 ${ampm}`);
    }
    return slots;
  };

  const handleQuoteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    try {
      const API_BASE = '';
      await fetch(`${API_BASE}/api/quotes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...quoteData, service: currentConfig?.title || selectedSubCategory || "Custom Quote" })
      });
      setIsQuoteSubmitted(true);
    } catch {
      console.error("Quote submit failed");
    } finally {
      setIsProcessing(false);
    }
  };

  // ─── Computed ───
  const currentConfigs = (selectedService && selectedSubCategory)
    ? configSets[`${selectedService}-${selectedSubCategory}`]
    : [];
  const currentConfig = currentConfigs.find(c => c.id === selectedConfig);
  const isVariablePrice = currentConfig && (
    !currentConfig.price ||
    currentConfig.price === "Varies" ||
    (!currentConfig.price.includes("$") && currentConfig.price !== "Free")
  );
  const canShowBookingChoice = (!!selectedConfig && !isVariablePrice) || !!customService;
  const canShowQuoteForm = !!selectedConfig && isVariablePrice && !isQuoteSubmitted && !customService;

  // ─── Pay with Stripe ───
  const handlePay = async () => {
    if ((!currentConfig && !customService) || !selectedDate || !selectedTime) return;
    setIsProcessing(true);
    try {
      await handleStripeCheckout({
        service: customService || currentConfig?.title || "Custom Service",
        price: customPrice ? customPrice : (currentConfig?.price || "0"),
        date: format(selectedDate, 'MMMM do, yyyy'),
        time: selectedTime,
      });
    } catch {
      setIsProcessing(false);
    }
  };

  // ─── Pay with Venmo/CashApp (logs to admin) ───
  const handleManualPay = async (method: string, link: string) => {
    if ((!currentConfig && !customService) || !selectedDate || !selectedTime) return;
    await logManualBooking({
      service: customService || currentConfig?.title || "Custom Service",
      price: customPrice ? `$${customPrice}` : (currentConfig?.price || "N/A"),
      date: format(selectedDate, 'MMMM do, yyyy'),
      time: selectedTime,
      method,
    });
    window.open(link, '_blank');
  };

  // ─── If returning from successful Stripe payment ───
  if (isSuccess) {
    return (
      <div className="w-full min-h-screen text-foreground pt-12 pb-24 font-sans camo-page">
        <div className="max-w-2xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-12 border border-yellow-400/20 camo-surface text-center relative overflow-hidden mt-16"
          >
            <div className="absolute top-0 right-0 p-4 opacity-5">
              <LucideCalendar className="w-32 h-32" />
            </div>

            <div className="inline-flex items-center justify-center w-20 h-20 bg-yellow-400 mb-8 -skew-x-12">
              <Check className="w-10 h-10 text-black" />
            </div>

            <h3 className="text-4xl font-black uppercase tracking-tighter mb-4 italic text-yellow-400">
              Payment Confirmed!
            </h3>
            <p className="text-zinc-500 font-bold tracking-widest uppercase text-[10px] mb-12">
              Your booking has been received and logged.
            </p>

            <div className="max-w-md mx-auto p-10 camo-surface border border-white/10 text-left space-y-6 relative z-10">
              <div className="space-y-4">
                <p className="text-[9px] font-black text-zinc-600 uppercase tracking-[0.3em] border-b border-zinc-900 pb-2">
                  Appointment Details
                </p>
                {returnService && (
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-medium text-zinc-500 uppercase tracking-widest">Service</span>
                    <span className="text-[11px] font-black uppercase tracking-tighter text-yellow-400">{decodeURIComponent(returnService)}</span>
                  </div>
                )}
                {returnDate && (
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-medium text-zinc-500 uppercase tracking-widest">Date</span>
                    <span className="text-[11px] font-black uppercase tracking-tighter text-white">{decodeURIComponent(returnDate)}</span>
                  </div>
                )}
                {returnTime && (
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-medium text-zinc-500 uppercase tracking-widest">Time</span>
                    <span className="text-[11px] font-black uppercase tracking-tighter text-white">{decodeURIComponent(returnTime)}</span>
                  </div>
                )}
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-medium text-zinc-500 uppercase tracking-widest">Status</span>
                  <span className="text-[11px] font-black uppercase tracking-tighter text-green-400">PAID ✓</span>
                </div>
              </div>

              <div className="pt-6 border-t border-zinc-900">
                <p className="text-[10px] font-black text-white uppercase tracking-widest mb-4 flex items-center gap-2">
                  <ReceiptText className="w-3 h-3 text-yellow-400" /> Confirmation
                </p>
                <p className="text-[10px] text-zinc-500 leading-relaxed font-medium uppercase tracking-widest italic">
                  A receipt has been sent to your email. We look forward to seeing you!
                </p>
              </div>
            </div>

            <div className="mt-12 flex flex-col md:flex-row gap-4 justify-center">
              <Button onClick={() => window.location.href = "/book-service"} className="bg-white text-black hover:bg-yellow-400 font-black px-10 py-6 rounded-none tracking-widest uppercase transition-all">
                Book Another Service
              </Button>
              <Button onClick={() => window.location.href = "/"} variant="outline" className="border-zinc-800 text-zinc-400 rounded-none tracking-widest font-black uppercase py-6 px-10 hover:border-white hover:text-white transition-all">
                Return Home
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen text-foreground pt-12 pb-24 font-sans camo-page">
      <div className="max-w-4xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-6xl font-black mb-4 uppercase tracking-tighter italic"
          >
            Your <span className="text-yellow-400">Top</span> Shop
          </motion.h1>
          <div className="flex items-center justify-center gap-4 mb-2 text-zinc-800">
            <span className="h-px w-12 bg-current" />
            <p className="text-gray-400 font-bold tracking-[0.3em] uppercase text-[10px]">Premium Automotive Solutions</p>
            <span className="h-px w-12 bg-current" />
          </div>
          {isCanceled && (
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-4 text-red-400 text-xs font-bold uppercase tracking-widest">
              Payment was canceled. You can try again below.
            </motion.p>
          )}
        </div>

        <div className="space-y-32">
          {/* ─── STEP 1: Select Service ─── */}
          <section>
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-xl font-black flex items-center gap-3 italic">
                <span className="w-10 h-10 bg-yellow-400 rounded-none flex items-center justify-center text-xs text-black font-black -skew-x-12">01</span>
                SELECT MAIN SERVICE
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
              {services.map((service) => (
                <button
                  key={service.id}
                  onClick={() => handleServiceSelect(service.id)}
                  className={`p-6 border rounded-none text-left transition-all relative overflow-hidden group ${
                    selectedService === service.id
                      ? "border-yellow-400 bg-yellow-400/5 shadow-[0_0_30px_rgba(250,204,21,0.05)]"
                      : "border-white/10 camo-surface hover:border-zinc-700"
                  } transition-all`}
                >
                  <div className={`absolute top-0 left-0 w-1 h-full bg-yellow-400 transition-transform duration-300 ${selectedService === service.id ? "scale-y-100" : "scale-y-0"}`} />
                  <h3 className="font-black mb-2 tracking-widest leading-none text-[10px] uppercase group-hover:text-yellow-400 transition-colors">{service.title}</h3>
                  <p className="text-[9px] text-gray-500 font-medium uppercase tracking-tighter leading-tight">{service.desc}</p>
                </button>
              ))}
            </div>
          </section>

          {/* ─── STEP 2: Category ─── */}
          {selectedService && (
            <motion.section initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-xl font-black flex items-center gap-3 italic">
                  <span className="w-10 h-10 bg-yellow-400 rounded-none flex items-center justify-center text-xs text-black font-black -skew-x-12">02</span>
                  CHOOSE CATEGORY
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {subCategories[selectedService]?.map((sub) => (
                  <button
                    key={sub.id}
                    onClick={() => handleSubCategorySelect(sub.id)}
                    className={`p-8 border rounded-none text-left transition-all relative group ${
                      selectedSubCategory === sub.id
                        ? "border-yellow-400 bg-yellow-400/5 shadow-[0_0_30px_rgba(250,204,21,0.05)]"
                        : "border-white/10 bg-[#252a32] hover:border-zinc-700"
                    }`}
                  >
                    <h3 className="font-black mb-2 tracking-widest leading-none text-[11px] uppercase group-hover:text-yellow-400">{sub.title}</h3>
                    <p className="text-[10px] text-gray-500 font-medium uppercase tracking-widest">{sub.desc}</p>
                  </button>
                ))}
              </div>
            </motion.section>
          )}

          {/* ─── STEP 3: Specific Service ─── */}
          {selectedSubCategory && (
            <motion.section initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-xl font-black flex items-center gap-3 italic">
                  <span className="w-10 h-10 bg-yellow-400 rounded-none flex items-center justify-center text-xs text-black font-black -skew-x-12">03</span>
                  SELECT SPECIFIC SERVICE
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {currentConfigs.map((config) => (
                  <button
                    key={config.id}
                    onClick={() => handleConfigSelect(config.id)}
                    className={`p-6 border rounded-none text-left transition-all relative group ${
                      selectedConfig === config.id
                        ? "border-yellow-400 bg-yellow-400/5 shadow-[0_0_30px_rgba(250,204,21,0.1)]"
                        : "border-white/10 bg-[#252a32] hover:border-zinc-700"
                    }`}
                  >
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="font-black tracking-widest leading-none text-[11px] uppercase group-hover:text-yellow-400 transition-colors w-2/3">{config.title}</h3>
                      <div className="flex flex-col items-end gap-1">
                        <div className="flex items-center gap-1.5 px-2 py-1 bg-[#2a3038] border border-white/10">
                          <Clock className="w-3 h-3 text-yellow-400" />
                          <span className="text-[9px] text-zinc-100 font-black tracking-tight">{config.time}</span>
                        </div>
                        {config.price && <span className="text-[10px] text-yellow-400/80 font-black tracking-tighter italic">{config.price}</span>}
                      </div>
                    </div>
                    <p className="text-[10px] text-gray-500 font-medium leading-relaxed group-hover:text-gray-300">{config.desc}</p>
                  </button>
                ))}
              </div>
            </motion.section>
          )}

          {/* ─── STEP 4: Fixed-Price → Calendar + Pay ─── */}
          {canShowBookingChoice && (
            <motion.section id="step-4" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }}>
              <h2 className="text-xl font-black mb-8 flex items-center gap-3 italic">
                <span className="w-10 h-10 bg-yellow-400 rounded-none flex items-center justify-center text-xs text-black font-black -skew-x-12">04</span>
                SCHEDULE & PAY
              </h2>

              {/* Service Summary */}
              <div className="bg-yellow-400 p-8 -skew-x-2 shadow-[0_20px_50px_rgba(250,204,21,0.1)] mb-10">
                <div className="flex items-center justify-center gap-10">
                  <div className="text-left">
                    <p className="text-[10px] font-black text-black/40 uppercase tracking-widest leading-none mb-1">Service</p>
                    <p className="text-xl font-black text-black uppercase tracking-tighter">{customService || currentConfig?.title}</p>
                  </div>
                  <div className="w-px h-12 bg-white/10" />
                  <div className="text-left">
                    <p className="text-[10px] font-black text-black/40 uppercase tracking-widest leading-none mb-1">Total</p>
                    <p className="text-2xl font-black text-black">{customPrice ? `$${customPrice}` : (currentConfig?.price || "—")}</p>
                  </div>
                  <div className="w-px h-12 bg-white/10" />
                  <div className="text-left">
                    <p className="text-[10px] font-black text-black/40 uppercase tracking-widest leading-none mb-1">Duration</p>
                    <p className="text-xl font-black text-black uppercase italic">{customService ? "Custom" : currentConfig?.time}</p>
                  </div>
                </div>
              </div>

              {/* Calendar + Time Picker */}
              <div className="p-6 md:p-12 border border-white/10 camo-surface rounded-none overflow-hidden">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-5xl mx-auto">
                  {/* Left: Calendar */}
                  <div className="space-y-6">
                    <div className="flex items-center gap-3 mb-6">
                      <LucideCalendar className="w-5 h-5 text-yellow-400" />
                      <h4 className="text-xs font-black tracking-[0.4em] uppercase text-zinc-400">Select Date</h4>
                    </div>
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={(date) => { setSelectedDate(date); setSelectedTime(null); }}
                      disabled={(date) => isSunday(date) || date < startOfToday() || availability.blockedDays.includes(format(date, 'MMMM do, yyyy'))}
                      className="bg-input-background border border-white/10 mx-auto"
                    />
                    <div className="p-4 bg-[#2a3038]/50 border border-white/10">
                      <p className="text-[9px] font-bold text-zinc-500 uppercase flex justify-between">
                        <span>Business Hours</span>
                        <span>{selectedDate && isSaturday(selectedDate) ? "7AM - 12PM" : "10AM - 5PM"}</span>
                      </p>
                    </div>
                  </div>

                  {/* Right: Time Slots */}
                  <div className="space-y-6">
                    <div className="flex items-center gap-3 mb-6">
                      <Clock className="w-5 h-5 text-yellow-400" />
                      <h4 className="text-xs font-black tracking-[0.4em] uppercase text-zinc-400">Select Time</h4>
                    </div>
                    <div className="grid grid-cols-2 gap-2 h-[340px] overflow-y-auto pr-2">
                      {selectedDate ? (
                        generateTimeSlots(selectedDate).map((time) => {
                          const unavailable = isTimeUnavailable(time);
                          return (
                          <button
                            key={time}
                            disabled={unavailable}
                            onClick={() => setSelectedTime(time)}
                            className={`py-4 border text-[10px] font-black tracking-widest transition-all ${
                              unavailable
                                ? "opacity-30 cursor-not-allowed border-red-900/50 bg-input-background text-red-500/60"
                                : selectedTime === time
                                ? "border-yellow-400 bg-yellow-400 text-black"
                                : "border-white/10 bg-input-background text-zinc-300 hover:border-white/20 hover:text-white"
                            }`}
                          >
                            {unavailable ? "BOOKED" : time}
                          </button>
                        )})
                      ) : (
                        <div className="col-span-2 h-full flex items-center justify-center border border-dashed border-white/10 text-zinc-500 font-bold uppercase text-[10px] tracking-widest text-center px-12">
                          Please select a date to view availability
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Buttons — only show after date + time selected */}
              {selectedDate && selectedTime && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mt-10 space-y-6">
                  <h4 className="text-[10px] font-black tracking-[0.4em] uppercase text-center text-yellow-400">
                    Choose Payment Method
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto">
                    {/* Stripe */}
                    <button
                      onClick={handlePay}
                      disabled={isProcessing}
                      className="p-6 border border-white/10 bg-input-background flex flex-col items-center justify-center gap-3 text-[10px] font-black text-zinc-300 transition-all uppercase tracking-[0.2em] group hover:border-yellow-400 hover:text-yellow-400 disabled:opacity-50"
                    >
                      <CreditCard className="w-5 h-5 opacity-20 group-hover:opacity-100 transition-opacity" />
                      {isProcessing ? "REDIRECTING..." : "PAY WITH CARD"}
                    </button>
                    {/* Venmo */}
                    <button
                      onClick={() => handleManualPay("venmo", "https://venmo.com/ytsautocare123")}
                      className="p-6 border border-white/10 bg-input-background flex flex-col items-center justify-center gap-3 text-[10px] font-black text-zinc-300 transition-all uppercase tracking-[0.2em] group hover:border-blue-500 hover:text-blue-500"
                    >
                      <ExternalLink className="w-5 h-5 opacity-20 group-hover:opacity-100 transition-opacity" />
                      VENMO
                    </button>
                    {/* CashApp */}
                    <button
                      onClick={() => handleManualPay("cashapp", "https://cash.app/$YourTopShop123")}
                      className="p-6 border border-white/10 bg-input-background flex flex-col items-center justify-center gap-3 text-[10px] font-black text-zinc-300 transition-all uppercase tracking-[0.2em] group hover:border-green-500 hover:text-green-500"
                    >
                      <ExternalLink className="w-5 h-5 opacity-20 group-hover:opacity-100 transition-opacity" />
                      CASHAPP
                    </button>
                  </div>
                  <p className="text-[9px] text-zinc-600 font-bold uppercase tracking-[0.3em] text-center italic">
                    {selectedDate && format(selectedDate, 'MMMM do, yyyy')} at {selectedTime} — {currentConfig?.price}
                  </p>
                </motion.div>
              )}

              {/* Also show Booksy link as alternative */}
              <div className="mt-8 text-center">
                <a
                  href={currentConfig?.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[9px] text-zinc-600 hover:text-yellow-400 font-bold uppercase tracking-[0.3em] transition-colors inline-flex items-center gap-2"
                >
                  <LucideCalendar className="w-3 h-3" />
                  Or book via Booksy instead →
                </a>
              </div>
            </motion.section>
          )}

          {/* ─── STEP 4 ALT: Variable-Price → Quote Form ─── */}
          {canShowQuoteForm && (
            <motion.section id="step-4" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <h2 className="text-xl font-black mb-8 flex items-center gap-3 italic text-yellow-400">
                <span className="w-10 h-10 bg-yellow-400 rounded-none flex items-center justify-center text-xs text-black font-black -skew-x-12">04</span>
                REQUEST A CUSTOM QUOTE
              </h2>
              <div className="p-12 border border-white/10 camo-surface">
                <form onSubmit={handleQuoteSubmit} className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-zinc-600">Full Name</label>
                      <input required type="text" value={quoteData.name} onChange={(e) => setQuoteData({...quoteData, name: e.target.value})} className="w-full bg-input-background border border-white/10 p-4 text-[11px] font-black tracking-widest focus:border-yellow-400 outline-none uppercase" placeholder="JOHN DOE" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-zinc-600">Email Address</label>
                      <input required type="email" value={quoteData.email} onChange={(e) => setQuoteData({...quoteData, email: e.target.value})} className="w-full bg-input-background border border-white/10 p-4 text-[11px] font-black tracking-widest focus:border-yellow-400 outline-none" placeholder="JOHN@EXAMPLE.COM" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-zinc-600">Phone Number</label>
                      <input required type="tel" value={quoteData.phone} onChange={(e) => setQuoteData({...quoteData, phone: e.target.value})} className="w-full bg-input-background border border-white/10 p-4 text-[11px] font-black tracking-widest focus:border-yellow-400 outline-none" placeholder="(401) 000-0000" />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-zinc-600">Vehicle Year</label>
                      <input required type="text" value={quoteData.year} onChange={(e) => setQuoteData({...quoteData, year: e.target.value})} className="w-full bg-input-background border border-white/10 p-4 text-[11px] font-black tracking-widest focus:border-yellow-400 outline-none uppercase" placeholder="2024" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-zinc-600">Make</label>
                      <input required type="text" value={quoteData.make} onChange={(e) => setQuoteData({...quoteData, make: e.target.value})} className="w-full bg-input-background border border-white/10 p-4 text-[11px] font-black tracking-widest focus:border-yellow-400 outline-none uppercase" placeholder="TESLA" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-zinc-600">Model</label>
                      <input required type="text" value={quoteData.model} onChange={(e) => setQuoteData({...quoteData, model: e.target.value})} className="w-full bg-input-background border border-white/10 p-4 text-[11px] font-black tracking-widest focus:border-yellow-400 outline-none uppercase" placeholder="MODEL S" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-600">Project Specifics</label>
                    <textarea value={quoteData.notes} onChange={(e) => setQuoteData({...quoteData, notes: e.target.value})} className="w-full bg-input-background border border-white/10 p-4 text-[11px] font-black tracking-widest focus:border-yellow-400 outline-none min-h-[120px] uppercase" placeholder="DESCRIBE YOUR REQUEST..." />
                  </div>
                  <Button type="submit" className="w-full bg-yellow-400 text-black hover:bg-yellow-500 font-black py-8 rounded-none tracking-[0.3em] uppercase text-lg shadow-2xl">
                    Send Quote Request
                  </Button>
                </form>
              </div>
            </motion.section>
          )}

          {/* ─── Quote Submitted Success ─── */}
          {isQuoteSubmitted && (
            <motion.section initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="pt-24 text-center">
              <div className="inline-flex items-center justify-center w-24 h-24 bg-yellow-400 mb-8 -skew-x-12">
                <Check className="w-12 h-12 text-black" />
              </div>
              <h3 className="text-5xl font-black uppercase tracking-tighter mb-4 italic">Quote Request Sent</h3>
              <p className="text-gray-500 font-bold tracking-widest uppercase text-xs mb-12">We will review your vehicle details and contact you within 24 business hours.</p>
              <div className="max-w-md mx-auto p-10 bg-[#252a32] border border-white/10 text-left space-y-4">
                <div className="flex justify-between text-[10px] font-black tracking-widest uppercase">
                  <span className="text-zinc-600">Client</span>
                  <span>{quoteData.name}</span>
                </div>
                <div className="flex justify-between text-[10px] font-black tracking-widest uppercase">
                  <span className="text-zinc-600">Vehicle</span>
                  <span>{quoteData.year} {quoteData.make} {quoteData.model}</span>
                </div>
                <div className="flex justify-between text-[10px] font-black tracking-widest uppercase">
                  <span className="text-zinc-600">Service</span>
                  <span>{currentConfig?.title}</span>
                </div>
              </div>
              <Button onClick={() => handleServiceSelect(selectedService || "")} variant="outline" className="mt-16 border-zinc-800 text-zinc-500 rounded-none tracking-widest font-black uppercase py-8 px-12 hover:border-yellow-400 hover:text-yellow-400">
                Return to services
              </Button>
            </motion.section>
          )}
        </div>
      </div>
    </div>
  );
}
