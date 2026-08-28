// src/pages/BlogPost.tsx
import React from "react";
import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import "../../../styles/blog.css";
// import { API_ENDPOINTS } from "../../../constants/apiEndpoints";

const BLOG_API = "/admin/api/posts";

function fmt(d: string | null) {
  if (!d) return "";
  return new Date(d).toLocaleDateString("en-IN", { year: "numeric", month: "long", day: "numeric" });
}

export default function BlogPost() {
  const headingFont = "font-['Power_Grotesk',_'DM_Sans',_sans-serif]";
  const bodyFont = "font-['DM_Sans',_sans-serif]";

  const { slug } = useParams();
  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;

    fetch(`${BLOG_API}?status=PUBLISHED&slug=${slug}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data?.length > 0) setPost(data.data[0]);
        setLoading(false);
      })
      .catch(() => setLoading(false));

    // ── WordPress (commented out, keep for future reference) ──
    // const url = `${API_ENDPOINTS.WORDPRESS_BASE}${API_ENDPOINTS.POST_BY_SLUG(slug)}&_embed`;
    // fetch(url)
    //   .then((res) => res.json())
    //   .then((data) => { if (data.length > 0) setPost(data[0]); setLoading(false); })
    //   .catch(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <div className={`py-20 text-center text-gray-400 text-sm ${bodyFont}`}>
        Loading article...
      </div>
    );
  }

  if (!post) {
    return (
      <div className={`py-20 text-center text-gray-400 text-sm ${bodyFont}`}>
        Post not found.
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-6 py-10 pb-20">
        {/* Back link */}
        <div className="mb-7">
          <Link
            to="/blogs"
            className={`text-[#1d4ed8] hover:text-[#1e40af] no-underline font-semibold text-sm inline-flex items-center gap-1.5 ${bodyFont}`}
          >
            ← Back to all articles
          </Link>
        </div>

        <div className="flex gap-12 items-start flex-wrap">
          {/* Main article */}
          <div className="flex-1 min-w-[300px] max-w-[800px]">
            <article className="bg-white rounded-2xl overflow-hidden border border-gray-200 shadow-[0_4px_24px_rgba(0,0,0,0.06)]">
              {/* Hero */}
              <div
                className="relative p-12 flex flex-col justify-end"
                style={{
                  background: post.coverImage ? "#07182c" : "#f8fafc",
                  color: post.coverImage ? "white" : "#0a1628",
                  minHeight: post.coverImage ? "360px" : "auto",
                }}
              >
                {post.coverImage && (
                  <>
                    <div
                      className="absolute inset-0 bg-cover bg-center"
                      style={{ backgroundImage: `url(${post.coverImage})` }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[rgba(7,24,44,0.96)] via-[rgba(7,24,44,0.55)] to-[rgba(7,24,44,0.2)]" />
                  </>
                )}
                <div className="relative z-10">
                  {post.category?.name && (
                    <span
                      className={`inline-block bg-[#1d4ed8] text-white px-3.5 py-1 rounded text-[11px] font-extrabold tracking-[1.5px] uppercase mb-4 ${bodyFont}`}
                    >
                      {post.category.name}
                    </span>
                  )}
                  <h1
                    className={`text-4xl font-bold leading-tight mb-5 ${headingFont}`}
                    style={{ color: post.coverImage ? "white" : "#0a1628" }}
                  >
                    {post.title}
                  </h1>
                  <div className="flex items-center gap-3 flex-wrap">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-full bg-[#1d4ed8] text-white flex items-center justify-center font-bold text-sm flex-shrink-0">
                        {post.author?.name?.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div
                          className={`font-bold text-sm ${bodyFont}`}
                          style={{ color: post.coverImage ? "white" : "#0a1628" }}
                        >
                          {post.author?.name}
                        </div>
                        <div
                          className={`text-xs ${bodyFont}`}
                          style={{ color: post.coverImage ? "rgba(255,255,255,0.6)" : "#94a3b8" }}
                        >
                          {fmt(post.publishedAt)}
                        </div>
                      </div>
                    </div>
                    {post.tags?.length > 0 && (
                      <div className="flex gap-1.5 flex-wrap ml-auto">
                        {post.tags.map((tag: any) => (
                          <span
                            key={tag.slug}
                            className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${bodyFont}`}
                            style={{
                              background: post.coverImage ? "rgba(255,255,255,0.12)" : "#f1f5f9",
                              border: post.coverImage ? "1px solid rgba(255,255,255,0.2)" : "1px solid #e2e8f0",
                              color: post.coverImage ? "rgba(255,255,255,0.85)" : "#64748b",
                            }}
                          >
                            #{tag.name}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Article body */}
              <div
                className={`p-12 text-base leading-[1.8] text-slate-700 blog-article-body ${bodyFont}`}
                dangerouslySetInnerHTML={{ __html: post.content }}
              />
            </article>
          </div>

          {/* Sidebar */}
          <aside className="w-[280px] flex-shrink-0 flex flex-col gap-6">
            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
              <h3 className={`text-sm font-bold text-[#0a1628] mb-4 pb-3 border-b-2 border-slate-100 ${headingFont}`}>
                About Accrefin
              </h3>
              <p className={`text-[13px] text-gray-500 leading-relaxed mb-4 ${bodyFont}`}>
                We help you compare home loans from 30+ lenders in minutes. Expert advisors, zero cost.
              </p>
              <a
                href="/check-eligibility"
                className={`block bg-[#1d4ed8] text-white px-4 py-2.5 rounded-lg text-center no-underline text-[13px] font-bold hover:bg-[#1e40af] transition-colors ${bodyFont}`}
              >
                Check Your Eligibility →
              </a>
            </div>

            <div className="bg-[#eff6ff] p-6 rounded-2xl border border-[#bfdbfe]">
              <h3 className={`text-sm font-bold text-[#1e40af] mb-2.5 ${headingFont}`}>
                Free EMI Calculator
              </h3>
              <p className={`text-[13px] text-[#3730a3] leading-snug mb-3.5 ${bodyFont}`}>
                Find out exactly how much your monthly payment will be before you apply.
              </p>
              <a
                href="/calculators/emi"
                className={`inline-block bg-[#1d4ed8] text-white px-4 py-2 rounded-md no-underline text-xs font-bold hover:bg-[#1e40af] transition-colors ${bodyFont}`}
              >
                Calculate Now →
              </a>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
