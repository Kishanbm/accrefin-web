export type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  author: string;
  publishedAt: string;
  readTime: string;
  coverImage: string;
  content: string[];
  htmlBody?: string;
  subtitle?: string;
  gallery?: string[];
  tags?: string[];
  facebook_url?: string;
  twitter_url?: string;
  linkedin_url?: string;
  instagram_url?: string;
  readMinutes?: number;
};

export const blogPosts: BlogPost[] = [
  {
    slug: "how-to-improve-your-credit-score",
    title: "How to Improve Your Credit Score in 2026",
    excerpt: "Proven steps to raise your CIBIL score and unlock better loan offers.",
    category: "Credit Tips",
    author: "Accrefin Team",
    publishedAt: "2026-06-12",
    readTime: "5 min read",
    coverImage: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&h=450&fit=crop",
    content: [
      "Your credit score is one of the first things lenders check. A higher score usually means faster approvals and lower interest rates.",
      "Pay EMIs and credit card bills on or before the due date. Even one late payment can pull your score down for months.",
      "Keep credit utilisation under 30% of your available limit. Paying more than the minimum due each month helps more than opening new cards.",
      "Avoid applying for several loans at once. Multiple hard enquiries in a short window can look risky to lenders.",
      "Check your credit report regularly, dispute errors, and keep older accounts active. A longer, clean history is a strong signal of creditworthiness.",
    ],
  },
  {
    slug: "home-loan-vs-rent",
    title: "Home Loan vs Rent: What Makes Sense in 2026?",
    excerpt: "A practical comparison to help you decide between buying and renting.",
    category: "Home Loans",
    author: "Accrefin Team",
    publishedAt: "2026-05-28",
    readTime: "8 min read",
    coverImage: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800&h=450&fit=crop",
    content: [
      "Buying a home builds equity, but renting can be the smarter cash-flow choice depending on city, tenure, and interest rates.",
      "Compare your expected EMI with current rent, then add stamp duty, maintenance, and opportunity cost of the down payment.",
      "If you plan to stay in the same city for 7+ years and have a stable income, a home loan often works better over time.",
      "If your job or city may change, renting keeps you flexible and avoids selling costs if you move early.",
      "Run both scenarios on a home loan calculator before you decide. The right answer is the one that fits your timeline, not a generic rule.",
    ],
  },
  {
    slug: "business-loan-guide-for-startups",
    title: "Business Loan Guide for Startups",
    excerpt: "What founders should know before applying for working capital or term loans.",
    category: "Business",
    author: "Accrefin Team",
    publishedAt: "2026-04-15",
    readTime: "6 min read",
    coverImage: "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=800&h=450&fit=crop",
    content: [
      "Startups can access term loans, working capital, and invoice financing once banking and GST records are in place.",
      "Lenders typically look at vintage, turnover, cash flow, and the promoter’s personal credit score.",
      "Keep 6–12 months of bank statements, ITR, and GST returns ready. Incomplete files are the most common reason for delay.",
      "Borrow only what the business can repay from operating cash, not from hoped-for future funding rounds.",
      "Compare offers on interest, processing fee, tenure, and prepayment rules — the cheapest headline rate is not always the cheapest loan.",
    ],
  },
];

export function getBlogPost(slug: string): BlogPost | undefined {
  return blogPosts.find((post) => post.slug === slug);
}

export function formatBlogDate(isoDate: string): string {
  return new Date(isoDate).toLocaleDateString("en-IN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
