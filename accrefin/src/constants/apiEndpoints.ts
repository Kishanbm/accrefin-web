// src/constants/apiEndpoints.ts
export const API_ENDPOINTS = {
    // Use VITE_WORDPRESS_API_URL from .env.example
    WORDPRESS_BASE: import.meta.env.VITE_WORDPRESS_API_URL || 
    'https://olivedrab-sandpiper-825908.hostingersite.com/wp-json/wp/v2',
    POSTS: '/posts',
    POST_BY_SLUG: (slug: string) => `/posts?slug=${slug}`,
} as const;