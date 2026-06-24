import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Package, ShoppingCart, MessageSquare, BarChart2, Inbox, FileText, ClipboardList, Eye, Edit, Trash2, Plus, X, AlertTriangle } from "lucide-react";
import type { Product, Article, Enquiry } from "../../types";
import { useProducts, useCreateProduct, useUpdateProduct, useDeleteProduct } from "../../hooks/useProducts";
import { useEnquiries, useMarkEnquiryRead, useDeleteEnquiry } from "../../hooks/useEnquiries";
import { useArticles, useCreateArticle, useUpdateArticle, useDeleteArticle } from "../../hooks/useArticles";
import { useUpdateOrderStatus } from "../../hooks/useOrders";
import { CategoryTag } from "../shared/CategoryTag";
import { DifficultyBadge } from "../shared/DifficultyBadge";
import { ImageSelector } from "../admin/ImageSelector";
import type { PexelsImage } from "../../lib/pexels";
import { getDashboardOrders } from "../../services/admin";

export function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<"overview" | "products" | "enquiries" | "tips" | "orders">("overview");
  const [modalOpen, setModalOpen] = useState(false);
  const [articleModalOpen, setArticleModalOpen] = useState(false);
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [editArticle, setEditArticle] = useState<Article | null>(null);
  const [published, setPublished] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    category: "Plants",
    difficulty: "Beginner",
    status: "Active",
    badge: "",
    image_url: "",
    image_source: "manual" as "manual" | "pexels",
    image_meta: null as { pexels_id: number; photographer: string; photographer_url: string } | null,
  });
  const [articleForm, setArticleForm] = useState({
    title: "",
    excerpt: "",
    category: "Plant Care",
    readTime: "",
    author: "",
    date: "",
    image: "",
    featured: false,
  });
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);
  const [deleteArticleConfirm, setDeleteArticleConfirm] = useState<number | null>(null);
  const [deleteEnquiryConfirm, setDeleteEnquiryConfirm] = useState<number | null>(null);
  const [viewEnquiry, setViewEnquiry] = useState<Enquiry | null>(null);
  const [selectedPexelsImage, setSelectedPexelsImage] = useState<PexelsImage | null>(null);
  const [selectedArticleImage, setSelectedArticleImage] = useState<PexelsImage | null>(null);

  const { data: products = [] } = useProducts();
  const { data: enquiries = [] } = useEnquiries();
  const { data: articles = [] } = useArticles();
  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct();
  const deleteProduct = useDeleteProduct();
  const createArticle = useCreateArticle();
  const updateArticle = useUpdateArticle();
  const deleteArticle = useDeleteArticle();
  const { data: dashboardOrders = [] } = useQuery({
    queryKey: ["dashboard-orders"],
    queryFn: getDashboardOrders,
  });
  const updateOrderStatus = useUpdateOrderStatus();
  const markRead = useMarkEnquiryRead();
  const deleteEnquiry = useDeleteEnquiry();

  const resetArticleForm = () => {
    setArticleForm({
      title: "",
      excerpt: "",
      category: "Plant Care",
      readTime: "",
      author: "",
      date: new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }),
      image: "",
      featured: false,
    });
    setSelectedArticleImage(null);
  };

  const openArticleModal = (article?: Article) => {
    if (article) {
      setEditArticle(article);
      setArticleForm({
        title: article.title,
        excerpt: article.excerpt,
        category: article.category,
        readTime: article.readTime,
        author: article.author,
        date: article.date,
        image: article.image,
        featured: article.featured,
      });
    } else {
      setEditArticle(null);
      resetArticleForm();
    }
    setArticleModalOpen(true);
  };

  const handleArticleDelete = (id: number) => {
    if (deleteArticleConfirm === id) {
      deleteArticle.mutate(id);
      setDeleteArticleConfirm(null);
    } else {
      setDeleteArticleConfirm(id);
      setTimeout(() => setDeleteArticleConfirm(null), 3000);
    }
  };

  const handleEnquiryDelete = (id: number) => {
    if (deleteEnquiryConfirm === id) {
      deleteEnquiry.mutate(id);
      setDeleteEnquiryConfirm(null);
    } else {
      setDeleteEnquiryConfirm(id);
      setTimeout(() => setDeleteEnquiryConfirm(null), 3000);
    }
  };

  const handleArticleSubmit = () => {
    const data = {
      title: articleForm.title,
      excerpt: articleForm.excerpt,
      category: articleForm.category,
      readTime: articleForm.readTime,
      author: articleForm.author,
      date: articleForm.date,
      image: articleForm.image || "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800&h=500&fit=crop&auto=format",
      featured: articleForm.featured,
    };

    if (editArticle) {
      updateArticle.mutate({ id: editArticle.id, article: data });
    } else {
      createArticle.mutate(data);
    }
    setArticleModalOpen(false);
    resetArticleForm();
  };

  const resetForm = () => {
    setFormData({
      name: "",
      price: "",
      category: "Plants",
      difficulty: "Beginner",
      status: "Active",
      badge: "",
      image_url: "",
      image_source: "manual",
      image_meta: null,
    });
    setSelectedPexelsImage(null);
    setPublished(true);
  };

  const openModal = (product?: Product) => {
    if (product) {
      setEditProduct(product);
      setFormData({
        name: product.name,
        price: product.price.toString(),
        category: product.category,
        difficulty: product.difficulty,
        status: product.status,
        badge: product.badge || "",
        image_url: product.image_url || product.image,
        image_source: product.image_source || "manual",
        image_meta: product.image_meta || null,
      });
      setPublished(product.status === "Active");
    } else {
      setEditProduct(null);
      resetForm();
    }
    setModalOpen(true);
  };

  const handleDelete = (id: number) => {
    if (deleteConfirm === id) {
      deleteProduct.mutate(id);
      setDeleteConfirm(null);
    } else {
      setDeleteConfirm(id);
      setTimeout(() => setDeleteConfirm(null), 3000);
    }
  };

  const handleSubmit = () => {
    const data = {
      name: formData.name,
      price: parseFloat(formData.price),
      category: formData.category,
      difficulty: formData.difficulty,
      status: published ? "Active" : "Inactive",
      badge: formData.badge || null,
      image: formData.image_url || "https://via.placeholder.com/150",
      image_url: formData.image_url || null,
      image_source: formData.image_source,
      image_meta: formData.image_meta,
      rating: editProduct?.rating || 0,
      reviews: editProduct?.reviews || 0,
    };

    if (editProduct) {
      updateProduct.mutate({ id: editProduct.id, updates: data });
    } else {
      createProduct.mutate(data);
    }
    setModalOpen(false);
    resetForm();
  };

  const handleArticleImageSelect = (image: PexelsImage) => {
    setSelectedArticleImage(image);
    setArticleForm({ ...articleForm, image: image.src.medium });
  };

  const handleImageSelect = (image: PexelsImage) => {
    setSelectedPexelsImage(image);
    setFormData({
      ...formData,
      image_url: image.src.medium,
      image_source: "pexels",
      image_meta: {
        pexels_id: image.id,
        photographer: image.photographer,
        photographer_url: image.photographer_url,
      },
    });
  };

  const totalRevenue = dashboardOrders.reduce((sum, o) => sum + o.total, 0);
  const unreadCount = enquiries.filter(e => !e.is_read).length;
  const stats = [
    { label: "Total Products", value: products.length.toString(), change: `${products.length} available`, Icon: Package, color: "bg-emerald-100 text-emerald-700" },
    { label: "Total Orders", value: dashboardOrders.length.toString(), change: `${dashboardOrders.filter(o => o.status === "delivered").length} delivered`, Icon: ShoppingCart, color: "bg-blue-100 text-blue-700" },
    { label: "Unread Messages", value: unreadCount.toString(), change: `${enquiries.length} total enquiries`, Icon: MessageSquare, color: "bg-amber-100 text-amber-700" },
    { label: "Monthly Revenue", value: `\u00A3${totalRevenue.toFixed(2)}`, change: `from ${dashboardOrders.length} orders`, Icon: BarChart2, color: "bg-purple-100 text-purple-700" },
  ];

  return (
    <div className="flex min-h-[calc(100vh-64px)]">
      <aside className="w-56 bg-sidebar text-sidebar-foreground shrink-0 hidden lg:flex flex-col">
        <div className="p-5 border-b border-sidebar-border">
          <p className="text-xs font-semibold text-sidebar-foreground/50 uppercase tracking-widest">Admin Panel</p>
        </div>
        <nav className="p-3 flex-1 space-y-1">
          {[
            { label: "Overview", id: "overview" as const, Icon: BarChart2 },
            { label: "Products", id: "products" as const, Icon: Package },
            { label: "Orders", id: "orders" as const, Icon: ClipboardList },
            { label: "Tips", id: "tips" as const, Icon: FileText },
            { label: "Enquiries", id: "enquiries" as const, Icon: Inbox },
          ].map(({ label, id, Icon }) => (
            <button key={id} onClick={() => setActiveTab(id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${activeTab === id ? "bg-sidebar-primary text-white" : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground"}`}>
              <Icon size={16} /> {label}
            </button>
          ))}
        </nav>
        <div className="p-4 border-t border-sidebar-border">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 bg-sidebar-primary rounded-full flex items-center justify-center text-xs font-bold text-white">S</div>
            <div>
              <p className="text-xs font-medium text-sidebar-foreground">Sophie Lane</p>
              <p className="text-[10px] text-sidebar-foreground/50">Admin</p>
            </div>
          </div>
        </div>
      </aside>

      <div className="flex-1 bg-background overflow-auto">
          <div className="lg:hidden flex overflow-x-auto border-b border-border bg-card px-4">
          {[{ label: "Overview", id: "overview" as const }, { label: "Products", id: "products" as const }, { label: "Orders", id: "orders" as const }, { label: "Tips", id: "tips" as const }, { label: "Enquiries", id: "enquiries" as const }].map(t => (
            <button key={t.id} onClick={() => setActiveTab(t.id)}
              className={`px-4 py-3.5 text-sm font-medium border-b-2 -mb-px transition-colors ${activeTab === t.id ? "border-primary text-primary" : "border-transparent text-muted-foreground"}`}>
              {t.label}
            </button>
          ))}
        </div>

        <div className="p-6 lg:p-8">
          {activeTab === "overview" && (
            <div>
              <h1 className="text-2xl font-semibold text-foreground mb-6" style={{ fontFamily: "'Playfair Display', serif" }}>Dashboard Overview</h1>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
                {stats.map(s => (
                  <div key={s.label} className="bg-card border border-border rounded-2xl p-5">
                    <div className="flex items-center justify-between mb-4">
                      <p className="text-sm text-muted-foreground">{s.label}</p>
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${s.color}`}>
                        <s.Icon size={16} />
                      </div>
                    </div>
                    <p className="text-2xl font-bold text-foreground">{s.value}</p>
                    <p className="text-xs text-muted-foreground mt-1">{s.change}</p>
                  </div>
                ))}
              </div>
              <div className="bg-card border border-border rounded-2xl p-6">
                <h2 className="text-base font-semibold text-foreground mb-5">Recent Orders</h2>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border">
                        {["Order", "Customer", "Product", "Amount", "Status"].map(h => (
                          <th key={h} className="text-left py-2.5 pr-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {[
                        { id: "#5021", name: "Emily Carter", product: "Heirloom Tomato Kit", amount: "\u00A334.99", status: "Dispatched" },
                        { id: "#5020", name: "Tom Ashby", product: "Herb Garden Box", amount: "\u00A328.99", status: "Processing" },
                        { id: "#5019", name: "Nina Patel", product: "Indoor Jungle Bundle", amount: "\u00A359.99", status: "Delivered" },
                        { id: "#5018", name: "James Wu", product: "Wildflower Pack", amount: "\u00A322.50", status: "Delivered" },
                      ].map(r => (
                        <tr key={r.id} className="hover:bg-muted/40 transition-colors">
                          <td className="py-3 pr-4 font-mono text-xs text-muted-foreground">{r.id}</td>
                          <td className="py-3 pr-4 font-medium text-foreground">{r.name}</td>
                          <td className="py-3 pr-4 text-muted-foreground">{r.product}</td>
                          <td className="py-3 pr-4 font-medium text-foreground">{r.amount}</td>
                          <td className="py-3">
                            <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${r.status === "Delivered" ? "bg-emerald-100 text-emerald-700" : r.status === "Dispatched" ? "bg-blue-100 text-blue-700" : "bg-amber-100 text-amber-700"}`}>{r.status}</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === "products" && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-semibold text-foreground" style={{ fontFamily: "'Playfair Display', serif" }}>Products</h1>
                <button onClick={() => openModal()} className="flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-primary/90 transition-colors">
                  <Plus size={15} /> Add Product
                </button>
              </div>
              <div className="bg-card border border-border rounded-2xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm min-w-[700px]">
                    <thead className="bg-muted/40 border-b border-border">
                      <tr>
                        {["Product", "Category", "Price", "Difficulty", "Status", "Actions"].map(h => (
                          <th key={h} className="text-left px-5 py-3.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {products.map(p => (
                        <tr key={p.id} className="hover:bg-muted/30 transition-colors">
                          <td className="px-5 py-3.5">
                            <div className="flex items-center gap-3">
                              <img src={p.image_url || p.image} alt={p.name} className="w-10 h-10 rounded-lg object-cover bg-muted" />
                              <span className="font-medium text-foreground text-sm">{p.name}</span>
                            </div>
                          </td>
                          <td className="px-5 py-3.5"><CategoryTag cat={p.category} /></td>
                          <td className="px-5 py-3.5 font-medium text-foreground">{"\u00A3"}{p.price.toFixed(2)}</td>
                          <td className="px-5 py-3.5"><DifficultyBadge level={p.difficulty} /></td>
                          <td className="px-5 py-3.5">
                            <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${p.status === "Active" ? "bg-emerald-100 text-emerald-700" : "bg-gray-100 text-gray-600"}`}>{p.status}</span>
                          </td>
                          <td className="px-5 py-3.5">
                            <div className="flex items-center gap-2">
                              <button onClick={() => openModal(p)} className="p-1.5 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"><Edit size={14} /></button>
                              <button onClick={() => handleDelete(p.id)} className={`p-1.5 rounded-lg transition-colors ${deleteConfirm === p.id ? "bg-rose-100 text-rose-600" : "hover:bg-rose-50 text-muted-foreground hover:text-rose-500"}`} title={deleteConfirm === p.id ? "Click again to confirm" : "Delete"}>{deleteConfirm === p.id ? <AlertTriangle size={14} /> : <Trash2 size={14} />}</button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === "orders" && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-semibold text-foreground" style={{ fontFamily: "'Playfair Display', serif" }}>Orders</h1>
                <span className="text-sm text-muted-foreground">{dashboardOrders.length} total</span>
              </div>
              <div className="bg-card border border-border rounded-2xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm min-w-[700px]">
                    <thead className="bg-muted/40 border-b border-border">
                      <tr>
                        {["Order", "Customer", "Total", "Status", "Date", "Actions"].map(h => (
                          <th key={h} className="text-left px-5 py-3.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {dashboardOrders.map(o => (
                        <tr key={o.id} className="hover:bg-muted/30 transition-colors">
                          <td className="px-5 py-3.5 font-mono text-xs text-muted-foreground">#{o.id}</td>
                          <td className="px-5 py-3.5 font-medium text-foreground">{o.customer_name || "Unknown"}</td>
                          <td className="px-5 py-3.5 font-medium text-foreground">£{o.total.toFixed(2)}</td>
                          <td className="px-5 py-3.5">
                            <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                              o.status === "delivered" ? "bg-emerald-100 text-emerald-700" :
                              o.status === "dispatched" ? "bg-purple-100 text-purple-700" :
                              o.status === "processing" ? "bg-blue-100 text-blue-700" :
                              "bg-amber-100 text-amber-700"
                            }`}>{o.status}</span>
                          </td>
                          <td className="px-5 py-3.5 text-muted-foreground text-xs">{new Date(o.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}</td>
                          <td className="px-5 py-3.5">
                            <select value={o.status} onChange={(e) => updateOrderStatus.mutate({ id: o.id, status: e.target.value as any })}
                              className="text-xs px-2 py-1.5 rounded-lg border border-border bg-input-background outline-none focus:border-primary/50">
                              {["pending", "processing", "dispatched", "delivered"].map(s => (
                                <option key={s} value={s}>{s}</option>
                              ))}
                            </select>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === "tips" && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-semibold text-foreground" style={{ fontFamily: "'Playfair Display', serif" }}>Tips</h1>
                <button onClick={() => openArticleModal()} className="flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-primary/90 transition-colors">
                  <Plus size={15} /> Add Tip
                </button>
              </div>
              <div className="bg-card border border-border rounded-2xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm min-w-[700px]">
                    <thead className="bg-muted/40 border-b border-border">
                      <tr>
                        {["Title", "Category", "Author", "Read Time", "Featured", "Actions"].map(h => (
                          <th key={h} className="text-left px-5 py-3.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {articles.map(a => (
                        <tr key={a.id} className="hover:bg-muted/30 transition-colors">
                          <td className="px-5 py-3.5">
                            <div className="flex items-center gap-3">
                              <img src={a.image} alt={a.title} className="w-10 h-10 rounded-lg object-cover bg-muted" />
                              <span className="font-medium text-foreground text-sm">{a.title}</span>
                            </div>
                          </td>
                          <td className="px-5 py-3.5"><span className="text-xs font-medium bg-accent/10 text-accent px-2 py-0.5 rounded-full">{a.category}</span></td>
                          <td className="px-5 py-3.5 text-muted-foreground">{a.author}</td>
                          <td className="px-5 py-3.5 text-muted-foreground">{a.readTime}</td>
                          <td className="px-5 py-3.5">
                            {a.featured ? <span className="text-xs font-medium bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">Featured</span> : <span className="text-xs text-muted-foreground">—</span>}
                          </td>
                          <td className="px-5 py-3.5">
                            <div className="flex items-center gap-2">
                              <button onClick={() => openArticleModal(a)} className="p-1.5 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"><Edit size={14} /></button>
                              <button onClick={() => handleArticleDelete(a.id)} className={`p-1.5 rounded-lg transition-colors ${deleteArticleConfirm === a.id ? "bg-rose-100 text-rose-600" : "hover:bg-rose-50 text-muted-foreground hover:text-rose-500"}`} title={deleteArticleConfirm === a.id ? "Click again to confirm" : "Delete"}>{deleteArticleConfirm === a.id ? <AlertTriangle size={14} /> : <Trash2 size={14} />}</button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === "enquiries" && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-semibold text-foreground" style={{ fontFamily: "'Playfair Display', serif" }}>Enquiries</h1>
                <span className="text-sm text-muted-foreground">{enquiries.filter(e => !e.is_read).length} unread</span>
              </div>
              <div className="bg-card border border-border rounded-2xl overflow-hidden divide-y divide-border">
                {enquiries.map(e => (
                  <div key={e.id} onClick={() => { if (!e.is_read) markRead.mutate(e.id); }}
                    className={`flex gap-4 px-5 py-4 cursor-pointer hover:bg-muted/30 transition-colors ${!e.is_read ? "bg-primary/5" : ""}`}>
                    <div className="w-9 h-9 bg-primary/10 rounded-full flex items-center justify-center shrink-0 text-sm font-semibold text-primary mt-0.5">
                      {e.name[0]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 mb-0.5">
                        <div className="flex items-center gap-2">
                          <span className={`text-sm font-medium text-foreground ${!e.is_read ? "font-semibold" : ""}`}>{e.name}</span>
                          {!e.is_read && <span className="w-1.5 h-1.5 bg-primary rounded-full" />}
                        </div>
                        <span className="text-xs text-muted-foreground shrink-0">{new Date(e.created_at).toLocaleDateString()}</span>
                      </div>
                      <p className="text-sm font-medium text-foreground mb-0.5">{e.subject}</p>
                      <p className="text-xs text-muted-foreground truncate">{e.message.slice(0, 80)}{e.message.length > 80 ? "..." : ""}</p>
                    </div>
                    <div className="flex items-start gap-1 mt-1">
                      <button onClick={(ev) => { ev.stopPropagation(); setViewEnquiry(e); }} className="p-1.5 rounded-lg hover:bg-muted transition-colors text-muted-foreground"><Eye size={13} /></button>
                      <button onClick={(ev) => { ev.stopPropagation(); handleEnquiryDelete(e.id); }} className={`p-1.5 rounded-lg transition-colors ${deleteEnquiryConfirm === e.id ? "bg-rose-100 text-rose-600" : "hover:bg-rose-50 text-muted-foreground hover:text-rose-500"}`}>{deleteEnquiryConfirm === e.id ? <AlertTriangle size={13} /> : <Trash2 size={13} />}</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {articleModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-foreground/40 backdrop-blur-sm" onClick={() => { setArticleModalOpen(false); resetArticleForm(); }} />
          <div className="relative bg-card rounded-2xl border border-border w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between p-6 border-b border-border">
              <h2 className="text-lg font-semibold text-foreground" style={{ fontFamily: "'Playfair Display', serif" }}>
                {editArticle ? "Edit Tip" : "New Tip"}
              </h2>
              <button onClick={() => { setArticleModalOpen(false); resetArticleForm(); }} className="p-2 hover:bg-muted rounded-lg transition-colors"><X size={16} /></button>
            </div>
            <div className="p-6 space-y-5">
              <div>
                <label className="text-sm font-medium text-foreground block mb-1.5">Article Image</label>
                <ImageSelector
                  productName={articleForm.title}
                  category={articleForm.category}
                  onSelect={handleArticleImageSelect}
                  selectedImage={selectedArticleImage}
                />
                {articleForm.image && !selectedArticleImage && (
                  <div className="mt-2 flex items-center gap-3">
                    <img src={articleForm.image} alt="Current" className="w-16 h-16 rounded-lg object-cover border border-border" />
                    <p className="text-xs text-muted-foreground">Current image</p>
                  </div>
                )}
              </div>
              <div>
                <label className="text-sm font-medium text-foreground block mb-1.5">Title</label>
                <input value={articleForm.title} onChange={(e) => setArticleForm({ ...articleForm, title: e.target.value })} type="text" placeholder="e.g. 10 Essential Tips for First-Time Gardeners" className="w-full px-4 py-3 rounded-xl border border-border bg-input-background outline-none focus:border-primary/50 text-sm transition-colors" />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground block mb-1.5">Excerpt</label>
                <textarea value={articleForm.excerpt} onChange={(e) => setArticleForm({ ...articleForm, excerpt: e.target.value })} rows={3} placeholder="Brief summary of the article..." className="w-full px-4 py-3 rounded-xl border border-border bg-input-background outline-none focus:border-primary/50 text-sm transition-colors resize-none" />
              </div>
              <div className="grid grid-cols-2 gap-5">
                <div>
                  <label className="text-sm font-medium text-foreground block mb-1.5">Category</label>
                  <select value={articleForm.category} onChange={(e) => setArticleForm({ ...articleForm, category: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-border bg-input-background outline-none focus:border-primary/50 text-sm">
                    {["Plant Care", "Watering", "Indoor Gardening", "Pest Control", "Seasonal Guides"].map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground block mb-1.5">Read Time</label>
                  <input value={articleForm.readTime} onChange={(e) => setArticleForm({ ...articleForm, readTime: e.target.value })} type="text" placeholder="e.g. 5 min" className="w-full px-4 py-3 rounded-xl border border-border bg-input-background outline-none focus:border-primary/50 text-sm transition-colors" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-5">
                <div>
                  <label className="text-sm font-medium text-foreground block mb-1.5">Author</label>
                  <input value={articleForm.author} onChange={(e) => setArticleForm({ ...articleForm, author: e.target.value })} type="text" placeholder="e.g. Sophie Lane" className="w-full px-4 py-3 rounded-xl border border-border bg-input-background outline-none focus:border-primary/50 text-sm transition-colors" />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground block mb-1.5">Date</label>
                  <input value={articleForm.date} onChange={(e) => setArticleForm({ ...articleForm, date: e.target.value })} type="text" placeholder="e.g. June 14, 2026" className="w-full px-4 py-3 rounded-xl border border-border bg-input-background outline-none focus:border-primary/50 text-sm transition-colors" />
                </div>
              </div>
              <div className="flex items-center justify-between py-3 border-t border-border">
                <div>
                  <p className="text-sm font-medium text-foreground">Featured</p>
                  <p className="text-xs text-muted-foreground">Show as featured article</p>
                </div>
                <button onClick={() => setArticleForm({ ...articleForm, featured: !articleForm.featured })} className={`w-12 h-6 rounded-full transition-colors relative ${articleForm.featured ? "bg-primary" : "bg-muted"}`}>
                  <span className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all ${articleForm.featured ? "left-7" : "left-1"}`} />
                </button>
              </div>
              <div className="flex gap-3 pt-2">
                <button onClick={() => { setArticleModalOpen(false); resetArticleForm(); }} className="flex-1 py-3 rounded-xl border border-border text-sm font-medium hover:bg-muted transition-colors">Cancel</button>
                <button onClick={handleArticleSubmit} disabled={!articleForm.title || !articleForm.excerpt || createArticle.isPending || updateArticle.isPending} className="flex-1 py-3 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                  {createArticle.isPending || updateArticle.isPending ? "Saving..." : editArticle ? "Save Changes" : "Create Tip"}
                </button>
              </div>
              {(createArticle.isError || updateArticle.isError) && (
                <p className="text-xs text-rose-600 text-center">Failed to save tip. Please try again.</p>
              )}
            </div>
          </div>
        </div>
      )}

      {viewEnquiry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-foreground/40 backdrop-blur-sm" onClick={() => setViewEnquiry(null)} />
          <div className="relative bg-card rounded-2xl border border-border w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between p-6 border-b border-border">
              <h2 className="text-lg font-semibold text-foreground" style={{ fontFamily: "'Playfair Display', serif" }}>Enquiry Details</h2>
              <button onClick={() => setViewEnquiry(null)} className="p-2 hover:bg-muted rounded-lg transition-colors"><X size={16} /></button>
            </div>
            <div className="p-6 space-y-5">
              <div className="flex items-center gap-4 pb-4 border-b border-border">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-lg font-semibold text-primary">{viewEnquiry.name[0]}</div>
                <div>
                  <p className="text-lg font-semibold text-foreground">{viewEnquiry.name}</p>
                  <p className="text-sm text-muted-foreground">{viewEnquiry.email}</p>
                </div>
              </div>
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Subject</p>
                <p className="text-sm font-medium text-foreground">{viewEnquiry.subject}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Message</p>
                <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">{viewEnquiry.message}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Date</p>
                <p className="text-sm text-muted-foreground">{new Date(viewEnquiry.created_at).toLocaleString()}</p>
              </div>
              <div className="flex gap-3 pt-2">
                <button onClick={() => { if (!viewEnquiry.is_read) markRead.mutate(viewEnquiry.id); setViewEnquiry(null); }} className="flex-1 py-3 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors">
                  {viewEnquiry.is_read ? "Close" : "Mark as Read & Close"}
                </button>
                <button onClick={() => { handleEnquiryDelete(viewEnquiry.id); setViewEnquiry(null); }} className="py-3 px-6 rounded-xl border border-border text-sm font-medium hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 transition-colors">Delete</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-foreground/40 backdrop-blur-sm" onClick={() => { setModalOpen(false); resetForm(); }} />
          <div className="relative bg-card rounded-2xl border border-border w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between p-6 border-b border-border">
              <h2 className="text-lg font-semibold text-foreground" style={{ fontFamily: "'Playfair Display', serif" }}>
                {editProduct ? "Edit Product" : "New Product"}
              </h2>
              <button onClick={() => { setModalOpen(false); resetForm(); }} className="p-2 hover:bg-muted rounded-lg transition-colors"><X size={16} /></button>
            </div>
            <div className="p-6 space-y-5">
              <div>
                <label className="text-sm font-medium text-foreground block mb-1.5">Product Image</label>
                <ImageSelector
                  productName={formData.name}
                  category={formData.category}
                  onSelect={handleImageSelect}
                  selectedImage={selectedPexelsImage}
                />
                {formData.image_url && !selectedPexelsImage && (
                  <div className="mt-2 flex items-center gap-3">
                    <img src={formData.image_url} alt="Current" className="w-16 h-16 rounded-lg object-cover border border-border" />
                    <p className="text-xs text-muted-foreground">Current image</p>
                  </div>
                )}
              </div>
              <div>
                <label className="text-sm font-medium text-foreground block mb-1.5">Product Name</label>
                <input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} type="text" placeholder="e.g. Cherry Tomato Starter Kit" className="w-full px-4 py-3 rounded-xl border border-border bg-input-background outline-none focus:border-primary/50 text-sm transition-colors" />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground block mb-1.5">{"Price (\u00A3)"}</label>
                <input value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} type="number" step="0.01" placeholder="0.00" className="w-full px-4 py-3 rounded-xl border border-border bg-input-background outline-none focus:border-primary/50 text-sm transition-colors" />
              </div>
              <div className="grid grid-cols-2 gap-5">
                <div>
                  <label className="text-sm font-medium text-foreground block mb-1.5">Category</label>
                  <select value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-border bg-input-background outline-none focus:border-primary/50 text-sm">
                    {["Boxes", "Plants", "Seeds", "Tools", "Pots", "Fertilizers"].map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground block mb-1.5">Difficulty</label>
                  <select value={formData.difficulty} onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-border bg-input-background outline-none focus:border-primary/50 text-sm">
                    {["Beginner", "Intermediate", "Advanced"].map(d => <option key={d}>{d}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-foreground block mb-1.5">Badge</label>
                <select value={formData.badge} onChange={(e) => setFormData({ ...formData, badge: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-border bg-input-background outline-none focus:border-primary/50 text-sm">
                  <option value="">None</option>
                  {["Best Seller", "New", "Sale"].map(b => <option key={b}>{b}</option>)}
                </select>
              </div>
              <div className="flex items-center justify-between py-3 border-t border-border">
                <div>
                  <p className="text-sm font-medium text-foreground">Published</p>
                  <p className="text-xs text-muted-foreground">Visible on the store</p>
                </div>
                <button onClick={() => setPublished(!published)} className={`w-12 h-6 rounded-full transition-colors relative ${published ? "bg-primary" : "bg-muted"}`}>
                  <span className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all ${published ? "left-7" : "left-1"}`} />
                </button>
              </div>
              <div className="flex gap-3 pt-2">
                <button onClick={() => { setModalOpen(false); resetForm(); }} className="flex-1 py-3 rounded-xl border border-border text-sm font-medium hover:bg-muted transition-colors">Cancel</button>
                <button onClick={handleSubmit} disabled={!formData.name || !formData.price || createProduct.isPending || updateProduct.isPending} className="flex-1 py-3 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                  {createProduct.isPending || updateProduct.isPending ? "Saving..." : editProduct ? "Save Changes" : "Create Product"}
                </button>
              </div>
              {(createProduct.isError || updateProduct.isError) && (
                <p className="text-xs text-rose-600 text-center">Failed to save product. Please try again.</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
