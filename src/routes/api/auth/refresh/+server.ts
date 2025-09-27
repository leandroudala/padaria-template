// src/routes/api/auth/refresh/+server.ts
import { json } from '@sveltejs/kit';
import { z } from 'zod';
import { requireRefreshToken, generateAccessToken } from '$lib/server/auth';
import type { RequestHandler } from '@sveltejs/kit';

const refreshSchema = z.object({
  refreshToken: z.string().min(1, 'Token de renovação é obrigatório')
});

export const POST: RequestHandler = async ({ request }) => {
  try {
    const body = await request.json();
    const validation = refreshSchema.safeParse(body);
    
    if (!validation.success) {
      return json(
        { 
          error: 'Dados inválidos', 
          details: validation.error.flatten().fieldErrors 
        }, 
        { status: 400 }
      );
    }
    
    const { refreshToken } = validation.data;
    const payload = requireRefreshToken(refreshToken);
    
    // Generate new access token
    const newAccessToken = generateAccessToken({
      userId: payload.userId,
      email: payload.email,
      role: payload.role
    });
    
    return json({
      accessToken: newAccessToken
    });
    
  } catch (error) {
    if (error instanceof Response) {
      throw error;
    }
    
    console.error('Refresh token error:', error);
    return json(
      { error: 'Erro interno do servidor' }, 
      { status: 500 }
    );
  }
};