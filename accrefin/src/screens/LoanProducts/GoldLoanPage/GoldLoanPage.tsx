import React, { useState, useEffect } from "react";
import { Button } from "../../../components/ui/button";
import { Card, CardContent } from "../../../components/ui/card";
import { Input } from "../../../components/ui/input";
import { Badge } from "../../../components/ui/badge";
import { Separator } from "../../../components/ui/separator";
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../../constants/routes';
import { CheckIcon, StarIcon, UserIcon, ShieldIcon, ClockIcon, FileTextIcon, CreditCardIcon, BanknoteIcon as BanknotesIcon, ChevronDownIcon, ChevronUpIcon, TrendingUpIcon, ZapIcon, LockIcon, CalendarIcon, GemIcon, RefreshCwIcon } from "lucide-react";

const PerspectiveGrid = ({ color = "rgba(255,255,255,0.10)", className = "" }: { color?: string; className?: string }) => (
  <div className={`absolute inset-0 pointer-events-none overflow-hidden ${className}`}>
    <svg width="100%" height="100%" viewBox="0 0 1440 900" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
      {Array.from({ length: 18 }).map((_, i) => {
        const y = 50 + i * 50;
        const perspectiveOffset = (i - 9) * 3;
        return (
          <line key={`h-${i}`} x1={-20 + perspectiveOffset} y1={y} x2={1460 - perspectiveOffset} y2={y} stroke={color} strokeWidth="0.8" />
        );
      })}
      {Array.from({ length: 22 }).map((_, i) => {
        const x = -20 + i * 70;
        const topOffset = (i - 11) * 4;
        return (
          <line key={`v-${i}`} x1={x + topOffset} y1={0} x2={x - topOffset} y2={900} stroke={color} strokeWidth="0.8" />
        );
      })}
      <line x1="0" y1="0" x2="720" y2="450" stroke={color} strokeWidth="0.5" />
      <line x1="1440" y1="0" x2="720" y2="450" stroke={color} strokeWidth="0.5" />
      <line x1="0" y1="900" x2="720" y2="450" stroke={color} strokeWidth="0.5" />
      <line x1="1440" y1="900" x2="720" y2="450" stroke={color} strokeWidth="0.5" />
    </svg>
  </div>
);

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

