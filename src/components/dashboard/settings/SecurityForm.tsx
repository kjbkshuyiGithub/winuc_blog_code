'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { FiLock, FiShield, FiAlertTriangle, FiSave } from 'react-icons/fi';

// 表单验证schema
const passwordSchema = z
  .object({
    currentPassword: z.string().min(1, '请输入当前密码'),
    newPassword: z
      .string()
      .min(8, '密码长度必须至少为8个字符')
      .regex(/[A-Z]/, '密码必须包含至少一个大写字母')
      .regex(/[a-z]/, '密码必须包含至少一个小写字母')
      .regex(/[0-9]/, '密码必须包含至少一个数字')
      .regex(/[^A-Za-z0-9]/, '密码必须包含至少一个特殊字符'),
    confirmPassword: z.string().min(1, '请确认新密码'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: '两次输入的密码不匹配',
    path: ['confirmPassword'],
  });

type PasswordFormData = z.infer<typeof passwordSchema>;

export default function SecurityForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
  });
  
  // 处理密码修改
  const onSubmit = async (data: PasswordFormData) => {
    setIsSubmitting(true);
    setSuccessMessage(null);
    
    try {
      // 这里应该调用API更新密码
      console.log('修改密码:', data);
      
      // 模拟API调用延迟
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // 重置表单
      reset();
      
      // 显示成功消息
      setSuccessMessage('密码已成功更新');
    } catch (error) {
      console.error('更新密码时出错:', error);
      alert('更新密码时出错，请稍后重试');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // 处理两步验证切换
  const handleTwoFactorToggle = async () => {
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // 切换状态
    setTwoFactorEnabled(!twoFactorEnabled);
    
    // 显示成功消息
    setSuccessMessage(
      twoFactorEnabled ? '两步验证已禁用' : '两步验证已启用'
    );
    
    // 延迟清除成功消息
    setTimeout(() => {
      setSuccessMessage(null);
    }, 3000);
  };
  
  return (
    <div className="space-y-8">
      {/* 成功消息 */}
      {successMessage && (
        <div className="bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 rounded-md p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <FiShield className="h-5 w-5 text-green-600 dark:text-green-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-green-800 dark:text-green-200">
                {successMessage}
              </p>
            </div>
          </div>
        </div>
      )}
      
      {/* 密码修改表单 */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
          修改密码
        </h3>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* 当前密码 */}
          <div>
            <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              当前密码
            </label>
            <div className="relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiLock className="text-gray-400" />
              </div>
              <input
                id="currentPassword"
                type="password"
                {...register('currentPassword')}
                className={`block w-full pl-10 pr-3 py-2 rounded-md ${
                  errors.currentPassword
                    ? 'border-red-300 focus:ring-red-500 focus:border-red-500 dark:border-red-600'
                    : 'border-gray-300 focus:ring-primary-500 focus:border-primary-500 dark:border-gray-600'
                } dark:bg-gray-800 dark:text-white`}
              />
            </div>
            {errors.currentPassword && (
              <p className="mt-2 text-sm text-red-600 dark:text-red-400">{errors.currentPassword.message}</p>
            )}
          </div>
          
          {/* 新密码 */}
          <div>
            <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              新密码
            </label>
            <div className="relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiLock className="text-gray-400" />
              </div>
              <input
                id="newPassword"
                type="password"
                {...register('newPassword')}
                className={`block w-full pl-10 pr-3 py-2 rounded-md ${
                  errors.newPassword
                    ? 'border-red-300 focus:ring-red-500 focus:border-red-500 dark:border-red-600'
                    : 'border-gray-300 focus:ring-primary-500 focus:border-primary-500 dark:border-gray-600'
                } dark:bg-gray-800 dark:text-white`}
              />
            </div>
            {errors.newPassword && (
              <p className="mt-2 text-sm text-red-600 dark:text-red-400">{errors.newPassword.message}</p>
            )}
          </div>
          
          {/* 确认新密码 */}
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              确认新密码
            </label>
            <div className="relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiLock className="text-gray-400" />
              </div>
              <input
                id="confirmPassword"
                type="password"
                {...register('confirmPassword')}
                className={`block w-full pl-10 pr-3 py-2 rounded-md ${
                  errors.confirmPassword
                    ? 'border-red-300 focus:ring-red-500 focus:border-red-500 dark:border-red-600'
                    : 'border-gray-300 focus:ring-primary-500 focus:border-primary-500 dark:border-gray-600'
                } dark:bg-gray-800 dark:text-white`}
              />
            </div>
            {errors.confirmPassword && (
              <p className="mt-2 text-sm text-red-600 dark:text-red-400">{errors.confirmPassword.message}</p>
            )}
          </div>
          
          {/* 密码安全提示 */}
          <div className="bg-gray-50 dark:bg-gray-700/30 rounded-md p-4 text-sm">
            <div className="flex">
              <div className="flex-shrink-0">
                <FiAlertTriangle className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
              </div>
              <div className="ml-3">
                <h4 className="font-medium text-gray-800 dark:text-gray-200">密码要求</h4>
                <ul className="mt-2 text-gray-600 dark:text-gray-400 list-disc pl-5 space-y-1">
                  <li>至少8个字符</li>
                  <li>至少包含一个大写字母</li>
                  <li>至少包含一个小写字母</li>
                  <li>至少包含一个数字</li>
                  <li>至少包含一个特殊字符</li>
                </ul>
              </div>
            </div>
          </div>
          
          {/* 提交按钮 */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FiSave className="mr-2" />
              {isSubmitting ? '更新中...' : '更新密码'}
            </button>
          </div>
        </form>
      </div>
      
      {/* 两步验证 */}
      <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
          两步验证
        </h3>
        
        <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/30 rounded-md">
          <div>
            <p className="text-sm font-medium text-gray-900 dark:text-white">
              {twoFactorEnabled ? '两步验证已启用' : '两步验证未启用'}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {twoFactorEnabled
                ? '您的账号已受到额外的安全层保护'
                : '启用两步验证以增强账号安全性'}
            </p>
          </div>
          
          <div className="ml-4">
            <button
              type="button"
              onClick={handleTwoFactorToggle}
              className={`relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 ${
                twoFactorEnabled ? 'bg-primary-600' : 'bg-gray-200 dark:bg-gray-600'
              }`}
              role="switch"
              aria-checked={twoFactorEnabled}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200 ${
                  twoFactorEnabled ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 