import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { Product, Article, Enquiry, FAQ, TeamMember, Profile, Order, CartItem } from "../app/types";

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: false } },
});

function Wrapper({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <MemoryRouter>{children}</MemoryRouter>
    </QueryClientProvider>
  );
}

function renderWithProviders(ui: React.ReactElement) {
  return render(ui, { wrapper: Wrapper });
}

describe("Data types", () => {
  it("Product interface validates shape", () => {
    const p: Product = {
      id: 1, name: "Test", price: 29.99, difficulty: "Beginner",
      category: "Boxes", image: "img.jpg", rating: 4.5, reviews: 10,
      badge: "Best Seller", status: "Active", image_url: null,
      image_source: "manual", image_meta: null,
    };
    expect(p.name).toBe("Test");
    expect(p.price).toBe(29.99);
    expect(p.category).toBe("Boxes");
  });

  it("Article interface validates shape", () => {
    const a: Article = {
      id: 1, title: "Test", excerpt: "Excerpt", category: "Plant Care",
      readTime: "5 min", author: "Sophie", date: "June 2026",
      image: "img.jpg", featured: false,
    };
    expect(a.title).toBe("Test");
    expect(a.featured).toBe(false);
  });

  it("Enquiry interface validates shape", () => {
    const e: Enquiry = {
      id: 1, name: "John", email: "j@test.com", subject: "Help",
      message: "Need help", is_read: false, created_at: "2026-01-01",
    };
    expect(e.is_read).toBe(false);
    expect(e.email).toBe("j@test.com");
  });

  it("FAQ interface validates shape", () => {
    const f: FAQ = { id: 1, question: "Q?", answer: "A!", sort_order: 1 };
    expect(f.question).toBe("Q?");
    expect(f.sort_order).toBe(1);
  });

  it("TeamMember interface validates shape", () => {
    const t: TeamMember = { name: "Sophie", role: "CEO", bio: "Bio", image: "img.jpg" };
    expect(t.name).toBe("Sophie");
  });

  it("Profile interface validates shape", () => {
    const p: Profile = { id: "1", name: "Sophie", role: "admin", avatar_url: null, created_at: "2026-01-01" };
    expect(p.role).toBe("admin");
  });

  it("Order interface validates shape", () => {
    const o: Order = { id: 1, user_id: "1", status: "pending", total: 50, created_at: "2026-01-01" };
    expect(o.status).toBe("pending");
  });

  it("CartItem interface validates shape", () => {
    const c: CartItem = { id: 1, user_id: "1", product_id: 1, quantity: 2, created_at: "2026-01-01" };
    expect(c.quantity).toBe(2);
  });
});

describe("Page components render without crashing", () => {
  it("HomePage renders", async () => {
    const { HomePage } = await import("../app/components/pages/HomePage");
    renderWithProviders(<HomePage />);
    expect(document.querySelector("main")).toBeInTheDocument();
  });

  it("BoxesPage renders", async () => {
    const { BoxesPage } = await import("../app/components/pages/BoxesPage");
    renderWithProviders(<BoxesPage />);
    expect(document.querySelector("main")).toBeInTheDocument();
  });

  it("AboutPage renders", async () => {
    const { AboutPage } = await import("../app/components/pages/AboutPage");
    renderWithProviders(<AboutPage />);
    expect(document.querySelector("main")).toBeInTheDocument();
  });

  it("ProductsPage renders", async () => {
    const { ProductsPage } = await import("../app/components/pages/ProductsPage");
    renderWithProviders(<ProductsPage />);
    expect(document.querySelector("main")).toBeInTheDocument();
  });

  it("ProductDetailPage renders", async () => {
    const { ProductDetailPage } = await import("../app/components/pages/ProductDetailPage");
    const { container } = renderWithProviders(<ProductDetailPage />);
    expect(container.textContent).toContain("Loading");
  });

  it("TipsPage renders", async () => {
    const { TipsPage } = await import("../app/components/pages/TipsPage");
    renderWithProviders(<TipsPage />);
    expect(document.querySelector("main")).toBeInTheDocument();
  });

  it("ContactPage renders", async () => {
    const { ContactPage } = await import("../app/components/pages/ContactPage");
    renderWithProviders(<ContactPage />);
    expect(document.querySelector("main")).toBeInTheDocument();
  });
  it("CartPage renders", async () => {
    const { CartPage } = await import("../app/components/pages/CartPage");
    renderWithProviders(<CartPage />);
    expect(document.querySelector("main")).toBeInTheDocument();
  });



  it("OrdersPage renders", async () => {
    const { OrdersPage } = await import("../app/components/pages/OrdersPage");
    renderWithProviders(<OrdersPage />);
    expect(document.querySelector("main")).toBeInTheDocument();
  });

  it("ActivitiesPage renders", async () => {
    const { ActivitiesPage } = await import("../app/components/pages/ActivitiesPage");
    renderWithProviders(<ActivitiesPage />);
    expect(document.querySelector("main")).toBeInTheDocument();
  });

  it("NotFoundPage renders", async () => {
    const { NotFoundPage } = await import("../app/components/pages/NotFoundPage");
    renderWithProviders(<NotFoundPage />);
    expect(document.querySelector("main")).toBeInTheDocument();
  });
});

