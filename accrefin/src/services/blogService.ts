// src/services/blogService.ts
import { fetchApi } from './api';
import { BlogPost } from '../types';
import { API_ENDPOINTS } from '../constants'; // Use new constants

export const blogService = {
    getAllPosts: async (): Promise<BlogPost[]> => {
        const url = `${API_ENDPOINTS.WORDPRESS_BASE}${API_ENDPOINTS.POSTS}`;
        return fetchApi<BlogPost[]>(url);
    },
    getPostBySlug: async (slug: string): Promise<BlogPost | null> => {
        // ... logic to fetch single post by slug
        const url = `${API_ENDPOINTS.WORDPRESS_BASE}${API_ENDPOINTS.POST_BY_SLUG(slug)}`;
        const posts = await fetchApi<BlogPost[]>(url);
        return posts.length > 0 ? posts[0] : null;
    },
};