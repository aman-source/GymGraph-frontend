import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, MapPin, Coins, Users, Shield, AlertTriangle } from "lucide-react";

export default function Terms() {
  const keyPoints = [
    {
      icon: MapPin,
      title: "Location Verification",
      description: "Check-ins require GPS verification. No location spoofing allowed.",
    },
    {
      icon: Coins,
      title: "Virtual Currency",
      description: "Coins have no monetary value and are non-refundable.",
    },
    {
      icon: Users,
      title: "Community Rules",
      description: "Respect other users. No harassment, cheating, or abuse.",
    },
    {
      icon: Shield,
      title: "Account Security",
      description: "You're responsible for keeping your account secure.",
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

      {/* Hero */}
      <section className="pt-32 pb-8 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl font-bold text-[#111111] mb-4">
            Terms of Service
          </h1>
          <p className="text-[#555555]">
            Last updated: January 19, 2026
          </p>
        </div>
      </section>

      {/* Key Points */}
      <section className="py-8 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="grid sm:grid-cols-2 gap-4">
            {keyPoints.map((item, index) => (
              <div
                key={index}
                className="bg-[#F8F9FA] p-6 rounded-xl border border-[#E5E7EB] flex gap-4"
              >
                <div className="w-10 h-10 bg-[#0066FF]/10 rounded-lg flex items-center justify-center shrink-0">
                  <item.icon className="w-5 h-5 text-[#0066FF]" />
                </div>
                <div>
                  <h3 className="font-semibold text-[#111111] mb-1">
                    {item.title}
                  </h3>
                  <p className="text-sm text-[#555555]">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Content */}
      <div className="py-12 px-6">
        <div className="max-w-3xl mx-auto">
          <div className="prose prose-lg max-w-none">
            <section className="mb-10">
              <h2 className="text-2xl font-semibold text-[#111111] mb-4">
                1. Agreement to Terms
              </h2>
              <p className="text-[#555555] leading-relaxed mb-4">
                Welcome to GymGraph! These Terms of Service ("Terms") govern your use of the GymGraph
                mobile application and website ("Service") operated by GymGraph ("we," "us," or "our").
              </p>
              <p className="text-[#555555] leading-relaxed">
                By downloading, installing, or using the Service, you agree to be bound by these Terms.
                If you do not agree to these Terms, do not use the Service.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-semibold text-[#111111] mb-4">
                2. Eligibility
              </h2>
              <p className="text-[#555555] leading-relaxed">
                You must be at least 13 years old to use the Service. If you are under 18, you must have
                permission from a parent or guardian. By using the Service, you represent that you meet
                these requirements.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-semibold text-[#111111] mb-4">
                3. Account Registration
              </h2>
              <h3 className="text-lg font-medium text-[#111111] mt-6 mb-3">
                3.1 Creating an Account
              </h3>
              <p className="text-[#555555] leading-relaxed mb-4">
                To use certain features of the Service, you must create an account. You may register using:
              </p>
              <ul className="list-disc pl-6 text-[#555555] space-y-2 mb-4">
                <li>Email and password</li>
                <li>Google OAuth (Sign in with Google)</li>
              </ul>

              <h3 className="text-lg font-medium text-[#111111] mt-6 mb-3">
                3.2 Account Responsibilities
              </h3>
              <p className="text-[#555555] leading-relaxed mb-4">
                You are responsible for:
              </p>
              <ul className="list-disc pl-6 text-[#555555] space-y-2">
                <li>Providing accurate and complete information</li>
                <li>Maintaining the security of your account credentials</li>
                <li>All activities that occur under your account</li>
                <li>Notifying us immediately of any unauthorized use</li>
              </ul>
              <p className="text-[#555555] leading-relaxed mt-4">
                We reserve the right to suspend or terminate accounts that violate these Terms.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-semibold text-[#111111] mb-4">
                4. Description of Services
              </h2>
              <p className="text-[#555555] leading-relaxed mb-4">
                GymGraph provides fitness tracking and social features including:
              </p>
              <ul className="list-disc pl-6 text-[#555555] space-y-2">
                <li><strong>Gym Check-ins:</strong> Location-verified check-ins at gym locations</li>
                <li><strong>Workout Tracking:</strong> Logging various workout types and activities</li>
                <li><strong>Streaks:</strong> Tracking consecutive days of gym visits</li>
                <li><strong>Leaderboards:</strong> Competitive rankings among users</li>
                <li><strong>Challenges:</strong> Time-limited fitness competitions with coin rewards</li>
                <li><strong>Social Features:</strong> Connecting with other users and viewing their activity</li>
                <li><strong>Rewards System:</strong> Virtual coins earned through activities</li>
              </ul>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-semibold text-[#111111] mb-4">
                5. Location Services
              </h2>
              <h3 className="text-lg font-medium text-[#111111] mt-6 mb-3">
                5.1 How We Use Location
              </h3>
              <p className="text-[#555555] leading-relaxed mb-4">
                The Service requires access to your device's location to verify gym check-ins:
              </p>
              <ul className="list-disc pl-6 text-[#555555] space-y-2 mb-4">
                <li>Location data is collected only when you initiate a check-in</li>
                <li>Used to confirm you are physically present at a gym</li>
                <li>Not tracked in the background or when the app is closed</li>
              </ul>

              <h3 className="text-lg font-medium text-[#111111] mt-6 mb-3">
                5.2 Location Requirements
              </h3>
              <p className="text-[#555555] leading-relaxed">
                You must be within the designated check-in radius of a gym to complete a check-in.
                <strong> Attempting to spoof or falsify your location is a violation of these Terms</strong> and
                will result in account suspension or termination.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-semibold text-[#111111] mb-4">
                6. Virtual Currency (Coins)
              </h2>
              <h3 className="text-lg font-medium text-[#111111] mt-6 mb-3">
                6.1 Earning Coins
              </h3>
              <p className="text-[#555555] leading-relaxed mb-4">
                You can earn virtual coins ("Coins") by:
              </p>
              <ul className="list-disc pl-6 text-[#555555] space-y-2 mb-4">
                <li>Completing gym check-ins</li>
                <li>Maintaining streaks</li>
                <li>Winning challenges</li>
                <li>Referring new users</li>
              </ul>

              <h3 className="text-lg font-medium text-[#111111] mt-6 mb-3">
                6.2 Coin Properties
              </h3>
              <ul className="list-disc pl-6 text-[#555555] space-y-2 mb-4">
                <li><strong>No Monetary Value:</strong> Coins have no monetary value and cannot be exchanged for real currency</li>
                <li><strong>Non-Transferable:</strong> Coins cannot be transferred between users except through official app features</li>
                <li><strong>Future Features:</strong> Coins may be used for future in-app features and rewards</li>
                <li><strong>Subject to Change:</strong> We reserve the right to modify the coin economy at any time</li>
              </ul>

              <h3 className="text-lg font-medium text-[#111111] mt-6 mb-3">
                6.3 No Refunds
              </h3>
              <p className="text-[#555555] leading-relaxed">
                Coins are non-refundable. If your account is terminated for violating these Terms, you forfeit
                all accumulated Coins.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-semibold text-[#111111] mb-4">
                7. Challenges
              </h2>
              <h3 className="text-lg font-medium text-[#111111] mt-6 mb-3">
                7.1 Participation
              </h3>
              <ul className="list-disc pl-6 text-[#555555] space-y-2 mb-4">
                <li>Challenges may require an entry fee in Coins</li>
                <li>Entry fees contribute to the prize pool</li>
                <li>You must meet the challenge requirements to win</li>
              </ul>

              <h3 className="text-lg font-medium text-[#111111] mt-6 mb-3">
                7.2 Challenge Rules
              </h3>
              <ul className="list-disc pl-6 text-[#555555] space-y-2 mb-4">
                <li>Check-ins must be legitimate (no location spoofing)</li>
                <li>Multiple accounts are prohibited</li>
                <li>Collusion with other participants is prohibited</li>
              </ul>

              <h3 className="text-lg font-medium text-[#111111] mt-6 mb-3">
                7.3 Cancellation and Refunds
              </h3>
              <ul className="list-disc pl-6 text-[#555555] space-y-2 mb-4">
                <li>Challenges may be cancelled if minimum participation is not met</li>
                <li>In case of cancellation, entry fees will be refunded</li>
                <li>We reserve the right to cancel challenges for any reason</li>
              </ul>

              <h3 className="text-lg font-medium text-[#111111] mt-6 mb-3">
                7.4 Prize Distribution
              </h3>
              <ul className="list-disc pl-6 text-[#555555] space-y-2">
                <li>Prizes are distributed based on challenge rules</li>
                <li>We reserve the right to investigate suspicious activity</li>
                <li>Users found cheating will be disqualified and may be banned</li>
              </ul>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-semibold text-[#111111] mb-4">
                8. User Conduct
              </h2>
              <h3 className="text-lg font-medium text-[#111111] mt-6 mb-3">
                8.1 Acceptable Use
              </h3>
              <p className="text-[#555555] leading-relaxed mb-4">
                You agree to use the Service only for lawful purposes and in accordance with these Terms.
              </p>

              <h3 className="text-lg font-medium text-[#111111] mt-6 mb-3">
                8.2 Prohibited Conduct
              </h3>
              <p className="text-[#555555] leading-relaxed mb-4">
                You agree NOT to:
              </p>

              <p className="text-[#111111] font-medium mt-4 mb-2">Cheating and Fraud:</p>
              <ul className="list-disc pl-6 text-[#555555] space-y-2 mb-4">
                <li>Use GPS spoofing or location falsification</li>
                <li>Create multiple accounts to gain unfair advantages</li>
                <li>Exploit bugs or glitches for personal gain</li>
                <li>Engage in any form of cheating in challenges</li>
              </ul>

              <p className="text-[#111111] font-medium mt-4 mb-2">Harmful Behavior:</p>
              <ul className="list-disc pl-6 text-[#555555] space-y-2 mb-4">
                <li>Harass, bully, or intimidate other users</li>
                <li>Post offensive, hateful, or discriminatory content</li>
                <li>Impersonate another person or entity</li>
                <li>Share others' personal information without consent</li>
              </ul>

              <p className="text-[#111111] font-medium mt-4 mb-2">Security Violations:</p>
              <ul className="list-disc pl-6 text-[#555555] space-y-2 mb-4">
                <li>Attempt to access other users' accounts</li>
                <li>Interfere with the Service's security features</li>
                <li>Reverse engineer or decompile the Service</li>
                <li>Use automated systems (bots, scrapers) to access the Service</li>
              </ul>

              <p className="text-[#111111] font-medium mt-4 mb-2">Misuse of Services:</p>
              <ul className="list-disc pl-6 text-[#555555] space-y-2">
                <li>Use the Service for commercial purposes without authorization</li>
                <li>Spam or send unsolicited communications</li>
                <li>Violate any applicable laws or regulations</li>
              </ul>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-semibold text-[#111111] mb-4">
                9. Intellectual Property
              </h2>
              <h3 className="text-lg font-medium text-[#111111] mt-6 mb-3">
                9.1 Our Rights
              </h3>
              <p className="text-[#555555] leading-relaxed mb-4">
                The Service and its contents, including but not limited to text, graphics, logos, icons, images,
                and software, are owned by GymGraph and protected by intellectual property laws.
              </p>

              <h3 className="text-lg font-medium text-[#111111] mt-6 mb-3">
                9.2 Limited License
              </h3>
              <p className="text-[#555555] leading-relaxed mb-4">
                We grant you a limited, non-exclusive, non-transferable, revocable license to use the Service
                for personal, non-commercial purposes in accordance with these Terms.
              </p>

              <h3 className="text-lg font-medium text-[#111111] mt-6 mb-3">
                9.3 User Content
              </h3>
              <p className="text-[#555555] leading-relaxed">
                By submitting content to the Service (such as profile information), you grant us a worldwide,
                non-exclusive, royalty-free license to use, display, and distribute that content in connection
                with the Service.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-semibold text-[#111111] mb-4">
                10. Third-Party Services
              </h2>
              <p className="text-[#555555] leading-relaxed mb-4">
                The Service integrates with third-party services including:
              </p>
              <ul className="list-disc pl-6 text-[#555555] space-y-2 mb-4">
                <li>Google (authentication, maps, location services)</li>
                <li>Supabase (backend services)</li>
                <li>Mixpanel (analytics)</li>
                <li>OneSignal (notifications)</li>
              </ul>
              <p className="text-[#555555] leading-relaxed">
                Your use of these services is subject to their respective terms and privacy policies.
                We are not responsible for third-party services.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-semibold text-[#111111] mb-4">
                11. Disclaimers
              </h2>
              <div className="bg-[#FEF3C7] border border-[#FCD34D] rounded-xl p-4 mb-4">
                <div className="flex gap-3">
                  <AlertTriangle className="w-5 h-5 text-[#92400E] shrink-0 mt-0.5" />
                  <div>
                    <p className="text-[#92400E] font-medium mb-2">"As Is" Basis</p>
                    <p className="text-[#92400E] text-sm">
                      THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND,
                      EXPRESS OR IMPLIED.
                    </p>
                  </div>
                </div>
              </div>

              <h3 className="text-lg font-medium text-[#111111] mt-6 mb-3">
                11.1 No Fitness Advice
              </h3>
              <p className="text-[#555555] leading-relaxed mb-4">
                The Service is a fitness tracking tool, not a medical or fitness advisor. We do not provide
                medical advice. Consult a healthcare professional before starting any exercise program.
              </p>

              <h3 className="text-lg font-medium text-[#111111] mt-6 mb-3">
                11.2 Service Availability
              </h3>
              <p className="text-[#555555] leading-relaxed mb-4">
                We do not guarantee the Service will be available at all times or free from errors. We may
                modify, suspend, or discontinue the Service at any time.
              </p>

              <h3 className="text-lg font-medium text-[#111111] mt-6 mb-3">
                11.3 Gym Information
              </h3>
              <p className="text-[#555555] leading-relaxed">
                We do not guarantee the accuracy of gym information, hours, or availability. Verify with
                individual gyms before visiting.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-semibold text-[#111111] mb-4">
                12. Limitation of Liability
              </h2>
              <p className="text-[#555555] leading-relaxed mb-4 uppercase text-sm">
                TO THE MAXIMUM EXTENT PERMITTED BY LAW:
              </p>
              <ul className="list-disc pl-6 text-[#555555] space-y-2">
                <li>WE SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES</li>
                <li>OUR TOTAL LIABILITY SHALL NOT EXCEED THE AMOUNT YOU PAID US IN THE PAST 12 MONTHS (IF ANY)</li>
                <li>WE ARE NOT LIABLE FOR INJURIES SUSTAINED DURING WORKOUTS OR GYM VISITS</li>
              </ul>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-semibold text-[#111111] mb-4">
                13. Indemnification
              </h2>
              <p className="text-[#555555] leading-relaxed">
                You agree to indemnify and hold harmless GymGraph, its officers, directors, employees, and
                agents from any claims, damages, losses, or expenses (including attorneys' fees) arising from:
              </p>
              <ul className="list-disc pl-6 text-[#555555] space-y-2 mt-2">
                <li>Your use of the Service</li>
                <li>Your violation of these Terms</li>
                <li>Your violation of any third-party rights</li>
              </ul>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-semibold text-[#111111] mb-4">
                14. Termination
              </h2>
              <h3 className="text-lg font-medium text-[#111111] mt-6 mb-3">
                14.1 By You
              </h3>
              <p className="text-[#555555] leading-relaxed mb-4">
                You may stop using the Service and request account deletion at any time.
              </p>

              <h3 className="text-lg font-medium text-[#111111] mt-6 mb-3">
                14.2 By Us
              </h3>
              <p className="text-[#555555] leading-relaxed mb-4">
                We may suspend or terminate your account at any time, with or without notice, for:
              </p>
              <ul className="list-disc pl-6 text-[#555555] space-y-2 mb-4">
                <li>Violation of these Terms</li>
                <li>Fraudulent or illegal activity</li>
                <li>Extended inactivity</li>
                <li>Any other reason at our discretion</li>
              </ul>

              <h3 className="text-lg font-medium text-[#111111] mt-6 mb-3">
                14.3 Effect of Termination
              </h3>
              <p className="text-[#555555] leading-relaxed">
                Upon termination:
              </p>
              <ul className="list-disc pl-6 text-[#555555] space-y-2 mt-2">
                <li>Your right to use the Service ceases immediately</li>
                <li>Your Coins and rewards are forfeited</li>
                <li>We may delete your data in accordance with our Privacy Policy</li>
              </ul>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-semibold text-[#111111] mb-4">
                15. Dispute Resolution
              </h2>
              <h3 className="text-lg font-medium text-[#111111] mt-6 mb-3">
                15.1 Informal Resolution
              </h3>
              <p className="text-[#555555] leading-relaxed mb-4">
                Before filing a formal dispute, you agree to contact us at <span className="text-[#0066FF]">support@gymgraph.in</span> to
                attempt informal resolution.
              </p>

              <h3 className="text-lg font-medium text-[#111111] mt-6 mb-3">
                15.2 Governing Law
              </h3>
              <p className="text-[#555555] leading-relaxed mb-4">
                These Terms are governed by the laws of India, without regard to conflict of law principles.
                Any disputes arising under these Terms shall be subject to the exclusive jurisdiction of the
                courts in Hyderabad, Telangana, India.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-semibold text-[#111111] mb-4">
                16. Changes to Terms
              </h2>
              <p className="text-[#555555] leading-relaxed mb-4">
                We may modify these Terms at any time. We will notify you of material changes by:
              </p>
              <ul className="list-disc pl-6 text-[#555555] space-y-2 mb-4">
                <li>Posting updated Terms in the Service</li>
                <li>Sending a notification</li>
                <li>Updating the "Last updated" date</li>
              </ul>
              <p className="text-[#555555] leading-relaxed">
                Continued use of the Service after changes constitutes acceptance of the new Terms.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-semibold text-[#111111] mb-4">
                17. General Provisions
              </h2>
              <ul className="list-disc pl-6 text-[#555555] space-y-2">
                <li><strong>Entire Agreement:</strong> These Terms, together with our Privacy Policy, constitute the entire agreement between you and GymGraph</li>
                <li><strong>Severability:</strong> If any provision of these Terms is found unenforceable, the remaining provisions will continue in effect</li>
                <li><strong>Waiver:</strong> Our failure to enforce any right or provision does not constitute a waiver of that right</li>
                <li><strong>Assignment:</strong> You may not assign your rights under these Terms. We may assign our rights without restriction</li>
              </ul>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-semibold text-[#111111] mb-4">
                18. Contact Us
              </h2>
              <p className="text-[#555555] leading-relaxed">
                If you have any questions about these Terms of Service, please contact us:
              </p>
              <div className="mt-4 p-4 bg-[#F8F9FA] rounded-xl">
                <p className="text-[#111111] font-medium">GymGraph</p>
                <p className="text-[#0066FF]">support@gymgraph.in</p>
                <p className="text-[#555555] mt-2">Hyderabad, Telangana, India</p>
              </div>
            </section>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="py-8 px-6 bg-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="GymGraph" className="w-8 h-8 rounded-lg" />
            <span className="font-semibold text-[#111111]">GymGraph</span>
          </div>
          <div className="flex items-center gap-6">
            <Link
              to="/about"
              className="text-gray-400 hover:text-gray-600 transition-colors text-sm"
            >
              About
            </Link>
            <Link
              to="/contact"
              className="text-gray-400 hover:text-gray-600 transition-colors text-sm"
            >
              Contact
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