export const GoldLoanPage = (): JSX.Element => {
  const [goldWeight, setGoldWeight] = useState(50);
  const [goldPurity, setGoldPurity] = useState(22);
  const [tenure, setTenure] = useState(12);
  const [interestRate, setInterestRate] = useState(10.5);
  const [activeTab, setActiveTab] = useState("overview");
  const [isTabSticky, setIsTabSticky] = useState(false);
  const [expandedDoc, setExpandedDoc] = useState<string | null>(null);
  const [formStatus, setFormStatus] = useState<'FORM' | 'LOADING' | 'SUCCESS'>('FORM');
  const navigate = useNavigate();

  const GOLD_RATE_PER_GRAM = 6200; // approx ₹6,200 per gram for 24K

  const calculateLoanAmount = () => {
    const purityMultiplier = goldPurity / 24;
    const goldValue = goldWeight * GOLD_RATE_PER_GRAM * purityMultiplier;
    return Math.round(goldValue * 0.75); // LTV up to 75%
  };

  const loanAmount = calculateLoanAmount();

  const calculateInterest = () => {
    const monthlyRate = interestRate / 100 / 12;
    return Math.round(loanAmount * monthlyRate * tenure);
  };

  const totalInterest = calculateInterest();
  const totalPayable = loanAmount + totalInterest;

  useEffect(() => {
    const handleScroll = () => {
      const heroSection = document.getElementById('hero-section');
      if (heroSection) {
        const heroBottom = heroSection.offsetTop + heroSection.offsetHeight;
        setIsTabSticky(window.scrollY > heroBottom - 100);
      }
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

  const scrollToSection = (sectionId: string) => {
    setActiveTab(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      const offset = isTabSticky ? 80 : 0;
      window.scrollTo({ top: element.offsetTop - offset, behavior: 'smooth' });
    }
  };

  const getFillPercentage = (value: number, min: number, max: number): string => {
    const percentage = ((Number(value) - Number(min)) / (Number(max) - Number(min))) * 100;
    return `${Math.max(0, Math.min(100, percentage))}%`;
  };

  const scrollToForm = () => {
    const el = document.getElementById('loan-application-form');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      setTimeout(() => {
        const fields = document.querySelectorAll('#loan-application-form input, #loan-application-form select');
        fields.forEach((f) => (f as HTMLElement).classList.add('ring-2', 'ring-offset-2', 'ring-[#1e3a8a]'));
        setTimeout(() => fields.forEach((f) => (f as HTMLElement).classList.remove('ring-2', 'ring-offset-2', 'ring-[#1e3a8a]')), 2000);
      }, 200);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormStatus('LOADING');
    setTimeout(() => setFormStatus('SUCCESS'), 1500);
  };

  const tabItems = [
    { id: "overview", label: "Overview" },
    { id: "features", label: "Features" },
    { id: "eligibility", label: "Eligibility" },
    { id: "documents", label: "Documents" },
    { id: "calculator", label: "Calculator" },
    { id: "fees", label: "Fees & Charges" },
    { id: "faqs", label: "FAQs" }
  ];

  const whyAccrefinFeatures = [
    {
      icon: <ZapIcon className="w-6 h-6" />,
      title: "Instant Disbursal",
      subtitle: "Get cash in hand within 30 minutes of gold assessment at our partner branches",
      iconColor: "text-[#0050B2]",
      bgColor: "bg-blue-50/50"
    },
    {
      icon: <TrendingUpIcon className="w-6 h-6" />,
      title: "Low Interest from 7%",
      subtitle: "Among the lowest gold loan rates in the market — starting just 7% p.a.",
      iconColor: "text-[#0050B2]",
      bgColor: "bg-blue-50/50"
    },
    {
      icon: <GemIcon className="w-6 h-6" />,
      title: "Gold Stays Safe",
      subtitle: "Your gold is stored in fully insured bank-grade vaults until repayment",
      iconColor: "text-[#0050B2]",
      bgColor: "bg-blue-50/50"
    },
    {
      icon: <RefreshCwIcon className="w-6 h-6" />,
      title: "Flexible Repayment",
      subtitle: "Repay interest monthly or bullet repayment at end of tenure — your choice",
      iconColor: "text-[#0050B2]",
      bgColor: "bg-blue-50/50"
    }
  ];

  const goldLoanFeatures = [
    {
      icon: <GemIcon className="w-8 h-8" />,
      title: "All Gold Types",
      description: "Jewellery, coins, bars — all accepted. Gold from 18K to 24K purity",
      bgColor: "bg-blue-50"
    },
    {
      icon: <CalendarIcon className="w-8 h-8" />,
      title: "Flexible Tenure",
      description: "Choose repayment tenure from 3 months to 3 years as per your need",
      bgColor: "bg-green-50"
    },
    {
      icon: <ShieldIcon className="w-8 h-8" />,
      title: "Safe & Insured",
      description: "Gold stored in bank vaults with full insurance coverage throughout the tenure",
      bgColor: "bg-purple-50"
    },
    {
      icon: <CheckIcon className="w-8 h-8" />,
      title: "No Income Proof",
      description: "No income documents or credit score required — gold is the only collateral",
      bgColor: "bg-orange-50"
    }
  ];

  const bankOffers = [
    { bank: "HDFC Bank", logo: "/logos/h.png", interestRate: "7.50% - 16.00%", processingFee: "Up to 1.50%", loanAmount: "₹10K - ₹1Cr", features: ["Instant Disbursal", "Safe Custody"], rating: 4.4, highlight: "Most Popular" },
    { bank: "ICICI Bank", logo: "/logos/i.png", interestRate: "8.00% - 17.00%", processingFee: "Up to 1.00%", loanAmount: "₹10K - ₹1Cr", features: ["Quick Approval", "Digital Process"], rating: 4.3, highlight: "Best Rate" },
    { bank: "Axis Bank", logo: "/logos/A.png", interestRate: "8.50% - 17.50%", processingFee: "Up to 1.50%", loanAmount: "₹25K - ₹50L", features: ["Flexible EMI", "Multiple Schemes"], rating: 4.1, highlight: "Flexible" },
    { bank: "Muthoot Finance", logo: "/logos/k.png", interestRate: "12.00% - 24.00%", processingFee: "Up to 1.00%", loanAmount: "₹1.5K - ₹1Cr", features: ["Fastest Approval", "1500+ Branches"], rating: 4.5, highlight: "Fastest" },
    { bank: "Manappuram", logo: "/logos/p.png", interestRate: "9.90% - 26.00%", processingFee: "Nil", loanAmount: "₹1K - ₹1Cr", features: ["No Processing Fee", "3500+ Branches"], rating: 4.2, highlight: "No Fee" },
  ];

  const eligibilityCriteria = [
    { criteria: "Age", requirement: "18 years and above", icon: "👤" },
    { criteria: "Gold Purity", requirement: "Minimum 18 Karat (18K to 24K accepted)", icon: "💛" },
    { criteria: "Gold Type", requirement: "Jewellery, ornaments, coins & bars accepted", icon: "💎" },
    { criteria: "No Credit Score", requirement: "CIBIL score not required — gold is collateral", icon: "📊" },
    { criteria: "No Income Proof", requirement: "Salaried or self-employed, income docs not mandatory", icon: "💼" },
    { criteria: "Gold Ownership", requirement: "Gold should belong to the applicant or family member", icon: "🏦" }
  ];

  const requiredDocs = [
    {
      category: "Identity Proof",
      icon: "📄",
      docs: [
        "Aadhaar Card",
        "PAN Card",
        "Passport",
        "Voter ID",
        "Driving License"
      ]
    },
    {
      category: "Address Proof",
      icon: "🏠",
      docs: [
        "Aadhaar Card",
        "Utility Bills (Electricity/Water)",
        "Passport",
        "Voter ID",
        "Bank Statement with address"
      ]
    },
    {
      category: "Gold Ownership",
      icon: "💎",
      docs: [
        "Original purchase receipt (if available)",
        "Gold jewellery/ ornaments to be pledged",
        "Family declaration (if gold belongs to family)"
      ]
    },
    {
      category: "Additional Documents",
      icon: "📋",
      docs: [
        "Passport Size Photographs (2 copies)",
        "Signed loan application form",
        "Any existing loan NOC (if applicable)"
      ]
    }
  ];

  const processingFees = [
    { particular: "Processing Fees", charges: "Nil to 1.5% of loan amount + GST" },
    { particular: "Gold Valuation Charges", charges: "Nil (included in processing) or ₹100–₹500" },
    { particular: "Prepayment Charges", charges: "Nil (most lenders allow free foreclosure)" },
    { particular: "Renewal/Auction Charges", charges: "₹500 to ₹2,000 if gold is auctioned on default" },
    { particular: "Penal Interest", charges: "2% to 3% per month on overdue amount" },
    { particular: "Cheque Bounce Charges", charges: "₹250 to ₹500 per instance" },
    { particular: "Statement Charges", charges: "₹50 to ₹200 per request" }
  ];

  const faqs = [
    {
      question: "What types of gold are accepted for a Gold Loan?",
      answer: "Most lenders accept gold jewellery, ornaments, and gold coins of 18K to 24K purity. Gold bars may be accepted by select lenders. Studded jewellery (with diamonds/gemstones) is typically valued only for the gold content, not the stones."
    },
    {
      question: "How is the gold loan amount determined?",
      answer: "The loan amount is based on the weight and purity of your gold, multiplied by the prevailing market rate, up to a maximum Loan-to-Value (LTV) ratio of 75% as per RBI guidelines. Higher purity gold (22K or 24K) fetches a higher loan amount."
    },
    {
      question: "Is my gold safe during the loan tenure?",
      answer: "Yes, your gold is stored in fully insured, bank-grade secure vaults during the entire loan tenure. Once you repay the loan in full, your gold is returned to you in the same condition. You receive an acknowledgement receipt at the time of pledging."
    },
    {
      question: "What happens if I cannot repay the gold loan?",
      answer: "If you default on the gold loan, the lender has the right to auction your pledged gold to recover the outstanding dues. Lenders typically provide advance notice and allow you to regularize the loan before resorting to auction."
    },
    {
      question: "Can I partially repay my gold loan?",
      answer: "Yes, most gold loan lenders allow partial repayment without any charges. You can also release a portion of the pledged gold proportionate to the amount repaid. This gives you flexibility to manage your finances."
    },
    {
      question: "How long does it take to get a gold loan?",
      answer: "Gold loans are among the fastest loans available. In-branch gold valuation and disbursal can happen within 30 minutes to a few hours. Even for larger amounts, the entire process is typically completed within the same day."
    }
  ];

  const headingFont = "font-['Power_Grotesk',_'DM_Sans',_sans-serif]";
  const bodyFont = "font-['DM_Sans',_sans-serif]";

  return (
    <div className="min-h-screen bg-white">
      <section id="hero-section" className="bg-white relative overflow-hidden">
        <RoomGrid />

        <div className="container mx-auto max-w-7xl px-6 pt-8 pb-0 relative z-10">
          <div className="flex justify-center mb-10">
            <div className="flex items-center gap-2 border border-gray-300 rounded-full px-5 py-2.5 bg-gray-50 backdrop-blur-sm">
              <svg className="w-5 h-5 text-[#0050B2]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              <span className={`text-gray-700 text-sm ${bodyFont}`}>India's most trusted platform</span>
            </div>
          </div>

          <div className="mb-6">
            <nav className={`flex items-center space-x-2 text-sm ${bodyFont}`}>
              <a href="/" className="text-gray-600 hover:text-gray-800 transition-colors">Home</a>
              <span className="text-gray-400">/</span>
              <span className="text-gray-600">Gold Loan</span>
            </nav>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start pb-14">
            <div className="space-y-6">
              <h1 className={`text-4xl lg:text-5xl xl:text-[56px] font-normal text-gray-900 leading-[1.15] tracking-tight ${headingFont}`}>
                Instant Gold<br />Loan Online
              </h1>
              <p className={`text-base lg:text-lg text-gray-600 leading-relaxed max-w-lg ${bodyFont} font-medium`}>
                Unlock instant funds against your gold jewellery, ornaments, or coins. Get a Gold Loan of up to ₹5 Crore+ at interest rates starting from 7% p.a. Disbursal within 30 minutes with minimal documentation.
              </p>
            </div>

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
                          <option value="default" disabled hidden>Gold Type</option>
                          <option value="jewellery">Jewellery / Ornaments</option>
                          <option value="coins">Gold Coins</option>
                          <option value="bars">Gold Bars</option>
                        </select>
                      </div>
                      <div>
                        <select
                          className={`w-full h-11 px-3 border border-gray-200 focus:border-[#0050B2] rounded-md text-sm text-gray-500 outline-none ${bodyFont}`}
                          defaultValue="default"
                        >
                          <option value="default" disabled hidden>Gold Purity</option>
                          <option value="24k">24 Karat</option>
                          <option value="22k">22 Karat</option>
                          <option value="18k">18 Karat</option>
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
                      <Button type="submit" className={`w-full bg-[#0877ff] hover:bg-[#0666dd] text-white py-4 text-sm font-bold rounded shadow-[0px_4px_11.8px_-5px_#0050b2] transition-all duration-300 ${bodyFont} tracking-wide`}>
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
                      <p className="text-gray-600 max-w-xs">Our team will call you to schedule a gold assessment at your nearest partner branch.</p>
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

        <div className="bg-[#0e396d] border-t border-white/10 relative z-10">
          <div className="container mx-auto max-w-7xl px-4">
            <div className="flex items-center justify-center flex-wrap lg:flex-nowrap">
              {[
                { title: "30-Min Disbursal", desc: "Cash in hand within 30 minutes" },
                { title: "No Credit Score", desc: "Gold is the only collateral needed" },
                { title: "Safe Gold Custody", desc: "Bank-grade insured vaults" },
                { title: "Dedicated Support", desc: "Gold loan experts at your service" },
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

      {/* Overview Section */}
      <section id="overview" className="py-16 bg-[#f4f9ff]">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="text-center mb-12">
            <h2 className={`text-3xl lg:text-5xl text-[#273240] mb-4 tracking-tight font-normal ${headingFont}`}>
              Why Choose Accrefin for Your Gold Loan?
            </h2>
            <p className={`text-lg text-gray-500 font-medium ${bodyFont}`}>
              Turn your gold into instant liquidity with India's most trusted platform
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {whyAccrefinFeatures.map((feature, index) => (
              <Card
                key={index}
                className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border border-gray-100/50 bg-white/80 backdrop-blur-sm relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-[#0050B2]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <CardContent className="p-6 text-center relative z-10">
                  <div className={`w-14 h-14 ${feature.bgColor} rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-105 transition-transform duration-300 border border-[#0050B2]/10`}>
                    <div className={feature.iconColor}>{feature.icon}</div>
                  </div>
                  <h3 className={`text-lg font-bold text-gray-900 mb-2 group-hover:text-[#0050B2] transition-colors duration-300 ${headingFont}`}>
                    {feature.title}
                  </h3>
                  <p className={`text-gray-600 leading-relaxed text-sm ${bodyFont}`}>{feature.subtitle}</p>
                  <div className="mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="w-6 h-0.5 bg-[#0050B2] mx-auto rounded-full"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 bg-white">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="text-center mb-12">
            <h2 className={`text-3xl lg:text-5xl text-[#273240] mb-4 tracking-tight font-normal ${headingFont}`}>
              Gold Loan Features &amp; Benefits
            </h2>
            <p className={`text-lg text-gray-500 font-medium ${bodyFont}`}>
              The fastest and most hassle-free way to access funds
            </p>
          </div>
          <div className="relative overflow-hidden" style={{ background: 'linear-gradient(90deg, rgba(246,250,255,1) 0%, rgba(218,235,255,1) 100%)' }}>
            <PerspectiveGrid color="rgba(180,200,230,0.20)" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-0 relative z-10">
              {goldLoanFeatures.map((feature, index) => (
                <div
                  key={index}
                  className={`flex flex-col items-start gap-4 p-8 border border-[#e4e4e4] ${index < 3 ? 'bg-[#eaf3ff]/50' : 'bg-[#f0f7ff]/50'}`}
                >
                  <div className="w-12 h-12 flex items-center justify-center bg-transparent rounded">
                    <div className="text-[#0050B2]">{feature.icon}</div>
                  </div>
                  <h3 className={`text-[#273240] text-2xl lg:text-[32px] font-normal leading-tight ${headingFont}`}>{feature.title}</h3>
                  <p className={`text-[#0877ff] text-base font-medium ${bodyFont}`}>{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Eligibility Section */}
      <section id="eligibility" className="bg-gradient-to-b from-[#5B9FE9] via-[#2976D8] to-[#0050B2] relative overflow-hidden">
        <TunnelGrid color="rgba(255,255,255,0.18)" />
        <div className="py-20 relative z-10">
          <div className="container mx-auto max-w-7xl px-4">
            <div className="text-center mb-14">
              <h2 className={`text-3xl lg:text-5xl text-white mb-4 tracking-tight font-normal ${headingFont}`}>
                Gold Loan Eligibility Criteria
              </h2>
            </div>
            <div className="relative max-w-5xl mx-auto mb-12">
              <div className="absolute inset-0 rounded-3xl bg-white/5 pointer-events-none border border-white/5" />
              <div className="relative grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
                {eligibilityCriteria.map((item, index) => (
                  <div key={index} className="bg-white rounded-2xl p-8 hover:shadow-xl transition-all duration-300">
                    <div className="flex items-start gap-4">
                      <div className="w-14 h-14 flex items-center justify-center bg-blue-100 rounded-lg flex-shrink-0">
                        {item.criteria === "Age" && <UserIcon className="w-6 h-6 text-[#0050B2]" />}
                        {item.criteria === "Gold Purity" && <GemIcon className="w-6 h-6 text-[#0050B2]" />}
                        {item.criteria === "Gold Type" && <GemIcon className="w-6 h-6 text-[#0050B2]" />}
                        {item.criteria === "No Credit Score" && <TrendingUpIcon className="w-6 h-6 text-[#0050B2]" />}
                        {item.criteria === "No Income Proof" && <ShieldIcon className="w-6 h-6 text-[#0050B2]" />}
                        {item.criteria === "Gold Ownership" && <LockIcon className="w-6 h-6 text-[#0050B2]" />}
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
        <div className="bg-[#004B8F] relative z-10">
          <div className="container mx-auto max-w-7xl px-4">
            <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-white/20">
              {[
                { step: "01", title: "Visit Branch / Apply Online" },
                { step: "02", title: "Gold Assessment" },
                { step: "03", title: "Loan Approval" },
                { step: "04", title: "Instant Disbursal" }
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

      <div className="bg-white py-12 relative z-10">
        <div className="container mx-auto max-w-7xl px-4 flex flex-col items-center justify-center gap-4">
          <Button onClick={scrollToForm} className={`bg-[#0877ff] hover:bg-[#0666dd] text-white font-bold px-6 py-2.5 rounded text-sm shadow-[0px_6px_14px_-6px_#0050b2] transition-all duration-300 ${bodyFont}`}>
            START YOUR APPLICATION
          </Button>
        </div>
      </div>

      {/* Documents Required Section */}
      <section id="documents" className="py-20 bg-white relative overflow-hidden">
        <div className="container mx-auto max-w-7xl px-4 relative z-10">
          <div className="text-center mb-12">
            <h2 className={`text-3xl lg:text-5xl text-[#273240] mb-4 tracking-tight font-normal ${headingFont}`}>
              Documents Required for Gold Loan
            </h2>
            <p className={`text-lg text-gray-500 font-medium ${bodyFont}`}>
              Minimal documentation — just your identity proof and your gold is enough.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {requiredDocs.map((doc, index) => (
              <Card key={index} className="bg-white border border-[#e1e1e1] hover:shadow-lg transition-shadow duration-300">
                <CardContent className="p-6 flex flex-col gap-3">
                  <div className="w-12 h-12 flex items-center justify-center bg-blue-100 rounded-lg">
                    <FileTextIcon className="w-6 h-6 text-[#0050B2]" />
                  </div>
                  <h3 className={`font-semibold text-[#0b0b0b] text-base ${bodyFont}`}>{doc.category}</h3>
                  <p className={`text-xs text-[#757575] leading-5 ${bodyFont}`}>{doc.docs.join("\n")}</p>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="text-center mt-14">
            <Button className={`bg-[#0877ff] hover:bg-[#0666dd] text-white font-bold px-6 py-2.5 rounded text-sm shadow-[0px_6px_14px_-6px_#0050b2] transition-all duration-300 ${bodyFont}`}>
              CONTACT FOR HELP / MORE DETAILS
            </Button>
          </div>
        </div>
      </section>

      {/* Gold Loan Calculator */}
      <section id="calculator" className="py-20 bg-[#0E396E] relative overflow-hidden">
        <div className="container mx-auto max-w-7xl px-4 relative z-10">
          <div className="text-center mb-16">
            <h2 className={`text-3xl lg:text-5xl text-white mb-4 tracking-tight font-normal ${headingFont}`}>
              Gold Loan Calculator
            </h2>
            <p className={`text-lg text-white/70 font-medium ${bodyFont}`}>
              Estimate your loan amount based on your gold's weight and purity
            </p>
          </div>
          <Card className="max-w-5xl mx-auto shadow-lg border-0 bg-white">
            <CardContent className="p-10 lg:p-12">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
                <div>
                  <label className={`text-sm font-semibold text-gray-700 ${bodyFont} mb-2 block`}>Gold Weight (grams)</label>
                  <div className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-center">
                    <span className={`font-bold text-gray-900 text-lg ${bodyFont}`}>{goldWeight}g</span>
                  </div>
                  <input type="range" min="5" max="500" step="5" value={goldWeight}
                    onChange={(e) => setGoldWeight(Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg cursor-pointer slider mt-3"
                    style={{ '--fill-percent': getFillPercentage(goldWeight, 5, 500) } as React.CSSProperties}
                  />
                  <div className={`flex justify-between text-xs text-gray-400 mt-1 ${bodyFont}`}>
                    <span>5g</span><span>500g</span>
                  </div>
                </div>
                <div>
                  <label className={`text-sm font-semibold text-gray-700 ${bodyFont} mb-2 block`}>Gold Purity (Karat)</label>
                  <div className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-center">
                    <span className={`font-bold text-gray-900 text-lg ${bodyFont}`}>{goldPurity}K</span>
                  </div>
                  <input type="range" min="18" max="24" step="1" value={goldPurity}
                    onChange={(e) => setGoldPurity(Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg cursor-pointer slider mt-3"
                    style={{ '--fill-percent': getFillPercentage(goldPurity, 18, 24) } as React.CSSProperties}
                  />
                  <div className={`flex justify-between text-xs text-gray-400 mt-1 ${bodyFont}`}>
                    <span>18K</span><span>24K</span>
                  </div>
                </div>
                <div>
                  <label className={`text-sm font-semibold text-gray-700 ${bodyFont} mb-2 block`}>Tenure (Months)</label>
                  <div className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-center">
                    <span className={`font-bold text-gray-900 text-lg ${bodyFont}`}>{tenure} Months</span>
                  </div>
                  <input type="range" min="3" max="36" step="3" value={tenure}
                    onChange={(e) => setTenure(Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg cursor-pointer slider mt-3"
                    style={{ '--fill-percent': getFillPercentage(tenure, 3, 36) } as React.CSSProperties}
                  />
                  <div className={`flex justify-between text-xs text-gray-400 mt-1 ${bodyFont}`}>
                    <span>3 Months</span><span>36 Months</span>
                  </div>
                </div>
              </div>
              <Separator className="my-6" />
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <div className="flex justify-between items-center py-3 border-b border-gray-100">
                    <span className={`text-gray-600 text-sm font-medium ${bodyFont}`}>Estimated Loan Amount</span>
                    <span className={`font-bold text-gray-900 bg-gray-100 px-3 py-1 rounded text-sm ${bodyFont}`}>₹{loanAmount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-gray-100">
                    <span className={`text-gray-600 text-sm font-medium ${bodyFont}`}>Total Interest (@{interestRate}% p.a.)</span>
                    <span className={`font-bold text-gray-900 bg-gray-100 px-3 py-1 rounded text-sm ${bodyFont}`}>₹{totalInterest.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b-2 border-[#0050B2]">
                    <span className={`text-[#0050B2] font-semibold text-sm ${bodyFont}`}>Total Payable</span>
                    <span className={`font-bold text-[#0050B2] bg-blue-50 px-3 py-1 rounded text-sm ${bodyFont}`}>₹{totalPayable.toLocaleString()}</span>
                  </div>
                  <p className={`text-xs text-gray-400 mt-2 ${bodyFont}`}>* Based on approx. ₹6,200/g for 24K gold. Actual amount depends on prevailing market rate at time of pledge.</p>
                </div>
                <div className="bg-[#0877ff] rounded-2xl p-8 text-white text-center flex flex-col items-center justify-center">
                  <h3 className={`text-base font-semibold mb-1 opacity-90 ${bodyFont}`}>Estimated Loan Amount</h3>
                  <div className={`text-4xl font-extrabold mb-2 ${bodyFont}`}>₹{loanAmount.toLocaleString()}</div>
                  <p className={`text-sm opacity-80 mb-6 ${bodyFont}`}>Against {goldWeight}g of {goldPurity}K gold</p>
                  <Button onClick={scrollToForm} className={`bg-white text-[#0877ff] hover:bg-gray-100 font-bold px-8 py-2.5 rounded text-sm transition-all duration-300 shadow-[0px_4px_11.8px_-5px_#0050b2] ${bodyFont}`}>
                    APPLY NOW
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Bank Offers Section */}
      <section id="offers" className="py-16 bg-white">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="text-center mb-12">
            <h2 className={`text-3xl lg:text-5xl text-[#273240] mb-4 tracking-tight font-normal ${headingFont}`}>
              Best Gold Loan Offers
            </h2>
            <p className={`text-lg text-gray-500 font-medium ${bodyFont}`}>
              Compare and choose from top lenders
            </p>
          </div>
          <div className="flex items-stretch gap-7 overflow-x-auto pb-4 px-2">
            {bankOffers.map((offer, index) => (
              <Card key={index} className="min-w-[294px] w-[294px] bg-[#f5f9ff] border-[#e1e1e1] hover:shadow-xl transition-shadow duration-300 flex-shrink-0">
                <CardContent className="p-6 flex flex-col items-center text-center h-full">
                  <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center mb-3 border border-gray-200">
                    <img src={offer.logo} alt={`${offer.bank} Logo`} className="w-10 h-10 object-contain" />
                  </div>
                  <div className="font-bold text-gray-900 text-lg">{offer.bank}</div>
                  <div className="flex items-center justify-center gap-3 mt-2">
                    <div className="flex items-center gap-1 text-sm text-gray-600">
                      <StarIcon className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="text-sm text-gray-600 font-semibold">{offer.rating}</span>
                    </div>
                    {offer.highlight && (
                      <Badge className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded">
                        {offer.highlight}
                      </Badge>
                    )}
                  </div>
                  <Separator className="my-4 w-full" />
                  <div className="w-full space-y-3 text-sm flex-1">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Interest:</span>
                      <span className="font-semibold text-gray-900">{offer.interestRate}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Processing Fee:</span>
                      <span className="font-semibold text-gray-900">{offer.processingFee}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Loan Amount:</span>
                      <span className="font-semibold text-gray-900">{offer.loanAmount}</span>
                    </div>
                  </div>
                  <div className="w-full mt-4 space-y-2">
                    {offer.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-sm text-gray-600">
                        <CheckIcon className="w-4 h-4 text-green-500 flex-shrink-0" />
                        {feature}
                      </div>
                    ))}
                  </div>
                  <Button onClick={() => navigate(ROUTES.APPLICATION)} className="w-full mt-6 bg-[#0877ff] hover:bg-[#0666dd] text-white font-semibold py-3 rounded-lg transition-all duration-300">
                    APPLY NOW
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Processing Fees Section */}
      <section id="fees" className="py-20 bg-[#0E1A3A] relative overflow-hidden">
        <TunnelGrid color="rgba(100,150,220,0.22)" />
        <div className="container mx-auto max-w-7xl px-4 relative z-10">
          <div className="mb-20">
            <div className="text-center mb-16">
              <h2 className={`text-3xl lg:text-5xl text-white mb-4 tracking-tight font-normal ${headingFont}`}>
                Gold Loan Fees and Charges
              </h2>
              <p className={`text-lg text-white/70 font-medium ${bodyFont}`}>
                Transparent pricing with no hidden costs
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
              <Button className={`bg-[#0877ff] hover:bg-[#0666dd] text-white font-bold px-6 py-2.5 rounded text-sm shadow-[0px_6px_14px_-6px_#0050b2] transition-all duration-300 ${bodyFont}`}>
                CONTACT FOR HELP / MORE DETAILS
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-gradient-to-b from-[#5B9FE9] to-[#4B8FD9] relative overflow-hidden">
        <TunnelGrid color="rgba(255,255,255,0.18)" />
        <div className="py-20">
          <div className="container mx-auto max-w-7xl px-4 relative z-10">
            <div className="text-center mb-14">
              <h2 className={`text-3xl lg:text-5xl text-white mb-4 tracking-tight font-normal ${headingFont}`}>
                What Our Customers Say
              </h2>
              <p className={`text-lg text-white/80 max-w-2xl mx-auto font-medium ${bodyFont}`}>
                Thousands of customers trust Accrefin for instant gold loans
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {[
                {
                  name: "Lakshmi Devi",
                  photo: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
                  feedback: "I got a gold loan of ₹3 lakhs within 45 minutes! Accrefin connected me with HDFC Bank and the process was so smooth. My jewellery is safe in their vault.",
                  rating: 5
                },
                {
                  name: "Suresh Nair",
                  photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
                  feedback: "Needed urgent funds for my business. Gold loan was the fastest option. Accrefin got me the best rate at 8.5%. No paperwork hassle at all. Highly recommend!",
                  rating: 5
                },
                {
                  name: "Meena Pillai",
                  photo: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
                  feedback: "My credit score was low so banks were rejecting me. Accrefin suggested a gold loan and I got ₹1.5 lakhs the same day. Perfect solution for urgent needs!",
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
                    <p className={`text-white leading-relaxed text-sm ${bodyFont}`}>&quot;{testimonial.feedback}&quot;</p>
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
        <div className="bg-[#0050B2] relative z-10">
          <div className="container mx-auto max-w-7xl px-4">
            <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-white/20">
              {[
                { value: "4,000+", label: "Happy Customers" },
                { value: "30 Min", label: "Avg. Disbursal Time" },
                { value: "4.9/5", label: "Customer Rating" },
                { value: "100%", label: "Gold Safety Record" }
              ].map((stat, index) => (
                <div key={index} className="text-center py-10 px-4">
                  <div className={`text-4xl lg:text-5xl font-extrabold text-white mb-2 ${bodyFont}`}>{stat.value}</div>
                  <div className={`text-sm text-white/80 font-medium ${bodyFont}`}>{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>


      {/* FAQs */}
      <section id="faqs" className="py-16 bg-[#0e396d] relative overflow-hidden">
        <TunnelGrid color="rgba(255,255,255,0.18)" />
        <div className="container mx-auto max-w-7xl px-4 relative z-10">
          <div className="text-center mb-12">
            <h2 className={`text-3xl lg:text-5xl text-white mb-4 tracking-tight font-normal ${headingFont}`}>
              Frequently Asked<br />Questions
            </h2>
            <p className={`text-lg text-white/60 font-medium ${bodyFont}`}>
              Get answers to common questions about Gold Loans
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
