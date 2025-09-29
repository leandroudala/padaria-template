// src/lib/admin/api.ts
import { adminAuth } from './auth';

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export class AdminApi {
  private static async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const token = adminAuth.getToken();
    
    const headers = {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers
    };

    try {
      const response = await fetch(endpoint, {
        ...options,
        headers
      });

      // Handle unauthorized - try to refresh token
      if (response.status === 401 && token) {
        const refreshed = await adminAuth.refreshAccessToken();
        if (refreshed) {
          // Retry the request with new token
          return AdminApi.request(endpoint, options);
        }
        adminAuth.logout();
        return {
          success: false,
          error: 'Authentication required'
        };
      }

      const data = await response.json() as any;
      
      if (!response.ok) {
        return {
          success: false,
          error: data.message || 'Request failed'
        };
      }

      return {
        success: true,
        data: data as T
      };
    } catch (error) {
      console.error('API request failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Network error'
      };
    }
  }

  static async get<T>(endpoint: string): Promise<ApiResponse<T>> {
    return AdminApi.request<T>(endpoint, { method: 'GET' });
  }

  static async post<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return AdminApi.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined
    });
  }

  static async put<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return AdminApi.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined
    });
  }

  static async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    return AdminApi.request<T>(endpoint, { method: 'DELETE' });
  }
}

// Category API functions
export const categoryApi = {
  async getAll() {
    return AdminApi.get('/api/admin/categories');
  },
  
  async getById(id: string) {
    return AdminApi.get(`/api/admin/categories/${id}`);
  },
  
  async create(data: { name: string; description?: string; displayOrder?: number }) {
    return AdminApi.post('/api/admin/categories', data);
  },
  
  async update(id: string, data: { name: string; description?: string; displayOrder?: number; isActive?: boolean }) {
    return AdminApi.put(`/api/admin/categories/${id}`, data);
  },
  
  async delete(id: string) {
    return AdminApi.delete(`/api/admin/categories/${id}`);
  }
};

// Product API functions
export const productApi = {
  async getAll() {
    return AdminApi.get('/api/admin/products');
  },
  
  async getById(id: string) {
    return AdminApi.get(`/api/admin/products/${id}`);
  },
  
  async create(data: {
    name: string;
    description?: string;
    price: number;
    categoryId: string;
    isAvailable?: boolean;
  }) {
    return AdminApi.post('/api/admin/products', data);
  },
  
  async update(id: string, data: {
    name: string;
    description?: string;
    price: number;
    categoryId: string;
    isAvailable?: boolean;
  }) {
    return AdminApi.put(`/api/admin/products/${id}`, data);
  },
  
  async delete(id: string) {
    return AdminApi.delete(`/api/admin/products/${id}`);
  }
};