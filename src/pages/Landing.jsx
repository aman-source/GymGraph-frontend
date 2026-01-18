import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/lib/supabase";
import {
  Trophy,
  Users,
  MapPin,
  Award,
  ArrowRight,
  X,
  Loader2,
  Star,
  Flame,
  CheckCircle2,
  Gift,
  Repeat,
  ChevronRight,
  Phone,
} from "lucide-react";

// GymGraph Mountain Logo Component
const GymGraphLogo = ({ className = "w-6 h-6", color = "white" }) => (
  <svg viewBox="0 0 512 512" className={className} fill={color}>
    <polygon points="80,400 220,160 320,400" />
    <polygon points="200,400 340,100 460,400" />
  </svg>
);

export default function Landing() {
  const [searchParams] = useSearchParams();
  const [checking, setChecking] = useState(true);
  const [referralCode, setReferralCode] = useState(null);

  // Waitlist form state
  const [waitlistEmail, setWaitlistEmail] = useState("");
  const [waitlistName, setWaitlistName] = useState("");
  const [waitlistPhone, setWaitlistPhone] = useState("");
  const [waitlistCity, setWaitlistCity] = useState("");
  const [interestType, setInterestType] = useState("user");
  const [waitlistLoading, setWaitlistLoading] = useState(false);
  const [waitlistSuccess, setWaitlistSuccess] = useState(false);
  const [waitlistError, setWaitlistError] = useState("");

  // Hero journey steps - visual loop
  const journeySteps = [
    {
      text: "Check in",
      subtext: "GPS verified. Earn coins."
    },
    {
      text: "Build streaks",
      subtext: "Stay consistent. Unlock badges."
    },
    {
      text: "Compete",
      subtext: "Leaderboards. Bragging rights."
    },
    {
      text: "Connect",
      subtext: "Find gym partners."
    },
  ];

  // Testimonial carousel state
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  // Auto-slide effect for testimonials
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % 10); // 10 testimonials
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  // Capture referral code from URL and store in localStorage
  useEffect(() => {
    const refCode = searchParams.get('ref');
    if (refCode && refCode.length >= 6) {
      const cleanCode = refCode.toUpperCase().slice(0, 8);
      setReferralCode(cleanCode);
      localStorage.setItem('gymgraph_referral_code', cleanCode);
    } else {
      const storedCode = localStorage.getItem('gymgraph_referral_code');
      if (storedCode) {
        setReferralCode(storedCode);
      }
    }
    setChecking(false);
  }, [searchParams]);

  // Waitlist form submission
  const handleWaitlistSubmit = async (e) => {
    e.preventDefault();
    setWaitlistLoading(true);
    setWaitlistError("");

    try {
      // Get UTM params from URL
      const urlParams = new URLSearchParams(window.location.search);

      const { error } = await supabase
        .from('waitlist')
        .insert({
          email: waitlistEmail.toLowerCase().trim(),
          name: waitlistName.trim() || null,
          phone: waitlistPhone.trim() || null,
          city: waitlistCity.trim() || null,
          interest_type: interestType,
          referral_source: referralCode || null,
          utm_source: urlParams.get('utm_source'),
          utm_medium: urlParams.get('utm_medium'),
          utm_campaign: urlParams.get('utm_campaign'),
        });

      if (error) {
        if (error.code === '23505') { // Unique violation
          setWaitlistError("You're already on the waitlist! We'll notify you when we launch.");
        } else {
          throw error;
        }
      } else {
        setWaitlistSuccess(true);
      }
    } catch (err) {
      setWaitlistError("Something went wrong. Please try again.");
      console.error(err);
    } finally {
      setWaitlistLoading(false);
    }
  };

  // Scroll to waitlist form
  const scrollToWaitlist = () => {
    document.getElementById('waitlist-form')?.scrollIntoView({ behavior: 'smooth' });
  };

  if (checking) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-14 h-14 bg-gradient-to-br from-[#0066FF] to-[#0052CC] rounded-2xl flex items-center justify-center shadow-lg animate-pulse">
            <GymGraphLogo className="w-8 h-8" />
          </div>
          <div className="w-6 h-6 border-2 border-[#0066FF] border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  const features = [
    { icon: MapPin, title: "GPS Check-ins", description: "We verify you're actually at the gym. No faking it." },
    { icon: Flame, title: "Streak System", description: "Miss a week? Lose your streak. Simple motivation." },
    { icon: Gift, title: "Earn Rewards", description: "Every workout earns rewards. Redeem for real stuff." },
    { icon: Users, title: "Gym Community", description: "See who's at your gym. Find workout partners." },
    { icon: Trophy, title: "Leaderboards", description: "Compete for #1 at your gym. Bragging rights included." },
    { icon: Award, title: "Achievements", description: "Unlock badges. Show off your consistency." }
  ];

  const testimonials = [
    {
      quote: "Bro I literally set 5AM alarms now because I refuse to let Arjun beat me on the leaderboard. We're not even friends anymore. We're rivals.",
      author: "CA Student, Pune",
      highlight: "#2 at Gold's Gym"
    },
    {
      quote: "Met my girlfriend here lol. Saw her on the gym leaderboard, realized we work out at the same time. Slid into the connections. Rest is history.",
      author: "Product Designer, Bangalore",
      highlight: "147 connections"
    },
    {
      quote: "I was that guy with a gym membership I used twice a year. 8 months later, 156 check-ins. The streak guilt is real and I love it.",
      author: "Startup Founder, Mumbai",
      highlight: "34-week streak"
    },
    {
      quote: "The 6AM Warrior badge changed me. I'm not a morning person. But I'm a badge collector. So now I guess I'm a morning person.",
      author: "Lawyer, Delhi",
      highlight: "12 badges earned"
    },
    {
      quote: "My whole office uses this now. We have a Slack channel just for trash talking whoever falls behind on the weekly board.",
      author: "Tech Lead, Hyderabad",
      highlight: "23 connections"
    },
    {
      quote: "Got my first free protein shake after 2 weeks. That's when I realized this app is lowkey genius. Now I'm saving ₹3k/month on supplements.",
      author: "Fitness Coach, Chennai",
      highlight: "2,400 coins earned"
    },
    {
      quote: "I have commitment issues with everything except my gym streak apparently. 67 weeks and counting. This app fixed me.",
      author: "Content Creator, Gurgaon",
      highlight: "67-week streak"
    },
    {
      quote: "My dad started using this after seeing my progress. He's 54 and just hit a 20-week streak. We compete on family leaderboard now.",
      author: "Doctor, Kolkata",
      highlight: "Family rank #1"
    },
    {
      quote: "The notification 'Your rival just checked in' hits different. I dropped my coffee and went straight to the gym. Twice this week.",
      author: "Sales Manager, Ahmedabad",
      highlight: "Rival defeated 12x"
    },
    {
      quote: "Used to make excuses like 'I'll go tomorrow'. Now my excuse is 'I can't let my streak die'. Much better excuse tbh.",
      author: "Engineering Student, Jaipur",
      highlight: "89-day streak"
    },
  ];

  return (
    <div className="min-h-screen bg-white overflow-x-hidden" data-testid="landing-page">
      {/* Custom CSS for animations */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        @keyframes gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 4s ease infinite;
        }
        @keyframes slideFromBottom {
          0% { opacity: 0; transform: translateY(40px); }
          12% { opacity: 1; transform: translateY(0); }
          88% { opacity: 1; transform: translateY(0); }
          100% { opacity: 0; transform: translateY(-40px); }
        }
        .slide-up-text {
          animation: slideFromBottom 3s ease-in-out forwards;
        }
        @keyframes fadeSlide {
          0% { opacity: 0; transform: translateX(30px); }
          10% { opacity: 1; transform: translateX(0); }
          90% { opacity: 1; transform: translateX(0); }
          100% { opacity: 0; transform: translateX(-30px); }
        }
        .testimonial-slide {
          animation: fadeSlide 5s ease-in-out;
        }
        .testimonial-track {
          display: flex;
          transition: transform 0.5s ease-in-out;
        }
      `}</style>

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-xl border-b border-[#E5E7EB]/50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-[#0066FF] to-[#0052CC] rounded-xl flex items-center justify-center shadow-md shadow-[#0066FF]/20">
              <GymGraphLogo className="w-6 h-6" />
            </div>
            <span className="text-xl font-bold text-[#111111]">GymGraph</span>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <span className="text-[#FF6B00] font-semibold text-sm hidden sm:flex items-center gap-1.5">
              <Flame className="w-4 h-4" />
              Launching Soon
            </span>
            <Button
              onClick={scrollToWaitlist}
              className="bg-[#0066FF] hover:bg-[#0052CC] text-white font-semibold px-3 sm:px-5 text-sm sm:text-base rounded-xl shadow-md shadow-[#0066FF]/20 transition-all duration-200 hover:-translate-y-0.5"
              data-testid="join-waitlist-nav"
            >
              <span className="hidden sm:inline">Become a Founder</span>
              <span className="sm:hidden">Join</span>
              <ArrowRight className="w-4 h-4 ml-1 sm:ml-1.5" />
            </Button>
          </div>
        </div>
      </nav>

      {/* Referral Banner */}
      {referralCode && (
        <div className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-[#0066FF] via-[#0052CC] to-[#0066FF] py-2.5 px-4 animate-slide-down">
          <div className="max-w-7xl mx-auto flex items-center justify-center gap-3">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center">
                <Gift className="w-3.5 h-3.5 text-white" />
              </div>
              <span className="text-white text-sm font-medium">
                You've been invited! Join as a <strong>Founding Member</strong> before spots fill up
              </span>
            </div>
            <button
              onClick={() => {
                setReferralCode(null);
                localStorage.removeItem('gymgraph_referral_code');
              }}
              className="text-white/80 hover:text-white ml-2"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section className={`pb-16 lg:pb-20 px-6 relative overflow-hidden ${referralCode ? 'pt-36 lg:pt-44' : 'pt-28 lg:pt-36'}`}>
        {/* Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-[#0066FF]/5 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-[#0066FF]/5 rounded-full blur-3xl" />
        </div>

        <div className="max-w-6xl mx-auto relative">
          {/* Main Hero Content */}
          <div className="text-center mb-12">
            {/* Coming Soon Badge */}
            <div className="inline-flex items-center gap-2 bg-[#FF6B00]/10 border border-[#FF6B00]/30 rounded-full px-4 py-2 mb-6">
              <Flame className="w-4 h-4 text-[#FF6B00]" />
              <span className="text-[#FF6B00] font-semibold text-sm">Overwhelmed with demand — App launching soon!</span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-[#111111] mb-6 leading-[1.1]">
              Finally, a reason to
              <span className="text-[#0066FF]"> actually go</span> to the gym
            </h1>
            <p className="text-lg sm:text-xl text-[#555555] max-w-2xl mx-auto mb-8">
              Turn every workout into rewards. Compete with friends. Get free supplements.
            </p>
            <Button
              onClick={scrollToWaitlist}
              size="lg"
              className="bg-[#0066FF] hover:bg-[#0052CC] text-white text-lg px-10 py-6 rounded-xl font-semibold shadow-lg shadow-[#0066FF]/25 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-[#0066FF]/30"
              data-testid="join-waitlist-hero"
            >
              Join the Waitlist
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>

          {/* Visual Loop - The Hook */}
          <div className="relative mt-16">
            {/* Center circle */}
            <div className="hidden lg:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 bg-[#0066FF] rounded-full items-center justify-center shadow-xl shadow-[#0066FF]/30 z-10">
              <Repeat className="w-10 h-10 text-white" />
            </div>

            {/* Loop Steps */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-8">
              {journeySteps.slice(0, 4).map((step, index) => (
                <div
                  key={index}
                  className="group relative bg-white p-6 rounded-2xl border-2 border-[#E5E7EB] hover:border-[#0066FF] transition-all duration-300 hover:shadow-xl cursor-pointer"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  {/* Step number */}
                  <div className="absolute -top-3 -left-3 w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm bg-[#0066FF]">
                    {index + 1}
                  </div>

                  {/* Arrow to next */}
                  {index < 3 && (
                    <div className="hidden lg:block absolute -right-6 top-1/2 -translate-y-1/2 z-20">
                      <ChevronRight className="w-6 h-6 text-[#0066FF]" />
                    </div>
                  )}

                  <p className="font-bold text-lg mb-2 group-hover:scale-105 transition-transform text-[#0066FF]">
                    {step.text}
                  </p>
                  <p className="text-sm text-[#666666]">{step.subtext}</p>
                </div>
              ))}
            </div>

            {/* Final reward callout */}
            <div className="mt-8 flex justify-center">
              <div className="inline-flex items-center gap-3 bg-[#0066FF]/10 border border-[#0066FF]/30 rounded-full px-6 py-3">
                <Gift className="w-5 h-5 text-[#0066FF]" />
                <span className="font-semibold text-[#0066FF]">Then redeem for real rewards: Protein, Supplements, Gym Gear</span>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* Features Section */}
      <section className="py-20 px-6 bg-[#F8F9FA]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <span className="text-[#0066FF] font-semibold text-sm uppercase tracking-wide">Features</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-[#111111] mt-3 mb-4">Built to Keep You Hooked</h2>
            <p className="text-lg text-[#555555] max-w-2xl mx-auto">Every feature designed to make skipping the gym painful</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <div key={index} className="group bg-white p-6 rounded-2xl border border-[#E5E7EB] hover:border-[#0066FF]/30 hover:shadow-xl transition-all duration-300">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110 bg-[#0066FF]/10">
                  <feature.icon className="w-6 h-6 text-[#0066FF]" />
                </div>
                <h3 className="text-lg font-semibold text-[#111111] mb-2">{feature.title}</h3>
                <p className="text-[#555555] text-sm leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-6 bg-white overflow-hidden">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <span className="text-[#0066FF] font-semibold text-sm uppercase tracking-wide">Real Stories</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-[#111111] mt-3 mb-4">People Can't Shut Up About It</h2>
            <p className="text-lg text-[#555555]">These are actual users. We couldn't make this up.</p>
          </div>

          {/* Desktop: Show 3 at a time with carousel */}
          <div className="hidden md:block relative">
            <div className="overflow-hidden">
              <div
                className="testimonial-track"
                style={{ transform: `translateX(-${(currentTestimonial % (testimonials.length - 2)) * 33.33}%)` }}
              >
                {testimonials.map((testimonial, index) => (
                  <div key={index} className="min-w-[33.33%] px-3">
                    <div className="bg-[#F8F9FA] p-6 rounded-2xl border border-[#E5E7EB] h-full">
                      <div className="flex items-center gap-0.5 text-[#0066FF] mb-4">
                        {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />)}
                      </div>
                      <p className="text-[#333333] leading-relaxed mb-6 text-[15px]">"{testimonial.quote}"</p>
                      <div className="flex items-center justify-between pt-4 border-t border-[#E5E7EB]">
                        <span className="text-[#888888] text-sm">{testimonial.author}</span>
                        <span className="text-[#0066FF] text-sm font-semibold">{testimonial.highlight}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Navigation dots */}
            <div className="flex justify-center gap-2 mt-8">
              {[...Array(testimonials.length - 2)].map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentTestimonial(index)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    (currentTestimonial % (testimonials.length - 2)) === index
                      ? 'w-8 bg-[#0066FF]'
                      : 'w-2 bg-[#E5E7EB] hover:bg-[#D1D5DB]'
                  }`}
                  aria-label={`Go to testimonial ${index + 1}`}
                />
              ))}
            </div>
          </div>

          {/* Mobile: Single testimonial carousel */}
          <div className="md:hidden">
            <div className="relative overflow-hidden">
              <div
                key={currentTestimonial}
                className="testimonial-slide bg-[#F8F9FA] p-6 rounded-2xl border border-[#E5E7EB]"
              >
                <div className="flex items-center gap-0.5 text-[#0066FF] mb-4">
                  {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />)}
                </div>
                <p className="text-[#333333] leading-relaxed mb-6 text-[15px]">"{testimonials[currentTestimonial].quote}"</p>
                <div className="flex items-center justify-between pt-4 border-t border-[#E5E7EB]">
                  <span className="text-[#888888] text-sm">{testimonials[currentTestimonial].author}</span>
                  <span className="text-[#0066FF] text-sm font-semibold">{testimonials[currentTestimonial].highlight}</span>
                </div>
              </div>
            </div>

            {/* Mobile navigation dots */}
            <div className="flex justify-center gap-2 mt-6">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentTestimonial(index)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    currentTestimonial === index
                      ? 'w-6 bg-[#0066FF]'
                      : 'w-2 bg-[#E5E7EB] hover:bg-[#D1D5DB]'
                  }`}
                  aria-label={`Go to testimonial ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Waitlist Section */}
      <section id="waitlist-form" className="py-20 px-6 bg-[#F8F9FA]">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 bg-[#FF6B00]/10 rounded-full px-4 py-2 mb-4">
              <Flame className="w-4 h-4 text-[#FF6B00]" />
              <span className="text-[#FF6B00] font-semibold text-sm">Limited Founding Member Spots</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-[#111111] mb-4">
              We're Almost Ready
            </h2>
            <p className="text-lg text-[#555555]">
              The response has been incredible. We're working hard to launch and can't wait to have you.
              Join as a <strong>Founding Member</strong> and be first in line.
            </p>
          </div>

          {waitlistSuccess ? (
            <div className="bg-white rounded-2xl p-8 border border-[#E5E7EB] text-center">
              <div className="w-16 h-16 bg-[#00C853]/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="w-8 h-8 text-[#00C853]" />
              </div>
              <h3 className="text-2xl font-bold text-[#111111] mb-2">You're a Founding Member!</h3>
              <p className="text-[#555555] mb-6">
                We'll notify you the moment we launch. As a Founding Member, you'll get exclusive early access and special perks.
              </p>
              <div className="flex items-center justify-center gap-2 text-[#0066FF]">
                <Award className="w-5 h-5" />
                <span className="font-semibold">Founding Member Status Secured</span>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl p-8 border border-[#E5E7EB]">
              <form onSubmit={handleWaitlistSubmit} className="space-y-5">
                <div>
                  <label className="text-sm font-medium text-[#555555] mb-1.5 block">Email Address *</label>
                  <Input
                    type="email"
                    value={waitlistEmail}
                    onChange={(e) => setWaitlistEmail(e.target.value)}
                    placeholder="you@example.com"
                    required
                    className="h-12 bg-[#F8F9FA] border-[#E5E7EB] rounded-xl"
                  />
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-[#555555] mb-1.5 block">Your Name</label>
                    <Input
                      type="text"
                      value={waitlistName}
                      onChange={(e) => setWaitlistName(e.target.value)}
                      placeholder="John Doe"
                      className="h-12 bg-[#F8F9FA] border-[#E5E7EB] rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-[#555555] mb-1.5 block">Phone Number</label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#888888]" />
                      <Input
                        type="tel"
                        value={waitlistPhone}
                        onChange={(e) => setWaitlistPhone(e.target.value)}
                        placeholder="+91 98765 43210"
                        className="h-12 bg-[#F8F9FA] border-[#E5E7EB] rounded-xl pl-10"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-[#555555] mb-1.5 block">City</label>
                  <Input
                    type="text"
                    value={waitlistCity}
                    onChange={(e) => setWaitlistCity(e.target.value)}
                    placeholder="Mumbai, Delhi, Bangalore, etc."
                    className="h-12 bg-[#F8F9FA] border-[#E5E7EB] rounded-xl"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-[#555555] mb-2 block">I am a...</label>
                  <div className="flex flex-wrap gap-2">
                    {[
                      { value: 'user', label: 'Fitness Enthusiast' },
                      { value: 'gym_owner', label: 'Gym Owner' },
                      { value: 'partner', label: 'Brand Partner' }
                    ].map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => setInterestType(option.value)}
                        className={`px-4 py-2 rounded-xl font-medium text-sm transition-all ${
                          interestType === option.value
                            ? 'bg-[#0066FF] text-white'
                            : 'bg-[#F8F9FA] text-[#555555] hover:bg-[#E5E7EB]'
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>

                {waitlistError && (
                  <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl">
                    <p className="text-amber-700 text-sm text-center">{waitlistError}</p>
                  </div>
                )}

                <Button
                  type="submit"
                  disabled={waitlistLoading || !waitlistEmail}
                  className="w-full h-14 bg-[#0066FF] hover:bg-[#0052CC] text-white rounded-xl font-semibold text-lg"
                >
                  {waitlistLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      <Award className="w-5 h-5 mr-2" />
                      Become a Founding Member
                    </>
                  )}
                </Button>

                <p className="text-center text-xs text-[#888888]">
                  We'll only email you when we launch. No spam, ever.
                </p>
              </form>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-gradient-to-br from-[#0066FF] via-[#0052CC] to-[#003D99] relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-white/10 rounded-full blur-3xl" />
        </div>
        <div className="max-w-3xl mx-auto text-center relative">
          <div className="inline-flex items-center gap-2 bg-white/20 rounded-full px-4 py-2 mb-6">
            <Flame className="w-4 h-4 text-white" />
            <span className="text-white font-medium text-sm">Launching very soon — Don't miss out</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
            Founding Members Get In First
          </h2>
          <p className="text-lg sm:text-xl text-white/80 mb-10 max-w-xl mx-auto">
            We've been overwhelmed by the response. Secure your spot as a Founding Member and be first to experience GymGraph.
          </p>
          <Button
            onClick={scrollToWaitlist}
            size="lg"
            className="bg-white text-[#0066FF] hover:bg-[#F8F9FA] text-lg px-10 py-6 rounded-xl font-semibold shadow-lg transition-all duration-200 hover:-translate-y-0.5"
            data-testid="cta-button"
          >
            Claim Your Spot
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
          <p className="text-white/60 text-sm mt-6">Limited Founding Member spots available.</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 bg-[#111111]">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-[#0066FF] to-[#0052CC] rounded-xl flex items-center justify-center">
                <GymGraphLogo className="w-6 h-6" />
              </div>
              <span className="text-lg font-bold text-white">GymGraph</span>
            </div>
            <div className="flex items-center gap-8">
              <Link to="/about" className="text-[#888888] hover:text-white transition-colors text-sm">About</Link>
              <Link to="/contact" className="text-[#888888] hover:text-white transition-colors text-sm">Contact</Link>
              <Link to="/terms" className="text-[#888888] hover:text-white transition-colors text-sm">Terms</Link>
              <Link to="/privacy" className="text-[#888888] hover:text-white transition-colors text-sm">Privacy</Link>
            </div>
            <p className="text-[#888888] text-sm">© {new Date().getFullYear()} GymGraph. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
