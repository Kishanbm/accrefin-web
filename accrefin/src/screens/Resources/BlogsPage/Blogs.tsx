// src/pages/Blogs.tsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
// import { API_ENDPOINTS } from "../../../constants/apiEndpoints";

const BLOG_API = "/admin/api/posts";

function fmt(d: string | null) {
  if (!d) return "";
  return new Date(d).toLocaleDateString("en-IN", { year: "numeric", month: "long", day: "numeric" });
}

const RoomGrid = ({ color = "rgba(180,210,240,0.30)" }: { color?: string }) => {
  const W = 1440, H = 900, fw = W * 0.45, fh = H * 0.45;
  const fx = (W - fw) / 2, fy = (H - fh) / 2, fx2 = fx + fw, fy2 = fy + fh, n = 10;
  const lines: { x1: number; y1: number; x2: number; y2: number }[] = [];
  for (let i = 0; i <= n; i++) {
    const t = i / n;
    lines.push({ x1: W * t, y1: 0, x2: fx + fw * t, y2: fy });
    lines.push({ x1: W * t, y1: H, x2: fx + fw * t, y2: fy2 });
    lines.push({ x1: 0, y1: H * t, x2: fx, y2: fy + fh * t });
    lines.push({ x1: W, y1: H * t, x2: fx2, y2: fy + fh * t });
  }
  for (let i = 1; i < n; i++) {
    const t = i / n;
    lines.push({ x1: fx * t, y1: fy * t, x2: W - fx * t, y2: fy * t });
    lines.push({ x1: fx * t, y1: H - fy * t, x2: W - fx * t, y2: H - fy * t });
    lines.push({ x1: fx * t, y1: fy * t, x2: fx * t, y2: H - fy * t });
    lines.push({ x1: W - fx * t, y1: fy * t, x2: W - fx * t, y2: H - fy * t });
    lines.push({ x1: fx + fw * t, y1: fy, x2: fx + fw * t, y2: fy2 });
    lines.push({ x1: fx, y1: fy + fh * t, x2: fx2, y2: fy + fh * t });
  }
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      <svg width="100%" height="100%" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
        {lines.map((l, i) => <line key={i} x1={l.x1} y1={l.y1} x2={l.x2} y2={l.y2} stroke={color} strokeWidth="0.7" />)}
        <rect x={fx} y={fy} width={fw} height={fh} fill="none" stroke={color} strokeWidth="0.7" />
      </svg>
    </div>
  );
};

