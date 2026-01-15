import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Shield, Eye, Lock, Trash2 } from "lucide-react";

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
      title: "We Don't Track You",
      description:
        "Location is only accessed during check-in. We never track you outside the app.",
    },
    {
      icon: Lock,
      title: "Data is Encrypted",
      description:
        "Your personal information is encrypted and stored securely.",
    },
    {
      icon: Trash2,
      title: "You Control Your Data",
      description:
        "Delete your account anytime and we'll remove all your data.",
    },
    {
      icon: Shield,
      title: "No Selling to Third Parties",
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
            Last updated:{" "}
            {new Date().toLocaleDateString("en-IN", {
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
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
                application and website (collectively, the "Service").
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-semibold text-[#111111] mb-4">
                2. Information We Collect
              </h2>

              <h3 className="text-lg font-medium text-[#111111] mt-6 mb-3">
                2.1 Information You Provide
              </h3>
              <ul className="list-disc pl-6 text-[#555555] space-y-2 mb-4">
                <li>
                  <strong>Account Information:</strong> Name, email address,
                  phone number, profile picture
                </li>
                <li>
                  <strong>Fitness Data:</strong> Gym preferences, workout goals,
                  check-in history
                </li>
                <li>
                  <strong>Payment Information:</strong> When participating in
                  stake challenges (processed by secure third-party providers)
                </li>
                <li>
                  <strong>Communications:</strong> Messages you send to other
                  users or to us
                </li>
              </ul>

              <h3 className="text-lg font-medium text-[#111111] mt-6 mb-3">
                2.2 Information Collected Automatically
              </h3>
              <ul className="list-disc pl-6 text-[#555555] space-y-2 mb-4">
                <li>
                  <strong>Location Data:</strong> GPS coordinates during
                  check-ins only
                </li>
                <li>
                  <strong>Device Information:</strong> Device type, operating
                  system, unique device identifiers
                </li>
                <li>
                  <strong>Usage Data:</strong> Features used, time spent, crash
                  logs
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
                <li>Provide, maintain, and improve the Service</li>
                <li>Verify your gym check-ins using GPS location</li>
                <li>Process challenge participations and distribute rewards</li>
                <li>Connect you with other users at your gym</li>
                <li>Send you notifications about your activity and progress</li>
                <li>Respond to your requests and support inquiries</li>
                <li>Detect and prevent fraud or abuse</li>
                <li>Comply with legal obligations</li>
              </ul>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-semibold text-[#111111] mb-4">
                4. Location Data
              </h2>
              <p className="text-[#555555] leading-relaxed mb-4">
                We take your location privacy seriously:
              </p>
              <ul className="list-disc pl-6 text-[#555555] space-y-2">
                <li>
                  <strong>Check-in Only:</strong> We only access your location
                  when you actively initiate a gym check-in
                </li>
                <li>
                  <strong>No Background Tracking:</strong> We never track your
                  location in the background or when the app is closed
                </li>
                <li>
                  <strong>Gym Verification:</strong> Location is used solely to
                  verify you are at a legitimate gym location
                </li>
                <li>
                  <strong>Optional:</strong> You can use GymGraph without
                  location permissions, but check-in features will be disabled
                </li>
              </ul>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-semibold text-[#111111] mb-4">
                5. Information Sharing
              </h2>
              <p className="text-[#555555] leading-relaxed mb-4">
                We do not sell your personal information. We may share your
                information in the following circumstances:
              </p>
              <ul className="list-disc pl-6 text-[#555555] space-y-2">
                <li>
                  <strong>With Other Users:</strong> Your profile, check-ins,
                  and achievements may be visible to other GymGraph users based
                  on your privacy settings
                </li>
                <li>
                  <strong>Service Providers:</strong> We work with trusted
                  third-party services for hosting, analytics, and payment
                  processing
                </li>
                <li>
                  <strong>Legal Requirements:</strong> When required by law or
                  to protect our rights
                </li>
                <li>
                  <strong>Business Transfers:</strong> In connection with a
                  merger, acquisition, or sale of assets
                </li>
              </ul>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-semibold text-[#111111] mb-4">
                6. Data Security
              </h2>
              <p className="text-[#555555] leading-relaxed mb-4">
                We implement appropriate technical and organizational measures
                to protect your information:
              </p>
              <ul className="list-disc pl-6 text-[#555555] space-y-2">
                <li>Encryption of data in transit and at rest</li>
                <li>Regular security assessments and updates</li>
                <li>Limited access to personal data on a need-to-know basis</li>
                <li>Secure authentication and session management</li>
              </ul>
              <p className="text-[#555555] leading-relaxed mt-4">
                However, no method of transmission over the Internet is 100%
                secure. We cannot guarantee absolute security.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-semibold text-[#111111] mb-4">
                7. Your Rights and Choices
              </h2>
              <p className="text-[#555555] leading-relaxed mb-4">You have the right to:</p>
              <ul className="list-disc pl-6 text-[#555555] space-y-2">
                <li>
                  <strong>Access:</strong> Request a copy of the personal data
                  we hold about you
                </li>
                <li>
                  <strong>Correction:</strong> Update or correct inaccurate
                  information
                </li>
                <li>
                  <strong>Deletion:</strong> Request deletion of your account
                  and associated data
                </li>
                <li>
                  <strong>Portability:</strong> Request your data in a portable
                  format
                </li>
                <li>
                  <strong>Opt-out:</strong> Unsubscribe from marketing
                  communications
                </li>
                <li>
                  <strong>Privacy Settings:</strong> Control who can see your
                  profile and activity
                </li>
              </ul>
              <p className="text-[#555555] leading-relaxed mt-4">
                To exercise these rights, please contact us at
                privacy@gymgraph.com or use the settings in the app.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-semibold text-[#111111] mb-4">
                8. Data Retention
              </h2>
              <p className="text-[#555555] leading-relaxed">
                We retain your information for as long as your account is active
                or as needed to provide you services. If you delete your
                account, we will delete your personal data within 30 days,
                except where we are required to retain it for legal or
                legitimate business purposes.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-semibold text-[#111111] mb-4">
                9. Children's Privacy
              </h2>
              <p className="text-[#555555] leading-relaxed">
                GymGraph is not intended for children under 13 years of age. We
                do not knowingly collect personal information from children
                under 13. If you believe we have collected information from a
                child under 13, please contact us immediately.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-semibold text-[#111111] mb-4">
                10. Changes to This Policy
              </h2>
              <p className="text-[#555555] leading-relaxed">
                We may update this Privacy Policy from time to time. We will
                notify you of any changes by posting the new policy on this page
                and updating the "Last updated" date. We encourage you to review
                this policy periodically.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-semibold text-[#111111] mb-4">
                11. Contact Us
              </h2>
              <p className="text-[#555555] leading-relaxed">
                If you have any questions about this Privacy Policy or our data
                practices, please contact us at:
              </p>
              <div className="mt-4 p-4 bg-[#F8F9FA] rounded-xl">
                <p className="text-[#111111] font-medium">GymGraph</p>
                <p className="text-[#0066FF]">privacy@gymgraph.com</p>
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
