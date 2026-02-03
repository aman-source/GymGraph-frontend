import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  Target,
  Users,
  Heart,
  Zap,
  Trophy,
  Flame,
} from "lucide-react";

export default function About() {
  const values = [
    {
      icon: Target,
      title: "Accountability First",
      description:
        "We believe real progress comes from showing up consistently. When you can't lie to yourself, you finally start making progress.",
      color: "#0066FF",
    },
    {
      icon: Users,
      title: "Community Driven",
      description:
        "Fitness is better when others are watching. Connect with people at your gym who push you to be better.",
      color: "#00C853",
    },
    {
      icon: Heart,
      title: "No Judgment Zone",
      description:
        "Whether you're a beginner or advanced, everyone's journey is valid. We celebrate consistency over perfection.",
      color: "#FF6B35",
    },
    {
      icon: Zap,
      title: "Simple & Effective",
      description:
        "No complicated features or overwhelming data. Just the essentials that actually help you stay consistent.",
      color: "#8B5CF6",
    },
  ];

  const team = [
    {
      name: "The Vision",
      description:
        "GymGraph was born from a simple frustration: why is it so hard to stay consistent at the gym? We built the app we wished existed.",
    },
    {
      name: "The Mission",
      description:
        "To make gym consistency as natural as brushing your teeth. Through community, accountability, and the right incentives.",
    },
    {
      name: "The Promise",
      description:
        "We'll never sell your data, spam you with notifications, or make the app complicated. Fitness should be simple.",
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-xl border-b border-[#E5E7EB]/50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <img src="/logo.png" alt="GymGraph" className="w-10 h-10 rounded-xl" />
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
            About GymGraph
          </h1>
          <p className="text-xl text-[#555555] leading-relaxed max-w-2xl mx-auto">
            We're building the fitness accountability platform we always wanted.
            Simple, honest, and focused on what actually works: showing up.
          </p>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-16 px-6 bg-[#F8F9FA]">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-[#111111] mb-8 text-center">
            Our Story
          </h2>
          <div className="prose prose-lg max-w-none text-[#555555]">
            <p className="mb-6">
              GymGraph started with a simple observation: most people who sign
              up for gym memberships stop going within the first few months. Not
              because they don't want to get fit, but because it's hard to stay
              motivated alone.
            </p>
            <p className="mb-6">
              We realized that what works isn't another workout tracker or
              calorie counter. What works is{" "}
              <strong className="text-[#111111]">accountability</strong> - having
              people who know when you showed up and when you didn't.
            </p>
            <p>
              That's why we built GymGraph. Check-ins you can't fake,
              a community of people at your gym rooting for you, and
              the satisfaction of building a streak you refuse to break.
            </p>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-[#111111] mb-12 text-center">
            What We Believe
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            {values.map((value, index) => (
              <div
                key={index}
                className="bg-white p-8 rounded-2xl border border-[#E5E7EB] hover:shadow-lg transition-all duration-300"
              >
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5"
                  style={{ backgroundColor: `${value.color}15` }}
                >
                  <value.icon
                    className="w-7 h-7"
                    style={{ color: value.color }}
                  />
                </div>
                <h3 className="text-xl font-semibold text-[#111111] mb-3">
                  {value.title}
                </h3>
                <p className="text-[#555555] leading-relaxed">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 px-6 bg-gradient-to-br from-[#0066FF] to-[#0052CC]">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            {team.map((item, index) => (
              <div key={index} className="text-center">
                <h3 className="text-xl font-semibold text-white mb-4">
                  {item.name}
                </h3>
                <p className="text-white/70 leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Highlight */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-[#111111] mb-8">
            What Makes Us Different
          </h2>
          <div className="grid sm:grid-cols-3 gap-8">
            <div className="p-6">
              <div className="w-12 h-12 bg-[#0066FF]/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Target className="w-6 h-6 text-[#0066FF]" />
              </div>
              <h3 className="font-semibold text-[#111111] mb-2">
                No More Lying
              </h3>
              <p className="text-sm text-[#555555]">
                You either showed up or you didn't. The app knows the truth.
              </p>
            </div>
            <div className="p-6">
              <div className="w-12 h-12 bg-[#FF6B35]/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Flame className="w-6 h-6 text-[#FF6B35]" />
              </div>
              <h3 className="font-semibold text-[#111111] mb-2">
                Fear of Breaking
              </h3>
              <p className="text-sm text-[#555555]">
                Your streak becomes your identity. You won't let it die.
              </p>
            </div>
            <div className="p-6">
              <div className="w-12 h-12 bg-[#8B5CF6]/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Trophy className="w-6 h-6 text-[#8B5CF6]" />
              </div>
              <h3 className="font-semibold text-[#111111] mb-2">
                Social Pressure
              </h3>
              <p className="text-sm text-[#555555]">
                When your gym knows your rank, skipping isn't an option.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-6 bg-gradient-to-br from-[#0066FF] via-[#0052CC] to-[#003D99]">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-lg text-white/80 mb-8 max-w-2xl mx-auto">
            Join the community of fitness enthusiasts who chose accountability
            over excuses.
          </p>
          <Link to="/">
            <Button
              size="lg"
              className="bg-white text-[#0066FF] hover:bg-[#F8F9FA] text-lg px-10 py-6 rounded-xl font-semibold shadow-lg transition-all duration-200 hover:-translate-y-0.5"
            >
              Get Started Free
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 bg-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="GymGraph" className="w-8 h-8 rounded-lg" />
            <span className="font-semibold text-[#111111]">GymGraph</span>
          </div>
          <div className="flex items-center gap-6">
            <Link
              to="/contact"
              className="text-gray-400 hover:text-gray-600 transition-colors text-sm"
            >
              Contact
            </Link>
            <Link
              to="/terms"
              className="text-gray-400 hover:text-gray-600 transition-colors text-sm"
            >
              Terms
            </Link>
            <Link
              to="/privacy"
              className="text-gray-400 hover:text-gray-600 transition-colors text-sm"
            >
              Privacy
            </Link>
          </div>
          <p className="text-gray-300 text-sm">
            © {new Date().getFullYear()} GymGraph
          </p>
        </div>
      </footer>
    </div>
  );
}
