import React, { useState, useEffect } from "react";
import { useLoanCalculator } from '../../../hooks/useLoanCalculator';
import { Button } from "../../../components/ui/button";
import { Card, CardContent } from "../../../components/ui/card";
import { Input } from "../../../components/ui/input";
import { CheckIcon, ChevronDownIcon, ChevronUpIcon, UserIcon, TrendingUpIcon, ShieldIcon, DollarSignIcon, CalendarIcon, PercentIcon, CreditCardIcon, BanknoteIcon, RefreshCwIcon, PrinterIcon } from "lucide-react";

export const PersonalLoanCalculatorPage = (): JSX.Element => {
  // Calculator state
  const [loanAmount, setLoanAmount] = useState(500000);
  const [interestRate, setInterestRate] = useState(12);
  const [loanTenure, setLoanTenure] = useState(36);
  const [tenureType, setTenureType] = useState<'years' | 'months'>("months"); // years or months
  const [processingFee, setProcessingFee] = useState(2.5); // percentage
  const { emi, totalAmount, totalInterest } = useLoanCalculator({ loanAmount, interestRate, loanTenure, tenureType });
  
  // UI state
  const [activeSection, setActiveSection] = useState("calculator");
  const [showAmortization, setShowAmortization] = useState(false);
  const [expandedFaq, setExpandedFaq] = useState<string | null>(null);
  const [isTabSticky, setIsTabSticky] = useState(false);

  // calculation handled by useLoanCalculator; compute processing fee locally
  const processingFeeAmount = (loanAmount * processingFee) / 100;
  const displayTotalAmount = totalAmount + processingFeeAmount;

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
      const sections = ['calculator', 'about', 'types', 'benefits', 'info'];
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

  // Reset calculator to default values
  const resetCalculator = () => {
    setLoanAmount(500000);
    setInterestRate(12);
    setLoanTenure(36);
    setTenureType("months");
    setProcessingFee(2.5);
    setShowAmortization(false);
  };

  // Print functionality
  const handlePrint = () => {
    window.print();
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

  // Format currency
  const formatCurrency = (amount: number) => {
    return `₹${amount.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`;
  };

  // Format currency with decimals
  const formatCurrencyWithDecimals = (amount: number) => {
    return `₹${amount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const getFillPercentage = (value: number, min: number, max: number): string => {
    const numValue = Number(value);
    const numMin = Number(min);
    const numMax = Number(max);

    if (numMax === numMin) return '0%';
    
    const percentage = ((numValue - numMin) / (numMax - numMin)) * 100;
    
    return `${Math.max(0, Math.min(100, percentage))}%`;
};

  // Personal loan types data
  const personalLoanTypes = [
    {
      type: "Instant Personal Loan",
      description: "Quick approval for immediate financial needs",
      features: ["Instant approval", "Minimal documentation", "Digital process"],
      useCase: "Medical emergencies, urgent travel, or unexpected expenses"
    },
    {
      type: "Salary-based Personal Loan",
      description: "For salaried professionals with regular income",
      features: ["Lower interest rates", "Higher loan amounts", "Longer tenure options"],
      useCase: "Home renovation, wedding expenses, or debt consolidation"
    },
    {
      type: "Self-employed Personal Loan",
      description: "Designed for business owners and freelancers",
      features: ["Flexible documentation", "Income-based assessment", "Business-friendly terms"],
      useCase: "Business expansion, working capital, or personal investments"
    },
    {
      type: "Secured Personal Loan",
      description: "Backed by collateral for better rates",
      features: ["Lower interest rates", "Higher loan amounts", "Flexible repayment"],
      useCase: "Large expenses where you can provide security"
    },
    {
      type: "Debt Consolidation Loan",
      description: "Combine multiple debts into one loan",
      features: ["Single EMI", "Potentially lower rates", "Simplified repayment"],
      useCase: "Consolidating credit card debts or multiple loans"
    },
    {
      type: "Pre-approved Personal Loan",
      description: "Offers based on existing banking relationship",
      features: ["Pre-approved offers", "Quick disbursal", "Preferred rates"],
      useCase: "Existing bank customers with good credit history"
    }
  ];

  // Interest rate comparison
  const interestRateFactors = [
    {
      factor: "Credit Score Range",
      definition: "How your CIBIL score affects interest rates",
      ranges: [
        { score: "750+", rate: "10.5% - 14%", status: "Excellent" },
        { score: "700-749", rate: "12% - 16%", status: "Good" },
        { score: "650-699", rate: "14% - 18%", status: "Fair" },
        { score: "600-649", rate: "16% - 22%", status: "Poor" },
        { score: "Below 600", rate: "20% - 24%", status: "Very Poor" }
      ]
    },
    {
      factor: "Income Level Impact",
      definition: "How your monthly income influences loan terms",
      ranges: [
        { score: "₹1L+ /month", rate: "10.5% - 13%", status: "Premium rates" },
        { score: "₹50K-1L /month", rate: "12% - 16%", status: "Standard rates" },
        { score: "₹30K-50K /month", rate: "14% - 18%", status: "Higher rates" },
        { score: "₹20K-30K /month", rate: "16% - 20%", status: "Subprime rates" },
        { score: "Below ₹20K", rate: "18% - 24%", status: "High risk rates" }
      ]
    }
  ];

  // Navigation tabs
  const navigationTabs = [
    { id: "calculator", label: "EMI Calculator", icon: <CalendarIcon className="w-4 h-4" /> },
    { id: "about", label: "About Personal Loans", icon: <UserIcon className="w-4 h-4" /> },
    { id: "types", label: "Loan Types", icon: <TrendingUpIcon className="w-4 h-4" /> },
    { id: "benefits", label: "Benefits & Uses", icon: <PercentIcon className="w-4 h-4" /> },
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
              <span className="text-gray-600">Personal Loan Calculator</span>
            </nav>
          </div>

          <div className="text-center max-w-4xl mx-auto">
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="w-16 h-16 bg-gradient-to-r from-[#0050B2] to-[#003d8a] rounded-2xl flex items-center justify-center shadow-lg">
                <UserIcon className="w-8 h-8 text-white" />
              </div>
            </div>
            
            <h1 className="text-4xl lg:text-5xl font-bold leading-tight mb-6">
              <span className="text-gray-900">Personal Loan</span>
              <br />
              <span className="bg-gradient-to-r from-[#0050B2] to-[#003d8a] bg-clip-text text-transparent">
                EMI Calculator
              </span>
            </h1>
            
            <p className="text-xl text-gray-600 leading-relaxed mb-8">
              Calculate your personal loan EMI instantly and explore comprehensive information about personal loans, 
              interest rates, and loan types to make informed decisions for your financial needs.
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
                Personal Loan EMI Calculator
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Calculate your monthly EMI for personal loans with our advanced calculator
              </p>
            </div>

            <Card className="shadow-2xl border-0 rounded-2xl overflow-hidden">
              <CardContent className="p-8 lg:p-12">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                  {/* Calculator Inputs */}
                  <div className="space-y-8">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-2xl font-bold text-gray-900">Calculate Your Personal Loan EMI</h3>
                      <div className="flex gap-2">
                        <Button 
                          onClick={resetCalculator}
                          variant="outline"
                          size="sm"
                          className="border-gray-300 text-gray-600 hover:bg-gray-50"
                          title="Reset Calculator"
                        >
                          <RefreshCwIcon className="w-4 h-4" />
                        </Button>
                        <Button 
                          onClick={handlePrint}
                          variant="outline"
                          size="sm"
                          className="border-gray-300 text-gray-600 hover:bg-gray-50"
                          title="Print Results"
                        >
                          <PrinterIcon className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    
                    {/* Loan Amount */}
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <label className="text-lg font-semibold text-gray-900">Loan Amount</label>
                          <div className="group relative">
                            <span className="text-gray-400 cursor-help"></span>
                            <div className="invisible group-hover:visible absolute bottom-6 left-0 bg-gray-800 text-white text-xs p-2 rounded w-48 z-10">
                              The principal amount you want to borrow
                            </div>
                          </div>
                        </div>
                        <div className="bg-[#0050B2] text-white px-4 py-2 rounded-lg font-bold">
                          {formatCurrency(loanAmount)}
                        </div>
                      </div>
                      {/* <input 
                        type="range" 
                        min="25000" 
                        max="5000000" 
                        step="25000"
                        value={loanAmount}
                        onChange={(e) => setLoanAmount(Number(e.target.value))}
                        className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                      /> */}

                      <input
                          type="range"
                          min="25000"
                          max="5000000"
                          step="25000"
                          value={loanAmount}
                          onChange={(e) => setLoanAmount(Number(e.target.value))}
                          className="w-full h-3 bg-gray-200 rounded-lg cursor-pointer slider"
                          style={{ '--fill-percent': getFillPercentage(loanAmount, 25000, 5000000) } as React.CSSProperties}
                      />
                      <div className="flex justify-between text-sm text-gray-500">
                        <span>₹25K</span>
                        <span>₹50L</span>
                      </div>
                    </div>

                    {/* Interest Rate */}
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <label className="text-lg font-semibold text-gray-900">Interest Rate (% p.a.)</label>
                          <div className="group relative">
                            <span className="text-gray-400 cursor-help"></span>
                            <div className="invisible group-hover:visible absolute bottom-6 left-0 bg-gray-800 text-white text-xs p-2 rounded w-48 z-10">
                              Annual interest rate charged by the lender
                            </div>
                          </div>
                        </div>
                        <div className="bg-[#0050B2] text-white px-4 py-2 rounded-lg font-bold">
                          {interestRate}%
                        </div>
                      </div>
                      {/* <input 
                        type="range" 
                        min="9.5" 
                        max="24" 
                        step="0.1"
                        value={interestRate}
                        onChange={(e) => setInterestRate(Number(e.target.value))}
                        className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                      /> */}

                      <input
                          type="range"
                          min="9.5"
                          max="24"
                          step="0.1"
                          value={interestRate}
                          onChange={(e) => setInterestRate(Number(e.target.value))}
                          className="w-full h-3 bg-gray-200 rounded-lg cursor-pointer slider"
                          style={{ '--fill-percent': getFillPercentage(interestRate, 9.5, 24) } as React.CSSProperties}
                      />
                      <div className="flex justify-between text-sm text-gray-500">
                        <span>9.5%</span>
                        <span>24%</span>
                      </div>
                    </div>

                    {/* Loan Tenure */}
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <label className="text-lg font-semibold text-gray-900">Loan Tenure</label>
                          <div className="group relative">
                            <span className="text-gray-400 cursor-help"></span>
                            <div className="invisible group-hover:visible absolute bottom-6 left-0 bg-gray-800 text-white text-xs p-2 rounded w-48 z-10">
                              Duration for which you want to repay the loan
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="bg-[#0050B2] text-white px-4 py-2 rounded-lg font-bold">
                            {loanTenure} {tenureType}
                          </div>
                          <select 
                            value={tenureType}
                            onChange={(e) => setTenureType(e.target.value as 'years' | 'months')}
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
                        max={tenureType === "years" ? "7" : "84"}
                        step="1"
                        value={loanTenure}
                        onChange={(e) => setLoanTenure(Number(e.target.value))}
                        className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                      /> */}

                      <input
                          type="range"
                          min={tenureType === "years" ? "1" : "12"}
                          max={tenureType === "years" ? "7" : "84"}
                          step="1"
                          value={loanTenure}
                          onChange={(e) => setLoanTenure(Number(e.target.value))}
                          className="w-full h-3 bg-gray-200 rounded-lg cursor-pointer slider"
                          style={{ '--fill-percent': getFillPercentage(loanTenure, Number(tenureType === 'years' ? '1' : '12'), Number(tenureType === 'years' ? '7' : '84')) } as React.CSSProperties}
                      />
                      <div className="flex justify-between text-sm text-gray-500">
                        <span>{tenureType === "years" ? "1 Year" : "12 Months"}</span>
                        <span>{tenureType === "years" ? "7 Years" : "84 Months"}</span>
                      </div>
                    </div>

                    {/* Processing Fee */}
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <label className="text-lg font-semibold text-gray-900">Processing Fee (%)</label>
                          <div className="group relative">
                            <span className="text-gray-400 cursor-help"></span>
                            <div className="invisible group-hover:visible absolute bottom-6 left-0 bg-gray-800 text-white text-xs p-2 rounded w-48 z-10">
                              One-time fee charged by lender for processing your loan
                            </div>
                          </div>
                        </div>
                        <div className="bg-orange-500 text-white px-4 py-2 rounded-lg font-bold">
                          {processingFee}%
                        </div>
                      </div>
                      {/* <input 
                        type="range" 
                        min="0" 
                        max="5" 
                        step="0.1"
                        value={processingFee}
                        onChange={(e) => setProcessingFee(Number(e.target.value))}
                        className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer orange-slider"
                      /> */}
                      <input
                          type="range"
                          min="0"
                          max="5"
                          step="0.1"
                          value={processingFee}
                          onChange={(e) => setProcessingFee(Number(e.target.value))}
                          className="w-full h-3 bg-gray-200 rounded-lg cursor-pointer orange-slider"
                          style={{ '--fill-percent': getFillPercentage(processingFee, 0, 5) } as React.CSSProperties}
                      />
                      <div className="flex justify-between text-sm text-gray-500">
                        <span>0%</span>
                        <span>5%</span>
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
                        Apply for Personal Loan
                      </Button>
                    </div>

                    {/* Breakdown */}
                    <div className="space-y-4">
                      <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                        <span className="text-gray-600">Principal Amount</span>
                        <span className="font-bold text-gray-900">{formatCurrency(loanAmount)}</span>
                      </div>
                      
                      <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                        <span className="text-gray-600">Processing Fee</span>
                        <span className="font-bold text-orange-600">{formatCurrency(processingFeeAmount)}</span>
                      </div>
                      
                      <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                        <span className="text-gray-600">Total Interest</span>
                        <span className="font-bold text-gray-900">{formatCurrency(totalInterest)}</span>
                      </div>
                      
                      <div className="flex justify-between items-center p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
                        <span className="text-green-700 font-semibold">Total Amount Payable</span>
                        <span className="font-bold text-green-700 text-lg">{formatCurrency(displayTotalAmount)}</span>
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

        {/* About Personal Loans Section */}
        <section id="about" className="py-16 bg-gray-50">
          <div className="space-y-12">
            <div className="text-center mb-12">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                What is a Personal Loan?
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Understanding personal loans - your flexible financial solution
              </p>
            </div>

            <Card className="shadow-xl border-0">
              <CardContent className="p-8">
                <div className="space-y-8">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">Definition & Purpose</h3>
                    <p className="text-gray-700 leading-relaxed text-lg">
                      A personal loan is an unsecured loan that doesn't require any collateral or security. 
                      Banks and financial institutions provide these loans based on your creditworthiness, 
                      income, and repayment capacity. The funds can be used for various personal purposes 
                      like medical emergencies, wedding expenses, travel, debt consolidation, or home renovation.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">How Personal Loans Work</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 bg-[#0050B2] rounded-full flex items-center justify-center text-white font-bold text-sm">1</div>
                          <div>
                            <h4 className="font-semibold text-gray-900">Application & Documentation</h4>
                            <p className="text-gray-600 text-sm">Submit online application with minimal documents</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 bg-[#0050B2] rounded-full flex items-center justify-center text-white font-bold text-sm">2</div>
                          <div>
                            <h4 className="font-semibold text-gray-900">Credit Assessment</h4>
                            <p className="text-gray-600 text-sm">Lender evaluates your credit score and income</p>
                          </div>
                        </div>
                      </div>
                      <div className="space-y-4">
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 bg-[#0050B2] rounded-full flex items-center justify-center text-white font-bold text-sm">3</div>
                          <div>
                            <h4 className="font-semibold text-gray-900">Approval & Disbursal</h4>
                            <p className="text-gray-600 text-sm">Quick approval and funds transfer to your account</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 bg-[#0050B2] rounded-full flex items-center justify-center text-white font-bold text-sm">4</div>
                          <div>
                            <h4 className="font-semibold text-gray-900">EMI Repayment</h4>
                            <p className="text-gray-600 text-sm">Fixed monthly installments until loan closure</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-6">Key Features</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {[
                        { icon: "🚀", title: "Quick Approval", desc: "Get approved in minutes with minimal documentation" },
                        { icon: "💳", title: "No Collateral", desc: "Unsecured loan - no assets required as security" },
                        { icon: "🎯", title: "Multipurpose", desc: "Use funds for any personal financial need" },
                        { icon: "⚡", title: "Instant Disbursal", desc: "Funds transferred directly to your bank account" },
                        { icon: "📱", title: "Digital Process", desc: "Complete application and approval online" },
                        { icon: "💰", title: "Fixed EMI", desc: "Predictable monthly payments for easy budgeting" }
                      ].map((feature, index) => (
                        <div key={index} className="p-4 bg-gray-50 rounded-xl">
                          <div className="text-2xl mb-2">{feature.icon}</div>
                          <h4 className="font-semibold text-gray-900 mb-2">{feature.title}</h4>
                          <p className="text-gray-600 text-sm">{feature.desc}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-6">Eligibility Criteria</h3>
                      <div className="space-y-4">
                        {[
                          "Age: 21-60 years for salaried, 25-65 for self-employed",
                          "Income: Minimum ₹15,000 per month for salaried individuals",
                          "Employment: Minimum 1 year total experience",
                          "Credit Score: 650+ minimum, 750+ for best rates",
                          "Debt-to-Income Ratio: Should not exceed 50%",
                          "Bank Relationship: Existing customers may get preferred rates"
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
                          "Identity Proof (Aadhaar, PAN, Passport, Voter ID)",
                          "Address Proof (Utility bills, Rental agreement)",
                          "Income Proof (Salary slips, ITR, Bank statements)",
                          "Employment Proof (Offer letter, ID card)",
                          "Bank Statements (last 3-6 months)",
                          "Photographs (passport size)"
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
                Types of Personal Loans
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Choose the right personal loan type based on your specific needs
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {personalLoanTypes.map((loan, index) => (
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

        {/* Benefits & Uses Section */}
        <section id="benefits" className="py-16 bg-gray-50">
          <div className="space-y-12">
            <div className="text-center mb-12">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                Personal Loan Benefits & Common Uses
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Understanding how personal loans can help achieve your financial goals
              </p>
            </div>

            {/* Interest Rate Factors */}
            <div className="space-y-8">
              {interestRateFactors.map((factor, index) => (
                <Card key={index} className="shadow-xl border-0">
                  <CardContent className="p-8">
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">{factor.factor}</h3>
                        <p className="text-gray-600 text-lg">{factor.definition}</p>
                      </div>

                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead className="bg-[#0050B2] text-white">
                            <tr>
                              <th className="px-4 py-3 text-left">Range</th>
                              <th className="px-4 py-3 text-left">Interest Rate</th>
                              <th className="px-4 py-3 text-left">Status</th>
                            </tr>
                          </thead>
                          <tbody>
                            {factor.ranges.map((range, rangeIndex) => (
                              <tr key={rangeIndex} className={rangeIndex % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                                <td className="px-4 py-3 font-semibold">{range.score}</td>
                                <td className="px-4 py-3 font-bold text-[#0050B2]">{range.rate}</td>
                                <td className="px-4 py-3">
                                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                    range.status.includes('Excellent') || range.status.includes('Premium') ? 'bg-green-100 text-green-800' :
                                    range.status.includes('Good') || range.status.includes('Standard') ? 'bg-blue-100 text-blue-800' :
                                    range.status.includes('Fair') || range.status.includes('Higher') ? 'bg-yellow-100 text-yellow-800' :
                                    'bg-red-100 text-red-800'
                                  }`}>
                                    {range.status}
                                  </span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Common Uses */}
            <Card className="shadow-xl border-0">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">Common Uses of Personal Loans</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[
                    { icon: "🏥", title: "Medical Expenses", desc: "Emergency medical treatments, surgeries, health procedures" },
                    { icon: "💒", title: "Wedding Expenses", desc: "Wedding ceremonies, reception, honeymoon, jewelry" },
                    { icon: "🏠", title: "Home Renovation", desc: "Interior design, furniture, appliances, repairs" },
                    { icon: "✈️", title: "Travel & Vacation", desc: "Holiday trips, family vacations, international travel" },
                    { icon: "🎓", title: "Education", desc: "Course fees, training programs, skill development" },
                    { icon: "💳", title: "Debt Consolidation", desc: "Combine multiple debts into single loan" },
                    { icon: "💼", title: "Business Needs", desc: "Small business funding, working capital" },
                    { icon: "🚗", title: "Vehicle Purchase", desc: "Two-wheelers, used cars, down payment" },
                    { icon: "💍", title: "Jewelry Purchase", desc: "Gold, diamond jewelry, special occasions" }
                  ].map((use, index) => (
                    <div key={index} className="p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
                      <div className="text-3xl mb-3 text-center">{use.icon}</div>
                      <h4 className="font-semibold text-gray-900 mb-2 text-center">{use.title}</h4>
                      <p className="text-gray-600 text-sm text-center">{use.desc}</p>
                    </div>
                  ))}
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
                Important details about fees, charges, and other considerations
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
                      { fee: "Processing Fee", amount: "1% - 4% of loan amount" },
                      { fee: "Administrative Charges", amount: "₹500 - ₹2,000" },
                      { fee: "Documentation Charges", amount: "₹500 - ₹1,500" },
                      { fee: "Credit Verification", amount: "₹300 - ₹1,000" },
                      { fee: "Prepayment Charges", amount: "2% - 5% (varies by lender)" },
                      { fee: "Late Payment Penalty", amount: "₹500 - ₹1,500 per default" },
                      { fee: "Cheque Bounce Charges", amount: "₹400 - ₹750 per instance" },
                      { fee: "Loan Cancellation", amount: "₹3,000 - ₹5,000" }
                    ].map((item, index) => (
                      <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <span className="text-gray-700 font-medium">{item.fee}</span>
                        <span className="text-gray-900 font-semibold">{item.amount}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Factors Affecting Interest Rates */}
              <Card className="shadow-xl border-0">
                <CardContent className="p-8">
                  <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                    <TrendingUpIcon className="w-6 h-6 text-green-600" />
                    Factors Affecting Interest Rates
                  </h3>
                  <div className="space-y-4">
                    {[
                      { factor: "Credit Score", impact: "Higher score = Lower rates" },
                      { factor: "Monthly Income", impact: "Higher income = Better rates" },
                      { factor: "Employment Type", impact: "Stable job = Preferred rates" },
                      { factor: "Loan Amount", impact: "Higher amount = Better rates" },
                      { factor: "Loan Tenure", impact: "Shorter tenure = Lower rates" },
                      { factor: "Banking Relationship", impact: "Existing customer = Benefits" },
                      { factor: "Debt-to-Income Ratio", impact: "Lower ratio = Better rates" },
                      { factor: "Age", impact: "Younger borrowers = Better rates" }
                    ].map((item, index) => (
                      <div key={index} className="p-3 bg-blue-50 rounded-lg">
                        <div className="flex justify-between items-center">
                          <span className="text-blue-900 font-medium">{item.factor}</span>
                          <span className="text-blue-700 text-sm">{item.impact}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Prepayment Benefits */}
              <Card className="shadow-xl border-0">
                <CardContent className="p-8">
                  <h3 className="text-xl font-bold text-gray-900 mb-6">Prepayment Options & Benefits</h3>
                  <div className="space-y-6">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">Partial Prepayment</h4>
                      <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <CheckIcon className="w-4 h-4 text-green-600" />
                            <span className="text-green-800 text-sm">Reduces total interest burden</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <CheckIcon className="w-4 h-4 text-green-600" />
                            <span className="text-green-800 text-sm">Option to reduce EMI or tenure</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <CheckIcon className="w-4 h-4 text-green-600" />
                            <span className="text-green-800 text-sm">Improves debt-to-income ratio</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">Full Prepayment</h4>
                      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <CheckIcon className="w-4 h-4 text-blue-600" />
                            <span className="text-blue-800 text-sm">Close loan before tenure completion</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <CheckIcon className="w-4 h-4 text-blue-600" />
                            <span className="text-blue-800 text-sm">Maximum interest savings</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <CheckIcon className="w-4 h-4 text-blue-600" />
                            <span className="text-blue-800 text-sm">Improve credit utilization</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                      <p className="text-yellow-800 text-sm">
                        <strong>Note:</strong> Some lenders charge prepayment penalties ranging from 2-5% of outstanding amount. 
                        Check with your lender for specific terms and conditions.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Application Tips */}
              <Card className="shadow-xl border-0">
                <CardContent className="p-8">
                  <h3 className="text-xl font-bold text-gray-900 mb-6">Tips for Better Loan Approval</h3>
                  <div className="space-y-4">
                    {[
                      "Maintain a good credit score (750+) for better interest rates",
                      "Have a stable employment history of at least 1 year",
                      "Keep debt-to-income ratio below 40% for better approval chances",
                      "Provide accurate information in your loan application",
                      "Choose loan tenure wisely - shorter tenure saves interest",
                      "Compare offers from multiple lenders before deciding",
                      "Maintain healthy bank balance and transaction history",
                      "Avoid applying to multiple lenders simultaneously"
                    ].map((tip, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <div className="w-6 h-6 bg-gradient-to-r from-[#0050B2] to-[#003d8a] rounded-full flex items-center justify-center text-white font-bold text-xs">
                          {index + 1}
                        </div>
                        <span className="text-gray-700">{tip}</span>
                      </div>
                    ))}
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
                      q: "What is the maximum personal loan amount I can get?",
                      a: "Personal loan amounts typically range from ₹25,000 to ₹50 lakhs, depending on your income, credit score, and lender policies. Most lenders offer loans up to 10-15 times your monthly salary."
                    },
                    {
                      q: "How is personal loan EMI calculated?",
                      a: "Personal loan EMI is calculated using the formula: [P x R x (1+R)^N] / [(1+R)^N-1], where P is principal amount, R is monthly interest rate, and N is tenure in months."
                    },
                    {
                      q: "Can I get a personal loan with a low credit score?",
                      a: "Yes, but with conditions. A credit score below 650 may result in higher interest rates, lower loan amounts, or additional requirements like co-signers or income proof."
                    },
                    {
                      q: "What documents are required for personal loan approval?",
                      a: "Key documents include identity proof (Aadhaar/PAN), address proof, income proof (salary slips/ITR), bank statements (3-6 months), and employment proof."
                    },
                    {
                      q: "How long does personal loan approval take?",
                      a: "With complete documentation, personal loans can be approved within 24-48 hours. Some lenders offer instant approval for pre-qualified customers with good credit scores."
                    },
                    {
                      q: "Can I use a personal loan for any purpose?",
                      a: "Yes, personal loans are multipurpose and can be used for medical expenses, wedding costs, travel, education, debt consolidation, or any other personal financial need."
                    },
                    {
                      q: "What happens if I default on personal loan payments?",
                      a: "Defaulting can result in penalty charges, negative impact on credit score, legal action, and difficulty in getting future loans. Contact your lender immediately if facing payment difficulties."
                    },
                    {
                      q: "Is personal loan interest tax deductible?",
                      a: "Generally, personal loan interest is not tax deductible unless the loan is used for specific purposes like home improvement, business, or education that qualify for tax benefits."
                    }
                  ].map((faq, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg">
                      <button
                        onClick={() => setExpandedFaq(expandedFaq === `faq-${index}` ? null : `faq-${index}`)}
                        className="w-full p-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors duration-200"
                      >
                        <span className="font-semibold text-gray-900 pr-4">{faq.q}</span>
                        {expandedFaq === `faq-${index}` ? (
                          <ChevronUpIcon className="w-5 h-5 text-gray-500 flex-shrink-0" />
                        ) : (
                          <ChevronDownIcon className="w-5 h-5 text-gray-500 flex-shrink-0" />
                        )}
                      </button>
                      {expandedFaq === `faq-${index}` && (
                        <div className="px-4 pb-4 border-t border-gray-200">
                          <p className="text-gray-700 mt-3 leading-relaxed">{faq.a}</p>
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