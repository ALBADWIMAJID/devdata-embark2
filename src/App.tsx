
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Upload from "./pages/Upload";
import Documents from "./pages/Documents";
import Document from "./pages/Document";
import NotFound from "./pages/NotFound";
import StaticPage, { StaticPageProps } from "./pages/StaticPage";

const queryClient = new QueryClient();

const staticPages: Array<{ path: string; page: StaticPageProps }> = [
  {
    path: "/pricing",
    page: {
      title: "Pricing",
      eyebrow: "Plans",
      description:
        "Simple plans for teams of any size. Choose a tier that matches your document volume and embedding needs.",
    },
  },
  {
    path: "/documentation",
    page: {
      title: "Documentation",
      eyebrow: "Docs",
      description:
        "Guides and reference material for ingestion, processing, and embeddings so you can integrate faster.",
    },
  },
  {
    path: "/api-reference",
    page: {
      title: "API Reference",
      eyebrow: "API",
      description:
        "Explore endpoints for uploads, document status, statistics, and deletion with predictable responses.",
    },
  },
  {
    path: "/examples",
    page: {
      title: "Examples",
      eyebrow: "Samples",
      description:
        "Sample datasets and workflows that show best practices for processing documents and embeddings.",
    },
  },
  {
    path: "/blog",
    page: {
      title: "Blog",
      eyebrow: "Updates",
      description:
        "Product updates, release notes, and practical tips from the DevVault team.",
    },
  },
  {
    path: "/about",
    page: {
      title: "About",
      eyebrow: "Company",
      description:
        "Our mission is to help developers turn unstructured documents into actionable data.",
    },
  },
  {
    path: "/contact",
    page: {
      title: "Contact",
      eyebrow: "Contact",
      description:
        "Reach out for support, partnerships, or questions about deployments.",
    },
  },
  {
    path: "/privacy",
    page: {
      title: "Privacy Policy",
      eyebrow: "Policy",
      description:
        "How we handle data, security, and retention for uploaded documents.",
    },
  },
  {
    path: "/terms",
    page: {
      title: "Terms of Service",
      eyebrow: "Policy",
      description:
        "Usage terms and conditions for the DevVault platform.",
    },
  },
];

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/upload" element={<Upload />} />
          <Route path="/documents" element={<Documents />} />
          <Route path="/document/:id" element={<Document />} />
          {staticPages.map(({ path, page }) => (
            <Route key={path} path={path} element={<StaticPage {...page} />} />
          ))}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
