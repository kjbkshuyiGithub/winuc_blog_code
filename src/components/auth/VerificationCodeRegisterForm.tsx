'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { FiMail, FiUser, FiLogIn, FiArrowLeft } from 'react-icons/fi';
import VerificationCodeInput from './VerificationCodeInput';

// 表单验证模式
const registerSchema = z.object({
  name: z.string().min(2, '姓名至少需要2个字符').max(50, '姓名最多50个字符'),
  email: z.string().email('请输入有效的电子邮件地址'),
});

type RegisterFormData = z.infer<typeof registerSchema>;

export default function VerificationCodeRegisterForm() {
  const [step, setStep] = useState<'info' | 'verification'>('info');
  const [formData, setFormData] = useState<RegisterFormData | null>(null);
  const [isVerified, setIsVerified] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });
  
  // 处理基本信息表单提交
  const onSubmitInfo = async (data: RegisterFormData) => {
    setFormData(data);
    setStep('verification');
  };
  
  // 处理注册
  const handleRegister = async () => {
    if (!isVerified || !formData || !verificationCode) return;
    
    setLoading(true);
    setError('');
    
    try {
      // 发送注册请求
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          verificationCode,
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        setError(data.message || '注册失败，请重试');
        return;
      }
      
      // 注册成功后自动登录
      const result = await signIn('credentials', {
        email: formData.email,
        verificationCode,
        isVerificationCode: true,
        redirect: false,
      });
      
      if (result?.error) {
        setError('注册成功，但自动登录失败，请手动登录');
        return;
      }
      
      // 登录成功，跳转到仪表盘
      router.push('/dashboard');
      router.refresh();
    } catch (err) {
      setError('注册时发生错误，请重试');
      console.error('注册失败:', err);
    } finally {
      setLoading(false);
    }
  };
  
  // 返回信息输入
  const goBackToInfo = () => {
    setStep('info');
    setIsVerified(false);
    setVerificationCode('');
  };
  
  // 验证码验证回调
  const handleVerification = (success: boolean) => {
    setIsVerified(success);
    if (success) {
      // 验证成功后自动注册
      handleRegister();
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">验证码注册</h1>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          使用邮箱验证码快速注册账号
        </p>
      </div>
      
      {step === 'info' ? (
        <form onSubmit={handleSubmit(onSubmitInfo)} className="space-y-4">
          {/* 姓名输入 */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              姓名
            </label>
            <div className="relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiUser className="text-gray-400" />
              </div>
              <input
                id="name"
                type="text"
                {...register('name')}
                placeholder="请输入您的姓名"
                className={`block w-full pl-10 pr-3 py-2 rounded-md ${
                  errors.name
                    ? 'border-red-300 focus:ring-red-500 focus:border-red-500 dark:border-red-600'
                    : 'border-gray-300 focus:ring-primary-500 focus:border-primary-500 dark:border-gray-600'
                } dark:bg-gray-800 dark:text-white`}
              />
            </div>
            {errors.name && (
              <p className="mt-2 text-sm text-red-600 dark:text-red-400">{errors.name.message}</p>
            )}
          </div>
          
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
            继续
          </button>
        </form>
      ) : (
        <div className="space-y-4">
          {/* 返回信息输入 */}
          <button
            onClick={goBackToInfo}
            className="flex items-center text-sm text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300"
          >
            <FiArrowLeft className="mr-1 h-4 w-4" />
            返回
          </button>
          
          {/* 用户信息预览 */}
          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-md">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <FiUser className="mr-2 text-gray-500 dark:text-gray-400" />
                <span className="text-sm text-gray-700 dark:text-gray-300">{formData?.name}</span>
              </div>
              <div className="flex items-center">
                <FiMail className="mr-2 text-gray-500 dark:text-gray-400" />
                <span className="text-sm text-gray-700 dark:text-gray-300">{formData?.email}</span>
              </div>
            </div>
          </div>
          
          {/* 验证码输入 */}
          <VerificationCodeInput
            email={formData?.email || ''}
            purpose="REGISTER"
            onVerificationSuccess={handleVerification}
            onCodeChange={setVerificationCode}
          />
          
          {/* 错误提示 */}
          {error && (
            <div className="p-3 bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400 rounded-md text-sm">
              {error}
            </div>
          )}
          
          {/* 手动注册按钮，只在验证成功但没自动注册时显示 */}
          {isVerified && (
            <button
              onClick={handleRegister}
              disabled={loading}
              className="w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FiLogIn className="mr-2" />
              {loading ? '注册中...' : '完成注册'}
            </button>
          )}
        </div>
      )}
    </div>
  );
} 