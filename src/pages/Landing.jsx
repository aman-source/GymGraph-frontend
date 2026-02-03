import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { EnergyOrb, Leaderboard3D } from "@/components/shaders";

export default function Landing() {
  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white overflow-x-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-[#0A0A0A]/80 border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 sm:gap-3">
            <img src="/logo.png" alt="GymGraph" className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl" />
            <span className="text-lg sm:text-xl font-bold text-white">GymGraph</span>
          </Link>
          <div className="flex items-center gap-4 sm:gap-8">
            <Link to="/about" className="text-white/50 hover:text-white text-sm font-medium">About</Link>
            <Link to="/contact" className="text-white/50 hover:text-white text-sm font-medium">Contact</Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative min-h-screen flex items-center justify-center px-4 sm:px-6">
        <div className="absolute inset-0 z-0">
          <EnergyOrb />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-[#0A0A0A] via-transparent to-[#0A0A0A] z-[1]" />

        <div className="max-w-3xl mx-auto text-center relative z-10">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black leading-[0.95] tracking-tight"
          >
            <span className="text-white">Stop making</span>
            <br />
            <span className="bg-gradient-to-r from-[#0066FF] to-[#00D4AA] bg-clip-text text-transparent">excuses.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-6 text-base sm:text-lg text-white/50 max-w-md mx-auto"
          >
            GPS-verified check-ins. Real accountability. No lying to yourself.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-8"
          >
            <span className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/5 rounded-full border border-white/10 text-white/70 text-sm">
              <span className="w-1.5 h-1.5 bg-[#00D4AA] rounded-full animate-pulse" />
              Coming to iOS & Android
            </span>
          </motion.div>
        </div>
      </section>

      {/* Core Value */}
      <section className="relative py-24 sm:py-32 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-8">
              You don't need another workout plan.
              <br />
              <span className="text-white/40">You need someone watching.</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mt-16">
              {[
                { title: "Check in", desc: "GPS-verified. You either showed up, or you didn't." },
                { title: "Build streaks", desc: "The guilt of breaking your streak beats any motivation." },
                { title: "Compete", desc: "See where you rank against others at your gym." }
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="text-left"
                >
                  <div className="text-[#0066FF] text-sm font-medium mb-2">0{i + 1}</div>
                  <h3 className="text-lg font-semibold text-white mb-2">{item.title}</h3>
                  <p className="text-white/40 text-sm leading-relaxed">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Leaderboard */}
      <section className="relative min-h-[70vh] sm:min-h-[80vh] flex items-center justify-center px-4 sm:px-6">
        <div className="absolute inset-0 z-0">
          <Leaderboard3D />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-[#0A0A0A] via-transparent to-[#0A0A0A] z-[1]" />

        <div className="max-w-2xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
              Climb the ranks
            </h2>
            <p className="text-white/40 text-base sm:text-lg">
              Every check-in earns coins. Maintain streaks for bonuses.
              <br className="hidden sm:block" />
              Redeem for real rewards from 500+ fitness brands.
            </p>
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative py-24 sm:py-32 px-4 sm:px-6">
        <div className="max-w-2xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-xl sm:text-2xl md:text-3xl text-white/60 leading-relaxed">
              For people who are done pretending
              <br />
              <span className="text-white font-medium">they'll start tomorrow.</span>
            </p>

            <div className="mt-10">
              <div className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-[#0066FF] to-[#00D4AA] rounded-full text-white font-medium">
                <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
                Launching Soon
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 sm:px-6 border-t border-white/5">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <img src="/logo.png" alt="GymGraph" className="w-6 h-6 rounded" />
            <span className="text-sm text-white/50">GymGraph</span>
          </div>
          <div className="flex items-center gap-6 text-sm text-white/30">
            <Link to="/about" className="hover:text-white/60">About</Link>
            <Link to="/contact" className="hover:text-white/60">Contact</Link>
            <Link to="/terms" className="hover:text-white/60">Terms</Link>
            <Link to="/privacy" className="hover:text-white/60">Privacy</Link>
          </div>
          <span className="text-xs text-white/20">© {new Date().getFullYear()}</span>
        </div>
      </footer>
    </div>
  );
}
