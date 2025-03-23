import { NextResponse } from 'next/server';
import { z } from 'zod';
import { Resend } from 'resend';
import { emailConfig } from '@/config/email';
import { prisma } from '@/lib/prisma';

// 初始化Resend客户端
const resend = new Resend(emailConfig.resend.apiKey);

// 表单验证架构
const contactSchema = z.object({
  name: z.string().min(2, '姓名至少需要2个字符').max(50, '姓名不能超过50个字符'),
  email: z.string().email('请输入有效的电子邮件地址'),
  subject: z.string().min(5, '主题至少需要5个字符').max(100, '主题不能超过100个字符'),
  message: z.string().min(10, '消息至少需要10个字符').max(1000, '消息不能超过1000个字符'),
});

export async function POST(request: Request) {
  try {
    // 获取请求体
    const body = await request.json();
    
    // 验证表单数据
    const result = contactSchema.safeParse(body);
    
    if (!result.success) {
      // 返回验证错误
      return NextResponse.json(
        { 
          success: false, 
          message: '表单数据验证失败', 
          errors: result.error.flatten().fieldErrors 
        },
        { status: 400 }
      );
    }
    
    const { name, email, subject, message } = result.data;
    
    // 将消息保存到数据库
    try {
      await prisma.contactMessage.create({
        data: {
          name,
          email,
          subject,
          message,
        },
      });
    } catch (dbError) {
      console.error('保存消息到数据库失败:', dbError);
      // 继续处理，即使数据库保存失败也尝试发送邮件
    }
    
    // 发送邮件通知
    try {
      await resend.emails.send({
        from: emailConfig.resend.fromEmail,
        to: 'contact@teamblog.com', // 接收联系表单的邮箱
        subject: `新的联系表单提交: ${subject}`,
        html: `
          <h2>新的联系表单提交</h2>
          <p><strong>姓名:</strong> ${name}</p>
          <p><strong>邮箱:</strong> ${email}</p>
          <p><strong>主题:</strong> ${subject}</p>
          <p><strong>消息:</strong></p>
          <p>${message.replace(/\n/g, '<br>')}</p>
        `,
      });
      
      // 给用户发送确认邮件
      await resend.emails.send({
        from: emailConfig.resend.fromEmail,
        to: email,
        subject: '感谢您的留言',
        html: `
          <h2>我们已收到您的留言</h2>
          <p>尊敬的 ${name}，</p>
          <p>感谢您通过我们的网站联系我们。我们已收到您的消息，并会尽快回复您。</p>
          <p>以下是您提交的信息：</p>
          <p><strong>主题:</strong> ${subject}</p>
          <p><strong>消息:</strong></p>
          <p>${message.replace(/\n/g, '<br>')}</p>
          <p>如有任何疑问，请随时联系我们。</p>
          <p>祝好，</p>
          <p>团队博客团队</p>
        `,
      });
    } catch (emailError) {
      console.error('发送邮件失败:', emailError);
      // 如果邮件发送失败但数据库保存成功，仍然返回成功响应
      return NextResponse.json(
        { 
          success: true, 
          message: '我们已收到您的留言，但发送确认邮件失败。我们会尽快回复您。' 
        }
      );
    }
    
    return NextResponse.json({ 
      success: true, 
      message: '感谢您的留言！我们会尽快回复您。' 
    });
    
  } catch (error) {
    console.error('处理联系表单时出错:', error);
    return NextResponse.json(
      { success: false, message: '服务器错误，请稍后重试' },
      { status: 500 }
    );
  }
} 