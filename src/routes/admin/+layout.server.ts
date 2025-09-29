// src/routes/admin/+layout.server.ts
import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ cookies, url }) => {
  const token = cookies.get('admin_token');
  
  // Allow access to login page
  if (url.pathname === '/admin/login') {
    // If already logged in, redirect to dashboard
    if (token) {
      throw redirect(302, '/admin/dashboard');
    }
    return {};
  }
  
  // For all other admin pages, require authentication
  if (!token) {
    throw redirect(302, '/admin/login');
  }
  
  return {};
};