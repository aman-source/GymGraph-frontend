import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Shield, Eye, Lock, Trash2, Camera, MapPin, Bell, BarChart3 } from "lucide-react";

export default function Privacy() {
  const highlights = [
    {
      icon: Eye,
      title: "No Background Tracking",
      description:
        "Location is accessed only when you check in or browse nearby gyms. We never track you in the background.",
    },
    {
      icon: Lock,
      title: "Data Encrypted",
      description:
        "All data is encrypted in transit (HTTPS/TLS) and at rest in our database.",
    },
    {
      icon: Trash2,
      title: "You Control Your Data",
      description:
        "Delete your account anytime and we'll remove all your personal data within 30 days.",
    },
    {
      icon: Shield,
      title: "No Selling Data",
      description:
        "We never sell or share your personal data with advertisers or data brokers.",
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
            Privacy Policy
          </h1>
          <p className="text-[#555555]">
            Last updated: February 6, 2026
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
                application (iOS and Android), progressive web application (PWA), and website
                (collectively, the "Service").
              </p>
              <p className="text-[#555555] leading-relaxed mt-4">
                Please read this Privacy Policy carefully. By using the Service, you agree to the
                collection and use of information in accordance with this policy. If you do not
                agree with the terms of this Privacy Policy, please do not access the Service.
              </p>
              <p className="text-[#555555] leading-relaxed mt-4">
                This policy is designed to comply with the Indian Digital Personal Data Protection
                Act, 2023 (DPDP Act) and applicable international privacy regulations.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-semibold text-[#111111] mb-4">
                2. Information We Collect
              </h2>

              <h3 className="text-lg font-medium text-[#111111] mt-6 mb-3">
                2.1 Account Information You Provide
              </h3>
              <p className="text-[#555555] leading-relaxed mb-4">
                When you create an account, we collect:
              </p>
              <ul className="list-disc pl-6 text-[#555555] space-y-2 mb-4">
                <li>
                  <strong>Registration Data:</strong> Email address, display name, and password (hashed and stored securely via Supabase Auth)
                </li>
                <li>
                  <strong>Google OAuth Data:</strong> If you sign in with Google, we receive your name, email address, and profile picture from Google
                </li>
                <li>
                  <strong>Profile Information:</strong> Bio, avatar photo or generated avatar pattern, avatar colour scheme, and fitness goals you choose to set
                </li>
                <li>
                  <strong>Primary Gym:</strong> The gym you select during onboarding as your home gym
                </li>
              </ul>

              <h3 className="text-lg font-medium text-[#111111] mt-6 mb-3">
                2.2 Fitness and Activity Data
              </h3>
              <p className="text-[#555555] leading-relaxed mb-4">
                As you use the Service, we collect:
              </p>
              <ul className="list-disc pl-6 text-[#555555] space-y-2 mb-4">
                <li>
                  <strong>Check-in Records:</strong> Gym name, check-in timestamp, GPS coordinates at time of check-in, verification method, and workout type
                </li>
                <li>
                  <strong>Streak Data:</strong> Current streak count, longest streak, streak freeze and restoration history
                </li>
                <li>
                  <strong>Challenge Data:</strong> Challenges joined or created, participation scores, activity submissions, and peer validations
                </li>
                <li>
                  <strong>Leaderboard Data:</strong> Your ranking across global, city, gym, and connections leaderboards
                </li>
                <li>
                  <strong>Badge and Achievement Data:</strong> Badges earned and milestone timestamps
                </li>
              </ul>

              <h3 className="text-lg font-medium text-[#111111] mt-6 mb-3">
                2.3 Social and User-Generated Content
              </h3>
              <p className="text-[#555555] leading-relaxed mb-4">
                When you interact socially on GymGraph, we collect:
              </p>
              <ul className="list-disc pl-6 text-[#555555] space-y-2 mb-4">
                <li>
                  <strong>Posts:</strong> Text content, photos, post type (flex, rant, question, meme, motivation), and visibility settings (public or friends-only)
                </li>
                <li>
                  <strong>Stories:</strong> Photos and captions you share in stories, which auto-expire after 24 hours. We also track view counts and who has viewed your stories
                </li>
                <li>
                  <strong>Comments and Reactions:</strong> Comments you make on posts, reactions you give, and timestamps of these interactions
                </li>
                <li>
                  <strong>Connections:</strong> Your social graph including connection requests sent, accepted, declined, or blocked, and mutual connection data
                </li>
              </ul>

              <h3 className="text-lg font-medium text-[#111111] mt-6 mb-3">
                2.4 Financial and Coin Data
              </h3>
              <ul className="list-disc pl-6 text-[#555555] space-y-2 mb-4">
                <li>
                  <strong>Coin Balance:</strong> Your current balance, total earned, and total spent
                </li>
                <li>
                  <strong>Transaction History:</strong> Records of coins earned (check-ins, streaks, referrals, challenge wins) and coins spent (streak freezes, streak restorations, reward redemptions)
                </li>
                <li>
                  <strong>Referral Data:</strong> Your unique referral code, users you have referred, and referral conversion status
                </li>
              </ul>

              <h3 className="text-lg font-medium text-[#111111] mt-6 mb-3">
                2.5 Information Collected Automatically
              </h3>
              <p className="text-[#555555] leading-relaxed mb-4">
                When you use the Service, we automatically collect:
              </p>
              <ul className="list-disc pl-6 text-[#555555] space-y-2 mb-4">
                <li>
                  <strong>Location Data:</strong> Precise GPS coordinates when you initiate a check-in or use the "nearby gyms" feature. We use foreground location access only. We do <strong>not</strong> track your location in the background or when the app is closed
                </li>
                <li>
                  <strong>Device Information:</strong> Device type, operating system, app version, build number, and platform (iOS/Android/Web)
                </li>
                <li>
                  <strong>Usage Analytics (Mixpanel):</strong> Screen views, feature interactions, session duration, days since signup, session counts, check-in patterns, challenge engagement, social engagement metrics, and navigation flows. These events are linked to your user ID for product improvement purposes
                </li>
                <li>
                  <strong>Error and Performance Data (Sentry):</strong> Crash reports, exception stack traces, performance metrics, HTTP request breadcrumbs, and navigation breadcrumbs. Your user ID and email may be attached to error reports to help us investigate issues. We filter out sensitive data such as authentication tokens
                </li>
                <li>
                  <strong>Push Notification Data (OneSignal):</strong> Device push token, notification subscription status, notification interaction events (opens, dismissals), and your user ID linked to your device for targeted notifications
                </li>
              </ul>

              <h3 className="text-lg font-medium text-[#111111] mt-6 mb-3">
                2.6 Media and Photos
              </h3>
              <ul className="list-disc pl-6 text-[#555555] space-y-2 mb-4">
                <li>
                  <strong>Profile Photos:</strong> Avatar images you upload via camera or photo library
                </li>
                <li>
                  <strong>Post and Story Media:</strong> Photos you attach to posts and stories, stored in our cloud storage
                </li>
                <li>
                  <strong>Media Metadata:</strong> File size and format. Images are limited to 10 MB and accepted formats are JPG, JPEG, PNG, GIF, and WebP
                </li>
              </ul>

              <h3 className="text-lg font-medium text-[#111111] mt-6 mb-3">
                2.7 On-Device Storage
              </h3>
              <p className="text-[#555555] leading-relaxed mb-4">
                We store the following data locally on your device for app performance:
              </p>
              <ul className="list-disc pl-6 text-[#555555] space-y-2">
                <li>
                  <strong>Authentication Session:</strong> Secure token for keeping you signed in
                </li>
                <li>
                  <strong>Data Cache:</strong> Cached feed, profile, and leaderboard data for faster loading
                </li>
                <li>
                  <strong>Analytics Timestamps:</strong> Signup date, first check-in date, and session count for analytics purposes
                </li>
                <li>
                  <strong>Offline Queue:</strong> If you create a story while offline, it is queued locally and uploaded when connectivity returns
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
                <li><strong>Provide Core Services:</strong> Create and manage your account, process gym check-ins with GPS verification, track streaks, and maintain your fitness profile</li>
                <li><strong>Verify Check-ins:</strong> Confirm you are physically within the check-in radius (approximately 100 metres) of a registered gym</li>
                <li><strong>Show Nearby Gyms:</strong> Use your location to display gyms near you for discovery and check-in</li>
                <li><strong>Power Social Features:</strong> Display your posts and stories in the activity feed, show leaderboard rankings, enable connections, and deliver reactions and comments</li>
                <li><strong>Run Challenges:</strong> Manage challenge participation, track scores, validate activities through peer review, and distribute rewards</li>
                <li><strong>Manage Coin Economy:</strong> Award coins for check-ins, streaks, referrals, and challenge wins; process spending on streak freezes, restorations, and reward redemptions</li>
                <li><strong>Deliver Notifications:</strong> Send push notifications about connection requests, challenge invitations, comments, reactions, streak reminders, and milestone achievements</li>
                <li><strong>Improve the Service:</strong> Analyse usage patterns through Mixpanel to understand which features are valuable, identify friction points, and develop new features</li>
                <li><strong>Fix Bugs and Ensure Stability:</strong> Use Sentry crash reports and performance data to identify, diagnose, and resolve technical issues</li>
                <li><strong>Prevent Fraud:</strong> Detect GPS spoofing, multiple account abuse, and other violations of our Terms of Service</li>
                <li><strong>Provide Distance Information:</strong> Calculate walking distance to gyms using Google Maps Distance Matrix API, with a fallback to on-device calculation when the API is unavailable</li>
                <li><strong>Deliver App Updates:</strong> Automatically deliver bug fixes and improvements through Expo over-the-air (OTA) updates when you open the app</li>
              </ul>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-semibold text-[#111111] mb-4">
                4. Location Data — Important Details
              </h2>
              <p className="text-[#555555] leading-relaxed mb-4">
                We take your location privacy seriously. Here is exactly how we handle location:
              </p>

              <h3 className="text-lg font-medium text-[#111111] mt-6 mb-3">
                4.1 When We Access Location
              </h3>
              <ul className="list-disc pl-6 text-[#555555] space-y-2 mb-4">
                <li>
                  <strong>During Check-in:</strong> When you tap "Check In", we access your precise GPS coordinates to verify you are within range of the gym
                </li>
                <li>
                  <strong>Nearby Gyms:</strong> When you use the nearby gyms feature, we access your location to find gyms close to you
                </li>
                <li>
                  <strong>Active Session:</strong> While you have an active check-in session (up to 1 hour), location may be monitored in the foreground with a 10-metre distance interval to ensure continued presence
                </li>
              </ul>

              <h3 className="text-lg font-medium text-[#111111] mt-6 mb-3">
                4.2 What We Do Not Do
              </h3>
              <ul className="list-disc pl-6 text-[#555555] space-y-2 mb-4">
                <li>We <strong>never</strong> track your location in the background</li>
                <li>We <strong>never</strong> track your location when the app is closed</li>
                <li>We <strong>never</strong> build a location history or movement profile</li>
                <li>We <strong>never</strong> sell or share your raw GPS coordinates with advertisers</li>
              </ul>

              <h3 className="text-lg font-medium text-[#111111] mt-6 mb-3">
                4.3 Your Control
              </h3>
              <p className="text-[#555555] leading-relaxed">
                You can revoke location permissions at any time through your device settings. Note that disabling
                location will prevent you from checking in at gyms and using the nearby gyms feature.
                All other features (social feed, challenges, leaderboards, coin economy) will continue to work.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-semibold text-[#111111] mb-4">
                5. Device Permissions
              </h2>
              <p className="text-[#555555] leading-relaxed mb-4">
                The app requests the following permissions, each for a specific purpose:
              </p>
              <div className="overflow-x-auto">
                <table className="w-full text-[#555555] text-sm border-collapse">
                  <thead>
                    <tr className="border-b border-[#E5E7EB]">
                      <th className="text-left py-3 pr-4 font-semibold text-[#111111]">Permission</th>
                      <th className="text-left py-3 font-semibold text-[#111111]">Why We Need It</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-[#E5E7EB]/50">
                      <td className="py-3 pr-4 font-medium">Precise Location (GPS)</td>
                      <td className="py-3">Verify gym check-ins and show nearby gyms</td>
                    </tr>
                    <tr className="border-b border-[#E5E7EB]/50">
                      <td className="py-3 pr-4 font-medium">Camera</td>
                      <td className="py-3">Take profile photos, post photos, and story photos</td>
                    </tr>
                    <tr className="border-b border-[#E5E7EB]/50">
                      <td className="py-3 pr-4 font-medium">Photo Library</td>
                      <td className="py-3">Select existing photos for your profile, posts, and stories</td>
                    </tr>
                    <tr className="border-b border-[#E5E7EB]/50">
                      <td className="py-3 pr-4 font-medium">Push Notifications</td>
                      <td className="py-3">Receive alerts for connection requests, challenge invites, comments, reactions, and achievements</td>
                    </tr>
                    <tr>
                      <td className="py-3 pr-4 font-medium">Storage (Android)</td>
                      <td className="py-3">Read and write media files for photo uploads</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className="text-[#555555] leading-relaxed mt-4">
                All permissions are requested at runtime when you first use the relevant feature. You can manage
                these permissions at any time in your device settings.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-semibold text-[#111111] mb-4">
                6. How We Share Your Information
              </h2>
              <p className="text-[#555555] leading-relaxed mb-4">
                We do <strong>not</strong> sell your personal information. We may share your information in these circumstances:
              </p>

              <h3 className="text-lg font-medium text-[#111111] mt-6 mb-3">
                6.1 With Other GymGraph Users
              </h3>
              <ul className="list-disc pl-6 text-[#555555] space-y-2 mb-4">
                <li>Your display name, avatar, streak count, badges, and fitness achievements are visible on your public profile and in leaderboards</li>
                <li>Posts you set to "public" are visible to all users; posts set to "friends" are visible only to your connections</li>
                <li>Stories are visible based on your chosen visibility (public or friends) for 24 hours</li>
                <li>Your gym check-in activity may appear in your connections' activity feeds</li>
                <li>Challenge participation, scores, and rankings are visible to other challenge participants</li>
                <li>Users at the same gym can see you in the gym's member list</li>
              </ul>

              <h3 className="text-lg font-medium text-[#111111] mt-6 mb-3">
                6.2 With Service Providers
              </h3>
              <p className="text-[#555555] leading-relaxed mb-4">
                We share information with trusted third-party service providers who help us operate the Service:
              </p>
              <ul className="list-disc pl-6 text-[#555555] space-y-2 mb-4">
                <li><strong>Supabase</strong> (supabase.com) — Database, authentication, file storage, and real-time subscriptions. Hosts all user data</li>
                <li><strong>Mixpanel</strong> (mixpanel.com) — Product analytics. Receives user IDs and event data to help us understand feature usage</li>
                <li><strong>Sentry</strong> (sentry.io) — Error monitoring and performance tracking. Receives crash reports with user context (user ID, email) to help us fix bugs</li>
                <li><strong>OneSignal</strong> (onesignal.com) — Push notification delivery. Receives your user ID and device token to deliver notifications</li>
                <li><strong>Google Maps Platform</strong> (google.com) — Distance calculation between you and gyms. Receives origin and destination coordinates</li>
                <li><strong>Expo</strong> (expo.dev) — Mobile app build and over-the-air update delivery</li>
                <li><strong>Railway</strong> (railway.app) — Backend API hosting</li>
                <li><strong>Vercel</strong> (vercel.com) — Website and web app hosting</li>
              </ul>
              <p className="text-[#555555] leading-relaxed mb-4">
                Each provider processes data only as necessary to provide their service to us and is bound by their
                own privacy policies and data processing agreements.
              </p>

              <h3 className="text-lg font-medium text-[#111111] mt-6 mb-3">
                6.3 For Legal Purposes
              </h3>
              <p className="text-[#555555] leading-relaxed">
                We may disclose your information to comply with applicable laws, respond to valid legal processes,
                protect our rights, privacy, safety, or property, enforce our Terms of Service, or in connection
                with a merger, acquisition, or sale of assets.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-semibold text-[#111111] mb-4">
                7. Data Security
              </h2>
              <p className="text-[#555555] leading-relaxed mb-4">
                We implement appropriate technical and organisational measures to protect your personal information:
              </p>
              <ul className="list-disc pl-6 text-[#555555] space-y-2">
                <li>All data in transit is encrypted using HTTPS/TLS</li>
                <li>Database data is encrypted at rest by Supabase</li>
                <li>Passwords are hashed — we never store or see your plaintext password</li>
                <li>Authentication uses industry-standard protocols (OAuth 2.0, JWT with automatic token refresh)</li>
                <li>Row-Level Security (RLS) policies restrict database access so users can only access their own data</li>
                <li>API rate limiting (200 requests per minute) protects against abuse</li>
                <li>Sensitive data (auth tokens, credentials) is filtered from error reports sent to Sentry</li>
                <li>Media uploads are validated for file type and size before acceptance</li>
              </ul>
              <p className="text-[#555555] leading-relaxed mt-4">
                No method of transmission over the Internet or electronic storage is 100% secure.
                While we strive to protect your personal information, we cannot guarantee absolute security.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-semibold text-[#111111] mb-4">
                8. Data Retention
              </h2>
              <p className="text-[#555555] leading-relaxed mb-4">
                We retain your personal information for as long as your account is active or as needed to
                provide you services.
              </p>
              <ul className="list-disc pl-6 text-[#555555] space-y-2 mb-4">
                <li><strong>Account Data:</strong> Retained while your account is active</li>
                <li><strong>Stories:</strong> Automatically deleted 24 hours after creation</li>
                <li><strong>Check-in Location Coordinates:</strong> Stored as part of your check-in record for verification and streak tracking</li>
                <li><strong>Analytics Data (Mixpanel):</strong> Retained according to Mixpanel's data retention policies</li>
                <li><strong>Error Data (Sentry):</strong> Retained for up to 90 days for debugging purposes</li>
                <li><strong>On-Device Cache:</strong> Cleared when you log out or uninstall the app</li>
              </ul>
              <p className="text-[#555555] leading-relaxed">
                After account deletion:
              </p>
              <ul className="list-disc pl-6 text-[#555555] space-y-2 mt-2">
                <li>Your personal data will be deleted from our database within 30 days</li>
                <li>Your posts, stories, and comments will be removed</li>
                <li>Anonymised, aggregate data (e.g., total user counts, average streaks) may be retained for analytics</li>
                <li>Data required to be retained by law will be kept for the legally mandated period</li>
                <li>Cached data in third-party services (Mixpanel, Sentry) will expire according to their retention schedules</li>
              </ul>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-semibold text-[#111111] mb-4">
                9. Your Rights and Choices
              </h2>
              <p className="text-[#555555] leading-relaxed mb-4">
                Under the DPDP Act 2023 and other applicable laws, you have the following rights:
              </p>
              <ul className="list-disc pl-6 text-[#555555] space-y-2">
                <li>
                  <strong>Right to Access:</strong> You can view your personal data through the app (profile, check-in history, coin transactions, posts). You may also request a complete copy by contacting us
                </li>
                <li>
                  <strong>Right to Correction:</strong> You can update your display name, bio, avatar, fitness goals, and primary gym directly in the app at any time
                </li>
                <li>
                  <strong>Right to Erasure:</strong> You can request deletion of your account and all associated personal data by contacting us. Deletion will be completed within 30 days
                </li>
                <li>
                  <strong>Right to Withdraw Consent:</strong> You can withdraw consent for specific data processing by revoking device permissions (location, camera, notifications) in your device settings
                </li>
                <li>
                  <strong>Right to Grievance Redressal:</strong> If you have concerns about how we handle your data, you may contact our Grievance Officer (see Section 14 below)
                </li>
                <li>
                  <strong>Post Visibility Controls:</strong> You can set individual posts as public or friends-only. Stories can be set as public or friends-only
                </li>
                <li>
                  <strong>Connection Management:</strong> You can block users, which prevents them from seeing your profile, posts, and activity
                </li>
                <li>
                  <strong>Push Notifications:</strong> You can disable push notifications through your device settings or the OneSignal subscription preferences
                </li>
              </ul>
              <p className="text-[#555555] leading-relaxed mt-4">
                To exercise these rights, contact us at <span className="text-[#0066FF]">amanabdul21@gmail.com</span>.
                We will respond to your request within 30 days.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-semibold text-[#111111] mb-4">
                10. Children's Privacy
              </h2>
              <p className="text-[#555555] leading-relaxed">
                The Service is not intended for children under 13 years of age. We do not knowingly collect
                personal information from children under 13. If you are between 13 and 18, you must have
                permission from a parent or legal guardian to use the Service. If we learn we have collected
                personal information from a child under 13, we will delete that information promptly. If you
                believe we have collected information from a child under 13, please contact us immediately at{" "}
                <span className="text-[#0066FF]">amanabdul21@gmail.com</span>.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-semibold text-[#111111] mb-4">
                11. International Data Transfers
              </h2>
              <p className="text-[#555555] leading-relaxed mb-4">
                GymGraph is based in India. Your information may be transferred to and processed in countries
                other than your country of residence, including the United States, where our service providers
                (Supabase, Mixpanel, Sentry, OneSignal) operate their infrastructure.
              </p>
              <p className="text-[#555555] leading-relaxed">
                These countries may have data protection laws different from your country. By using the Service,
                you consent to the transfer of your information to these countries. We take steps to ensure your
                data is treated securely and in accordance with this Privacy Policy, and we only work with
                service providers who maintain appropriate data protection standards.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-semibold text-[#111111] mb-4">
                12. Real-Time Features
              </h2>
              <p className="text-[#555555] leading-relaxed">
                GymGraph uses WebSocket connections (via Supabase Realtime) to deliver real-time updates for
                your activity feed, notifications, check-in activity, challenge updates, and connection requests.
                These connections are active only while you are using the app and are closed when the app is
                backgrounded or closed. No additional personal data is collected through these real-time
                connections beyond what is described in this policy.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-semibold text-[#111111] mb-4">
                13. Changes to This Privacy Policy
              </h2>
              <p className="text-[#555555] leading-relaxed">
                We may update this Privacy Policy from time to time. We will notify you of any changes by:
              </p>
              <ul className="list-disc pl-6 text-[#555555] space-y-2 mt-2">
                <li>Posting the updated Privacy Policy on this page</li>
                <li>Updating the "Last updated" date at the top</li>
                <li>Sending a push notification for material changes that affect your rights or how we process your data</li>
              </ul>
              <p className="text-[#555555] leading-relaxed mt-4">
                Your continued use of the Service after changes constitutes acceptance of the updated Privacy
                Policy. If we make changes that materially reduce your rights, we will seek your consent before
                the changes take effect.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-semibold text-[#111111] mb-4">
                14. Contact Us
              </h2>
              <p className="text-[#555555] leading-relaxed">
                If you have any questions, concerns, or complaints about this Privacy Policy or our data
                practices, please contact us:
              </p>
              <div className="mt-4 p-4 bg-[#F8F9FA] rounded-xl space-y-3">
                <div>
                  <p className="text-[#111111] font-medium">GymGraph</p>
                  <p className="text-[#555555]">Hyderabad, Telangana, India</p>
                </div>
                <div>
                  <p className="text-[#555555] text-sm font-medium">General Privacy Enquiries</p>
                  <p className="text-[#0066FF]">amanabdul21@gmail.com</p>
                </div>
                <div>
                  <p className="text-[#555555] text-sm font-medium">Grievance Officer (DPDP Act)</p>
                  <p className="text-[#0066FF]">grievance@gymgraph.in</p>
                </div>
              </div>
              <p className="text-[#555555] leading-relaxed mt-4">
                We aim to respond to all privacy enquiries within 30 days. If you are unsatisfied with our
                response, you may escalate your concern to the Data Protection Board of India.
              </p>
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
              to="/terms"
              className="text-gray-400 hover:text-gray-600 transition-colors text-sm"
            >
              Terms
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
