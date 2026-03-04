import React, { useState, useEffect } from "react";
import { Button } from "../../../components/ui/button";
import { Card, CardContent } from "../../../components/ui/card";
import { Input } from "../../../components/ui/input";
import { Badge } from "../../../components/ui/badge";
import { Separator } from "../../../components/ui/separator";
import { CheckIcon, StarIcon, UserIcon, ShieldIcon, ClockIcon, FileTextIcon, CreditCardIcon, BanknoteIcon as BanknotesIcon, ChevronDownIcon, ChevronUpIcon, BuildingIcon, UsersIcon, BriefcaseIcon, HandshakeIcon, PercentIcon, BarChartIcon, PhoneIcon, MailIcon } from "lucide-react";

export const PartnerWithUsPage = (): JSX.Element => {
  const [activeTab, setActiveTab] = useState("overview");
  const [isTabSticky, setIsTabSticky] = useState(false);
  const [expandedDoc, setExpandedDoc] = useState<string | null>(null);
  const [expandedFaq, setExpandedFaq] = useState<string | null>(null);
  const [profession, setProfession] = useState("");
  const [formStatus, setFormStatus] = useState<'FORM' | 'LOADING' | 'SUCCESS'>('FORM');
  const [professionInput, setProfessionInput] = useState("");

  // Sticky tab navigation effect
  useEffect(() => {
    const handleScroll = () => {
      const heroSection = document.getElementById('hero-section');
      if (heroSection) {
        const heroBottom = heroSection.offsetTop + heroSection.offsetHeight;
        setIsTabSticky(window.scrollY > heroBottom - 100);
      }

      // Update active tab based on scroll position
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

    const highlightFormFields = () => {
      // Targets the Card element with the ID added below (line 343)
      const fields = document.querySelectorAll('#partner-application-form input, #partner-application-form select'); 
      fields.forEach((field) => {
          (field as HTMLElement).classList.add('ring-3', 'ring-black/50', 'transition', 'duration-300');
          setTimeout(() => {
              (field as HTMLElement).classList.remove('ring-3', 'ring-black/50');
          }, 2000);
      });
  };

  const scrollToForm = () => {
      const element = document.getElementById('partner-application-form'); 
      if (element) {
          const offset = 100;
          const elementPosition = element.getBoundingClientRect().top + window.scrollY - offset;
          window.scrollTo({ top: elementPosition, behavior: 'smooth' });
          setTimeout(highlightFormFields, 500); // Highlight after scroll finishes
      }
  };

  const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      // In a real app, you would send data here
      setFormStatus('LOADING');
      setTimeout(() => {
          setFormStatus('SUCCESS');
      }, 1500); // Simulate API delay
  };

  // Tab navigation items
  const tabItems = [
    { id: "overview", label: "Overview" },
    { id: "eligibility", label: "Eligibility" },
    { id: "documents", label: "Documents" },
    { id: "commission", label: "Commission" },
    { id: "faqs", label: "FAQs" }
  ];

  // Why partner with us features
  const partnerFeatures = [
    {
      icon: "🏦",
      title: "300+ Lenders",
      description: "Access to top banks & NBFCs in one dashboard"
    },
    {
      icon: "💰",
      title: "High Commissions",
      description: "Industry-best payouts for every loan disbursed"
    },
    {
      icon: "📱",
      title: "Smart Tools",
      description: "Digital dashboard, EMI calculator, lead tracker"
    },
    {
      icon: "👨‍💻",
      title: "Dedicated Support",
      description: "Onboarding, training, and backend assistance"
    }
  ];

  // Who can join as a partner
  const eligibilityGroups = [
    {
      title: "Who Can Join",
      items: [
        "Loan Agents",
        "Chartered Accountants",
        "Builders & Real Estate Professionals",
        "Freelancers / Retired Bankers"
      ]
    },
    {
      title: "Benefits",
      items: [
        "No Investment Required",
        "Flexible Hours",
        "Earn from Day One",
        "Work From Anywhere"
      ]
    }
  ];

  // Partner journey steps
  const partnerJourneySteps = [
    {
      step: "1",
      title: "Register",
      description: "Fill basic form"
    },
    {
      step: "2",
      title: "Upload Docs",
      description: "PAN, Aadhaar, Bank Statement"
    },
    {
      step: "3",
      title: "Verify",
      description: "KYC & onboarding call"
    },
    {
      step: "4",
      title: "Start Earning",
      description: "Track commissions live"
    }
  ];

  // Required documents
  const requiredDocuments = [
    {
      icon: "🆔",
      title: "Aadhaar Card",
      description: "Identity and address verification"
    },
    {
      icon: "🧾",
      title: "PAN Card",
      description: "Tax identification for commission payouts"
    },
    {
      icon: "🏦",
      title: "Bank Account Proof",
      description: "For commission transfers"
    }
  ];

  // Commission structure
  const commissionStructure = [
    {
      loanType: "Personal Loan",
      commission: "1.5% to 2.5%",
      example: "₹15,000 - ₹25,000 on ₹10L loan"
    },
    {
      loanType: "Business Loan",
      commission: "Up to ₹50,000",
      example: "Based on loan amount and tenure"
    },
    {
      loanType: "Loan Against Property",
      commission: "Up to ₹1L",
      example: "For high-value property loans"
    }
  ];

  // FAQs
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
      answer: "Commissions are processed twice a month - on the 15th and 30th. Once a loan is disbursed, the commission is calculated and added to your next payout cycle. All payments are made directly to your registered bank account via NEFT/RTGS/IMPS."
    },
    {
      question: "What kind of support do I receive?",
      answer: "We provide comprehensive support including dedicated relationship managers, regular training sessions, marketing materials, digital tools for lead management, and a partner helpdesk. You'll also get access to our partner app to track applications, commissions, and manage your business on the go."
    }
  ];

  // Testimonials
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

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section id="hero-section" className="bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-16 relative overflow-hidden">
        {/* Background Pattern */}
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
        
        {/* Abstract Wave */}
        <div className="absolute bottom-0 left-0 right-0 h-24 overflow-hidden">
          <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="absolute bottom-0 left-0 w-full h-full">
            <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V0C0,0,0,0,0,0Z" fill="#0050B2" fillOpacity="0.1"></path>
          </svg>
        </div>

        <div className="container mx-auto max-w-7xl px-4 relative z-10">
          {/* Breadcrumb */}
          <div className="mb-8">
            <nav className="flex items-center space-x-2 text-sm">
              <a href="/" className="text-blue-600 hover:text-blue-800 transition-colors">Home</a>
              <span className="text-gray-400">/</span>
              <span className="text-gray-600">Partner With Us</span>
            </nav>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-8">
              {/* Trust Badge */}
              <div className="flex items-center gap-3 bg-white/90 backdrop-blur-sm rounded-full px-6 py-3 shadow-lg w-fit border border-blue-100">
                <StarIcon className="w-5 h-5 text-yellow-400 fill-current" />
                <span className="text-gray-700 font-semibold text-sm">Trusted by 300+ Partners Across India</span>
              </div>

              <div>
                <h1 className="text-4xl lg:text-5xl font-bold leading-tight mb-6">
                  <span className="text-gray-900">Become an</span>
                  <br />
                  <span className="bg-gradient-to-r from-[#0050B2] to-[#003d8a] bg-clip-text text-transparent">
                    Accrefin Partner
                  </span>
                </h1>
                
                <p className="text-xl text-gray-600 leading-relaxed mb-8">
                  Join India's fastest-growing loan ecosystem. Earn commissions, grow your network, and enable access to finance.
                </p>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  onClick={scrollToForm}
                  size="lg"
                  className="bg-gradient-to-r from-[#0050B2] to-[#003d8a] hover:from-[#003d8a] hover:to-[#002d66] text-white px-8 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                >
                  Apply Now
                  <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Button>
                
                <Button 
                  onClick={scrollToForm}
                  variant="outline"
                  size="lg"
                  className="border-2 border-[#0050B2] text-[#0050B2] hover:bg-[#0050B2] hover:text-white px-8 py-4 text-lg font-semibold rounded-xl transition-all duration-300"
                >
                  Check Eligibility
                </Button>
              </div>

              {/* Stats */}
              <div className="flex flex-wrap gap-8 pt-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-[#0050B2]">300+</div>
                  <div className="text-sm text-gray-500">Lender Partners</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-[#0050B2]">₹35K+</div>
                  <div className="text-sm text-gray-500">Avg. Monthly Earnings</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-[#0050B2]">24hrs</div>
                  <div className="text-sm text-gray-500">Onboarding Time</div>
                </div>
              </div>
            </div>

            {/* Right Side - Illustration */}
            <div className="flex justify-center lg:justify-end">
              <Card id="partner-application-form" className="bg-white/95 backdrop-blur-sm shadow-2xl border border-white/50 rounded-2xl overflow-hidden max-w-md">
                <CardContent className="p-8">
                  <div className="flex justify-center mb-6">
                    <img 
                      src="https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=600" 
                      alt="Partners shaking hands" 
                      className="w-full h-48 object-cover rounded-xl"
                    />
                  </div>
                  
                  <div className="space-y-6">
                    <div className="text-center">
                      <h3 className="text-2xl font-bold text-gray-900 mb-2">Join Our Partner Network</h3>
                      <p className="text-gray-600">Fill the form below to get started</p>
                    </div>
                    
                    {formStatus === 'FORM' && (
                      <form onSubmit={handleSubmit} className="space-y-4" >
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Input 
                          placeholder="First Name" 
                          className="h-12 text-base border-2 border-gray-200 focus:border-[#0050B2] rounded-xl"
                        />
                      </div>
                      
                      <div>
                        <Input 
                          placeholder="Last Name" 
                          className="h-12 text-base border-2 border-gray-200 focus:border-[#0050B2] rounded-xl"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <Input 
                        placeholder="Mobile Number" 
                        className="h-12 text-base border-2 border-gray-200 focus:border-[#0050B2] rounded-xl"
                      />
                    </div>
                    
                    <div>
                      <Input 
                        placeholder="Email Address" 
                        className="h-12 text-base border-2 border-gray-200 focus:border-[#0050B2] rounded-xl"
                      />
                    </div>
                    
                    <div>
                      <select 
                        className="w-full h-12 p-3 border-2 border-gray-200 focus:border-[#0050B2] rounded-xl text-base"
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
                    </div>

                    <div className="flex items-center gap-2">
                      <input type="checkbox" id="terms" className="w-4 h-4 text-[#0050B2]" />
                      <label htmlFor="terms" className="text-sm text-gray-600">
                        I agree to the <a href="#" className="text-[#0050B2] hover:underline">Terms & Conditions</a>
                      </label>
                    </div>

                    <Button className="w-full bg-gradient-to-r from-[#0050B2] to-[#003d8a] hover:from-[#003d8a] hover:to-[#002d66] text-white py-3 text-base font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
                      Submit Application
                    </Button>
                  </form>
                  )}

                  {formStatus === 'LOADING' && (
                    <div className="flex flex-col items-center justify-center h-96 text-gray-600">
                      <svg className="animate-spin h-10 w-10 text-[#0050B2] mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <p className="text-lg">Submitting your application...</p>
                    </div>
                  )}

                  {formStatus === 'SUCCESS' && (
                    <div className="flex flex-col items-center justify-center h-96 text-green-700 text-center">
                      <svg className="w-16 h-16 text-green-500 mb-4 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                      <h3 className="text-2xl font-bold mb-2">Thank You for Partnering!</h3>
                      <p className="text-gray-600 max-w-xs">Your application has been received. Our partner manager will contact you within 24 hours.</p>
                      <Button onClick={() => setFormStatus('FORM')} className="mt-4 bg-[#0050B2] hover:bg-[#003d8a]">Register Another</Button>
                    </div>
                    )}

                  
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Sticky Tab Navigation */}
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

      {/* Why Partner With Us Section */}
      <section id="overview" className="py-16 bg-white">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Why Partner With Us
            </h2>
            <p className="text-xl text-gray-600">
              Join India's fastest-growing loan distribution network
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {partnerFeatures.map((feature, index) => (
              <Card 
                key={index}
                className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border border-gray-100 bg-white"
              >
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 text-3xl">
                    {feature.icon}
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-[#0050B2] transition-colors duration-300">
                    {feature.title}
                  </h3>
                  
                  <p className="text-gray-600">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Who Can Join Section */}
      <section id="eligibility" className="py-16 bg-[#F0F6FF]">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Anyone Can Become a DSA Partner
            </h2>
            <p className="text-xl text-gray-600">
              No matter your background, you can start earning with Accrefin
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {eligibilityGroups.map((group, groupIndex) => (
              <Card key={groupIndex} className="bg-white shadow-lg border-0">
                <CardContent className="p-8">
                  <h3 className="text-xl font-bold text-gray-900 mb-6 text-center">
                    {group.title}
                  </h3>
                  
                  <div className="space-y-4">
                    {group.items.map((item, itemIndex) => (
                      <div key={itemIndex} className="flex items-center gap-3">
                        <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center shadow-sm">
                          <CheckIcon className="w-4 h-4 text-green-600" />
                        </div>
                        <span className="text-gray-700 font-medium">{item}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600">
              Your journey to becoming an Accrefin partner is simple
            </p>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-start max-w-5xl mx-auto">
            {partnerJourneySteps.map((step, index) => (
              <div 
                key={index} 
                className="relative flex flex-col items-center text-center mb-8 md:mb-0"
                style={{
                  animation: `fadeInUp 0.6s ease-out ${index * 0.2}s both`
                }}
              >
                {/* Connector Line */}
                {index < partnerJourneySteps.length - 1 && (
                  <div className="hidden md:block absolute top-10 left-1/2 w-full h-0.5 bg-gray-200 z-0"></div>
                )}
                
                {/* Step Circle */}
                <div className="w-20 h-20 bg-[#0050B2] rounded-full flex items-center justify-center text-white text-2xl font-bold mb-4 z-10 shadow-lg">
                  {step.step}
                </div>
                
                {/* Step Content */}
                <h3 className="text-xl font-bold text-gray-900 mb-2">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Documents Required Section */}
      <section id="documents" className="py-16 bg-gray-50">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Documents Required
            </h2>
            <p className="text-xl text-gray-600">
              Keep these documents ready for quick onboarding
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {requiredDocuments.map((doc, index) => (
              <Card 
                key={index}
                className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border border-gray-100 bg-white"
              >
                <CardContent className="p-8 text-center">
                  <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
                    {doc.icon}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-[#0050B2] transition-colors duration-300">
                    {doc.title}
                  </h3>
                  <p className="text-gray-600 text-sm">
                    {doc.description}
                  </p>
                  <div className="mt-4">
                    <a href="#" className="text-sm text-[#0050B2] hover:underline">View Sample</a>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Commission & Earnings Section */}
      <section id="commission" className="py-16 bg-white">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Your Earnings as a Partner
            </h2>
            <p className="text-xl text-gray-600">
              Competitive commission structure with timely payouts
            </p>
          </div>

          <div className="max-w-5xl mx-auto">
            <Card className="shadow-xl border-0">
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gradient-to-r from-[#0050B2] to-[#003d8a] text-white">
                      <tr>
                        <th className="px-6 py-4 text-left font-semibold">Loan Type</th>
                        <th className="px-6 py-4 text-left font-semibold">Commission</th>
                        <th className="px-6 py-4 text-left font-semibold">Example Earnings</th>
                      </tr>
                    </thead>
                    <tbody>
                      {commissionStructure.map((item, index) => (
                        <tr key={index} className={`border-b border-gray-100 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-blue-50 transition-colors duration-200`}>
                          <td className="px-6 py-4 font-medium text-gray-900">{item.loanType}</td>
                          <td className="px-6 py-4 text-gray-700">
                            <span className="font-semibold text-[#0050B2]">{item.commission}</span>
                          </td>
                          <td className="px-6 py-4 text-gray-700">{item.example}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            <div className="mt-8 text-center">
              <div className="bg-green-50 p-4 rounded-xl inline-block">
                <p className="font-semibold text-green-700">No target, No penalty. Earn what you close.</p>
              </div>
              <p className="text-sm text-gray-500 mt-4">
                Payouts processed every 15th and 30th of each month.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Success Stories from Our Partners
            </h2>
            <p className="text-xl text-gray-600">
              Hear from partners who are growing their business with Accrefin
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card 
                key={index}
                className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-0 bg-white relative overflow-hidden"
              >
                <CardContent className="p-8">
                  <div className="space-y-6">
                    {/* Quote Icon */}
                    <div className="text-4xl text-[#0050B2] opacity-20">"</div>

                    {/* Feedback */}
                    <p className="text-gray-700 leading-relaxed italic">
                      "{testimonial.testimonial}"
                    </p>

                    {/* Customer Info */}
                    <div className="flex items-center gap-4 pt-4 border-t border-gray-100">
                      <img
                        src={testimonial.photo}
                        alt={testimonial.name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      <div>
                        <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                        <p className="text-sm text-gray-500">{testimonial.profession}, {testimonial.location}</p>
                        <div className="mt-1 text-sm font-semibold text-[#0050B2]">
                          Avg. Earnings: {testimonial.earnings}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQs Section */}
      <section id="faqs" className="py-16 bg-white">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-gray-600">
              Get answers to common questions about our partner program
            </p>
          </div>

          <div className="max-w-4xl mx-auto space-y-4">
            {faqs.map((faq, index) => (
              <Card key={index} className="border border-gray-200 hover:shadow-lg transition-shadow duration-300">
                <CardContent className="p-0">
                  <button
                    onClick={() => setExpandedFaq(expandedFaq === `faq-${index}` ? null : `faq-${index}`)}
                    className="w-full p-6 text-left flex items-center justify-between hover:bg-gray-50 transition-colors duration-200"
                  >
                    <h3 className="text-lg font-semibold text-gray-900 pr-4">{faq.question}</h3>
                    {expandedFaq === `faq-${index}` ? (
                      <ChevronUpIcon className="w-5 h-5 text-gray-500 flex-shrink-0" />
                    ) : (
                      <ChevronDownIcon className="w-5 h-5 text-gray-500 flex-shrink-0" />
                    )}
                  </button>
                  
                  {expandedFaq === `faq-${index}` && (
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

      {/* Final CTA Banner */}
      <section className="py-16 bg-gradient-to-r from-[#0050B2] to-[#01387D] text-white">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="text-center max-w-4xl mx-auto">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              Partner with Accrefin & Earn Without Limits
            </h2>
            <p className="text-xl text-blue-100 mb-8">
              Whether you're a freelancer or business, let us help you grow.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                onClick={scrollToForm}
                className="bg-white text-[#0050B2] hover:bg-gray-100 font-semibold px-8 py-3 text-lg rounded-xl transition-all duration-300"
              >
                Join Now
              </Button>
              
              <Button 
                onClick={scrollToForm}
                // variant="outline"
                className="bg-white text-[#0050B2] hover:bg-gray-100 font-semibold px-8 py-3 text-lg rounded-xl transition-all duration-300"
              >
                Contact Partner Manager
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Partner Support Contact */}
      <section className="py-8 bg-gray-50 border-t border-gray-200">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="text-center md:text-left mb-4 md:mb-0">
              <h3 className="text-lg font-bold text-gray-900">Partner Support</h3>
              <p className="text-gray-600">We're here to help you succeed</p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex items-center gap-2">
                <PhoneIcon className="w-5 h-5 text-[#0050B2]" />
                <span className="font-semibold">1800-XXX-XXXX</span>
              </div>
              
              <div className="flex items-center gap-2">
                <MailIcon className="w-5 h-5 text-[#0050B2]" />
                <span className="font-semibold">partners@accrefin.com</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Animation Styles */}
      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};