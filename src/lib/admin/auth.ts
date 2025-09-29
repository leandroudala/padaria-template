// src/lib/admin/auth.ts
import { browser } from '$app/environment';
import { goto } from '$app/navigation';

export interface AdminUser {
  userId: string;
  email: string;
  role: 'admin';
}

export class AdminAuth {
  private static instance: AdminAuth;
  private user: AdminUser | null = null;
  private token: string | null = null;
  private refreshToken: string | null = null;

  private constructor() {
    if (browser) {
      this.token = localStorage.getItem('admin_token');
      this.refreshToken = localStorage.getItem('admin_refresh_token');
    }
  }

  static getInstance(): AdminAuth {
    if (!AdminAuth.instance) {
      AdminAuth.instance = new AdminAuth();
    }
    return AdminAuth.instance;
  }

  isAuthenticated(): boolean {
    return !!this.token;
  }

  getToken(): string | null {
    return this.token;
  }

  getUser(): AdminUser | null {
    return this.user;
  }

  setTokens(accessToken: string, refreshToken: string, user?: AdminUser) {
    this.token = accessToken;
    this.refreshToken = refreshToken;
    this.user = user || null;
    
    if (browser) {
      localStorage.setItem('admin_token', accessToken);
      localStorage.setItem('admin_refresh_token', refreshToken);
      if (user) {
        localStorage.setItem('admin_user', JSON.stringify(user));
      }
    }
  }

  async refreshAccessToken(): Promise<boolean> {
    if (!this.refreshToken) return false;

    try {
      const response = await fetch('/api/auth/refresh', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ refreshToken: this.refreshToken })
      });

      if (response.ok) {
        const data = await response.json() as { accessToken: string };
        this.setTokens(data.accessToken, this.refreshToken!);
        return true;
      }
    } catch (error) {
      console.error('Token refresh failed:', error);
    }

    this.logout();
    return false;
  }

  async logout() {
    try {
      // Call logout endpoint to clear server-side cookies
      await fetch('/api/auth/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include'
      });
    } catch (error) {
      console.error('Logout API error:', error);
    } finally {
      // Clear local state
      this.token = null;
      this.refreshToken = null;
      this.user = null;
      
      if (browser) {
        localStorage.removeItem('admin_token');
        localStorage.removeItem('admin_refresh_token');
        localStorage.removeItem('admin_user');
        goto('/admin/login');
      }
    }
  }

  async requireAuth(): Promise<boolean> {
    if (!this.isAuthenticated()) {
      if (browser) {
        goto('/admin/login');
      }
      return false;
    }
    return true;
  }
}

export const adminAuth = AdminAuth.getInstance();