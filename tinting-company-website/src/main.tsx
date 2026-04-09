
  import { createRoot } from "react-dom/client";
  import App from "./app/App.tsx";
  import "./styles/index.css";

  // Force the site into the dark theme tokens (camo-gray palette).
  document.documentElement.classList.add("dark");

  // Override Tailwind v4's default .dark values with our camo-gray palette.
  // Setting directly on the element guarantees highest specificity.
  const r = document.documentElement.style;
  r.setProperty("--background", "#1e2228");
  r.setProperty("--foreground", "#f3f4f6");
  r.setProperty("--card", "#252a32");
  r.setProperty("--card-foreground", "#f3f4f6");
  r.setProperty("--popover", "#252a32");
  r.setProperty("--popover-foreground", "#f3f4f6");
  r.setProperty("--primary", "#f3f4f6");
  r.setProperty("--primary-foreground", "#1a1e24");
  r.setProperty("--secondary", "#2c323a");
  r.setProperty("--secondary-foreground", "#f3f4f6");
  r.setProperty("--muted", "#282d35");
  r.setProperty("--muted-foreground", "#a3aab4");
  r.setProperty("--accent", "#303840");
  r.setProperty("--accent-foreground", "#f3f4f6");
  r.setProperty("--border", "rgba(255, 255, 255, 0.10)");
  r.setProperty("--input", "rgba(255, 255, 255, 0.08)");
  r.setProperty("--input-background", "#2a3038");
  r.setProperty("--ring", "rgba(250, 204, 21, 0.28)");
  r.setProperty("--sidebar", "#232830");
  r.setProperty("--sidebar-accent", "#2e343c");
  r.setProperty("--sidebar-border", "#2e343c");
  r.setProperty("--camo-a", "rgba(148, 163, 184, 0.20)");
  r.setProperty("--camo-b", "rgba(113, 122, 132, 0.22)");

  createRoot(document.getElementById("root")!).render(<App />);
  