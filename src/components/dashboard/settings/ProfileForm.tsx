'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { FiUser, FiMail, FiInfo, FiUpload, FiSave, FiX } from 'react-icons/fi';
import { Avatar } from '@/components/Avatar';

// 表单验证schema
const profileSchema = z.object({
  name: z.string().min(2, '姓名至少需要2个字符').max(50, '姓名不能超过50个字符'),
  email: z.string().email('请输入有效的电子邮件地址'),
  bio: z.string().max(500, '个人简介不能超过500个字符').optional(),
});

type ProfileFormData = z.infer<typeof profileSchema>;

export default function ProfileForm() {
  const { data: session, update } = useSession();
  const router = useRouter();
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(
    session?.user?.image || null
  );
  const [updateMessage, setUpdateMessage] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: session?.user?.name || '',
      email: session?.user?.email || '',
      bio: '',
    },
  });
  
  // 处理头像更改
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      
      // 创建预览URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  
  // 清除头像
  const handleClearAvatar = () => {
    setAvatarFile(null);
    setAvatarPreview(null);
  };
  
  // 表单提交
  const onSubmit = async (data: ProfileFormData) => {
    setIsSubmitting(true);
    setUpdateMessage(null);
    
    try {
      // 创建表单数据对象用于上传文件
      const formData = new FormData();
      formData.append('name', data.name);
      formData.append('email', data.email);
      formData.append('bio', data.bio || '');
      
      // 如果有新头像，添加到表单数据
      if (avatarFile) {
        formData.append('avatar', avatarFile);
      } else if (avatarPreview === null) {
        // 如果用户清除了头像
        formData.append('removeAvatar', 'true');
      }
      
      // 调用API更新用户资料
      const response = await fetch('/api/user/profile', {
        method: 'PUT',
        body: formData,
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.message || '更新个人资料时出错');
      }
      
      // 更新会话数据，确保在全站更新头像
      await update({
        ...session,
        user: {
          ...session?.user,
          name: data.name,
          email: data.email,
          image: result.user.image,
          bio: data.bio
        }
      });
      
      // 提示成功
      setUpdateMessage({
        type: 'success',
        text: '个人资料已成功更新'
      });
      
      // 刷新页面以显示更新的信息
      router.refresh();
    } catch (error) {
      console.error('更新个人资料时出错:', error);
      setUpdateMessage({
        type: 'error',
        text: error instanceof Error ? error.message : '更新个人资料时出错，请稍后重试'
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* 状态消息 */}
      {updateMessage && (
        <div className={`p-4 rounded-md ${
          updateMessage.type === 'success' ? 'bg-green-50 text-green-800 dark:bg-green-900/30 dark:text-green-300' :
          'bg-red-50 text-red-800 dark:bg-red-900/30 dark:text-red-300'
        }`}>
          {updateMessage.text}
        </div>
      )}
      
      {/* 头像上传 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          头像
        </label>
        
        <div className="flex items-center space-x-4">
          <div className="w-24 h-24 rounded-full overflow-hidden">
            <Avatar
              src={avatarPreview}
              name={session?.user?.name || ''}
              alt="头像预览"
              size="xl"
            />
          </div>
          
          <label className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer">
            <FiUpload className="mr-2" />
            <span>上传新头像</span>
            <input
              type="file"
              accept="image/*"
              className="sr-only"
              onChange={handleAvatarChange}
            />
          </label>
          
          {avatarPreview && (
            <button
              type="button"
              onClick={handleClearAvatar}
              className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              <FiX className="mr-2" />
              移除头像
            </button>
          )}
        </div>
      </div>
      
      {/* 姓名 */}
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
      
      {/* 电子邮件 */}
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          电子邮件
        </label>
        <div className="relative rounded-md shadow-sm">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FiMail className="text-gray-400" />
          </div>
          <input
            id="email"
            type="email"
            {...register('email')}
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
      
      {/* 个人简介 */}
      <div>
        <label htmlFor="bio" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          个人简介
        </label>
        <div className="relative rounded-md shadow-sm">
          <div className="absolute top-3 left-3 text-gray-400">
            <FiInfo />
          </div>
          <textarea
            id="bio"
            {...register('bio')}
            rows={4}
            className={`block w-full pl-10 pr-3 py-2 rounded-md ${
              errors.bio
                ? 'border-red-300 focus:ring-red-500 focus:border-red-500 dark:border-red-600'
                : 'border-gray-300 focus:ring-primary-500 focus:border-primary-500 dark:border-gray-600'
            } dark:bg-gray-800 dark:text-white`}
            placeholder="分享一些关于您的信息..."
          ></textarea>
        </div>
        {errors.bio && (
          <p className="mt-2 text-sm text-red-600 dark:text-red-400">{errors.bio.message}</p>
        )}
      </div>
      
      {/* 提交按钮 */}
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <FiSave className="mr-2" />
          {isSubmitting ? '保存中...' : '保存更改'}
        </button>
      </div>
    </form>
  );
} 