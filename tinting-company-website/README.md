# Your Top Shop | Premium Automotive Protection 🏎️💨

Professional booking and management portal for window tinting, ceramic coating, vinyl wraps, and paint protection film (PPF).

## 🚀 Business Overview
Your Top Shop (Cranston, RI) provides premium vehicle preservation services. This portal streamlines customer acquisition through a high-conversion booking engine and a real-time admin management suite.

### Key Features:
- **Intelligent Booking**: Real-time availability checks and scheduling.
- **Custom Quote Engine**: Lead capture for complex services (wraps, coatings).
- **Admin Command Center**: Complete control over appointments, maintenance blocks, and manual leads.
- **CSV Data Export**: One-click download of business records for accounting.
- **Stripe Integrated**: Production-ready payment processing and webhook verification.
- **Render Blueprint**: Includes `render.yaml` for one-click "Web Service" deployment.

## 🛠️ Technology Stack
- **Frontend**: React (Vite), Tailwind CSS, Framer Motion.
- **Backend**: Node.js, Express, Stripe API.
- **Persistence**: Flat-file JSON (Local DB).
- **Environment**: Dotenv for secure key management.

## ☁️ Deployment (Render.com)
To deploy this portal as a single service on Render:
1. **Create New Web Service**: Connect your GitHub repository.
2. **Build Command**: `npm install && npm run build`
3. **Start Command**: `npm run server`
4. **Environment Variables**: Add your API keys from `.env` (STRIPE_SECRET_KEY, ADMIN_PIN, etc.).

## 📦 Getting Started

### Prerequisites
- Node.js (v18+)
- Stripe Account (API Keys)

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/plasmizx2/yourtopshop-portal.git
   cd yourtopshop-portal
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables (`.env`):
   ```bash
   VITE_STRIPE_PUBLIC_KEY=pk_test_...
   STRIPE_SECRET_KEY=sk_test_...
   ADMIN_PIN=012605
   PORT=3001
   ```
4. Start the application:
   ```bash
   # Terminal 1: Backend
   npm run server

   # Terminal 2: Frontend
   npm run dev
   ```

## 🔒 Security
- **Admin Protected**: The portal is locked behind a secure PIN gateway.
- **Stripe PCI Compliance**: All financial data is handled securely by Stripe; no card data is stored locally.

---
*Created with meticulous craftsmanship for Your Top Shop, Cranston RI.*