import { Button } from "../../../../components/ui/button";

const blogPosts = [
  {
    title: "How to Improve Your Credit Score in 2025",
    category: "CREDIT TIPS",
    date: "1 Mar '24",
    readTime: "11 mins",
    slug: "how-to-improve-credit-score-2025",
  },
  {
    title: "Home Loan vs Rent: What's Better in 2025?",
    category: "HOME LOANS",
    date: "1 Mar '24",
    readTime: "11 mins",
    slug: "home-loan-vs-rent-2025",
  },
  {
    title: "Business Loan Guide for Startups",
    category: "BUSINESS",
    date: "1 Mar '24",
    readTime: "11 mins",
    slug: "business-loan-guide-startups",
  },
];

// Dark gradient image placeholder — matches the Figma dark card look
const CardImage = ({ category }: { category: string }) => (
  <div
    className="w-full relative overflow-hidden flex items-start p-4"
    style={{
      height: "224px",
      borderRadius: "12px",
      background: "linear-gradient(135deg, #0d1b4b 0%, #1a0a3d 40%, #3d0a2a 100%)",
    }}
  >
    {/* Category pill */}
    <span
      className="text-xs font-semibold tracking-wider text-gray-700 px-3 py-1.5 rounded-full"
      style={{
        background: "#FFFFFF",
        fontFamily: "'DM Sans', sans-serif",
        letterSpacing: "0.04em",
      }}
    >
      {category}
    </span>
  </div>
);

export const BlogSection = (): JSX.Element => {
  return (
    <section
      className="w-full py-20"
      style={{ background: "linear-gradient(360deg, #F4F9FF 0%, #FFFFFF 100%)" }}
    >
      <div className="max-w-[1440px] mx-auto px-6 lg:px-16">

        {/* Heading */}
        <div className="text-center mb-14">
          <h2
            className="font-normal text-[#283340] leading-tight"
            style={{
              fontSize: "clamp(2rem, 4.5vw, 4rem)",
              fontFamily: "'Power Grotesk', 'Plus Jakarta Sans', 'DM Sans', sans-serif",
              fontWeight: 400,
              lineHeight: "1.2",
            }}
          >
            Learn & Grow with
            <br />
            Expert Financial Insights
          </h2>
          <p className="mt-4 text-gray-500 text-base max-w-xl mx-auto leading-relaxed">
            Stay informed with the latest financial insights, tips, and market trends
          </p>
        </div>

        {/* 3-column card grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {blogPosts.map((post, i) => (
            <a
              key={i}
              href={`/blogs/${post.slug}`}
              className="flex flex-col gap-2 group"
              style={{ borderRadius: "12px" }}
            >
              {/* Image area */}
              <CardImage category={post.category} />

              {/* Info */}
              <div className="flex flex-col gap-4 px-1 pt-3 pb-2">
                <h3
                  className="font-normal text-[#121212] leading-snug group-hover:text-[#1664F5] transition-colors duration-200"
                  style={{
                    fontSize: "1.25rem",
                    fontFamily: "'DM Sans', sans-serif",
                  }}
                >
                  {post.title}
                </h3>

                {/* Meta row */}
                <div className="flex items-center gap-3 text-[#6D6D6D]" style={{ fontSize: "1.125rem" }}>
                  <span>{post.date}</span>
                  <span className="w-1 h-1 rounded-full bg-gray-300" />
                  <span>{post.readTime}</span>
                </div>
              </div>
            </a>
          ))}
        </div>

        {/* Explore Now CTA */}
        <div className="text-center mt-12">
          <Button
            className="text-white text-xs font-semibold uppercase tracking-wider px-8 py-3 rounded-lg"
            style={{ background: "#1664F5" }}
            asChild
          >
            <a href="/blogs">EXPLORE NOW</a>
          </Button>
        </div>
      </div>
    </section>
  );
};
