// src/routes/api/auth/logout/+server.ts
import { json } from '@sveltejs/kit';
import type { RequestHandler } from '@sveltejs/kit';

export const POST: RequestHandler = async ({ cookies }) => {
  // Clear the authentication cookies
  cookies.delete('admin_token', { path: '/admin' });
  cookies.delete('admin_refresh_token', { path: '/admin' });
  
  return json({ 
    success: true, 
    message: 'Logout realizado com sucesso' 
  });
};