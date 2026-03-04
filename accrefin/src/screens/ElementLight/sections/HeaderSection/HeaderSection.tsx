import React, { useState } from "react";
import { Button } from "../../../../components/ui/button";
import { ChevronDownIcon, MenuIcon, XIcon, GlobeIcon } from "lucide-react";

export const HeaderSection = (): JSX.Element => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  // Navigation menu items data
  const navItems = [
    {
      label: "Loan Products",
      hasDropdown: true,
      dropdownItems: [
        { label: "Personal Loan", href: "/personal-loan" },
        { label: "Business Loan", href: "/business-loan" },
        { label: "Car Loan", href: "/car-loan" },
        { label: "Education Loan", href: "/education-loan" },
        { label: "Machinery Loan", href: "/machinery-loan" },
        { label: "Home Loan", href: "/home-loan" },
        { label: "Loan Against Property", href: "/loan-against-property" },
        { label: "Gold Loan", href: "/gold-loans" },
      ],
    },
    {
      label: "Insurance",
      hasDropdown: true,
      dropdownItems: [
        { label: "Health Insurance", href: "/health-insurance" },
        { label: "Vehicle Insurance", href: "/vehicle-insurance" },
        { label: "Life Insurance", href: "/life-insurance" },
      ],
    },
    {
      label: "Calculators",
      hasDropdown: true,
      dropdownItems: [
        { label: "Home Loan Calculator", href: "/calculators/home-loan" },
        { label: "Personal Loan Calculator", href: "/calculators/personal-loan" },
        { label: "Business Loan Calculator", href: "/calculators/business-loan" },
        { label: "Automobile Loan Calculator", href: "/calculators/automobile-loan" },
        { label: "FD Calculator", href: "/calculators/fd" },
        { label: "Insurance Calculator", href: "/calculators/insurance" },
        { label: "Mutual Fund Calculator", href: "/calculators/mutual-fund" },
        { label: "Credit Card Calculator", href: "/calculators/credit-card" }
      ],
    },
    {
      label: "About Us",
      hasDropdown: true,
      dropdownItems: [
        { label: "Partner With Us", href: "/partner" },
        { label: "Careers", href: "/careers" }
      ],
    },
    {
      label: "Resources",
      hasDropdown: true,
      dropdownItems: [
        { label: "Blog", href: "/blogs" },
        { label: "Currency Converter", href: "/currency-converter" },
        { label: "IFSC Code", href: "/ifsc-code" },
      ],
    },
    {
      label: "Contact",
      href: "/contact",
      hasDropdown: false,
    },

    {
      label: "Reviews",
      href: "/reviews",
      hasDropdown: false,
    }

  ];

  return (
    <header className="sticky top-0 left-0 w-full bg-white shadow-sm z-50">
      {/* Blue top border bar */}
      <div className="w-full h-1 bg-[#1664F5]" />
      <div className="max-w-[1400px] mx-auto px-6">
        <div className="flex items-center justify-between py-3">
          {/* Logo */}
          <div className="flex items-center">
            <a href="/" className="flex items-center gap-3">
              <img src="/images/AccrefinLogoCode.svg" alt="Accrefin" className="h-10 w-auto" />
            </a>
          </div>

          {/* Navigation */}
          <nav className="hidden lg:flex">
            <ul className="flex items-center gap-2">
              {navItems.map((item, index) => (
                <li key={index} className="relative">
                  {item.hasDropdown ? (
                    <div className="relative">
                      <button
                        className="flex items-center gap-1 px-4 py-2 text-gray-700 hover:text-[#0050B2] font-medium text-sm transition-colors duration-200 bg-transparent hover:bg-gray-50 rounded-lg"
                        onMouseEnter={() => setActiveDropdown(item.label)}
                        onMouseLeave={() => setActiveDropdown(null)}
                        onFocus={() => setActiveDropdown(item.label)}
                        onBlur={() => setActiveDropdown(null)}
                        aria-haspopup="true"
                        aria-expanded={activeDropdown === item.label}
                      >
                        {item.label}
                        <ChevronDownIcon className="w-4 h-4" />
                      </button>
                      
                      {activeDropdown === item.label && (
                        <div 
                          className="absolute top-full left-0 min-w-[220px] p-3 bg-white border border-gray-200 rounded-xl shadow-xl z-50 animate-fadeIn"
                          onMouseEnter={() => setActiveDropdown(item.label)}
                          onMouseLeave={() => setActiveDropdown(null)}
                          role="menu"
                          aria-labelledby={`${item.label}-button`}
                        >
                          <div className="flex flex-col gap-1">
                            {item.dropdownItems?.map((dropdownItem, dropdownIndex) => (
                              <a
                                key={dropdownIndex}
                                href={dropdownItem.href}
                                className="px-4 py-3 text-sm text-gray-700 hover:text-[#0050B2] hover:bg-blue-50 rounded-lg transition-all duration-200 font-medium focus:outline-none focus:bg-blue-50 focus:text-[#0050B2]"
                                role="menuitem"
                                tabIndex={activeDropdown === item.label ? 0 : -1}
                              >
                                {dropdownItem.label}
                              </a>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <a
                      href={item.href}
                      className="flex items-center gap-1 px-4 py-2 text-gray-700 hover:text-[#0050B2] font-medium text-sm transition-colors duration-200 hover:bg-gray-50 rounded-lg"
                    >
                      {item.label}
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </nav>

          {/* Action Buttons */}
          <div className="flex items-center gap-4">
            {/* Check Eligibility Button */}
            <Button
              className="hidden sm:flex bg-[#1664F5] hover:bg-[#1254D4] text-white font-semibold text-xs px-6 py-2.5 rounded-lg uppercase tracking-wider transition-all duration-200"
            >
              CHECK ELIGIBILITY
            </Button>

            {/* Language Dropdown */}
            <div className="hidden md:flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-[#0050B2] cursor-pointer transition-colors duration-200">
              <GlobeIcon className="w-4 h-4" />
              <span className="text-sm font-medium">EN</span>
              <ChevronDownIcon className="w-3 h-3" />
            </div>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden p-2"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <XIcon className="w-6 h-6" />
              ) : (
                <MenuIcon className="w-6 h-6" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-white border-t border-gray-100 shadow-lg">
          <div className="max-w-[1400px] mx-auto px-6 py-6">
            <div className="flex flex-col gap-4">
              {navItems.map((item, index) => (
                <div key={index}>
                  {item.hasDropdown ? (
                    <div className="flex flex-col">
                      <button 
                        className="flex items-center justify-between px-4 py-3 text-gray-700 hover:text-[#0050B2] font-medium text-sm transition-colors duration-200 hover:bg-gray-50 rounded-lg"
                        onClick={() => setActiveDropdown(activeDropdown === item.label ? null : item.label)}
                        aria-haspopup="true"
                        aria-expanded={activeDropdown === item.label}
                      >
                        {item.label}
                        <ChevronDownIcon className={`w-4 h-4 transition-transform duration-200 ${activeDropdown === item.label ? 'rotate-180' : ''}`} />
                      </button>
                      {activeDropdown === item.label && (
                        <div className="ml-4 flex flex-col gap-1 mt-2 animate-slideDown">
                          {item.dropdownItems?.map((dropdownItem, dropdownIndex) => (
                            <a
                              key={dropdownIndex}
                              href={dropdownItem.href}
                              className="px-4 py-2 text-sm text-gray-600 hover:text-[#0050B2] hover:bg-gray-50 rounded-lg transition-colors duration-200"
                              onClick={() => {
                                setIsMobileMenuOpen(false);
                                setActiveDropdown(null);
                              }}
                            >
                              {dropdownItem.label}
                            </a>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <a
                      href={item.href}
                      className="flex items-center gap-1 px-4 py-3 text-gray-700 hover:text-[#0050B2] font-medium text-sm transition-colors duration-200 hover:bg-gray-50 rounded-lg"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {item.label}
                    </a>
                  )}
                </div>
              ))}
              <div className="mt-4 pt-4 border-t border-gray-100">
                <Button
                  className="w-full bg-[#1664F5] hover:bg-[#1254D4] text-white font-semibold text-xs py-3 rounded-lg uppercase tracking-wider transition-all duration-200"
                >
                  CHECK ELIGIBILITY
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Custom animations */}
      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideDown {
          from {
            opacity: 0;
            max-height: 0;
          }
          to {
            opacity: 1;
            max-height: 200px;
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }

        .animate-slideDown {
          animation: slideDown 0.3s ease-out;
          overflow: hidden;
        }
      `}</style>
    </header>
  );
};