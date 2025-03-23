'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { signIn } from 'next-auth/react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { FiMail, FiLock, FiEye, FiEyeOff, FiAlertCircle, FiCheckCircle } from 'react-icons/fi';

// 登录表单验证模式
const loginSchema = z.object({
  email: z.string().email("请输入有效的电子邮件地址"),
  password: z.string().min(1, "请输入密码"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/';
  const registered = searchParams.get('registered');
  
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });
  
  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await signIn('credentials', {
        redirect: false,
        email: data.email,
        password: data.password,
      });
      
      if (result?.error) {
        setError(result.error === 'CredentialsSignin' ? '邮箱或密码错误' : result.error);
        return;
      }
      
      // 登录成功，跳转到回调URL或首页
      router.push(callbackUrl);
      router.refresh();
    } catch (error) {
      console.error('登录错误:', error);
      setError('登录失败，请稍后再试');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-md mx-auto p-6 bg-white dark:bg-gray-800 rounded-xl shadow-md"
    >
      <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-6">
        登录账号
      </h2>
      
      {registered && (
        <div className="mb-4 p-3 bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 rounded-md text-green-600 dark:text-green-400 flex items-center">
          <FiCheckCircle className="mr-2 flex-shrink-0" />
          <span>注册成功！请使用您的新账号登录。</span>
        </div>
      )}
      
      {error && (
        <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-md text-red-600 dark:text-red-400 flex items-center">
          <FiAlertCircle className="mr-2 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* 邮箱字段 */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            邮箱
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiMail className="text-gray-400" />
            </div>
            <input
              id="email"
              type="email"
              {...register('email')}
              className={`w-full pl-10 pr-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                errors.email ? 'border-red-500 dark:border-red-500' : 'border-gray-300'
              }`}
              placeholder="请输入您的邮箱"
              disabled={isLoading}
            />
          </div>
          {errors.email && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.email.message}</p>
          )}
        </div>
        
        {/* 密码字段 */}
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            密码
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiLock className="text-gray-400" />
            </div>
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              {...register('password')}
              className={`w-full pl-10 pr-10 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                errors.password ? 'border-red-500 dark:border-red-500' : 'border-gray-300'
              }`}
              placeholder="请输入密码"
              disabled={isLoading}
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <FiEyeOff className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300" />
              ) : (
                <FiEye className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300" />
              )}
            </button>
          </div>
          {errors.password && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.password.message}</p>
          )}
        </div>
        
        {/* 记住我和忘记密码 */}
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <input
              id="remember-me"
              name="remember-me"
              type="checkbox"
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 dark:border-gray-600 dark:bg-gray-700 rounded"
            />
            <label
              htmlFor="remember-me"
              className="ml-2 block text-sm text-gray-900 dark:text-gray-300"
            >
              记住我
            </label>
          </div>
          
          <div className="text-sm">
            <Link
              href="/forgot-password"
              className="font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400"
            >
              忘记密码?
            </Link>
          </div>
        </div>
        
        {/* 提交按钮 */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-2 px-4 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isLoading ? '登录中...' : '登录'}
        </button>
      </form>
      
      <div className="mt-6 text-center text-sm">
        <p className="text-gray-600 dark:text-gray-400">
          还没有账号？{' '}
          <Link
            href="/register"
            className="text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300 font-medium"
          >
            立即注册
          </Link>
        </p>
      </div>
    </motion.div>
  );
} 