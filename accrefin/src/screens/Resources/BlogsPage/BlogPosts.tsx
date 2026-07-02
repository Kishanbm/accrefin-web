// src/pages/BlogPost.tsx
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
      <div style={{ padding: "80px 24px", textAlign: "center", color: "#94a3b8", fontSize: "15px" }}>
        Loading article...
      </div>
    );
  }

  if (!post) {
    return (
      <div style={{ padding: "80px 24px", textAlign: "center", color: "#94a3b8", fontSize: "15px" }}>
        Post not found.
      </div>
    );
  }

  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "32px 24px 80px" }}>
      {/* Back link */}
      <div style={{ marginBottom: "28px" }}>
        <Link to="/blogs" style={{ color: "#1d4ed8", textDecoration: "none", fontWeight: 600, fontSize: "14px", display: "inline-flex", alignItems: "center", gap: "6px" }}>
          ← Back to all articles
        </Link>
      </div>

      <div style={{ display: "flex", gap: "48px", alignItems: "flex-start", flexWrap: "wrap" }}>
        {/* Main article */}
        <div style={{ flex: 1, minWidth: "300px", maxWidth: "800px" }}>
          <article style={{ background: "white", borderRadius: "20px", overflow: "hidden", border: "1px solid #e2e8f0", boxShadow: "0 4px 24px rgba(0,0,0,0.06)" }}>
            {/* Hero */}
            <div style={{
              position: "relative",
              padding: "48px",
              background: post.coverImage ? "#07182c" : "#f8fafc",
              color: post.coverImage ? "white" : "#0a1628",
              minHeight: post.coverImage ? "360px" : "auto",
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-end",
            }}>
              {post.coverImage && (
                <>
                  <div style={{ position: "absolute", inset: 0, backgroundImage: `url(${post.coverImage})`, backgroundSize: "cover", backgroundPosition: "center" }} />
                  <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(7,24,44,0.96) 20%, rgba(7,24,44,0.55) 60%, rgba(7,24,44,0.2) 100%)" }} />
                </>
              )}
              <div style={{ position: "relative", zIndex: 1 }}>
                {post.category?.name && (
                  <span style={{ display: "inline-block", background: "#1d4ed8", color: "white", padding: "4px 14px", borderRadius: "4px", fontSize: "11px", fontWeight: 800, letterSpacing: "1.5px", textTransform: "uppercase", marginBottom: "16px" }}>
                    {post.category.name}
                  </span>
                )}
                <h1 style={{ fontSize: "36px", fontWeight: 800, lineHeight: 1.25, margin: "0 0 20px", color: post.coverImage ? "white" : "#0a1628" }}>
                  {post.title}
                </h1>
                <div style={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <div style={{ width: "36px", height: "36px", borderRadius: "50%", background: "#1d4ed8", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: "14px", flexShrink: 0 }}>
                      {post.author?.name?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: "14px", color: post.coverImage ? "white" : "#0a1628" }}>{post.author?.name}</div>
                      <div style={{ fontSize: "12px", color: post.coverImage ? "rgba(255,255,255,0.6)" : "#94a3b8" }}>{fmt(post.publishedAt)}</div>
                    </div>
                  </div>
                  {post.tags?.length > 0 && (
                    <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginLeft: "auto" }}>
                      {post.tags.map((tag: any) => (
                        <span key={tag.slug} style={{ background: post.coverImage ? "rgba(255,255,255,0.12)" : "#f1f5f9", border: post.coverImage ? "1px solid rgba(255,255,255,0.2)" : "1px solid #e2e8f0", color: post.coverImage ? "rgba(255,255,255,0.85)" : "#64748b", padding: "3px 10px", borderRadius: "100px", fontSize: "12px", fontWeight: 500 }}>
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
              style={{ padding: "48px", fontSize: "16px", lineHeight: 1.8, color: "#334155" }}
              className="blog-article-body"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          </article>
        </div>

        {/* Sidebar */}
        <aside style={{ width: "280px", flexShrink: 0, display: "flex", flexDirection: "column", gap: "24px" }}>
          <div style={{ background: "white", padding: "24px", borderRadius: "14px", border: "1px solid #e2e8f0", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
            <h3 style={{ fontSize: "15px", fontWeight: 700, color: "#0a1628", marginBottom: "16px", paddingBottom: "12px", borderBottom: "2px solid #f1f5f9" }}>
              About Accrefin
            </h3>
            <p style={{ fontSize: "13px", color: "#64748b", lineHeight: 1.6, margin: "0 0 16px" }}>
              We help you compare home loans from 30+ lenders in minutes. Expert advisors, zero cost.
            </p>
            <a href="/check-eligibility" style={{ display: "block", background: "#1d4ed8", color: "white", padding: "10px 16px", borderRadius: "8px", textAlign: "center", textDecoration: "none", fontSize: "13px", fontWeight: 700 }}>
              Check Your Eligibility →
            </a>
          </div>

          <div style={{ background: "#eff6ff", padding: "24px", borderRadius: "14px", border: "1px solid #bfdbfe" }}>
            <h3 style={{ fontSize: "14px", fontWeight: 700, color: "#1e40af", marginBottom: "10px" }}>
              Free EMI Calculator
            </h3>
            <p style={{ fontSize: "13px", color: "#3730a3", lineHeight: 1.55, margin: "0 0 14px" }}>
              Find out exactly how much your monthly payment will be before you apply.
            </p>
            <a href="/calculators/emi" style={{ display: "inline-block", background: "#1d4ed8", color: "white", padding: "8px 16px", borderRadius: "6px", textDecoration: "none", fontSize: "12px", fontWeight: 700 }}>
              Calculate Now →
            </a>
          </div>
        </aside>
      </div>
    </div>
  );
}
