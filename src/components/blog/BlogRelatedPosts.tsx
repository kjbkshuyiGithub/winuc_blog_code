'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { FiArrowRight } from 'react-icons/fi';

// 模拟相关文章数据
const relatedPosts = [
  {
    id: 1,
    title: 'React 18中的新Suspense特性详解',
    excerpt: '探索React 18中Suspense的改进和新功能，以及如何利用它们提升应用性能。',
    coverImage: '/images/blog/react-suspense.jpg',
    slug: 'react-18-suspense-features',
    category: '前端开发'
  },
  {
    id: 2,
    title: '使用React Query优化数据获取',
    excerpt: '学习如何使用React Query库简化数据获取、缓存和状态管理。',
    coverImage: '/images/blog/react-query.jpg',
    slug: 'optimize-data-fetching-with-react-query',
    category: '前端开发'
  },
  {
    id: 3,
    title: 'Next.js 13的App Router详解',
    excerpt: '深入了解Next.js 13的新路由系统，以及它如何改变React应用的构建方式。',
    coverImage: '/images/blog/nextjs-app-router.jpg',
    slug: 'nextjs-13-app-router-explained',
    category: '前端开发'
  }
];

interface BlogRelatedPostsProps {
  currentPostSlug?: string;
  category?: string;
}

export default function BlogRelatedPosts({ 
  currentPostSlug, 
  category 
}: BlogRelatedPostsProps) {
  // 过滤掉当前文章，并优先显示同类别的文章
  const filteredPosts = relatedPosts
    .filter(post => post.slug !== currentPostSlug)
    .sort((a, b) => {
      if (a.category === category && b.category !== category) return -1;
      if (a.category !== category && b.category === category) return 1;
      return 0;
    })
    .slice(0, 3); // 最多显示3篇相关文章
  
  if (filteredPosts.length === 0) {
    return null;
  }
  
  return (
    <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
      <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
        相关文章
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {filteredPosts.map((post, index) => (
          <motion.div
            key={post.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <Link 
              href={`/blog/${post.slug}`}
              className="block group"
            >
              <div className="relative h-48 mb-4 overflow-hidden rounded-lg bg-gray-200 dark:bg-gray-700">
                <div className="absolute inset-0 bg-gradient-to-br from-primary-400 to-secondary-400 opacity-70 group-hover:opacity-80 transition-opacity"></div>
                {post.coverImage && (
                  <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${post.coverImage})` }}></div>
                )}
              </div>
              
              <div>
                <span className="inline-block px-3 py-1 text-xs font-medium text-primary-700 bg-primary-100 dark:text-primary-300 dark:bg-primary-900 rounded-full mb-2">
                  {post.category}
                </span>
                
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors mb-2">
                  {post.title}
                </h4>
                
                <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2 mb-3">
                  {post.excerpt}
                </p>
                
                <span className="inline-flex items-center text-sm font-medium text-primary-600 dark:text-primary-400 group-hover:text-primary-700 dark:group-hover:text-primary-300 transition-colors">
                  阅读文章
                  <FiArrowRight className="ml-1 h-4 w-4" />
                </span>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
} 