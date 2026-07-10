import React, { useState } from "react";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import {
  StarIcon,
  UserCircle,
  ShieldCheckIcon,
  QuoteIcon,
  TrendingUpIcon,
  UsersIcon,
  MapPinIcon,
  AwardIcon,
} from "lucide-react";

// ── Premium design system SVG components ──────────────────────────────────────

const TunnelGrid = ({ color = "rgba(255,255,255,0.18)" }: { color?: string }) => {
  const W = 1440, H = 900, vx = W / 2, vy = H / 2, wallT = 0.30;
  const wallX = vx - vx * wallT, wallY = vy - vy * wallT;
  const wallW = W * wallT, wallH = H * wallT;
  const wallX2 = wallX + wallW, wallY2 = wallY + wallH;
  const numFan = 16;
  const fanLines: { x1: number; y1: number; x2: number; y2: number }[] = [];
  for (let i = 0; i <= numFan; i++) {
    const t = i / numFan;
    fanLines.push({ x1: W * t, y1: 0, x2: wallX + wallW * t, y2: wallY });
    fanLines.push({ x1: W * t, y1: H, x2: wallX + wallW * t, y2: wallY2 });
    fanLines.push({ x1: 0, y1: H * t, x2: wallX, y2: wallY + wallH * t });
    fanLines.push({ x1: W, y1: H * t, x2: wallX2, y2: wallY + wallH * t });
  }
  const rings = [0.95, 0.82, 0.68, 0.54, 0.40, wallT].map(t => ({
    x: vx - vx * t, y: vy - vy * t, w: W * t, h: H * t,
  }));
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      <svg width="100%" height="100%" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
        {fanLines.map((l, i) => <line key={i} x1={l.x1} y1={l.y1} x2={l.x2} y2={l.y2} stroke={color} strokeWidth="0.6" />)}
        {rings.map((r, i) => <rect key={i} x={r.x} y={r.y} width={r.w} height={r.h} fill="none" stroke={color} strokeWidth="0.6" />)}
      </svg>
    </div>
  );
};

const RoomGrid = ({ color = "rgba(180,210,240,0.30)" }: { color?: string }) => {
  const W = 1440, H = 900, fw = W * 0.45, fh = H * 0.45;
  const fx = (W - fw) / 2, fy = (H - fh) / 2, fx2 = fx + fw, fy2 = fy + fh, n = 10;
  const lines: { x1: number; y1: number; x2: number; y2: number }[] = [];
  for (let i = 0; i <= n; i++) {
    const t = i / n;
    lines.push({ x1: W * t, y1: 0, x2: fx + fw * t, y2: fy });
    lines.push({ x1: W * t, y1: H, x2: fx + fw * t, y2: fy2 });
    lines.push({ x1: 0, y1: H * t, x2: fx, y2: fy + fh * t });
    lines.push({ x1: W, y1: H * t, x2: fx2, y2: fy + fh * t });
  }
  for (let i = 1; i < n; i++) {
    const t = i / n;
    lines.push({ x1: fx * t, y1: fy * t, x2: W - fx * t, y2: fy * t });
    lines.push({ x1: fx * t, y1: H - fy * t, x2: W - fx * t, y2: H - fy * t });
    lines.push({ x1: fx * t, y1: fy * t, x2: fx * t, y2: H - fy * t });
    lines.push({ x1: W - fx * t, y1: fy * t, x2: W - fx * t, y2: H - fy * t });
    lines.push({ x1: fx + fw * t, y1: fy, x2: fx + fw * t, y2: fy2 });
    lines.push({ x1: fx, y1: fy + fh * t, x2: fx2, y2: fy + fh * t });
  }
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      <svg width="100%" height="100%" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
        {lines.map((l, i) => <line key={i} x1={l.x1} y1={l.y1} x2={l.x2} y2={l.y2} stroke={color} strokeWidth="0.7" />)}
        <rect x={fx} y={fy} width={fw} height={fh} fill="none" stroke={color} strokeWidth="0.7" />
      </svg>
    </div>
  );
};

// ── Data ───────────────────────────────────────────────────────────────────────

