import { createBrowserRouter } from "react-router";
import { RootLayout } from "./components/RootLayout";
import { Home } from "./pages/Home";
import { Services } from "./pages/Services";
import { Gallery } from "./pages/Gallery";
import { Contact } from "./pages/Contact";
import { About } from "./pages/About";
import { BookService } from "./pages/BookService";
import { PrivacyPolicy } from "./pages/PrivacyPolicy";
import { ServiceDetail } from "./pages/ServiceDetail";
import { NotFound } from "./pages/NotFound";
import { Admin } from "./pages/Admin";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: RootLayout,
    children: [
      { index: true, Component: Home },
      { path: "services", Component: Services },
      { path: "services/:id", Component: ServiceDetail },
      { path: "gallery", Component: Gallery },
      { path: "contact", Component: Contact },
      { path: "about", Component: About },
      { path: "book-service", Component: BookService },
      { path: "private-policy", Component: PrivacyPolicy },
      { path: "admin", Component: Admin },
      { path: "*", Component: NotFound },
    ],
  },
]);
