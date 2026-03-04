import { useRef } from "react";
import { Button } from "../../../../components/ui/button";
import { LOAN_PRODUCTS } from "../../../../constants/loanProducts";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";

// SVG icons per product — simple, outline style matching Figma
const ProductIcon = ({ id }: { id: string }) => {
  const icons: Record<string, JSX.Element> = {
    personal: (
      <svg width="24" height="24" fill="none" stroke="#1664F5" strokeWidth="1.8" viewBox="0 0 24 24">
        <circle cx="12" cy="7" r="4" />
        <path d="M4 21c0-4 3.6-7 8-7s8 3 8 7" strokeLinecap="round" />
      </svg>
    ),
    home: (
      <svg width="24" height="24" fill="none" stroke="#1664F5" strokeWidth="1.8" viewBox="0 0 24 24">
        <path d="M3 9.5L12 3l9 6.5V21H3V9.5z" strokeLinejoin="round" />
        <rect x="9" y="13" width="6" height="8" rx="1" />
      </svg>
    ),
    business: (
      <svg width="24" height="24" fill="none" stroke="#1664F5" strokeWidth="1.8" viewBox="0 0 24 24">
        <rect x="2" y="9" width="20" height="13" rx="2" />
        <path d="M16 9V7a4 4 0 0 0-8 0v2" />
      </svg>
    ),
    car: (
      <svg width="24" height="24" fill="none" stroke="#1664F5" strokeWidth="1.8" viewBox="0 0 24 24">
        <path d="M5 17H3v-5l2-5h14l2 5v5h-2" strokeLinejoin="round" />
        <circle cx="7.5" cy="17" r="2" />
        <circle cx="16.5" cy="17" r="2" />
      </svg>
    ),
    lap: (
      <svg width="24" height="24" fill="none" stroke="#1664F5" strokeWidth="1.8" viewBox="0 0 24 24">
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <path d="M9 9h6M9 13h4" strokeLinecap="round" />
      </svg>
    ),
    education: (
      <svg width="24" height="24" fill="none" stroke="#1664F5" strokeWidth="1.8" viewBox="0 0 24 24">
        <path d="M12 3L2 8l10 5 10-5-10-5z" />
        <path d="M6 11v5c2 2 8 2 12 0v-5" strokeLinecap="round" />
      </svg>
    ),
    gold: (
      <svg width="24" height="24" fill="none" stroke="#1664F5" strokeWidth="1.8" viewBox="0 0 24 24">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
    ),
    "credit-card": (
      <svg width="24" height="24" fill="none" stroke="#1664F5" strokeWidth="1.8" viewBox="0 0 24 24">
        <rect x="2" y="5" width="20" height="14" rx="2" />
        <path d="M2 10h20" strokeLinecap="round" />
      </svg>
    ),
  };
  return icons[id] ?? icons["personal"];
};