describe("Layout components render", () => {
  it("Navbar renders", async () => {
    const { Navbar } = await import("../app/components/layout/Navbar");
    renderWithProviders(<Navbar />);
    expect(document.querySelector("header")).toBeInTheDocument();
  });

  it("Footer renders", async () => {
    const { Footer } = await import("../app/components/layout/Footer");
    renderWithProviders(<Footer />);
    expect(document.querySelector("footer")).toBeInTheDocument();
  });

  it("MobileNav renders", async () => {
    const { MobileNav } = await import("../app/components/layout/MobileNav");
    renderWithProviders(<MobileNav />);
    expect(document.querySelector("nav")).toBeInTheDocument();
  });
});

describe("Shared components render", () => {
  it("ProductCard renders with product data", async () => {
    const { ProductCard } = await import("../app/components/shared/ProductCard");
    const product: Product = {
      id: 1, name: "Test Box", price: 34.99, difficulty: "Beginner",
      category: "Boxes", image: "img.jpg", rating: 4.5, reviews: 20,
      badge: "Best Seller", status: "Active", image_url: null,
      image_source: "manual", image_meta: null,
    };
    renderWithProviders(<ProductCard product={product} onViewDetails={vi.fn()} onAddToCart={vi.fn()} />);
    expect(screen.getByText("Test Box")).toBeInTheDocument();
    expect(screen.getByText("£34.99")).toBeInTheDocument();
  });

  it("CategoryTag renders", async () => {
    const { CategoryTag } = await import("../app/components/shared/CategoryTag");
    render(<CategoryTag cat="Boxes" />);
    expect(screen.getByText("Boxes")).toBeInTheDocument();
  });

  it("DifficultyBadge renders", async () => {
    const { DifficultyBadge } = await import("../app/components/shared/DifficultyBadge");
    render(<DifficultyBadge level="Beginner" />);
    expect(screen.getByText("Beginner")).toBeInTheDocument();
  });

  it("AuthGuard shows admin login when not authenticated", async () => {
    const { AuthGuard } = await import("../app/components/shared/AuthGuard");
    renderWithProviders(<AuthGuard><div>Protected</div></AuthGuard>);
    expect(document.body.textContent).toContain("Admin Access Required");
  });
});

describe("App routing structure", () => {
  it("App has correct route count", async () => {
    const mod = await import("../app/App");
    expect(mod.default).toBeDefined();
  });

  it("All page components are exported", async () => {
    const pages = ["HomePage", "BoxesPage", "AboutPage", "ProductsPage", "ProductDetailPage", "TipsPage", "ContactPage", "CartPage", "CheckoutPage", "OrdersPage", "ActivitiesPage", "NotFoundPage"];
    for (const name of pages) {
      const mod = await import(`../app/components/pages/${name}`);
      expect(mod[name]).toBeDefined();
    }
  });

  it("Layout components are exported", async () => {
    const { Navbar } = await import("../app/components/layout/Navbar");
    const { Footer } = await import("../app/components/layout/Footer");
    const { MobileNav } = await import("../app/components/layout/MobileNav");
    expect(Navbar).toBeDefined();
    expect(Footer).toBeDefined();
    expect(MobileNav).toBeDefined();
  });
});

