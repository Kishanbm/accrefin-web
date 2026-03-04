// src/pages/BlogPost.tsx
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { API_ENDPOINTS } from "../../../constants/apiEndpoints";

export default function BlogPost() {
  const { slug } = useParams();
  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    const url = `${API_ENDPOINTS.WORDPRESS_BASE}${API_ENDPOINTS.POST_BY_SLUG(slug)}&_embed`;
    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        if (data.length > 0) setPost(data[0]);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [slug]);

  if (loading) return <p className="p-6">Loading...</p>;
  if (!post) return <p className="p-6">Post not found</p>;

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">{post.title.rendered}</h1>
      {post._embedded?.['wp:featuredmedia']?.[0]?.source_url && (
        <img
          src={post._embedded['wp:featuredmedia'][0].source_url}
          alt={post.title.rendered}
          className="mb-4 w-full h-auto object-cover rounded"
        />
      )}
      <div
        className="prose prose-lg"
        dangerouslySetInnerHTML={{ __html: post.content.rendered }}
      />
      <p className="mt-4 text-sm text-gray-500">{
        post.link && (
          <a href={post.link} target="_blank" rel="noreferrer">View original on blog</a>
        )
      }</p>
    </div>
  );
}
