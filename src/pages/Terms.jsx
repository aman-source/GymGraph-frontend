import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

// GymGraph Mountain Logo Component
const GymGraphLogo = ({ className = "w-6 h-6", color = "white" }) => (
  <svg viewBox="0 0 512 512" className={className} fill={color}>
    <polygon points="80,400 220,160 320,400" />
    <polygon points="200,400 340,100 460,400" />
  </svg>
);

export default function Terms() {
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

      {/* Content */}
      <div className="pt-32 pb-16 px-6">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold text-[#111111] mb-4">
            Terms and Conditions
          </h1>
          <p className="text-[#555555] mb-12">
            Last updated: {new Date().toLocaleDateString("en-IN", { month: "long", day: "numeric", year: "numeric" })}
          </p>

          <div className="prose prose-lg max-w-none">
            <section className="mb-10">
              <h2 className="text-2xl font-semibold text-[#111111] mb-4">
                1. Acceptance of Terms
              </h2>
              <p className="text-[#555555] leading-relaxed mb-4">
                By accessing and using GymGraph ("the Service"), you agree to be
                bound by these Terms and Conditions. If you do not agree to
                these terms, please do not use the Service.
              </p>
              <p className="text-[#555555] leading-relaxed">
                We reserve the right to modify these terms at any time. Your
                continued use of the Service after any changes constitutes your
                acceptance of the new terms.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-semibold text-[#111111] mb-4">
                2. Description of Service
              </h2>
              <p className="text-[#555555] leading-relaxed mb-4">
                GymGraph is a fitness accountability platform that provides:
              </p>
              <ul className="list-disc pl-6 text-[#555555] space-y-2 mb-4">
                <li>GPS-verified gym check-ins</li>
                <li>Streak tracking and progress monitoring</li>
                <li>Community features and gym leaderboards</li>
                <li>Challenges and rewards system</li>
                <li>Social connections with other gym members</li>
              </ul>
              <p className="text-[#555555] leading-relaxed">
                The Service is provided "as is" and we make no warranties about
                its availability, reliability, or fitness for any particular
                purpose.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-semibold text-[#111111] mb-4">
                3. User Accounts
              </h2>
              <p className="text-[#555555] leading-relaxed mb-4">
                To use GymGraph, you must create an account. You are responsible
                for:
              </p>
              <ul className="list-disc pl-6 text-[#555555] space-y-2 mb-4">
                <li>Providing accurate and complete information</li>
                <li>Maintaining the security of your account credentials</li>
                <li>All activities that occur under your account</li>
                <li>Notifying us immediately of any unauthorized access</li>
              </ul>
              <p className="text-[#555555] leading-relaxed">
                You must be at least 13 years old to use the Service. By using
                GymGraph, you represent that you meet this age requirement.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-semibold text-[#111111] mb-4">
                4. Acceptable Use
              </h2>
              <p className="text-[#555555] leading-relaxed mb-4">
                You agree not to:
              </p>
              <ul className="list-disc pl-6 text-[#555555] space-y-2">
                <li>Use the Service for any illegal purpose</li>
                <li>Attempt to manipulate GPS location or fake check-ins</li>
                <li>Harass, abuse, or harm other users</li>
                <li>Upload false, misleading, or inappropriate content</li>
                <li>Attempt to access other users' accounts</li>
                <li>Interfere with or disrupt the Service</li>
                <li>Use automated systems or bots to access the Service</li>
                <li>Collect personal information of other users without consent</li>
              </ul>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-semibold text-[#111111] mb-4">
                5. Challenges and Stakes
              </h2>
              <p className="text-[#555555] leading-relaxed mb-4">
                GymGraph may offer stake-based challenges where users can commit
                money to fitness goals. By participating:
              </p>
              <ul className="list-disc pl-6 text-[#555555] space-y-2 mb-4">
                <li>You acknowledge that stakes are non-refundable once committed</li>
                <li>
                  Winnings are distributed according to challenge rules
                </li>
                <li>We are not responsible for any financial losses from challenges</li>
                <li>
                  Stake challenges are subject to local laws and regulations
                </li>
              </ul>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-semibold text-[#111111] mb-4">
                6. Location Data
              </h2>
              <p className="text-[#555555] leading-relaxed mb-4">
                GymGraph uses your device's GPS to verify gym check-ins. By
                using the Service:
              </p>
              <ul className="list-disc pl-6 text-[#555555] space-y-2">
                <li>
                  You consent to the collection of location data during check-ins
                </li>
                <li>Location data is only collected when you initiate a check-in</li>
                <li>
                  We do not track your location outside of the check-in process
                </li>
                <li>You can disable location services, but this will prevent check-ins</li>
              </ul>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-semibold text-[#111111] mb-4">
                7. Intellectual Property
              </h2>
              <p className="text-[#555555] leading-relaxed">
                All content, features, and functionality of GymGraph, including
                but not limited to text, graphics, logos, and software, are
                owned by GymGraph and are protected by copyright and other
                intellectual property laws. You may not reproduce, distribute,
                or create derivative works without our express written consent.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-semibold text-[#111111] mb-4">
                8. Termination
              </h2>
              <p className="text-[#555555] leading-relaxed mb-4">
                We may terminate or suspend your account at any time, without
                prior notice, for conduct that we believe:
              </p>
              <ul className="list-disc pl-6 text-[#555555] space-y-2 mb-4">
                <li>Violates these Terms and Conditions</li>
                <li>Is harmful to other users or third parties</li>
                <li>Could damage our reputation or business</li>
              </ul>
              <p className="text-[#555555] leading-relaxed">
                You may delete your account at any time through the app
                settings. Upon termination, your right to use the Service will
                immediately cease.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-semibold text-[#111111] mb-4">
                9. Disclaimer of Warranties
              </h2>
              <p className="text-[#555555] leading-relaxed">
                THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT ANY
                WARRANTIES OF ANY KIND, EXPRESS OR IMPLIED. WE DO NOT GUARANTEE
                THAT THE SERVICE WILL BE UNINTERRUPTED, SECURE, OR ERROR-FREE.
                WE ARE NOT RESPONSIBLE FOR ANY FITNESS RESULTS OR LACK THEREOF
                FROM USING THE SERVICE.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-semibold text-[#111111] mb-4">
                10. Limitation of Liability
              </h2>
              <p className="text-[#555555] leading-relaxed">
                IN NO EVENT SHALL GYMGRAPH BE LIABLE FOR ANY INDIRECT,
                INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES,
                INCLUDING BUT NOT LIMITED TO LOSS OF PROFITS, DATA, OR USE,
                ARISING OUT OF OR IN CONNECTION WITH YOUR USE OF THE SERVICE.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-semibold text-[#111111] mb-4">
                11. Governing Law
              </h2>
              <p className="text-[#555555] leading-relaxed">
                These Terms shall be governed by and construed in accordance
                with the laws of India, without regard to its conflict of law
                provisions. Any disputes arising under these terms shall be
                subject to the exclusive jurisdiction of the courts in
                Hyderabad, India.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-semibold text-[#111111] mb-4">
                12. Contact Us
              </h2>
              <p className="text-[#555555] leading-relaxed">
                If you have any questions about these Terms and Conditions,
                please contact us at:
              </p>
              <p className="text-[#0066FF] mt-2">legal@gymgraph.com</p>
            </section>
          </div>
        </div>
      </div>

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
              to="/contact"
              className="text-[#888888] hover:text-white transition-colors text-sm"
            >
              Contact
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
