// src/pages/Blogs.tsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
// import { API_ENDPOINTS } from "../../../constants/apiEndpoints";

const BLOG_API = "/admin/api/posts";

function fmt(d: string | null) {
  if (!d) return "";
  return new Date(d).toLocaleDateString("en-IN", { year: "numeric", month: "long", day: "numeric" });
}

export default function Blogs() {
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

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "28px" }}>
        {posts.map((post) => (
          <Link to={`/blogs/${post.slug}`} key={post.id} style={{ textDecoration: "none" }}>
            <div style={{
              background: "#fff",
              borderRadius: "16px",
              overflow: "hidden",
              border: "1px solid #e2e8f0",
              boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
              height: "100%",
              display: "flex",
              flexDirection: "column",
              transition: "transform 0.2s, box-shadow 0.2s",
            }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = "translateY(-4px)"; (e.currentTarget as HTMLElement).style.boxShadow = "0 12px 32px rgba(0,0,0,0.12)"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = "translateY(0)"; (e.currentTarget as HTMLElement).style.boxShadow = "0 2px 8px rgba(0,0,0,0.05)"; }}
            >
              {post.coverImage ? (
                <div style={{ position: "relative", paddingBottom: "56%", overflow: "hidden", background: "#f1f5f9" }}>
                  <img src={post.coverImage} alt={post.title} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
                </div>
              ) : (
                <div style={{ height: "6px", background: "#1d4ed8" }} />
              )}
              <div style={{ padding: "24px", flex: 1, display: "flex", flexDirection: "column" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "10px" }}>
                  {post.category?.name && (
                    <span style={{ fontSize: "11px", fontWeight: 700, color: "#1d4ed8", textTransform: "uppercase", letterSpacing: "1px" }}>
                      {post.category.name}
                    </span>
                  )}
                  <span style={{ fontSize: "11px", color: "#94a3b8", marginLeft: "auto" }}>{fmt(post.publishedAt)}</span>
                </div>
                <h2 style={{ fontSize: "17px", fontWeight: 700, color: "#0a1628", lineHeight: 1.4, margin: "0 0 10px", flex: 1 }}>
                  {post.title}
                </h2>
                {post.excerpt && (
                  <p style={{ fontSize: "13px", color: "#64748b", lineHeight: 1.6, margin: "0 0 18px" }}>
                    {post.excerpt.length > 110 ? post.excerpt.slice(0, 110) + "…" : post.excerpt}
                  </p>
                )}
                <div style={{ display: "flex", alignItems: "center", gap: "8px", paddingTop: "14px", borderTop: "1px solid #f1f5f9" }}>
                  <div style={{ width: "26px", height: "26px", borderRadius: "50%", background: "#1d4ed8", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "11px", fontWeight: 700, flexShrink: 0 }}>
                    {post.author?.name?.charAt(0).toUpperCase()}
                  </div>
                  <span style={{ fontSize: "12px", color: "#64748b" }}>{post.author?.name}</span>
                  <span style={{ marginLeft: "auto", fontSize: "13px", fontWeight: 700, color: "#1d4ed8" }}>Read →</span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