const heroStats = [
  { value: "4,000+", label: "Happy customers" },
  { value: "₹500Cr+", label: "Loans disbursed" },
  { value: "4.8/5", label: "Average rating" },
  { value: "30+ States", label: "Pan India coverage" },
];

const testimonialsData = [
  {
    name: "Priya Sharma",
    location: "Mumbai, Maharashtra",
    feedback:
      "Accrefin made my home loan journey incredibly smooth. Got the best rate from HDFC Bank within 24 hours. Highly recommended!",
    rating: 5,
    loanType: "Home Loan",
    saved: "₹1.2L saved",
  },
  {
    name: "Rajesh Kumar",
    location: "Delhi, NCR",
    feedback:
      "Quick personal loan approval for my business needs. The team was very professional and transparent about all charges.",
    rating: 5,
    loanType: "Personal Loan",
    saved: "Approved in 6 hrs",
  },
  {
    name: "Anita Patel",
    location: "Ahmedabad, Gujarat",
    feedback:
      "Excellent service! They helped me compare multiple offers and choose the best one. Saved me ₹50,000 in interest.",
    rating: 5,
    loanType: "Business Loan",
    saved: "₹50K saved",
  },
  {
    name: "Kishore Reddy",
    location: "Hyderabad, Telangana",
    feedback:
      "I was skeptical about online platforms, but Accrefin provided fast, hassle-free service for my car loan refinance. Saved money on my EMI!",
    rating: 4,
    loanType: "Car Loan",
    saved: "EMI reduced",
  },
  {
    name: "Sneha Varma",
    location: "Chennai, Tamil Nadu",
    feedback:
      "The home loan approval process was quicker than expected. I appreciated the transparent fees and prompt support from the team.",
    rating: 5,
    loanType: "Home Loan",
    saved: "Zero hidden fees",
  },
  {
    name: "Vikram Singh",
    location: "Pune, Maharashtra",
    feedback:
      "Used the education loan service for my master's degree abroad. The moratorium period advice was extremely helpful.",
    rating: 5,
    loanType: "Education Loan",
    saved: "Fully disbursed",
  },
  {
    name: "Meena Iyer",
    location: "Bengaluru, Karnataka",
    feedback:
      "As a self-employed professional, getting a loan used to be hard. Accrefin's team understood my financials and found me a perfect offer.",
    rating: 5,
    loanType: "Business Loan",
    saved: "Best rate found",
  },
  {
    name: "Arun Mishra",
    location: "Lucknow, Uttar Pradesh",
    feedback:
      "Switched my existing home loan to a better lender through Accrefin. Process was smooth and I'm saving ₹4,000 per month on EMI!",
    rating: 5,
    loanType: "Balance Transfer",
    saved: "₹4K/month saved",
  },
];

const featuredTestimonial = testimonialsData[2]; // Anita Patel

const keyStats = [
  { icon: <UsersIcon className="w-7 h-7" />, value: "4,000+", label: "Customers Served", sub: "Across India" },
  { icon: <TrendingUpIcon className="w-7 h-7" />, value: "₹500 Cr+", label: "Loans Disbursed", sub: "And counting" },
  { icon: <AwardIcon className="w-7 h-7" />, value: "4.8 / 5", label: "Customer Rating", sub: "Based on 3,000+ reviews" },
  { icon: <MapPinIcon className="w-7 h-7" />, value: "30+", label: "States Covered", sub: "Pan India presence" },
];

// ── Helpers ────────────────────────────────────────────────────────────────────

const StarRow = ({ count, total = 5 }: { count: number; total?: number }) => (
  <div className="flex items-center gap-0.5">
    {Array.from({ length: total }).map((_, i) => (
      <StarIcon
        key={i}
        className={`w-4 h-4 ${i < count ? "text-yellow-400 fill-yellow-400" : "text-gray-200 fill-gray-200"}`}
      />
    ))}
  </div>
);

const Avatar = ({ name, photo }: { name: string; photo?: string }) => {
  const [err, setErr] = useState(false);
  if (photo && !err) {
    return (
      <img
        src={photo}
        alt={name}
        className="w-11 h-11 rounded-full object-cover border-2 border-white shadow"
        onError={() => setErr(true)}
      />
    );
  }
  const initials = name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();
  return (
    <div className="w-11 h-11 rounded-full bg-[#0050B2] text-white flex items-center justify-center font-bold text-sm flex-shrink-0">
      {initials}
    </div>
  );
};

