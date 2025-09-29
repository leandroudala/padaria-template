// src/routes/api/auth/login/+server.ts
import { json } from '@sveltejs/kit';
import { z } from 'zod';
import { authenticateAdmin, generateAccessToken, generateRefreshToken } from '$lib/server/auth';
import type { RequestHandler } from '@sveltejs/kit';

const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(1, 'Senha é obrigatória')
});

export const POST: RequestHandler = async ({ request, cookies }) => {
  try {
    const body = await request.json();
    const validation = loginSchema.safeParse(body);
    
    if (!validation.success) {
      return json(
        { 
          success: false,
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
        { 
          success: false,
          error: 'Email ou senha incorretos' 
        }, 
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
    
    // Set cookies for server-side authentication
    cookies.set('admin_token', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/admin'
    });
    
    cookies.set('admin_refresh_token', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 30, // 30 days
      path: '/admin'
    });
    
    return json({
      success: true,
      data: {
        token: accessToken,
        refreshToken,
        user: {
          id: user.userId,
          email: user.email,
          role: 'admin'
        }
      }
    });
    
  } catch (error) {
    console.error('Login error:', error);
    return json(
      { 
        success: false,
        error: 'Erro interno do servidor' 
      }, 
      { status: 500 }
    );
  }
};