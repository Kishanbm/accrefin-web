import React, { useState, useEffect } from "react";
import { Button } from "../../../components/ui/button";
import { Card, CardContent } from "../../../components/ui/card";
import { Input } from "../../../components/ui/input";
import { Badge } from "../../../components/ui/badge";
import { Separator } from "../../../components/ui/separator";
import { CheckIcon, StarIcon, ShieldIcon, ClockIcon, FileTextIcon, ChevronDownIcon, ChevronUpIcon, TrendingUpIcon, ZapIcon, GlobeIcon, LockIcon, HeartIcon as HeartPulseIcon, Activity } from "lucide-react";

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

export const VehicleInsurancePage = (): JSX.Element => {
  const [vehicleValue, setVehicleValue] = useState(500000);
  const [vehicleAge, setVehicleAge] = useState(2);
  const [ownerAge, setOwnerAge] = useState(30);
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
    const base = vehicleValue * 0.02; // base 2% of vehicle value
    const ageMultiplier = 1 + (vehicleAge * 0.05);
    const ownerMultiplier = 1 + Math.max(0, (ownerAge - 25) * 0.01);
    const premium = base * ageMultiplier * ownerMultiplier;
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
    const fields = document.querySelectorAll('#vehicle-insurance-form input, #vehicle-insurance-form select');
    fields.forEach((field) => {
        (field as HTMLElement).classList.add('ring-3', 'ring-black/50', 'transition', 'duration-300');
        setTimeout(() => {
            (field as HTMLElement).classList.remove('ring-3', 'ring-black/50');
        }, 2000);
    });
  };

  const scrollToForm = () => {
    const element = document.getElementById('vehicle-insurance-form');
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
    setPartnersVisible((prev) => Math.min(vehiclePlans.length, prev + 2));
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
    { icon: <ZapIcon className="w-6 h-6" />, title: "Instant Policy Issuance", subtitle: "Get a policy issued quickly with minimal paperwork", iconColor: "text-[#0050B2]", bgColor: "bg-blue-50/50" },
    { icon: <TrendingUpIcon className="w-6 h-6" />, title: "Comprehensive Cover", subtitle: "Zero depreciation and add-on covers available", iconColor: "text-[#0050B2]", bgColor: "bg-blue-50/50" },
    { icon: <ShieldIcon className="w-6 h-6" />, title: "Cashless Network Garages", subtitle: "Wide network for hassle-free claims", iconColor: "text-[#0050B2]", bgColor: "bg-blue-50/50" },
    { icon: <LockIcon className="w-6 h-6" />, title: "Roadside Assistance", subtitle: "24/7 assistance and towing coverage", iconColor: "text-[#0050B2]", bgColor: "bg-blue-50/50" }
  ];

  const vehicleFeatures = [
    { icon: <ShieldIcon className="w-8 h-8" />, title: "Zero Depreciation", description: "Higher claim settlement without depreciation deductions", bgColor: "bg-blue-50" },
    { icon: <Activity className="w-8 h-8" />, title: "Roadside Assistance", description: "Towing and on-spot help for breakdowns", bgColor: "bg-green-50" },
    { icon: <CheckIcon className="w-8 h-8" />, title: "Cashless Garages", description: "Repair at partner garages without upfront payment", bgColor: "bg-purple-50" },
    { icon: <ClockIcon className="w-8 h-8" />, title: "Quick Claim", description: "Fast claim settlement process", bgColor: "bg-orange-50" }
  ];

  const vehiclePlans = [
    { provider: "HDFC ERGO", logo: "/logos/hdfcergo.png", cover: "Comprehensive", premium: "₹9,500/year", features: ["Zero Depreciation", "Roadside Assistance"], rating: 4.5, highlight: "Most Popular" },
    { provider: "ICICI Lombard", logo: "/logos/iciciLombard.png", cover: "Third Party + Own Damage", premium: "₹7,200/year", features: ["Cashless Garages", "Fast Claim"], rating: 4.4, highlight: "Best Value" },
    { provider: "Bajaj Allianz", logo: "/logos/bajajAllianz.png", cover: "Comprehensive", premium: "₹8,200/year", features: ["Add-on Covers"], rating: 4.2, highlight: "Popular" },
    { provider: "Tata AIG", logo: "/logos/tataAig.png", cover: "Comprehensive", premium: "₹9,000/year", features: ["Cashless Garages"], rating: 4.1, highlight: "Reliable" },
    { provider: "Royal Sundaram", logo: "/logos/royal.png", cover: "Comprehensive", premium: "₹8,800/year", features: ["Roadside Assistance"], rating: 4.3, highlight: "Recommended" }
  ];

  const coverageDetails = [
    { coverage: "Own Damage", limit: "As per policy", icon: "🚗" },
    { coverage: "Third Party Liability", limit: "As per Motor Act", icon: "⚖️" },
    { coverage: "Roadside Assistance", limit: "Towing & Help", icon: "🛠️" },
    { coverage: "Zero Depreciation", limit: "If opted", icon: "🧾" }
  ];

  const requiredDocs = [
    { category: "Vehicle Documents", icon: "📄", docs: ["Registration Certificate", "Insurance History", "PUC"] },
    { category: "Owner Documents", icon: "👤", docs: ["Aadhaar", "PAN", "Driving License"] },
    { category: "Proof of Value", icon: "💳", docs: ["Invoice", "RC Book"] },
    { category: "Additional", icon: "🔧", docs: ["Vehicle Photos", "Repair Estimates (if any)"] }
  ];

  const faqs = [
    { question: "Do I need to insure my vehicle?", answer: "Yes, third-party insurance is mandatory under Indian law. Comprehensive cover is recommended for damage to your vehicle as well." },
    { question: "What is zero depreciation?", answer: "Zero depreciation add-on means depreciation amount is not deducted from your claim settlement for parts replaced." }
  ];

  const headingFont = "font-['Power_Grotesk',_'DM_Sans',_sans-serif]";
  const bodyFont = "font-['DM_Sans',_sans-serif]";

  return (
    <div className="min-h-screen bg-white">
      <section id="hero-section" className="bg-white relative overflow-hidden">
        <RoomGrid />
        <div className="container mx-auto max-w-7xl px-4 relative z-10 pt-8">
          <div className="mb-8">
            <nav className={`flex items-center space-x-2 text-sm ${bodyFont}`}>
              <a href="/" className="text-gray-600 hover:text-gray-800 transition-colors">Home</a>
              <span className="text-gray-400">/</span>
              <span className="text-gray-600">Vehicle Insurance</span>
            </nav>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div>
                <h1 className={`text-4xl lg:text-5xl font-normal leading-tight mb-6 text-gray-900 ${headingFont}`}>
                  Protect Your Ride with<br />Vehicle Insurance
                </h1>
                <p className="text-xl text-gray-600 leading-relaxed mb-8">Comprehensive and third-party vehicle insurance with roadside assistance and cashless garage network.</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {vehicleFeatures.map((feature, idx) => (
                  <div key={idx} className="flex items-center gap-3 p-3 bg-white border border-gray-200 rounded-xl">
                    <div className={`w-10 h-10 ${feature.bgColor} rounded-lg flex items-center justify-center flex-shrink-0`}>
                      {feature.icon}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 text-sm leading-tight">{feature.title}</h3>
                      <p className="text-xs text-gray-500 mt-0.5">{feature.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:pl-8">
              <Card id="vehicle-insurance-form" className="bg-white shadow-2xl border border-gray-100 rounded-2xl overflow-hidden max-w-md mx-auto">
                <div className="bg-gradient-to-r from-[#1e3a8a] to-[#1e40af] px-8 py-4">
                  <h3 className="text-xl font-bold text-white text-center">Get Vehicle Insurance Quote</h3>
                </div>

                <CardContent className="p-6">
                  {formStatus === 'FORM' && (
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div>
                        <Input placeholder="Owner Name" className="h-12 text-base border-2 border-gray-200 rounded-xl bg-gray-50" />
                      </div>
                      <div>
                        <Input placeholder="Phone Number" className="h-12 text-base border-2 border-gray-200 rounded-xl bg-gray-50" />
                      </div>

                      <div>
                        <select className="w-full h-12 p-3 border-2 border-gray-200 rounded-xl text-base bg-gray-50">
                          <option>Vehicle Type</option>
                          <option>Car</option>
                          <option>Bike</option>
                          <option>Commercial</option>
                        </select>
                      </div>

                      <div className="text-center text-sm text-gray-500">Don't worry, this will not affect your credit score.</div>

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

        </div>
      </section>
      <div className="bg-[#0e396d] border-t border-white/10">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="flex items-center justify-between flex-wrap lg:flex-nowrap">
            {[
              { title: "Zero Depreciation", desc: "₹0 own damage deduction" },
              { title: "Instant Policy", desc: "Digital issuance" },
              { title: "3500+ Garages", desc: "Cashless repairs" },
              { title: "₹1L+ Saved", desc: "Annual savings" },
            ].map((item, index, arr) => (
              <React.Fragment key={item.title}>
                <div className="flex flex-col items-start gap-4 py-10 px-10 flex-1">
                  <h3 className={`font-normal text-white text-[22px] leading-[1.3] ${headingFont}`}>{item.title}</h3>
                  <p className={`text-[#a0cfff] text-base font-medium leading-[1.3] ${bodyFont}`}>{item.desc}</p>
                </div>
                {index < arr.length - 1 && <div className="hidden lg:block w-px h-[100px] bg-white/15 flex-shrink-0" />}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>

      <div className={`${isTabSticky ? 'fixed top-0 left-0 right-0 z-50 shadow-lg' : 'relative mt-4'} bg-white border-b border-gray-200 transition-all duration-300`}>
        <div className="container mx-auto max-w-7xl px-4">
          <div className="flex items-center justify-center">
            <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
              {tabItems.map((tab) => (
                <button key={tab.id} onClick={() => scrollToSection(tab.id)} className={`px-6 py-3 text-sm font-medium rounded-lg ${activeTab === tab.id ? 'bg-[#0050B2] text-white' : 'text-gray-600 hover:text-[#0050B2]'}`}>{tab.label}</button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <section id="comparison" className="py-16 bg-white">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold">Compare Top Vehicle Insurance Plans</h2>
            <p className="text-xl text-gray-600">Choose the best plan for your vehicle</p>
          </div>

          <div className="space-y-6">
            {vehiclePlans.slice(0, partnersVisible).map((plan, index) => (
              <Card key={index} className="bg-white shadow-lg border border-gray-100">
                <CardContent className="p-6 text-center">
                  <div className="grid grid-cols-1 lg:grid-cols-6 gap-6 items-center">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                        <img src={plan.logo} alt={`${plan.provider} Logo`} className="w-10 h-10 object-contain" />
                      </div>
                      <div>
                        <div className="font-bold text-gray-900">{plan.provider}</div>
                        <div className="flex items-center gap-1"><StarIcon className="w-4 h-4 text-yellow-400" /><span className="text-sm text-gray-600">{plan.rating}</span></div>
                        {plan.highlight && (<Badge className="mt-1 bg-green-100 text-green-700 text-xs">{plan.highlight}</Badge>)}
                      </div>
                    </div>

                    <div className="text-center"><div className="text-sm text-gray-500 mb-1">Cover</div><div className="font-bold">{plan.cover}</div></div>
                    <div className="text-center"><div className="text-sm text-gray-500 mb-1">Premium</div><div className="font-bold">{plan.premium}</div></div>
                    <div className="text-center"><div className="text-sm text-gray-500 mb-1">Type</div><div className="font-bold">{plan.cover}</div></div>

                    <div className="flex flex-wrap gap-2">{plan.features.map((f, i) => (<Badge key={i} className="text-xs bg-blue-50 text-blue-700">{f}</Badge>))}</div>

                    <div><Button onClick={scrollToForm} className="w-full bg-gradient-to-r from-[#0050B2] to-[#003d8a] text-white">Get Quote</Button></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {partnersVisible < vehiclePlans.length && (<div className="text-center mt-6"><Button onClick={showMoreOffers} variant="outline" className="border-[#0050B2] text-[#0050B2]">Show More Plans</Button></div>)}
        </div>
      </section>

      <section id="faqs" className="py-16 bg-gray-50">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="max-w-4xl mx-auto space-y-4">
            {faqs.map((faq, index) => (
              <Card key={index} className="border border-gray-200">
                <CardContent className="p-0">
                  <button onClick={() => setExpandedDoc(expandedDoc === `faq-${index}` ? null : `faq-${index}`)} className="w-full p-6 text-left flex items-center justify-between hover:bg-gray-50">
                    <h3 className="text-lg font-semibold text-gray-900 pr-4">{faq.question}</h3>
                    {expandedDoc === `faq-${index}` ? (<ChevronUpIcon className="w-5 h-5 text-gray-500" />) : (<ChevronDownIcon className="w-5 h-5 text-gray-500" />)}
                  </button>
                  {expandedDoc === `faq-${index}` && (<div className="px-6 pb-6 border-t border-gray-100"><p className="text-gray-700 mt-4">{faq.answer}</p></div>)}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
