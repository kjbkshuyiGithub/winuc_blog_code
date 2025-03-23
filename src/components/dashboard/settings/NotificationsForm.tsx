'use client';

import { useState } from 'react';
import { FiSave, FiCheckCircle, FiMessageSquare, FiMail, FiHeart, FiUserPlus } from 'react-icons/fi';

interface NotificationSetting {
  id: string;
  title: string;
  description: string;
  email: boolean;
  push: boolean;
  icon: React.ReactNode;
}

export default function NotificationsForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  
  // 通知设置状态
  const [settings, setSettings] = useState<NotificationSetting[]>([
    {
      id: 'comments',
      title: '评论通知',
      description: '当有人评论您的文章或回复您的评论时',
      email: true,
      push: true,
      icon: <FiMessageSquare className="h-5 w-5 text-primary-500" />,
    },
    {
      id: 'mentions',
      title: '提及通知',
      description: '当有人在评论或文章中提及您时',
      email: true,
      push: false,
      icon: <FiMail className="h-5 w-5 text-primary-500" />,
    },
    {
      id: 'likes',
      title: '点赞通知',
      description: '当有人点赞您的文章或评论时',
      email: false,
      push: true,
      icon: <FiHeart className="h-5 w-5 text-primary-500" />,
    },
    {
      id: 'follows',
      title: '关注通知',
      description: '当有人关注您时',
      email: true,
      push: true,
      icon: <FiUserPlus className="h-5 w-5 text-primary-500" />,
    },
  ]);
  
  // 处理开关切换
  const handleToggle = (id: string, channel: 'email' | 'push') => {
    setSettings(prev =>
      prev.map(setting => {
        if (setting.id === id) {
          return {
            ...setting,
            [channel]: !setting[channel],
          };
        }
        return setting;
      })
    );
  };
  
  // 提交表单
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // 这里应该调用API保存通知设置
      console.log('保存通知设置:', settings);
      
      // 模拟API调用延迟
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // 显示成功消息
      setShowSuccess(true);
      
      // 3秒后隐藏成功消息
      setTimeout(() => {
        setShowSuccess(false);
      }, 3000);
    } catch (error) {
      console.error('保存通知设置时出错:', error);
      alert('保存通知设置时出错，请稍后重试');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit}>
      {/* 成功消息 */}
      {showSuccess && (
        <div className="mb-6 bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 rounded-md p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <FiCheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-green-800 dark:text-green-200">
                通知偏好已成功保存
              </p>
            </div>
          </div>
        </div>
      )}
      
      <div className="space-y-6">
        {/* 说明文字 */}
        <p className="text-sm text-gray-600 dark:text-gray-400">
          选择您希望接收的通知以及接收方式。您可以随时更改这些设置。
        </p>
        
        {/* 通知设置列表 */}
        <div className="space-y-4">
          {settings.map((setting) => (
            <div
              key={setting.id}
              className="p-4 border border-gray-200 dark:border-gray-700 rounded-md"
            >
              <div className="flex items-start">
                <div className="flex-shrink-0 mt-1">{setting.icon}</div>
                <div className="ml-3 flex-grow">
                  <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                    {setting.title}
                  </h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    {setting.description}
                  </p>
                </div>
              </div>
              
              <div className="mt-4 grid grid-cols-2 gap-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    电子邮件
                  </span>
                  <button
                    type="button"
                    className={`relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 ${
                      setting.email ? 'bg-primary-600' : 'bg-gray-200 dark:bg-gray-600'
                    }`}
                    role="switch"
                    aria-checked={setting.email}
                    onClick={() => handleToggle(setting.id, 'email')}
                  >
                    <span
                      className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200 ${
                        setting.email ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    网站通知
                  </span>
                  <button
                    type="button"
                    className={`relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 ${
                      setting.push ? 'bg-primary-600' : 'bg-gray-200 dark:bg-gray-600'
                    }`}
                    role="switch"
                    aria-checked={setting.push}
                    onClick={() => handleToggle(setting.id, 'push')}
                  >
                    <span
                      className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200 ${
                        setting.push ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* 提交按钮 */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FiSave className="mr-2" />
            {isSubmitting ? '保存中...' : '保存偏好'}
          </button>
        </div>
      </div>
    </form>
  );
} 