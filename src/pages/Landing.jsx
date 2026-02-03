import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { EnergyOrb, Leaderboard3D } from "@/components/shaders";

export default function Landing() {
  return (
    <div className="min-h-screen bg-white text-[#111] overflow-x-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-white/90 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 sm:gap-3">
            <img src="/logo.png" alt="GymGraph" className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl" />
            <span className="text-lg sm:text-xl font-bold text-[#111]">GymGraph</span>
          </Link>
          <div className="flex items-center gap-4 sm:gap-8">
            <Link to="/about" className="text-gray-600 hover:text-[#111] text-sm font-medium">About</Link>
            <Link to="/contact" className="text-gray-600 hover:text-[#111] text-sm font-medium">Contact</Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative min-h-screen flex items-center justify-center px-4 sm:px-6">
        <div className="absolute inset-0 z-0 opacity-60">
          <EnergyOrb />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-white via-white/50 to-white z-[1]" />

        <div className="max-w-3xl mx-auto text-center relative z-10">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black leading-[0.95] tracking-tight"
          >
            <span className="text-[#111]">Stop making</span>
            <br />
            <span className="bg-gradient-to-r from-[#0066FF] to-[#00D4AA] bg-clip-text text-transparent">excuses.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-6 text-base sm:text-lg text-gray-600 max-w-md mx-auto"
          >
            The only fitness app that knows when you're lying to yourself.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-8"
          >
            <span className="inline-flex items-center gap-2 px-5 py-2.5 bg-gray-50 rounded-full border border-gray-200 text-gray-700 text-sm font-medium">
              <span className="w-1.5 h-1.5 bg-[#00D4AA] rounded-full animate-pulse" />
              Coming to iOS & Android
            </span>
          </motion.div>
        </div>
      </section>

      {/* Core Value */}
      <section className="relative py-16 sm:py-20 px-4 sm:px-6 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#111] mb-6">
              You don't need another workout plan.
              <br />
              <span className="text-gray-500">You need someone watching.</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-10">
              {[
                { title: "Show up", desc: "You either did or you didn't. No more lying in your notes app." },
                { title: "Build streaks", desc: "The fear of losing your streak is stronger than any motivation." },
                { title: "Be seen", desc: "When others are watching, you don't skip leg day." }
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="text-left bg-white p-6 rounded-2xl border border-gray-100"
                >
                  <div className="text-[#0066FF] text-sm font-medium mb-2">0{i + 1}</div>
                  <h3 className="text-lg font-semibold text-[#111] mb-2">{item.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Leaderboard */}
      <section className="relative min-h-[55vh] sm:min-h-[60vh] flex items-center justify-center px-4 sm:px-6 bg-white">
        <div className="absolute inset-0 z-0 opacity-80">
          <Leaderboard3D />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-white via-transparent to-white z-[1]" />

        <div className="max-w-2xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#111] mb-3 drop-shadow-sm">
              Prove yourself
            </h2>
            <p className="text-gray-700 text-base sm:text-lg font-medium">
              Your consistency earns you status.
              <br className="hidden sm:block" />
              Top the leaderboard. Earn respect. Get rewarded.
            </p>
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative py-16 sm:py-20 px-4 sm:px-6 bg-white">
        <div className="max-w-2xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-xl sm:text-2xl md:text-3xl text-gray-500 leading-relaxed">
              For people who are done pretending
              <br />
              <span className="text-[#111] font-medium">they'll start tomorrow.</span>
            </p>

            <div className="mt-8">
              <div className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-[#0066FF] to-[#00D4AA] rounded-full text-white font-medium shadow-lg shadow-[#0066FF]/20">
                <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
                Launching Soon
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-6 px-4 sm:px-6 border-t border-gray-100 bg-white">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <img src="/logo.png" alt="GymGraph" className="w-6 h-6 rounded" />
            <span className="text-sm text-gray-600">GymGraph</span>
          </div>
          <div className="flex items-center gap-6 text-sm text-gray-500">
            <Link to="/about" className="hover:text-gray-700">About</Link>
            <Link to="/contact" className="hover:text-gray-700">Contact</Link>
            <Link to="/terms" className="hover:text-gray-700">Terms</Link>
            <Link to="/privacy" className="hover:text-gray-700">Privacy</Link>
          </div>
          <span className="text-xs text-gray-400">© {new Date().getFullYear()}</span>
        </div>
      </footer>
    </div>
  );
}
