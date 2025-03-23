import { prisma } from '@/lib/prisma';
import type { VerificationPurpose } from '@prisma/client';
import { generateCode, mailService } from '@/utils/email';
import { codeConfig } from '@/config/email';

// 验证码服务
class VerificationCodeService {
  
  /**
   * 生成并发送验证码
   * @param email 用户邮箱
   * @param purpose 验证目的
   * @returns 是否发送成功
   */
  async sendCode(email: string, purpose: VerificationPurpose): Promise<boolean> {
    // 生成6位数验证码
    const code = generateCode();
    const expiry = new Date(Date.now() + codeConfig.expiresIn);
    
    try {
      // 保存到数据库
      await prisma.verificationCode.create({
        data: {
          email,
          code,
          purpose,
          expiresAt: expiry,
        },
      });
      
      // 发送邮件
      let result = false;
      
      if (purpose === 'REGISTER') {
        result = await mailService.sendVerificationEmail(email, code);
      } else if (purpose === 'LOGIN') { 
        result = await mailService.sendLoginEmail(email, code);
      } else if (purpose === 'RESET_PASSWORD') {
        result = await mailService.sendPasswordResetEmail(email, code);
      }
      
      return result;
    } catch (error) {
      console.error('发送验证码错误:', error);
      return false;
    }
  }
  
  /**
   * 验证码验证
   * @param email 用户邮箱
   * @param code 验证码
   * @param purpose 验证目的
   * @returns 验证是否成功
   */
  async verifyCode(email: string, code: string, purpose: VerificationPurpose): Promise<boolean> {
    try {
      // 查找有效的验证码
      const verificationCode = await prisma.verificationCode.findFirst({
        where: {
          email,
          code,
          purpose,
          used: false,
          expiresAt: {
            gt: new Date(),
          },
        },
      });
      
      if (!verificationCode) {
        return false;
      }
      
      // 标记为已使用
      await prisma.verificationCode.update({
        where: { id: verificationCode.id },
        data: { used: true, verifiedAt: new Date() },
      });
      
      return true;
    } catch (error) {
      console.error('验证码验证错误:', error);
      return false;
    }
  }
  
  /**
   * 清理过期的验证码
   */
  async cleanupExpiredCodes(): Promise<void> {
    try {
      await prisma.verificationCode.deleteMany({
        where: {
          expiresAt: {
            lt: new Date(),
          },
        },
      });
    } catch (error) {
      console.error('清理过期验证码错误:', error);
    }
  }

  /**
   * 检查用户是否最近完成了验证
   * @param email 用户邮箱
   * @param purpose 验证目的
   * @param timeWindowMs 时间窗口(毫秒) - 默认15分钟
   * @returns 是否在时间窗口内完成验证
   */
  async hasVerifiedRecently(
    email: string, 
    purpose: VerificationPurpose, 
    timeWindowMs = 15 * 60 * 1000
  ): Promise<boolean> {
    try {
      const recentTimestamp = new Date(Date.now() - timeWindowMs);
      
      // 查找最近成功验证的记录
      const verificationCode = await prisma.verificationCode.findFirst({
        where: {
          email,
          purpose,
          used: true,
          verifiedAt: {
            gte: recentTimestamp,
          },
        },
        orderBy: {
          verifiedAt: 'desc',
        },
      });
      
      return !!verificationCode;
    } catch (error) {
      console.error('检查最近验证状态错误:', error);
      return false;
    }
  }

  /**
   * 清除特定邮箱的所有验证码
   * @param email 用户邮箱
   */
  async clearCodes(email: string): Promise<void> {
    try {
      await prisma.verificationCode.deleteMany({
        where: { email },
      });
    } catch (error) {
      console.error('清除验证码错误:', error);
    }
  }
}

export const verificationCodeService = new VerificationCodeService(); 