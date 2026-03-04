import React, { useState, useEffect } from "react";
import { useLoanCalculator } from '../../../hooks/useLoanCalculator';
import { Card, CardContent } from "../../../components/ui/card";
import { CheckIcon, ChevronDownIcon, ChevronUpIcon, BuildingIcon, TrendingUpIcon, ShieldIcon, DollarSignIcon, CalendarIcon, PercentIcon } from "lucide-react";
import { formatCurrency } from '../../../utils/formatters';
import { CalculatorInputs } from "./CalculatorInputs";
import { ResultsPanel } from "./ResultsPanel";
import { AmortizationTable } from "./AmortizationTable";
import { generateAmortization } from '../../../utils/calculations';

export const BusinessLoanCalculatorPage = (): JSX.Element => {
  // Calculator state
  const [loanAmount, setLoanAmount] = useState<number>(1000000);
  const [interestRate, setInterestRate] = useState<number>(12);
  const [loanTenure, setLoanTenure] = useState<number>(3);
  const [tenureType, setTenureType] = useState<'years' | 'months'>('years'); // years or months
  const [processingFeeRate, setProcessingFeeRate] = useState<number>(2);
  const { emi, totalAmount, totalInterest } = useLoanCalculator({ loanAmount, interestRate, loanTenure, tenureType });
  
  // UI state
  const [activeSection, setActiveSection] = useState("calculator");
  const [showAmortization, setShowAmortization] = useState(false);
  const [expandedFaq, setExpandedFaq] = useState<string | null>(null);
  const [isTabSticky, setIsTabSticky] = useState(false);
  const [showTooltip, setShowTooltip] = useState<string | null>(null);

  // calculation handled by useLoanCalculator; compute processing fee locally
  const processingFeeAmount = (loanAmount * processingFeeRate) / 100;
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

  // Reset calculator
  const resetCalculator = () => {
    setLoanAmount(1000000);
    setInterestRate(12);
    setLoanTenure(3);
    setTenureType("years");
    setProcessingFeeRate(2);
    setShowAmortization(false);
  };

  // Print functionality
  const handlePrint = () => {
    const printContent = `
      <html>
        <head>
          <title>Business Loan Calculator Results</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            h1 { color: #0050B2; border-bottom: 2px solid #0050B2; padding-bottom: 10px; }
            .result-item { margin: 10px 0; padding: 10px; background: #f5f5f5; border-radius: 5px; }
            .highlight { background: #0050B2; color: white; font-weight: bold; padding: 15px; border-radius: 5px; text-align: center; }
          </style>
        </head>
        <body>
          <h1>Business Loan Calculator Results</h1>
          <div class="result-item"><strong>Loan Amount:</strong> ${formatCurrency(loanAmount)}</div>
          <div class="result-item"><strong>Interest Rate:</strong> ${interestRate}% p.a.</div>
          <div class="result-item"><strong>Loan Tenure:</strong> ${loanTenure} ${tenureType}</div>
          <div class="result-item"><strong>Processing Fee:</strong> ${processingFeeRate}% (${formatCurrency(processingFeeAmount)})</div>
          <div class="highlight">Monthly EMI: ${formatCurrency(emi)}</div>
          <div class="result-item"><strong>Total Interest:</strong> ${formatCurrency(totalInterest)}</div>
          <div class="result-item"><strong>Total Amount Payable:</strong> ${formatCurrency(totalAmount)}</div>
          <p><em>Generated on ${new Date().toLocaleDateString()}</em></p>
        </body>
      </html>
    `;
    
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(printContent);
      printWindow.document.close();
      printWindow.focus();
      printWindow.print();
      printWindow.close();
    }
  };

  const amortizationSchedule = generateAmortization(loanAmount, interestRate, loanTenure, tenureType, emi);

  // Business loan types data
  const businessLoanTypes = [
    {
      type: "Term Loans",
      description: "Traditional business loans with fixed repayment schedule",
      features: ["Fixed EMI", "Competitive rates", "Longer tenure"],
      useCase: "Equipment purchase, business expansion, working capital"
    },
    {
      type: "Working Capital Loans",
      description: "Short-term financing for daily business operations",
      features: ["Flexible repayment", "Quick approval", "Line of credit"],
      useCase: "Inventory purchase, salary payments, operational expenses"
    },
    {
      type: "Equipment Finance",
      description: "Loans specifically for purchasing business equipment",
      features: ["Equipment as collateral", "Up to 100% financing", "Tax benefits"],
      useCase: "Machinery, technology, vehicles, office equipment"
    },
    {
      type: "Invoice Financing",
      description: "Advance against outstanding invoices",
      features: ["Immediate cash flow", "Based on invoices", "Short-term"],
      useCase: "Bridge cash flow gaps, fulfill new orders"
    },
    {
      type: "MSME Loans",
      description: "Government-backed loans for micro, small & medium enterprises",
      features: ["Lower interest rates", "Government schemes", "Collateral-free options"],
      useCase: "Small business growth, startup funding, expansion"
    },
    {
      type: "Merchant Cash Advance",
      description: "Advance based on future credit card sales",
      features: ["Quick funding", "Flexible repayment", "No fixed EMI"],
      useCase: "Retail businesses, restaurants, service providers"
    }
  ];

  // Interest rate factors
  const rateFactors = [
    {
      factor: "Credit Score",
      impact: "Higher score = Lower rates",
      description: "Credit scores above 750 get the best rates, while scores below 650 face higher rates"
    },
    {
      factor: "Business Vintage",
      impact: "Older business = Better rates",
      description: "Businesses operating for 3+ years typically get better rates than newer ventures"
    },
    {
      factor: "Annual Turnover",
      impact: "Higher turnover = Lower rates", 
      description: "Higher revenue businesses are considered less risky and get preferential rates"
    },
    {
      factor: "Industry Type",
      impact: "Stable industries = Better rates",
      description: "Traditional industries often get better rates than high-risk or volatile sectors"
    },
    {
      factor: "Loan Amount",
      impact: "Larger loans = Better rates",
      description: "Higher loan amounts often qualify for better interest rates due to economies of scale"
    },
    {
      factor: "Collateral",
      impact: "Secured loans = Lower rates",
      description: "Loans backed by collateral carry lower risk and thus offer better interest rates"
    }
  ];

  // Business loan uses
  const businessUses = [
    { emoji: "🏭", title: "Equipment Purchase", description: "Machinery, technology, vehicles" },
    { emoji: "📈", title: "Business Expansion", description: "New locations, scaling operations" },
    { emoji: "💰", title: "Working Capital", description: "Inventory, salaries, day-to-day expenses" },
    { emoji: "🏢", title: "Office Setup", description: "Rent, furniture, infrastructure" },
    { emoji: "📦", title: "Inventory Stocking", description: "Raw materials, finished goods" },
    { emoji: "🚀", title: "Marketing Campaigns", description: "Digital marketing, advertising" },
    { emoji: "💻", title: "Technology Upgrade", description: "Software, hardware, digital tools" },
    { emoji: "👥", title: "Staff Hiring", description: "Recruitment, training, team expansion" },
    { emoji: "🏗️", title: "Infrastructure", description: "Office renovation, facility upgrade" }
  ];

  // Navigation tabs
  const navigationTabs = [
    { id: "calculator", label: "Business Loan Calculator", icon: <CalendarIcon className="w-4 h-4" /> },
    { id: "about", label: "About Business Loans", icon: <BuildingIcon className="w-4 h-4" /> },
    { id: "types", label: "Loan Types", icon: <TrendingUpIcon className="w-4 h-4" /> },
    { id: "rates", label: "Interest Rates", icon: <PercentIcon className="w-4 h-4" /> },
    { id: "info", label: "Additional Info", icon: <ShieldIcon className="w-4 h-4" /> }
  ];

  // Tooltip content
  

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
              <span className="text-gray-600">Business Loan Calculator</span>
            </nav>
          </div>

          <div className="text-center max-w-4xl mx-auto">
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="w-16 h-16 bg-gradient-to-r from-[#0050B2] to-[#003d8a] rounded-2xl flex items-center justify-center shadow-lg">
                <BuildingIcon className="w-8 h-8 text-white" />
              </div>
            </div>
            
            <h1 className="text-4xl lg:text-5xl font-bold leading-tight mb-6">
              <span className="text-gray-900">Business Loan</span>
              <br />
              <span className="bg-gradient-to-r from-[#0050B2] to-[#003d8a] bg-clip-text text-transparent">
                EMI Calculator
              </span>
            </h1>
            
            <p className="text-xl text-gray-600 leading-relaxed mb-8">
              Calculate your business loan EMI instantly and explore comprehensive information about business financing, 
              interest rates, and loan types to make informed decisions for your business growth.
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
                Business Loan EMI Calculator
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Calculate your monthly EMI and plan your business financing with our advanced calculator
              </p>
            </div>

              <Card className="shadow-2xl border-0 rounded-2xl overflow-hidden">
              <CardContent className="p-8 lg:p-12">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                  <CalculatorInputs
                    loanAmount={loanAmount}
                    setLoanAmount={setLoanAmount}
                    interestRate={interestRate}
                    setInterestRate={setInterestRate}
                    loanTenure={loanTenure}
                    setLoanTenure={setLoanTenure}
                    tenureType={tenureType}
                    setTenureType={setTenureType}
                    processingFeeRate={processingFeeRate}
                    setProcessingFeeRate={setProcessingFeeRate}
                    resetCalculator={resetCalculator}
                    handlePrint={handlePrint}
                    showTooltip={showTooltip}
                    setShowTooltip={setShowTooltip}
                  />

                  <ResultsPanel
                    emi={emi}
                    totalInterest={totalInterest}
                    loanAmount={loanAmount}
                    processingFeeRate={processingFeeRate}
                    processingFeeAmount={processingFeeAmount}
                    displayTotalAmount={displayTotalAmount}
                    showAmortization={showAmortization}
                    setShowAmortization={setShowAmortization}
                    handlePrint={handlePrint}
                  />
                </div>
              </CardContent>
            </Card>

              {/* Amortization Schedule */}
              {showAmortization && <AmortizationTable schedule={amortizationSchedule} />}
          </div>
        </section>

        {/* About Business Loans Section */}
        <section id="about" className="py-16 bg-gray-50">
          <div className="space-y-12">
            <div className="text-center mb-12">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                What is a Business Loan?
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Understanding business loans - your pathway to business growth and expansion
              </p>
            </div>

            <Card className="shadow-xl border-0">
              <CardContent className="p-8">
                <div className="space-y-8">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">Definition & Purpose</h3>
                    <p className="text-gray-700 leading-relaxed text-lg">
                      A business loan is financing provided by banks and financial institutions to help businesses 
                      meet their capital requirements, expand operations, purchase equipment, or manage cash flow. 
                      Unlike personal loans, business loans are specifically designed for commercial purposes and 
                      often offer higher loan amounts and more flexible terms.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">How Business Loans Work</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 bg-[#0050B2] rounded-full flex items-center justify-center text-white font-bold text-sm">1</div>
                          <div>
                            <h4 className="font-semibold text-gray-900">Business Assessment</h4>
                            <p className="text-gray-600 text-sm">Lender evaluates your business plan, financials, and creditworthiness</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 bg-[#0050B2] rounded-full flex items-center justify-center text-white font-bold text-sm">2</div>
                          <div>
                            <h4 className="font-semibold text-gray-900">Documentation Review</h4>
                            <p className="text-gray-600 text-sm">Submit financial statements, tax returns, and business documents</p>
                          </div>
                        </div>
                      </div>
                      <div className="space-y-4">
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 bg-[#0050B2] rounded-full flex items-center justify-center text-white font-bold text-sm">3</div>
                          <div>
                            <h4 className="font-semibold text-gray-900">Loan Approval</h4>
                            <p className="text-gray-600 text-sm">Lender approves loan amount, rate, and terms based on evaluation</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 bg-[#0050B2] rounded-full flex items-center justify-center text-white font-bold text-sm">4</div>
                          <div>
                            <h4 className="font-semibold text-gray-900">Fund Disbursement</h4>
                            <p className="text-gray-600 text-sm">Loan amount is disbursed and EMI repayment begins</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-6">Key Features of Business Loans</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {[
                        { icon: "💼", title: "Business Purpose", desc: "Funds specifically for business operations and growth" },
                        { icon: "💰", title: "Higher Loan Amounts", desc: "Typically higher limits compared to personal loans" },
                        { icon: "📈", title: "Flexible Terms", desc: "Customizable repayment schedules based on cash flow" },
                        { icon: "🏦", title: "Multiple Options", desc: "Various loan types for different business needs" },
                        { icon: "📊", title: "Tax Benefits", desc: "Interest payments are tax-deductible business expenses" },
                        { icon: "⚡", title: "Quick Processing", desc: "Faster approval for established businesses with good credit" }
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
                          "Business Vintage: Minimum 2-3 years of operations",
                          "Annual Turnover: Minimum ₹15-25 lakhs for most lenders",
                          "Credit Score: 650+ for approval, 750+ for best rates",
                          "Business Type: Proprietorship, Partnership, Pvt Ltd, LLP",
                          "Financial Health: Profitable operations with positive cash flow",
                          "Age: Business owner should be 21-65 years",
                          "ITR Filing: Regular income tax return filing",
                          "Bank Statements: Clean banking history for 12+ months"
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
                          "Business Registration Certificate",
                          "PAN Card (Business & Personal)",
                          "GST Registration Certificate",
                          "Audited Financial Statements (2-3 years)",
                          "Income Tax Returns (2-3 years)",
                          "Bank Statements (12 months)",
                          "Business Plan & Project Report",
                          "Identity & Address Proof of Promoters",
                          "Partnership Deed / MOA & AOA",
                          "Trade License & Other Permits"
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

        {/* Business Loan Types Section */}
        <section id="types" className="py-16 bg-white">
          <div className="space-y-12">
            <div className="text-center mb-12">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                Types of Business Loans
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Choose the right business loan type based on your specific business needs
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {businessLoanTypes.map((loan, index) => (
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

            {/* Business Loan Uses */}
            <div className="mt-16">
              <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">Common Business Loan Uses</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-6">
                {businessUses.map((use, index) => (
                  <Card key={index} className="shadow-lg border-0 hover:shadow-xl transition-shadow duration-300">
                    <CardContent className="p-6 text-center">
                      <div className="text-4xl mb-4">{use.emoji}</div>
                      <h4 className="font-bold text-gray-900 mb-2">{use.title}</h4>
                      <p className="text-gray-600 text-sm">{use.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Interest Rates & Factors Section */}
        <section id="rates" className="py-16 bg-gray-50">
          <div className="space-y-12">
            <div className="text-center mb-12">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                Business Loan Interest Rates & Factors
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Understanding factors that influence your business loan interest rates
              </p>
            </div>

            <div className="space-y-8">
              {rateFactors.map((factor, index) => (
                <Card key={index} className="shadow-xl border-0">
                  <CardContent className="p-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">{factor.factor}</h3>
                        <p className="text-[#0050B2] font-semibold">{factor.impact}</p>
                      </div>
                      <div className="md:col-span-2">
                        <p className="text-gray-700 leading-relaxed">{factor.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Interest Rate Ranges */}
            <Card className="shadow-xl border-0">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">Typical Interest Rate Ranges</h3>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-[#0050B2] text-white">
                      <tr>
                        <th className="px-6 py-4 text-left">Business Profile</th>
                        <th className="px-6 py-4 text-left">Credit Score</th>
                        <th className="px-6 py-4 text-left">Interest Rate Range</th>
                        <th className="px-6 py-4 text-left">Loan Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-gray-200">
                        <td className="px-6 py-4 font-semibold">Established Business</td>
                        <td className="px-6 py-4 text-green-600">750+</td>
                        <td className="px-6 py-4 text-green-600">9% - 14%</td>
                        <td className="px-6 py-4">₹10L - ₹5Cr</td>
                      </tr>
                      <tr className="border-b border-gray-200">
                        <td className="px-6 py-4 font-semibold">Growing Business</td>
                        <td className="px-6 py-4 text-blue-600">700-750</td>
                        <td className="px-6 py-4 text-blue-600">12% - 18%</td>
                        <td className="px-6 py-4">₹5L - ₹2Cr</td>
                      </tr>
                      <tr className="border-b border-gray-200">
                        <td className="px-6 py-4 font-semibold">New Business</td>
                        <td className="px-6 py-4 text-orange-600">650-700</td>
                        <td className="px-6 py-4 text-orange-600">15% - 22%</td>
                        <td className="px-6 py-4">₹2L - ₹50L</td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 font-semibold">Startup/High Risk</td>
                        <td className="px-6 py-4 text-red-600">Below 650</td>
                        <td className="px-6 py-4 text-red-600">18% - 24%</td>
                        <td className="px-6 py-4">₹1L - ₹25L</td>
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
                Important details about fees, benefits, and considerations for business loans
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
                      { fee: "Processing Fee", amount: "1% - 3% of loan amount + GST" },
                      { fee: "Documentation Charges", amount: "₹5,000 - ₹15,000" },
                      { fee: "Legal & Technical Charges", amount: "₹5,000 - ₹20,000" },
                      { fee: "Valuation Charges", amount: "₹2,000 - ₹10,000" },
                      { fee: "Prepayment Charges", amount: "2% - 4% of outstanding" },
                      { fee: "Penal Interest", amount: "2% - 3% per month on delays" },
                      { fee: "Bounce Charges", amount: "₹500 - ₹1,000 per instance" },
                      { fee: "Statement Charges", amount: "₹200 - ₹500 per statement" }
                    ].map((item, index) => (
                      <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <span className="text-gray-700 font-medium">{item.fee}</span>
                        <span className="text-gray-900 font-semibold text-sm">{item.amount}</span>
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
                    Tax Benefits & Advantages
                  </h3>
                  <div className="space-y-4">
                    <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                      <h4 className="font-semibold text-green-800 mb-2">Interest Deduction</h4>
                      <p className="text-green-700 text-sm">Interest paid on business loans is fully tax-deductible as business expense</p>
                    </div>
                    <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <h4 className="font-semibold text-blue-800 mb-2">Processing Fee Deduction</h4>
                      <p className="text-blue-700 text-sm">Processing fees and other charges can be claimed as business expenses</p>
                    </div>
                    <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                      <h4 className="font-semibold text-purple-800 mb-2">Depreciation Benefits</h4>
                      <p className="text-purple-700 text-sm">Equipment purchased with loans qualify for depreciation benefits</p>
                    </div>
                    <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
                      <h4 className="font-semibold text-orange-800 mb-2">GST Input Credit</h4>
                      <p className="text-orange-700 text-sm">GST paid on loan processing fees can be claimed as input credit</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Application Tips */}
              <Card className="shadow-xl border-0">
                <CardContent className="p-8">
                  <h3 className="text-xl font-bold text-gray-900 mb-6">Tips for Better Approval</h3>
                  <div className="space-y-4">
                    {[
                      "Maintain a good credit score (750+) for better rates",
                      "Keep business finances separate from personal finances",
                      "Prepare a detailed business plan with financial projections",
                      "Maintain proper bookkeeping and financial records",
                      "Build a relationship with your bank over time",
                      "Compare offers from multiple lenders",
                      "Consider collateral to get better rates",
                      "Apply during business growth phases for better evaluation"
                    ].map((tip, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mt-0.5">
                          <span className="text-xs text-blue-600 font-bold">{index + 1}</span>
                        </div>
                        <span className="text-gray-700">{tip}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Repayment Options */}
              <Card className="shadow-xl border-0">
                <CardContent className="p-8">
                  <h3 className="text-xl font-bold text-gray-900 mb-6">Repayment Options</h3>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Standard EMI</h4>
                      <p className="text-gray-600 text-sm mb-3">Fixed monthly payments throughout the loan tenure</p>
                      <div className="flex items-center gap-2">
                        <CheckIcon className="w-4 h-4 text-green-600" />
                        <span className="text-green-700 text-sm">Predictable cash flow planning</span>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Step-up EMI</h4>
                      <p className="text-gray-600 text-sm mb-3">Lower EMIs initially, increasing over time</p>
                      <div className="flex items-center gap-2">
                        <CheckIcon className="w-4 h-4 text-green-600" />
                        <span className="text-green-700 text-sm">Good for growing businesses</span>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Bullet Payment</h4>
                      <p className="text-gray-600 text-sm mb-3">Pay only interest during tenure, principal at maturity</p>
                      <div className="flex items-center gap-2">
                        <CheckIcon className="w-4 h-4 text-green-600" />
                        <span className="text-green-700 text-sm">Useful for short-term cash flow needs</span>
                      </div>
                    </div>
                    <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                      <p className="text-yellow-800 text-sm">
                        <strong>Note:</strong> Prepayment is allowed in most business loans. 
                        Check with your lender for specific prepayment terms and charges.
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
                      q: "What is the minimum business vintage required for a business loan?",
                      a: "Most lenders require a minimum business vintage of 2-3 years. However, some NBFCs and fintech lenders may consider businesses with 1+ year of operations, especially if backed by strong financials or collateral."
                    },
                    {
                      q: "Can I get a business loan without collateral?",
                      a: "Yes, unsecured business loans are available up to ₹50 lakhs without collateral. These are based on your business turnover, credit score, and financial history. For higher amounts, collateral may be required."
                    },
                    {
                      q: "How is my business loan eligibility calculated?",
                      a: "Eligibility is based on your business turnover, profit margins, credit score, business vintage, existing obligations, and ability to repay. Most lenders use a debt-service coverage ratio to determine the maximum EMI you can afford."
                    },
                    {
                      q: "What documents are required for business loan approval?",
                      a: "Key documents include business registration certificates, ITR for last 2-3 years, audited financial statements, bank statements for 12 months, GST returns, and identity/address proof of promoters."
                    },
                    {
                      q: "How quickly can I get a business loan approved?",
                      a: "With complete documentation, business loan approval can take 3-15 working days. Digital lenders and NBFCs often provide faster approvals compared to traditional banks."
                    },
                    {
                      q: "Can I prepay my business loan?",
                      a: "Yes, most business loans allow prepayment. Some lenders charge 2-4% prepayment penalty, while others offer zero prepayment charges. This can significantly reduce your total interest burden."
                    },
                    {
                      q: "What happens if my business loan application is rejected?",
                      a: "Common reasons include low credit score, insufficient business vintage, poor financials, or incomplete documentation. You can reapply after addressing these issues or try with different lenders who have different criteria."
                    },
                    {
                      q: "Are there any government schemes for business loans?",
                      a: "Yes, several government schemes like MUDRA loans, MSME loans, Stand-up India, and SIDBI schemes offer business loans at subsidized rates with relaxed eligibility criteria for qualifying businesses."
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