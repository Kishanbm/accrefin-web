import React, { useState, useEffect } from "react";
import { Button } from "../../../components/ui/button";
import { Card, CardContent } from "../../../components/ui/card";
import { Input } from "../../../components/ui/input";
import { Badge } from "../../../components/ui/badge";
import { Separator } from "../../../components/ui/separator";
import { CheckIcon, StarIcon, ShieldIcon, ClockIcon, FileTextIcon, ChevronDownIcon, ChevronUpIcon, TrendingUpIcon, ZapIcon, GlobeIcon, LockIcon, HeartIcon as HeartPulseIcon, Activity } from "lucide-react";

export const LifeInsurancePage = (): JSX.Element => {
  const [sumAssured, setSumAssured] = useState(1000000);
  const [age, setAge] = useState(35);
  const [termYears, setTermYears] = useState(20);
  const [activeTab, setActiveTab] = useState("overview");
  const [isTabSticky, setIsTabSticky] = useState(false);
  const [expandedDoc, setExpandedDoc] = useState<string | null>(null);
  const [formStatus, setFormStatus] = useState<'FORM' | 'LOADING' | 'SUCCESS'>('FORM');
  const [partnersVisible, setPartnersVisible] = useState(3);

  useEffect(() => {
    const handleScroll = () => {
      const heroSection = document.getElementById('hero-section');
      if (heroSection) {
        const heroBottom = heroSection.offsetTop + heroSection.offsetHeight;
        setIsTabSticky(window.scrollY > heroBottom - 100);
      }

      const sections = ['overview', 'features', 'coverage', 'documents', 'calculator', 'comparison', 'faqs'];
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

  const calculatePremium = () => {
    const rate = 0.03; // simplistic annual premium rate
    const premium = sumAssured * rate * (termYears / 10) * (1 + Math.max(0, (age - 30) * 0.01));
    return Math.round(premium);
  };

  const premium = calculatePremium();

  const getFillPercentage = (value: number, min: number, max: number): string => {
    const numValue = Number(value);
    const numMin = Number(min);
    const numMax = Number(max);

    if (numMax === numMin) return '0%';
    const percentage = ((numValue - numMin) / (numMax - numMin)) * 100;
    return `${Math.max(0, Math.min(100, percentage))}%`;
  };

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
    const fields = document.querySelectorAll('#life-insurance-form input, #life-insurance-form select');
    fields.forEach((field) => {
        (field as HTMLElement).classList.add('ring-3', 'ring-black/50', 'transition', 'duration-300');
        setTimeout(() => {
            (field as HTMLElement).classList.remove('ring-3', 'ring-black/50');
        }, 2000);
    });
  };

  const scrollToForm = () => {
    const element = document.getElementById('life-insurance-form');
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
    setTimeout(() => setFormStatus('SUCCESS'), 1500);
  };

  const showMoreOffers = () => {
    setPartnersVisible((prev) => Math.min(lifePlans.length, prev + 2));
  };

  const tabItems = [
    { id: "overview", label: "Overview" },
    { id: "features", label: "Features" },
    { id: "coverage", label: "Coverage" },
    { id: "documents", label: "Documents" },
    { id: "calculator", label: "Premium Calculator" },
    { id: "comparison", label: "Compare Plans" },
    { id: "faqs", label: "FAQs" }
  ];

  const whyAccrefinFeatures = [
    { icon: <ZapIcon className="w-6 h-6" />, title: "Instant Policy Issuance", subtitle: "Quick issuance with minimal paperwork", iconColor: "text-[#0050B2]", bgColor: "bg-blue-50/50" },
    { icon: <TrendingUpIcon className="w-6 h-6" />, title: "Flexible Terms", subtitle: "Term, whole life and ULIPs available", iconColor: "text-[#0050B2]", bgColor: "bg-blue-50/50" },
    { icon: <ShieldIcon className="w-6 h-6" />, title: "Tax Benefits", subtitle: "Get tax savings under Section 80C/10D", iconColor: "text-[#0050B2]", bgColor: "bg-blue-50/50" },
    { icon: <LockIcon className="w-6 h-6" />, title: "Secure Payouts", subtitle: "Immediate payout to nominees", iconColor: "text-[#0050B2]", bgColor: "bg-blue-50/50" }
  ];

  const lifeFeatures = [
    { icon: <ShieldIcon className="w-8 h-8" />, title: "Term Plans", description: "High coverage at low premiums", bgColor: "bg-blue-50" },
    { icon: <Activity className="w-8 h-8" />, title: "Whole Life", description: "Lifetime cover with savings component", bgColor: "bg-green-50" },
    { icon: <CheckIcon className="w-8 h-8" />, title: "Tax Benefits", description: "Deduction under 80C and maturity benefits", bgColor: "bg-purple-50" },
    { icon: <ClockIcon className="w-8 h-8" />, title: "Flexible Terms", description: "Choose tenure suitable for your family", bgColor: "bg-orange-50" }
  ];

  const lifePlans = [
    { provider: "HDFC Life", logo: "/logos/hdfclife.png", cover: "Term Life", premium: "₹8,500/year", features: ["High Cover", "Low Premium"], rating: 4.5, highlight: "Most Popular" },
    { provider: "ICICI Prudential", logo: "/logos/iciciP.png", cover: "Term Life", premium: "₹7,200/year", features: ["Critical Illness"], rating: 4.4, highlight: "Best Value" },
    { provider: "Max Life", logo: "/logos/maxlife.png", cover: "Whole Life", premium: "₹12,500/year", features: ["Savings Component"], rating: 4.3, highlight: "Premium" },
    { provider: "SBI Life", logo: "/logos/sbilife.png", cover: "Term Life", premium: "₹9,000/year", features: ["Flexible Payouts"], rating: 4.2, highlight: "Reliable" },
    { provider: "Kotak Life", logo: "/logos/kotaklife.png", cover: "ULIP", premium: "Varies", features: ["Investment + Cover"], rating: 4.1, highlight: "Investment" }
  ];

  const coverageDetails = [
    { coverage: "Death Benefit", limit: "Sum Assured", icon: "💰" },
    { coverage: "Terminal Illness", limit: "As per policy", icon: "🩺" },
    { coverage: "Maturity Benefit", limit: "If applicable", icon: "📈" },
    { coverage: "Accidental Benefit", limit: "Optional Add-on", icon: "🚑" }
  ];

  const requiredDocs = [
    { category: "Identity Proof", icon: "📄", docs: ["Aadhaar Card", "PAN Card", "Passport"] },
    { category: "Age Proof", icon: "🎂", docs: ["Birth Certificate", "Passport"] },
    { category: "Income Proof", icon: "💳", docs: ["Salary slips", "IT Returns"] },
    { category: "Nominee Details", icon: "👥", docs: ["Nominee Name", "Relation", "KYC"] }
  ];

  const faqs = [
    { question: "What is term insurance?", answer: "Term insurance provides life cover for a specified tenure and pays out the sum assured to the nominee on death." },
    { question: "Are life insurance premiums tax deductible?", answer: "Yes, under Section 80C and certain maturity returns under 10D may be tax-free." }
  ];

  return (
    <div className="min-h-screen bg-white">
      <section id="hero-section" className="bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-16 relative overflow-hidden">
        <div className="container mx-auto max-w-7xl px-4 relative z-10">
          <div className="mb-8">
            <nav className="flex items-center space-x-2 text-sm">
              <a href="/" className="text-blue-600 hover:text-blue-800 transition-colors">Home</a>
              <span className="text-gray-400">/</span>
              <span className="text-gray-600">Life Insurance</span>
            </nav>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div>
                <h1 className="text-4xl lg:text-5xl font-bold leading-tight mb-6">Protect Your Family with <br /><span className="bg-gradient-to-r from-[#0050B2] to-[#003d8a] bg-clip-text text-transparent">Life Insurance</span></h1>
                <p className="text-xl text-gray-600 leading-relaxed mb-8">Flexible term and whole life plans to secure your family's future with tax benefits.</p>
              </div>

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                {lifeFeatures.map((feature, idx) => (
                  <Card key={idx}><CardContent className="p-6 text-center"><div className={`w-14 h-14 ${feature.bgColor} rounded-xl flex items-center justify-center mx-auto mb-4`}>{feature.icon}</div><h3 className="font-bold">{feature.title}</h3><p className="text-sm text-gray-600">{feature.description}</p></CardContent></Card>
                ))}
              </div>

              <div className="text-sm text-gray-500 italic">Last updated: 31 October, 2025</div>
            </div>

            <div className="lg:pl-8">
              <Card id="life-insurance-form" className="bg-white shadow-2xl border border-gray-100 rounded-2xl overflow-hidden max-w-md mx-auto">
                <div className="bg-gradient-to-r from-[#1e3a8a] to-[#1e40af] px-8 py-4"><h3 className="text-xl font-bold text-white text-center">Get Life Insurance Quote</h3></div>
                <CardContent className="p-6">
                  {formStatus === 'FORM' && (
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div><Input placeholder="Full Name" className="h-12 text-base border-2 border-gray-200 rounded-xl bg-gray-50" /></div>
                      <div><Input placeholder="Phone Number" className="h-12 text-base border-2 border-gray-200 rounded-xl bg-gray-50" /></div>
                      <div>
                        <select className="w-full h-12 p-3 border-2 border-gray-200 rounded-xl text-base bg-gray-50"><option>Plan Type</option><option>Term</option><option>Whole Life</option><option>ULIP</option></select>
                      </div>

                      <div className="text-center text-sm text-gray-500">Simple application, instant quotes.</div>
                      <div className="text-xs text-gray-500 leading-relaxed">By submitting this form, you agree to our <a href="#" className="text-blue-600 hover:underline">Terms</a> & <a href="#" className="text-blue-600 hover:underline">Privacy Policy</a></div>
                      <Button type="submit" className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 rounded-xl">Get Quote</Button>
                    </form>
                  )}

                  {formStatus === 'LOADING' && (
                    <div className="flex flex-col items-center justify-center h-64 text-gray-600">
                      <svg className="animate-spin h-10 w-10 text-[#0050B2] mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <p className="text-lg font-semibold">Processing your application...</p>
                    </div>
                  )}
                  {formStatus === 'SUCCESS' && (
                    <div className="flex flex-col items-center justify-center h-64 text-green-700 text-center">
                      <svg className="w-16 h-16 text-green-500 mb-4 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                      </svg>
                      <h3 className="text-2xl font-bold mb-2">Application Received!</h3>
                      <p className="text-gray-600 max-w-xs">Your personalized loan offers will be sent to your phone shortly.</p>
                      <Button onClick={() => setFormStatus('FORM')} className="mt-4 bg-[#0050B2] hover:bg-[#003d8a]">Explore More</Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="mt-16 pt-12 border-t border-gray-200 bg-white rounded-2xl p-8 shadow-lg">
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-center">
              <div className="lg:col-span-1"><div className="flex items-center gap-3 bg-gray-50 rounded-2xl p-4 shadow-md border border-gray-100"><div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center"><svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4" /></svg></div><div><div className="text-sm font-semibold">Trusted</div><div className="text-sm font-bold">Life Coverage</div></div></div></div>

              <div className="lg:col-span-1 text-center"><div className="text-4xl font-bold">4.5<span className="text-2xl text-gray-500">/5</span></div><div className="flex justify-center">{[...Array(4)].map((_,i)=>(<StarIcon key={i} className="w-5 h-5 text-yellow-400"/>))}</div></div>

              <div className="lg:col-span-3 grid grid-cols-3 gap-8"><div className="text-center"><div className="text-3xl font-bold">1M+</div><div className="text-sm text-gray-500 italic">Protected Families</div></div><div className="text-center"><div className="text-3xl font-bold">30+</div><div className="text-sm text-gray-500 italic">Insurer Partners</div></div><div className="text-center"><div className="text-3xl font-bold">99%</div><div className="text-sm text-gray-500 italic">Claim Settlement</div></div></div>
            </div>
          </div>
        </div>
      </section>

      <div className={`${isTabSticky ? 'fixed top-0 left-0 right-0 z-50 shadow-lg' : 'relative'} bg-white border-b border-gray-200 transition-all duration-300`}>
        <div className="container mx-auto max-w-7xl px-4"><div className="flex items-center justify-center"><div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">{tabItems.map((tab)=>(<button key={tab.id} onClick={()=>scrollToSection(tab.id)} className={`px-6 py-3 text-sm font-medium rounded-lg ${activeTab===tab.id? 'bg-[#0050B2] text-white' : 'text-gray-600 hover:text-[#0050B2]'}`}>{tab.label}</button>))}</div></div></div>
      </div>

      <section id="comparison" className="py-16 bg-white">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="text-center mb-12"><h2 className="text-3xl font-bold">Compare Top Life Insurance Plans</h2><p className="text-xl text-gray-600">Select a plan best suited for your family's future</p></div>

          <div className="space-y-6">
            {lifePlans.slice(0, partnersVisible).map((plan, index) => (
              <Card key={index} className="bg-white shadow-lg border border-gray-100"><CardContent className="p-6 text-center"><div className="grid grid-cols-1 lg:grid-cols-6 gap-6 items-center"><div className="flex items-center gap-4"><div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center"><img src={plan.logo} alt={`${plan.provider} Logo`} className="w-10 h-10 object-contain"/></div><div><div className="font-bold text-gray-900">{plan.provider}</div><div className="flex items-center gap-1"><StarIcon className="w-4 h-4 text-yellow-400"/><span className="text-sm text-gray-600">{plan.rating}</span></div>{plan.highlight && (<Badge className="mt-1 bg-green-100 text-green-700 text-xs">{plan.highlight}</Badge>)}</div></div><div className="text-center"><div className="text-sm text-gray-500 mb-1">Type</div><div className="font-bold">{plan.cover}</div></div><div className="text-center"><div className="text-sm text-gray-500 mb-1">Premium</div><div className="font-bold">{plan.premium}</div></div><div className="text-center"><div className="text-sm text-gray-500 mb-1">Benefits</div><div className="font-bold">{plan.features.join(', ')}</div></div><div><Button onClick={scrollToForm} className="w-full bg-gradient-to-r from-[#0050B2] to-[#003d8a] text-white">Get Quote</Button></div></div></CardContent></Card>
            ))}
          </div>

          {partnersVisible < lifePlans.length && (<div className="text-center mt-6"><Button onClick={showMoreOffers} variant="outline" className="border-[#0050B2] text-[#0050B2]">Show More Plans</Button></div>)}
        </div>
      </section>

      <section id="faqs" className="py-16 bg-gray-50"><div className="container mx-auto max-w-4xl px-4"><div className="space-y-4">{faqs.map((faq, index)=>(<Card key={index} className="border border-gray-200"><CardContent className="p-0"><button onClick={()=>setExpandedDoc(expandedDoc===`faq-${index}`?null:`faq-${index}`)} className="w-full p-6 text-left flex items-center justify-between hover:bg-gray-50"><h3 className="text-lg font-semibold text-gray-900 pr-4">{faq.question}</h3>{expandedDoc===`faq-${index}`?(<ChevronUpIcon className="w-5 h-5 text-gray-500"/>):(<ChevronDownIcon className="w-5 h-5 text-gray-500"/> )}</button>{expandedDoc===`faq-${index}`&&(<div className="px-6 pb-6 border-t border-gray-100"><p className="text-gray-700 mt-4">{faq.answer}</p></div>)}</CardContent></Card>))}</div></div></section>

    </div>
  );
};
