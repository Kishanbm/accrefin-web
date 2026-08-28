const loansLinks = [
  { text: "Personal Loans", href: "/personal-loan" },
  { text: "Home Loans", href: "/home-loan" },
  { text: "Business Loans", href: "/business-loan" },
  { text: "Car Loans", href: "/car-loan" },
  { text: "Loan Against Property", href: "/loan-against-property" },
  { text: "Education Loans", href: "/education-loan" },
  { text: "Gold Loans", href: "/gold-loans" },
  { text: "Credit Cards", href: "/credit-cards" },
];

const companyLinks = [
  { text: "About", href: "/about" },
  { text: "Partner With Us", href: "/partner" },
  { text: "Blogs", href: "/blogs" },
  { text: "Careers", href: "/careers" },
  { text: "News", href: "/news" },
  { text: "Awards", href: "/awards" },
];

const supportLinks = [
  { text: "Contact Us", href: "/contact" },
  { text: "FAQs", href: "/faqs" },
  { text: "Terms", href: "/terms" },
  { text: "Privacy Policy", href: "/privacy-policy" },
  { text: "Grievance Redressal", href: "/grievance-redressal" },
  { text: "Sitemap", href: "/sitemap" },
];

// Social icons
const LinkedIn = () => (
  <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
  </svg>
);

const Twitter = () => (
  <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
);

const YouTube = () => (
  <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
  </svg>
);

export const FooterSection = (): JSX.Element => {
  return (
    <footer
      className="w-full text-gray-300"
      style={{ background: "#181F2E" }}
    >
      {/* Main content */}
      <div className="max-w-[1440px] mx-auto px-6 lg:px-16 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">

          {/* Brand column */}
          <div className="lg:col-span-1 flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center font-bold text-white text-xl"
                style={{ background: "#1664F5" }}
              >
                A
              </div>
              <div className="flex flex-col leading-tight">
                <span className="text-white font-bold text-xl tracking-tight">ACCREFIN</span>
                <span className="text-gray-500 text-xs">much more than money</span>
              </div>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Your trusted partner for all financial needs. We provide comprehensive loan
              and credit solutions with transparency and reliability.
            </p>
          </div>

          {/* Loans */}
          <div className="lg:col-span-1">
            <h3 className="text-white font-semibold text-base mb-5">Loans</h3>
            <div className="flex flex-col gap-3">
              {loansLinks.map((link, i) => (
                <a
                  key={i}
                  href={link.href}
                  className="text-gray-400 hover:text-white text-sm transition-colors duration-150"
                >
                  {link.text}
                </a>
              ))}
            </div>
          </div>

          {/* Company */}
          <div className="lg:col-span-1">
            <h3 className="text-white font-semibold text-base mb-5">Company</h3>
            <div className="flex flex-col gap-3">
              {companyLinks.map((link, i) => (
                <a
                  key={i}
                  href={link.href}
                  className="text-gray-400 hover:text-white text-sm transition-colors duration-150"
                >
                  {link.text}
                </a>
              ))}
            </div>
          </div>

          {/* Support */}
          <div className="lg:col-span-1">
            <h3 className="text-white font-semibold text-base mb-5">Support</h3>
            <div className="flex flex-col gap-3">
              {supportLinks.map((link, i) => (
                <a
                  key={i}
                  href={link.href}
                  className="text-gray-400 hover:text-white text-sm transition-colors duration-150"
                >
                  {link.text}
                </a>
              ))}
            </div>
          </div>

          {/* Follow Us */}
          <div className="lg:col-span-1">
            <h3 className="text-white font-semibold text-base mb-5">Follow Us</h3>
            <div className="flex gap-3">
              {[
                { name: "LinkedIn", Icon: LinkedIn },
                { name: "Twitter / X", Icon: Twitter },
                { name: "YouTube", Icon: YouTube },
              ].map(({ name, Icon }) => (
                <a
                  key={name}
                  href="#"
                  aria-label={name}
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-gray-400 hover:text-white hover:bg-gray-700 transition-all duration-150"
                  style={{ background: "#252D3F" }}
                >
                  <Icon />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div
        className="w-full border-t"
        style={{ borderColor: "rgba(255,255,255,0.08)" }}
      >
        <div className="max-w-[1440px] mx-auto px-6 lg:px-16 py-5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-gray-500 text-sm">© 2025 Accrefin. All Rights Reserved.</p>
          <div className="flex items-center gap-2 text-gray-500 text-sm">
            <svg className="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
            </svg>
            <span>Built with Love</span>
            <span className="mx-1">•</span>
            <span>Made in India</span>
          </div>
        </div>
      </div>

      {/* Scroll to top */}
      <button
        className="fixed bottom-6 right-6 w-11 h-11 rounded-full flex items-center justify-center text-white shadow-lg hover:scale-105 transition-transform duration-150 z-50"
        style={{ background: "#1664F5" }}
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        aria-label="Scroll to top"
      >
        <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
          <path d="M5 15l7-7 7 7" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
    </footer>
  );
};
