'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { FiMail, FiLogIn, FiArrowLeft } from 'react-icons/fi';
import VerificationCodeInput from './VerificationCodeInput';
import Link from 'next/link';

// 表单验证模式
const loginSchema = z.object({
  email: z.string().email('请输入有效的电子邮件地址'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function VerificationCodeLoginForm() {
  const [step, setStep] = useState<'email' | 'verification'>('email');
  const [email, setEmail] = useState('');
  const [isVerified, setIsVerified] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });
  
  // 处理邮箱表单提交
  const onSubmitEmail = async (data: LoginFormData) => {
    setEmail(data.email);
    setStep('verification');
  };
  
  // 处理验证码登录
  const handleLogin = async () => {
    if (!isVerified || !email || !verificationCode) return;
    
    setLoading(true);
    setError('');
    
    try {
      const result = await signIn('credentials', {
        email,
        verificationCode,
        isVerificationCode: true, // 标识是验证码登录
        redirect: false,
      });
      
      if (result?.error) {
        setError(result.error || '登录失败，请重试');
        return;
      }
      
      // 登录成功，刷新页面
      router.push('/dashboard');
      router.refresh();
    } catch (err) {
      setError('登录时发生错误，请重试');
      console.error('登录失败:', err);
    } finally {
      setLoading(false);
    }
  };
  
  // 返回邮箱输入
  const goBackToEmail = () => {
    setStep('email');
    setIsVerified(false);
    setVerificationCode('');
  };
  
  // 验证码验证回调
  const handleVerification = (success: boolean) => {
    setIsVerified(success);
    if (success) {
      // 验证成功后自动登录
      handleLogin();
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">验证码登录</h1>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          使用邮箱验证码快速登录
        </p>
      </div>
      
      {step === 'email' ? (
        <form onSubmit={handleSubmit(onSubmitEmail)} className="space-y-4">
          {/* 邮箱输入 */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              电子邮箱地址
            </label>
            <div className="relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiMail className="text-gray-400" />
              </div>
              <input
                id="email"
                type="email"
                {...register('email')}
                placeholder="请输入您的邮箱"
                className={`block w-full pl-10 pr-3 py-2 rounded-md ${
                  errors.email
                    ? 'border-red-300 focus:ring-red-500 focus:border-red-500 dark:border-red-600'
                    : 'border-gray-300 focus:ring-primary-500 focus:border-primary-500 dark:border-gray-600'
                } dark:bg-gray-800 dark:text-white`}
              />
            </div>
            {errors.email && (
              <p className="mt-2 text-sm text-red-600 dark:text-red-400">{errors.email.message}</p>
            )}
          </div>
          
          {/* 提交按钮 */}
          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            获取验证码
          </button>
        </form>
      ) : (
        <div className="space-y-4">
          {/* 返回邮箱输入 */}
          <button
            onClick={goBackToEmail}
            className="flex items-center text-sm text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300"
          >
            <FiArrowLeft className="mr-1 h-4 w-4" />
            更换邮箱
          </button>
          
          {/* 验证码输入 */}
          <VerificationCodeInput
            email={email}
            purpose="LOGIN"
            onVerificationSuccess={handleVerification}
            onCodeChange={setVerificationCode}
          />
          
          {/* 错误提示 */}
          {error && (
            <div className="p-3 bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400 rounded-md text-sm">
              {error}
            </div>
          )}
          
          {/* 手动登录按钮，只在验证成功但没自动登录时显示 */}
          {isVerified && (
            <button
              onClick={handleLogin}
              disabled={loading}
              className="w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FiLogIn className="mr-2" />
              {loading ? '登录中...' : '登录'}
            </button>
          )}
        </div>
      )}
      
      {/* 忘记密码链接 */}
      {step === 'email' && (
        <div className="flex justify-end mt-2">
          <Link
            href="/forgot-password"
            className="text-sm text-primary-600 hover:text-primary-500 dark:text-primary-400"
          >
            忘记密码?
          </Link>
        </div>
      )}
    </div>
  );
} 