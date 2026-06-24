// src/pages/Blogs.tsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
// import { API_ENDPOINTS } from "../../../constants/apiEndpoints";

const BLOGFLOW_API = "https://blog-management-zeta-flax.vercel.app/api/public/posts";
const BLOGFLOW_KEY = "bf_RDa2Z2oDaa2x2qjEZUbz3e1HaZrv4FxEMUCEQOx3";

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
    //   .then((data) => {
    //     setPosts(data);
    //     setLoading(false);
    //   })
    //   .catch(() => setLoading(false));
  }, []);

  return (
    <div className="p-6 max-w-3xl mx-auto md:w-full">
      <h1 className="text-3xl font-bold mb-4">Our Blog</h1>
      {loading ? (
        <p>Loading...</p>
      ) : posts.length === 0 ? (
        <p className="text-gray-500">No posts published yet.</p>
      ) : (
        posts.map((post) => (
          <div key={post.id} className="mb-6">
            <Link to={`/blogs/${post.slug}`}>
              <h2 className="text-xl font-semibold text-blue-600 hover:underline">
                {post.title}
              </h2>
            </Link>
            {post.coverImage && (
              <img
                src={post.coverImage}
                alt={post.title}
                className="my-3 w-full h-auto object-cover rounded"
              />
            )}
            {post.excerpt && (
              <p className="text-gray-700">{post.excerpt}</p>
            )}
            <div className="flex items-center gap-3 mt-2 text-sm text-gray-400">
              {post.author?.name && <span>{post.author.name}</span>}
              {post.publishedAt && (
                <span>
                  {new Date(post.publishedAt).toLocaleDateString("en-IN", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              )}
              {post.category?.name && (
                <span className="bg-blue-50 text-blue-600 px-2 py-0.5 rounded text-xs font-medium">
                  {post.category.name}
                </span>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );
}
