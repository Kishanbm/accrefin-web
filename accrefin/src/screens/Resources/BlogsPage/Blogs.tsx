// src/pages/Blogs.tsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { API_ENDPOINTS } from "../../../constants/apiEndpoints";

export default function Blogs() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const url = `${API_ENDPOINTS.WORDPRESS_BASE}${API_ENDPOINTS.POSTS}?per_page=20&_embed`;
    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        setPosts(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className="p-6 max-w-3xl mx-auto md:w-full">
      <h1 className="text-3xl font-bold mb-4">Our Blog</h1>
      {loading ? (
        <p>Loading...</p>
      ) : (
        posts.map((post) => (
          <div key={post.id} className="mb-6">
            <Link to={`/blogs/${post.slug}`}>
              <h2 className="text-xl font-semibold text-blue-600 hover:underline">
                {post.title.rendered}
              </h2>
            </Link>
            {post._embedded?.['wp:featuredmedia']?.[0]?.source_url && (
              <img
                src={post._embedded['wp:featuredmedia'][0].source_url}
                alt={post.title.rendered}
                className="my-3 w-full h-auto object-cover rounded"
              />
            )}
            <div
              className="text-gray-700"
              dangerouslySetInnerHTML={{ __html: post.excerpt.rendered }}
            />
            <a href={post.link} target="_blank" rel="noreferrer" className="text-sm text-blue-600">
              View on blog →
            </a>
          </div>
        ))
      )}
    </div>
  );
}
