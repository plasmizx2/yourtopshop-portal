import { motion } from "motion/react";

export function PrivacyPolicy() {
  return (
    <div className="w-full text-foreground py-24 px-6 md:px-12 font-light">
      <div className="max-w-4xl mx-auto">
        <motion.h1 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 0.8, y: 0 }}
          className="text-5xl font-black mb-12 tracking-tighter uppercase"
        >
          Privacy Policy
        </motion.h1>
        
        <div className="space-y-12 text-gray-400 text-lg leading-relaxed">
          <section>
            <h2 className="text-xl font-bold text-white mb-4 uppercase tracking-widest">01. Overview</h2>
            <p>
              Your Top Shop automotive solutions ("we," "our," or "us") is dedicated to providing premium vehicle protection while maintaining the highest standards of data privacy. This policy outlines our commitment to your personal information when you use our digital booking system.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-4 uppercase tracking-widest">02. Data Collection</h2>
            <p>We collect essential information required to provide professional automotive services:</p>
            <ul className="list-disc ml-6 mt-4 space-y-2 text-sm font-bold tracking-tight">
              <li>Identity: Full name, phone number, and email.</li>
              <li>Vehicle: Year, make, model, and current condition details.</li>
              <li>Payment: Transaction IDs and last 4 digits (handled securely by Stripe).</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-4 uppercase tracking-widest">03. Secure Payments</h2>
            <p>
              Your security is paramount. We utilize <strong>Stripe</strong> for all digital transactions. We do not store full credit card numbers or sensitive CVV codes on our local servers. Payment processing is governed by <a href="https://stripe.com/privacy" target="_blank" rel="noreferrer" className="text-yellow-400 hover:underline">Stripe's Privacy Policy</a>.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-4 uppercase tracking-widest">04. Data Retention</h2>
            <p>
              We retain your service history to honor our **Lifetime Warranty** on ceramic films and coatings. If you wish to have your contact data removed from our records, please contact our Cranston office directly.
            </p>
          </section>
          
          <section>
            <h2 className="text-xl font-bold text-white mb-4 uppercase tracking-widest">05. Contact</h2>
            <p>For any privacy-related inquiries:</p>
            <div className="mt-4 p-8 bg-[#252a32] border border-white/10 rounded-none">
              <p className="text-white font-black uppercase">Your Top Shop</p>
              <p>99 Fletcher Ave</p>
              <p>Cranston, RI 02920</p>
              <p className="text-yellow-400 font-bold mt-2">(401) 456-0006</p>
            </div>
          </section>

          <p className="text-[10px] uppercase font-black tracking-[0.2em] pt-12 border-t border-white/10">
            Version 1.1 — Updated April 2024
          </p>
        </div>
      </div>
    </div>
  );
}
