import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { fetchCategories } from "./supabaseCms";
import type { CmsCategory } from "./cmsStore";
import { bodyFont } from "./blogTheme";

export function BlogCategoryNav() {
  const [params] = useSearchParams();
  const active = params.get("category") || "";
  const [categories, setCategories] = useState<CmsCategory[]>([]);

  useEffect(() => {
    fetchCategories().then(setCategories);
  }, []);

  return (
    <nav className="border-b border-gray-200 bg-white">
      <div className="max-w-7xl mx-auto px-4 md:px-6 flex items-center gap-6 overflow-x-auto py-3">
        <Link
          to="/blogs"
          className={`shrink-0 text-[12px] font-semibold uppercase tracking-widest no-underline ${bodyFont} ${
            !active ? "text-black" : "text-neutral-600 hover:text-black"
          }`}
        >
          All
        </Link>
        {categories
          .filter((c) => c.visible !== false)
          .map((c) => (
            <Link
              key={c.id}
              to={`/blogs?category=${encodeURIComponent(c.slug)}`}
              className={`shrink-0 text-[12px] font-semibold uppercase tracking-widest no-underline ${bodyFont} ${
                active === c.slug ? "text-black" : "text-neutral-600 hover:text-black"
              }`}
            >
              {c.name}
            </Link>
          ))}
      </div>
    </nav>
  );
}
