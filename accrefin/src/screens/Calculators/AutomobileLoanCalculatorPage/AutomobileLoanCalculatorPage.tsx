import React, { useState, useEffect, useMemo } from "react";
import { useLoanCalculator } from '../../../hooks/useLoanCalculator';
import { Button } from "../../../components/ui/button";
import { Card, CardContent } from "../../../components/ui/card";
import { CheckIcon, ChevronDownIcon, ChevronUpIcon, CarIcon, TrendingUpIcon, ShieldIcon, DollarSignIcon, CalendarIcon, PercentIcon, PrinterIcon, RotateCcwIcon, InfoIcon } from "lucide-react";
import { CalculatorInputs } from './CalculatorInputs';
import { ResultsPanel } from './ResultsPanel';
import { AmortizationTable } from './AmortizationTable';
import { generateAmortization, AmortRow } from '../../../utils/calculations';
import { formatCurrency, getFillPercentage } from '../../../utils/formatters';

export const AutomobileLoanCalculatorPage = (): JSX.Element => {
  // Calculator state
  const [loanAmount, setLoanAmount] = useState(800000);
  const [interestRate, setInterestRate] = useState(9.5);
  const [loanTenure, setLoanTenure] = useState(5);
  const [tenureType, setTenureType] = useState<'years' | 'months'>("years"); // years or months
  const [processingFee, setProcessingFee] = useState(1.5); // percentage
  const [vehicleType, setVehicleType] = useState("new-car");
  const { emi, totalAmount, totalInterest } = useLoanCalculator({ loanAmount, interestRate, loanTenure, tenureType });
  
  // UI state
  const [activeSection, setActiveSection] = useState("calculator");
  const [showAmortization, setShowAmortization] = useState(false);
  const [expandedFaq, setExpandedFaq] = useState<string | null>(null);
  const [isTabSticky, setIsTabSticky] = useState(false);
  const [showTooltip, setShowTooltip] = useState<string | null>(null);

  // Vehicle type configurations
  const vehicleConfigs = {
    "new-car": { label: "New Car", minRate: 7.5, maxRate: 14, maxAmount: 10000000 },
    "used-car": { label: "Used Car", minRate: 9.5, maxRate: 18, maxAmount: 5000000 },
    "two-wheeler": { label: "Two Wheeler", minRate: 8.5, maxRate: 16, maxAmount: 500000 },
    "commercial": { label: "Commercial Vehicle", minRate: 10, maxRate: 20, maxAmount: 20000000 }
  };

  // calculation handled by useLoanCalculator; compute processing fee locally
  const processingFeeAmount = (loanAmount * processingFee) / 100;
  const displayTotalAmount = totalAmount + processingFeeAmount;

  // Scroll spy functionality
  useEffect(() => {
    const handleScroll = () => {
      const heroSection = document.getElementById('hero-section');
      if (heroSection) {
        const heroBottom = heroSection.offsetTop + heroSection.offsetHeight;
        setIsTabSticky(window.scrollY > heroBottom - 100);
      }

      const sections = ['calculator', 'about', 'types', 'rates', 'info'];
      const scrollPosition = window.scrollY + 150;

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
      const offset = isTabSticky ? 80 : 0;
      const elementPosition = element.offsetTop - offset;
      window.scrollTo({
        top: elementPosition,
        behavior: 'smooth'
      });
    }
  };

  // Reset calculator
  const resetCalculator = () => {
    setLoanAmount(800000);
    setInterestRate(9.5);
    setLoanTenure(5);
    setTenureType("years");
    setProcessingFee(1.5);
    setVehicleType("new-car");
  };

  // Print functionality
  const handlePrint = () => {
    const printContent = `
      <div style="font-family: Arial, sans-serif; padding: 20px;">
        <h1>Automobile Loan Calculator Report</h1>
        <h2>Loan Details:</h2>
        <p><strong>Vehicle Type:</strong> ${vehicleConfigs[vehicleType as keyof typeof vehicleConfigs].label}</p>
        <p><strong>Loan Amount:</strong> ${formatCurrency(loanAmount)}</p>
        <p><strong>Interest Rate:</strong> ${interestRate}% per annum</p>
        <p><strong>Loan Tenure:</strong> ${loanTenure} ${tenureType}</p>
        <p><strong>Processing Fee:</strong> ${processingFee}%</p>
        <h2>Calculation Results:</h2>
        <p><strong>Monthly EMI:</strong> ${formatCurrency(emi)}</p>
        <p><strong>Total Amount Payable:</strong> ${formatCurrency(displayTotalAmount)}</p>
        <p><strong>Total Interest:</strong> ${formatCurrency(totalInterest)}</p>
        <p><strong>Processing Fee Amount:</strong> ${formatCurrency(processingFeeAmount)}</p>
        <p style="margin-top: 30px; font-size: 12px; color: #666;">Generated on: ${new Date().toLocaleDateString()}</p>
      </div>
    `;
    
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(printContent);
      printWindow.document.close();
      printWindow.print();
    }
  };

  // Amortization schedule (first 12 months) using shared utility
  const schedule: AmortRow[] = useMemo(() => generateAmortization(loanAmount, interestRate, loanTenure, tenureType as 'years' | 'months', emi, 12), [loanAmount, interestRate, loanTenure, tenureType, emi]);

  // Automobile loan types data
  const automobileLoanTypes = [
    {
      type: "New Car Loan",
      description: "Financing for brand new vehicles from authorized dealers",
      features: ["Up to 90% funding", "Lower interest rates", "Longer tenure options"],
      useCase: "Buying new cars from authorized dealerships",
      rateRange: "7.5% - 12%"
    },
    {
      type: "Used Car Loan",
      description: "Financing for pre-owned vehicles up to 5-7 years old",
      features: ["Up to 80% funding", "Quick approval", "Certified pre-owned cars"],
      useCase: "Purchasing used cars from dealers or individuals",
      rateRange: "9.5% - 16%"
    },
    {
      type: "Two Wheeler Loan",
      description: "Financing for motorcycles, scooters, and electric vehicles",
      features: ["Minimal documentation", "Quick processing", "Lower down payment"],
      useCase: "Buying new or used two-wheelers",
      rateRange: "8.5% - 15%"
    },
    {
      type: "Commercial Vehicle Loan",
      description: "Financing for trucks, buses, and commercial transportation",
      features: ["Higher loan amounts", "Business tax benefits", "Flexible repayment"],
      useCase: "Purchasing vehicles for business or commercial use",
      rateRange: "10% - 18%"
    },
    {
      type: "Electric Vehicle Loan",
      description: "Special financing for electric and hybrid vehicles",
      features: ["Government subsidies", "Lower interest rates", "Environmental benefits"],
      useCase: "Eco-friendly vehicle purchases with government support",
      rateRange: "7% - 12%"
    },
    {
      type: "Refinance Auto Loan",
      description: "Transfer existing vehicle loan for better rates",
      features: ["Lower EMI", "Better terms", "No prepayment charges"],
      useCase: "Switching from current lender for better deals",
      rateRange: "8% - 14%"
    }
  ];

  // Interest rate factors
  const rateFactors = [
    {
      factor: "Vehicle Type",
      impact: "New cars get lower rates than used cars",
      weight: "High"
    },
    {
      factor: "Credit Score",
      impact: "750+ gets best rates, below 650 may face higher rates",
      weight: "Very High"
    },
    {
      factor: "Down Payment",
      impact: "Higher down payment leads to lower interest rates",
      weight: "Medium"
    },
    {
      factor: "Income Level",
      impact: "Higher stable income qualifies for better rates",
      weight: "High"
    },
    {
      factor: "Loan Tenure",
      impact: "Shorter tenure may get slightly better rates",
      weight: "Low"
    },
    {
      factor: "Vehicle Age",
      impact: "Newer vehicles (0-3 years) get preferential rates",
      weight: "High"
    }
  ];

  // Navigation tabs
  const navigationTabs = [
    { id: "calculator", label: "EMI Calculator", icon: <CalendarIcon className="w-4 h-4" /> },
    { id: "about", label: "About Auto Loans", icon: <CarIcon className="w-4 h-4" /> },
    { id: "types", label: "Loan Types", icon: <TrendingUpIcon className="w-4 h-4" /> },
    { id: "rates", label: "Interest Rates", icon: <PercentIcon className="w-4 h-4" /> },
    { id: "info", label: "Additional Info", icon: <ShieldIcon className="w-4 h-4" /> }
  ];

  // Tooltip content
  const tooltips = {
    loanAmount: "The total amount you want to borrow to purchase your vehicle. This excludes your down payment.",
    interestRate: "The annual interest rate charged by the lender. Rates vary based on credit score, vehicle type, and lender.",
    tenure: "The period over which you'll repay the loan. Shorter tenure means higher EMI but lower total interest.",
    processingFee: "One-time fee charged by lenders for processing your loan application, usually 0.5% to 3% of loan amount.",
    vehicleType: "Select the type of vehicle you're financing as different vehicles have different interest rate ranges."
  };

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
              <span className="text-gray-600">Automobile Loan Calculator</span>
            </nav>
          </div>

          <div className="text-center max-w-4xl mx-auto">
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="w-16 h-16 bg-gradient-to-r from-[#0050B2] to-[#003d8a] rounded-2xl flex items-center justify-center shadow-lg">
                <CarIcon className="w-8 h-8 text-white" />
              </div>
            </div>
            
            <h1 className="text-4xl lg:text-5xl font-bold leading-tight mb-6">
              <span className="text-gray-900">Automobile Loan</span>
              <br />
              <span className="bg-gradient-to-r from-[#0050B2] to-[#003d8a] bg-clip-text text-transparent">
                EMI Calculator
              </span>
            </h1>
            
            <p className="text-xl text-gray-600 leading-relaxed mb-8">
              Calculate your vehicle loan EMI instantly and explore comprehensive information about automobile loans, 
              interest rates, and loan types for cars, bikes, and commercial vehicles.
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

      {/* Main Content */}
      <div className="container mx-auto max-w-7xl px-4">

        {/* Calculator Section */}
        <section id="calculator" className="py-16">
          <div className="space-y-12">
            <div className="text-center">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                Automobile Loan EMI Calculator
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Calculate your vehicle loan EMI for cars, bikes, and commercial vehicles with our advanced calculator
              </p>
            </div>

            <Card className="shadow-2xl border-0 rounded-2xl overflow-hidden">
              <CardContent className="p-8 lg:p-12">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                  <div>
                    <CalculatorInputs
                      loanAmount={loanAmount}
                      setLoanAmount={setLoanAmount}
                      interestRate={interestRate}
                      setInterestRate={setInterestRate}
                      loanTenure={loanTenure}
                      setLoanTenure={setLoanTenure}
                      tenureType={tenureType as 'years' | 'months'}
                      setTenureType={(v) => setTenureType(v)}
                      processingFee={processingFee}
                      setProcessingFee={setProcessingFee}
                      vehicleType={vehicleType}
                      setVehicleType={setVehicleType}
                      vehicleConfigs={vehicleConfigs}
                      resetCalculator={resetCalculator}
                      handlePrint={handlePrint}
                      showTooltip={showTooltip}
                      setShowTooltip={setShowTooltip}
                    />
                  </div>

                  <div>
                    <ResultsPanel
                      emi={emi}
                      totalInterest={totalInterest}
                      totalPayment={totalAmount}
                      principal={loanAmount}
                      processingFeeAmount={processingFeeAmount}
                      onApplyNow={() => alert('Apply flow coming soon')}
                    />

                    <div className="pt-4">
                      <Button
                        onClick={() => setShowAmortization(!showAmortization)}
                        variant="outline"
                        className="w-full border-[#0050B2] text-[#0050B2] hover:bg-[#0050B2] hover:text-white"
                      >
                        {showAmortization ? 'Hide' : 'Show'} Payment Schedule
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
                  <h3 className="text-xl font-bold text-gray-900 mb-6">Payment Schedule (First 12 Months)</h3>
                  <AmortizationTable schedule={schedule} />
                </CardContent>
              </Card>
            )}
          </div>
        </section>

        {/* About Auto Loans Section */}
        <section id="about" className="py-16 bg-gray-50">
          <div className="space-y-12">
            <div className="text-center mb-12">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                What is an Automobile Loan?
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Understanding automobile loans - your pathway to vehicle ownership
              </p>
            </div>

            <Card className="shadow-xl border-0">
              <CardContent className="p-8">
                <div className="space-y-8">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">Definition & Purpose</h3>
                    <p className="text-gray-700 leading-relaxed text-lg">
                      An automobile loan is a secured loan provided by banks and financial institutions to help individuals 
                      purchase vehicles including cars, motorcycles, and commercial vehicles. The vehicle itself serves as 
                      collateral, making it a lower-risk investment for lenders and resulting in competitive interest rates.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">How Automobile Loans Work</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 bg-[#0050B2] rounded-full flex items-center justify-center text-white font-bold text-sm">1</div>
                          <div>
                            <h4 className="font-semibold text-gray-900">Vehicle Selection</h4>
                            <p className="text-gray-600 text-sm">Choose your vehicle and get price quotation from dealer</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 bg-[#0050B2] rounded-full flex items-center justify-center text-white font-bold text-sm">2</div>
                          <div>
                            <h4 className="font-semibold text-gray-900">Loan Application</h4>
                            <p className="text-gray-600 text-sm">Submit application with required documents and down payment</p>
                          </div>
                        </div>
                      </div>
                      <div className="space-y-4">
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 bg-[#0050B2] rounded-full flex items-center justify-center text-white font-bold text-sm">3</div>
                          <div>
                            <h4 className="font-semibold text-gray-900">Vehicle Evaluation</h4>
                            <p className="text-gray-600 text-sm">Lender evaluates vehicle value and verifies documentation</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 bg-[#0050B2] rounded-full flex items-center justify-center text-white font-bold text-sm">4</div>
                          <div>
                            <h4 className="font-semibold text-gray-900">Loan Disbursal</h4>
                            <p className="text-gray-600 text-sm">Funds transferred to dealer and vehicle registration completed</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-6">Key Benefits</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {[
                        { icon: "🚗", title: "Immediate Ownership", desc: "Drive your vehicle home immediately without waiting" },
                        { icon: "💰", title: "Lower Down Payment", desc: "Pay as little as 10-20% upfront for most vehicles" },
                        { icon: "📈", title: "Build Credit History", desc: "Regular payments improve your credit score over time" },
                        { icon: "🔒", title: "Predictable Payments", desc: "Fixed EMI helps with monthly budget planning" },
                        { icon: "⚡", title: "Quick Approval", desc: "Fast processing and approval within 24-48 hours" },
                        { icon: "🛡️", title: "Flexible Tenure", desc: "Choose repayment period from 1 to 7 years" }
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
                          "Age: 21-65 years (some lenders up to 70)",
                          "Income: Minimum ₹15,000-₹20,000 per month",
                          "Employment: Stable job for at least 1-2 years",
                          "Credit Score: 650+ for approval, 750+ for best rates",
                          "Down Payment: 10-20% of vehicle's on-road price",
                          "Vehicle Age: New vehicles or used up to 5-7 years old"
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
                          "Identity Proof (Aadhaar, PAN, Passport, Driving License)",
                          "Address Proof (Utility bills, Rental agreement)",
                          "Income Proof (Salary slips, ITR, Bank statements)",
                          "Vehicle Documents (Invoice, Insurance, RC)",
                          "Employment Proof (Offer letter, ID card)",
                          "Photographs (Passport size, vehicle photos)"
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
                Types of Automobile Loans
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Choose the right vehicle loan type based on your specific needs
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {automobileLoanTypes.map((loan, index) => (
                <Card key={index} className="shadow-lg border-0 hover:shadow-xl transition-shadow duration-300">
                  <CardContent className="p-8">
                    <div className="space-y-6">
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="text-xl font-bold text-gray-900">{loan.type}</h3>
                          <span className="text-sm font-semibold text-[#0050B2] bg-blue-50 px-3 py-1 rounded-full">
                            {loan.rateRange}
                          </span>
                        </div>
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
                Interest Rate Factors
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Understanding what affects your automobile loan interest rates
              </p>
            </div>

            <Card className="shadow-xl border-0">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">Factors Affecting Your Interest Rate</h3>
                <div className="space-y-6">
                  {rateFactors.map((factor, index) => (
                    <div key={index} className="p-6 bg-gray-50 rounded-xl">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="text-lg font-bold text-gray-900 mb-2">{factor.factor}</h4>
                          <p className="text-gray-700">{factor.impact}</p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                          factor.weight === 'Very High' ? 'bg-red-100 text-red-700' :
                          factor.weight === 'High' ? 'bg-orange-100 text-orange-700' :
                          factor.weight === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-green-100 text-green-700'
                        }`}>
                          {factor.weight} Impact
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Rate Comparison Table */}
            <Card className="shadow-xl border-0">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">Interest Rate Comparison by Vehicle Type</h3>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-[#0050B2] text-white">
                      <tr>
                        <th className="px-6 py-4 text-left">Vehicle Type</th>
                        <th className="px-6 py-4 text-left">Interest Rate Range</th>
                        <th className="px-6 py-4 text-left">Max Loan Amount</th>
                        <th className="px-6 py-4 text-left">Max Tenure</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-gray-200">
                        <td className="px-6 py-4 font-semibold">New Car</td>
                        <td className="px-6 py-4">7.5% - 12%</td>
                        <td className="px-6 py-4">₹1 Crore</td>
                        <td className="px-6 py-4">7 Years</td>
                      </tr>
                      <tr className="border-b border-gray-200">
                        <td className="px-6 py-4 font-semibold">Used Car</td>
                        <td className="px-6 py-4">9.5% - 16%</td>
                        <td className="px-6 py-4">₹50 Lakh</td>
                        <td className="px-6 py-4">5 Years</td>
                      </tr>
                      <tr className="border-b border-gray-200">
                        <td className="px-6 py-4 font-semibold">Two Wheeler</td>
                        <td className="px-6 py-4">8.5% - 15%</td>
                        <td className="px-6 py-4">₹5 Lakh</td>
                        <td className="px-6 py-4">5 Years</td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 font-semibold">Commercial Vehicle</td>
                        <td className="px-6 py-4">10% - 18%</td>
                        <td className="px-6 py-4">₹2 Crore</td>
                        <td className="px-6 py-4">7 Years</td>
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
                Important details about fees, insurance, and other considerations
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
                      { fee: "Processing Fee", amount: "0.5% - 3% of loan amount" },
                      { fee: "Documentation Charges", amount: "₹1,000 - ₹5,000" },
                      { fee: "Valuation Charges", amount: "₹1,000 - ₹3,000" },
                      { fee: "Insurance Premium", amount: "₹5,000 - ₹25,000 annually" },
                      { fee: "Prepayment Charges", amount: "2% - 4% (after 12 months)" },
                      { fee: "Late Payment Penalty", amount: "2% - 3% per month" }
                    ].map((item, index) => (
                      <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <span className="text-gray-700 font-medium">{item.fee}</span>
                        <span className="text-gray-900 font-semibold">{item.amount}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Insurance Requirements */}
              <Card className="shadow-xl border-0">
                <CardContent className="p-8">
                  <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                    <ShieldIcon className="w-6 h-6 text-green-600" />
                    Insurance Requirements
                  </h3>
                  <div className="space-y-4">
                    <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                      <h4 className="font-semibold text-green-800 mb-2">Motor Insurance</h4>
                      <p className="text-green-700 text-sm">Mandatory comprehensive insurance covering theft, accidents, and third-party liability</p>
                    </div>
                    <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <h4 className="font-semibold text-blue-800 mb-2">Gap Insurance</h4>
                      <p className="text-blue-700 text-sm">Optional coverage for the difference between loan balance and vehicle value</p>
                    </div>
                    <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                      <h4 className="font-semibold text-purple-800 mb-2">Extended Warranty</h4>
                      <p className="text-purple-700 text-sm">Additional protection for vehicle components beyond manufacturer warranty</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Down Payment Guide */}
              <Card className="shadow-xl border-0">
                <CardContent className="p-8">
                  <h3 className="text-xl font-bold text-gray-900 mb-6">Down Payment Guidelines</h3>
                  <div className="space-y-4">
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <h4 className="font-semibold text-gray-900 mb-2">New Cars</h4>
                      <p className="text-gray-600 text-sm">10-20% down payment required, higher down payment gets better rates</p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <h4 className="font-semibold text-gray-900 mb-2">Used Cars</h4>
                      <p className="text-gray-600 text-sm">15-25% down payment, depends on vehicle age and condition</p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <h4 className="font-semibold text-gray-900 mb-2">Two Wheelers</h4>
                      <p className="text-gray-600 text-sm">5-15% down payment, some lenders offer zero down payment</p>
                    </div>
                    <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                      <p className="text-yellow-800 text-sm">
                        <strong>Tip:</strong> Higher down payment reduces EMI burden and total interest cost
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Prepayment Benefits */}
              <Card className="shadow-xl border-0">
                <CardContent className="p-8">
                  <h3 className="text-xl font-bold text-gray-900 mb-6">Prepayment Options</h3>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Partial Prepayment</h4>
                      <p className="text-gray-600 text-sm mb-3">Pay extra amount towards principal to reduce tenure or EMI</p>
                      <div className="flex items-center gap-2">
                        <CheckIcon className="w-4 h-4 text-green-600" />
                        <span className="text-green-700 text-sm">Significantly reduces total interest</span>
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
                    <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                      <p className="text-orange-800 text-sm">
                        <strong>Note:</strong> Most lenders allow prepayment after 12 months. 
                        Prepayment charges may apply (typically 2-4% of outstanding amount).
                      </p>
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
                      q: "What is the maximum loan amount for automobile loans?",
                      a: "Auto loan amounts vary by vehicle type: New cars up to ₹1 crore, used cars up to ₹50 lakh, two-wheelers up to ₹5 lakh, and commercial vehicles up to ₹2 crore."
                    },
                    {
                      q: "How is automobile loan EMI calculated?",
                      a: "EMI is calculated using the formula: [P x R x (1+R)^N] / [(1+R)^N-1], where P is principal, R is monthly interest rate, and N is tenure in months."
                    },
                    {
                      q: "Can I get a loan for a used vehicle?",
                      a: "Yes, most lenders offer loans for used vehicles. However, the vehicle should typically be less than 5-7 years old, and interest rates may be higher than new vehicle loans."
                    },
                    {
                      q: "What happens if I default on my auto loan?",
                      a: "Defaulting can result in penalty charges, negative credit score impact, and potential vehicle repossession by the lender. It's important to contact your lender if facing payment difficulties."
                    },
                    {
                      q: "Is vehicle insurance mandatory with auto loans?",
                      a: "Yes, comprehensive motor insurance is mandatory for the entire loan tenure. The insurance policy should show the lender as the beneficiary until the loan is fully repaid."
                    },
                    {
                      q: "Can I transfer my auto loan to another bank?",
                      a: "Yes, you can transfer your auto loan to get better interest rates or service. This process is called loan transfer or refinancing and may involve processing charges."
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