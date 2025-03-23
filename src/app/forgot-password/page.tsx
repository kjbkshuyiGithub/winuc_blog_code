'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { FiArrowLeft, FiMail } from 'react-icons/fi';
import VerificationCodeInput from '@/components/auth/VerificationCodeInput';

// 表单验证架构
const formSchema = z.object({
  email: z.string().email('请输入有效的电子邮件地址'),
});

type FormValues = z.infer<typeof formSchema>;

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [step, setStep] = useState<'email' | 'verification' | 'resetPassword'>('email');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [verificationSuccess, setVerificationSuccess] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
  });

  // 处理电子邮件提交
  const onSubmitEmail = async (data: FormValues) => {
    setEmail(data.email);
    setStep('verification');
  };

  // 验证码验证成功
  const handleVerificationSuccess = () => {
    setVerificationSuccess(true);
    setStep('resetPassword');
    setMessage('验证成功，请设置新密码');
  };

  // 重置密码
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      setError('两次输入的密码不一致');
      return;
    }
    
    if (password.length < 8) {
      setError('密码长度不能少于8个字符');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      // 发送重置密码请求
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setMessage('密码重置成功！即将为您跳转到登录页...');
        // 3秒后跳转到登录页
        setTimeout(() => {
          router.push('/login');
        }, 3000);
      } else {
        setError(data.error || '密码重置失败，请重试');
      }
    } catch (err) {
      setError('发生错误，请重试');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-md w-full space-y-8 bg-white dark:bg-gray-800 p-8 rounded-xl shadow-md">
        <div>
          <h2 className="mt-6 text-center text-2xl font-bold text-gray-900 dark:text-white">
            找回密码
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
            {step === 'email' && '请输入您的电子邮箱，我们将发送验证码'}
            {step === 'verification' && '请输入发送到您邮箱的验证码'}
            {step === 'resetPassword' && '请设置您的新密码'}
          </p>
        </div>

        {message && (
          <div className="bg-green-50 dark:bg-green-900/30 p-4 rounded-md text-green-800 dark:text-green-300 text-sm my-4">
            {message}
          </div>
        )}

        {error && (
          <div className="bg-red-50 dark:bg-red-900/30 p-4 rounded-md text-red-800 dark:text-red-300 text-sm my-4">
            {error}
          </div>
        )}

        {step === 'email' && (
          <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmitEmail)}>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                电子邮箱
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiMail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md leading-5 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  placeholder="请输入您的电子邮箱"
                  {...register('email')}
                />
              </div>
              {errors.email && (
                <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                获取验证码
              </button>
            </div>
          </form>
        )}

        {step === 'verification' && (
          <div className="mt-8">
            <div className="text-center mb-4">
              <span className="text-sm text-gray-500 dark:text-gray-400">
                验证码已发送至: <strong>{email}</strong>
              </span>
              <button
                onClick={() => setStep('email')}
                className="ml-2 text-primary-600 hover:text-primary-500 dark:text-primary-400 text-sm"
              >
                <FiArrowLeft className="inline mr-1" />
                更改
              </button>
            </div>
            
            <VerificationCodeInput
              email={email}
              purpose="RESET_PASSWORD"
              onVerificationSuccess={handleVerificationSuccess}
              onCodeChange={() => {}}
            />
          </div>
        )}

        {step === 'resetPassword' && verificationSuccess && (
          <form className="mt-8 space-y-6" onSubmit={handleResetPassword}>
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                新密码
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  type="password"
                  required
                  className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md leading-5 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  placeholder="请输入新密码"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  minLength={8}
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                确认新密码
              </label>
              <div className="mt-1">
                <input
                  id="confirmPassword"
                  type="password"
                  required
                  className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md leading-5 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  placeholder="请再次输入新密码"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  minLength={8}
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                disabled={loading}
              >
                {loading ? '处理中...' : '重置密码'}
              </button>
            </div>
          </form>
        )}

        <div className="mt-6 text-center">
          <div className="text-sm">
            <Link
              href="/login"
              className="font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400"
            >
              返回登录
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 