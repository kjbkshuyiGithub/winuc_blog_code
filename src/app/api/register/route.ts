import { NextResponse } from "next/server";
import { hash } from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

// 注册表单验证模式
const registerSchema = z.object({
  name: z.string().min(2, "姓名至少需要2个字符").max(50, "姓名不能超过50个字符"),
  email: z.string().email("请输入有效的电子邮件地址"),
  password: z.string().min(8, "密码至少需要8个字符").max(100, "密码不能超过100个字符"),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    // 验证请求数据
    const result = registerSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: "验证失败", details: result.error.format() },
        { status: 400 }
      );
    }
    
    const { name, email, password } = result.data;
    
    // 检查邮箱是否已存在
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });
    
    if (existingUser) {
      return NextResponse.json(
        { error: "该邮箱已被注册" },
        { status: 409 }
      );
    }
    
    // 密码加密
    const hashedPassword = await hash(password, 12);
    
    // 创建用户并明确设置角色为USER
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: 'USER', // 明确指定用户角色
      },
    });
    
    console.log('用户注册成功:', {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    });
    
    // 返回成功响应（不包含密码）
    const { password: _, ...userWithoutPassword } = user;
    
    return NextResponse.json(
      { 
        message: "注册成功", 
        user: userWithoutPassword 
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("注册错误:", error);
    return NextResponse.json(
      { error: "注册失败，请稍后再试" },
      { status: 500 }
    );
  }
} 