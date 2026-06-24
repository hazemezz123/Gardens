import { useState } from "react";
import { Mail, Phone, MapPin, ChevronDown, Check } from "lucide-react";
import { toast } from "sonner";
import { useFaqs } from "../../hooks/useFaqs";
import { useCreateEnquiry } from "../../hooks/useEnquiries";

export function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [sent, setSent] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const { data: faqs = [] } = useFaqs();
  const createEnquiry = useCreateEnquiry();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createEnquiry.mutateAsync(form);
      setSent(true);
      toast.success("Message sent! We'll reply within one day.");
    } catch {
      toast.error("Failed to send. Please try again.");
    }
  };

  return (
    <main>
      <section className="py-16 bg-secondary border-b border-border text-center">
        <p className="text-sm font-medium text-accent uppercase tracking-widest mb-2">Get In Touch</p>
        <h1 className="text-5xl font-semibold text-foreground mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>Contact Us</h1>
        <p className="text-muted-foreground max-w-sm mx-auto">We're real people who love gardening. We'll get back to you within one working day.</p>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 mb-16">
          <div className="lg:col-span-2 bg-card rounded-2xl border border-border p-8">
            <h2 className="text-2xl font-semibold text-foreground mb-6" style={{ fontFamily: "'Playfair Display', serif" }}>Send a Message</h2>
            {sent ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-5">
                  <Check size={28} className="text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>Message Sent!</h3>
                <p className="text-muted-foreground text-sm">Thanks for reaching out. We'll reply within one working day.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="text-sm font-medium text-foreground block mb-1.5">Name</label>
                    <input required value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Sophie Lane"
                      className="w-full px-4 py-3 rounded-xl border border-border bg-input-background outline-none focus:border-primary/50 text-sm transition-colors" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground block mb-1.5">Email</label>
                    <input required type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} placeholder="sophie@example.com"
                      className="w-full px-4 py-3 rounded-xl border border-border bg-input-background outline-none focus:border-primary/50 text-sm transition-colors" />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground block mb-1.5">Subject</label>
                  <input required value={form.subject} onChange={e => setForm(f => ({ ...f, subject: e.target.value }))} placeholder="My order / product question / general enquiry"
                    className="w-full px-4 py-3 rounded-xl border border-border bg-input-background outline-none focus:border-primary/50 text-sm transition-colors" />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground block mb-1.5">Message</label>
                  <textarea required rows={6} value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))} placeholder="Tell us how we can help…"
                    className="w-full px-4 py-3 rounded-xl border border-border bg-input-background outline-none focus:border-primary/50 text-sm resize-none transition-colors" />
                </div>
                <button type="submit" className="bg-primary text-primary-foreground font-semibold px-8 py-3.5 rounded-xl hover:bg-primary/90 transition-colors">
                  Send Message
                </button>
              </form>
            )}
          </div>

          <div className="space-y-5">
            {[
              { Icon: Mail, label: "Email", value: "hello@gardens.co", sub: "We reply within 1 working day" },
              { Icon: Phone, label: "Phone", value: "+44 20 7946 0123", sub: "Mon–Fri, 9am–5pm GMT" },
              { Icon: MapPin, label: "Address", value: "12 Bloom Lane, London EC1A 2BB", sub: "Not open to the public" },
            ].map(({ Icon, label, value, sub }) => (
              <div key={label} className="bg-card border border-border rounded-2xl p-5 flex gap-4">
                <div className="w-11 h-11 bg-primary/10 rounded-xl flex items-center justify-center shrink-0">
                  <Icon size={18} className="text-primary" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-0.5">{label}</p>
                  <p className="text-sm font-medium text-foreground">{value}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{sub}</p>
                </div>
              </div>
            ))}

            <div className="bg-secondary border border-border rounded-2xl overflow-hidden aspect-video flex items-center justify-center">
              <div className="text-center">
                <MapPin size={32} className="text-primary/40 mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">12 Bloom Lane, London</p>
                <p className="text-xs text-muted-foreground/60">EC1A 2BB</p>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-semibold text-foreground text-center mb-8" style={{ fontFamily: "'Playfair Display', serif" }}>Frequently Asked Questions</h2>
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <div key={i} className="bg-card border border-border rounded-xl overflow-hidden">
                <button onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between px-5 py-4 text-left">
                  <span className="text-sm font-medium text-foreground pr-4">{faq.question}</span>
                  <ChevronDown size={16} className={`text-muted-foreground shrink-0 transition-transform ${openFaq === i ? "rotate-180" : ""}`} />
                </button>
                {openFaq === i && (
                  <div className="px-5 pb-4 text-sm text-muted-foreground leading-relaxed border-t border-border pt-3">{faq.answer}</div>
                )}
                </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
