import React, { useState, useEffect } from "react";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { CheckIcon, StarIcon, PhoneIcon, MailIcon, ChevronDownIcon, ChevronUpIcon } from "lucide-react";

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
  const rings = [0.95, 0.82, 0.68, 0.54, 0.40, wallT].map(t => ({ x: vx - vx * t, y: vy - vy * t, w: W * t, h: H * t }));
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

export const PartnerWithUsPage = (): JSX.Element => {
  const headingFont = "font-['Power_Grotesk',_'DM_Sans',_sans-serif]";
  const bodyFont = "font-['DM_Sans',_sans-serif]";

  const [activeTab, setActiveTab] = useState("overview");
  const [isTabSticky, setIsTabSticky] = useState(false);
  const [expandedFaq, setExpandedFaq] = useState<string | null>(null);
  const [profession, setProfession] = useState("");
  const [formStatus, setFormStatus] = useState<'FORM' | 'LOADING' | 'SUCCESS'>('FORM');

  useEffect(() => {
    const handleScroll = () => {
      const heroSection = document.getElementById('hero-section');
      if (heroSection) {
        const heroBottom = heroSection.offsetTop + heroSection.offsetHeight;
        setIsTabSticky(window.scrollY > heroBottom - 100);
      }
      const sections = ['overview', 'eligibility', 'documents', 'commission', 'faqs'];
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
      const elementPosition = element.offsetTop - offset;
      window.scrollTo({ top: elementPosition, behavior: 'smooth' });
    }
  };

  const highlightFormFields = () => {
    const fields = document.querySelectorAll('#partner-application-form input, #partner-application-form select');
    fields.forEach((field) => {
      (field as HTMLElement).classList.add('ring-2', 'ring-white/60', 'transition', 'duration-300');
      setTimeout(() => {
        (field as HTMLElement).classList.remove('ring-2', 'ring-white/60');
      }, 2000);
    });
  };

  const scrollToForm = () => {
    const element = document.getElementById('partner-application-form');
    if (element) {
      const offset = 100;
      const elementPosition = element.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top: elementPosition, behavior: 'smooth' });
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

  const tabItems = [
    { id: "overview", label: "Overview" },
    { id: "eligibility", label: "Eligibility" },
    { id: "documents", label: "Documents" },
    { id: "commission", label: "Commission" },
    { id: "faqs", label: "FAQs" }
  ];

  const partnerFeatures = [
    { icon: "🏦", title: "300+ Lenders", description: "Access to top banks & NBFCs in one dashboard" },
    { icon: "💰", title: "High Commissions", description: "Industry-best payouts for every loan disbursed" },
    { icon: "📱", title: "Smart Tools", description: "Digital dashboard, EMI calculator, lead tracker" },
    { icon: "👨‍💻", title: "Dedicated Support", description: "Onboarding, training, and backend assistance" }
  ];

  const eligibilityGroups = [
    {
      title: "Who Can Join",
      items: ["Loan Agents", "Chartered Accountants", "Builders & Real Estate Professionals", "Freelancers / Retired Bankers"]
    },
    {
      title: "Benefits",
      items: ["No Investment Required", "Flexible Hours", "Earn from Day One", "Work From Anywhere"]
    }
  ];

  const partnerJourneySteps = [
    { step: "1", title: "Register", description: "Fill basic form" },
    { step: "2", title: "Upload Docs", description: "PAN, Aadhaar, Bank Statement" },
    { step: "3", title: "Verify", description: "KYC & onboarding call" },
    { step: "4", title: "Start Earning", description: "Track commissions live" }
  ];

  const requiredDocuments = [
    { icon: "🆔", title: "Aadhaar Card", description: "Identity and address verification" },
    { icon: "🧾", title: "PAN Card", description: "Tax identification for commission payouts" },
    { icon: "🏦", title: "Bank Account Proof", description: "For commission transfers" }
  ];

  const commissionStructure = [
    { loanType: "Personal Loan", commission: "1.5% to 2.5%", example: "₹15,000 - ₹25,000 on ₹10L loan" },
    { loanType: "Business Loan", commission: "Up to ₹50,000", example: "Based on loan amount and tenure" },
    { loanType: "Loan Against Property", commission: "Up to ₹1L", example: "For high-value property loans" }
  ];

  const faqs = [
    {
      question: "Who can become a DSA?",
      answer: "Anyone can become a DSA partner with Accrefin. We welcome loan agents, CAs, real estate professionals, freelancers, retired bankers, and individuals looking for additional income. There are no educational qualifications required, though basic financial knowledge is helpful."
    },
    {
      question: "How fast can I get started?",
      answer: "The onboarding process typically takes 2-3 business days. Once you submit your application with the required documents, our team will verify your details, conduct a brief onboarding call, and activate your partner account. You can start referring clients immediately after approval."
    },
    {
      question: "Are there any hidden fees?",
      answer: "No, there are absolutely no hidden fees or investment required to become an Accrefin partner. The partnership is completely free to join. We believe in transparent relationships and only earn when you earn through successful loan disbursals."
    },
    {
      question: "When will I get paid?",
      answer: "Commissions are processed twice a month — on the 15th and 30th. Once a loan is disbursed, the commission is calculated and added to your next payout cycle. All payments are made directly to your registered bank account via NEFT/RTGS/IMPS."
    },
    {
      question: "What kind of support do I receive?",
      answer: "We provide comprehensive support including dedicated relationship managers, regular training sessions, marketing materials, digital tools for lead management, and a partner helpdesk. You'll also get access to our partner app to track applications, commissions, and manage your business on the go."
    }
  ];

  const testimonials = [
    {
      name: "Rajesh Kumar",
      location: "Delhi",
      profession: "Financial Advisor",
      photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
      testimonial: "Partnering with Accrefin has transformed my business. The digital tools and wide range of loan products help me serve clients better.",
      earnings: "₹45,000/month"
    },
    {
      name: "Priya Sharma",
      location: "Mumbai",
      profession: "Real Estate Agent",
      photo: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
      testimonial: "As a real estate agent, offering financing options through Accrefin has helped me close more property deals. The commission structure is excellent!",
      earnings: "₹60,000/month"
    },
    {
      name: "Amit Patel",
      location: "Ahmedabad",
      profession: "Chartered Accountant",
      photo: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&h=150&fit=crop&crop=face",
      testimonial: "The partner dashboard makes tracking applications and commissions effortless. My clients appreciate the quick loan approvals.",
      earnings: "₹35,000/month"
    }
  ];

  const trustStats = [
    { value: "30%+", label: "Commission on referrals" },
    { value: "₹500Cr+", label: "Loans processed monthly" },
    { value: "1000+", label: "Partners Across India" },
    { value: "Instant", label: "Payouts — Real-time earnings" },
  ];

  return (
    <div className={`min-h-screen bg-white ${bodyFont}`}>

      {/* Hero Section */}
      <section id="hero-section" className="bg-white relative overflow-hidden py-20">
        <RoomGrid />
        <div className="container mx-auto max-w-7xl px-4 relative z-10">
          {/* Shield Badge */}
          <div className="flex justify-center mb-6">
            <div className="flex items-center gap-2 bg-[#f0f6ff] border border-[#c7deff] rounded-full px-5 py-2">
              <svg className="w-4 h-4 text-[#0877ff]" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 1.944A11.954 11.954 0 012.166 5C2.056 5.649 2 6.318 2 7c0 5.225 3.34 9.67 8 11.317C14.66 16.67 18 12.225 18 7c0-.682-.057-1.35-.166-2.001A11.954 11.954 0 0110 1.944zM11 14a1 1 0 11-2 0 1 1 0 012 0zm0-7a1 1 0 10-2 0v3a1 1 0 102 0V7z" clipRule="evenodd" />
              </svg>
              <span className="text-[#0050B2] text-sm font-semibold">India's most trusted platform</span>
            </div>
          </div>

          {/* Breadcrumb */}
          <div className="flex justify-center mb-6">
            <nav className="flex items-center space-x-2 text-sm">
              <a href="/" className="text-[#0877ff] hover:text-[#0050B2] transition-colors">Home</a>
              <span className="text-gray-400">/</span>
              <span className="text-gray-500">Partner With Us</span>
            </nav>
          </div>

          {/* Title */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center pb-14">
            <div>
              <h1 className={`${headingFont} text-5xl lg:text-6xl font-bold leading-tight mb-8 text-gray-900`}>
                Partner With Us
                <br />
                <span className="text-[#0877ff]">Grow Your Business</span>
              </h1>
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={scrollToForm}
                  className="bg-[#0877ff] hover:bg-[#0050B2] text-white px-10 py-3 text-base font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  Apply Now
                </button>
                <button
                  onClick={() => scrollToSection('eligibility')}
                  className="border-2 border-[#0877ff] text-[#0877ff] hover:bg-[#0877ff] hover:text-white px-10 py-3 text-base font-semibold rounded-xl transition-all duration-300"
                >
                  Check Eligibility
                </button>
              </div>
            </div>
            <div>
              <p className="text-xl text-gray-500 leading-relaxed">
                Join India's fastest-growing loan ecosystem. Earn commissions, grow your network, and enable access to finance.
              </p>
            </div>
          </div>
        </div>

        {/* Trust Bar */}
        <div className="bg-[#0e396d] mt-16 py-8 relative z-10">
          <div className="container mx-auto max-w-7xl px-4">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 text-center">
              {trustStats.map((stat, i) => (
                <div key={i} className="text-white">
                  <div className={`${headingFont} text-2xl font-bold text-[#5aabff]`}>{stat.value}</div>
                  <div className="text-blue-200 text-sm mt-1">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Sticky Tab Navigation */}
      <div className={`${isTabSticky ? 'fixed top-0 left-0 right-0 z-50 shadow-lg' : 'relative'} bg-white border-b border-gray-200 transition-all duration-300`}>
        <div className="container mx-auto max-w-7xl px-4">
          <div className="flex items-center justify-center py-2 overflow-x-auto">
            <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg min-w-max">
              {tabItems.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => scrollToSection(tab.id)}
                  className={`px-5 py-2.5 text-sm font-medium rounded-lg transition-all duration-300 whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'bg-[#0877ff] text-white shadow-lg'
                      : 'text-gray-600 hover:text-[#0877ff] hover:bg-white'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Why Partner With Us */}
      <section id="overview" className="py-20 bg-[#f4f9ff]">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="text-center mb-14">
            <h2 className={`${headingFont} text-4xl lg:text-5xl font-bold text-gray-900 mb-4`}>
              Why Partner With Us
            </h2>
            <p className={`${bodyFont} text-lg text-gray-500 max-w-xl mx-auto`}>
              Join India's fastest-growing loan distribution network
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {partnerFeatures.map((feature, index) => (
              <div
                key={index}
                className="group bg-white border border-gray-100 rounded-2xl p-8 text-center hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
              >
                <div className="w-14 h-14 bg-[#e8f1ff] rounded-xl flex items-center justify-center mx-auto mb-5 text-2xl group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>
                <h3 className={`${headingFont} text-lg font-bold text-gray-900 mb-3 group-hover:text-[#0877ff] transition-colors duration-300`}>
                  {feature.title}
                </h3>
                <p className={`${bodyFont} text-gray-500 text-sm leading-relaxed`}>{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Eligibility */}
      <section id="eligibility" className="py-20 bg-white">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="text-center mb-14">
            <h2 className={`${headingFont} text-4xl lg:text-5xl font-bold text-gray-900 mb-4`}>
              Anyone Can Become a DSA Partner
            </h2>
            <p className={`${bodyFont} text-lg text-gray-500 max-w-xl mx-auto`}>
              No matter your background, you can start earning with Accrefin
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {eligibilityGroups.map((group, groupIndex) => (
              <div key={groupIndex} className="bg-[#f4f9ff] border border-[#daeaff] rounded-2xl p-8">
                <h3 className={`${headingFont} text-xl font-bold text-gray-900 mb-6`}>{group.title}</h3>
                <div className="space-y-4">
                  {group.items.map((item, itemIndex) => (
                    <div key={itemIndex} className="flex items-center gap-3">
                      <div className="w-6 h-6 bg-[#0877ff] rounded-full flex items-center justify-center flex-shrink-0">
                        <CheckIcon className="w-3.5 h-3.5 text-white" />
                      </div>
                      <span className={`${bodyFont} text-gray-700 font-medium`}>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-[#0E396E] relative overflow-hidden">
        <TunnelGrid />
        <div className="container mx-auto max-w-7xl px-4 relative z-10">
          <div className="text-center mb-14">
            <h2 className={`${headingFont} text-4xl lg:text-5xl font-bold text-white mb-4`}>
              How It Works
            </h2>
            <p className={`${bodyFont} text-blue-200 text-lg max-w-xl mx-auto`}>
              Your journey to becoming an Accrefin partner is simple
            </p>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-start max-w-5xl mx-auto gap-8 md:gap-0">
            {partnerJourneySteps.map((step, index) => (
              <div key={index} className="relative flex flex-col items-center text-center flex-1">
                {index < partnerJourneySteps.length - 1 && (
                  <div className="hidden md:block absolute top-10 left-1/2 w-full h-px bg-white/20 z-0" />
                )}
                <div className="w-20 h-20 bg-white/15 border-2 border-white/40 rounded-full flex items-center justify-center text-white text-2xl font-bold mb-4 z-10 backdrop-blur-sm">
                  {step.step}
                </div>
                <h3 className={`${headingFont} text-lg font-bold text-white mb-1`}>{step.title}</h3>
                <p className={`${bodyFont} text-blue-200 text-sm`}>{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Documents Required */}
      <section id="documents" className="py-20 bg-[#f4f9ff]">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="text-center mb-14">
            <h2 className={`${headingFont} text-4xl lg:text-5xl font-bold text-gray-900 mb-4`}>
              Documents Required
            </h2>
            <p className={`${bodyFont} text-lg text-gray-500 max-w-xl mx-auto`}>
              Keep these documents ready for quick onboarding
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {requiredDocuments.map((doc, index) => (
              <div
                key={index}
                className="group bg-white border border-gray-100 rounded-2xl p-8 text-center hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
              >
                <div className="text-4xl mb-5 group-hover:scale-110 transition-transform duration-300">{doc.icon}</div>
                <h3 className={`${headingFont} text-xl font-bold text-gray-900 mb-2 group-hover:text-[#0877ff] transition-colors duration-300`}>
                  {doc.title}
                </h3>
                <p className={`${bodyFont} text-gray-500 text-sm leading-relaxed mb-4`}>{doc.description}</p>
                <a href="#" className="text-sm text-[#0877ff] hover:underline font-medium">View Sample</a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Commission & Earnings */}
      <section id="commission" className="py-20 bg-white">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="text-center mb-14">
            <h2 className={`${headingFont} text-4xl lg:text-5xl font-bold text-gray-900 mb-4`}>
              Your Earnings as a Partner
            </h2>
            <p className={`${bodyFont} text-lg text-gray-500 max-w-xl mx-auto`}>
              Competitive commission structure with timely payouts
            </p>
          </div>

          <div className="max-w-5xl mx-auto">
            <div className="rounded-2xl overflow-hidden border border-gray-100 shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-[#0050B2]">
                      <th className={`${headingFont} px-6 py-5 text-left font-semibold text-white`}>Loan Type</th>
                      <th className={`${headingFont} px-6 py-5 text-left font-semibold text-white`}>Commission</th>
                      <th className={`${headingFont} px-6 py-5 text-left font-semibold text-white`}>Example Earnings</th>
                    </tr>
                  </thead>
                  <tbody>
                    {commissionStructure.map((item, index) => (
                      <tr
                        key={index}
                        className={`border-b border-gray-100 hover:bg-[#f4f9ff] transition-colors duration-200 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}`}
                      >
                        <td className={`${bodyFont} px-6 py-5 font-semibold text-gray-900`}>{item.loanType}</td>
                        <td className="px-6 py-5">
                          <span className={`${headingFont} font-bold text-[#0877ff]`}>{item.commission}</span>
                        </td>
                        <td className={`${bodyFont} px-6 py-5 text-gray-600`}>{item.example}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="mt-8 text-center space-y-3">
              <div className="inline-block bg-green-50 border border-green-200 px-6 py-3 rounded-xl">
                <p className="font-semibold text-green-700">No target, No penalty. Earn what you close.</p>
              </div>
              <p className="text-sm text-gray-400">Payouts processed every 15th and 30th of each month.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-[#f4f9ff]">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="text-center mb-14">
            <h2 className={`${headingFont} text-4xl lg:text-5xl font-normal text-gray-900 mb-4`}>
              Success Stories from Our Partners
            </h2>
            <p className={`${bodyFont} text-gray-500 text-lg max-w-xl mx-auto`}>
              Hear from partners who are growing their business with Accrefin
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="bg-white border border-gray-200 rounded-2xl p-8 hover:shadow-lg transition-all duration-300"
              >
                <div className="text-5xl text-[#0050B2]/20 font-serif leading-none mb-4">"</div>
                <p className={`${bodyFont} text-gray-600 leading-relaxed italic mb-6`}>
                  "{testimonial.testimonial}"
                </p>
                <div className="flex items-center gap-4 pt-5 border-t border-gray-100">
                  <img
                    src={testimonial.photo}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover border-2 border-gray-200"
                  />
                  <div>
                    <h4 className={`${headingFont} font-semibold text-gray-900`}>{testimonial.name}</h4>
                    <p className="text-sm text-gray-500">{testimonial.profession}, {testimonial.location}</p>
                    <div className="mt-1 text-sm font-semibold text-[#0877ff]">Avg. Earnings: {testimonial.earnings}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section id="faqs" className="py-20 bg-[#0e396d] relative overflow-hidden">
        <TunnelGrid color="rgba(255,255,255,0.10)" />
        <div className="container mx-auto max-w-4xl px-4 relative z-10">
          <div className="text-center mb-14">
            <h2 className={`${headingFont} text-4xl lg:text-5xl font-bold text-white mb-4`}>
              Frequently Asked Questions
            </h2>
            <p className={`${bodyFont} text-blue-200 text-lg max-w-xl mx-auto`}>
              Get answers to common questions about our partner program
            </p>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl overflow-hidden"
              >
                <button
                  onClick={() => setExpandedFaq(expandedFaq === `faq-${index}` ? null : `faq-${index}`)}
                  className="w-full p-6 text-left flex items-center justify-between hover:bg-white/5 transition-colors duration-200"
                >
                  <h3 className={`${headingFont} text-base font-semibold text-white pr-4`}>{faq.question}</h3>
                  {expandedFaq === `faq-${index}`
                    ? <ChevronUpIcon className="w-5 h-5 text-blue-200 flex-shrink-0" />
                    : <ChevronDownIcon className="w-5 h-5 text-blue-200 flex-shrink-0" />}
                </button>
                {expandedFaq === `faq-${index}` && (
                  <div className="px-6 pb-6 border-t border-white/15">
                    <p className={`${bodyFont} text-blue-100 leading-relaxed mt-4`}>{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Partner Application Form */}
      <section className="py-20 bg-white">
        <div className="container mx-auto max-w-7xl px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div>
              <h2 className={`${headingFont} text-4xl lg:text-5xl font-normal text-gray-900 mb-4`}>
                Join Our Partner Network
              </h2>
              <p className={`${bodyFont} text-gray-500 text-lg leading-relaxed mb-8`}>
                Become a DSA partner and earn industry-leading commissions on every successful loan disbursed through your referrals.
              </p>
              <ul className="space-y-3">
                {["30%+ commission on referrals", "Real-time earnings tracking", "Dedicated partner manager"].map(item => (
                  <li key={item} className="flex items-center gap-3 text-gray-600">
                    <svg className="w-5 h-5 text-[#0877ff] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

          <div id="partner-application-form" className="bg-white border-2 border-gray-200 rounded-2xl p-8 shadow-lg">
            {formStatus === 'FORM' && (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <input
                    placeholder="First Name"
                    className="w-full h-12 px-4 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#0877ff] focus:ring-1 focus:ring-[#0877ff] transition-all"
                  />
                  <input
                    placeholder="Last Name"
                    className="w-full h-12 px-4 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#0877ff] focus:ring-1 focus:ring-[#0877ff] transition-all"
                  />
                </div>
                <input
                  placeholder="Mobile Number"
                  type="tel"
                  className="w-full h-12 px-4 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#0877ff] focus:ring-1 focus:ring-[#0877ff] transition-all"
                />
                <input
                  placeholder="Email Address"
                  type="email"
                  className="w-full h-12 px-4 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#0877ff] focus:ring-1 focus:ring-[#0877ff] transition-all"
                />
                <select
                  className="w-full h-12 px-4 bg-gray-50 border border-gray-200 rounded-xl text-gray-700 focus:outline-none focus:border-[#0877ff] focus:ring-1 focus:ring-[#0877ff] transition-all appearance-none"
                  value={profession}
                  onChange={(e) => setProfession(e.target.value)}
                >
                  <option value="">Select Your Profession</option>
                  <option value="loan-agent">Loan Agent</option>
                  <option value="ca">Chartered Accountant</option>
                  <option value="real-estate">Real Estate Professional</option>
                  <option value="freelancer">Freelancer</option>
                  <option value="retired-banker">Retired Banker</option>
                  <option value="other">Other</option>
                </select>
                <div className="flex items-center gap-2 pt-1">
                  <input type="checkbox" id="terms" className="w-4 h-4 accent-[#0877ff]" />
                  <label htmlFor="terms" className="text-sm text-gray-600">
                    I agree to the <a href="#" className="text-[#0877ff] hover:underline">Terms & Conditions</a>
                  </label>
                </div>
                <button
                  type="submit"
                  className="w-full h-12 bg-[#0877ff] hover:bg-[#0050B2] text-white font-bold rounded-xl transition-all duration-300 shadow-md hover:shadow-lg"
                >
                  Submit Application
                </button>
              </form>
            )}

            {formStatus === 'LOADING' && (
              <div className="flex flex-col items-center justify-center h-64 text-gray-600">
                <svg className="animate-spin h-10 w-10 text-[#0877ff] mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                <p className="text-lg font-semibold">Submitting your application...</p>
              </div>
            )}

            {formStatus === 'SUCCESS' && (
              <div className="flex flex-col items-center justify-center h-64 text-center">
                <svg className="w-14 h-14 text-green-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className={`${headingFont} text-2xl font-normal text-gray-900 mb-2`}>Thank You for Partnering!</h3>
                <p className="text-gray-500 mb-6 max-w-xs">Your application has been received. Our partner manager will contact you within 24 hours.</p>
                <button
                  onClick={() => setFormStatus('FORM')}
                  className="px-6 py-2.5 bg-[#0877ff] text-white font-semibold rounded-xl hover:bg-[#0050B2] transition-all"
                >
                  Register Another
                </button>
              </div>
            )}
          </div>
          </div>
        </div>
      </section>

      {/* Final CTA Banner */}
      <section className="py-16 bg-[#0E396E] relative overflow-hidden border-t border-white/10">
        <TunnelGrid color="rgba(255,255,255,0.08)" />
        <div className="container mx-auto max-w-7xl px-4 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className={`${headingFont} text-3xl lg:text-4xl font-bold text-white mb-4`}>
              Partner with Accrefin & Earn Without Limits
            </h2>
            <p className={`${bodyFont} text-xl text-blue-200 mb-8`}>
              Whether you're a freelancer or business, let us help you grow.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={scrollToForm}
                className="bg-white text-[#0050B2] hover:bg-blue-50 font-semibold px-8 py-3 text-base rounded-xl transition-all duration-300"
              >
                Join Now
              </button>
              <button
                onClick={scrollToForm}
                className="border-2 border-white text-white hover:bg-white hover:text-[#0050B2] font-semibold px-8 py-3 text-base rounded-xl transition-all duration-300"
              >
                Contact Partner Manager
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Partner Support Contact */}
      <section className="py-8 bg-[#0a2d56] border-t border-white/10">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-center md:text-left">
              <h3 className={`${headingFont} text-lg font-bold text-white`}>Partner Support</h3>
              <p className="text-blue-300 text-sm">We're here to help you succeed</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-6">
              <div className="flex items-center gap-2">
                <PhoneIcon className="w-4 h-4 text-[#5aabff]" />
                <span className="font-semibold text-white text-sm">1800-XXX-XXXX</span>
              </div>
              <div className="flex items-center gap-2">
                <MailIcon className="w-4 h-4 text-[#5aabff]" />
                <span className="font-semibold text-white text-sm">partners@accrefin.com</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
