'use client';

import { useState } from 'react';
import Link from 'next/link';
import RegisterForm from '@/components/auth/RegisterForm';
import VerificationCodeRegisterForm from '@/components/auth/VerificationCodeRegisterForm';
import { FiLock, FiMail } from 'react-icons/fi';

export default function RegisterPage() {
  const [registerType, setRegisterType] = useState<'password' | 'verificationCode'>('password');
  
  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-md w-full space-y-8 bg-white dark:bg-gray-800 p-8 rounded-xl shadow-md">
        {/* 注册类型切换 */}
        <div className="flex border-b border-gray-200 dark:border-gray-700 mb-6">
          <button
            className={`pb-3 px-4 text-sm font-medium border-b-2 -mb-px flex items-center ${
              registerType === 'password'
                ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
            onClick={() => setRegisterType('password')}
          >
            <FiLock className="mr-2" />
            <span>密码注册</span>
          </button>
          <button
            className={`pb-3 px-4 text-sm font-medium border-b-2 -mb-px flex items-center ${
              registerType === 'verificationCode'
                ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
            }`}
            onClick={() => setRegisterType('verificationCode')}
          >
            <FiMail className="mr-2" />
            <span>验证码注册</span>
          </button>
        </div>
        
        {/* 注册表单 */}
        {registerType === 'password' ? <RegisterForm /> : <VerificationCodeRegisterForm />}
        
        {/* 其他链接 */}
        <div className="mt-6 text-center">
          <div className="text-sm">
            <span className="text-gray-500 dark:text-gray-400">已有账号？</span>{' '}
            <Link
              href="/login"
              className="font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400"
            >
              立即登录
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 