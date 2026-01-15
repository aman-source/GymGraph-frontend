import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  ArrowLeft,
  Mail,
  MessageSquare,
  Send,
  CheckCircle2,
  MapPin,
  Clock,
} from "lucide-react";

// GymGraph Mountain Logo Component
const GymGraphLogo = ({ className = "w-6 h-6", color = "white" }) => (
  <svg viewBox="0 0 512 512" className={className} fill={color}>
    <polygon points="80,400 220,160 320,400" />
    <polygon points="200,400 340,100 460,400" />
  </svg>
);

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 1000));

    setSubmitted(true);
    setLoading(false);
  };

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const contactInfo = [
    {
      icon: Mail,
      title: "Email Us",
      detail: "support@gymgraph.com",
      description: "For general inquiries and support",
    },
    {
      icon: MessageSquare,
      title: "Feedback",
      detail: "feedback@gymgraph.com",
      description: "Share your ideas and suggestions",
    },
    {
      icon: Clock,
      title: "Response Time",
      detail: "Within 24 hours",
      description: "We aim to respond quickly",
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-xl border-b border-[#E5E7EB]/50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-[#0066FF] to-[#0052CC] rounded-xl flex items-center justify-center shadow-md shadow-[#0066FF]/20">
              <GymGraphLogo className="w-6 h-6" />
            </div>
            <span className="text-xl font-bold text-[#111111]">GymGraph</span>
          </Link>
          <Link to="/">
            <Button
              variant="ghost"
              className="text-[#555555] hover:text-[#111111] font-medium"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-[#111111] mb-6">
            Get in Touch
          </h1>
          <p className="text-xl text-[#555555] leading-relaxed max-w-2xl mx-auto">
            Have questions, feedback, or need help? We'd love to hear from you.
            Our team is here to assist.
          </p>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="py-8 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="grid sm:grid-cols-3 gap-6">
            {contactInfo.map((item, index) => (
              <div
                key={index}
                className="bg-[#F8F9FA] p-6 rounded-2xl border border-[#E5E7EB] text-center"
              >
                <div className="w-12 h-12 bg-[#0066FF]/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <item.icon className="w-6 h-6 text-[#0066FF]" />
                </div>
                <h3 className="font-semibold text-[#111111] mb-1">
                  {item.title}
                </h3>
                <p className="text-[#0066FF] font-medium mb-1">{item.detail}</p>
                <p className="text-sm text-[#555555]">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="py-16 px-6">
        <div className="max-w-2xl mx-auto">
          {submitted ? (
            <div className="bg-[#F8F9FA] rounded-2xl p-12 text-center border border-[#E5E7EB]">
              <div className="w-16 h-16 bg-[#00C853]/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="w-8 h-8 text-[#00C853]" />
              </div>
              <h2 className="text-2xl font-bold text-[#111111] mb-4">
                Message Sent!
              </h2>
              <p className="text-[#555555] mb-8">
                Thank you for reaching out. We'll get back to you within 24
                hours.
              </p>
              <Button
                onClick={() => {
                  setSubmitted(false);
                  setFormData({ name: "", email: "", subject: "", message: "" });
                }}
                variant="outline"
                className="border-[#E5E7EB] text-[#111111] hover:bg-[#F8F9FA]"
              >
                Send Another Message
              </Button>
            </div>
          ) : (
            <div className="bg-[#F8F9FA] rounded-2xl p-8 border border-[#E5E7EB]">
              <h2 className="text-2xl font-bold text-[#111111] mb-6 text-center">
                Send us a Message
              </h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-[#555555] mb-1.5 block">
                      Your Name
                    </label>
                    <Input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="John Doe"
                      required
                      className="h-12 bg-white border-[#E5E7EB] rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-[#555555] mb-1.5 block">
                      Email Address
                    </label>
                    <Input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="you@example.com"
                      required
                      className="h-12 bg-white border-[#E5E7EB] rounded-xl"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-[#555555] mb-1.5 block">
                    Subject
                  </label>
                  <Input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="How can we help?"
                    required
                    className="h-12 bg-white border-[#E5E7EB] rounded-xl"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-[#555555] mb-1.5 block">
                    Message
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Tell us more about your inquiry..."
                    required
                    rows={5}
                    className="w-full px-4 py-3 bg-white border border-[#E5E7EB] rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-[#0066FF]/20 focus:border-[#0066FF]"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full h-14 bg-[#0066FF] hover:bg-[#0052CC] text-white rounded-xl font-semibold text-lg transition-all duration-200"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <Send className="w-5 h-5 mr-2" />
                      Send Message
                    </>
                  )}
                </Button>
              </form>
            </div>
          )}
        </div>
      </section>

      {/* FAQ Teaser */}
      <section className="py-16 px-6 bg-[#F8F9FA]">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-[#111111] mb-4">
            Common Questions
          </h2>
          <p className="text-[#555555] mb-8">
            Before reaching out, you might find your answer here.
          </p>
          <div className="grid sm:grid-cols-2 gap-6 text-left">
            <div className="bg-white p-6 rounded-xl border border-[#E5E7EB]">
              <h3 className="font-semibold text-[#111111] mb-2">
                How does GPS check-in work?
              </h3>
              <p className="text-sm text-[#555555]">
                When you're at your gym, open the app and tap check-in. We
                verify your location to confirm you're actually there.
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl border border-[#E5E7EB]">
              <h3 className="font-semibold text-[#111111] mb-2">
                Is my location data private?
              </h3>
              <p className="text-sm text-[#555555]">
                Absolutely. We only use location during check-in and never track
                you outside the app. Your privacy is our priority.
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl border border-[#E5E7EB]">
              <h3 className="font-semibold text-[#111111] mb-2">
                Can I use GymGraph at any gym?
              </h3>
              <p className="text-sm text-[#555555]">
                Yes! You can add any gym to GymGraph. If it's not in our system,
                you can submit it and we'll add it.
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl border border-[#E5E7EB]">
              <h3 className="font-semibold text-[#111111] mb-2">
                How do I report a bug?
              </h3>
              <p className="text-sm text-[#555555]">
                Use the contact form above or email us directly. Please include
                as much detail as possible about what happened.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 bg-[#111111]">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-[#0066FF] to-[#0052CC] rounded-lg flex items-center justify-center">
              <GymGraphLogo className="w-5 h-5" />
            </div>
            <span className="font-semibold text-white">GymGraph</span>
          </div>
          <div className="flex items-center gap-6">
            <Link
              to="/about"
              className="text-[#888888] hover:text-white transition-colors text-sm"
            >
              About
            </Link>
            <Link
              to="/terms"
              className="text-[#888888] hover:text-white transition-colors text-sm"
            >
              Terms
            </Link>
            <Link
              to="/privacy"
              className="text-[#888888] hover:text-white transition-colors text-sm"
            >
              Privacy
            </Link>
          </div>
          <p className="text-[#888888] text-sm">
            © {new Date().getFullYear()} GymGraph
          </p>
        </div>
      </footer>
    </div>
  );
}
