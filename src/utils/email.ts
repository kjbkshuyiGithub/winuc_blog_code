import { Resend } from 'resend';
import { emailConfig } from '@/config/email';

// 初始化 Resend 客户端
const resend = new Resend(emailConfig.resend.apiKey);

/**
 * 生成指定长度的随机验证码
 * @param length 验证码长度
 * @returns 生成的验证码
 */
export function generateCode(length = emailConfig.verificationCode.length): string {
  const chars = '0123456789';
  let code = '';
  
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * chars.length);
    code += chars[randomIndex];
  }
  
  return code;
}

/**
 * 邮件服务
 */
class MailService {
  /**
   * 发送注册验证码邮件
   * @param to 接收者邮箱
   * @param code 验证码
   * @returns 发送结果
   */
  async sendVerificationEmail(to: string, code: string) {
    try {
      const { subject } = emailConfig.templates.verificationCode;
      
      const result = await resend.emails.send({
        from: emailConfig.resend.fromEmail,
        to,
        subject,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
            <h2 style="color: #333; text-align: center;">验证您的邮箱</h2>
            <p style="color: #666; font-size: 16px; line-height: 1.5;">您好，</p>
            <p style="color: #666; font-size: 16px; line-height: 1.5;">感谢您注册我们的服务。请使用以下验证码完成注册：</p>
            <div style="background-color: #f5f5f5; padding: 15px; text-align: center; border-radius: 5px; margin: 20px 0;">
              <span style="font-size: 24px; font-weight: bold; letter-spacing: 5px; color: #333;">${code}</span>
            </div>
            <p style="color: #666; font-size: 16px; line-height: 1.5;">此验证码将在 ${emailConfig.verificationCode.expiry} 分钟后失效。</p>
            <p style="color: #666; font-size: 16px; line-height: 1.5;">如果您没有请求此验证码，请忽略此邮件。</p>
            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0; text-align: center; color: #999; font-size: 14px;">
              <p>团队博客 © ${new Date().getFullYear()} 版权所有</p>
            </div>
          </div>
        `,
      });
      
      return true;
    } catch (error) {
      console.error('发送验证码邮件失败:', error);
      return false;
    }
  }

  /**
   * 发送登录验证码邮件
   * @param to 接收者邮箱
   * @param code 验证码
   * @returns 发送结果
   */
  async sendLoginEmail(to: string, code: string) {
    try {
      const { subject } = emailConfig.templates.login;
      
      const result = await resend.emails.send({
        from: emailConfig.resend.fromEmail,
        to,
        subject,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
            <h2 style="color: #333; text-align: center;">登录验证码</h2>
            <p style="color: #666; font-size: 16px; line-height: 1.5;">您好，</p>
            <p style="color: #666; font-size: 16px; line-height: 1.5;">您正在尝试登录您的账户。请使用以下验证码完成登录：</p>
            <div style="background-color: #f5f5f5; padding: 15px; text-align: center; border-radius: 5px; margin: 20px 0;">
              <span style="font-size: 24px; font-weight: bold; letter-spacing: 5px; color: #333;">${code}</span>
            </div>
            <p style="color: #666; font-size: 16px; line-height: 1.5;">此验证码将在 ${emailConfig.verificationCode.expiry} 分钟后失效。</p>
            <p style="color: #666; font-size: 16px; line-height: 1.5;">如果您没有尝试登录，请您立即修改密码并联系管理员。</p>
            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0; text-align: center; color: #999; font-size: 14px;">
              <p>团队博客 © ${new Date().getFullYear()} 版权所有</p>
            </div>
          </div>
        `,
      });
      
      return true;
    } catch (error) {
      console.error('发送登录验证码邮件失败:', error);
      return false;
    }
  }

  /**
   * 发送密码重置验证码邮件
   * @param to 接收者邮箱
   * @param code 验证码
   * @returns 发送结果
   */
  async sendPasswordResetEmail(to: string, code: string) {
    try {
      const { subject } = emailConfig.templates.resetPassword;
      
      const result = await resend.emails.send({
        from: emailConfig.resend.fromEmail,
        to,
        subject,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
            <h2 style="color: #333; text-align: center;">重置密码验证码</h2>
            <p style="color: #666; font-size: 16px; line-height: 1.5;">您好，</p>
            <p style="color: #666; font-size: 16px; line-height: 1.5;">您正在尝试重置您的密码。请使用以下验证码完成密码重置：</p>
            <div style="background-color: #f5f5f5; padding: 15px; text-align: center; border-radius: 5px; margin: 20px 0;">
              <span style="font-size: 24px; font-weight: bold; letter-spacing: 5px; color: #333;">${code}</span>
            </div>
            <p style="color: #666; font-size: 16px; line-height: 1.5;">此验证码将在 ${emailConfig.verificationCode.expiry} 分钟后失效。</p>
            <p style="color: #666; font-size: 16px; line-height: 1.5;">如果您没有请求重置密码，请忽略此邮件或立即联系管理员。</p>
            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0; text-align: center; color: #999; font-size: 14px;">
              <p>团队博客 © ${new Date().getFullYear()} 版权所有</p>
            </div>
          </div>
        `,
      });
      
      return true;
    } catch (error) {
      console.error('发送密码重置验证码邮件失败:', error);
      return false;
    }
  }

  /**
   * 发送欢迎邮件
   * @param to 接收者邮箱
   * @param name 用户名称
   * @returns 发送结果
   */
  async sendWelcomeEmail(to: string, name: string) {
    try {
      const { subject } = emailConfig.templates.welcome;
      
      const result = await resend.emails.send({
        from: emailConfig.resend.fromEmail,
        to,
        subject,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
            <h2 style="color: #333; text-align: center;">欢迎加入团队博客！</h2>
            <p style="color: #666; font-size: 16px; line-height: 1.5;">您好 ${name}，</p>
            <p style="color: #666; font-size: 16px; line-height: 1.5;">感谢您注册成为我们的用户。我们很高兴您能加入我们的社区！</p>
            <p style="color: #666; font-size: 16px; line-height: 1.5;">现在您可以：</p>
            <ul style="color: #666; font-size: 16px; line-height: 1.5;">
              <li>浏览和阅读博客文章</li>
              <li>发表评论与其他用户互动</li>
              <li>管理您的个人资料</li>
            </ul>
            <p style="color: #666; font-size: 16px; line-height: 1.5;">如果您有任何问题，请随时与我们联系。</p>
            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0; text-align: center; color: #999; font-size: 14px;">
              <p>团队博客 © ${new Date().getFullYear()} 版权所有</p>
            </div>
          </div>
        `,
      });
      
      return true;
    } catch (error) {
      console.error('发送欢迎邮件失败:', error);
      return false;
    }
  }
}

// 导出邮件服务实例
export const mailService = new MailService();

// 为了向后兼容性，保留原来的函数
export const generateVerificationCode = generateCode;
export const sendVerificationEmail = (to: string, code: string) => mailService.sendVerificationEmail(to, code); 