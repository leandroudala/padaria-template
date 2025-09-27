// src/routes/api/auth/login/+server.ts
import { json } from '@sveltejs/kit';
import { z } from 'zod';
import { authenticateAdmin, generateAccessToken, generateRefreshToken } from '$lib/server/auth';
import type { RequestHandler } from '@sveltejs/kit';

const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(1, 'Senha é obrigatória')
});

export const POST: RequestHandler = async ({ request }) => {
  try {
    const body = await request.json();
    const validation = loginSchema.safeParse(body);
    
    if (!validation.success) {
      return json(
        { 
          error: 'Dados inválidos', 
          details: validation.error.flatten().fieldErrors 
        }, 
        { status: 400 }
      );
    }
    
    const { email, password } = validation.data;
    const user = await authenticateAdmin(email, password);
    
    if (!user) {
      return json(
        { error: 'Email ou senha incorretos' }, 
        { status: 401 }
      );
    }
    
    const tokenPayload = {
      userId: user.userId,
      email: user.email,
      role: 'admin' as const
    };
    
    const accessToken = generateAccessToken(tokenPayload);
    const refreshToken = generateRefreshToken(tokenPayload);
    
    return json({
      accessToken,
      refreshToken,
      user: {
        id: user.userId,
        email: user.email,
        role: 'admin'
      }
    });
    
  } catch (error) {
    console.error('Login error:', error);
    return json(
      { error: 'Erro interno do servidor' }, 
      { status: 500 }
    );
  }
};