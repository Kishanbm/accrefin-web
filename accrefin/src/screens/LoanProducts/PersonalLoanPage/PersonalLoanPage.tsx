import React, { useState, useEffect } from "react";
import { Button } from "../../../components/ui/button";
import { Card, CardContent } from "../../../components/ui/card";
import { Input } from "../../../components/ui/input";
import { Badge } from "../../../components/ui/badge";
import { Separator } from "../../../components/ui/separator";
import { ROUTES } from "../../../constants/routes";
import { useNavigate } from "react-router-dom";
import { CheckIcon, PlayIcon, StarIcon, UserIcon, ShieldIcon, ClockIcon, FileTextIcon, CreditCardIcon, BanknoteIcon as BanknotesIcon, ChevronDownIcon, ChevronUpIcon, TrendingUpIcon, ZapIcon, GlobeIcon, LockIcon, BuildingIcon, BarChart3Icon, UsersIcon } from "lucide-react";

/* ─── Perspective Grid SVG shared across sections ─── */
const PerspectiveGrid = ({ color = "rgba(255,255,255,0.10)", className = "" }: { color?: string; className?: string }) => (
  <div className={`absolute inset-0 pointer-events-none overflow-hidden ${className}`}>
    <svg width="100%" height="100%" viewBox="0 0 1440 900" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
      {/* Horizontal lines with perspective */}
      {Array.from({ length: 18 }).map((_, i) => {
        const y = 50 + i * 50;
        const perspectiveOffset = (i - 9) * 3;
        return (
          <line key={`h-${i}`} x1={-20 + perspectiveOffset} y1={y} x2={1460 - perspectiveOffset} y2={y} stroke={color} strokeWidth="0.8" />
        );
      })}
      {/* Vertical lines with perspective */}
      {Array.from({ length: 22 }).map((_, i) => {
        const x = -20 + i * 70;
        const topOffset = (i - 11) * 4;
        return (
          <line key={`v-${i}`} x1={x + topOffset} y1={0} x2={x - topOffset} y2={900} stroke={color} strokeWidth="0.8" />
        );
      })}
      {/* Diagonal perspective lines from corners */}
      <line x1="0" y1="0" x2="720" y2="450" stroke={color} strokeWidth="0.5" />
      <line x1="1440" y1="0" x2="720" y2="450" stroke={color} strokeWidth="0.5" />
      <line x1="0" y1="900" x2="720" y2="450" stroke={color} strokeWidth="0.5" />
      <line x1="1440" y1="900" x2="720" y2="450" stroke={color} strokeWidth="0.5" />
    </svg>
  </div>
);

