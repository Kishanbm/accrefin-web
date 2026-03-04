// src/services/api.ts
export class ApiError extends Error {
    constructor(message: string, public status: number, public statusText: string) {
        super(message);
        this.name = 'ApiError';
    }
}

export const fetchApi = async <T>(url: string, options?: RequestInit): Promise<T> => {
    try {
        // ... API call logic with error handling (see [cite: 929-943] for detailed logic)
        const response = await fetch(url, options);
        if (!response.ok) {
            throw new ApiError(`API Error: ${response.statusText}`, response.status, response.statusText);
        }
        return await response.json();
    } catch (error) {
        if (error instanceof ApiError) {
            throw error;
        }
        throw new Error(`Network error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
};