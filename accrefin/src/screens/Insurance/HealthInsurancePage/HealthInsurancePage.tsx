import React, { useState, useEffect } from "react";
import { Button } from "../../../components/ui/button";
import { Card, CardContent } from "../../../components/ui/card";
import { Input } from "../../../components/ui/input";
import { Badge } from "../../../components/ui/badge";
import { Separator } from "../../../components/ui/separator";
import { CheckIcon, PlayIcon, StarIcon, UserIcon, ShieldIcon, ClockIcon, FileTextIcon, CreditCardIcon, HeartIcon as HeartPulseIcon, ChevronDownIcon, ChevronUpIcon, TrendingUpIcon, ZapIcon, GlobeIcon, LockIcon, HomeIcon, MapPinIcon, CalculatorIcon, CreditCard, Users, Activity } from "lucide-react";

export const HealthInsurancePage = (): JSX.Element => {
  const [coverAmount, setCoverAmount] = useState(500000);
  const [age, setAge] = useState(30);
  const [members, setMembers] = useState(1);
  const [activeTab, setActiveTab] = useState("overview");
  const [isTabSticky, setIsTabSticky] = useState(false);
  const [expandedDoc, setExpandedDoc] = useState<string | null>(null);
  const [formStatus, setFormStatus] = useState<'FORM' | 'LOADING' | 'SUCCESS'>('FORM'); // ⭐️ NEW: Form Status
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
    const basePremium = coverAmount * 0.025;
    const ageMultiplier = 1 + (age - 30) * 0.015;
    const memberMultiplier = 0.7 + (members * 0.3);
    const premium = basePremium * ageMultiplier * memberMultiplier;
    return Math.round(premium);
  };

  const premium = calculatePremium();
  const taxBenefit = Math.min(premium, age >= 60 ? 50000 : 25000);

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
      window.scrollTo({
        top: elementPosition,
        behavior: 'smooth'
      });
    }
  };

  const highlightFormFields = () => {
    const fields = document.querySelectorAll('#insurance-form input, #insurance-form select'); // Target the new form ID
    fields.forEach((field) => {
        (field as HTMLElement).classList.add('ring-3', 'ring-black/50', 'transition', 'duration-300');
        setTimeout(() => {
            (field as HTMLElement).classList.remove('ring-3', 'ring-black/50');
        }, 2000);
    });
};

  const scrollToForm = () => {
      const element = document.getElementById('insurance-form'); // Target the form ID
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
      }, 1500); // Simulate API delay
  };

  const showMoreOffers = () => {
      // Assuming 5 total partners, increase visible count by 2
      setPartnersVisible((prev) => Math.min(insurancePlans.length, prev + 2)); 
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
    {
      icon: <ZapIcon className="w-6 h-6" />,
      title: "Instant Policy Issuance",
      subtitle: "Get your policy issued in just 5 minutes with zero paperwork",
      iconColor: "text-[#0050B2]",
      bgColor: "bg-blue-50/50"
    },
    {
      icon: <TrendingUpIcon className="w-6 h-6" />,
      title: "Coverage up to ₹1 Crore",
      subtitle: "Comprehensive health coverage for your entire family",
      iconColor: "text-[#0050B2]",
      bgColor: "bg-blue-50/50"
    },
    {
      icon: <ShieldIcon className="w-6 h-6" />,
      title: "Cashless Treatment",
      subtitle: "Access 10,000+ network hospitals across India",
      iconColor: "text-[#0050B2]",
      bgColor: "bg-blue-50/50"
    },
    {
      icon: <LockIcon className="w-6 h-6" />,
      title: "No Claim Bonus",
      subtitle: "Get up to 50% increase in coverage for claim-free years",
      iconColor: "text-[#0050B2]",
      bgColor: "bg-blue-50/50"
    }
  ];

  const healthInsuranceFeatures = [
    {
      icon: <HeartPulseIcon className="w-8 h-8" />,
      title: "Pre & Post Hospitalization",
      description: "Coverage for 60 days pre and 180 days post-hospitalization expenses",
      bgColor: "bg-blue-50"
    },
    {
      icon: <Activity className="w-8 h-8" />,
      title: "Day Care Procedures",
      description: "Coverage for treatments requiring less than 24 hours hospitalization",
      bgColor: "bg-green-50"
    },
    {
      icon: <ShieldIcon className="w-8 h-8" />,
      title: "Critical Illness Cover",
      description: "Additional coverage for 37 critical illnesses including cancer",
      bgColor: "bg-purple-50"
    },
    {
      icon: <CheckIcon className="w-8 h-8" />,
      title: "Tax Benefits",
      description: "Save up to ₹50,000 annually under Section 80D",
      bgColor: "bg-orange-50"
    }
  ];

  const insurancePlans = [
    {
      provider: "HDFC ERGO",
      logo: "/logos/hdfcergo.png",
      sumInsured: "₹5L - ₹1Cr",
      premium: "₹8,500/year",
      coverage: "Comprehensive",
      features: ["Cashless Claims", "Zero Deductible"],
      rating: 4.5,
      highlight: "Most Popular"
    },
    {
      provider: "ICICI Lombard",
      logo: "/logos/iciciLombard.png",
      sumInsured: "₹3L - ₹50L",
      premium: "₹7,200/year",
      coverage: "Essential",
      features: ["Wellness Benefits", "Health Checkups"],
      rating: 4.4,
      highlight: "Best Value"
    },
    {
      provider: "Max Bupa",
      logo: "/logos/maxbupa.png",
      sumInsured: "₹10L - ₹1Cr",
      premium: "₹12,500/year",
      coverage: "Premium",
      features: ["Worldwide Coverage", "AI Health Coach"],
      rating: 4.3,
      highlight: "Premium Choice"
    },
    { provider: "Bajaj Allianz", logo: "/logos/bajajAllianz.png", sumInsured: "₹5L - ₹75L", premium: "₹7,800/year", coverage: "Essential", features: ["Fast Claim"], rating: 4.1, highlight: "Good" },
    { provider: "Star Health", logo: "/logos/starHealth.png", sumInsured: "₹10L - ₹1Cr", premium: "₹9,200/year", coverage: "Comprehensive", features: ["Cashless"], rating: 4.6, highlight: "Top Rated" },
  ];

  const coverageDetails = [
    { coverage: "Hospitalization", limit: "Up to Sum Insured", icon: "🏥" },
    { coverage: "Pre-Hospitalization", limit: "60 days before admission", icon: "📋" },
    { coverage: "Post-Hospitalization", limit: "180 days after discharge", icon: "🩺" },
    { coverage: "Day Care Procedures", limit: "Covered under Sum Insured", icon: "⚕️" },
    { coverage: "Ambulance Charges", limit: "Up to ₹2,000 per hospitalization", icon: "🚑" },
    { coverage: "Room Rent", limit: "Single Private AC Room", icon: "🛏️" }
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
      category: "Age Proof",
      icon: "🎂",
      docs: [
        "Birth Certificate",
        "School Certificate",
        "Passport",
        "PAN Card"
      ]
    },
    {
      category: "Address Proof",
      icon: "🏠",
      docs: [
        "Aadhaar Card",
        "Utility Bills",
        "Bank Statement",
        "Passport",
        "Rental Agreement"
      ]
    },
    {
      category: "Medical Documents",
      icon: "🩺",
      docs: [
        "Medical History (if any)",
        "Pre-existing Disease Reports",
        "Prescription Medications List",
        "Recent Health Checkup Reports"
      ]
    }
  ];

  const faqs = [
    {
      question: "What is the ideal sum insured for health insurance?",
      answer: "The ideal sum insured depends on factors like age, family size, location, and medical history. For metros, we recommend minimum ₹5 lakhs for individuals and ₹10 lakhs for families. Consider higher coverage (₹25-50 lakhs) if you have pre-existing conditions or are planning for senior citizen coverage."
    },
    {
      question: "Can I claim tax benefits on health insurance premiums?",
      answer: "Yes, under Section 80D of the Income Tax Act, you can claim deductions up to ₹25,000 for self, spouse, and children. An additional ₹25,000 can be claimed for parents (₹50,000 if parents are senior citizens). This means a maximum deduction of ₹1 lakh annually."
    },
    {
      question: "What is the waiting period for pre-existing diseases?",
      answer: "Standard health insurance policies have a waiting period of 2-4 years for pre-existing diseases. Initial waiting period is 30 days for most illnesses (excluding accidents). Some policies offer reduced waiting periods at higher premiums."
    },
    {
      question: "How does cashless hospitalization work?",
      answer: "For planned hospitalizations, submit a pre-authorization form to the insurer 48 hours before admission at a network hospital. In emergencies, inform within 24 hours. The hospital directly coordinates with the insurance company for claim settlement, and you don't pay anything except non-covered expenses."
    },
    {
      question: "What is No Claim Bonus in health insurance?",
      answer: "No Claim Bonus (NCB) rewards you for not making claims during a policy year. You can receive an increase in sum insured by 5-50% without additional premium, or a discount on renewal premium. NCB accumulates annually but may be lost if you make a claim."
    },
    {
      question: "Are maternity expenses covered under health insurance?",
      answer: "Maternity coverage is available in most comprehensive health insurance plans after a waiting period of 9-36 months. Coverage typically includes normal and cesarean delivery, pre and post-natal care, and newborn baby expenses up to specified limits."
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <section id="hero-section" className="bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-16 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="hero-grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#0050B2" strokeWidth="1"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#hero-grid)" />
          </svg>
        </div>

        <div className="container mx-auto max-w-7xl px-4 relative z-10">
          <div className="mb-8">
            <nav className="flex items-center space-x-2 text-sm">
              <a href="/" className="text-blue-600 hover:text-blue-800 transition-colors">Home</a>
              <span className="text-gray-400">/</span>
              <span className="text-gray-600">Health Insurance</span>
            </nav>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div>
                <h1 className="text-4xl lg:text-5xl font-bold leading-tight mb-6">
                  <span className="text-gray-900">Protect Your Family's Health with</span>
                  <br />
                  <span className="bg-gradient-to-r from-[#0050B2] to-[#003d8a] bg-clip-text text-transparent">
                    Comprehensive Coverage
                  </span>
                </h1>

                <p className="text-xl text-gray-600 leading-relaxed mb-8">
                  Get instant health insurance starting from ₹15/day. Coverage up to ₹1 Crore
                  with cashless treatment at 10,000+ network hospitals across India.
                </p>
              </div>

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="w-16 h-16 bg-white rounded-2xl shadow-lg flex items-center justify-center mx-auto mb-3 border border-gray-100">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                      <ClockIcon className="w-5 h-5 text-blue-600" />
                    </div>
                  </div>
                  <h3 className="font-semibold text-gray-900 text-sm">Instant Approval</h3>
                  <p className="text-xs text-gray-600 mt-1">Policy in 5 minutes</p>
                </div>

                <div className="text-center">
                  <div className="w-16 h-16 bg-white rounded-2xl shadow-lg flex items-center justify-center mx-auto mb-3 border border-gray-100">
                    <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                      <ShieldIcon className="w-5 h-5 text-green-600" />
                    </div>
                  </div>
                  <h3 className="font-semibold text-gray-900 text-sm">Cashless Claims</h3>
                  <p className="text-xs text-gray-600 mt-1">10,000+ hospitals</p>
                </div>

                <div className="text-center">
                  <div className="w-16 h-16 bg-white rounded-2xl shadow-lg flex items-center justify-center mx-auto mb-3 border border-gray-100">
                    <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                      <span className="text-xl">💰</span>
                    </div>
                  </div>
                  <h3 className="font-semibold text-gray-900 text-sm">Tax Benefits</h3>
                  <p className="text-xs text-gray-600 mt-1">Save up to ₹50K</p>
                </div>

                <div className="text-center">
                  <div className="w-16 h-16 bg-white rounded-2xl shadow-lg flex items-center justify-center mx-auto mb-3 border border-gray-100">
                    <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                      <span className="text-xl">📄</span>
                    </div>
                  </div>
                  <h3 className="font-semibold text-gray-900 text-sm">Zero Paperwork</h3>
                  <p className="text-xs text-gray-600 mt-1">100% digital process</p>
                </div>
              </div>

              <div className="text-sm text-gray-500 italic">
                Last updated: 31 October, 2025
              </div>
            </div>

            <div className="lg:pl-8">
              <Card id="insurance-form" className="bg-white shadow-2xl border border-gray-100 rounded-2xl overflow-hidden max-w-md mx-auto">
                <div className="bg-gradient-to-r from-[#1e3a8a] to-[#1e40af] px-8 py-4">
                  <h3 className="text-xl font-bold text-white text-center">
                    Get <span className="font-normal">Free Health Insurance Quote</span>
                  </h3>
                </div>

                <CardContent className="p-6">
                  {formStatus === 'FORM' && (
                  <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-6">
                    <div>
                      <Input
                        placeholder="Full Name"
                        className="h-12 text-base border-2 border-gray-200 focus:border-[#1e3a8a] rounded-xl bg-gray-50"
                      />
                    </div>

                    <div>
                      <Input
                        placeholder="Phone Number"
                        className="h-12 text-base border-2 border-gray-200 focus:border-[#1e3a8a] rounded-xl bg-gray-50"
                      />
                    </div>

                    <div>
                      <select className="w-full h-12 p-3 border-2 border-gray-200 focus:border-[#1e3a8a] rounded-xl text-base bg-gray-50">
                        <option>Select Age Group</option>
                        <option>18-30 years</option>
                        <option>31-45 years</option>
                        <option>46-60 years</option>
                        <option>Above 60 years</option>
                      </select>
                    </div>

                    <div>
                      <select className="w-full h-12 p-3 border-2 border-gray-200 focus:border-[#1e3a8a] rounded-xl text-base bg-gray-50">
                        <option>Family Members</option>
                        <option>Individual</option>
                        <option>Self + Spouse</option>
                        <option>Self + Spouse + 1 Child</option>
                        <option>Self + Spouse + 2 Children</option>
                        <option>Parents</option>
                      </select>
                    </div>

                    <div className="text-center text-sm text-gray-500">
                      Get instant quotes from top insurers in India
                    </div>

                    <div className="text-xs text-gray-500 leading-relaxed">
                      By submitting this form, you have read and agree to the{" "}
                      <a href="#" className="text-blue-600 hover:underline">Terms of Use</a> &{" "}
                      <a href="#" className="text-blue-600 hover:underline">Privacy Policy</a>
                    </div>

                    <Button className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-3 text-base font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2">
                      Get Free Quote
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </Button>
                  </div>
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
              <div className="lg:col-span-1">
                <div className="flex items-center gap-3 bg-gray-50 rounded-2xl p-4 shadow-md border border-gray-100">
                  <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.2 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-gray-900">India's Most</div>
                    <div className="text-sm font-bold text-gray-900">Trusted Platform</div>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-1 text-center">
                <div className="text-4xl font-bold text-gray-900 mb-1">4.6<span className="text-2xl text-gray-500">/5</span></div>
                <div className="flex justify-center mb-2">
                  {[...Array(5)].map((_, i) => (
                    <StarIcon key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
              </div>

              <div className="lg:col-span-3 grid grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="text-3xl lg:text-4xl font-bold text-gray-900 mb-1">5M+</div>
                  <div className="text-sm text-gray-500 italic">Protected Families</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl lg:text-4xl font-bold text-gray-900 mb-1">25+</div>
                  <div className="text-sm text-gray-500 italic">Insurance Partners</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl lg:text-4xl font-bold text-gray-900 mb-1">98%</div>
                  <div className="text-sm text-gray-500 italic">Claim Settlement</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className={`${isTabSticky ? 'fixed top-0 left-0 right-0 z-50 shadow-lg' : 'relative'} bg-white border-b border-gray-200 transition-all duration-300`}>
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

      <section id="overview" className="py-16 bg-white">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Why Choose Accrefin for Health Insurance?
            </h2>
            <p className="text-xl text-gray-600">
              India's most trusted platform for comprehensive health coverage
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
                    <div className={feature.iconColor}>
                      {feature.icon}
                    </div>
                  </div>

                  <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-[#0050B2] transition-colors duration-300">
                    {feature.title}
                  </h3>

                  <p className="text-gray-600 leading-relaxed text-sm">
                    {feature.subtitle}
                  </p>

                  <div className="mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="w-6 h-0.5 bg-[#0050B2] mx-auto rounded-full"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section id="features" className="py-16 bg-gray-50">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Health Insurance Features & Benefits
            </h2>
            <p className="text-xl text-gray-600">
              Comprehensive coverage designed to protect your family
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {healthInsuranceFeatures.map((feature, index) => (
              <Card
                key={index}
                className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-0 bg-white"
              >
                <CardContent className="p-8 text-center">
                  <div className={`w-16 h-16 ${feature.bgColor} rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <div className="text-gray-700">
                      {feature.icon}
                    </div>
                  </div>

                  <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-[#0050B2] transition-colors duration-300">
                    {feature.title}
                  </h3>

                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section id="coverage" className="py-16 bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="text-center mb-8">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              What's Covered Under Health Insurance
            </h2>
            <p className="text-xl text-gray-600">
              Comprehensive coverage for all your medical needs
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
            <div className="lg:col-span-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {coverageDetails.map((item, index) => (
                  <div
                    key={index}
                    className="group bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 border border-gray-100"
                  >
                    <div className="flex items-start gap-5">
                      <div className="w-12 h-12 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform duration-300">
                        {item.icon}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-gray-900 mb-2 group-hover:text-[#0050B2] transition-colors duration-300 text-base">
                          {item.coverage}
                        </h3>
                        <p className="text-gray-600 text-sm leading-relaxed">
                          {item.limit}
                        </p>
                      </div>
                      <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <CheckIcon className="w-4 h-4 text-green-600" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 sticky top-8">
                <h3 className="text-lg font-bold text-gray-900 mb-4 text-center">
                  Your Coverage Journey
                </h3>

                <div className="space-y-4">
                  {[
                    {
                      step: "1",
                      title: "Choose Plan",
                      desc: "Select coverage based on your family needs"
                    },
                    {
                      step: "2",
                      title: "Fill Details",
                      desc: "Provide health and personal information"
                    },
                    {
                      step: "3",
                      title: "Get Instant Quote",
                      desc: "Compare premiums from multiple insurers"
                    },
                    {
                      step: "4",
                      title: "Policy Issued",
                      desc: "Receive policy within 5 minutes"
                    }
                  ].map((item, index) => (
                    <div key={index} className="flex items-start gap-4 group">
                      <div className="w-8 h-8 bg-[#0050B2] rounded-full flex items-center justify-center text-white font-bold text-sm shadow-md group-hover:scale-110 transition-transform duration-300">
                        {item.step}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 mb-1 group-hover:text-[#0050B2] transition-colors duration-300 text-sm">
                          {item.title}
                        </h4>
                        <p className="text-xs text-gray-600 leading-relaxed">
                          {item.desc}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 pt-4 border-t border-gray-100">
                  <button onClick={scrollToForm} className="w-full bg-gradient-to-r from-[#0050B2] to-[#003d8a] hover:from-[#003d8a] hover:to-[#002d66] text-white font-semibold py-2.5 px-4 rounded-lg transition-all duration-300 hover:shadow-lg text-sm">
                    Get Started Now
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="documents" className="py-16 bg-gradient-to-br from-gray-50 via-blue-50/30 to-gray-50">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="text-center mb-12">
            <div className="inline-block mb-4">
              <Badge className="bg-blue-100 text-blue-700 px-4 py-1.5 text-sm font-semibold">
                Simple & Quick
              </Badge>
            </div>
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Documents Required for Health Insurance
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Keep these documents ready for instant policy issuance. Our digital process makes it effortless.
            </p>
          </div>

          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {requiredDocs.map((doc, index) => (
                <Card
                  key={index}
                  className="group border-0 shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden"
                >
                  <CardContent className="p-0">
                    <div className="p-6 text-center bg-gradient-to-br from-transparent to-blue-50/30">
                      <div className="mb-4 flex justify-center">
                        <div className="w-10 h-10 flex items-center justify-center text-xl bg-blue-100 rounded-lg text-[#0050B2] flex-shrink-0">
                          {doc.icon}
                        </div>
                      </div>
                      <h3 className="text-lg font-bold mb-2 text-gray-900 group-hover:text-[#0050B2] transition-colors duration-300">
                        {doc.category}
                      </h3>
                      <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                        <span>{doc.docs.length} documents</span>
                      </div>
                    </div>

                    <div className="px-6 pb-6 bg-white">
                      <div className="space-y-2">
                        {doc.docs.map((document, idx) => (
                          <div
                            key={idx}
                            className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-100 hover:border-blue-200 hover:bg-blue-50/50 transition-all duration-200 group/item"
                          >
                            <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 group-hover/item:scale-110 transition-transform duration-200">
                              <CheckIcon className="w-4 h-4 text-green-600" />
                            </div>
                            <span className="text-sm text-gray-700 font-medium">{document}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="mt-12 bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
              <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <FileTextIcon className="w-6 h-6 text-[#0050B2]" />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-gray-900 mb-2">Need Help with Documents?</h4>
                    <p className="text-gray-600">
                      Our experts are available 24/7 to help you with document requirements and submission.
                    </p>
                  </div>
                </div>
                <Button onClick={scrollToForm} className="bg-gradient-to-r from-[#0050B2] to-[#003d8a] hover:from-[#003d8a] hover:to-[#002d66] text-white font-semibold px-8 py-3 rounded-xl transition-all duration-300 hover:shadow-lg whitespace-nowrap">
                  Get Assistance
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="calculator" className="py-16 bg-gray-50">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Health Insurance Premium Calculator
            </h2>
            <p className="text-xl text-gray-600">
              Calculate your premium and plan your coverage
            </p>
          </div>

          <Card className="max-w-6xl mx-auto shadow-2xl border-0">
            <CardContent className="p-8 lg:p-12">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                <div className="space-y-8">
                  <div>
                    <div className="flex justify-between items-center mb-4">
                      <label className="text-lg font-semibold text-gray-900">Coverage Amount</label>
                      <div className="bg-[#0050B2] text-white px-4 py-2 rounded-lg font-bold">
                        ₹{(coverAmount/100000).toFixed(1)}L
                      </div>
                    </div>
                    {/* <input
                      type="range"
                      min="100000"
                      max="10000000"
                      step="100000"
                      value={coverAmount}
                      onChange={(e) => setCoverAmount(Number(e.target.value))}
                      className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                    /> */}

                    <input
                        type="range"
                        min="100000"
                        max="10000000"
                        step="100000"
                        value={coverAmount}
                        onChange={(e) => setCoverAmount(Number(e.target.value))}
                        className="w-full h-3 bg-gray-200 rounded-lg cursor-pointer slider"
                        style={{ '--fill-percent': getFillPercentage(coverAmount, 100000, 10000000) } as React.CSSProperties}
                    />
                    <div className="flex justify-between text-sm text-gray-500 mt-2">
                      <span>₹1L</span>
                      <span>₹1Cr</span>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-4">
                      <label className="text-lg font-semibold text-gray-900">Your Age</label>
                      <div className="bg-[#0050B2] text-white px-4 py-2 rounded-lg font-bold">
                        {age} Years
                      </div>
                    </div>
                    {/* <input
                      type="range"
                      min="18"
                      max="70"
                      value={age}
                      onChange={(e) => setAge(Number(e.target.value))}
                      className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                    /> */}

                    <input
                        type="range"
                        min="18"
                        max="70"
                        value={age}
                        onChange={(e) => setAge(Number(e.target.value))}
                        className="w-full h-3 bg-gray-200 rounded-lg cursor-pointer slider"
                        style={{ '--fill-percent': getFillPercentage(age, 18, 70) } as React.CSSProperties}
                    />
                    <div className="flex justify-between text-sm text-gray-500 mt-2">
                      <span>18 Years</span>
                      <span>70 Years</span>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-4">
                      <label className="text-lg font-semibold text-gray-900">Family Members</label>
                      <div className="bg-[#0050B2] text-white px-4 py-2 rounded-lg font-bold">
                        {members} {members === 1 ? 'Member' : 'Members'}
                      </div>
                    </div>
                    {/* <input
                      type="range"
                      min="1"
                      max="6"
                      value={members}
                      onChange={(e) => setMembers(Number(e.target.value))}
                      className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                    /> */}

                    <input
                        type="range"
                        min="1"
                        max="6"
                        value={members}
                        onChange={(e) => setMembers(Number(e.target.value))}
                        className="w-full h-3 bg-gray-200 rounded-lg cursor-pointer slider"
                        style={{ '--fill-percent': getFillPercentage(members, 1, 6) } as React.CSSProperties}
                    />
                    <div className="flex justify-between text-sm text-gray-500 mt-2">
                      <span>1 Member</span>
                      <span>6 Members</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="bg-gradient-to-r from-[#0050B2] to-[#003d8a] rounded-2xl p-8 text-white text-center">
                    <h3 className="text-lg font-semibold mb-2 opacity-90">Annual Premium</h3>
                    <div className="text-4xl font-bold mb-4">
                      ₹{premium.toLocaleString()}
                    </div>
                    <Button onClick={scrollToForm} className="bg-white text-[#0050B2] hover:bg-gray-100 font-semibold px-8 py-3 rounded-xl transition-all duration-300">
                      Get This Plan
                    </Button>
                  </div>

                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                      <span className="text-gray-600">Sum Insured</span>
                      <span className="font-bold text-gray-900">₹{coverAmount.toLocaleString()}</span>
                    </div>

                    <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                      <span className="text-gray-600">Monthly Premium</span>
                      <span className="font-bold text-gray-900">₹{Math.round(premium/12).toLocaleString()}</span>
                    </div>

                    <div className="flex justify-between items-center p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
                      <span className="text-green-700 font-semibold">Tax Benefit u/s 80D</span>
                      <span className="font-bold text-green-700 text-lg">₹{taxBenefit.toLocaleString()}</span>
                    </div>
                  </div>

                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                    <h4 className="font-semibold text-blue-800 mb-2">Coverage Includes</h4>
                    <ul className="text-sm text-blue-700 space-y-1">
                      <li>✓ Pre & Post Hospitalization</li>
                      <li>✓ Cashless Treatment at 10,000+ Hospitals</li>
                      <li>✓ Day Care Procedures</li>
                      <li>✓ No Claim Bonus</li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <section id="comparison" className="py-16 bg-white">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Compare Top Health Insurance Plans
            </h2>
            <p className="text-xl text-gray-600">
              Choose the best plan from leading insurers
            </p>
          </div>

          <div className="space-y-6">
            {insurancePlans.slice(0, partnersVisible).map((plan, index) => (
              <Card key={index} className="bg-white shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100">
                <CardContent className="p-6 text-center">
                  <div className="grid grid-cols-1 lg:grid-cols-6 gap-6 items-center">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                        <img src={plan.logo} alt={`${plan.provider} Logo`} className="w-10 h-10 object-contain" />
                      </div>
                      <div>
                        <div className="font-bold text-gray-900">{plan.provider}</div>
                        <div className="flex items-center gap-1">
                          <StarIcon className="w-4 h-4 text-yellow-400 fill-current" />
                          <span className="text-sm text-gray-600">{plan.rating}</span>
                        </div>
                        {plan.highlight && (
                          <Badge className="mt-1 bg-green-100 text-green-700 text-xs">
                            {plan.highlight}
                          </Badge>
                        )}
                      </div>
                    </div>

                    <div className="text-center">
                      <div className="text-sm text-gray-500 mb-1">Sum Insured</div>
                      <div className="font-bold text-gray-900">{plan.sumInsured}</div>
                    </div>

                    <div className="text-center">
                      <div className="text-sm text-gray-500 mb-1">Premium</div>
                      <div className="font-bold text-gray-900">{plan.premium}</div>
                    </div>

                    <div className="text-center">
                      <div className="text-sm text-gray-500 mb-1">Coverage Type</div>
                      <div className="font-bold text-gray-900">{plan.coverage}</div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {plan.features.map((feature, idx) => (
                        <Badge key={idx} variant="secondary" className="text-xs bg-blue-50 text-blue-700">
                          {feature}
                        </Badge>
                      ))}
                    </div>

                    <div>
                      <Button onClick={scrollToForm} className="w-full bg-gradient-to-r from-[#0050B2] to-[#003d8a] hover:from-[#003d8a] hover:to-[#002d66] text-white font-semibold py-3 rounded-xl transition-all duration-300">
                        View Details
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {partnersVisible < insurancePlans.length && (
            <div className="text-center mt-6">
                <Button onClick={showMoreOffers} variant="outline" className="border-[#0050B2] text-[#0050B2] hover:bg-blue-50 font-semibold">
                    Show More Plans
                </Button>
            </div>
        )}
        </div>
      </section>

      <section id="faqs" className="py-16 bg-gray-50">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-gray-600">
              Get answers to common questions about health insurance
            </p>
          </div>

          <div className="max-w-4xl mx-auto space-y-4">
            {faqs.map((faq, index) => (
              <Card key={index} className="border border-gray-200 hover:shadow-lg transition-shadow duration-300">
                <CardContent className="p-0">
                  <button
                    onClick={() => setExpandedDoc(expandedDoc === `faq-${index}` ? null : `faq-${index}`)}
                    className="w-full p-6 text-left flex items-center justify-between hover:bg-gray-50 transition-colors duration-200"
                  >
                    <h3 className="text-lg font-semibold text-gray-900 pr-4">{faq.question}</h3>
                    {expandedDoc === `faq-${index}` ? (
                      <ChevronUpIcon className="w-5 h-5 text-gray-500 flex-shrink-0" />
                    ) : (
                      <ChevronDownIcon className="w-5 h-5 text-gray-500 flex-shrink-0" />
                    )}
                  </button>

                  {expandedDoc === `faq-${index}` && (
                    <div className="px-6 pb-6 border-t border-gray-100">
                      <p className="text-gray-700 leading-relaxed mt-4">{faq.answer}</p>
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