/* ─── Tunnel/Room Perspective Grid for dark sections (Fees, etc.) ─── */
const TunnelGrid = ({ color = "rgba(255,255,255,0.18)" }: { color?: string }) => {
  const W = 1440, H = 900;
  const vx = W / 2, vy = H / 2;
  const wallT = 0.30;
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

/* ─── Room/3D perspective grid for hero sections ─── */
const RoomGrid = ({ color = "rgba(180,210,240,0.30)" }: { color?: string }) => {
  const W = 1440, H = 900;
  const fw = W * 0.45, fh = H * 0.45;
  const fx = (W - fw) / 2, fy = (H - fh) / 2;
  const fx2 = fx + fw, fy2 = fy + fh;
  const n = 10;
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
    lines.push({ x1: fx * t, y1: fy * t, x2: (W - fx) * t + fx * (1 - t) + fx, y2: fy * t });
    lines.push({ x1: fx * t, y1: H - fy * t, x2: fx2 + (W - fx2) * (1 - t), y2: H - fy * t });
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

export const PersonalLoanPage = (): JSX.Element => {
  const [loanAmount, setLoanAmount] = useState(500000);
  const [tenure, setTenure] = useState(36);
  const [interestRate, setInterestRate] = useState(10.5);
  const [activeTab, setActiveTab] = useState("overview");
  const [isTabSticky, setIsTabSticky] = useState(false);
  const [expandedDoc, setExpandedDoc] = useState<string | null>(null);
  const [partnersVisible, setPartnersVisible] = useState(3);
  const [formStatus, setFormStatus] = useState<'FORM' | 'LOADING' | 'SUCCESS'>('FORM');
  const navigate = useNavigate();

  // Sticky tab navigation effect
  useEffect(() => {
    const handleScroll = () => {
      const heroSection = document.getElementById('hero-section');
      if (heroSection) {
        const heroBottom = heroSection.offsetTop + heroSection.offsetHeight;
        setIsTabSticky(window.scrollY > heroBottom - 100);
      }

      // Update active tab based on scroll position
      const sections = ['overview', 'features', 'eligibility', 'documents', 'calculator', 'fees', 'faqs'];
      const scrollPosition = window.scrollY + 150;

      for (let i = sections.length - 1; i >= 0; i--) {
        const element = document.getElementById(sections[i]);
        if (element && element.offsetTop <= scrollPosition) {
          setActiveTab(sections[i]);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Calculate EMI with proper formula
  const calculateEMI = () => {
    const principal = loanAmount;
    const rate = interestRate / 100 / 12;
    const time = tenure;

    if (rate === 0) {
      return principal / time;
    }

    const emi = (principal * rate * Math.pow(1 + rate, time)) / (Math.pow(1 + rate, time) - 1);
    return Math.round(emi);
  };

  const emi = calculateEMI();
  const totalAmount = emi * tenure;
  const totalInterest = totalAmount - loanAmount;

  // Smooth scroll to section
  const scrollToSection = (sectionId: string) => {
    setActiveTab(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      const offset = isTabSticky ? 80 : 0;
      const elementPosition = element.offsetTop - offset;
      window.scrollTo({
        top: elementPosition,
        behavior: 'smooth'
      });
    }
  };

  const getFillPercentage = (value: number, min: number, max: number): string => {
    const numValue = Number(value);
    const numMin = Number(min);
    const numMax = Number(max);

    if (numMax === numMin) return '0%';

    const percentage = ((numValue - numMin) / (numMax - numMin)) * 100;

    return `${Math.max(0, Math.min(100, percentage))}%`;
  };

  const scrollToForm = () => {
    const element = document.getElementById('loan-application-form');
    if (element) {
      const offset = 100;
      const elementPosition = element.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({
        top: elementPosition,
        behavior: 'smooth'
      });
      setTimeout(highlightFormFields, 500);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormStatus('LOADING');
    setTimeout(() => {
      setFormStatus('SUCCESS');
    }, 1500);
  };

  const highlightFormFields = () => {
    const fields = document.querySelectorAll('#loan-application-form input, #loan-application-form select');
    fields.forEach((field) => {
      field.classList.add('ring-3', 'ring-black/50', 'transition', 'duration-300');
      setTimeout(() => {
        field.classList.remove('ring-4', 'ring-black/50');
      }, 2000);
    });
  };

  // Tab navigation items
  const tabItems = [
    { id: "overview", label: "Overview" },
    { id: "features", label: "Features" },
    { id: "eligibility", label: "Eligibility" },
    { id: "documents", label: "Documents" },
    { id: "calculator", label: "EMI Calculator" },
    { id: "fees", label: "Fees & Charges" },
    { id: "faqs", label: "FAQs" }
  ];

  // Why Accrefin features for personal loans
  const whyAccrefinFeatures = [
    {
      icon: <ZapIcon className="w-6 h-6" />,
      title: "Instant Online Approval",
      subtitle: "Get approved in minutes with our AI-powered system",
      iconColor: "text-[#0050B2]",
      bgColor: "bg-blue-50/50"
    },
    {
      icon: <TrendingUpIcon className="w-6 h-6" />,
      title: "Low Interest from 10.25%",
      subtitle: "Competitive rates from top banks and NBFCs",
      iconColor: "text-[#0050B2]",
      bgColor: "bg-blue-50/50"
    },
    {
      icon: <GlobeIcon className="w-6 h-6" />,
      title: "Compare 50+ Bank Offers",
      subtitle: "Find the best deal from our extensive network",
      iconColor: "text-[#0050B2]",
      bgColor: "bg-blue-50/50"
    },
    {
      icon: <LockIcon className="w-6 h-6" />,
      title: "100% Paperless Process",
      subtitle: "Complete digital journey from application to disbursal",
      iconColor: "text-[#0050B2]",
      bgColor: "bg-blue-50/50"
    }
  ];

  // Personal loan use cases
  const personalUseCases = [
    { emoji: "🏥", title: "Medical Emergency", description: "Cover unexpected medical expenses" },
    { emoji: "🎓", title: "Education", description: "Fund your higher education dreams" },
    { emoji: "🛠️", title: "Home Renovation", description: "Upgrade and beautify your home" },
    { emoji: "💳", title: "Credit Card Payoff", description: "Consolidate high-interest debt" },
    { emoji: "💍", title: "Wedding", description: "Make your special day memorable" },
    { emoji: "✈️", title: "Travel", description: "Explore the world with ease" }
  ];

  // Bank offers data for personal loans
  const bankOffers = [
    {
      bank: "HDFC Bank",
      logo: "/logos/h.png",
      interestRate: "10.50% - 24.00%",
      processingFee: "Up to 2.50%",
      loanAmount: "₹50K - ₹40L",
      features: ["Instant Approval", "Minimal Documentation"],
      rating: 4.2,
      highlight: "Most Popular"
    },
    {
      bank: "ICICI Bank",
      logo: "/logos/i.png",
      interestRate: "10.75% - 19.00%",
      processingFee: "Up to 2.25%",
      loanAmount: "₹50K - ₹25L",
      features: ["Quick Disbursal", "Flexible Tenure"],
      rating: 4.1,
      highlight: "Best Rate"
    },
    {
      bank: "Kotak Bank",
      logo: "/logos/k.png",
      interestRate: "10.99% - 20.00%",
      processingFee: "Up to 3.00%",
      loanAmount: "₹50K - ₹30L",
      features: ["Digital Process", "Competitive Rates"],
      rating: 4.0,
      highlight: "Quick Approval"
    },
    {
      bank: "Axis Bank",
      logo: "/logos/A.png",
      interestRate: "11.00% - 21.00%",
      processingFee: "Up to 3.50%",
      loanAmount: "₹50K - ₹35L",
      features: ["Fast Disbursal", "Long Tenure"],
      rating: 3.9,
      highlight: "Popular"
    },
    {
      bank: "SBI",
      logo: "/logos/s.png",
      interestRate: "10.00% - 18.00%",
      processingFee: "Up to 1.50%",
      loanAmount: "₹50K - ₹40L",
      features: ["Best Rates", "Zero Prepayment"],
      rating: 4.5,
      highlight: "Lowest Rates"
    }
  ];

  // Personal loan eligibility criteria
  const eligibilityCriteria = [
    { criteria: "Monthly Income", requirement: "Minimum ₹15,000 for salaried", icon: "💰" },
    { criteria: "Age", requirement: "21-60 years", icon: "👤" },
    { criteria: "Employment", requirement: "Minimum 1 year in current job", icon: "💼" },
    { criteria: "Credit Score", requirement: "650+ for better rates", icon: "📊" },
    { criteria: "Work Experience", requirement: "Minimum 2 years total experience", icon: "⏱️" },
    { criteria: "Residence", requirement: "Indian citizen with valid address", icon: "🏠" }
  ];

  // Required documents for personal loans
  const requiredDocs = [
    {
      category: "Identity Proof",
      icon: "📄",
      docs: ["Aadhaar Card", "PAN Card", "Passport", "Voter ID", "Driving License"]
    },
    {
      category: "Address Proof",
      icon: "🏠",
      docs: ["Aadhaar Card", "Passport", "Utility Bills", "Rent Agreement"]
    },
    {
      category: "Income Proof",
      icon: "💰",
      docs: ["Salary slips (last 3 months)", "Form 16", "IT Returns", "Bank Statements"]
    },
    {
      category: "Employment Proof",
      icon: "💼",
      docs: ["Employment Certificate", "Offer Letter", "Experience Certificate"]
    }
  ];

  // Processing fees for personal loans
  const processingFees = [
    { particular: "Loan Processing Fees", charges: "0.5% to 4% of loan amount" },
    { particular: "Foreclosure Charges", charges: "For Floating Rate: Nil\nFor Fixed Rate: Usually around 2% - 5% on the principal outstanding" },
    { particular: "Loan Cancellation", charges: "Usually around Rs 3000" },
    { particular: "Stamp Duty Charges", charges: "As per actuals" },
    { particular: "Legal Fees", charges: "As per actuals" },
    { particular: "Penal Charges", charges: "Usually at 2% per month; 24% p.a." },
    { particular: "EMI/Cheque Bounce", charges: "Around Rs 400 per bounce" }
  ];

  // Personal loan FAQs
  const faqs = [
    {
      question: "What is the minimum salary requirement for a personal loan?",
      answer: "The minimum salary requirement varies by lender, but typically ranges from ₹15,000 to ₹25,000 per month for salaried employees. Self-employed individuals usually need a minimum annual income of ₹2-3 lakhs."
    },
    {
      question: "Can I prepay my personal loan without penalty?",
      answer: "Most banks allow prepayment of personal loans without penalty for floating rate loans. However, fixed rate loans may have prepayment charges of 2-5% of the outstanding principal amount."
    },
    {
      question: "How is the interest rate determined for personal loans?",
      answer: "Interest rates are determined based on factors like your credit score, income, employment history, existing debt obligations, and your relationship with the lender. Higher credit scores typically qualify for lower interest rates."
    },
    {
      question: "What happens if I miss an EMI payment?",
      answer: "Missing EMI payments can result in late payment charges, negative impact on your credit score, and potential legal action. It's important to contact your lender immediately if you're facing payment difficulties."
    },
    {
      question: "Can I get a personal loan with a low credit score?",
      answer: "While it's possible to get a personal loan with a low credit score, you may face higher interest rates and stricter terms. Some lenders specialize in loans for people with poor credit, but rates can be significantly higher."
    }
  ];

  /* ─── Section heading font class ─── */
  const headingFont = "font-['Power_Grotesk',_'Plus_Jakarta_Sans',_'DM_Sans',_sans-serif]";
  const bodyFont = "font-['DM_Sans',_sans-serif]";

  return (
    <div className="min-h-screen bg-white">

      {/* ═══════════════════════════════════════════════════════
          HERO SECTION - White background with perspective grid
          ═══════════════════════════════════════════════════════ */}
      <section id="hero-section" className="bg-white relative overflow-hidden">
        <RoomGrid />

        <div className="container mx-auto max-w-7xl px-6 pt-8 pb-0 relative z-10">
          {/* India's most trusted platform badge */}
          <div className="flex justify-center mb-10">
            <div className="flex items-center gap-2 border border-gray-300 rounded-full px-5 py-2.5 bg-gray-50 backdrop-blur-sm">
              <svg className="w-5 h-5 text-[#0050B2]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              <span className={`text-gray-700 text-sm ${bodyFont}`}>India's most trusted platform</span>
            </div>
          </div>

          {/* Breadcrumb */}
          <div className="mb-6">
            <nav className={`flex items-center space-x-2 text-sm ${bodyFont}`}>
              <a href="/" className="text-gray-600 hover:text-gray-800 transition-colors">Home</a>
              <span className="text-gray-400">/</span>
              <span className="text-gray-600">Personal Loan</span>
            </nav>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start pb-14">
            {/* Left Content */}
            <div className="space-y-6">
              <h1 className={`text-4xl lg:text-5xl xl:text-[56px] font-normal text-gray-900 leading-[1.15] tracking-tight ${headingFont}`}>
                Check Personal<br />Loan Offers Online
              </h1>
              <p className={`text-base lg:text-lg text-gray-600 leading-relaxed max-w-lg ${bodyFont} font-medium`}>
                Get a personal loan of up to Rs 40 lakh at an interest rate starting from 10.25% p.a. for the
                tenures of up to 7 years. Quick approval with minimal documentation from 50+ partner lenders.
              </p>
            </div>

            {/* Right Content - Application Form */}
            <div className="flex justify-center lg:justify-end">
              <Card id="loan-application-form" className="bg-white border-2 border-[#c8d7eb] rounded-2xl shadow-lg w-full max-w-[480px]">
                <CardContent className="p-8">
                  {formStatus === 'FORM' && (
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div>
                        <Input placeholder="Enter Full Name" className={`h-11 text-sm border border-gray-200 focus:border-[#0050B2] rounded-md ${bodyFont} text-gray-700 placeholder:text-gray-400`} />
                      </div>
                      <div>
                        <Input placeholder="Enter Phone Number" className={`h-11 text-sm border border-gray-200 focus:border-[#0050B2] rounded-md ${bodyFont} text-gray-700 placeholder:text-gray-400`} />
                      </div>
                      <div>
                        <select
                          className={`w-full h-11 px-3 border border-gray-200 focus:border-[#0050B2] rounded-md text-sm text-gray-500 outline-none ${bodyFont}`}
                          defaultValue="default"
                        >
                          <option value="default" disabled hidden>Select Occupation</option>
                          <option value="salaried">Salaried</option>
                          <option value="self-employed">Self Employed</option>
                        </select>
                      </div>
                      <div className={`text-center text-xs text-gray-500 ${bodyFont}`}>
                        Don't worry, this will not affect your credit score.
                      </div>
                      <div className={`text-xs text-gray-500 leading-relaxed text-center ${bodyFont}`}>
                        By submitting this form, you have read and agree to the{" "}
                        <a href="#" className="text-blue-600 hover:underline">Terms of Use</a> &{" "}
                        <a href="#" className="text-blue-600 hover:underline">Privacy Policy</a>{" "}
                        <a href="#" className="text-blue-600 hover:underline">Credit Report Terms of Use.</a>
                      </div>
                      <Button type="submit" className={`w-full bg-[#0877ff] hover:bg-[#0666dd] text-white py-3 text-sm font-bold rounded shadow-[0px_4px_11.8px_-5px_#0050b2] transition-all duration-300 ${bodyFont} tracking-wide`}>
                        APPLY NOW
                      </Button>
                    </form>
                  )}
                  {formStatus === 'LOADING' && (
                    <div className="flex flex-col items-center justify-center h-64 text-gray-600">
                      <svg className="animate-spin h-10 w-10 text-[#0050B2] mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <p className={`text-lg font-semibold ${bodyFont}`}>Processing your application...</p>
                    </div>
                  )}
                  {formStatus === 'SUCCESS' && (
                    <div className="flex flex-col items-center justify-center h-64 text-green-700 text-center">
                      <svg className="w-16 h-16 text-green-500 mb-4 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                      </svg>
                      <h3 className="text-2xl font-bold mb-2">Application Received!</h3>
                      <p className="text-gray-600 max-w-xs">Your personalized loan offers will be sent to your phone shortly.</p>
                      <Button onClick={() => setFormStatus('FORM')} className="mt-4 bg-[#0050B2] hover:bg-[#003d8a]">
                        Explore More
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* ── Trust Bar - Quick Approval, No Collateral etc ── */}
        <div className="bg-[#0e396d] border-t border-white/10 relative z-10">
          <div className="container mx-auto max-w-7xl px-4">
            <div className="flex items-center justify-center flex-wrap lg:flex-nowrap">
              {[
                { title: "Quick Approval", desc: "Get approved in minutes" },
                { title: "No Collateral", desc: "No security deposit required" },
                { title: "Pre-Approved Offers", desc: "Custom offers for you" },
                { title: "Dedicated Support", desc: "Human assistance" },
              ].map((item, index, arr) => (
                <React.Fragment key={item.title}>
                  <div className="flex flex-col items-start gap-4 py-10 px-10 w-[240px]">
                    <h3 className={`font-normal text-white text-[22px] leading-[1.3] ${headingFont}`}>{item.title}</h3>
                    <p className={`text-[#a0cfff] text-base font-medium tracking-[-0.3px] leading-[1.3] ${bodyFont}`}>{item.desc}</p>
                  </div>
                  {index < arr.length - 1 && (
                    <div className="hidden lg:block w-px h-[100px] bg-white/15 flex-shrink-0" />
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          STICKY TAB NAVIGATION
          ═══════════════════════════════════════════════════════ */}
      <div className={`${isTabSticky ? 'fixed top-0 left-0 right-0 z-50 shadow-md' : 'relative pt-8 pb-4'} bg-white border-b border-gray-200 transition-all duration-300`}>
        <div className="container mx-auto max-w-7xl px-4">
          <div className="flex items-center justify-center">
            <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
              {tabItems.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => scrollToSection(tab.id)}
                  className={`px-6 py-3 text-sm font-medium rounded-lg transition-all duration-300 ${
                    activeTab === tab.id
                      ? 'bg-[#0050B2] text-white shadow-lg'
                      : 'text-gray-600 hover:text-[#0050B2] hover:bg-white'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════
          BEST PERSONAL LOAN OFFERS - White bg + perspective grid
          ═══════════════════════════════════════════════════════ */}
      <section id="overview" className="py-16 bg-white relative overflow-hidden">
        <PerspectiveGrid color="rgba(200,215,235,0.25)" />
        <div className="container mx-auto max-w-7xl px-4 relative z-10">
          <div className="text-center mb-12">
            <h2 className={`text-3xl lg:text-5xl text-[#273240] mb-4 tracking-tight font-normal ${headingFont}`}>
              Best Personal Loan Offers
            </h2>
            <p className={`text-lg text-gray-500 font-medium ${bodyFont}`}>
              Compare and choose from top personal loan lenders
            </p>
          </div>
          <div className="flex items-stretch gap-7 overflow-x-auto pb-4 px-1">
            {bankOffers.map((offer, index) => (
              <Card key={index} className="min-w-[280px] w-[280px] bg-[#f5f9ff] border border-[#e1e1e1] hover:shadow-xl transition-shadow duration-300 flex-shrink-0">
                <CardContent className="p-6 flex flex-col items-center text-center h-full">
                  <div className="w-14 h-14 bg-white rounded-xl flex items-center justify-center mb-3 border border-gray-100 shadow-sm">
                    <img src={offer.logo} alt={`${offer.bank} Logo`} className="w-10 h-10 object-contain" />
                  </div>
                  <div className={`font-semibold text-[#0b0b0b] text-lg ${bodyFont}`}>{offer.bank}</div>
                  <div className="flex items-center justify-center gap-3 mt-2">
                    <div className="flex items-center gap-1 text-sm text-gray-600">
                      <StarIcon className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className={`text-sm text-gray-600 font-semibold ${bodyFont}`}>{offer.rating}</span>
                    </div>
                    {offer.highlight && (
                      <Badge className={`bg-transparent text-gray-700 border-0 text-xs font-bold px-2 py-1 rounded ${bodyFont}`}>
                        {offer.highlight}
                      </Badge>
                    )}
                  </div>
                  <div className="flex flex-col items-start gap-2.5 w-full my-4">
                    <p className={`font-semibold text-[#0877ff] text-lg ${bodyFont}`}>
                      Interest: {offer.interestRate}
                    </p>
                    <p className={`text-[#004091] text-sm ${bodyFont}`}>
                      <span className="font-medium">Processing Fee: </span>
                      <span className="font-bold">{offer.processingFee}</span>
                    </p>
                    <p className={`text-[#004091] text-sm ${bodyFont}`}>
                      <span className="font-medium">Loan Amount: </span>
                      <span className="font-bold">{offer.loanAmount}</span>
                    </p>
                    {offer.features.map((feature, idx) => (
                      <p key={idx} className={`text-[#004091] text-sm font-medium ${bodyFont}`}>
                        {feature}
                      </p>
                    ))}
                  </div>
                  <Button onClick={() => navigate(ROUTES.APPLICATION)} className={`w-full mt-auto bg-[#0877ff] hover:bg-[#0666dd] text-white font-bold py-3 text-sm rounded shadow-[0px_4px_11.8px_-5px_#0050b2] transition-all duration-300 ${bodyFont}`}>
                    APPLY NOW
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          PERSONAL LOAN FEATURES & BENEFITS - Light gradient bg + grid
          ═══════════════════════════════════════════════════════ */}
      <section id="features" className="py-16 bg-white">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="text-center mb-12">
            <h2 className={`text-3xl lg:text-5xl text-[#273240] mb-4 tracking-tight font-normal ${headingFont}`}>
              Personal Loan Features &amp; Benefits
            </h2>
            <p className={`text-lg text-gray-500 font-medium ${bodyFont}`}>
              Flexible funding for all your personal needs
            </p>
          </div>
          <div className="relative overflow-hidden" style={{ background: 'linear-gradient(90deg, rgba(246,250,255,1) 0%, rgba(218,235,255,1) 100%)' }}>
            <PerspectiveGrid color="rgba(180,200,230,0.20)" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-0 relative z-10">
            {personalUseCases.map((useCase, index) => (
              <div
                key={index}
                className={`flex flex-col items-start gap-4 p-8 border border-[#e4e4e4] ${
                  index < 3 ? 'bg-[#eaf3ff]/50' : 'bg-[#f0f7ff]/50'
                }`}
              >
                <div className="w-12 h-12 flex items-center justify-center bg-transparent rounded">
                  {useCase.emoji === "🏥" && (
                    <svg className="w-6 h-6 text-[#0050B2]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  )}
                  {useCase.emoji === "🎓" && (
                    <svg className="w-6 h-6 text-[#0050B2]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 14l9-5-9-5-9 5 9 5z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                    </svg>
                  )}
                  {useCase.emoji === "🛠️" && (
                    <svg className="w-6 h-6 text-[#0050B2]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                  )}
                  {useCase.emoji === "💳" && (
                    <svg className="w-6 h-6 text-[#0050B2]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                    </svg>
                  )}
                  {useCase.emoji === "💍" && (
                    <svg className="w-6 h-6 text-[#0050B2]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  )}
                  {useCase.emoji === "✈️" && (
                    <svg className="w-6 h-6 text-[#0050B2]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                  )}
                </div>
                <h3 className={`text-[#273240] text-2xl lg:text-[32px] font-normal leading-tight ${headingFont}`}>{useCase.title}</h3>
                <p className={`text-[#0877ff] text-base font-medium ${bodyFont}`}>{useCase.description}</p>
              </div>
            ))}
          </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          EMI CALCULATOR - White bg + perspective grid
          ═══════════════════════════════════════════════════════ */}
      <section id="calculator" className="py-20 bg-[#0E396E] relative overflow-hidden">
        <div className="container mx-auto max-w-7xl px-4 relative z-10">
          <div className="text-center mb-16">
            <h2 className={`text-3xl lg:text-5xl text-white mb-4 tracking-tight font-normal ${headingFont}`}>
              Personal Loan EMI Calculator
            </h2>
            <p className={`text-lg text-white/70 font-medium ${bodyFont}`}>
              Calculate your monthly EMI and plan your finances
            </p>
          </div>
          <Card className="max-w-5xl mx-auto shadow-lg border-0 bg-white">
            <CardContent className="p-10 lg:p-12">
              {/* 3-column: Loan Amount, Tenure, Interest Rate */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
                <div>
                  <label className={`text-sm font-semibold text-gray-700 ${bodyFont} mb-2 block`}>Loan Amount</label>
                  <div className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-center">
                    <span className={`font-bold text-gray-900 text-lg ${bodyFont}`}>₹{(loanAmount / 100000).toFixed(1)}L</span>
                  </div>
                  <input
                    type="range" min="50000" max="4000000" step="50000" value={loanAmount}
                    onChange={(e) => setLoanAmount(Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg cursor-pointer slider mt-3"
                    style={{ '--fill-percent': getFillPercentage(loanAmount, 50000, 4000000) } as React.CSSProperties}
                  />
                  <div className={`flex justify-between text-xs text-gray-400 mt-1 ${bodyFont}`}>
                    <span>₹50K</span><span>₹40L</span>
                  </div>
                </div>
                <div>
                  <label className={`text-sm font-semibold text-gray-700 ${bodyFont} mb-2 block`}>Tenure</label>
                  <div className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-center">
                    <span className={`font-bold text-gray-900 text-lg ${bodyFont}`}>{tenure} Months</span>
                  </div>
                  <input
                    type="range" min="12" max="84" value={tenure}
                    onChange={(e) => setTenure(Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg cursor-pointer slider mt-3"
                    style={{ '--fill-percent': getFillPercentage(tenure, 12, 84) } as React.CSSProperties}
                  />
                  <div className={`flex justify-between text-xs text-gray-400 mt-1 ${bodyFont}`}>
                    <span>12</span><span>84</span>
                  </div>
                </div>
                <div>
                  <label className={`text-sm font-semibold text-gray-700 ${bodyFont} mb-2 block`}>Interest Rate</label>
                  <div className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-center">
                    <span className={`font-bold text-gray-900 text-lg ${bodyFont}`}>{interestRate}%</span>
                  </div>
                  <input
                    type="range" min="10.5" max="24" step="0.1" value={interestRate}
                    onChange={(e) => setInterestRate(Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg cursor-pointer slider mt-3"
                    style={{ '--fill-percent': getFillPercentage(interestRate, 10.5, 24) } as React.CSSProperties}
                  />
                  <div className={`flex justify-between text-xs text-gray-400 mt-1 ${bodyFont}`}>
                    <span>10.5%</span><span>24%</span>
                  </div>
                </div>
              </div>
              <Separator className="my-6" />
              {/* Breakdown + EMI */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <div className="flex justify-between items-center py-3 border-b border-gray-100">
                    <span className={`text-gray-600 text-sm font-medium ${bodyFont}`}>Principal Amount</span>
                    <span className={`font-bold text-gray-900 bg-gray-100 px-3 py-1 rounded text-sm ${bodyFont}`}>₹{loanAmount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-gray-100">
                    <span className={`text-gray-600 text-sm font-medium ${bodyFont}`}>Total Interest</span>
                    <span className={`font-bold text-gray-900 bg-gray-100 px-3 py-1 rounded text-sm ${bodyFont}`}>₹{totalInterest.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b-2 border-[#0050B2]">
                    <span className={`text-[#0050B2] font-semibold text-sm ${bodyFont}`}>Total Payable</span>
                    <span className={`font-bold text-[#0050B2] bg-blue-50 px-3 py-1 rounded text-sm ${bodyFont}`}>₹{totalAmount.toLocaleString()}</span>
                  </div>
                </div>
                <div className="bg-[#0877ff] rounded-2xl p-8 text-white text-center flex flex-col items-center justify-center">
                  <h3 className={`text-base font-semibold mb-1 opacity-90 ${bodyFont}`}>Monthly EMI</h3>
                  <div className={`text-4xl font-extrabold mb-6 ${bodyFont}`}>₹{emi.toLocaleString()}</div>
                  <Button onClick={scrollToForm} className={`bg-white text-[#0877ff] hover:bg-gray-100 font-bold px-8 py-4 rounded text-sm transition-all duration-300 shadow-[0px_4px_11.8px_-5px_#0050b2] ${bodyFont}`}>
                    APPLY NOW
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          ELIGIBILITY - Light blue bg with perspective grid
          ═══════════════════════════════════════════════════════ */}
      <section id="eligibility" className="bg-gradient-to-b from-[#5B9FE9] via-[#2976D8] to-[#0050B2] relative overflow-hidden">
        <TunnelGrid color="rgba(255,255,255,0.18)" />
        <div className="py-20 relative z-10">
          <div className="container mx-auto max-w-7xl px-4">
            <div className="text-center mb-14">
              <h2 className={`text-3xl lg:text-5xl text-white mb-4 tracking-tight font-normal ${headingFont}`}>
                Personal Loan Eligibility Criteria
              </h2>
            </div>
            {/* Eligibility Cards - 3x2 Grid (with subtle boxed overlay to match Figma) */}
            <div className="relative max-w-5xl mx-auto mb-12">
              <div className="absolute inset-0 rounded-3xl bg-white/5 pointer-events-none border border-white/5" />
              <div className="relative grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
                {eligibilityCriteria.map((item, index) => (
                  <div key={index} className="bg-white rounded-2xl p-8 hover:shadow-xl transition-all duration-300">
                    <div className="flex items-start gap-4">
                      <div className="w-14 h-14 flex items-center justify-center bg-blue-100 rounded-lg flex-shrink-0">
                        {item.criteria === "Monthly Income" && <BanknotesIcon className="w-6 h-6 text-[#0050B2]" />}
                        {item.criteria === "Age" && <UserIcon className="w-6 h-6 text-[#0050B2]" />}
                        {item.criteria === "Employment" && <BuildingIcon className="w-6 h-6 text-[#0050B2]" />}
                        {item.criteria === "Credit Score" && <BarChart3Icon className="w-6 h-6 text-[#0050B2]" />}
                        {item.criteria === "Work Experience" && <ClockIcon className="w-6 h-6 text-[#0050B2]" />}
                        {item.criteria === "Residence" && <ShieldIcon className="w-6 h-6 text-[#0050B2]" />}
                      </div>
                      <div className="flex-1">
                        <h3 className={`font-semibold text-[#0b0b0b] mb-1.5 text-lg ${bodyFont}`}>{item.criteria}</h3>
                        <p className={`text-[#004091] text-sm leading-relaxed font-medium ${bodyFont}`}>{item.requirement}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 4-Step Process Bar */}
        <div className="bg-[#004B8F] relative z-10">
          <div className="container mx-auto max-w-7xl px-4">
            <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-white/20">
              {[
                { step: "01", title: "Check Eligibility" },
                { step: "02", title: "Compare Offers" },
                { step: "03", title: "Submit Application" },
                { step: "04", title: "Get Instant Approval" }
              ].map((item, index) => (
                <div key={index} className="py-10 px-8 text-center">
                  <div className={`text-5xl lg:text-7xl font-extrabold text-white leading-none ${bodyFont}`}>{item.step}</div>
                  <div className={`text-sm text-white/80 font-medium mt-3 ${bodyFont}`}>{item.title}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* START YOUR APPLICATION - White area */}
      <div className="bg-white py-12 relative z-10">
        <div className="container mx-auto max-w-7xl px-4 flex flex-col items-center justify-center gap-4">
          <Button onClick={scrollToForm} className={`bg-[#0877ff] hover:bg-[#0666dd] text-white font-bold px-8 py-4 rounded-lg text-lg shadow-[0px_6px_14px_-6px_#0050b2] transition-all duration-300 ${bodyFont}`}>
            START YOUR APPLICATION
          </Button>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════
          DOCUMENTS REQUIRED - White bg (no grid lines)
          ═══════════════════════════════════════════════════════ */}
      <section id="documents" className="py-20 bg-white relative overflow-hidden">
        <div className="container mx-auto max-w-7xl px-4 relative z-10">
          <div className="text-center mb-12">
            <h2 className={`text-3xl lg:text-5xl text-[#273240] mb-4 tracking-tight font-normal ${headingFont}`}>
              Documents Required for Personal Loan
            </h2>
            <p className={`text-lg text-gray-500 font-medium ${bodyFont}`}>
              Applicants usually require the following documents for processing personal loan applications.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {[
              {
                icon: (
                  <svg className="w-6 h-6 text-[#0050B2]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2" />
                  </svg>
                ),
                title: "Proof of Identity",
                docs: ["Aadhaar Card, PAN Card, Passport, etc."]
              },
              {
                icon: (
                  <svg className="w-6 h-6 text-[#0050B2]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                ),
                title: "Proof of Age",
                docs: ["Salary slips for last 3 months", "Form 16 or IT Returns for last 2 years", "Bank statements for last 6 months"]
              },
              {
                icon: (
                  <svg className="w-6 h-6 text-[#0050B2]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                ),
                title: "Proof of Residence",
                docs: ["Aadhaar Card, Passport, Utility Bills, Rent Agreement"]
              },
              {
                icon: (
                  <svg className="w-6 h-6 text-[#0050B2]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                ),
                title: "Proof of Income",
                docs: ["Salary slips for last 3 months", "Form 16 or IT Returns for last 2 years", "Bank statements for last 6 months"]
              },
              {
                icon: (
                  <svg className="w-6 h-6 text-[#0050B2]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                ),
                title: "Other Documents",
                docs: ["Employment certificate", "Offer letter", "Experience certificate", "Passport size photographs"]
              }
            ].map((doc, index) => (
              <Card key={index} className="bg-white border border-[#e1e1e1] hover:shadow-lg transition-shadow duration-300">
                <CardContent className="p-6 flex flex-col gap-3">
                  <div className="w-12 h-12 flex items-center justify-center bg-blue-100 rounded-lg">
                    {doc.icon}
                  </div>
                  <h3 className={`font-semibold text-[#0b0b0b] text-base ${bodyFont}`}>{doc.title}</h3>
                  <p className={`text-xs text-[#757575] leading-5 ${bodyFont}`}>{doc.docs.join("\n")}</p>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="text-center mt-14">
            <Button className={`bg-[#0877ff] hover:bg-[#0666dd] text-white font-bold px-6 py-4 rounded-lg text-lg shadow-[0px_6px_14px_-6px_#0050b2] transition-all duration-300 ${bodyFont}`}>
              CONTACT FOR HELP / MORE DETAILS
            </Button>
          </div>
        </div>
      </section>
      <section id="fees" className="py-20 bg-[#0E1A3A] relative overflow-hidden">
        <TunnelGrid color="rgba(100,150,220,0.22)" />
        <div className="container mx-auto max-w-7xl px-4 relative z-10">
          {/* PROCESSING FEES SECTION */}
          <div className="mb-20">
            <div className="text-center mb-16">
              <h2 className={`text-3xl lg:text-5xl text-white mb-4 tracking-tight font-normal ${headingFont}`}>
                Personal Loan Processing Fees and Charges
              </h2>
              <p className={`text-lg text-white/70 font-medium ${bodyFont}`}>
                Applicants usually require the following documents for processing personal loan applications.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 max-w-6xl mx-auto">
              {processingFees.map((fee, index) => (
                <Card key={index} className="bg-white border-0 hover:shadow-xl transition-all duration-300 rounded-lg">
                  <CardContent className="p-6 flex flex-col gap-3">
                    <div className="w-11 h-11 bg-blue-100 rounded-lg flex items-center justify-center">
                      <FileTextIcon className="w-5 h-5 text-[#0050B2]" />
                    </div>
                    <h3 className={`font-semibold text-[#0b0b0b] mb-2 text-base ${bodyFont}`}>{fee.particular}</h3>
                    <p className={`text-sm text-[#757575] whitespace-pre-line leading-relaxed ${bodyFont}`}>{fee.charges}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
            <div className="text-center mt-16">
              <Button className={`bg-[#0877ff] hover:bg-[#0666dd] text-white font-bold px-6 py-4 rounded-lg text-lg shadow-[0px_6px_14px_-6px_#0050b2] transition-all duration-300 ${bodyFont}`}>
                CONTACT FOR HELP / MORE DETAILS
              </Button>
            </div>
          </div>

        </div>
      </section>
      <section className="bg-gradient-to-b from-[#5B9FE9] to-[#4B8FD9] relative overflow-hidden">
        <TunnelGrid color="rgba(255,255,255,0.18)" />
        <div className="py-20">
          <div className="container mx-auto max-w-7xl px-4 relative z-10">
            {/* TESTIMONIALS SECTION */}
            <div className="text-center mb-14">
              <h2 className={`text-3xl lg:text-5xl text-white mb-4 tracking-tight font-normal ${headingFont}`}>
                What Our Customers Say
              </h2>
              <p className={`text-lg text-white/80 max-w-2xl mx-auto font-medium ${bodyFont}`}>
                See how Accrefin has helped thousands of customers achieve their financial goals
              </p>
            </div>

            {/* Testimonial Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {[
                {
                  name: "Priya Sharma",
                  photo: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
                  feedback: "Accrefin made my home loan journey incredibly smooth. Got the best rate from HDFC Bank within 24 hours. Highly recommended!",
                  rating: 5
                },
                {
                  name: "Rajesh Kumar",
                  photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
                  feedback: "Quick personal loan approval for my business needs. The team was very professional and transparent about all the charges.",
                  rating: 5
                },
                {
                  name: "Anita Patel",
                  photo: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
                  feedback: "Excellent service! They helped me compare multiple offers and choose the best one. Saved me a lot of time and effort!",
                  rating: 5
                }
              ].map((testimonial, index) => (
                <Card key={index} className="bg-gradient-to-b from-[#0e5aa0] to-[#083b6f] text-white shadow-lg transition-all duration-300 rounded-xl border-0">
                  <CardContent className="p-8 flex flex-col items-center text-center gap-4">
                    <div className="flex items-center justify-center gap-2">
                      {[...Array(5)].map((_, i) => (
                        <StarIcon key={i} className={`w-5 h-5 ${i < testimonial.rating ? 'text-yellow-400 fill-current' : 'text-white/30'}`} />
                      ))}
                    </div>
                    <p className={`text-white leading-relaxed text-sm ${bodyFont}`}>"{testimonial.feedback}"</p>
                    <div className="flex items-center gap-3 pt-2">
                      <img src={testimonial.photo} alt={testimonial.name} className="w-10 h-10 rounded-full object-cover border-2 border-white" />
                      <h4 className={`font-semibold text-white text-sm ${bodyFont}`}>{testimonial.name}</h4>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>

        {/* Stats Bar - Full Width */}
        <div className="bg-[#0050B2] relative z-10">
          <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-white/20">
            {[
              { value: "25,000+", label: "Happy Customers" },
              { value: "98%", label: "Approval Rate" },
              { value: "4.9/5", label: "Customer Rating" },
              { value: "24hrs", label: "Average Processing" }
            ].map((stat, index) => (
              <div key={index} className="text-center py-10 px-4">
                <div className={`text-4xl lg:text-5xl font-extrabold text-white mb-2 ${bodyFont}`}>{stat.value}</div>
                <div className={`text-sm text-white/80 font-medium ${bodyFont}`}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="py-16 bg-white relative overflow-hidden">
        <PerspectiveGrid color="rgba(200,215,235,0.20)" />
        <div className="container mx-auto max-w-7xl px-4 relative z-10">
          <div className="text-center mb-12">
            <h2 className={`text-3xl lg:text-5xl text-[#273240] mb-4 tracking-tight font-normal ${headingFont}`}>
              Learn &amp; Grow with<br />Expert Financial Insights
            </h2>
            <p className={`text-lg text-gray-500 max-w-2xl mx-auto font-medium ${bodyFont}`}>
              Stay informed with the latest financial insights, tips, and market trends
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                thumbnail: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&h=250&fit=crop",
                title: "How to Improve Your Credit Score in 2025",
                summary: "Learn proven strategies to boost your credit score and get better loan offers.",
                readTime: "5 min read",
                category: "Credit Tips"
              },
              {
                thumbnail: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=250&fit=crop",
                title: "Home Loan vs Rent: What's Better in 2025?",
                summary: "Complete comparison to help you choose the right financing option for your needs.",
                readTime: "8 min read",
                category: "Personal Finance"
              },
              {
                thumbnail: "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=400&h=250&fit=crop",
                title: "Business Loan Guide for Startups",
                summary: "Discover the best practices for using personal loans to achieve your financial goals.",
                readTime: "6 min read",
                category: "Personal Loans"
              }
            ].map((post, index) => (
              <Card key={index} className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-100 bg-white overflow-hidden rounded-xl">
                <div className="relative overflow-hidden">
                  <img
                    src={post.thumbnail}
                    alt={post.title}
                    className="w-full h-44 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 left-3">
                    <span className={`bg-[#0050B2] text-white px-3 py-1 rounded-full text-xs font-semibold ${bodyFont}`}>
                      {post.category}
                    </span>
                  </div>
                </div>
                <CardContent className="p-5">
                  <div className="space-y-3">
                    <h3 className={`text-base font-bold text-gray-900 leading-snug group-hover:text-[#0050B2] transition-colors duration-300 ${bodyFont}`}>
                      {post.title}
                    </h3>
                    <p className={`text-sm text-gray-500 leading-relaxed ${bodyFont}`}>{post.summary}</p>
                    <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                      <span className={`text-xs text-gray-400 ${bodyFont}`}>{post.readTime}</span>
                      <a
                        href="https://www.cicd-training.com/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`text-[#0050B2] hover:text-[#003d8a] text-xs font-semibold inline-flex items-center gap-1 ${bodyFont}`}
                      >
                        Read More →
                      </a>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          {/* Explore Now Button */}
          <div className="text-center mt-10">
            <Button className={`bg-[#0877ff] hover:bg-[#0666dd] text-white font-bold px-10 py-3 rounded text-sm shadow-[0px_4px_11.8px_-5px_#0050b2] ${bodyFont}`}>
              Explore Now
            </Button>
          </div>
        </div>
      </section>
      <section id="faqs" className="py-16 bg-[#0e396d] relative overflow-hidden">
        <TunnelGrid color="rgba(255,255,255,0.18)" />
        <div className="container mx-auto max-w-7xl px-4 relative z-10">
          <div className="text-center mb-12">
            <h2 className={`text-3xl lg:text-5xl text-white mb-4 tracking-tight font-normal ${headingFont}`}>
              Frequently Asked<br />Questions
            </h2>
            <p className={`text-lg text-white/60 font-medium ${bodyFont}`}>
              Get answers to common questions about personal loans
            </p>
          </div>
          <div className="max-w-4xl mx-auto space-y-3">
            {faqs.map((faq, index) => (
              <Card key={index} className="border-0 bg-white hover:shadow-lg transition-shadow duration-300">
                <CardContent className="p-0">
                  <button
                    onClick={() => setExpandedDoc(expandedDoc === `faq-${index}` ? null : `faq-${index}`)}
                    className="w-full px-6 py-5 text-left flex items-center justify-between hover:bg-gray-50 transition-colors duration-200 rounded-lg"
                  >
                    <h3 className={`text-sm font-semibold text-gray-900 pr-4 ${bodyFont}`}>{faq.question}</h3>
                    {expandedDoc === `faq-${index}` ? (
                      <ChevronUpIcon className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    ) : (
                      <ChevronDownIcon className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    )}
                  </button>
                  {expandedDoc === `faq-${index}` && (
                    <div className="px-6 pb-5 border-t border-gray-100">
                      <p className={`text-gray-600 leading-relaxed mt-4 text-sm ${bodyFont}`}>{faq.answer}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
};
