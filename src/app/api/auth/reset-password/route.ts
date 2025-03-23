import { NextResponse } from 'next/server';
import { z } from 'zod';
import { hash } from 'bcrypt';
import { prisma } from '@/lib/prisma';
import { verificationCodeService } from '@/services/verificationCode';

// 请求验证模式
const resetPasswordSchema = z.object({
  email: z.string().email('请提供有效的电子邮件地址'),
  password: z.string().min(8, '密码必须至少8个字符')
});

export async function POST(req: Request) {
  try {
    // 解析请求体
    const body = await req.json();
    
    // 校验请求数据
    const validation = resetPasswordSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: '无效的请求数据', details: validation.error.format() },
        { status: 400 }
      );
    }
    
    const { email, password } = validation.data;
    
    // 查找用户
    const user = await prisma.user.findUnique({
      where: { email },
    });
    
    if (!user) {
      return NextResponse.json(
        { error: '未找到该邮箱对应的用户' },
        { status: 404 }
      );
    }
    
    // 验证该用户最近是否请求了密码重置
    const isVerified = await verificationCodeService.hasVerifiedRecently(
      email,
      'RESET_PASSWORD'
    );
    
    if (!isVerified) {
      return NextResponse.json(
        { error: '验证失败，请重新验证您的邮箱' },
        { status: 400 }
      );
    }
    
    // 更新密码
    const hashedPassword = await hash(password, 10);
    await prisma.user.update({
      where: { id: user.id },
      data: { password: hashedPassword }
    });
    
    // 清除所有该邮箱的验证码
    await verificationCodeService.clearCodes(email);
    
    return NextResponse.json({ success: true, message: '密码已成功重置' });
    
  } catch (error) {
    console.error('重置密码错误:', error);
    return NextResponse.json(
      { error: '密码重置失败', details: (error as Error).message },
      { status: 500 }
    );
  }
} 