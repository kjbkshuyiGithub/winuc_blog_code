'use client';

import { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import { FiSun, FiMoon, FiMonitor, FiCheckCircle, FiSave } from 'react-icons/fi';

interface ThemeOption {
  value: string;
  label: string;
  icon: React.ReactNode;
  description: string;
}

export default function AppearanceForm() {
  const { theme, setTheme } = useTheme();
  const [selectedTheme, setSelectedTheme] = useState<string>('system');
  const [showSuccess, setShowSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // 主题选项
  const themeOptions: ThemeOption[] = [
    {
      value: 'light',
      label: '浅色模式',
      icon: <FiSun className="h-6 w-6" />,
      description: '始终使用浅色主题',
    },
    {
      value: 'dark',
      label: '深色模式',
      icon: <FiMoon className="h-6 w-6" />,
      description: '始终使用深色主题',
    },
    {
      value: 'system',
      label: '跟随系统',
      icon: <FiMonitor className="h-6 w-6" />,
      description: '根据您的系统设置自动切换主题',
    },
  ];
  
  // 初始化选中的主题
  useEffect(() => {
    if (theme) {
      setSelectedTheme(theme);
    }
  }, [theme]);
  
  // 保存设置
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // 保存主题设置
      setTheme(selectedTheme);
      
      // 模拟API调用保存其他设置
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // 显示成功消息
      setShowSuccess(true);
      
      // 3秒后隐藏成功消息
      setTimeout(() => {
        setShowSuccess(false);
      }, 3000);
    } catch (error) {
      console.error('保存设置时出错:', error);
      alert('保存设置时出错，请稍后重试');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // 选择主题
  const handleThemeSelect = (value: string) => {
    setSelectedTheme(value);
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
                个性化设置已成功保存
              </p>
            </div>
          </div>
        </div>
      )}
      
      <div className="space-y-6">
        {/* 主题设置 */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
            主题设置
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {themeOptions.map((option) => (
              <div
                key={option.value}
                className={`border rounded-xl p-4 cursor-pointer transition-all ${
                  selectedTheme === option.value
                    ? 'border-primary-600 dark:border-primary-400 ring-2 ring-primary-600/20 dark:ring-primary-400/20'
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                }`}
                onClick={() => handleThemeSelect(option.value)}
              >
                <div className="flex flex-col items-center">
                  <div className={`p-3 rounded-full mb-3 ${
                    selectedTheme === option.value
                      ? 'bg-primary-100 dark:bg-primary-900/40 text-primary-600 dark:text-primary-400'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
                  }`}>
                    {option.icon}
                  </div>
                  <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                    {option.label}
                  </h4>
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400 text-center">
                    {option.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* 字体大小设置 */}
        <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
            字体大小
          </h3>
          
          <div>
            <label htmlFor="font-size" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              调整网站字体大小
            </label>
            <input
              id="font-size"
              type="range"
              min="80"
              max="120"
              step="5"
              defaultValue="100"
              className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-2">
              <span>小</span>
              <span>默认</span>
              <span>大</span>
            </div>
          </div>
        </div>
        
        {/* 提交按钮 */}
        <div className="flex justify-end pt-6">
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FiSave className="mr-2" />
            {isSubmitting ? '保存中...' : '保存设置'}
          </button>
        </div>
      </div>
    </form>
  );
} 