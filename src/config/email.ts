/**
 * 邮件验证系统配置
 */
export const emailConfig = {
  // Resend API 配置
  resend: {
    apiKey: process.env.RESEND_API_KEY || '',
    fromEmail: process.env.RESEND_FROM_EMAIL || 'noreply@yourdomain.com',
  },
  
  // 验证码配置
  verificationCode: {
    expiry: parseInt(process.env.VERIFICATION_CODE_EXPIRY || '10', 10), // 验证码有效期（分钟）
    length: 6, // 验证码长度
  },
  
  // 模板配置
  templates: {
    verificationCode: {
      subject: '您的注册验证码 - 团队博客',
    },
    
    login: {
      subject: '您的登录验证码 - 团队博客',
    },
    
    resetPassword: {
      subject: '重置密码验证码 - 团队博客',
    },
    
    welcome: {
      subject: '欢迎加入 - 团队博客',
    },
  },
};

// 验证码过期时间（毫秒）
export const codeConfig = {
  expiresIn: emailConfig.verificationCode.expiry * 60 * 1000,
}; 