export const LoanProductsSection = (): JSX.Element => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: "left" | "right") => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({ left: dir === "left" ? -320 : 320, behavior: "smooth" });
  };

  return (
    <section
      className="w-full py-24 relative overflow-hidden"
      style={{ background: "linear-gradient(360deg, #F4F9FF 0%, #FFFFFF 100%)" }}
    >
      <div className="max-w-[1440px] mx-auto px-6 lg:px-16">

        {/* Header */}
        <div className="text-center mb-14">
          <h2
            className="font-normal text-[#283340] leading-tight lg:leading-[76.8px]"
            style={{
              fontSize: "clamp(2.5rem, 5vw, 64px)",
              fontFamily: "'Power Grotesk', 'Plus Jakarta Sans', 'DM Sans', sans-serif",
              letterSpacing: "0",
            }}
          >
            We Facilitate Loans
            <br />
            That Fit Every Need
          </h2>
          <p
            className="mt-5 max-w-xl mx-auto"
            style={{
              fontFamily: "'DM Sans', Helvetica, sans-serif",
              fontWeight: 500,
              fontSize: "20px",
              lineHeight: "21px",
              textAlign: "center",
              letterSpacing: "-0.02em",
              color: "#8C909A",
            }}
          >
            Choose from our comprehensive range of financial products
            <br />
            designed to meet your every need
          </p>
        </div>

        {/* Carousel wrapper */}
        <div className="relative">
          {/* Left arrow */}
          <button
            onClick={() => scroll("left")}
            className="absolute -left-5 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white shadow-lg border border-gray-100 flex items-center justify-center hover:bg-gray-50 transition-colors"
            aria-label="Scroll left"
          >
            <ChevronLeftIcon className="w-5 h-5 text-gray-600" />
          </button>

          {/* Scrollable cards */}
          <div
            ref={scrollRef}
            className="flex gap-7 overflow-x-auto pb-4 scroll-smooth"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {LOAN_PRODUCTS.map((product) => (
              <div
                key={product.id}
                className="flex-none w-[294px] flex flex-col justify-between"
                style={{
                  background: "#F5F9FF",
                  border: "1px solid #E1E1E1",
                  borderRadius: "8px",
                }}
              >
                <div className="p-6 flex flex-col gap-4 flex-1">
                  {/* Icon box */}
                  <div
                    className="w-12 h-12 rounded flex items-center justify-center"
                    style={{ background: "rgba(192, 217, 247, 0.5)" }}
                  >
                    <ProductIcon id={product.id} />
                  </div>

                  {/* Name & summary */}
                  <div className="flex flex-col gap-1">
                    <p
                      className="font-semibold"
                      style={{
                        fontFamily: "'DM Sans', Helvetica, sans-serif",
                        fontWeight: 600,
                        fontSize: "24px",
                        lineHeight: "21px",
                        letterSpacing: "-0.02em",
                        color: "#0B0B0B",
                      }}
                    >
                      {product.name}
                    </p>
                    <p
                      style={{
                        fontFamily: "'DM Sans', Helvetica, sans-serif",
                        fontWeight: 400,
                        fontSize: "16px",
                        lineHeight: "20px",
                        color: "#757575",
                      }}
                    >
                      {product.summary}
                    </p>
                  </div>

                  {/* Rate */}
                  <p
                    style={{
                      fontFamily: "'DM Sans', Helvetica, sans-serif",
                      fontWeight: 600,
                      fontSize: "24px",
                      lineHeight: "21px",
                      letterSpacing: "-0.02em",
                      color: "#0977FF",
                    }}
                  >
                    Starting from {product.rate}
                  </p>

                  {/* Features */}
                  <ul className="flex flex-col gap-2.5 flex-1">
                    {product.features.map((f, i) => (
                      <li
                        key={i}
                        className="flex items-center gap-2"
                        style={{
                          fontFamily: "'DM Sans', Helvetica, sans-serif",
                          fontWeight: 500,
                          fontSize: "16px",
                          lineHeight: "21px",
                          letterSpacing: "-0.02em",
                          color: "#004091",
                        }}
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-[#004091] flex-none" />
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* CTA */}
                <div className="px-6 pb-6">
                  <Button
                    className="w-full text-white text-sm font-bold uppercase tracking-wider py-3.5 rounded-lg"
                    style={{
                      background: "#0877ff",
                      fontFamily: "'DM Sans', Helvetica, sans-serif",
                    }}
                    asChild
                  >
                    <a href={`/${product.id === "lap" ? "loan-against-property" : product.id === "credit-card" ? "credit-cards" : product.id + "-loan"}`}>
                      CHECK ELIGIBILITY
                    </a>
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {/* Right arrow */}
          <button
            onClick={() => scroll("right")}
            className="absolute -right-5 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white shadow-lg border border-gray-100 flex items-center justify-center hover:bg-gray-50 transition-colors"
            aria-label="Scroll right"
          >
            <ChevronRightIcon className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>

      {/* Hide scrollbar cross-browser */}
      <style>{`
        div::-webkit-scrollbar { display: none; }
      `}</style>
    </section>
  );
};
