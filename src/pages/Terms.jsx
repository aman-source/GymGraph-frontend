import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, MapPin, Coins, Users, Shield, AlertTriangle, Camera, Trophy } from "lucide-react";

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
      description: "Coins have no monetary value, are non-transferable, and are non-refundable.",
    },
    {
      icon: Users,
      title: "Community Rules",
      description: "Respect other users. No harassment, hateful content, cheating, or abuse.",
    },
    {
      icon: Shield,
      title: "Account Security",
      description: "You're responsible for keeping your account credentials secure.",
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
            Last updated: February 6, 2026
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
                mobile application (iOS and Android), progressive web application, and website
                (collectively, the "Service") operated by GymGraph ("we," "us," or "our").
              </p>
              <p className="text-[#555555] leading-relaxed">
                By downloading, installing, creating an account, or using the Service in any way, you agree
                to be bound by these Terms and our{" "}
                <Link to="/privacy" className="text-[#0066FF] underline">Privacy Policy</Link>.
                If you do not agree to these Terms, do not use the Service.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-semibold text-[#111111] mb-4">
                2. Eligibility
              </h2>
              <p className="text-[#555555] leading-relaxed">
                You must be at least 13 years old to use the Service. If you are between 13 and 18, you must
                have the consent of a parent or legal guardian. By using the Service, you represent and warrant
                that you meet these age requirements. We reserve the right to request proof of age and to
                suspend or terminate accounts where eligibility cannot be verified.
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
                To access the Service, you must create an account using one of the following methods:
              </p>
              <ul className="list-disc pl-6 text-[#555555] space-y-2 mb-4">
                <li>Email address and password</li>
                <li>Google OAuth (Sign in with Google)</li>
              </ul>
              <p className="text-[#555555] leading-relaxed mb-4">
                During onboarding, you will also be asked to select a primary gym, set fitness goals, and
                customise your profile (display name, avatar, bio).
              </p>

              <h3 className="text-lg font-medium text-[#111111] mt-6 mb-3">
                3.2 Account Responsibilities
              </h3>
              <p className="text-[#555555] leading-relaxed mb-4">
                You are responsible for:
              </p>
              <ul className="list-disc pl-6 text-[#555555] space-y-2">
                <li>Providing accurate and truthful information during registration and profile setup</li>
                <li>Maintaining the confidentiality and security of your account credentials</li>
                <li>All activities that occur under your account, whether or not you authorised them</li>
                <li>Notifying us immediately at <span className="text-[#0066FF]">support@gymgraph.in</span> if you suspect unauthorised access</li>
              </ul>
              <p className="text-[#555555] leading-relaxed mt-4">
                You may only maintain one account. Creating multiple accounts to gain unfair advantages
                (extra coins, challenge manipulation, etc.) is prohibited and grounds for termination
                of all associated accounts.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-semibold text-[#111111] mb-4">
                4. Description of Services
              </h2>
              <p className="text-[#555555] leading-relaxed mb-4">
                GymGraph is a fitness social networking platform. The Service includes:
              </p>
              <ul className="list-disc pl-6 text-[#555555] space-y-2">
                <li><strong>GPS-Verified Gym Check-ins:</strong> Check in at registered gyms by verifying your physical presence within approximately 100 metres via GPS</li>
                <li><strong>Streak Tracking:</strong> Track consecutive days of gym visits, with options to freeze or restore streaks using coins</li>
                <li><strong>Activity Feed:</strong> Share posts (text, photos) and stories (24-hour auto-expiring photo content) with the community</li>
                <li><strong>Social Connections:</strong> Connect with other users, view their activity, and build your fitness network</li>
                <li><strong>Challenges:</strong> Create or join time-limited fitness competitions with other users, including peer-validated activity submissions</li>
                <li><strong>Leaderboards:</strong> Competitive rankings across multiple scopes — global, city, gym, connections, and gym-vs-gym</li>
                <li><strong>Coin Economy:</strong> Earn virtual coins through check-ins, streaks, referrals, and challenge wins; spend coins on streak freezes, streak restorations, and reward redemptions</li>
                <li><strong>Badges and Achievements:</strong> Earn badges for reaching fitness milestones</li>
                <li><strong>Referral Programme:</strong> Invite friends using your unique referral code and earn bonus coins when they sign up</li>
                <li><strong>Gym Discovery:</strong> Search for gyms, browse nearby gyms, and submit new gyms not yet in our database</li>
                <li><strong>Push Notifications:</strong> Receive alerts for connection requests, challenge invitations, comments, reactions, streak reminders, and milestone achievements</li>
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
                The Service requires access to your device's precise location for the following purposes:
              </p>
              <ul className="list-disc pl-6 text-[#555555] space-y-2 mb-4">
                <li>Verifying you are physically present at a gym when checking in</li>
                <li>Showing nearby gyms for discovery and quick check-in</li>
                <li>Calculating walking distance to gyms</li>
              </ul>
              <p className="text-[#555555] leading-relaxed mb-4">
                Location is accessed in the foreground only. We do not track your location in the background
                or when the app is closed. See our{" "}
                <Link to="/privacy" className="text-[#0066FF] underline">Privacy Policy</Link> for full details.
              </p>

              <h3 className="text-lg font-medium text-[#111111] mt-6 mb-3">
                5.2 Location Requirements
              </h3>
              <p className="text-[#555555] leading-relaxed">
                You must be within the designated check-in radius (approximately 100 metres) of a registered
                gym to complete a check-in.{" "}
                <strong>Attempting to spoof, falsify, or manipulate your GPS location is a serious violation
                of these Terms</strong> and will result in immediate account suspension or permanent termination,
                along with forfeiture of all coins and rewards.
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
                You can earn virtual coins ("Coins") through the following activities:
              </p>
              <ul className="list-disc pl-6 text-[#555555] space-y-2 mb-4">
                <li><strong>Sign-up Bonus:</strong> 50 coins when you create your account</li>
                <li><strong>Daily Check-in:</strong> 25 coins per verified gym check-in</li>
                <li><strong>Streak Bonuses:</strong> 10 coins per day for maintaining daily streaks, plus milestone bonuses at 7, 30, 60, and 90 days</li>
                <li><strong>Challenge Wins:</strong> Share of the challenge prize pool based on final rankings</li>
                <li><strong>Referrals:</strong> 100 coins per successful referral (when a referred user completes registration)</li>
              </ul>

              <h3 className="text-lg font-medium text-[#111111] mt-6 mb-3">
                6.2 Spending Coins
              </h3>
              <ul className="list-disc pl-6 text-[#555555] space-y-2 mb-4">
                <li><strong>Streak Freeze:</strong> Spend coins to freeze your streak and protect it from breaking when you miss a day</li>
                <li><strong>Streak Restoration:</strong> Spend coins to restore a recently broken streak within the restoration deadline</li>
                <li><strong>Challenge Entry Fees:</strong> Some challenges require a coin entry fee that contributes to the prize pool</li>
                <li><strong>Reward Redemptions:</strong> Redeem coins for available rewards</li>
              </ul>

              <h3 className="text-lg font-medium text-[#111111] mt-6 mb-3">
                6.3 Coin Properties
              </h3>
              <ul className="list-disc pl-6 text-[#555555] space-y-2 mb-4">
                <li><strong>No Monetary Value:</strong> Coins have no real-world monetary value and cannot be exchanged for fiat currency, cryptocurrency, or any other form of money</li>
                <li><strong>Non-Transferable:</strong> Coins cannot be transferred, traded, gifted, or sold between users except through official Service features (e.g., challenge prize pools)</li>
                <li><strong>Non-Refundable:</strong> Coins spent on streak freezes, restorations, challenge entries, or redemptions are non-refundable</li>
                <li><strong>Subject to Change:</strong> We reserve the right to modify coin earning rates, spending costs, and the overall coin economy at any time with reasonable notice</li>
              </ul>

              <h3 className="text-lg font-medium text-[#111111] mt-6 mb-3">
                6.4 Forfeiture
              </h3>
              <p className="text-[#555555] leading-relaxed">
                If your account is terminated for violating these Terms, you forfeit all accumulated Coins
                without any right to compensation.
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
                <li>Challenges are voluntary fitness competitions between users</li>
                <li>Some challenges may require a coin entry fee that contributes to the prize pool</li>
                <li>Challenge types include 1-on-1, group, and gym-wide competitions</li>
                <li>You may be invited to challenges by other users; invitations can be accepted or declined</li>
              </ul>

              <h3 className="text-lg font-medium text-[#111111] mt-6 mb-3">
                7.2 Activity Validation
              </h3>
              <ul className="list-disc pl-6 text-[#555555] space-y-2 mb-4">
                <li>Challenge progress is tracked through verified gym check-ins</li>
                <li>Participants may submit activity for peer validation by other challenge members</li>
                <li>We reserve the right to review and invalidate suspicious activity submissions</li>
              </ul>

              <h3 className="text-lg font-medium text-[#111111] mt-6 mb-3">
                7.3 Rules and Fair Play
              </h3>
              <ul className="list-disc pl-6 text-[#555555] space-y-2 mb-4">
                <li>All check-ins must be legitimate — no GPS spoofing or location falsification</li>
                <li>Using multiple accounts to participate in the same challenge is prohibited</li>
                <li>Collusion with other participants to manipulate results is prohibited</li>
                <li>Users found cheating will be disqualified, may lose all coins, and may be permanently banned</li>
              </ul>

              <h3 className="text-lg font-medium text-[#111111] mt-6 mb-3">
                7.4 Cancellation and Prizes
              </h3>
              <ul className="list-disc pl-6 text-[#555555] space-y-2">
                <li>Challenges may be cancelled if minimum participation thresholds are not met; entry fees will be refunded in such cases</li>
                <li>We reserve the right to cancel any challenge for any reason</li>
                <li>Prizes (coins) are distributed based on the challenge rules and final rankings</li>
                <li>We reserve the right to withhold prizes and investigate if fraudulent activity is suspected</li>
              </ul>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-semibold text-[#111111] mb-4">
                8. User-Generated Content
              </h2>
              <h3 className="text-lg font-medium text-[#111111] mt-6 mb-3">
                8.1 Types of Content
              </h3>
              <p className="text-[#555555] leading-relaxed mb-4">
                You may create and share the following content on the Service:
              </p>
              <ul className="list-disc pl-6 text-[#555555] space-y-2 mb-4">
                <li><strong>Posts:</strong> Text and photo posts with categories including flex, rant, question, meme, and motivation</li>
                <li><strong>Stories:</strong> Photo-based stories with captions that automatically expire after 24 hours</li>
                <li><strong>Comments:</strong> Text responses on other users' posts</li>
                <li><strong>Reactions:</strong> Emoji reactions on posts</li>
                <li><strong>Profile Content:</strong> Display name, bio, avatar, and fitness goals</li>
                <li><strong>Gym Submissions:</strong> Information about gyms you submit to our database</li>
              </ul>

              <h3 className="text-lg font-medium text-[#111111] mt-6 mb-3">
                8.2 Content Visibility
              </h3>
              <ul className="list-disc pl-6 text-[#555555] space-y-2 mb-4">
                <li>Posts and stories can be set to <strong>public</strong> (visible to all users) or <strong>friends-only</strong> (visible only to your connections)</li>
                <li>Your profile information, streak count, badges, and leaderboard rankings are publicly visible</li>
                <li>Story view counts and viewer lists are visible to you</li>
              </ul>

              <h3 className="text-lg font-medium text-[#111111] mt-6 mb-3">
                8.3 Media Upload Rules
              </h3>
              <ul className="list-disc pl-6 text-[#555555] space-y-2 mb-4">
                <li>Maximum file size: 10 MB per image</li>
                <li>Accepted formats: JPG, JPEG, PNG, GIF, WebP</li>
                <li>Stories are captured in 9:16 aspect ratio</li>
                <li>Video uploads are not currently supported</li>
              </ul>

              <h3 className="text-lg font-medium text-[#111111] mt-6 mb-3">
                8.4 Content Standards
              </h3>
              <p className="text-[#555555] leading-relaxed mb-4">
                All content you share must comply with these standards. You must <strong>not</strong> post:
              </p>
              <ul className="list-disc pl-6 text-[#555555] space-y-2 mb-4">
                <li>Nudity, sexually explicit, or pornographic material</li>
                <li>Content promoting violence, self-harm, or dangerous activities</li>
                <li>Hate speech, discrimination, or content targeting individuals or groups based on race, ethnicity, religion, gender, sexual orientation, disability, or other protected characteristics</li>
                <li>Harassment, bullying, threats, or intimidation of other users</li>
                <li>Spam, misleading content, or commercial advertisements</li>
                <li>Content that infringes on intellectual property rights of others</li>
                <li>Personal information of others without their consent</li>
                <li>Content that promotes illegal activities</li>
              </ul>

              <h3 className="text-lg font-medium text-[#111111] mt-6 mb-3">
                8.5 Content Licence
              </h3>
              <p className="text-[#555555] leading-relaxed mb-4">
                By posting content to the Service, you grant GymGraph a worldwide, non-exclusive, royalty-free,
                sublicensable licence to use, display, reproduce, and distribute that content in connection with
                operating and promoting the Service. This licence ends when you delete the content or your account,
                except where the content has been shared with others who have not deleted it.
              </p>

              <h3 className="text-lg font-medium text-[#111111] mt-6 mb-3">
                8.6 Content Removal
              </h3>
              <p className="text-[#555555] leading-relaxed">
                We reserve the right to remove any content that violates these Terms, without prior notice.
                Repeated violations may result in account suspension or termination.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-semibold text-[#111111] mb-4">
                9. Referral Programme
              </h2>
              <ul className="list-disc pl-6 text-[#555555] space-y-2">
                <li>Each user receives a unique referral code that can be shared with others</li>
                <li>You earn 100 coins when a person you referred successfully creates an account using your code</li>
                <li>Abuse of the referral programme (self-referrals, fake accounts, referral farming) is prohibited and will result in loss of referral earnings and potential account termination</li>
                <li>We reserve the right to modify the referral bonus amount or suspend the programme at any time</li>
              </ul>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-semibold text-[#111111] mb-4">
                10. Reward Redemptions
              </h2>
              <ul className="list-disc pl-6 text-[#555555] space-y-2">
                <li>Coins may be redeemed for rewards as available in the Service</li>
                <li>Reward availability, coin costs, and redemption terms are subject to change</li>
                <li>Redeemed rewards are final and non-refundable</li>
                <li>We are not responsible for the quality, fulfilment, or suitability of third-party rewards</li>
              </ul>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-semibold text-[#111111] mb-4">
                11. Gym Submissions
              </h2>
              <p className="text-[#555555] leading-relaxed mb-4">
                Users may submit new gyms to be added to the GymGraph database. By submitting a gym:
              </p>
              <ul className="list-disc pl-6 text-[#555555] space-y-2">
                <li>You confirm the gym information (name, location) is accurate to the best of your knowledge</li>
                <li>We reserve the right to verify, edit, or reject gym submissions</li>
                <li>Submitting false or misleading gym locations is prohibited</li>
                <li>You are not compensated for gym submissions</li>
              </ul>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-semibold text-[#111111] mb-4">
                12. User Conduct
              </h2>
              <h3 className="text-lg font-medium text-[#111111] mt-6 mb-3">
                12.1 Acceptable Use
              </h3>
              <p className="text-[#555555] leading-relaxed mb-4">
                You agree to use the Service only for its intended purpose — fitness tracking, social
                networking with gym-goers, and participating in the GymGraph community — and in compliance
                with all applicable laws.
              </p>

              <h3 className="text-lg font-medium text-[#111111] mt-6 mb-3">
                12.2 Prohibited Conduct
              </h3>
              <p className="text-[#555555] leading-relaxed mb-4">
                You agree <strong>not</strong> to:
              </p>

              <p className="text-[#111111] font-medium mt-4 mb-2">Cheating and Fraud:</p>
              <ul className="list-disc pl-6 text-[#555555] space-y-2 mb-4">
                <li>Use GPS spoofing, mock locations, or any other method to falsify your physical location</li>
                <li>Create or operate multiple accounts</li>
                <li>Exploit bugs, glitches, or vulnerabilities for personal gain (report them to us instead)</li>
                <li>Manipulate challenge results through collusion or any other unfair means</li>
                <li>Abuse the referral programme through self-referrals or fake account creation</li>
              </ul>

              <p className="text-[#111111] font-medium mt-4 mb-2">Harmful Behaviour:</p>
              <ul className="list-disc pl-6 text-[#555555] space-y-2 mb-4">
                <li>Harass, bully, stalk, or intimidate other users</li>
                <li>Post offensive, hateful, discriminatory, or sexually explicit content</li>
                <li>Impersonate another person, user, or entity</li>
                <li>Share another person's personal information without their consent (doxing)</li>
                <li>Send spam, unsolicited messages, or repetitive content</li>
              </ul>

              <p className="text-[#111111] font-medium mt-4 mb-2">Security Violations:</p>
              <ul className="list-disc pl-6 text-[#555555] space-y-2 mb-4">
                <li>Attempt to access other users' accounts or private data</li>
                <li>Interfere with or disrupt the Service's infrastructure or security features</li>
                <li>Reverse engineer, decompile, disassemble, or attempt to derive the source code of the Service</li>
                <li>Use automated systems, bots, scrapers, or scripts to access or interact with the Service</li>
                <li>Circumvent rate limits, access controls, or other security measures</li>
              </ul>

              <p className="text-[#111111] font-medium mt-4 mb-2">Misuse of Services:</p>
              <ul className="list-disc pl-6 text-[#555555] space-y-2">
                <li>Use the Service for commercial purposes, advertising, or solicitation without our written consent</li>
                <li>Upload malware, viruses, or any other harmful code</li>
                <li>Violate any applicable local, state, national, or international laws or regulations</li>
              </ul>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-semibold text-[#111111] mb-4">
                13. Intellectual Property
              </h2>
              <h3 className="text-lg font-medium text-[#111111] mt-6 mb-3">
                13.1 Our Rights
              </h3>
              <p className="text-[#555555] leading-relaxed mb-4">
                The Service and its original content (excluding user-generated content), including but not
                limited to text, graphics, logos, icons, images, software, badge designs, and leaderboard
                systems, are owned by GymGraph and protected by intellectual property laws.
              </p>

              <h3 className="text-lg font-medium text-[#111111] mt-6 mb-3">
                13.2 Limited Licence
              </h3>
              <p className="text-[#555555] leading-relaxed mb-4">
                We grant you a limited, non-exclusive, non-transferable, revocable licence to access and use
                the Service for personal, non-commercial purposes in accordance with these Terms. This licence
                does not include the right to modify, reproduce, distribute, or create derivative works from
                the Service.
              </p>

              <h3 className="text-lg font-medium text-[#111111] mt-6 mb-3">
                13.3 User Content Ownership
              </h3>
              <p className="text-[#555555] leading-relaxed">
                You retain ownership of the content you create and post on the Service. The licence you grant
                us (described in Section 8.5) is limited to operating and improving the Service.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-semibold text-[#111111] mb-4">
                14. Third-Party Services
              </h2>
              <p className="text-[#555555] leading-relaxed mb-4">
                The Service integrates with the following third-party services:
              </p>
              <ul className="list-disc pl-6 text-[#555555] space-y-2 mb-4">
                <li><strong>Google:</strong> Authentication (Sign in with Google) and Maps/Distance Matrix API for gym distance calculations</li>
                <li><strong>Supabase:</strong> Database, authentication, file storage, and real-time features</li>
                <li><strong>Mixpanel:</strong> Product analytics to improve the Service</li>
                <li><strong>Sentry:</strong> Error monitoring and crash reporting for app stability</li>
                <li><strong>OneSignal:</strong> Push notification delivery</li>
                <li><strong>Expo:</strong> App updates and build infrastructure</li>
              </ul>
              <p className="text-[#555555] leading-relaxed">
                Your use of these third-party services is subject to their respective terms and privacy
                policies. We are not responsible for the practices, content, or availability of third-party
                services. Links to their terms can be found on their respective websites.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-semibold text-[#111111] mb-4">
                15. Disclaimers
              </h2>
              <div className="bg-[#FEF3C7] border border-[#FCD34D] rounded-xl p-4 mb-4">
                <div className="flex gap-3">
                  <AlertTriangle className="w-5 h-5 text-[#92400E] shrink-0 mt-0.5" />
                  <div>
                    <p className="text-[#92400E] font-medium mb-2">"As Is" Basis</p>
                    <p className="text-[#92400E] text-sm">
                      THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND,
                      EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO WARRANTIES OF MERCHANTABILITY, FITNESS
                      FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT.
                    </p>
                  </div>
                </div>
              </div>

              <h3 className="text-lg font-medium text-[#111111] mt-6 mb-3">
                15.1 No Fitness or Medical Advice
              </h3>
              <p className="text-[#555555] leading-relaxed mb-4">
                GymGraph is a fitness tracking and social tool. We do <strong>not</strong> provide medical
                advice, fitness programmes, dietary recommendations, or health assessments. Always consult a
                qualified healthcare professional before starting, changing, or intensifying any exercise
                programme. We are not liable for any injuries, health issues, or damages resulting from your
                use of the Service or any fitness activities.
              </p>

              <h3 className="text-lg font-medium text-[#111111] mt-6 mb-3">
                15.2 Service Availability
              </h3>
              <p className="text-[#555555] leading-relaxed mb-4">
                We do not guarantee the Service will be available at all times, uninterrupted, or free from
                errors. We may modify, suspend, or discontinue any feature or the entire Service at any time,
                with or without notice. Scheduled maintenance, updates, and unforeseen technical issues may
                affect availability.
              </p>

              <h3 className="text-lg font-medium text-[#111111] mt-6 mb-3">
                15.3 Gym Information
              </h3>
              <p className="text-[#555555] leading-relaxed mb-4">
                We do not guarantee the accuracy, completeness, or currency of gym information including
                names, locations, operating hours, or facilities. Gym data may be user-submitted. Always
                verify details directly with the gym before visiting.
              </p>

              <h3 className="text-lg font-medium text-[#111111] mt-6 mb-3">
                15.4 User Content
              </h3>
              <p className="text-[#555555] leading-relaxed">
                We do not endorse, verify, or guarantee the accuracy of user-generated content (posts,
                stories, comments, gym submissions). Views expressed by users are their own and do not
                represent GymGraph.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-semibold text-[#111111] mb-4">
                16. Limitation of Liability
              </h2>
              <p className="text-[#555555] leading-relaxed mb-4 uppercase text-sm">
                TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW:
              </p>
              <ul className="list-disc pl-6 text-[#555555] space-y-2">
                <li>GYMGRAPH, ITS OFFICERS, DIRECTORS, EMPLOYEES, AND AGENTS SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING LOSS OF DATA, PROFITS, OR GOODWILL</li>
                <li>OUR TOTAL AGGREGATE LIABILITY SHALL NOT EXCEED THE AMOUNT YOU HAVE PAID US IN THE 12 MONTHS PRECEDING THE CLAIM, OR INR 5,000 (WHICHEVER IS GREATER)</li>
                <li>WE ARE NOT LIABLE FOR INJURIES, ILLNESS, OR HARM SUSTAINED DURING WORKOUTS, GYM VISITS, OR ANY FITNESS ACTIVITIES UNDERTAKEN IN CONNECTION WITH THE SERVICE</li>
                <li>WE ARE NOT LIABLE FOR LOSS OF VIRTUAL COINS DUE TO ACCOUNT TERMINATION, SERVICE CHANGES, OR TECHNICAL ISSUES</li>
              </ul>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-semibold text-[#111111] mb-4">
                17. Indemnification
              </h2>
              <p className="text-[#555555] leading-relaxed">
                You agree to indemnify, defend, and hold harmless GymGraph, its officers, directors,
                employees, and agents from and against any claims, damages, losses, liabilities, costs, or
                expenses (including reasonable attorneys' fees) arising from or related to:
              </p>
              <ul className="list-disc pl-6 text-[#555555] space-y-2 mt-2">
                <li>Your use of the Service</li>
                <li>Content you post or share on the Service</li>
                <li>Your violation of these Terms</li>
                <li>Your violation of any applicable laws or third-party rights</li>
                <li>Any dispute between you and another user</li>
              </ul>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-semibold text-[#111111] mb-4">
                18. Termination
              </h2>
              <h3 className="text-lg font-medium text-[#111111] mt-6 mb-3">
                18.1 By You
              </h3>
              <p className="text-[#555555] leading-relaxed mb-4">
                You may stop using the Service and request account deletion at any time by contacting us
                at <span className="text-[#0066FF]">support@gymgraph.in</span>. Upon deletion, your personal
                data will be removed in accordance with our{" "}
                <Link to="/privacy" className="text-[#0066FF] underline">Privacy Policy</Link>.
              </p>

              <h3 className="text-lg font-medium text-[#111111] mt-6 mb-3">
                18.2 By Us
              </h3>
              <p className="text-[#555555] leading-relaxed mb-4">
                We may suspend or terminate your account at any time, with or without prior notice, for:
              </p>
              <ul className="list-disc pl-6 text-[#555555] space-y-2 mb-4">
                <li>Violation of these Terms (including GPS spoofing, multiple accounts, content policy violations)</li>
                <li>Fraudulent, abusive, or illegal activity</li>
                <li>Behaviour that harms other users or the GymGraph community</li>
                <li>Extended inactivity (12 months or more)</li>
                <li>Any other reason at our reasonable discretion</li>
              </ul>

              <h3 className="text-lg font-medium text-[#111111] mt-6 mb-3">
                18.3 Effect of Termination
              </h3>
              <p className="text-[#555555] leading-relaxed">
                Upon termination:
              </p>
              <ul className="list-disc pl-6 text-[#555555] space-y-2 mt-2">
                <li>Your right to use the Service ceases immediately</li>
                <li>All accumulated Coins and rewards are forfeited without compensation</li>
                <li>Active challenge participations are ended</li>
                <li>Your content may be removed</li>
                <li>We will process your data deletion in accordance with our Privacy Policy</li>
              </ul>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-semibold text-[#111111] mb-4">
                19. Dispute Resolution
              </h2>
              <h3 className="text-lg font-medium text-[#111111] mt-6 mb-3">
                19.1 Informal Resolution
              </h3>
              <p className="text-[#555555] leading-relaxed mb-4">
                Before initiating any formal dispute, you agree to first contact us at{" "}
                <span className="text-[#0066FF]">support@gymgraph.in</span> to attempt to resolve the matter
                informally. We will make good-faith efforts to resolve your concern within 30 days.
              </p>

              <h3 className="text-lg font-medium text-[#111111] mt-6 mb-3">
                19.2 Governing Law
              </h3>
              <p className="text-[#555555] leading-relaxed mb-4">
                These Terms are governed by and construed in accordance with the laws of India, including
                the Information Technology Act, 2000 and the Digital Personal Data Protection Act, 2023,
                without regard to conflict of law principles. Any disputes arising under these Terms shall
                be subject to the exclusive jurisdiction of the courts in Hyderabad, Telangana, India.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-semibold text-[#111111] mb-4">
                20. Changes to Terms
              </h2>
              <p className="text-[#555555] leading-relaxed mb-4">
                We may modify these Terms at any time. We will notify you of material changes by:
              </p>
              <ul className="list-disc pl-6 text-[#555555] space-y-2 mb-4">
                <li>Posting the updated Terms on this page</li>
                <li>Updating the "Last updated" date</li>
                <li>Sending a push notification or in-app notice for material changes</li>
              </ul>
              <p className="text-[#555555] leading-relaxed">
                Continued use of the Service after changes take effect constitutes acceptance of the new Terms.
                If you do not agree to the updated Terms, you must stop using the Service and may request
                account deletion.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-semibold text-[#111111] mb-4">
                21. General Provisions
              </h2>
              <ul className="list-disc pl-6 text-[#555555] space-y-2">
                <li><strong>Entire Agreement:</strong> These Terms, together with our <Link to="/privacy" className="text-[#0066FF] underline">Privacy Policy</Link>, constitute the entire agreement between you and GymGraph regarding the Service</li>
                <li><strong>Severability:</strong> If any provision of these Terms is found to be invalid or unenforceable, the remaining provisions will continue in full force and effect</li>
                <li><strong>No Waiver:</strong> Our failure to enforce any right or provision of these Terms does not constitute a waiver of that right or provision</li>
                <li><strong>Assignment:</strong> You may not assign or transfer your rights under these Terms without our prior written consent. We may assign our rights without restriction</li>
                <li><strong>Force Majeure:</strong> We shall not be liable for any failure or delay in performance resulting from circumstances beyond our reasonable control, including natural disasters, internet outages, government actions, or pandemic-related disruptions</li>
              </ul>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-semibold text-[#111111] mb-4">
                22. Contact Us
              </h2>
              <p className="text-[#555555] leading-relaxed">
                If you have any questions about these Terms of Service, please contact us:
              </p>
              <div className="mt-4 p-4 bg-[#F8F9FA] rounded-xl space-y-3">
                <div>
                  <p className="text-[#111111] font-medium">GymGraph</p>
                  <p className="text-[#555555]">Hyderabad, Telangana, India</p>
                </div>
                <div>
                  <p className="text-[#555555] text-sm font-medium">General Support</p>
                  <p className="text-[#0066FF]">support@gymgraph.in</p>
                </div>
                <div>
                  <p className="text-[#555555] text-sm font-medium">Legal Enquiries</p>
                  <p className="text-[#0066FF]">legal@gymgraph.in</p>
                </div>
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