export default function Blogs() {
  const headingFont = "font-['Power_Grotesk',_'DM_Sans',_sans-serif]";
  const bodyFont = "font-['DM_Sans',_sans-serif]";

  const stats = [
    { title: "100+ Articles", desc: "Expert finance guides" },
    { title: "Weekly", desc: "Fresh content" },
    { title: "Free", desc: "Always free to read" },
    { title: "Expert Authors", desc: "Certified advisors" },
  ];

  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${BLOG_API}?status=PUBLISHED`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setPosts(data.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));

    // ── WordPress (commented out, keep for future reference) ──
    // const url = `${API_ENDPOINTS.WORDPRESS_BASE}${API_ENDPOINTS.POSTS}?per_page=20&_embed`;
    // fetch(url)
    //   .then((res) => res.json())
    //   .then((data) => { setPosts(data); setLoading(false); })
    //   .catch(() => setLoading(false));
  }, []);

  return (
    <>
      {/* Premium Hero */}
      <section className="bg-white relative overflow-hidden">
        <RoomGrid />
        <div className="container mx-auto max-w-7xl px-6 pt-8 pb-14 relative z-10">
          <div className="flex justify-center mb-10">
            <div className="flex items-center gap-2 border border-gray-300 rounded-full px-5 py-2.5 bg-gray-50">
              <svg className="w-5 h-5 text-[#0050B2]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              <span className={`text-gray-700 text-sm ${bodyFont}`}>India's most trusted platform</span>
            </div>
          </div>
          <div className="mb-6">
            <nav className={`flex items-center space-x-2 text-sm ${bodyFont}`}>
              <a href="/" className="text-gray-600 hover:text-gray-800">Home</a>
              <span className="text-gray-400">/</span>
              <span className="text-gray-600">Blogs</span>
            </nav>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-end">
            <h1 className={`text-4xl lg:text-5xl font-normal text-gray-900 leading-tight mb-4 ${headingFont}`}>
              Finance Insights & Expert Guides
            </h1>
            <p className={`text-lg text-gray-600 ${bodyFont}`}>
              Expert insights on loans, finance, and smart money decisions.
            </p>
          </div>
        </div>
        {/* Dark stats bar */}
        <div className="bg-[#0e396d] border-t border-white/10">
          <div className="container mx-auto max-w-7xl px-4">
            <div className="flex items-center justify-between flex-wrap lg:flex-nowrap">
              {stats.map((item, index, arr) => (
                <React.Fragment key={item.title}>
                  <div className="flex flex-col items-start gap-4 py-10 px-10 flex-1">
                    <h3 className={`font-normal text-white text-[22px] ${headingFont}`}>{item.title}</h3>
                    <p className={`text-[#a0cfff] text-base font-medium ${bodyFont}`}>{item.desc}</p>
                  </div>
                  {index < arr.length - 1 && <div className="hidden lg:block w-px h-[100px] bg-white/15 flex-shrink-0" />}
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Blog Cards Grid */}
      <section className="bg-[#f4f9ff]">
        <div className="max-w-7xl mx-auto px-6 py-16">
          {loading && (
            <div className={`py-20 text-center text-gray-400 text-sm ${bodyFont}`}>
              Loading articles...
            </div>
          )}
          {!loading && posts.length === 0 && (
            <div className={`py-20 text-center text-gray-400 text-sm ${bodyFont}`}>
              No posts published yet.
            </div>
          )}
          {!loading && posts.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
              {posts.map((post) => (
                <Link to={`/blogs/${post.slug}`} key={post.id} className="no-underline group">
                  <div className="bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-lg transition-shadow duration-200 h-full flex flex-col overflow-hidden">
                    {post.coverImage ? (
                      <div className="relative overflow-hidden bg-slate-100" style={{ paddingBottom: "56%" }}>
                        <img
                          src={post.coverImage}
                          alt={post.title}
                          className="absolute inset-0 w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="h-1.5 bg-[#1d4ed8]" />
                    )}
                    <div className="p-6 flex-1 flex flex-col">
                      <div className="flex items-center gap-2 mb-2.5">
                        {post.category?.name && (
                          <span className={`text-[11px] font-bold text-[#1d4ed8] uppercase tracking-widest ${bodyFont}`}>
                            {post.category.name}
                          </span>
                        )}
                        <span className={`text-[11px] text-gray-400 ml-auto ${bodyFont}`}>{fmt(post.publishedAt)}</span>
                      </div>
                      <h2 className={`text-[17px] font-semibold text-[#0a1628] leading-snug mb-2.5 flex-1 ${headingFont}`}>
                        {post.title}
                      </h2>
                      {post.excerpt && (
                        <p className={`text-[13px] text-gray-500 leading-relaxed mb-4 ${bodyFont}`}>
                          {post.excerpt.length > 110 ? post.excerpt.slice(0, 110) + "…" : post.excerpt}
                        </p>
                      )}
                      <div className={`flex items-center gap-2 pt-3.5 border-t border-slate-100 ${bodyFont}`}>
                        <div className="w-[26px] h-[26px] rounded-full bg-[#1d4ed8] text-white flex items-center justify-center text-[11px] font-bold flex-shrink-0">
                          {post.author?.name?.charAt(0).toUpperCase()}
                        </div>
                        <span className="text-[12px] text-gray-500">{post.author?.name}</span>
                        <span className="ml-auto text-[13px] font-bold text-[#1d4ed8]">Read →</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
