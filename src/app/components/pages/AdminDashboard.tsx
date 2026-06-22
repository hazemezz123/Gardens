import { useState } from "react";
import { Package, ShoppingCart, MessageSquare, BarChart2, Inbox, Eye, Edit, Trash2, Plus, X, Upload } from "lucide-react";
import type { Product } from "../../types";
import { useProducts, useCreateProduct, useDeleteProduct } from "../../hooks/useProducts";
import { useEnquiries, useMarkEnquiryRead } from "../../hooks/useEnquiries";
import { CategoryTag } from "../shared/CategoryTag";
import { DifficultyBadge } from "../shared/DifficultyBadge";

export function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<"overview" | "products" | "enquiries">("overview");
  const [modalOpen, setModalOpen] = useState(false);
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [published, setPublished] = useState(true);

  const { data: products = [] } = useProducts();
  const { data: enquiries = [] } = useEnquiries();
  const deleteProduct = useDeleteProduct();
  const markRead = useMarkEnquiryRead();

  const stats = [
    { label: "Total Products", value: "48", change: "+3 this month", Icon: Package, color: "bg-emerald-100 text-emerald-700" },
    { label: "Total Orders", value: "1,284", change: "+12% vs last month", Icon: ShoppingCart, color: "bg-blue-100 text-blue-700" },
    { label: "Unread Messages", value: "7", change: "3 urgent", Icon: MessageSquare, color: "bg-amber-100 text-amber-700" },
    { label: "Monthly Revenue", value: "£18,420", change: "+8.2% this month", Icon: BarChart2, color: "bg-purple-100 text-purple-700" },
  ];

  // enquiries come from useEnquiries hook above

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
        <div className="lg:hidden flex border-b border-border bg-card px-4">
          {[{ label: "Overview", id: "overview" as const }, { label: "Products", id: "products" as const }, { label: "Enquiries", id: "enquiries" as const }].map(t => (
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
                        { id: "#5021", name: "Emily Carter", product: "Heirloom Tomato Kit", amount: "£34.99", status: "Dispatched" },
                        { id: "#5020", name: "Tom Ashby", product: "Herb Garden Box", amount: "£28.99", status: "Processing" },
                        { id: "#5019", name: "Nina Patel", product: "Indoor Jungle Bundle", amount: "£59.99", status: "Delivered" },
                        { id: "#5018", name: "James Wu", product: "Wildflower Pack", amount: "£22.50", status: "Delivered" },
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
                <button onClick={() => { setEditProduct(null); setModalOpen(true); }} className="flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-primary/90 transition-colors">
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
                              <img src={p.image} alt={p.name} className="w-10 h-10 rounded-lg object-cover bg-muted" />
                              <span className="font-medium text-foreground text-sm">{p.name}</span>
                            </div>
                          </td>
                          <td className="px-5 py-3.5"><CategoryTag cat={p.category} /></td>
                          <td className="px-5 py-3.5 font-medium text-foreground">£{p.price.toFixed(2)}</td>
                          <td className="px-5 py-3.5"><DifficultyBadge level={p.difficulty} /></td>
                          <td className="px-5 py-3.5">
                            <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${p.status === "Active" ? "bg-emerald-100 text-emerald-700" : "bg-gray-100 text-gray-600"}`}>{p.status}</span>
                          </td>
                          <td className="px-5 py-3.5">
                            <div className="flex items-center gap-2">
                              <button onClick={() => { setEditProduct(p); setModalOpen(true); }} className="p-1.5 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"><Edit size={14} /></button>
                              <button onClick={() => deleteProduct.mutate(p.id)} className="p-1.5 rounded-lg hover:bg-rose-50 transition-colors text-muted-foreground hover:text-rose-500"><Trash2 size={14} /></button>
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
                      <p className="text-xs text-muted-foreground truncate">{e.message.slice(0, 80)}{e.message.length > 80 ? "…" : ""}</p>
                    </div>
                    <div className="flex items-start gap-1 mt-1">
                      <button className="p-1.5 rounded-lg hover:bg-muted transition-colors text-muted-foreground"><Eye size={13} /></button>
                      <button className="p-1.5 rounded-lg hover:bg-muted transition-colors text-muted-foreground"><Trash2 size={13} /></button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-foreground/40 backdrop-blur-sm" onClick={() => setModalOpen(false)} />
          <div className="relative bg-card rounded-2xl border border-border w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between p-6 border-b border-border">
              <h2 className="text-lg font-semibold text-foreground" style={{ fontFamily: "'Playfair Display', serif" }}>
                {editProduct ? "Edit Product" : "New Product"}
              </h2>
              <button onClick={() => setModalOpen(false)} className="p-2 hover:bg-muted rounded-lg transition-colors"><X size={16} /></button>
            </div>
            <div className="p-6 space-y-5">
              <div className="border-2 border-dashed border-border rounded-xl p-8 text-center cursor-pointer hover:border-primary/40 transition-colors">
                <Upload size={24} className="text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">Upload product images</p>
                <p className="text-xs text-muted-foreground/60 mt-1">JPG, PNG up to 10MB</p>
              </div>
              {[
                { label: "Product Name", placeholder: editProduct?.name || "e.g. Cherry Tomato Starter Kit", type: "text" },
                { label: "Price (£)", placeholder: editProduct?.price.toString() || "0.00", type: "number" },
              ].map(f => (
                <div key={f.label}>
                  <label className="text-sm font-medium text-foreground block mb-1.5">{f.label}</label>
                  <input defaultValue={f.placeholder} type={f.type} className="w-full px-4 py-3 rounded-xl border border-border bg-input-background outline-none focus:border-primary/50 text-sm transition-colors" />
                </div>
              ))}
              <div>
                <label className="text-sm font-medium text-foreground block mb-1.5">Short Description</label>
                <textarea rows={2} defaultValue={editProduct ? "Existing product description…" : ""} placeholder="One-sentence summary shown on product cards…"
                  className="w-full px-4 py-3 rounded-xl border border-border bg-input-background outline-none focus:border-primary/50 text-sm resize-none transition-colors" />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground block mb-1.5">Full Description</label>
                <textarea rows={4} placeholder="Detailed product description for the product page…"
                  className="w-full px-4 py-3 rounded-xl border border-border bg-input-background outline-none focus:border-primary/50 text-sm resize-none transition-colors" />
              </div>
              <div className="grid grid-cols-2 gap-5">
                <div>
                  <label className="text-sm font-medium text-foreground block mb-1.5">Category</label>
                  <select defaultValue={editProduct?.category} className="w-full px-4 py-3 rounded-xl border border-border bg-input-background outline-none focus:border-primary/50 text-sm">
                    {["Vegetables", "Herbs", "Flowers", "Indoor Plants"].map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground block mb-1.5">Difficulty</label>
                  <select defaultValue={editProduct?.difficulty} className="w-full px-4 py-3 rounded-xl border border-border bg-input-background outline-none focus:border-primary/50 text-sm">
                    {["Beginner", "Intermediate", "Advanced"].map(d => <option key={d}>{d}</option>)}
                  </select>
                </div>
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
                <button onClick={() => setModalOpen(false)} className="flex-1 py-3 rounded-xl border border-border text-sm font-medium hover:bg-muted transition-colors">Cancel</button>
                <button onClick={() => setModalOpen(false)} className="flex-1 py-3 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors">
                  {editProduct ? "Save Changes" : "Create Product"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
