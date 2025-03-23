'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FiSearch } from 'react-icons/fi';

interface BlogSearchProps {
  initialSearchTerm?: string;
}

export default function BlogSearch({ initialSearchTerm = '' }: BlogSearchProps) {
  const [searchTerm, setSearchTerm] = useState(initialSearchTerm);
  const router = useRouter();
  
  // 当initialSearchTerm属性变化时更新搜索词
  useEffect(() => {
    if (initialSearchTerm) {
      setSearchTerm(initialSearchTerm);
    }
  }, [initialSearchTerm]);
  
  // 处理搜索提交
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      // 导航到搜索结果页面
      router.push(`/blog/search?q=${encodeURIComponent(searchTerm.trim())}`);
    }
  };
  
  // 处理热门搜索标签点击
  const handleTagClick = (tag: string) => {
    setSearchTerm(tag);
    router.push(`/blog/search?q=${encodeURIComponent(tag)}`);
  };
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
        <FiSearch className="mr-2" />
        搜索文章
      </h3>
      
      <form onSubmit={handleSubmit}>
        <div className="relative">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="输入关键词..."
            className="w-full px-4 py-2 pl-10 pr-4 rounded-md border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
          />
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          
          <button
            type="submit"
            className="mt-3 w-full px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
          >
            搜索
          </button>
        </div>
      </form>
      
      {/* 热门搜索标签 */}
      <div className="mt-4">
        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          热门搜索:
        </h4>
        <div className="flex flex-wrap gap-2">
          {['React', 'Next.js', 'TypeScript', '性能优化', '微服务'].map((tag) => (
            <button
              key={tag}
              onClick={() => handleTagClick(tag)}
              className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              {tag}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
} 