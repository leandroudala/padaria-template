// src/routes/api/auth/logout/+server.ts
import { json } from '@sveltejs/kit';
import type { RequestHandler } from '@sveltejs/kit';

export const POST: RequestHandler = async () => {
  // In a production app, you would want to blacklist tokens
  // For this demo, we'll just return success since JWT tokens
  // are stateless and will expire naturally
  
  return json({ message: 'Logout realizado com sucesso' });
};