// ── Component ──────────────────────────────────────────────────────────────────

export const TestimonialsPage = (): JSX.Element => {
  const headingFont = "font-['Power_Grotesk',_'DM_Sans',_sans-serif]";
  const bodyFont = "font-['DM_Sans',_sans-serif]";

  return (
    <div className={`min-h-screen bg-white ${bodyFont}`}>

      {/* ── HERO ── */}
      <section className="bg-white relative overflow-hidden py-28">
        <RoomGrid />

        <div className="container mx-auto max-w-7xl px-4 relative z-10">
          {/* Shield badge */}
          <div className="flex justify-center mb-6">
            <div className="inline-flex items-center gap-2 bg-[#e8f0fb] border border-[#c5d8f5] text-[#0050B2] text-sm font-semibold px-4 py-2 rounded-full">
              <ShieldCheckIcon className="w-4 h-4" />
              India's most trusted loan platform
            </div>
          </div>

          {/* Title */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center pb-14">
            <div>
              {/* Breadcrumb */}
              <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-5">
                <a href="/" className="hover:text-[#0050B2] transition-colors">Home</a>
                <span>/</span>
                <span className="text-gray-800 font-medium">Testimonials</span>
              </nav>
              <h1 className={`${headingFont} text-4xl lg:text-5xl xl:text-6xl font-bold leading-tight text-gray-900`}>
                What Our Customers /{" "}
                <span className="text-[#0050B2]">Say About Us</span>
              </h1>
            </div>
            <div>
              <p className="text-xl text-gray-500 leading-relaxed mb-6">
                Thousands of Indians trust Accrefin to find the right loan at the right rate.
                Read their stories and see why we're rated 4.8 out of 5.
              </p>
              <div className="inline-flex items-center gap-3 bg-white border border-gray-200 shadow-sm rounded-2xl px-6 py-3">
                <div className="flex items-center gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <StarIcon key={i} className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                  ))}
                </div>
                <span className="font-bold text-gray-900">4.8 / 5</span>
                <span className="text-gray-400 text-sm">from 3,000+ reviews</span>
              </div>
            </div>
          </div>
        </div>

        {/* Trust bar */}
        <div className="bg-[#0e396d] mt-10 py-5">
          <div className="container mx-auto max-w-7xl px-4">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 text-center text-white">
              {heroStats.map((s, i) => (
                <div key={i}>
                  <p className={`${headingFont} text-2xl font-bold text-white`}>{s.value}</p>
                  <p className="text-blue-200 text-sm mt-0.5">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS GRID ── */}
      <section className="py-16 bg-[#f4f9ff]">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="text-center mb-12">
            <h2 className={`${headingFont} text-3xl font-bold text-gray-900 mb-3`}>
              Real Stories, Real Results
            </h2>
            <p className="text-gray-500 text-lg">
              Verified reviews from customers across India
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {testimonialsData.map((t, index) => (
              <Card
                key={index}
                className="bg-white border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 rounded-2xl overflow-hidden"
              >
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {/* Rating + loan type */}
                    <div className="flex items-center justify-between">
                      <StarRow count={t.rating} />
                      <Badge className="bg-[#e8f0fb] text-[#0050B2] border-0 text-xs font-medium px-2 py-0.5">
                        {t.loanType}
                      </Badge>
                    </div>

                    {/* Quote mark */}
                    <div className="text-[#0050B2] opacity-30">
                      <QuoteIcon className="w-6 h-6" />
                    </div>

                    {/* Feedback */}
                    <p className="text-gray-700 text-sm leading-relaxed">
                      "{t.feedback}"
                    </p>

                    {/* Savings chip */}
                    {t.saved && (
                      <div className="inline-flex items-center gap-1.5 bg-green-50 text-green-700 text-xs font-semibold px-2.5 py-1 rounded-full">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block" />
                        {t.saved}
                      </div>
                    )}

                    {/* Customer info */}
                    <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                      <Avatar name={t.name} />
                      <div>
                        <h4 className={`${headingFont} font-semibold text-gray-900 text-sm`}>{t.name}</h4>
                        <p className="text-xs text-gray-400">{t.location}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURED TESTIMONIAL ── */}
      <section className="py-20 bg-[#0e396d] relative overflow-hidden">
        <TunnelGrid />
        <div className="container mx-auto max-w-4xl px-4 relative z-10">
          <div className="text-center mb-10">
            <span className="text-blue-300 text-sm font-semibold uppercase tracking-widest">
              Customer Spotlight
            </span>
          </div>

          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-3xl p-10 text-center">
            <div className="flex justify-center mb-5">
              <StarRow count={featuredTestimonial.rating} />
            </div>

            <blockquote className={`${headingFont} text-2xl lg:text-3xl font-medium text-white leading-relaxed mb-8`}>
              "{featuredTestimonial.feedback}"
            </blockquote>

            <div className="flex items-center justify-center gap-4 mb-6">
              <Avatar name={featuredTestimonial.name} />
              <div className="text-left">
                <p className="font-bold text-white">{featuredTestimonial.name}</p>
                <p className="text-blue-200 text-sm">{featuredTestimonial.location}</p>
                <Badge className="mt-1 bg-white/20 text-white border-0 text-xs">
                  {featuredTestimonial.loanType}
                </Badge>
              </div>
            </div>

            <div className="inline-flex items-center gap-2 bg-green-500/20 text-green-300 text-sm font-semibold px-4 py-2 rounded-full border border-green-400/30">
              <span className="w-2 h-2 rounded-full bg-green-400 inline-block" />
              {featuredTestimonial.saved}
            </div>
          </div>
        </div>
      </section>

      {/* ── KEY STATS ── */}
      <section className="py-20 bg-white">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="text-center mb-14">
            <h2 className={`${headingFont} text-4xl lg:text-5xl font-bold text-gray-900 mb-4`}>
              Numbers That <span className="text-[#0050B2]">Speak for Themselves</span>
            </h2>
            <p className="text-gray-500 text-lg max-w-xl mx-auto">Our impact across India in numbers</p>
          </div>

          <div className="flex items-stretch justify-between flex-wrap lg:flex-nowrap divide-y lg:divide-y-0 lg:divide-x divide-gray-100 border border-gray-100 rounded-3xl overflow-hidden shadow-sm">
            {keyStats.map((s, i) => (
              <div key={i} className="flex flex-col items-center justify-center gap-3 py-10 px-8 flex-1 bg-white hover:bg-[#f4f9ff] transition-colors duration-200 group">
                <div className="w-12 h-12 bg-[#e8f0fb] rounded-2xl flex items-center justify-center text-[#0050B2] group-hover:bg-[#0050B2] group-hover:text-white transition-colors duration-200">
                  {s.icon}
                </div>
                <p className={`${headingFont} text-4xl font-bold text-gray-900`}>{s.value}</p>
                <div className="text-center">
                  <p className="font-semibold text-gray-700 text-sm">{s.label}</p>
                  <p className="text-gray-400 text-xs mt-0.5">{s.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-16 bg-white">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="bg-[#f4f9ff] border border-[#d0e4f7] rounded-3xl p-12 text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-[#e8f0fb] text-[#0050B2] text-sm font-semibold px-4 py-2 rounded-full mb-6">
              <ShieldCheckIcon className="w-4 h-4" />
              Join 4,000+ happy customers
            </div>
            <h2 className={`${headingFont} text-3xl lg:text-4xl font-bold text-gray-900 mb-4`}>
              Your Success Story Starts Here
            </h2>
            <p className="text-gray-500 text-lg mb-8 leading-relaxed">
              Get expert guidance, compare lenders, and find the best loan offer — all at zero cost.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button className="bg-[#0050B2] hover:bg-[#003d8a] text-white font-bold px-8 py-3 text-base rounded-xl shadow-lg transition-all duration-300">
                Apply for a Loan
              </Button>
              <Button
                variant="outline"
                className="border-[#0050B2] text-[#0050B2] hover:bg-[#e8f0fb] font-bold px-8 py-3 text-base rounded-xl transition-all duration-300"
              >
                Check Eligibility
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
