import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Lock, RefreshCw, Calendar, Check, Clock, DollarSign, Mail } from "lucide-react";
import { format } from "date-fns";
import { Button } from "../components/ui/button";

interface Booking {
  id: string;
  customerEmail: string;
  customerName: string;
  service: string;
  date: string;
  time: string;
  price: string;
  paymentStatus: string;
  createdAt: string;
  stripePaymentId: string | null;
}

const API_BASE = '';

export function Admin() {
  const [pin, setPin] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [inquiries, setInquiries] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [lastRefreshed, setLastRefreshed] = useState<Date | null>(null);

  const [blocks, setBlocks] = useState<{ dates: string[], times: {date: string, time: string}[] }>({ dates: [], times: [] });
  const [quotes, setQuotes] = useState<any[]>([]);
  const [blockDate, setBlockDate] = useState("");
  const [blockTime, setBlockTime] = useState("");
  const [blockEndTime, setBlockEndTime] = useState("");

  const fetchBookings = async (adminPin: string) => {
    setIsLoading(true);
    setError("");
    try {
      const res = await fetch(`${API_BASE}/api/bookings`, {
        headers: { "x-admin-pin": adminPin },
      });
      if (res.status === 401) {
        setError("Invalid PIN");
        setIsAuthenticated(false);
        return;
      }
      const data = await res.json();
      setBookings(data);
      
      const bRes = await fetch(`${API_BASE}/api/admin/blocks`, { headers: { "x-admin-pin": adminPin }});
      if (bRes.ok) setBlocks(await bRes.json());

      const qRes = await fetch(`${API_BASE}/api/admin/quotes`, { headers: { "x-admin-pin": adminPin }});
      if (qRes.ok) setQuotes(await qRes.json());

      const iRes = await fetch(`${API_BASE}/api/admin/inquiries`, { headers: { "x-admin-pin": adminPin }});
      if (iRes.ok) setInquiries(await iRes.json());

      setLastRefreshed(new Date());
    } catch {
      setError("Cannot connect to server. Make sure the backend is running.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuoteStatus = async (id: string, status: string) => {
    await fetch(`${API_BASE}/api/admin/quotes/status`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-admin-pin": pin },
      body: JSON.stringify({ id, status })
    });
    fetchBookings(pin);
  };

  const generateQuoteLink = (quote: any) => {
    const priceStr = prompt("Set a custom price for this quote (digits only, e.g. 500):", "");
    if (!priceStr) return;
    const price = parseInt(priceStr.replace(/[^0-9]/g, ""), 10);
    if (isNaN(price)) return alert("Invalid price.");

    handleQuoteStatus(quote.id, "replied");

    const link = `${window.location.origin}/book-service?customService=${encodeURIComponent(quote.service || "Custom Quote")}&customPrice=${price}`;
    const subject = encodeURIComponent("Your Top Shop Custom Quote");
    const body = encodeURIComponent(`Hi ${quote.name},\n\nWe received your request for: ${quote.service || "Custom Quote"} (${quote.year} ${quote.make} ${quote.model}).\n\nYour custom price is $${price}.\n\nYou can schedule your appointment and securely pay here:\n${link}\n\nThanks,\nYour Top Shop`);
    
    window.location.href = `mailto:${quote.email}?subject=${subject}&body=${body}`;
  };

  const cancelBooking = async (id: string) => {
    if (!confirm("Are you sure you want to cancel this booking?")) return;
    await fetch(`${API_BASE}/api/admin/cancel-booking`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-admin-pin": pin },
      body: JSON.stringify({ id })
    });
    fetchBookings(pin);
  };

  const downloadBookingsCSV = () => {
    if (bookings.length === 0) return alert("No bookings to export.");
    
    const headers = ["ID", "Customer Name", "Email", "Service", "Date", "Time", "Price", "Method", "Stripe ID", "Created At"];
    const rows = bookings.map(b => [
      b.id,
      b.customerName,
      b.customerEmail,
      b.service,
      b.date,
      b.time,
      b.price,
      (b as any).method || "Stripe",
      b.stripePaymentId || "N/A",
      b.createdAt
    ]);

    const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `bookings_export_${format(new Date(), 'yyyy-MM-dd')}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const addBlock = async (isDateOnly: boolean) => {
    if (!blockDate) return;
    
    const parsedDate = new Date(blockDate + "T12:00:00");
    const formattedDate = format(parsedDate, 'MMMM do, yyyy');

    const formatTime = (timeStr: string) => {
      const [hourStr, minuteStr] = timeStr.split(":");
      const hour = parseInt(hourStr, 10);
      const ampm = hour >= 12 ? 'PM' : 'AM';
      const displayHour = hour > 12 ? hour - 12 : (hour === 0 ? 12 : hour);
      return `${displayHour}:${minuteStr} ${ampm}`;
    };

    if (isDateOnly) {
      await fetch(`${API_BASE}/api/admin/blocks`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-admin-pin": pin },
        body: JSON.stringify({ date: formattedDate, time: null })
      });
    } else {
      // Handle range or single time
      const startTimeMinutes = parseInt(blockTime.split(":")[0]) * 60 + parseInt(blockTime.split(":")[1]);
      const endTimeMinutes = blockEndTime 
        ? parseInt(blockEndTime.split(":")[0]) * 60 + parseInt(blockEndTime.split(":")[1])
        : startTimeMinutes;

      for (let m = startTimeMinutes; m <= endTimeMinutes; m += 30) {
        const h = Math.floor(m / 60);
        const mm = m % 60;
        const timeStr = `${h.toString().padStart(2, '0')}:${mm.toString().padStart(2, '0')}`;
        const formattedTime = formatTime(timeStr);

        await fetch(`${API_BASE}/api/admin/blocks`, {
          method: "POST",
          headers: { "Content-Type": "application/json", "x-admin-pin": pin },
          body: JSON.stringify({ date: formattedDate, time: formattedTime })
        });
      }
    }
    
    setBlockDate("");
    setBlockTime("");
    setBlockEndTime("");
    fetchBookings(pin);
  };

  const removeBlock = async (date: string, time?: string) => {
    await fetch(`${API_BASE}/api/admin/remove-block`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-admin-pin": pin },
      body: JSON.stringify({ date, time: time || null })
    });
    fetchBookings(pin);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsAuthenticated(true);
    fetchBookings(pin);
  };

  // Auto-refresh every 30s
  useEffect(() => {
    if (!isAuthenticated) return;
    const interval = setInterval(() => fetchBookings(pin), 30000);
    return () => clearInterval(interval);
  }, [isAuthenticated, pin]);

  if (!isAuthenticated) {
    return (
      <div className="w-full min-h-screen text-foreground flex items-center justify-center camo-page">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-sm p-12 border border-white/10 camo-surface"
        >
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-yellow-400 mb-6 -skew-x-12">
              <Lock className="w-8 h-8 text-black" />
            </div>
            <h1 className="text-2xl font-black uppercase tracking-tighter italic">Admin Portal</h1>
            <p className="text-[10px] text-zinc-600 font-bold uppercase tracking-widest mt-2">Your Top Shop</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-zinc-600">Enter PIN</label>
              <input
                type="password"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                placeholder="••••"
                className="w-full bg-black border border-zinc-900 p-4 text-center text-2xl font-black tracking-[1em] focus:border-yellow-400 outline-none"
                autoFocus
              />
            </div>
            {error && <p className="text-red-400 text-[10px] font-bold uppercase tracking-widest text-center">{error}</p>}
            <Button type="submit" className="w-full bg-yellow-400 text-black hover:bg-yellow-500 font-black py-6 rounded-none tracking-[0.3em] uppercase">
              Unlock
            </Button>
          </form>
        </motion.div>
      </div>
    );
  }

  const paidBookings = bookings.filter(b => b.paymentStatus === "paid");
  const pendingBookings = bookings.filter(b => b.paymentStatus !== "paid");

  return (
    <div className="w-full min-h-screen text-foreground pt-8 pb-24 camo-page">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row gap-6 md:items-center justify-between mb-12 border-b border-zinc-900 pb-8">
          <div>
            <h1 className="text-3xl font-black uppercase tracking-tighter italic">
              Admin <span className="text-yellow-400">Portal</span>
            </h1>
            <p className="text-[10px] text-zinc-600 font-bold uppercase tracking-widest mt-1">
              {lastRefreshed && `Last updated: ${lastRefreshed.toLocaleTimeString()}`}
            </p>
          </div>
          <div className="flex gap-3">
             <Button onClick={() => fetchBookings(pin)} disabled={isLoading} variant="outline" className="border-zinc-800 p-3 hover:border-yellow-400 transition-colors">
               <RefreshCw className={`w-4 h-4 text-zinc-500 ${isLoading ? 'animate-spin' : ''}`} />
             </Button>
             <Button onClick={downloadBookingsCSV} variant="outline" className="border-zinc-800 text-zinc-400 px-6 py-2 text-[10px] rounded-none uppercase font-black hover:text-white">Export CSV</Button>
             <a href="https://dashboard.stripe.com" target="_blank" rel="noreferrer">
               <Button variant="outline" className="border-zinc-800 text-[#635BFF] border-[#635BFF]/20 px-6 py-2 text-[10px] rounded-none uppercase font-black hover:bg-[#635BFF] hover:text-white transition-all">Stripe Dashboard</Button>
             </a>
             <Button onClick={() => { setIsAuthenticated(false); setPin(""); }} variant="outline" className="border-zinc-800 text-zinc-500 rounded-none tracking-widest font-black uppercase text-[10px] py-3 px-6 hover:border-red-500 hover:text-red-500">
               Logout
             </Button>
          </div>
        </div>

        {error && (
          <div className="mb-8 p-6 border border-red-500/20 bg-red-500/5 text-center">
            <p className="text-red-400 text-xs font-bold uppercase tracking-widest">{error}</p>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
          <div className="p-6 border border-zinc-900 bg-zinc-950">
            <p className="text-[9px] font-black text-zinc-600 uppercase tracking-widest mb-2">Total Bookings</p>
            <p className="text-3xl font-black text-yellow-400">{bookings.length}</p>
          </div>
          <div className="p-6 border border-zinc-900 bg-zinc-950">
            <p className="text-[9px] font-black text-zinc-600 uppercase tracking-widest mb-2">Paid (Stripe)</p>
            <p className="text-3xl font-black text-green-400">{paidBookings.length}</p>
          </div>
          <div className="p-6 border border-zinc-900 bg-zinc-950">
            <p className="text-[9px] font-black text-zinc-600 uppercase tracking-widest mb-2">Pending (Manual)</p>
            <p className="text-3xl font-black text-blue-400">{pendingBookings.length}</p>
          </div>
        </div>

        {/* Schedule Management */}
        <div className="border border-zinc-900 mb-12">
          <div className="p-6 border-b border-zinc-900 bg-zinc-950/50 flex flex-col md:flex-row justify-between items-center gap-4">
            <h2 className="text-sm font-black uppercase tracking-widest">Schedule Management</h2>
            <div className="flex gap-2 items-center">
              <input type="date" value={blockDate} onChange={e => setBlockDate(e.target.value)} className="bg-black border border-zinc-900 p-2 text-xs w-36 text-zinc-400 focus:text-white" style={{colorScheme: "dark"}} />
              <div className="flex items-center bg-black border border-zinc-900 px-2 gap-1">
                <input type="time" value={blockTime} onChange={e => setBlockTime(e.target.value)} className="bg-transparent p-2 text-xs w-28 text-zinc-400 focus:text-white" style={{colorScheme: "dark"}} />
                <span className="text-zinc-700 text-[10px]">TO</span>
                <input type="time" value={blockEndTime} onChange={e => setBlockEndTime(e.target.value)} className="bg-transparent p-2 text-xs w-28 text-zinc-400 focus:text-white" style={{colorScheme: "dark"}} />
              </div>
              <Button onClick={() => addBlock(false)} disabled={!blockDate || !blockTime} className="bg-yellow-400 text-black px-4 py-2 text-[10px] rounded-none uppercase font-black">Block Range</Button>
              <Button onClick={() => addBlock(true)} disabled={!blockDate} className="bg-red-500 text-white px-4 py-2 text-[10px] rounded-none uppercase font-black">Block Day</Button>
            </div>
          </div>
          <div className="p-6 divide-y divide-zinc-900">
            {blocks.dates.length === 0 && blocks.times.length === 0 && <p className="text-xs text-zinc-600 uppercase tracking-widest text-center py-4">No schedule blocks active</p>}
            {blocks.dates.map(d => (
              <div key={d} className="py-2 flex justify-between items-center text-xs">
                <span className="text-red-400 uppercase tracking-widest font-bold">Entire Day Blocked: {d}</span>
                <button onClick={() => removeBlock(d)} className="text-zinc-500 hover:text-white uppercase text-[9px] tracking-widest border border-zinc-900 px-3 py-1">Remove</button>
              </div>
            ))}
            {blocks.times.map(t => (
              <div key={t.date + t.time} className="py-2 flex justify-between items-center text-xs">
                <span className="text-yellow-400 uppercase tracking-widest font-bold">Blocked Time: {t.date} at {t.time}</span>
                <button onClick={() => removeBlock(t.date, t.time)} className="text-zinc-500 hover:text-white uppercase text-[9px] tracking-widest border border-zinc-900 px-3 py-1">Remove</button>
              </div>
            ))}
          </div>
        </div>

        {/* Quote Requests */}
        <div className="border border-zinc-900 mb-12">
          <div className="p-6 border-b border-zinc-900 bg-zinc-950/50">
            <h2 className="text-sm font-black uppercase tracking-widest flex items-center gap-2"><Mail className="w-4 h-4 text-yellow-400"/> Quote Requests</h2>
          </div>
          {quotes.filter(q => q.status === "pending").length === 0 ? (
            <div className="p-10 text-center text-zinc-600 font-bold uppercase tracking-widest text-xs">No pending quotes</div>
          ) : (
            <div className="divide-y divide-zinc-900 focus-within:bg-zinc-900">
              {quotes.filter(q => q.status === "pending").map(quote => (
                <div key={quote.id} className="p-6">
                  <div className="flex flex-col md:flex-row justify-between gap-6">
                    <div className="flex-1 space-y-2">
                       <h3 className="text-sm font-black uppercase tracking-widest text-yellow-400">{quote.service} - {quote.year} {quote.make} {quote.model}</h3>
                       <p className="text-white text-xs">{quote.notes}</p>
                       <p className="text-[10px] text-zinc-500 font-bold uppercase">Customer: {quote.name} | {quote.email} | {quote.phone}</p>
                    </div>
                    <div className="flex flex-col gap-2 min-w-[150px]">
                      <Button onClick={() => generateQuoteLink(quote)} className="bg-yellow-400 text-black px-4 py-2 text-[10px] rounded-none uppercase font-black">Generate Pay Link</Button>
                      <Button onClick={() => handleQuoteStatus(quote.id, "archived")} variant="outline" className="border-zinc-800 text-zinc-400 px-4 py-2 text-[10px] rounded-none uppercase font-black hover:text-white">Archive</Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Bookings Table */}
        <div className="border border-zinc-900">
          <div className="p-6 border-b border-zinc-900 bg-zinc-950/50">
            <h2 className="text-sm font-black uppercase tracking-widest">All Bookings</h2>
          </div>

          {bookings.length === 0 ? (
            <div className="p-16 text-center">
              <Calendar className="w-12 h-12 text-zinc-800 mx-auto mb-4" />
              <p className="text-zinc-600 font-bold uppercase tracking-widest text-xs">No bookings yet</p>
              <p className="text-zinc-800 text-[10px] mt-2">Bookings will appear here once customers pay.</p>
            </div>
          ) : (
            <div className="divide-y divide-zinc-900">
              {bookings.map((booking) => (
                <motion.div
                  key={booking.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="p-6 hover:bg-zinc-950/80 transition-all border-b border-zinc-900 last:border-b-0 group"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="flex-1 space-y-3">
                      <div className="flex items-center gap-4">
                        <h3 className="text-sm font-black uppercase tracking-widest text-white group-hover:text-yellow-400 transition-colors">{booking.service}</h3>
                        <span className={`px-3 py-1 text-[8px] font-black uppercase tracking-[0.2em] ${
                          booking.paymentStatus === "paid"
                            ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                            : booking.paymentStatus === "canceled"
                            ? "bg-red-500/10 text-red-400 border border-red-500/20"
                            : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                        }`}>
                          {booking.paymentStatus}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-x-6 gap-y-2 text-[10px] text-zinc-500 font-bold uppercase tracking-widest">
                        <span className="flex items-center gap-2 text-zinc-400"><Calendar className="w-3.5 h-3.5 text-yellow-500" />{booking.date}</span>
                        <span className="flex items-center gap-2 text-zinc-400"><Clock className="w-3.5 h-3.5 text-yellow-500" />{booking.time}</span>
                        <span className="flex items-center gap-2 text-white bg-zinc-900 px-2 py-0.5"><DollarSign className="w-3.5 h-3.5 text-yellow-500" />{booking.price}</span>
                        <span className="flex items-center gap-2"><Mail className="w-3.5 h-3.5 text-zinc-600" />{booking.customerEmail}</span>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-3">
                      <p className="text-[9px] text-zinc-700 font-black uppercase tracking-widest">
                        Ref: {booking.id.slice(-8).toUpperCase()} • {format(new Date(booking.createdAt), 'MMM do, HH:mm')}
                      </p>
                      {booking.paymentStatus !== "canceled" && (
                        <button 
                          onClick={() => cancelBooking(booking.id)} 
                          className="text-[9px] font-black uppercase tracking-[0.2em] text-zinc-500 hover:text-red-500 hover:border-red-500/50 border border-zinc-800 px-4 py-1.5 transition-all bg-black"
                        >
                          Cancel Appointment
                        </button>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {/* Inquiries Section */}
          <div className="mt-20">
            <h2 className="text-xl font-black uppercase tracking-tighter mb-8 flex items-center gap-3 italic">
              <span className="w-8 h-8 bg-blue-600 rounded-none flex items-center justify-center text-[10px] text-white">03</span>
              Contact Inquiries
            </h2>
            
            {inquiries.length === 0 ? (
               <div className="p-12 border border-dashed border-zinc-900 text-center">
                  <p className="text-[10px] text-zinc-700 font-bold uppercase tracking-widest">No inquiries yet</p>
               </div>
            ) : (
               <div className="grid grid-cols-1 gap-4">
                  {inquiries.map((inq) => (
                     <motion.div key={inq.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-6 border border-zinc-900 bg-zinc-950 group hover:border-blue-500/30 transition-all">
                        <div className="flex justify-between items-start">
                           <div>
                              <div className="flex items-center gap-3 mb-2">
                                 <h3 className="text-sm font-black uppercase tracking-widest text-white">{inq.firstName} {inq.lastName}</h3>
                                 <span className="text-[8px] bg-blue-400/10 text-blue-400 px-2 py-0.5 font-bold uppercase tracking-widest border border-blue-400/20">{inq.service}</span>
                              </div>
                              <p className="text-[10px] text-zinc-500 font-medium uppercase tracking-[0.2em] mb-4">{inq.email} • {inq.phone}</p>
                              <p className="text-xs text-zinc-400 leading-relaxed max-w-2xl bg-black/50 p-4 border-l-2 border-blue-500 uppercase font-bold tracking-tight">{inq.message}</p>
                           </div>
                           <div className="text-right">
                              <p className="text-[9px] text-zinc-700 font-black uppercase tracking-widest">{format(new Date(inq.createdAt), 'MMM do, HH:mm')}</p>
                           </div>
                        </div>
                     </motion.div>
                  ))}
               </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
