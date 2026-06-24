// src/pages/BlogPost.tsx
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
// import { API_ENDPOINTS } from "../../../constants/apiEndpoints";

const BLOGFLOW_API = "https://blog-management-zeta-flax.vercel.app/api/public/posts";
const BLOGFLOW_KEY = "bf_RDa2Z2oDaa2x2qjEZUbz3e1HaZrv4FxEMUCEQOx3";

export default function BlogPost() {
  const { slug } = useParams();
  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;

    // ── BlogFlow API ──
    fetch(`${BLOGFLOW_API}?apiKey=${BLOGFLOW_KEY}&slug=${slug}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data) setPost(data.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));

    // ── WordPress (commented out, keep for future reference) ──
    // const url = `${API_ENDPOINTS.WORDPRESS_BASE}${API_ENDPOINTS.POST_BY_SLUG(slug)}&_embed`;
    // fetch(url)
    //   .then((res) => res.json())
    //   .then((data) => {
    //     if (data.length > 0) setPost(data[0]);
    //     setLoading(false);
    //   })
    //   .catch(() => setLoading(false));
  }, [slug]);

  if (loading) return <p className="p-6">Loading...</p>;
  if (!post) return <p className="p-6">Post not found</p>;

  return (
    <div className="p-6 max-w-3xl mx-auto pb-20">
      {post.category?.name && (
        <span className="text-xs font-semibold uppercase tracking-widest text-blue-600">
          {post.category.name}
        </span>
      )}
      <h1 className="text-3xl font-bold mt-2 mb-4 leading-tight">{post.title}</h1>

      <div className="flex items-center gap-3 text-sm text-gray-400 mb-6">
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
        {post.tags?.length > 0 && (
          <div className="flex gap-2">
            {post.tags.map((tag: any) => (
              <span key={tag.slug} className="bg-gray-100 text-gray-500 px-2 py-0.5 rounded text-xs">
                {tag.name}
              </span>
            ))}
          </div>
        )}
      </div>

      {post.coverImage && (
        <img
          src={post.coverImage}
          alt={post.title}
          className="mb-8 w-full h-auto object-cover rounded-xl"
        />
      )}

      <div
        className="prose prose-lg max-w-none"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />
    </div>
  );
}
