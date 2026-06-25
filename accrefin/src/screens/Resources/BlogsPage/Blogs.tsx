// src/pages/Blogs.tsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
// import { API_ENDPOINTS } from "../../../constants/apiEndpoints";

const BLOGFLOW_API = "https://blog-management-zeta-flax.vercel.app/api/public/posts";
const BLOGFLOW_KEY = "bf_RDa2Z2oDaa2x2qjEZUbz3e1HaZrv4FxEMUCEQOx3";

function fmt(d: string | null) {
  if (!d) return "";
  return new Date(d).toLocaleDateString("en-IN", { year: "numeric", month: "long", day: "numeric" });
}

export default function Blogs() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // ── BlogFlow API ──
    fetch(`${BLOGFLOW_API}?apiKey=${BLOGFLOW_KEY}`)
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

  if (loading) {
    return (
      <div style={{ padding: "80px 24px", textAlign: "center", color: "#94a3b8", fontSize: "15px" }}>
        Loading articles...
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div style={{ padding: "80px 24px", textAlign: "center", color: "#94a3b8", fontSize: "15px" }}>
        No posts published yet.
      </div>
    );
  }

  const [featured, ...rest] = posts;
  const featuredImg = featured.coverImage;

  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "48px 24px 80px" }}>
      <div style={{ marginBottom: "48px" }}>
        <h1 style={{ fontSize: "36px", fontWeight: 800, color: "#0a1628", marginBottom: "8px" }}>
          Our Blog
        </h1>
        <p style={{ color: "#64748b", fontSize: "16px" }}>
          Expert insights on loans, finance, and smart money decisions.
        </p>
      </div>

      {/* Featured hero post */}
      <Link to={`/blogs/${featured.slug}`} style={{ textDecoration: "none", display: "block", marginBottom: "40px" }}>
        <div style={{
          position: "relative",
          borderRadius: "20px",
          overflow: "hidden",
          minHeight: "440px",
          background: featuredImg ? "#07182c" : "#1e3a5f",
          display: "flex",
          alignItems: "flex-end",
          cursor: "pointer",
        }}>
          {featuredImg && (
            <>
              <div style={{ position: "absolute", inset: 0, backgroundImage: `url(${featuredImg})`, backgroundSize: "cover", backgroundPosition: "center" }} />
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(7,24,44,0.96) 25%, rgba(7,24,44,0.5) 60%, rgba(7,24,44,0.15) 100%)" }} />
            </>
          )}
          <div style={{ position: "relative", zIndex: 1, padding: "48px", maxWidth: "760px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
              {featured.category?.name && (
                <span style={{ background: "#1d4ed8", color: "white", padding: "4px 14px", borderRadius: "4px", fontSize: "11px", fontWeight: 800, letterSpacing: "1.5px", textTransform: "uppercase" }}>
                  {featured.category.name}
                </span>
              )}
              <span style={{ fontSize: "13px", color: "rgba(255,255,255,0.55)" }}>{fmt(featured.publishedAt)}</span>
            </div>
            <h2 style={{ fontSize: "32px", fontWeight: 800, lineHeight: 1.25, margin: "0 0 14px", color: "white" }}>
              {featured.title}
            </h2>
            {featured.excerpt && (
              <p style={{ fontSize: "15px", color: "rgba(255,255,255,0.72)", lineHeight: 1.65, margin: "0 0 24px" }}>
                {featured.excerpt}
              </p>
            )}
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <div style={{ width: "34px", height: "34px", borderRadius: "50%", background: "#1d4ed8", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: "13px", flexShrink: 0 }}>
                {featured.author?.name?.charAt(0).toUpperCase()}
              </div>
              <span style={{ fontSize: "14px", color: "rgba(255,255,255,0.8)", fontWeight: 500 }}>{featured.author?.name}</span>
              <span style={{ marginLeft: "auto", background: "#1d4ed8", color: "white", padding: "9px 22px", borderRadius: "8px", fontSize: "13px", fontWeight: 700 }}>
                Read Article →
              </span>
            </div>
          </div>
        </div>
      </Link>

      {/* Remaining posts grid */}
      {rest.length > 0 && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "24px" }}>
          {rest.map((post) => (
            <Link to={`/blogs/${post.slug}`} key={post.id} style={{ textDecoration: "none" }}>
              <div style={{
                background: "#fff",
                borderRadius: "14px",
                overflow: "hidden",
                border: "1px solid #e2e8f0",
                boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                height: "100%",
                display: "flex",
                flexDirection: "column",
                transition: "transform 0.2s, box-shadow 0.2s",
              }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = "translateY(-3px)"; (e.currentTarget as HTMLElement).style.boxShadow = "0 10px 28px rgba(0,0,0,0.1)"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = "translateY(0)"; (e.currentTarget as HTMLElement).style.boxShadow = "0 2px 8px rgba(0,0,0,0.04)"; }}
              >
                {post.coverImage ? (
                  <div style={{ position: "relative", paddingBottom: "54%", overflow: "hidden", background: "#f1f5f9" }}>
                    <img src={post.coverImage} alt={post.title} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
                  </div>
                ) : (
                  <div style={{ height: "6px", background: "#1d4ed8" }} />
                )}
                <div style={{ padding: "20px", flex: 1, display: "flex", flexDirection: "column" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "10px" }}>
                    {post.category?.name && (
                      <span style={{ fontSize: "11px", fontWeight: 700, color: "#1d4ed8", textTransform: "uppercase", letterSpacing: "1px" }}>
                        {post.category.name}
                      </span>
                    )}
                    <span style={{ fontSize: "11px", color: "#94a3b8", marginLeft: "auto" }}>{fmt(post.publishedAt)}</span>
                  </div>
                  <h3 style={{ fontSize: "16px", fontWeight: 700, color: "#0a1628", lineHeight: 1.4, margin: "0 0 10px", flex: 1 }}>
                    {post.title}
                  </h3>
                  {post.excerpt && (
                    <p style={{ fontSize: "13px", color: "#64748b", lineHeight: 1.55, margin: "0 0 16px" }}>
                      {post.excerpt.length > 100 ? post.excerpt.slice(0, 100) + "…" : post.excerpt}
                    </p>
                  )}
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", paddingTop: "12px", borderTop: "1px solid #f1f5f9" }}>
                    <div style={{ width: "22px", height: "22px", borderRadius: "50%", background: "#1d4ed8", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "10px", fontWeight: 700, flexShrink: 0 }}>
                      {post.author?.name?.charAt(0).toUpperCase()}
                    </div>
                    <span style={{ fontSize: "12px", color: "#64748b" }}>{post.author?.name}</span>
                    <span style={{ marginLeft: "auto", fontSize: "12px", fontWeight: 700, color: "#1d4ed8" }}>Read →</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
