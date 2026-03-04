import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../../constants/routes';
import { Button } from "../../../components/ui/button";
import { Card, CardContent } from "../../../components/ui/card";
import { Input } from "../../../components/ui/input";
import { Badge } from "../../../components/ui/badge";
import { Separator } from "../../../components/ui/separator";
import { CheckIcon, StarIcon, UserIcon, FileTextIcon, ChevronDownIcon, ChevronUpIcon, TrendingUpIcon, ZapIcon, GlobeIcon, LockIcon, BuildingIcon, BarChart3Icon, UsersIcon } from "lucide-react";

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

/* ─── Tunnel/Room Perspective Grid for dark sections ─── */
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

export const BusinessLoanPage = (): JSX.Element => {
  const [loanAmount, setLoanAmount] = useState(1000000);
  const [tenure, setTenure] = useState(36);
  const [interestRate, setInterestRate] = useState(11.5);
  const [formStatus, setFormStatus] = useState<'FORM' | 'LOADING' | 'SUCCESS'>('FORM');
  const [activeTab, setActiveTab] = useState("overview");
  const [isTabSticky, setIsTabSticky] = useState(false);
  const [expandedDoc, setExpandedDoc] = useState<string | null>(null);
  const [partnersVisible, setPartnersVisible] = useState(3);
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

  const showMoreOffers = () => {
    setPartnersVisible((prev) => Math.min(bankOffers.length, prev + 2));
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

  const getFillPercentage = (value: number, min: number, max: number): string => {
    const numValue = Number(value);
    const numMin = Number(min);
    const numMax = Number(max);

    if (numMax === numMin) return '0%';
    
    const percentage = ((numValue - numMin) / (numMax - numMin)) * 100;
    
    return `${Math.max(0, Math.min(100, percentage))}%`;
};

  // Scroll to the hero form and highlight fields
  const scrollToForm = () => {
    const el = document.getElementById('loan-application-form');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      setTimeout(highlightFormFields, 200);
    }
  };

  const highlightFormFields = () => {
    const fields = document.querySelectorAll('#loan-application-form input, #loan-application-form select');
    fields.forEach((f) => {
      (f as HTMLElement).classList.add('ring-2', 'ring-offset-2', 'ring-[#1e3a8a]');
    });
    setTimeout(() => {
      fields.forEach((f) => {
        (f as HTMLElement).classList.remove('ring-2', 'ring-offset-2', 'ring-[#1e3a8a]');
      });
    }, 2000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormStatus('LOADING');
    setTimeout(() => setFormStatus('SUCCESS'), 1500);
  };

  const bankOffers = [
    {
      bank: "HDFC Bank",
      logo: "/logos/h.png",
      rating: "4.5",
      highlight: "Best Rate",
      interestRate: "10.75% p.a.",
      processingFee: "1% + GST",
      loanAmount: "Up to ₹50 Lakhs",
      features: ["Instant approval", "No collateral", "Flexible tenure"]
    },
    {
      bank: "ICICI Bank",
      logo: "/logos/i.png",
      rating: "4.3",
      highlight: "Fast Disbursal",
      interestRate: "11.25% p.a.",
      processingFee: "1.5% + GST",
      loanAmount: "Up to ₹75 Lakhs",
      features: ["Quick processing", "Minimal docs", "Online application"]
    },
    {
      bank: "SBI",
      logo: "/logos/s.png",
      rating: "4.2",
      highlight: "",
      interestRate: "11.00% p.a.",
      processingFee: "0.5% + GST",
      loanAmount: "Up to ₹1 Crore",
      features: ["Low processing fee", "High loan amount", "Easy EMI"]
    },
    {
      bank: "Axis Bank",
      logo: "/logos/A.png",
      rating: "4.1",
      highlight: "",
      interestRate: "12.00% p.a.",
      processingFee: "1% + GST",
      loanAmount: "Up to ₹40 Lakhs",
      features: ["Digital process", "No hidden charges", "24hr support"]
    }
  ];

  const businessUseCases = [
    { emoji: "🏭", title: "Working Capital", description: "Fund daily operations" },
    { emoji: "🔧", title: "Equipment Purchase", description: "Buy machinery & tools" },
    { emoji: "🏢", title: "Office Expansion", description: "Expand your workspace" },
    { emoji: "📦", title: "Inventory", description: "Stock up inventory" },
    { emoji: "💻", title: "Technology", description: "Upgrade tech stack" },
    { emoji: "📈", title: "Marketing", description: "Grow your business" }
  ];

  // Business loan eligibility criteria
  const eligibilityCriteria = [
    { criteria: "Business Vintage", requirement: "Minimum 2 years in operation", icon: "🏢" },
    { criteria: "Annual Turnover", requirement: "Minimum ₹10 lakhs per annum", icon: "📊" },
    { criteria: "Business Type", requirement: "Proprietorship, Partnership, Pvt Ltd, LLP", icon: "📋" },
    { criteria: "Credit Score", requirement: "650+ for better rates", icon: "⭐" },
    { criteria: "Age of Applicant", requirement: "21-65 years", icon: "👤" },
    { criteria: "ITR Filing", requirement: "Last 2 years ITR filed", icon: "📄" }
  ];

  // Required documents for business loans
  const requiredDocs = [
    {
      category: "Business Registration Documents",
      icon: "🏢",
      docs: [
        "Certificate of Incorporation",
        "Memorandum & Articles of Association",
        "Partnership Deed (for partnerships)",
        "GST Registration Certificate",
        "Trade License",
        "Shop & Establishment License"
      ]
    },
    {
      category: "Financial Documents",
      icon: "📊",
      docs: [
        "Audited Financial Statements (last 2-3 years)",
        "Profit & Loss Statement",
        "Balance Sheet",
        "Cash Flow Statement",
        "Income Tax Returns (last 2-3 years)",
        "GST Returns (last 12 months)"
      ]
    },
    {
      category: "Identity & Address Proof",
      icon: "📄",
      docs: [
        "Aadhaar Card of Directors/Partners",
        "PAN Card of Business & Directors",
        "Passport/Voter ID/Driving License",
        "Utility Bills (Electricity/Water/Gas)",
        "Rent Agreement (if rented premises)",
        "Property Documents (if owned)"
      ]
    },
    {
      category: "Business Proof Documents",
      icon: "💼",
      docs: [
        "Bank Statements (last 12 months)",
        "Business Plan & Project Report",
        "Existing Loan Details (if any)",
        "Collateral Documents (if applicable)",
        "Board Resolution for Loan",
        "KYC of Directors/Partners"
      ]
    }
  ];

  // Processing fees for business loans
  const processingFees = [
    { particular: "Processing Fees", charges: "1% to 3% of loan amount + GST" },
    { particular: "Documentation Charges", charges: "₹2,000 to ₹10,000 + GST" },
    { particular: "Legal & Technical Charges", charges: "0.5% to 1% of loan amount" },
    { particular: "Prepayment Charges", charges: "2% to 4% of outstanding amount" },
    { particular: "Penal Interest", charges: "2% to 3% per month on overdue amount" },
    { particular: "Cheque Bounce Charges", charges: "₹500 to ₹1,000 per instance" },
    { particular: "Statement Charges", charges: "₹100 to ₹500 per statement" }
  ];

  // Business loan FAQs
  const faqs = [
    {
      question: "What is the minimum business vintage required for a business loan?",
      answer: "Most lenders require a minimum business vintage of 2-3 years. However, some NBFCs may consider businesses with 1 year of operations for smaller loan amounts."
    },
    {
      question: "Can I get a business loan without collateral?",
      answer: "Yes, unsecured business loans are available up to ₹75 lakhs without any collateral. For higher amounts, lenders may require collateral or personal guarantee."
    },
    {
      question: "What documents are required for business loan approval?",
      answer: "Key documents include business registration certificates, ITR for last 2 years, bank statements, GST returns, financial statements, and identity/address proof of promoters."
    },
    {
      question: "How is the interest rate determined for business loans?",
      answer: "Interest rates depend on factors like business vintage, turnover, credit score, industry type, loan amount, and your relationship with the lender."
    },
    {
      question: "Can I prepay my business loan?",
      answer: "Yes, most lenders allow prepayment of business loans. However, prepayment charges of 2-4% of the outstanding amount may apply depending on the lender's terms."
    },
    {
      question: "What is the maximum loan amount I can get?",
      answer: "Business loan amounts typically range from ₹1 lakh to ₹5 crores, depending on your business turnover, credit profile, and lender policies."
    }
  ];

  /* ─── Section heading font class ─── */
  const headingFont = "font-['Power_Grotesk',_'DM_Sans',_sans-serif]";
  const bodyFont = "font-['DM_Sans',_sans-serif]";

  return (
    <div className="min-h-screen bg-white">
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
              <span className="text-gray-600">Business Loan</span>
            </nav>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start pb-14">
            {/* Left Content */}
            <div className="space-y-6">
              <h1 className={`text-4xl lg:text-5xl xl:text-[56px] font-normal text-gray-900 leading-[1.15] tracking-tight ${headingFont}`}>
                Check Business<br />Loan Offers Online
              </h1>
              <p className={`text-base lg:text-lg text-gray-600 leading-relaxed max-w-lg ${bodyFont} font-medium`}>
                Get a business loan of up to Rs 1 crore at an interest rate starting from 8.2% p.a. for the
                tenures of up to 4 years. Quick approval with minimal documentation from 50+ partner lenders.
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
                          <option value="default" disabled hidden>Business Type</option>
                          <option value="proprietorship">Proprietorship</option>
                          <option value="partnership">Partnership</option>
                          <option value="pvt-ltd">Private Limited</option>
                          <option value="llp">LLP</option>
                        </select>
                      </div>
                      <div>
                        <select
                          className={`w-full h-11 px-3 border border-gray-200 focus:border-[#0050B2] rounded-md text-sm text-gray-500 outline-none ${bodyFont}`}
                          defaultValue="default"
                        >
                          <option value="default" disabled hidden>Annual Turnover</option>
                          <option value="below-10">Below ₹10 Lakhs</option>
                          <option value="10-50">₹10 – ₹50 Lakhs</option>
                          <option value="50-100">₹50 Lakhs – ₹1 Crore</option>
                          <option value="above-1cr">Above ₹1 Crore</option>
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

      {/* Enhanced Bank Offers Section - Now 2nd position */}
      <section id="overview" className="py-16 bg-white">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="text-center mb-12">
            <h2 className={`text-3xl lg:text-5xl text-[#273240] mb-4 tracking-tight font-normal ${headingFont}`}>
              Best Business Loan Offers
            </h2>
            <p className={`text-lg text-gray-500 font-medium ${bodyFont}`}>
              Compare and choose from top business lenders
            </p>
          </div>

          <div className="flex items-stretch gap-7 overflow-x-auto pb-4 px-2">
            {bankOffers.map((offer, index) => (
              <Card key={index} className="min-w-[294px] w-[294px] bg-[#f5f9ff] border-[#e1e1e1] flex-shrink-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardContent className="p-6 flex flex-col h-full">
                  {/* Bank Logo */}
                  <div className="flex justify-center mb-4">
                    <div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center shadow-sm border border-gray-100">
                      <img src={offer.logo} alt={`${offer.bank} Logo`} className="w-12 h-12 object-contain" />
                    </div>
                  </div>

                  {/* Bank Name, Rating, Badge */}
                  <div className="text-center mb-4">
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
                  </div>

                  <Separator className="mb-4" />

                  {/* Loan Details */}
                  <div className="space-y-3 mb-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500">Interest Rate</span>
                      <span className="font-bold text-gray-900 text-sm">{offer.interestRate}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500">Processing Fee</span>
                      <span className="font-bold text-gray-900 text-sm">{offer.processingFee}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500">Loan Amount</span>
                      <span className="font-bold text-gray-900 text-sm">{offer.loanAmount}</span>
                    </div>
                  </div>

                  {/* Feature Items */}
                  <div className="space-y-2 mb-6 flex-1">
                    {offer.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <CheckIcon className="w-4 h-4 text-green-600 flex-shrink-0" />
                        <span className="text-sm text-gray-700">{feature}</span>
                      </div>
                    ))}
                  </div>

                  {/* Apply Button */}
                  <Button onClick={() => navigate(ROUTES.APPLICATION)} className="w-full bg-gradient-to-r from-[#0050B2] to-[#003d8a] hover:from-[#003d8a] hover:to-[#002d66] text-white font-semibold py-4 rounded-xl transition-all duration-300 uppercase tracking-wide text-sm">
                    Apply Now
                  </Button>
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
              Business Loan Features &amp; Benefits
            </h2>
            <p className={`text-lg text-gray-500 font-medium ${bodyFont}`}>
              Comprehensive features designed for business growth
            </p>
          </div>
          <div className="relative overflow-hidden" style={{ background: 'linear-gradient(90deg, rgba(246,250,255,1) 0%, rgba(218,235,255,1) 100%)' }}>
            <PerspectiveGrid color="rgba(180,200,230,0.20)" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-0 relative z-10">
            {[
              {
                icon: <ZapIcon className="w-8 h-8" />,
                title: "Quick Processing",
                description: "Get your business loan approved in 24-48 hours with minimal documentation",
                bgColor: "bg-blue-50"
              },
              {
                icon: <TrendingUpIcon className="w-8 h-8" />,
                title: "Competitive Rates",
                description: "Interest rates starting from 11% with flexible repayment options",
                bgColor: "bg-green-50"
              },
              {
                icon: <GlobeIcon className="w-8 h-8" />,
                title: "Multiple Lenders",
                description: "Access to 50+ banks and NBFCs for the best loan offers",
                bgColor: "bg-purple-50"
              },
              {
                icon: <LockIcon className="w-8 h-8" />,
                title: "Flexible Terms",
                description: "Customized loan terms based on your business requirements",
                bgColor: "bg-orange-50"
              }
            ].map((feature, index) => (
              <div
                key={index}
                className={`flex flex-col items-start gap-4 p-8 border border-[#e4e4e4] ${index < 3 ? 'bg-[#eaf3ff]/50' : 'bg-[#f0f7ff]/50'}`}
              >
                <div className="w-12 h-12 flex items-center justify-center bg-transparent rounded">
                  <div className="text-[#0050B2]">
                    {feature.icon}
                  </div>
                </div>
                <h3 className={`text-[#273240] text-2xl lg:text-[32px] font-normal leading-tight ${headingFont}`}>{feature.title}</h3>
                <p className={`text-[#0877ff] text-base font-medium ${bodyFont}`}>{feature.description}</p>
              </div>
            ))}
          </div>
          </div>
        </div>
      </section>

      {/* Business Loan Use Cases - light background to match overview style */}
      <section className="py-16 bg-[#f4f9ff] relative overflow-hidden">
        <div className="container mx-auto max-w-7xl px-6 relative z-10">
          <div className="text-center mb-12">
            <h2 className={`text-3xl lg:text-5xl text-[#273240] mb-4 tracking-tight font-normal ${headingFont}`}>
              How You Can Use Your Business Loan
            </h2>
            <p className={`text-lg text-gray-500 font-medium ${bodyFont}`}>
              Flexible funding for all your business needs
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {businessUseCases.map((useCase, index) => (
              <div
                key={index}
                className="bg-white border border-[#e6eefc] rounded-lg p-6 text-center hover:shadow-lg transition-all duration-300"
              >
                <div className="w-12 h-12 bg-[#f0f7ff] rounded-lg text-[#0050B2] flex items-center justify-center mx-auto mb-3 text-xl">
                  {useCase.emoji}
                </div>
                <h3 className={`font-semibold text-[#0b0b0b] text-sm mb-1 ${bodyFont}`}>
                  {useCase.title}
                </h3>
                <p className={`text-xs text-[#004091] ${bodyFont}`}>
                  {useCase.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced EMI Calculator - Moved before eligibility */}
      <section id="calculator" className="py-20 bg-[#0E396E] relative overflow-hidden">
        <div className="container mx-auto max-w-7xl px-4 relative z-10">
          <div className="text-center mb-16">
            <h2 className={`text-3xl lg:text-5xl text-white mb-4 tracking-tight font-normal ${headingFont}`}>
              Business Loan EMI Calculator
            </h2>
            <p className={`text-lg text-white/70 font-medium ${bodyFont}`}>
              Calculate your monthly EMI and plan your business finances
            </p>
          </div>
          <Card className="max-w-5xl mx-auto shadow-lg border-0 bg-white">
            <CardContent className="p-10 lg:p-12">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
                <div>
                  <label className={`text-sm font-semibold text-gray-700 ${bodyFont} mb-2 block`}>Loan Amount</label>
                  <div className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-center">
                    <span className={`font-bold text-gray-900 text-lg ${bodyFont}`}>₹{(loanAmount/100000).toFixed(1)}L</span>
                  </div>
                  <input type="range" min="100000" max="10000000" step="100000" value={loanAmount}
                    onChange={(e) => setLoanAmount(Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg cursor-pointer slider mt-3"
                    style={{ '--fill-percent': getFillPercentage(loanAmount, 100000, 10000000) } as React.CSSProperties}
                  />
                  <div className={`flex justify-between text-xs text-gray-400 mt-1 ${bodyFont}`}>
                    <span>₹1L</span><span>₹1Cr</span>
                  </div>
                </div>
                <div>
                  <label className={`text-sm font-semibold text-gray-700 ${bodyFont} mb-2 block`}>Tenure</label>
                  <div className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-center">
                    <span className={`font-bold text-gray-900 text-lg ${bodyFont}`}>{tenure} Months</span>
                  </div>
                  <input type="range" min="12" max="120" value={tenure}
                    onChange={(e) => setTenure(Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg cursor-pointer slider mt-3"
                    style={{ '--fill-percent': getFillPercentage(tenure, 12, 120) } as React.CSSProperties}
                  />
                  <div className={`flex justify-between text-xs text-gray-400 mt-1 ${bodyFont}`}>
                    <span>12</span><span>120</span>
                  </div>
                </div>
                <div>
                  <label className={`text-sm font-semibold text-gray-700 ${bodyFont} mb-2 block`}>Interest Rate</label>
                  <div className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-center">
                    <span className={`font-bold text-gray-900 text-lg ${bodyFont}`}>{interestRate}%</span>
                  </div>
                  <input type="range" min="11" max="24" step="0.1" value={interestRate}
                    onChange={(e) => setInterestRate(Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg cursor-pointer slider mt-3"
                    style={{ '--fill-percent': getFillPercentage(interestRate, 11, 24) } as React.CSSProperties}
                  />
                  <div className={`flex justify-between text-xs text-gray-400 mt-1 ${bodyFont}`}>
                    <span>11%</span><span>24%</span>
                  </div>
                </div>
              </div>
              <Separator className="my-6" />
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

      {/* Eligibility Section */}
      <section id="eligibility" className="bg-gradient-to-b from-[#5B9FE9] via-[#2976D8] to-[#0050B2] relative overflow-hidden">
        <TunnelGrid color="rgba(255,255,255,0.18)" />
        <div className="py-20 relative z-10">
          <div className="container mx-auto max-w-7xl px-4">
            <div className="text-center mb-14">
              <h2 className={`text-3xl lg:text-5xl text-white mb-4 tracking-tight font-normal ${headingFont}`}>
                Business Loan Eligibility Criteria
              </h2>
            </div>
            <div className="relative max-w-5xl mx-auto mb-12">
              <div className="absolute inset-0 rounded-3xl bg-white/5 pointer-events-none border border-white/5" />
              <div className="relative grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
                {eligibilityCriteria.map((item, index) => (
                  <div key={index} className="bg-white rounded-2xl p-8 hover:shadow-xl transition-all duration-300">
                    <div className="flex items-start gap-4">
                      <div className="w-14 h-14 flex items-center justify-center bg-blue-100 rounded-lg flex-shrink-0">
                        {item.criteria === "Business Vintage" && <BuildingIcon className="w-6 h-6 text-[#0050B2]" />}
                        {item.criteria === "Annual Turnover" && <TrendingUpIcon className="w-6 h-6 text-[#0050B2]" />}
                        {item.criteria === "Business Type" && <UsersIcon className="w-6 h-6 text-[#0050B2]" />}
                        {item.criteria === "Credit Score" && <BarChart3Icon className="w-6 h-6 text-[#0050B2]" />}
                        {item.criteria === "Age of Applicant" && <UserIcon className="w-6 h-6 text-[#0050B2]" />}
                        {item.criteria === "ITR Filing" && <FileTextIcon className="w-6 h-6 text-[#0050B2]" />}
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
                { step: "02", title: "Submit Application" },
                { step: "03", title: "Document Upload" },
                { step: "04", title: "Instant Approval" }
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
              Documents Required for Business Loan
            </h2>
            <p className={`text-lg text-gray-500 font-medium ${bodyFont}`}>
              Applicants usually require the following documents for processing business loan applications.
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

      {/* Processing Fees Section */}
      <section id="fees" className="py-20 bg-[#0E1A3A] relative overflow-hidden">
        <TunnelGrid color="rgba(100,150,220,0.22)" />
        <div className="container mx-auto max-w-7xl px-4 relative z-10">
          <div className="mb-20">
            <div className="text-center mb-16">
              <h2 className={`text-3xl lg:text-5xl text-white mb-4 tracking-tight font-normal ${headingFont}`}>
                Business Loan Processing Fees and Charges
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

      {/* Testimonials Section */}
      <section className="bg-gradient-to-b from-[#5B9FE9] to-[#4B8FD9] relative overflow-hidden">
        <TunnelGrid color="rgba(255,255,255,0.18)" />
        <div className="py-20">
          <div className="container mx-auto max-w-7xl px-4 relative z-10">
            <div className="text-center mb-14">
              <h2 className={`text-3xl lg:text-5xl text-white mb-4 tracking-tight font-normal ${headingFont}`}>
                What Our Customers Say
              </h2>
              <p className={`text-lg text-white/80 max-w-2xl mx-auto font-medium ${bodyFont}`}>
                See how Accrefin has helped thousands of customers achieve their financial goals
              </p>
            </div>

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

        <div className="bg-[#0050B2] relative z-10">
          <div className="container mx-auto max-w-7xl px-4">
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
        </div>
      </section>

      {/* Enhanced Blog Section - Moved before FAQs */}
      <section className="py-16 bg-white">
        <div className="container mx-auto max-w-7xl px-4">
          {/* Section Header */}
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Learn & Grow with Expert Financial Insights
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Stay informed with the latest financial insights, tips, and market trends
            </p>
          </div>

          {/* Blog Posts Grid */}
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
                summary: "Complete analysis to help you decide between buying and renting a home.",
                readTime: "8 min read",
                category: "Home Loans"
              },
              {
                thumbnail: "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=400&h=250&fit=crop",
                title: "Business Loan Guide for Startups",
                summary: "Everything you need to know about securing funding for your startup.",
                readTime: "6 min read",
                category: "Business"
              }
            ].map((post, index) => (
              <Card 
                key={index}
                className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-0 bg-white overflow-hidden"
              >
                <div className="relative overflow-hidden">
                  <img
                    src={post.thumbnail}
                    alt={post.title}
                    className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="bg-[#0050B2] text-white px-3 py-1 rounded-full text-xs font-semibold">
                      {post.category}
                    </span>
                  </div>
                </div>

                <CardContent className="p-6">
                  <div className="space-y-4">
                    {/* Title */}
                    <h3 className="text-xl font-bold text-gray-900 leading-tight group-hover:text-[#0050B2] transition-colors duration-300">
                      {post.title}
                    </h3>

                    {/* Summary */}
                    <p className="text-gray-600 leading-relaxed">
                      {post.summary}
                    </p>

                    {/* Meta Info */}
                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <span className="text-sm text-gray-500">{post.readTime}</span>
                      <a
                        href="https://www.cicd-training.com/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#0050B2] hover:text-[#003d8a] hover:bg-blue-50 p-2 text-sm font-semibold inline-flex items-center"
                      >
                        Read More →
                      </a>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced FAQs Section */}
            <section id="faqs" className="py-16 bg-[#0e396d] relative overflow-hidden">
        <TunnelGrid color="rgba(255,255,255,0.18)" />
        <div className="container mx-auto max-w-7xl px-4 relative z-10">
          <div className="text-center mb-12">
            <h2 className={`text-3xl lg:text-5xl text-white mb-4 tracking-tight font-normal ${headingFont}`}>
              Frequently Asked<br />Questions
            </h2>
            <p className={`text-lg text-white/60 font-medium ${bodyFont}`}>
              Get answers to common questions about business loans
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