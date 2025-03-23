import { NextRequest, NextResponse } from 'next/server';
import { verifyCode } from '@/services/verificationCode';
import { z } from 'zod';
import { verificationCodeService } from '@/services/verificationCode';
import type { VerificationPurpose } from '@prisma/client';

// 验证码用途类型
type VerificationPurpose = 'REGISTER' | 'LOGIN' | 'RESET_PASSWORD';

// 请求体验证 Schema
const verifyCodeSchema = z.object({
  email: z.string().email('请输入有效的电子邮件地址'),
  code: z.string().length(6, '验证码必须是6位数字'),
  purpose: z.enum(['REGISTER', 'LOGIN', 'RESET_PASSWORD'], {
    errorMap: () => ({ message: '无效的验证码用途' }),
  }),
});

// 请求验证模式
const verifyRequestSchema = z.object({
  email: z.string().email('请提供有效的电子邮件地址'),
  code: z.string().length(6, '验证码必须是6位数字'),
  purpose: z.enum(['REGISTER', 'LOGIN', 'RESET_PASSWORD'], {
    errorMap: () => ({ message: '无效的验证码用途' }),
  }),
});

/**
 * 验证验证码
 * POST /api/auth/verify-code
 */
export async function POST(req: Request) {
  try {
    // 解析请求体
    const body = await req.json();
    
    // 校验请求数据
    const validation = verifyRequestSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: '无效的请求数据', details: validation.error.format() },
        { status: 400 }
      );
    }
    
    const { email, code, purpose } = validation.data;
    
    // 验证验证码
    const verified = await verificationCodeService.verifyCode(
      email, 
      code, 
      purpose as VerificationPurpose
    );
    
    if (verified) {
      return NextResponse.json({
        success: true,
        message: '验证码验证成功',
      });
    } else {
      return NextResponse.json(
        { error: '验证码无效或已过期' },
        { status: 400 }
      );
    }
    
  } catch (error) {
    console.error('验证验证码错误:', error);
    return NextResponse.json(
      { error: '服务器错误', details: (error as Error).message },
      { status: 500 }
    );
  }
} 