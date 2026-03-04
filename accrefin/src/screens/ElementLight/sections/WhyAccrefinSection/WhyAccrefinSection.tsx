const stats = [
  {
    number: "25+",
    label: "Years of Financial Expertise",
    description: "Decades of experience in helping customers achieve their financial goals",
  },
  {
    number: "₹1,00,000+",
    label: "Crore+ Disbursed",
    description: "Trusted by millions of customers across India for their financial needs",
  },
  {
    number: "275+",
    label: "Bank & NBFC Partners",
    description: "Extensive network ensuring you get the best deals from top lenders",
  },
  {
    number: "4000+",
    label: "Trusted Indian Clients",
    description: "Pan-India presence with local expertise and personalized service",
  },
];

export const WhyAccrefinSection = (): JSX.Element => {
  return (
    <section className="w-full py-20 bg-white">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-16">

        {/* Heading */}
        <div className="text-center mb-14">
          <h2
            className="font-normal text-[#283340] leading-tight"
            style={{
              fontSize: "clamp(2rem, 4vw, 3rem)",
              fontFamily: "'Power Grotesk', 'Plus Jakarta Sans', 'DM Sans', sans-serif",
              fontWeight: 400,
            }}
          >
            What Sets Us Apart?
          </h2>
          <p className="mt-4 text-gray-500 text-base max-w-xl mx-auto leading-relaxed">
            Monitor your credit score for free and get personalized tips to improve your financial health
          </p>
        </div>

        {/* Stats grid — divided by lines */}
        <div className="grid grid-cols-2 lg:grid-cols-4 border border-gray-100 rounded-2xl overflow-hidden">
          {stats.map((stat, i) => (
            <div
              key={i}
              className="flex flex-col justify-center px-8 py-10"
              style={{
                borderLeft: i > 0 ? "1px solid #F0F0F0" : "none",
              }}
            >
              {/* Big number */}
              <p
                className="font-bold text-[#283340] leading-none mb-2"
                style={{
                  fontSize: "clamp(2rem, 4vw, 3rem)",
                  fontFamily: "'Power Grotesk', 'DM Sans', sans-serif",
                }}
              >
                {stat.number}
              </p>
              {/* Blue label */}
              <p
                className="text-sm font-semibold mb-2"
                style={{ color: "#1664F5" }}
              >
                {stat.label}
              </p>
              {/* Description */}
              <p className="text-sm text-gray-500 leading-relaxed">
                {stat.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
