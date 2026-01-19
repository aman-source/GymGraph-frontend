import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Shield, Eye, Lock, Trash2, Globe, Database, Bell } from "lucide-react";

// GymGraph Mountain Logo Component
const GymGraphLogo = ({ className = "w-6 h-6", color = "white" }) => (
  <svg viewBox="0 0 512 512" className={className} fill={color}>
    <polygon points="80,400 220,160 320,400" />
    <polygon points="200,400 340,100 460,400" />
  </svg>
);

export default function Privacy() {
  const highlights = [
    {
      icon: Eye,
      title: "No Background Tracking",
      description:
        "Location is only accessed during check-in. We never track you in the background.",
    },
    {
      icon: Lock,
      title: "Data Encrypted",
      description:
        "All data is encrypted in transit (HTTPS/TLS) and at rest.",
    },
    {
      icon: Trash2,
      title: "You Control Your Data",
      description:
        "Delete your account anytime and we'll remove all your data within 30 days.",
    },
    {
      icon: Shield,
      title: "No Selling Data",
      description:
        "We never sell or share your personal data with advertisers.",
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

      {/* Hero */}
      <section className="pt-32 pb-8 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl font-bold text-[#111111] mb-4">
            Privacy Policy
          </h1>
          <p className="text-[#555555]">
            Last updated: January 19, 2026
          </p>
        </div>
      </section>

      {/* Privacy Highlights */}
      <section className="py-8 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="grid sm:grid-cols-2 gap-4">
            {highlights.map((item, index) => (
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
                1. Introduction
              </h2>
              <p className="text-[#555555] leading-relaxed">
                GymGraph ("we," "our," or "us") is committed to protecting your
                privacy. This Privacy Policy explains how we collect, use,
                disclose, and safeguard your information when you use our mobile
                application GymGraph and website (collectively, the "Service").
              </p>
              <p className="text-[#555555] leading-relaxed mt-4">
                Please read this Privacy Policy carefully. By using the Service, you agree to the
                collection and use of information in accordance with this policy. If you do not
                agree with the terms of this Privacy Policy, please do not access the Service.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-semibold text-[#111111] mb-4">
                2. Information We Collect
              </h2>

              <h3 className="text-lg font-medium text-[#111111] mt-6 mb-3">
                2.1 Personal Information You Provide
              </h3>
              <p className="text-[#555555] leading-relaxed mb-4">
                When you create an account or use our Service, we may collect:
              </p>
              <ul className="list-disc pl-6 text-[#555555] space-y-2 mb-4">
                <li>
                  <strong>Account Information:</strong> Email address, display name, and profile picture
                </li>
                <li>
                  <strong>Authentication Data:</strong> If you sign in using Google OAuth, we receive your basic profile information from Google
                </li>
                <li>
                  <strong>Fitness Data:</strong> Gym check-ins, workout sessions, streak counts, and fitness goals you choose to share
                </li>
                <li>
                  <strong>Social Information:</strong> Connections with other users, referral codes, and leaderboard participation
                </li>
              </ul>

              <h3 className="text-lg font-medium text-[#111111] mt-6 mb-3">
                2.2 Information Collected Automatically
              </h3>
              <p className="text-[#555555] leading-relaxed mb-4">
                When you use the Service, we automatically collect:
              </p>
              <ul className="list-disc pl-6 text-[#555555] space-y-2 mb-4">
                <li>
                  <strong>Location Data:</strong> We collect your precise location <strong>only</strong> when you actively check in at a gym. Location is used solely to verify you are physically present at the gym location. We do not track your location in the background or when the app is closed.
                </li>
                <li>
                  <strong>Device Information:</strong> Device type, operating system version, unique device identifiers, and mobile network information
                </li>
                <li>
                  <strong>Usage Data:</strong> App interactions, features used, session duration, and crash reports
                </li>
                <li>
                  <strong>Analytics Data:</strong> We use Mixpanel to collect anonymized usage analytics to improve the Service
                </li>
              </ul>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-semibold text-[#111111] mb-4">
                3. How We Use Your Information
              </h2>
              <p className="text-[#555555] leading-relaxed mb-4">
                We use the information we collect to:
              </p>
              <ul className="list-disc pl-6 text-[#555555] space-y-2">
                <li><strong>Provide Services:</strong> Create and manage your account, process gym check-ins, track workouts, and maintain streaks</li>
                <li><strong>Verify Check-ins:</strong> Use your location to confirm you are physically at a gym when checking in</li>
                <li><strong>Social Features:</strong> Display leaderboards, enable connections between users, and facilitate challenges</li>
                <li><strong>Rewards System:</strong> Manage the coin economy, process challenge rewards, and track referrals</li>
                <li><strong>Improve the Service:</strong> Analyze usage patterns, fix bugs, and develop new features</li>
                <li><strong>Communications:</strong> Send push notifications about your streaks, challenges, and app updates (with your consent)</li>
                <li><strong>Security:</strong> Detect and prevent fraud, abuse, and security incidents</li>
              </ul>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-semibold text-[#111111] mb-4">
                4. Location Data - Important Details
              </h2>
              <p className="text-[#555555] leading-relaxed mb-4">
                We take your location privacy very seriously:
              </p>
              <ul className="list-disc pl-6 text-[#555555] space-y-2">
                <li>
                  <strong>Check-in Only:</strong> We only access your location when you actively initiate a gym check-in
                </li>
                <li>
                  <strong>No Background Tracking:</strong> We never track your location in the background or when the app is closed
                </li>
                <li>
                  <strong>Gym Verification:</strong> Location is used solely to verify you are at a legitimate gym location within the check-in radius
                </li>
                <li>
                  <strong>You Can Disable:</strong> You can disable location permissions at any time through your device settings. Note that this will prevent gym check-in functionality.
                </li>
              </ul>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-semibold text-[#111111] mb-4">
                5. How We Share Your Information
              </h2>
              <p className="text-[#555555] leading-relaxed mb-4">
                We do not sell your personal information. We may share your information in these circumstances:
              </p>

              <h3 className="text-lg font-medium text-[#111111] mt-6 mb-3">
                5.1 With Other Users
              </h3>
              <ul className="list-disc pl-6 text-[#555555] space-y-2 mb-4">
                <li>Your display name, profile picture, and fitness achievements may be visible to other users on leaderboards and in challenges</li>
                <li>Your gym check-in activity may be visible to your connections</li>
                <li>You can control visibility settings in your profile</li>
              </ul>

              <h3 className="text-lg font-medium text-[#111111] mt-6 mb-3">
                5.2 With Service Providers
              </h3>
              <p className="text-[#555555] leading-relaxed mb-4">
                We share information with trusted third-party service providers who perform services on our behalf:
              </p>
              <ul className="list-disc pl-6 text-[#555555] space-y-2 mb-4">
                <li><strong>Supabase:</strong> Database and authentication services</li>
                <li><strong>Mixpanel:</strong> Analytics and user behavior tracking</li>
                <li><strong>Google Maps/Places:</strong> Location verification services</li>
                <li><strong>OneSignal:</strong> Push notification delivery</li>
                <li><strong>Railway:</strong> Backend hosting</li>
                <li><strong>Vercel:</strong> Frontend hosting</li>
              </ul>

              <h3 className="text-lg font-medium text-[#111111] mt-6 mb-3">
                5.3 For Legal Purposes
              </h3>
              <p className="text-[#555555] leading-relaxed">
                We may disclose your information to comply with legal obligations, protect our rights,
                privacy, safety, or property, respond to lawful requests from public authorities, or
                in connection with a merger, acquisition, or sale of assets.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-semibold text-[#111111] mb-4">
                6. Data Security
              </h2>
              <p className="text-[#555555] leading-relaxed mb-4">
                We implement appropriate technical and organizational measures to protect your personal information:
              </p>
              <ul className="list-disc pl-6 text-[#555555] space-y-2">
                <li>Encryption of data in transit (HTTPS/TLS)</li>
                <li>Encryption of sensitive data at rest</li>
                <li>Secure authentication using industry-standard protocols (OAuth 2.0, JWT)</li>
                <li>Regular security assessments</li>
                <li>Access controls limiting employee access to personal data</li>
              </ul>
              <p className="text-[#555555] leading-relaxed mt-4">
                However, no method of transmission over the Internet or electronic storage is 100% secure.
                We cannot guarantee absolute security.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-semibold text-[#111111] mb-4">
                7. Data Retention
              </h2>
              <p className="text-[#555555] leading-relaxed mb-4">
                We retain your personal information for as long as your account is active or as needed to
                provide you services. You may request deletion of your account and associated data at any time.
              </p>
              <p className="text-[#555555] leading-relaxed">
                After account deletion:
              </p>
              <ul className="list-disc pl-6 text-[#555555] space-y-2 mt-2">
                <li>Your personal data will be deleted within 30 days</li>
                <li>Anonymized aggregate data may be retained for analytics purposes</li>
                <li>Some information may be retained as required by law</li>
              </ul>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-semibold text-[#111111] mb-4">
                8. Your Rights and Choices
              </h2>
              <p className="text-[#555555] leading-relaxed mb-4">
                Depending on your location, you may have the following rights:
              </p>
              <ul className="list-disc pl-6 text-[#555555] space-y-2">
                <li>
                  <strong>Access and Portability:</strong> You can access your personal data through the app's settings or by contacting us
                </li>
                <li>
                  <strong>Correction:</strong> You can update your profile information directly in the app
                </li>
                <li>
                  <strong>Deletion:</strong> You can request deletion of your account and personal data by contacting us
                </li>
                <li>
                  <strong>Location Permissions:</strong> You can disable location permissions at any time through your device settings
                </li>
                <li>
                  <strong>Push Notifications:</strong> You can opt out of push notifications through your device settings
                </li>
                <li>
                  <strong>Marketing Communications:</strong> You can opt out of marketing emails by following the unsubscribe link
                </li>
              </ul>
              <p className="text-[#555555] leading-relaxed mt-4">
                To exercise these rights, please contact us at <span className="text-[#0066FF]">privacy@gymgraph.in</span> or
                use the settings in the app.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-semibold text-[#111111] mb-4">
                9. Children's Privacy
              </h2>
              <p className="text-[#555555] leading-relaxed">
                The Service is not intended for children under 13 years of age. We do not knowingly collect
                personal information from children under 13. If we learn we have collected personal information
                from a child under 13, we will delete that information promptly. If you believe we have collected
                information from a child under 13, please contact us immediately.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-semibold text-[#111111] mb-4">
                10. International Data Transfers
              </h2>
              <p className="text-[#555555] leading-relaxed">
                Your information may be transferred to and processed in countries other than your country of
                residence. These countries may have data protection laws different from your country. By using
                the Service, you consent to the transfer of your information to these countries. We take steps
                to ensure your data is treated securely and in accordance with this Privacy Policy.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-semibold text-[#111111] mb-4">
                11. Changes to This Privacy Policy
              </h2>
              <p className="text-[#555555] leading-relaxed">
                We may update this Privacy Policy from time to time. We will notify you of any changes by:
              </p>
              <ul className="list-disc pl-6 text-[#555555] space-y-2 mt-2">
                <li>Posting the new Privacy Policy on this page</li>
                <li>Updating the "Last updated" date</li>
                <li>Sending a push notification for material changes</li>
              </ul>
              <p className="text-[#555555] leading-relaxed mt-4">
                Your continued use of the Service after changes constitutes acceptance of the updated Privacy Policy.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-semibold text-[#111111] mb-4">
                12. Contact Us
              </h2>
              <p className="text-[#555555] leading-relaxed">
                If you have any questions or concerns about this Privacy Policy or our data practices,
                please contact us:
              </p>
              <div className="mt-4 p-4 bg-[#F8F9FA] rounded-xl">
                <p className="text-[#111111] font-medium">GymGraph</p>
                <p className="text-[#0066FF]">privacy@gymgraph.in</p>
                <p className="text-[#555555] mt-2">Hyderabad, Telangana, India</p>
              </div>
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
              to="/terms"
              className="text-[#888888] hover:text-white transition-colors text-sm"
            >
              Terms
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
