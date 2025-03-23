import { NextRequest, NextResponse } from 'next/server';
import { verificationCodeService } from '@/services/verificationCode';
import { z } from 'zod';

// 验证码用途类型
type VerificationPurpose = 'REGISTER' | 'LOGIN' | 'RESET_PASSWORD';

// 请求验证模式
const verificationRequestSchema = z.object({
  email: z.string().email('请提供有效的电子邮件地址'),
  purpose: z.enum(['REGISTER', 'LOGIN', 'RESET_PASSWORD'], {
    errorMap: () => ({ message: '无效的验证码用途' }),
  }),
});

/**
 * 发送验证码
 * POST /api/auth/verification-code
 */
export async function POST(req: Request) {
  try {
    // 解析请求体
    const body = await req.json();
    
    // 校验请求数据
    const validation = verificationRequestSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: '无效的请求数据', details: validation.error.format() },
        { status: 400 }
      );
    }
    
    const { email, purpose } = validation.data;
    
    // 发送验证码
    const success = await verificationCodeService.sendCode(email, purpose);
    
    if (success) {
      return NextResponse.json({
        success: true,
        message: `验证码已发送至 ${email}`,
      });
    } else {
      return NextResponse.json(
        { error: '验证码发送失败，请稍后重试' },
        { status: 500 }
      );
    }
    
  } catch (error) {
    console.error('发送验证码错误:', error);
    return NextResponse.json(
      { error: '服务器错误', details: (error as Error).message },
      { status: 500 }
    );
  }
} 