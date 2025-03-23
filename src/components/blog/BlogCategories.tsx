'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FiFolder, FiChevronRight } from 'react-icons/fi';

// 模拟分类数据
const categories = [
  { name: '前端开发', count: 12, slug: 'frontend' },
  { name: '后端开发', count: 8, slug: 'backend' },
  { name: '云计算', count: 5, slug: 'cloud-computing' },
  { name: 'DevOps', count: 4, slug: 'devops' },
  { name: '人工智能', count: 6, slug: 'ai' },
  { name: '移动开发', count: 3, slug: 'mobile' },
  { name: '数据库', count: 5, slug: 'database' },
  { name: '安全', count: 4, slug: 'security' },
];

interface BlogCategoriesProps {
  activeCategory?: string;
}

export default function BlogCategories({ activeCategory }: BlogCategoriesProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(activeCategory || null);
  
  // 当activeCategory属性变化时更新选中状态
  useEffect(() => {
    if (activeCategory) {
      setSelectedCategory(activeCategory);
    }
  }, [activeCategory]);
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
        <FiFolder className="mr-2" />
        文章分类
      </h3>
      
      <ul className="space-y-2">
        {categories.map((category) => (
          <motion.li 
            key={category.slug}
            whileHover={{ x: 5 }}
            transition={{ duration: 0.2 }}
          >
            <Link 
              href={`/blog/category/${category.slug}`}
              className={`flex items-center justify-between py-2 px-3 rounded-md transition-colors ${
                selectedCategory === category.slug
                  ? 'bg-primary-50 dark:bg-primary-900 text-primary-600 dark:text-primary-400'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
              onClick={() => setSelectedCategory(category.slug)}
            >
              <span className="flex items-center">
                <FiChevronRight className="mr-2 h-4 w-4" />
                {category.name}
              </span>
              <span className="text-xs bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full px-2 py-1">
                {category.count}
              </span>
            </Link>
          </motion.li>
        ))}
      </ul>
    </div>
  );
} 