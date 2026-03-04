import React, { useState, useEffect } from "react";
import { useLoanCalculator } from '../../../hooks/useLoanCalculator';
import { Button } from "../../../components/ui/button";
import { Card, CardContent } from "../../../components/ui/card";
import { Input } from "../../../components/ui/input";
import { CheckIcon, ChevronDownIcon, ChevronUpIcon, HomeIcon, TrendingUpIcon, ShieldIcon, DollarSignIcon, CalendarIcon, PercentIcon } from "lucide-react";


export const HomeLoanCalculatorPage = (): JSX.Element => {
  // Calculator state
  const [loanAmount, setLoanAmount] = useState(3000000);
  const [interestRate, setInterestRate] = useState(8.5);
  const [loanTenure, setLoanTenure] = useState(20);
  const [tenureType, setTenureType] = useState<"years" | "months">("years"); // years or months
  // calculated results from hook
  const { emi, totalAmount, totalInterest } = useLoanCalculator({ loanAmount, interestRate, loanTenure, tenureType });
  
  // UI state
  const [activeSection, setActiveSection] = useState("calculator");
  const [showAmortization, setShowAmortization] = useState(false);
  const [expandedFaq, setExpandedFaq] = useState<string | null>(null);
  const [isTabSticky, setIsTabSticky] = useState(false);

  // calculation handled by useLoanCalculator

  // Scroll spy functionality to highlight active tab
  useEffect(() => {
    const handleScroll = () => {
      // Check if tabs should be sticky
      const heroSection = document.getElementById('hero-section');
      if (heroSection) {
        const heroBottom = heroSection.offsetTop + heroSection.offsetHeight;
        setIsTabSticky(window.scrollY > heroBottom - 100);
      }

      // Update active tab based on scroll position
      const sections = ['calculator', 'about', 'types', 'rates', 'info'];
      const scrollPosition = window.scrollY + 150; // Offset for better UX

      for (let i = sections.length - 1; i >= 0; i--) {
        const element = document.getElementById(sections[i]);
        if (element && element.offsetTop <= scrollPosition) {
          setActiveSection(sections[i]);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Smooth scroll to section
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const offset = isTabSticky ? 80 : 0; // Account for sticky header
      const elementPosition = element.offsetTop - offset;
      window.scrollTo({
        top: elementPosition,
        behavior: 'smooth'
      });
    }
  };

  // Generate amortization schedule
  const generateAmortization = () => {
    const schedule = [];
    const months = tenureType === "years" ? loanTenure * 12 : loanTenure;
    const monthlyRate = interestRate / 100 / 12;
    let balance = loanAmount;

    for (let i = 1; i <= Math.min(months, 12); i++) { // Show first 12 months
      const interestPayment = balance * monthlyRate;
      const principalPayment = emi - interestPayment;
      balance -= principalPayment;

      schedule.push({
        month: i,
        emi: emi,
        principal: principalPayment,
        interest: interestPayment,
        balance: Math.max(0, balance)
      });
    }
    return schedule;
  };

  const amortizationSchedule = generateAmortization();

  // New helper function to calculate the slider fill percentage (0-100)
  const getFillPercentage = (value: number, min: number, max: number): string => {
    const percentage = ((value - min) / (max - min)) * 100;
    // Return the percentage formatted for the CSS variable
    return `${percentage}%`;
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return `₹${amount.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`;
  };

  // Home loan types data
  const homeLoanTypes = [
    {
      type: "Purchase Loan",
      description: "To buy a ready-to-move-in property",
      features: ["Up to 90% funding", "Competitive rates", "Quick approval"],
      useCase: "Buying existing homes, apartments, or villas"
    },
    {
      type: "Construction Loan",
      description: "To construct a house on your own land",
      features: ["Stage-wise disbursement", "Flexible repayment", "Construction monitoring"],
      useCase: "Building a new house from scratch"
    },
    {
      type: "Home Improvement Loan",
      description: "To renovate or improve existing property",
      features: ["Lower documentation", "Quick processing", "Flexible tenure"],
      useCase: "Renovations, repairs, or home extensions"
    },
    {
      type: "Balance Transfer",
      description: "Transfer existing loan to get better rates",
      features: ["Lower interest rates", "Top-up option", "Reduced EMI"],
      useCase: "Switching from current lender for better terms"
    },
    {
      type: "Top-up Loan",
      description: "Additional loan on existing home loan",
      features: ["Lower rates than personal loans", "Same property as collateral", "Quick approval"],
      useCase: "Personal needs, investments, or emergencies"
    },
    {
      type: "Plot Loan",
      description: "To purchase residential plots",
      features: ["Up to 80% funding", "Longer tenure", "Competitive rates"],
      useCase: "Buying land for future construction"
    }
  ];

  // Interest rate comparison
  const interestRateTypes = [
    {
      type: "Fixed Interest Rate",
      definition: "Interest rate remains constant throughout the loan tenure",
      pros: ["Predictable EMIs", "Budget planning easier", "Protection from rate hikes"],
      cons: ["Higher initial rates", "No benefit if market rates fall", "Less flexibility"],
      bestFor: "Risk-averse borrowers who prefer certainty"
    },
    {
      type: "Floating/Variable Rate",
      definition: "Interest rate changes based on market conditions",
      pros: ["Lower initial rates", "Benefit from rate cuts", "Market-linked pricing"],
      cons: ["EMI fluctuations", "Uncertainty in planning", "Risk of rate increases"],
      bestFor: "Borrowers comfortable with rate fluctuations"
    },
    {
      type: "Hybrid Interest Rate",
      definition: "Fixed for initial years, then switches to floating",
      pros: ["Initial stability", "Later flexibility", "Balanced approach"],
      cons: ["Complexity in understanding", "Rate uncertainty later", "Limited availability"],
      bestFor: "Borrowers wanting initial stability with later flexibility"
    }
  ];

  // Navigation tabs
  const navigationTabs = [
    { id: "calculator", label: "EMI Calculator", icon: <CalendarIcon className="w-4 h-4" /> },
    { id: "about", label: "About Home Loans", icon: <HomeIcon className="w-4 h-4" /> },
    { id: "types", label: "Loan Types", icon: <TrendingUpIcon className="w-4 h-4" /> },
    { id: "rates", label: "Interest Rates", icon: <PercentIcon className="w-4 h-4" /> },
    { id: "info", label: "Additional Info", icon: <ShieldIcon className="w-4 h-4" /> }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
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
          {/* Breadcrumb */}
          <div className="mb-8">
            <nav className="flex items-center space-x-2 text-sm">
              <a href="/" className="text-blue-600 hover:text-blue-800 transition-colors">Home</a>
              <span className="text-gray-400">/</span>
              <a href="/calculators" className="text-blue-600 hover:text-blue-800 transition-colors">Calculators</a>
              <span className="text-gray-400">/</span>
              <span className="text-gray-600">Home Loan Calculator</span>
            </nav>
          </div>

          <div className="text-center max-w-4xl mx-auto">
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="w-16 h-16 bg-gradient-to-r from-[#0050B2] to-[#003d8a] rounded-2xl flex items-center justify-center shadow-lg">
                <HomeIcon className="w-8 h-8 text-white" />
              </div>
            </div>
            
            <h1 className="text-4xl lg:text-5xl font-bold leading-tight mb-6">
              <span className="text-gray-900">Home Loan</span>
              <br />
              <span className="bg-gradient-to-r from-[#0050B2] to-[#003d8a] bg-clip-text text-transparent">
                EMI Calculator
              </span>
            </h1>
            
            <p className="text-xl text-gray-600 leading-relaxed mb-8">
              Calculate your home loan EMI instantly and explore comprehensive information about home loans, 
              interest rates, and loan types to make informed decisions.
            </p>
          </div>
        </div>
      </section>

      {/* Sticky Navigation Tabs */}
      <div className={`${isTabSticky ? 'fixed top-0 left-0 right-0 z-50 shadow-lg' : 'relative'} bg-white border-b border-gray-200 transition-all duration-300`}>
        <div className="container mx-auto max-w-7xl px-4">
          <div className="flex items-center justify-center">
            <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
              {navigationTabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => scrollToSection(tab.id)}
                  className={`flex items-center gap-2 px-4 py-3 text-sm font-medium rounded-lg transition-all duration-300 ${
                    activeSection === tab.id
                      ? 'bg-[#0050B2] text-white shadow-lg'
                      : 'text-gray-600 hover:text-[#0050B2] hover:bg-white'
                  }`}
                >
                  {tab.icon}
                  <span className="hidden sm:inline">{tab.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content - All Sections Displayed Continuously */}
      <div className="container mx-auto max-w-7xl px-4">

        {/* Calculator Section */}
        <section id="calculator" className="py-16">
          <div className="space-y-12">
            <div className="text-center">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                Home Loan EMI Calculator
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Calculate your monthly EMI and plan your home financing with our advanced calculator
              </p>
            </div>

            <Card className="shadow-2xl border-0 rounded-2xl overflow-hidden">
              <CardContent className="p-8 lg:p-12">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                  {/* Calculator Inputs */}
                  <div className="space-y-8">
                    <h3 className="text-2xl font-bold text-gray-900 mb-6">Calculate Your Home Loan EMI</h3>
                    
                    {/* Loan Amount */}
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <label className="text-lg font-semibold text-gray-900">Loan Amount</label>
                        <div className="bg-[#0050B2] text-white px-4 py-2 rounded-lg font-bold">
                          {formatCurrency(loanAmount)}
                        </div>
                      </div>
                      {/* <input 
                        type="range" 
                        min="100000" 
                        max="50000000" 
                        step="100000"
                        value={loanAmount}
                        onChange={(e) => setLoanAmount(Number(e.target.value))}
                        className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                      /> */}

                      <input type="range" min="100000" max="50000000" step="100000" value={loanAmount} onChange={(e) => setLoanAmount(Number(e.target.value))} className="w-full h-3 bg-gray-200 rounded-lg cursor-pointer slider" style={{ '--fill-percent': getFillPercentage(loanAmount, 100000, 50000000) } as React.CSSProperties}/>
                      <div className="flex justify-between text-sm text-gray-500">
                        <span>₹1L</span>
                        <span>₹5Cr</span>
                      </div>
                    </div>

                    {/* Interest Rate */}
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <label className="text-lg font-semibold text-gray-900">Interest Rate (% p.a.)</label>
                        <div className="bg-[#0050B2] text-white px-4 py-2 rounded-lg font-bold">
                          {interestRate}%
                        </div>
                      </div>
                      {/* <input 
                        type="range" 
                        min="6.5" 
                        max="15" 
                        step="0.1"
                        value={interestRate}
                        onChange={(e) => setInterestRate(Number(e.target.value))}
                        className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                      /> */}
                      <input type="range" min="6.5" max="15" step="0.1" value={interestRate} onChange={(e) => setInterestRate(Number(e.target.value))} className="w-full h-3 bg-gray-200 rounded-lg cursor-pointer slider" style={{ '--fill-percent': getFillPercentage(interestRate, 6.5, 15) } as React.CSSProperties}/>
                      <div className="flex justify-between text-sm text-gray-500">
                        <span>6.5%</span>
                        <span>15%</span>
                      </div>
                    </div>

                    {/* Loan Tenure */}
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <label className="text-lg font-semibold text-gray-900">Loan Tenure</label>
                        <div className="flex items-center gap-2">
                          <div className="bg-[#0050B2] text-white px-4 py-2 rounded-lg font-bold">
                            {loanTenure} {tenureType}
                          </div>
                          <select 
                            value={tenureType}
                            onChange={(e) => setTenureType(e.target.value as "years" | "months")}
                            className="bg-gray-100 border border-gray-300 rounded-lg px-3 py-2 text-sm"
                          >
                            <option value="years">Years</option>
                            <option value="months">Months</option>
                          </select>
                        </div>
                      </div>
                      {/* <input 
                        type="range" 
                        min={tenureType === "years" ? "1" : "12"}
                        max={tenureType === "years" ? "30" : "360"}
                        step="1"
                        value={loanTenure}
                        onChange={(e) => setLoanTenure(Number(e.target.value))}
                        className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                      /> */}
                      <input type="range" min={tenureType === "years" ? "1" : "12"} max={tenureType === "years" ? "30" : "360"} step="1" value={loanTenure} onChange={(e) => setLoanTenure(Number(e.target.value))} className="w-full h-3 bg-gray-200 rounded-lg cursor-pointer slider" style={{ '--fill-percent': getFillPercentage(loanTenure, Number(tenureType === 'years' ? '1' : '12'), Number(tenureType === 'years' ? '30' : '360')) } as React.CSSProperties}/>
                      <div className="flex justify-between text-sm text-gray-500">
                        <span>{tenureType === "years" ? "1 Year" : "12 Months"}</span>
                        <span>{tenureType === "years" ? "30 Years" : "360 Months"}</span>
                      </div>
                    </div>
                  </div>

                  {/* Results */}
                  <div className="space-y-6">
                    {/* EMI Display */}
                    <div className="bg-gradient-to-r from-[#0050B2] to-[#003d8a] rounded-2xl p-8 text-white text-center">
                      <h3 className="text-lg font-semibold mb-2 opacity-90">Monthly EMI</h3>
                      <div className="text-4xl font-bold mb-4">
                        {formatCurrency(emi)}
                      </div>
                      <Button className="bg-white text-[#0050B2] hover:bg-gray-100 font-semibold px-8 py-3 rounded-xl transition-all duration-300">
                        Apply for Home Loan
                      </Button>
                    </div>

                    {/* Breakdown */}
                    <div className="space-y-4">
                      <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                        <span className="text-gray-600">Principal Amount</span>
                        <span className="font-bold text-gray-900">{formatCurrency(loanAmount)}</span>
                      </div>
                      
                      <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                        <span className="text-gray-600">Total Interest</span>
                        <span className="font-bold text-gray-900">{formatCurrency(totalInterest)}</span>
                      </div>
                      
                      <div className="flex justify-between items-center p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
                        <span className="text-green-700 font-semibold">Total Amount Payable</span>
                        <span className="font-bold text-green-700 text-lg">{formatCurrency(totalAmount)}</span>
                      </div>
                    </div>

                    {/* Amortization Toggle */}
                    <div className="pt-4">
                      <Button 
                        onClick={() => setShowAmortization(!showAmortization)}
                        variant="outline"
                        className="w-full border-[#0050B2] text-[#0050B2] hover:bg-[#0050B2] hover:text-white"
                      >
                        {showAmortization ? 'Hide' : 'Show'} Amortization Schedule
                        {showAmortization ? <ChevronUpIcon className="w-4 h-4 ml-2" /> : <ChevronDownIcon className="w-4 h-4 ml-2" />}
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Amortization Schedule */}
            {showAmortization && (
              <Card className="shadow-xl border-0">
                <CardContent className="p-8">
                  <h3 className="text-xl font-bold text-gray-900 mb-6">Amortization Schedule (First 12 Months)</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-[#0050B2] text-white">
                        <tr>
                          <th className="px-4 py-3 text-left">Month</th>
                          <th className="px-4 py-3 text-left">EMI</th>
                          <th className="px-4 py-3 text-left">Principal</th>
                          <th className="px-4 py-3 text-left">Interest</th>
                          <th className="px-4 py-3 text-left">Balance</th>
                        </tr>
                      </thead>
                      <tbody>
                        {amortizationSchedule.map((row, index) => (
                          <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                            <td className="px-4 py-3 font-medium">{row.month}</td>
                            <td className="px-4 py-3">{formatCurrency(row.emi)}</td>
                            <td className="px-4 py-3">{formatCurrency(row.principal)}</td>
                            <td className="px-4 py-3">{formatCurrency(row.interest)}</td>
                            <td className="px-4 py-3">{formatCurrency(row.balance)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </section>

        {/* About Home Loans Section */}
        <section id="about" className="py-16 bg-gray-50">
          <div className="space-y-12">
            <div className="text-center mb-12">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                What is a Home Loan?
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Understanding home loans - your pathway to homeownership
              </p>
            </div>

            <Card className="shadow-xl border-0">
              <CardContent className="p-8">
                <div className="space-y-8">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">Definition & Purpose</h3>
                    <p className="text-gray-700 leading-relaxed text-lg">
                      A home loan is a secured loan provided by banks and financial institutions to help individuals 
                      purchase, construct, or renovate residential properties. The property itself serves as collateral, 
                      making it a lower-risk investment for lenders and resulting in competitive interest rates for borrowers.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">How Home Loans Work</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 bg-[#0050B2] rounded-full flex items-center justify-center text-white font-bold text-sm">1</div>
                          <div>
                            <h4 className="font-semibold text-gray-900">Application Process</h4>
                            <p className="text-gray-600 text-sm">Submit application with required documents and property details</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 bg-[#0050B2] rounded-full flex items-center justify-center text-white font-bold text-sm">2</div>
                          <div>
                            <h4 className="font-semibold text-gray-900">Property Evaluation</h4>
                            <p className="text-gray-600 text-sm">Bank conducts technical and legal verification of the property</p>
                          </div>
                        </div>
                      </div>
                      <div className="space-y-4">
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 bg-[#0050B2] rounded-full flex items-center justify-center text-white font-bold text-sm">3</div>
                          <div>
                            <h4 className="font-semibold text-gray-900">Loan Approval</h4>
                            <p className="text-gray-600 text-sm">Bank approves loan amount based on eligibility and property value</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 bg-[#0050B2] rounded-full flex items-center justify-center text-white font-bold text-sm">4</div>
                          <div>
                            <h4 className="font-semibold text-gray-900">Disbursement</h4>
                            <p className="text-gray-600 text-sm">Loan amount is disbursed and EMI repayment begins</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-6">Key Benefits</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {[
                        { icon: "🏠", title: "Homeownership", desc: "Own your dream home without waiting years to save" },
                        { icon: "💰", title: "Tax Benefits", desc: "Save tax under Section 80C and 24(b) of Income Tax Act" },
                        { icon: "📈", title: "Asset Building", desc: "Build long-term wealth through property appreciation" },
                        { icon: "🔒", title: "Fixed Costs", desc: "Predictable monthly payments help in financial planning" },
                        { icon: "⚡", title: "Leverage", desc: "Use borrowed money to purchase high-value assets" },
                        { icon: "🛡️", title: "Security", desc: "Property provides security and stability for family" }
                      ].map((benefit, index) => (
                        <div key={index} className="p-4 bg-gray-50 rounded-xl">
                          <div className="text-2xl mb-2">{benefit.icon}</div>
                          <h4 className="font-semibold text-gray-900 mb-2">{benefit.title}</h4>
                          <p className="text-gray-600 text-sm">{benefit.desc}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-6">Eligibility Criteria</h3>
                      <div className="space-y-4">
                        {[
                          "Age: 21-65 years for salaried, up to 70 for self-employed",
                          "Income: Minimum ₹25,000 per month for salaried individuals",
                          "Employment: Minimum 2 years total experience, 1 year with current employer",
                          "Credit Score: 750+ for best rates, 650+ minimum",
                          "Debt-to-Income Ratio: Should not exceed 40-50%",
                          "Property: Clear title, approved by local authorities"
                        ].map((criteria, index) => (
                          <div key={index} className="flex items-start gap-3">
                            <CheckIcon className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                            <span className="text-gray-700">{criteria}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-6">Required Documentation</h3>
                      <div className="space-y-4">
                        {[
                          "Identity Proof (Aadhaar, PAN, Passport)",
                          "Address Proof (Utility bills, Rental agreement)",
                          "Income Proof (Salary slips, ITR, Form 16)",
                          "Bank Statements (last 6 months)",
                          "Property Documents (Sale deed, NOC, Approvals)",
                          "Employment Proof (Offer letter, Experience certificate)"
                        ].map((doc, index) => (
                          <div key={index} className="flex items-start gap-3">
                            <div className="w-5 h-5 bg-blue-100 rounded flex items-center justify-center mt-0.5">
                              <span className="text-xs text-blue-600">📄</span>
                            </div>
                            <span className="text-gray-700">{doc}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Loan Types Section */}
        <section id="types" className="py-16 bg-white">
          <div className="space-y-12">
            <div className="text-center mb-12">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                Types of Home Loans
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Choose the right home loan type based on your specific needs
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {homeLoanTypes.map((loan, index) => (
                <Card key={index} className="shadow-lg border-0 hover:shadow-xl transition-shadow duration-300">
                  <CardContent className="p-8">
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">{loan.type}</h3>
                        <p className="text-gray-600">{loan.description}</p>
                      </div>

                      <div>
                        <h4 className="font-semibold text-gray-900 mb-3">Key Features:</h4>
                        <div className="space-y-2">
                          {loan.features.map((feature, featureIndex) => (
                            <div key={featureIndex} className="flex items-center gap-2">
                              <CheckIcon className="w-4 h-4 text-green-600" />
                              <span className="text-gray-700 text-sm">{feature}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="bg-blue-50 p-4 rounded-lg">
                        <h4 className="font-semibold text-blue-900 mb-2">Best For:</h4>
                        <p className="text-blue-800 text-sm">{loan.useCase}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Interest Rates Section */}
        <section id="rates" className="py-16 bg-gray-50">
          <div className="space-y-12">
            <div className="text-center mb-12">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                Home Loan Interest Rate Types
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Understanding different interest rate structures to make the right choice
              </p>
            </div>

            <div className="space-y-8">
              {interestRateTypes.map((rate, index) => (
                <Card key={index} className="shadow-xl border-0">
                  <CardContent className="p-8">
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">{rate.type}</h3>
                        <p className="text-gray-600 text-lg">{rate.definition}</p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                          <h4 className="font-semibold text-green-700 mb-4 flex items-center gap-2">
                            <CheckIcon className="w-5 h-5" />
                            Advantages
                          </h4>
                          <div className="space-y-3">
                            {rate.pros.map((pro, proIndex) => (
                              <div key={proIndex} className="flex items-start gap-2">
                                <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                                <span className="text-gray-700">{pro}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div>
                          <h4 className="font-semibold text-red-700 mb-4 flex items-center gap-2">
                            <span className="w-5 h-5 flex items-center justify-center bg-red-100 rounded-full text-red-600 text-xs">✕</span>
                            Disadvantages
                          </h4>
                          <div className="space-y-3">
                            {rate.cons.map((con, conIndex) => (
                              <div key={conIndex} className="flex items-start gap-2">
                                <div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
                                <span className="text-gray-700">{con}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-200">
                        <h4 className="font-semibold text-blue-900 mb-2">Recommended For:</h4>
                        <p className="text-blue-800">{rate.bestFor}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Comparison Table */}
            <Card className="shadow-xl border-0">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">Interest Rate Comparison</h3>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-[#0050B2] text-white">
                      <tr>
                        <th className="px-6 py-4 text-left">Rate Type</th>
                        <th className="px-6 py-4 text-left">Initial Rate</th>
                        <th className="px-6 py-4 text-left">Rate Fluctuation</th>
                        <th className="px-6 py-4 text-left">EMI Predictability</th>
                        <th className="px-6 py-4 text-left">Market Risk</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-gray-200">
                        <td className="px-6 py-4 font-semibold">Fixed Rate</td>
                        <td className="px-6 py-4">Higher</td>
                        <td className="px-6 py-4 text-green-600">None</td>
                        <td className="px-6 py-4 text-green-600">High</td>
                        <td className="px-6 py-4 text-green-600">Low</td>
                      </tr>
                      <tr className="border-b border-gray-200">
                        <td className="px-6 py-4 font-semibold">Floating Rate</td>
                        <td className="px-6 py-4 text-green-600">Lower</td>
                        <td className="px-6 py-4 text-orange-600">Market-linked</td>
                        <td className="px-6 py-4 text-red-600">Variable</td>
                        <td className="px-6 py-4 text-red-600">High</td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 font-semibold">Hybrid Rate</td>
                        <td className="px-6 py-4 text-orange-600">Medium</td>
                        <td className="px-6 py-4 text-orange-600">Delayed</td>
                        <td className="px-6 py-4 text-orange-600">Mixed</td>
                        <td className="px-6 py-4 text-orange-600">Medium</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Additional Information Section */}
        <section id="info" className="py-16 bg-white">
          <div className="space-y-12">
            <div className="text-center mb-12">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                Additional Information
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Important details about fees, tax benefits, and other considerations
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Processing Fees */}
              <Card className="shadow-xl border-0">
                <CardContent className="p-8">
                  <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                    <DollarSignIcon className="w-6 h-6 text-[#0050B2]" />
                    Processing Fees & Charges
                  </h3>
                  <div className="space-y-4">
                    {[
                      { fee: "Processing Fee", amount: "0.5% - 1% of loan amount" },
                      { fee: "Administrative Charges", amount: "₹2,000 - ₹10,000" },
                      { fee: "Valuation Charges", amount: "₹2,000 - ₹5,000" },
                      { fee: "Legal Charges", amount: "₹3,000 - ₹7,500" },
                      { fee: "Technical Charges", amount: "₹2,500 - ₹5,000" },
                      { fee: "Prepayment Charges", amount: "2% - 3% (if any)" }
                    ].map((item, index) => (
                      <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <span className="text-gray-700 font-medium">{item.fee}</span>
                        <span className="text-gray-900 font-semibold">{item.amount}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Tax Benefits */}
              <Card className="shadow-xl border-0">
                <CardContent className="p-8">
                  <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                    <ShieldIcon className="w-6 h-6 text-green-600" />
                    Tax Benefits
                  </h3>
                  <div className="space-y-4">
                    <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                      <h4 className="font-semibold text-green-800 mb-2">Section 80C</h4>
                      <p className="text-green-700 text-sm">Principal repayment: Up to ₹1.5 lakh deduction</p>
                    </div>
                    <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <h4 className="font-semibold text-blue-800 mb-2">Section 24(b)</h4>
                      <p className="text-blue-700 text-sm">Interest payment: Up to ₹2 lakh deduction</p>
                    </div>
                    <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                      <h4 className="font-semibold text-purple-800 mb-2">First-time Buyer</h4>
                      <p className="text-purple-700 text-sm">Additional ₹50,000 under Section 80EEA</p>
                    </div>
                    <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
                      <h4 className="font-semibold text-orange-800 mb-2">Total Benefit</h4>
                      <p className="text-orange-700 text-sm">Up to ₹3.5 lakh annual tax savings</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Prepayment Options */}
              <Card className="shadow-xl border-0">
                <CardContent className="p-8">
                  <h3 className="text-xl font-bold text-gray-900 mb-6">Prepayment Options</h3>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Partial Prepayment</h4>
                      <p className="text-gray-600 text-sm mb-3">Pay extra amount towards principal to reduce loan tenure or EMI</p>
                      <div className="flex items-center gap-2">
                        <CheckIcon className="w-4 h-4 text-green-600" />
                        <span className="text-green-700 text-sm">Reduces overall interest burden</span>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Full Prepayment</h4>
                      <p className="text-gray-600 text-sm mb-3">Close the loan entirely before tenure completion</p>
                      <div className="flex items-center gap-2">
                        <CheckIcon className="w-4 h-4 text-green-600" />
                        <span className="text-green-700 text-sm">Saves maximum interest amount</span>
                      </div>
                    </div>
                    <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                      <p className="text-yellow-800 text-sm">
                        <strong>Note:</strong> Some lenders may charge prepayment penalties. 
                        Check with your lender for specific terms.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Insurance Requirements */}
              <Card className="shadow-xl border-0">
                <CardContent className="p-8">
                  <h3 className="text-xl font-bold text-gray-900 mb-6">Insurance Requirements</h3>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Home Insurance</h4>
                      <p className="text-gray-600 text-sm">Mandatory fire and property insurance to protect the asset</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Life Insurance</h4>
                      <p className="text-gray-600 text-sm">Often recommended to cover outstanding loan amount</p>
                    </div>
                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                      <h4 className="font-semibold text-blue-800 mb-2">Benefits</h4>
                      <ul className="text-blue-700 text-sm space-y-1">
                        <li>• Protects property against natural disasters</li>
                        <li>• Ensures loan repayment in case of borrower's demise</li>
                        <li>• Some policies offer additional coverage benefits</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* FAQ Section */}
            <Card className="shadow-xl border-0">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">Frequently Asked Questions</h3>
                <div className="space-y-4">
                  {[
                    {
                      q: "What is the maximum loan amount I can get?",
                      a: "Home loan amounts typically range from ₹1 lakh to ₹5 crores, depending on your income, credit score, and property value. Most lenders finance up to 80-90% of the property value."
                    },
                    {
                      q: "How is EMI calculated?",
                      a: "EMI is calculated using the formula: [P x R x (1+R)^N] / [(1+R)^N-1], where P is principal, R is monthly interest rate, and N is tenure in months."
                    },
                    {
                      q: "Can I transfer my home loan to another bank?",
                      a: "Yes, you can transfer your home loan to get better interest rates or service. This is called balance transfer and may involve processing charges."
                    },
                    {
                      q: "What happens if I miss EMI payments?",
                      a: "Missing EMI payments can result in penalty charges, negative impact on credit score, and in extreme cases, legal action or property auction by the lender."
                    },
                    {
                      q: "What are the tax benefits of home loans?",
                      a: "You can claim deductions under Section 80C (up to ₹1.5 lakh for principal), Section 24(b) (up to ₹2 lakh for interest), and additional benefits for first-time buyers under Section 80EEA."
                    },
                    {
                      q: "How much down payment is required?",
                      a: "Most lenders require a down payment of 10-20% of the property value. The remaining 80-90% can be financed through the home loan."
                    }
                  ].map((faq, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg">
                      <button
                        onClick={() => setExpandedFaq(expandedFaq === `faq-${index}` ? null : `faq-${index}`)}
                        className="w-full p-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors duration-200"
                      >
                        <span className="font-semibold text-gray-900">{faq.q}</span>
                        {expandedFaq === `faq-${index}` ? (
                          <ChevronUpIcon className="w-5 h-5 text-gray-500" />
                        ) : (
                          <ChevronDownIcon className="w-5 h-5 text-gray-500" />
                        )}
                      </button>
                      {expandedFaq === `faq-${index}` && (
                        <div className="px-4 pb-4 border-t border-gray-200">
                          <p className="text-gray-700 mt-3">{faq.a}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

      </div>

    </div>
  );
};