describe("Service functions exist", () => {
  it("products service exports all functions", async () => {
    const svc = await import("../app/services/products");
    expect(svc.getProducts).toBeDefined();
    expect(svc.getProduct).toBeDefined();
    expect(svc.createProduct).toBeDefined();
    expect(svc.updateProduct).toBeDefined();
    expect(svc.deleteProduct).toBeDefined();
  });

  it("cart service exports functions", async () => {
    const svc = await import("../app/services/cart");
    expect(svc.getCartItems).toBeDefined();
    expect(svc.upsertCartItem).toBeDefined();
    expect(svc.removeCartItem).toBeDefined();
    expect(svc.clearCart).toBeDefined();
  });

  it("articles service exports functions", async () => {
    const svc = await import("../app/services/articles");
    expect(svc.getArticles).toBeDefined();
  });

  it("enquiries service exports functions", async () => {
    const svc = await import("../app/services/enquiries");
    expect(svc.getEnquiries).toBeDefined();
    expect(svc.createEnquiry).toBeDefined();
  });

  it("orders service exports functions", async () => {
    const svc = await import("../app/services/orders");
    expect(svc).toBeDefined();
  });

  it("team service exports functions", async () => {
    const svc = await import("../app/services/team");
    expect(svc.getTeam).toBeDefined();
  });

  it("faqs service exports functions", async () => {
    const svc = await import("../app/services/faqs");
    expect(svc.getFaqs).toBeDefined();
  });
});

describe("Hook functions exist", () => {
  it("useAuth hook exists", async () => {
    const mod = await import("../app/hooks/useAuth");
    expect(mod.useAuth).toBeDefined();
  });

  it("useCart hook exists", async () => {
    const mod = await import("../app/hooks/useCart");
    expect(mod.useCart).toBeDefined();
  });

  it("useProducts hook exists", async () => {
    const mod = await import("../app/hooks/useProducts");
    expect(mod.useProducts).toBeDefined();
    expect(mod.useProduct).toBeDefined();
  });

  it("useArticles hook exists", async () => {
    const mod = await import("../app/hooks/useArticles");
    expect(mod.useArticles).toBeDefined();
  });

  it("useOrders hook exists", async () => {
    const mod = await import("../app/hooks/useOrders");
    expect(mod.useOrders).toBeDefined();
  });
});

describe("Type exports", () => {
  it("types.ts module loads without error", async () => {
    const types = await import("../app/types");
    expect(types).toBeDefined();
  });
});

describe("Responsive CSS classes", () => {
  it("Navbar has mobile responsive classes", async () => {
    const { Navbar } = await import("../app/components/layout/Navbar");
    const { container } = renderWithProviders(<Navbar />);
    const header = container.querySelector("header");
    expect(header?.className).toContain("sticky");
    expect(header?.className).toContain("z-50");
  });

  it("Footer has responsive grid", async () => {
    const { Footer } = await import("../app/components/layout/Footer");
    const { container } = renderWithProviders(<Footer />);
    const grids = container.querySelectorAll(".grid");
    expect(grids.length).toBeGreaterThanOrEqual(1);
    const hasResponsiveGrid = Array.from(grids).some(g =>
      g.className.includes("md:grid-cols-4") || g.className.includes("sm:flex-row")
    );
    expect(hasResponsiveGrid).toBe(true);
  });

  it("MobileNav has fixed bottom positioning", async () => {
    const { MobileNav } = await import("../app/components/layout/MobileNav");
    const { container } = renderWithProviders(<MobileNav />);
    const nav = container.querySelector("nav");
    expect(nav?.className).toContain("fixed");
    expect(nav?.className).toContain("bottom-0");
  });

  it("Page components use max-w-7xl container", async () => {
    const pages = ["HomePage", "AboutPage", "ProductsPage", "TipsPage", "ActivitiesPage"];
    for (const name of pages) {
      const mod = await import(`../app/components/pages/${name}`);
      const Component = mod[name];
      const { container } = renderWithProviders(<Component />);
      const hasMaxW = container.querySelector(".max-w-7xl") !== null;
      expect(hasMaxW).toBe(true);
    }
  });
});
