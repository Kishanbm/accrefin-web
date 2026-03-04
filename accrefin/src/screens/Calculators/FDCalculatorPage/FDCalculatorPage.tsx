import React, { useState, useEffect } from "react";
import { Button } from "../../../components/ui/button";
import { Card, CardContent } from "../../../components/ui/card";

import { CheckIcon, ChevronDownIcon, ChevronUpIcon, PiggyBankIcon, TrendingUpIcon, ShieldIcon, DollarSignIcon, CalendarIcon, PercentIcon, InfoIcon, PrinterIcon, RotateCcwIcon } from "lucide-react";

export const FDCalculatorPage = (): JSX.Element => {
  // Calculator state
  const [principalAmount, setPrincipalAmount] = useState(100000);
  const [interestRate, setInterestRate] = useState(6.5);
  const [tenure, setTenure] = useState(3);
  const [tenureType, setTenureType] = useState("years"); // years or months
  const [compoundingFrequency, setCompoundingFrequency] = useState("quarterly");
  const [maturityAmount, setMaturityAmount] = useState(0);
  const [totalInterest, setTotalInterest] = useState(0);
  const [effectiveRate, setEffectiveRate] = useState(0);
  
  // UI state
  const [activeSection, setActiveSection] = useState("calculator");
  const [showBreakdown, setShowBreakdown] = useState(false);
  const [expandedFaq, setExpandedFaq] = useState<string | null>(null);
  const [isTabSticky, setIsTabSticky] = useState(false);

  // Compounding frequency options
  const compoundingOptions = [
    { value: "monthly", label: "Monthly", frequency: 12 },
    { value: "quarterly", label: "Quarterly", frequency: 4 },
    { value: "half-yearly", label: "Half-Yearly", frequency: 2 },
    { value: "yearly", label: "Yearly", frequency: 1 }
  ];

  // Calculate FD maturity and other values
  useEffect(() => {
    const principal = principalAmount;
    const rate = interestRate / 100;
    const timeInYears = tenureType === "years" ? tenure : tenure / 12;
    const compoundingFreq = compoundingOptions.find(opt => opt.value === compoundingFrequency)?.frequency || 4;

    // Compound Interest Formula: A = P(1 + r/n)^(nt)
    const maturity = principal * Math.pow(1 + rate / compoundingFreq, compoundingFreq * timeInYears);
    const interest = maturity - principal;
    const effectiveAnnualRate = Math.pow(1 + rate / compoundingFreq, compoundingFreq) - 1;
    
    setMaturityAmount(maturity);
    setTotalInterest(interest);
    setEffectiveRate(effectiveAnnualRate * 100);
  }, [principalAmount, interestRate, tenure, tenureType, compoundingFrequency]);

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
    setPrincipalAmount(100000);
    setInterestRate(6.5);
    setTenure(3);
    setTenureType("years");
    setCompoundingFrequency("quarterly");
  };

  // Print functionality
  const handlePrint = () => {
    const printContent = `
      <div style="font-family: Arial, sans-serif; padding: 20px;">
        <h1 style="color: #0050B2; text-align: center;">Fixed Deposit Calculator Results</h1>
        <div style="margin: 20px 0;">
          <h3>Investment Details:</h3>
          <p>Principal Amount: ₹${principalAmount.toLocaleString('en-IN')}</p>
          <p>Interest Rate: ${interestRate}% per annum</p>
          <p>Tenure: ${tenure} ${tenureType}</p>
          <p>Compounding: ${compoundingOptions.find(opt => opt.value === compoundingFrequency)?.label}</p>
        </div>
        <div style="margin: 20px 0;">
          <h3>Results:</h3>
          <p>Maturity Amount: ₹${maturityAmount.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</p>
          <p>Total Interest Earned: ₹${totalInterest.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</p>
          <p>Effective Annual Rate: ${effectiveRate.toFixed(2)}%</p>
        </div>
        <div style="margin-top: 30px; text-align: center; color: #666;">
          <p>Generated on ${new Date().toLocaleDateString('en-IN')}</p>
          <p>Accrefin - Fixed Deposit Calculator</p>
        </div>
      </div>
    `;
    
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(printContent);
      printWindow.document.close();
      printWindow.print();
      printWindow.close();
    }
  };

  // Generate year-wise breakdown
  const generateYearlyBreakdown = () => {
    const breakdown = [];
    const principal = principalAmount;
    const rate = interestRate / 100;
    const compoundingFreq = compoundingOptions.find(opt => opt.value === compoundingFrequency)?.frequency || 4;
    const totalYears = tenureType === "years" ? tenure : Math.ceil(tenure / 12);

    for (let year = 1; year <= Math.min(totalYears, 10); year++) {
      const amount = principal * Math.pow(1 + rate / compoundingFreq, compoundingFreq * year);
      const interest = amount - principal;
      breakdown.push({
        year,
        amount,
        interest,
        growth: ((amount - principal) / principal) * 100
      });
    }
    return breakdown;
  };

  const yearlyBreakdown = generateYearlyBreakdown();

  // Format currency
  const formatCurrency = (amount: number) => {
    return `₹${amount.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`;
  };

  const getFillPercentage = (value: number, min: number, max: number): string => {
    const numValue = Number(value);
    const numMin = Number(min);
    const numMax = Number(max);

    if (numMax === numMin) return '0%';
    
    const percentage = ((numValue - numMin) / (numMax - numMin)) * 100;
    
    return `${Math.max(0, Math.min(100, percentage))}%`;
};

  // FD types data
  const fdTypes = [
    {
      type: "Regular Fixed Deposit",
      description: "Standard FD with fixed tenure and guaranteed returns",
      features: ["Fixed interest rate", "Guaranteed returns", "Premature withdrawal allowed"],
      tenure: "7 days to 10 years",
      bestFor: "Conservative investors seeking guaranteed returns"
    },
    {
      type: "Tax Saver FD",
      description: "5-year lock-in FD with tax benefits under Section 80C",
      features: ["Tax deduction up to ₹1.5 lakh", "5-year lock-in", "No premature withdrawal"],
      tenure: "5 years",
      bestFor: "Tax planning and long-term wealth creation"
    },
    {
      type: "Senior Citizen FD",
      description: "Higher interest rates for senior citizens (60+ years)",
      features: ["Additional 0.25-0.75% interest", "Same tenure options", "Special schemes"],
      tenure: "7 days to 10 years",
      bestFor: "Senior citizens looking for higher returns"
    },
    {
      type: "Flexi Fixed Deposit",
      description: "Combination of savings and FD with automatic sweep facility",
      features: ["Auto sweep facility", "Higher liquidity", "Optimized returns"],
      tenure: "1 year to 5 years",
      bestFor: "Maintaining liquidity while earning FD rates"
    },
    {
      type: "Cumulative FD",
      description: "Interest is compounded and paid at maturity",
      features: ["Compound interest", "Lump sum at maturity", "Higher effective returns"],
      tenure: "1 year to 10 years",
      bestFor: "Long-term wealth accumulation without regular income needs"
    },
    {
      type: "Non-Cumulative FD",
      description: "Regular interest payouts at chosen intervals",
      features: ["Regular income", "Interest paid monthly/quarterly", "Stable cash flow"],
      tenure: "1 year to 10 years",
      bestFor: "Regular income requirements and cash flow management"
    }
  ];

  // Interest rate comparison
  const interestComparison = [
    {
      bank: "SBI",
      generalRate: "5.00% - 6.50%",
      seniorRate: "5.50% - 7.25%",
      specialScheme: "SBI Wecare Deposit",
      minAmount: "₹1,000"
    },
    {
      bank: "HDFC Bank",
      generalRate: "3.00% - 7.00%",
      seniorRate: "3.50% - 7.50%",
      specialScheme: "HDFC FlexiDeposit",
      minAmount: "₹5,000"
    },
    {
      bank: "ICICI Bank",
      generalRate: "3.00% - 7.25%",
      seniorRate: "3.50% - 7.75%",
      specialScheme: "ICICI FD",
      minAmount: "₹1,000"
    },
    {
      bank: "Axis Bank",
      generalRate: "3.50% - 7.75%",
      seniorRate: "4.00% - 8.25%",
      specialScheme: "Axis Privilege FD",
      minAmount: "₹1,000"
    }
  ];

  // Navigation tabs
  const navigationTabs = [
    { id: "calculator", label: "FD Calculator", icon: <CalendarIcon className="w-4 h-4" /> },
    { id: "about", label: "About FDs", icon: <PiggyBankIcon className="w-4 h-4" /> },
    { id: "types", label: "FD Types", icon: <TrendingUpIcon className="w-4 h-4" /> },
    { id: "benefits", label: "Benefits", icon: <ShieldIcon className="w-4 h-4" /> },
    { id: "info", label: "Additional Info", icon: <InfoIcon className="w-4 h-4" /> }
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
              <span className="text-gray-600">Fixed Deposit Calculator</span>
            </nav>
          </div>

          <div className="text-center max-w-4xl mx-auto">
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="w-16 h-16 bg-gradient-to-r from-[#0050B2] to-[#003d8a] rounded-2xl flex items-center justify-center shadow-lg">
                <PiggyBankIcon className="w-8 h-8 text-white" />
              </div>
            </div>
            
            <h1 className="text-4xl lg:text-5xl font-bold leading-tight mb-6">
              <span className="text-gray-900">Fixed Deposit</span>
              <br />
              <span className="bg-gradient-to-r from-[#0050B2] to-[#003d8a] bg-clip-text text-transparent">
                Calculator
              </span>
            </h1>
            
            <p className="text-xl text-gray-600 leading-relaxed mb-8">
              Calculate your FD returns instantly with our advanced calculator. Compare different tenures, 
              interest rates, and compounding frequencies to maximize your savings growth.
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
                Fixed Deposit Calculator
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Calculate your FD maturity amount with our advanced calculator featuring compound interest and multiple compounding frequencies
              </p>
            </div>

            <Card className="shadow-2xl border-0 rounded-2xl overflow-hidden">
              <CardContent className="p-8 lg:p-12">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                  {/* Calculator Inputs */}
                  <div className="space-y-8">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-2xl font-bold text-gray-900">Calculate Your FD Returns</h3>
                      <div className="flex gap-2">
                        <Button
                          onClick={resetCalculator}
                          variant="outline"
                          size="sm"
                          className="border-gray-300 text-gray-600 hover:bg-gray-50"
                          title="Reset Calculator"
                        >
                          <RotateCcwIcon className="w-4 h-4 mr-2" />
                          Reset
                        </Button>
                        <Button
                          onClick={handlePrint}
                          variant="outline"
                          size="sm"
                          className="border-[#0050B2] text-[#0050B2] hover:bg-blue-50"
                          title="Print Results"
                        >
                          <PrinterIcon className="w-4 h-4 mr-2" />
                          Print
                        </Button>
                      </div>
                    </div>
                    
                    {/* Principal Amount */}
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <label className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                          Principal Amount
                          <div className="relative group">
                            <InfoIcon className="w-4 h-4 text-gray-400 cursor-help" />
                            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap z-10">
                              The initial amount you want to invest in FD
                            </div>
                          </div>
                        </label>
                        <div className="bg-[#0050B2] text-white px-4 py-2 rounded-lg font-bold">
                          {formatCurrency(principalAmount)}
                        </div>
                      </div>
                      {/* <input 
                        type="range" 
                        min="1000" 
                        max="10000000" 
                        step="1000"
                        value={principalAmount}
                        onChange={(e) => setPrincipalAmount(Number(e.target.value))}
                        className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                      /> */}

                      <input
                          type="range"
                          min="1000"
                          max="10000000"
                          step="1000"
                          value={principalAmount}
                          onChange={(e) => setPrincipalAmount(Number(e.target.value))}
                          className="w-full h-3 bg-gray-200 rounded-lg cursor-pointer slider"
                          style={{ '--fill-percent': getFillPercentage(principalAmount, 1000, 10000000) } as React.CSSProperties}
                      />
                      <div className="flex justify-between text-sm text-gray-500">
                        <span>₹1,000</span>
                        <span>₹1 Crore</span>
                      </div>
                    </div>

                    {/* Interest Rate */}
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <label className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                          Interest Rate (% p.a.)
                          <div className="relative group">
                            <InfoIcon className="w-4 h-4 text-gray-400 cursor-help" />
                            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap z-10">
                              Annual interest rate offered by the bank
                            </div>
                          </div>
                        </label>
                        <div className="bg-[#0050B2] text-white px-4 py-2 rounded-lg font-bold">
                          {interestRate}%
                        </div>
                      </div>
                      {/* <input 
                        type="range" 
                        min="0.1" 
                        max="15" 
                        step="0.1"
                        value={interestRate}
                        onChange={(e) => setInterestRate(Number(e.target.value))}
                        className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                      /> */}

                      <input
                          type="range"
                          min="0.1"
                          max="15"
                          step="0.1"
                          value={interestRate}
                          onChange={(e) => setInterestRate(Number(e.target.value))}
                          className="w-full h-3 bg-gray-200 rounded-lg cursor-pointer slider"
                          style={{ '--fill-percent': getFillPercentage(interestRate, 0.1, 15) } as React.CSSProperties}
                      />
                      <div className="flex justify-between text-sm text-gray-500">
                        <span>0.1%</span>
                        <span>15%</span>
                      </div>
                    </div>

                    {/* Tenure */}
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <label className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                          Investment Tenure
                          <div className="relative group">
                            <InfoIcon className="w-4 h-4 text-gray-400 cursor-help" />
                            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap z-10">
                              Duration for which you want to invest
                            </div>
                          </div>
                        </label>
                        <div className="flex items-center gap-2">
                          <div className="bg-[#0050B2] text-white px-4 py-2 rounded-lg font-bold">
                            {tenure} {tenureType}
                          </div>
                          <select 
                            value={tenureType}
                            onChange={(e) => setTenureType(e.target.value)}
                            className="bg-gray-100 border border-gray-300 rounded-lg px-3 py-2 text-sm"
                          >
                            <option value="years">Years</option>
                            <option value="months">Months</option>
                          </select>
                        </div>
                      </div>
                      {/* <input 
                        type="range" 
                        min={tenureType === "years" ? "1" : "1"}
                        max={tenureType === "years" ? "10" : "120"}
                        step="1"
                        value={tenure}
                        onChange={(e) => setTenure(Number(e.target.value))}
                        className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                      /> */}

                      <input
                          type="range"
                          min={tenureType === "years" ? "1" : "1"}
                          max={tenureType === "years" ? "10" : "120"}
                          step="1"
                          value={tenure}
                          onChange={(e) => setTenure(Number(e.target.value))}
                          className="w-full h-3 bg-gray-200 rounded-lg cursor-pointer slider"
                          style={{ '--fill-percent': getFillPercentage(tenure, Number(tenureType === 'years' ? '1' : '1'), Number(tenureType === 'years' ? '10' : '120')) } as React.CSSProperties}
                      />

                      <div className="flex justify-between text-sm text-gray-500">
                        <span>{tenureType === "years" ? "1 Year" : "1 Month"}</span>
                        <span>{tenureType === "years" ? "10 Years" : "120 Months"}</span>
                      </div>
                    </div>

                    {/* Compounding Frequency */}
                    <div className="space-y-4">
                      <label className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                        Compounding Frequency
                        <div className="relative group">
                          <InfoIcon className="w-4 h-4 text-gray-400 cursor-help" />
                          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap z-10">
                            How often interest is compounded
                          </div>
                        </div>
                      </label>
                      <div className="grid grid-cols-2 gap-3">
                        {compoundingOptions.map((option) => (
                          <button
                            key={option.value}
                            onClick={() => setCompoundingFrequency(option.value)}
                            className={`p-3 rounded-lg font-medium transition-all duration-300 ${
                              compoundingFrequency === option.value
                                ? 'bg-[#0050B2] text-white shadow-lg'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                          >
                            {option.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Results */}
                  <div className="space-y-6">
                    {/* Maturity Amount Display */}
                    <div className="bg-gradient-to-r from-[#0050B2] to-[#003d8a] rounded-2xl p-8 text-white text-center">
                      <h3 className="text-lg font-semibold mb-2 opacity-90">Maturity Amount</h3>
                      <div className="text-4xl font-bold mb-4">
                        {formatCurrency(maturityAmount)}
                      </div>
                      <Button className="bg-white text-[#0050B2] hover:bg-gray-100 font-semibold px-8 py-3 rounded-xl transition-all duration-300">
                        Open FD Account
                      </Button>
                    </div>

                    {/* Breakdown */}
                    <div className="space-y-4">
                      <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                        <span className="text-gray-600">Principal Amount</span>
                        <span className="font-bold text-gray-900">{formatCurrency(principalAmount)}</span>
                      </div>
                      
                      <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                        <span className="text-gray-600">Total Interest Earned</span>
                        <span className="font-bold text-gray-900">{formatCurrency(totalInterest)}</span>
                      </div>
                      
                      <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                        <span className="text-gray-600">Effective Annual Rate</span>
                        <span className="font-bold text-gray-900">{effectiveRate.toFixed(2)}%</span>
                      </div>
                      
                      <div className="flex justify-between items-center p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
                        <span className="text-green-700 font-semibold">Total Maturity Amount</span>
                        <span className="font-bold text-green-700 text-lg">{formatCurrency(maturityAmount)}</span>
                      </div>
                    </div>

                    {/* Year-wise Breakdown Toggle */}
                    <div className="pt-4">
                      <Button 
                        onClick={() => setShowBreakdown(!showBreakdown)}
                        variant="outline"
                        className="w-full border-[#0050B2] text-[#0050B2] hover:bg-[#0050B2] hover:text-white"
                      >
                        {showBreakdown ? 'Hide' : 'Show'} Year-wise Growth
                        {showBreakdown ? <ChevronUpIcon className="w-4 h-4 ml-2" /> : <ChevronDownIcon className="w-4 h-4 ml-2" />}
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Year-wise Breakdown */}
            {showBreakdown && (
              <Card className="shadow-xl border-0">
                <CardContent className="p-8">
                  <h3 className="text-xl font-bold text-gray-900 mb-6">Year-wise FD Growth</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-[#0050B2] text-white">
                        <tr>
                          <th className="px-4 py-3 text-left">Year</th>
                          <th className="px-4 py-3 text-left">Amount</th>
                          <th className="px-4 py-3 text-left">Interest Earned</th>
                          <th className="px-4 py-3 text-left">Growth %</th>
                        </tr>
                      </thead>
                      <tbody>
                        {yearlyBreakdown.map((row, index) => (
                          <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                            <td className="px-4 py-3 font-medium">{row.year}</td>
                            <td className="px-4 py-3">{formatCurrency(row.amount)}</td>
                            <td className="px-4 py-3">{formatCurrency(row.interest)}</td>
                            <td className="px-4 py-3 text-green-600 font-semibold">{row.growth.toFixed(2)}%</td>
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

        {/* About Fixed Deposits Section */}
        <section id="about" className="py-16 bg-gray-50">
          <div className="space-y-12">
            <div className="text-center mb-12">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                What is a Fixed Deposit?
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Understanding fixed deposits - your safest investment option with guaranteed returns
              </p>
            </div>

            <Card className="shadow-xl border-0">
              <CardContent className="p-8">
                <div className="space-y-8">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">Definition & Purpose</h3>
                    <p className="text-gray-700 leading-relaxed text-lg">
                      A Fixed Deposit (FD) is a financial instrument where you deposit a lump sum amount with a bank 
                      or financial institution for a fixed period at a predetermined interest rate. It's considered 
                      one of the safest investment options with guaranteed returns and capital protection.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">How Fixed Deposits Work</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 bg-[#0050B2] rounded-full flex items-center justify-center text-white font-bold text-sm">1</div>
                          <div>
                            <h4 className="font-semibold text-gray-900">Choose FD Type</h4>
                            <p className="text-gray-600 text-sm">Select tenure, amount, and interest payout option</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 bg-[#0050B2] rounded-full flex items-center justify-center text-white font-bold text-sm">2</div>
                          <div>
                            <h4 className="font-semibold text-gray-900">Deposit Amount</h4>
                            <p className="text-gray-600 text-sm">Transfer funds to the FD account with required documents</p>
                          </div>
                        </div>
                      </div>
                      <div className="space-y-4">
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 bg-[#0050B2] rounded-full flex items-center justify-center text-white font-bold text-sm">3</div>
                          <div>
                            <h4 className="font-semibold text-gray-900">Earn Interest</h4>
                            <p className="text-gray-600 text-sm">Interest accrues based on chosen compounding frequency</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 bg-[#0050B2] rounded-full flex items-center justify-center text-white font-bold text-sm">4</div>
                          <div>
                            <h4 className="font-semibold text-gray-900">Maturity</h4>
                            <p className="text-gray-600 text-sm">Receive principal plus accumulated interest at maturity</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-6">Key Features</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {[
                        { icon: "🔒", title: "Capital Protection", desc: "100% safety of your principal amount" },
                        { icon: "📈", title: "Guaranteed Returns", desc: "Fixed interest rate throughout the tenure" },
                        { icon: "💰", title: "Flexible Tenure", desc: "Choose from 7 days to 10 years" },
                        { icon: "🏦", title: "Easy Opening", desc: "Minimal documentation and quick processing" },
                        { icon: "💳", title: "Loan Against FD", desc: "Get loans up to 90% of FD value" },
                        { icon: "🎯", title: "Goal Planning", desc: "Perfect for specific financial goals" }
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
                          "Age: 18 years and above (no upper age limit)",
                          "Minimum Deposit: ₹1,000 (varies by bank)",
                          "Documents: KYC documents (Aadhaar, PAN, etc.)",
                          "Citizenship: Indian residents and NRIs eligible",
                          "Joint Account: Multiple holders allowed",
                          "Nomination: Facility available for smooth succession"
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
                          "Identity Proof (Aadhaar Card, Passport, Voter ID)",
                          "Address Proof (Utility bills, Rent agreement)",
                          "PAN Card (mandatory for deposits above ₹50,000)",
                          "Passport-size photographs",
                          "Initial deposit amount",
                          "Nomination form (optional but recommended)"
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

        {/* Types of FDs Section */}
        <section id="types" className="py-16 bg-white">
          <div className="space-y-12">
            <div className="text-center mb-12">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                Types of Fixed Deposits
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Choose the right FD type based on your investment goals and requirements
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {fdTypes.map((fd, index) => (
                <Card key={index} className="shadow-lg border-0 hover:shadow-xl transition-shadow duration-300">
                  <CardContent className="p-8">
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">{fd.type}</h3>
                        <p className="text-gray-600">{fd.description}</p>
                      </div>

                      <div>
                        <h4 className="font-semibold text-gray-900 mb-3">Key Features:</h4>
                        <div className="space-y-2">
                          {fd.features.map((feature, featureIndex) => (
                            <div key={featureIndex} className="flex items-center gap-2">
                              <CheckIcon className="w-4 h-4 text-green-600" />
                              <span className="text-gray-700 text-sm">{feature}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-blue-50 p-3 rounded-lg">
                          <h4 className="font-semibold text-blue-900 text-sm mb-1">Tenure</h4>
                          <p className="text-blue-800 text-sm">{fd.tenure}</p>
                        </div>
                        <div className="bg-green-50 p-3 rounded-lg">
                          <h4 className="font-semibold text-green-900 text-sm mb-1">Best For</h4>
                          <p className="text-green-800 text-sm">{fd.bestFor}</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section id="benefits" className="py-16 bg-gray-50">
          <div className="space-y-12">
            <div className="text-center mb-12">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                Benefits of Fixed Deposits
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Discover why FDs remain India's most trusted investment option
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  icon: "🛡️",
                  title: "100% Safety",
                  description: "DICGC insurance up to ₹5 lakhs per depositor per bank",
                  color: "bg-green-50 border-green-200"
                },
                {
                  icon: "📊",
                  title: "Guaranteed Returns",
                  description: "Fixed interest rate ensures predictable returns",
                  color: "bg-blue-50 border-blue-200"
                },
                {
                  icon: "💰",
                  title: "Tax Benefits",
                  description: "Tax-saving FDs offer deduction under Section 80C",
                  color: "bg-purple-50 border-purple-200"
                },
                {
                  icon: "🏦",
                  title: "Loan Facility",
                  description: "Get loans against your FD up to 90% of deposit value",
                  color: "bg-orange-50 border-orange-200"
                },
                {
                  icon: "⏰",
                  title: "Flexible Tenure",
                  description: "Choose from 7 days to 10 years based on your needs",
                  color: "bg-cyan-50 border-cyan-200"
                },
                {
                  icon: "💳",
                  title: "Easy Liquidity",
                  description: "Premature withdrawal facility with minimal penalty",
                  color: "bg-pink-50 border-pink-200"
                }
              ].map((benefit, index) => (
                <Card key={index} className={`shadow-lg border-2 ${benefit.color} hover:shadow-xl transition-all duration-300 hover:-translate-y-1`}>
                  <CardContent className="p-6 text-center">
                    <div className="text-4xl mb-4">{benefit.icon}</div>
                    <h3 className="text-lg font-bold text-gray-900 mb-3">{benefit.title}</h3>
                    <p className="text-gray-600 leading-relaxed">{benefit.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Interest Rate Comparison */}
            <Card className="shadow-xl border-0">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">Interest Rate Comparison</h3>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-[#0050B2] text-white">
                      <tr>
                        <th className="px-6 py-4 text-left">Bank</th>
                        <th className="px-6 py-4 text-left">General Rate</th>
                        <th className="px-6 py-4 text-left">Senior Citizen Rate</th>
                        <th className="px-6 py-4 text-left">Special Scheme</th>
                        <th className="px-6 py-4 text-left">Min. Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {interestComparison.map((bank, index) => (
                        <tr key={index} className={`border-b border-gray-200 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-blue-50 transition-colors duration-200`}>
                          <td className="px-6 py-4 font-semibold">{bank.bank}</td>
                          <td className="px-6 py-4">{bank.generalRate}</td>
                          <td className="px-6 py-4 text-green-600 font-semibold">{bank.seniorRate}</td>
                          <td className="px-6 py-4">{bank.specialScheme}</td>
                          <td className="px-6 py-4">{bank.minAmount}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <p className="text-sm text-gray-500 mt-4">
                  *Rates are indicative and subject to change. Please check with respective banks for current rates.
                </p>
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
                Important details about FD taxation, penalties, and investment strategies
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Tax Implications */}
              <Card className="shadow-xl border-0">
                <CardContent className="p-8">
                  <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                    <DollarSignIcon className="w-6 h-6 text-green-600" />
                    Tax Implications
                  </h3>
                  <div className="space-y-4">
                    <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                      <h4 className="font-semibold text-yellow-800 mb-2">TDS on Interest</h4>
                      <p className="text-yellow-700 text-sm">10% TDS deducted if annual interest exceeds ₹40,000 (₹50,000 for senior citizens)</p>
                    </div>
                    <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                      <h4 className="font-semibold text-green-800 mb-2">Tax-Saving FD</h4>
                      <p className="text-green-700 text-sm">Investment up to ₹1.5 lakh qualifies for tax deduction under Section 80C</p>
                    </div>
                    <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <h4 className="font-semibold text-blue-800 mb-2">Interest Taxation</h4>
                      <p className="text-blue-700 text-sm">FD interest is taxable as 'Income from Other Sources' at applicable slab rates</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Penalties & Charges */}
              <Card className="shadow-xl border-0">
                <CardContent className="p-8">
                  <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                    <ShieldIcon className="w-6 h-6 text-red-600" />
                    Penalties & Charges
                  </h3>
                  <div className="space-y-4">
                    {[
                      { charge: "Premature Withdrawal Penalty", amount: "0.5% - 1% reduction in interest rate" },
                      { charge: "Processing Charges", amount: "₹50 - ₹500 (varies by bank)" },
                      { charge: "Form 15G/15H Charges", amount: "₹50 - ₹100 for TDS exemption" },
                      { charge: "Auto-renewal Charges", amount: "Usually free" },
                      { charge: "Certificate Issuance", amount: "₹50 - ₹200" },
                      { charge: "Account Closure", amount: "₹100 - ₹500" }
                    ].map((item, index) => (
                      <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <span className="text-gray-700 font-medium">{item.charge}</span>
                        <span className="text-gray-900 font-semibold text-sm">{item.amount}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Investment Tips */}
              <Card className="shadow-xl border-0">
                <CardContent className="p-8">
                  <h3 className="text-xl font-bold text-gray-900 mb-6">Smart FD Investment Tips</h3>
                  <div className="space-y-4">
                    {[
                      "Ladder your FDs: Invest in multiple FDs with different maturity dates",
                      "Compare rates: Different banks offer different rates for same tenure",
                      "Consider inflation: Ensure FD returns beat inflation rate",
                      "Senior citizen benefits: Additional 0.25-0.75% interest for 60+ age",
                      "Form 15G/15H: Avoid TDS if total income is below taxable limit",
                      "Auto-renewal: Choose wisely as rates may change at renewal"
                    ].map((tip, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mt-0.5">
                          <span className="text-blue-600 font-bold text-xs">{index + 1}</span>
                        </div>
                        <span className="text-gray-700">{tip}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* FD vs Other Investments */}
              <Card className="shadow-xl border-0">
                <CardContent className="p-8">
                  <h3 className="text-xl font-bold text-gray-900 mb-6">FD vs Other Investments</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-100">
                        <tr>
                          <th className="px-4 py-3 text-left">Parameter</th>
                          <th className="px-4 py-3 text-left">Fixed Deposit</th>
                          <th className="px-4 py-3 text-left">Mutual Funds</th>
                          <th className="px-4 py-3 text-left">PPF</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b">
                          <td className="px-4 py-3 font-medium">Safety</td>
                          <td className="px-4 py-3 text-green-600">Very High</td>
                          <td className="px-4 py-3 text-orange-600">Market Risk</td>
                          <td className="px-4 py-3 text-green-600">Government Backed</td>
                        </tr>
                        <tr className="border-b">
                          <td className="px-4 py-3 font-medium">Returns</td>
                          <td className="px-4 py-3">6-8% Fixed</td>
                          <td className="px-4 py-3">8-15% Variable</td>
                          <td className="px-4 py-3">7-8% Fixed</td>
                        </tr>
                        <tr className="border-b">
                          <td className="px-4 py-3 font-medium">Liquidity</td>
                          <td className="px-4 py-3 text-orange-600">Medium</td>
                          <td className="px-4 py-3 text-green-600">High</td>
                          <td className="px-4 py-3 text-red-600">15 years lock-in</td>
                        </tr>
                        <tr>
                          <td className="px-4 py-3 font-medium">Tax Benefit</td>
                          <td className="px-4 py-3">Tax-saving FD only</td>
                          <td className="px-4 py-3">ELSS only</td>
                          <td className="px-4 py-3 text-green-600">Yes (80C)</td>
                        </tr>
                      </tbody>
                    </table>
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
                      q: "What is the minimum amount required to open an FD?",
                      a: "Most banks require a minimum deposit of ₹1,000 to open a fixed deposit account. However, this amount may vary between banks, with some requiring ₹5,000 or ₹10,000 as minimum deposit."
                    },
                    {
                      q: "Can I withdraw my FD before maturity?",
                      a: "Yes, you can withdraw your FD before maturity, but banks charge a penalty typically ranging from 0.5% to 1% reduction in the applicable interest rate. The penalty varies by bank and tenure remaining."
                    },
                    {
                      q: "How is FD interest calculated?",
                      a: "FD interest is calculated using compound interest formula: A = P(1 + r/n)^(nt), where P is principal, r is annual rate, n is compounding frequency, and t is time in years."
                    },
                    {
                      q: "What happens to my FD at maturity?",
                      a: "At maturity, most banks automatically renew your FD for the same tenure at prevailing interest rates unless you provide different instructions. You can also choose to withdraw the entire amount."
                    },
                    {
                      q: "Are FD returns better than savings account?",
                      a: "Yes, FD typically offers higher returns (6-8%) compared to savings account (3-4%). However, FDs have lock-in period while savings accounts offer instant liquidity."
                    },
                    {
                      q: "Can NRIs invest in Indian FDs?",
                      a: "Yes, NRIs can invest in NRE and NRO fixed deposits. NRE FDs are tax-free in India and funds are freely repatriable, while NRO FDs are subject to Indian tax laws."
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