'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { FiArrowRight } from 'react-icons/fi';
import { useEffect, useState } from 'react';

// 相关文章接口定义
interface RelatedPost {
  id: string;
  title: string;
  description: string | null;
  slug: string;
  coverImage: string | null;
  category: {
    id: string;
    name: string;
    slug: string;
  } | null;
}

interface BlogRelatedPostsProps {
  currentPostId: string;
  categoryId?: string;
  tags?: {
    id: string;
    name: string;
    slug: string;
  }[];
}

export default function BlogRelatedPosts({ 
  currentPostId,
  categoryId,
  tags = []
}: BlogRelatedPostsProps) {
  const [relatedPosts, setRelatedPosts] = useState<RelatedPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // 获取相关文章
  useEffect(() => {
    const fetchRelatedPosts = async () => {
      try {
        // 构建查询参数
        const params = new URLSearchParams();
        params.append('exclude', currentPostId);
        if (categoryId) params.append('category', categoryId);
        if (tags && tags.length > 0) {
          const tagSlugs = tags.map(tag => tag.slug);
          params.append('tags', tagSlugs.join(','));
        }
        params.append('limit', '3'); // 最多显示3篇相关文章
        
        // 模拟从API获取数据
        // 实际应用中应该通过API获取
        // const response = await fetch(`/api/posts/related?${params.toString()}`);
        // if (response.ok) {
        //   const data = await response.json();
        //   setRelatedPosts(data.posts);
        // }
        
        // 使用模拟数据
        setRelatedPosts(defaultRelatedPosts);
      } catch (error) {
        console.error('获取相关文章失败:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchRelatedPosts();
  }, [currentPostId, categoryId, tags]);
  
  if (isLoading) {
    return (
      <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          相关文章
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((_, index) => (
            <div key={index} className="animate-pulse">
              <div className="h-48 bg-gray-300 dark:bg-gray-700 rounded-lg mb-4"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2 w-1/4"></div>
              <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2 w-3/4"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }
  
  if (relatedPosts.length === 0) {
    return null;
  }
  
  return (
    <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
      <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
        相关文章
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {relatedPosts.map((post, index) => (
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
                {post.coverImage ? (
                  <img
                    src={post.coverImage}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-br from-primary-400 to-secondary-400 opacity-70 group-hover:opacity-80 transition-opacity"></div>
                )}
              </div>
              
              <div>
                {post.category && (
                  <span className="inline-block px-3 py-1 text-xs font-medium text-primary-700 bg-primary-100 dark:text-primary-300 dark:bg-primary-900 rounded-full mb-2">
                    {post.category.name}
                  </span>
                )}
                
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors mb-2">
                  {post.title}
                </h4>
                
                {post.description && (
                  <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2 mb-3">
                    {post.description}
                  </p>
                )}
                
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

// 默认相关文章数据（用于模拟）
const defaultRelatedPosts: RelatedPost[] = [
  {
    id: '1',
    title: 'React 18中的新Suspense特性详解',
    description: '探索React 18中Suspense的改进和新功能，以及如何利用它们提升应用性能。',
    coverImage: '/images/blog/react-suspense.jpg',
    slug: 'react-18-suspense-features',
    category: {
      id: '1',
      name: '前端开发',
      slug: 'frontend'
    }
  },
  {
    id: '2',
    title: '使用React Query优化数据获取',
    description: '学习如何使用React Query库简化数据获取、缓存和状态管理。',
    coverImage: '/images/blog/react-query.jpg',
    slug: 'optimize-data-fetching-with-react-query',
    category: {
      id: '1',
      name: '前端开发',
      slug: 'frontend'
    }
  },
  {
    id: '3',
    title: 'Next.js 13的App Router详解',
    description: '深入了解Next.js 13的新路由系统，以及它如何改变React应用的构建方式。',
    coverImage: '/images/blog/nextjs-app-router.jpg',
    slug: 'nextjs-13-app-router-explained',
    category: {
      id: '1',
      name: '前端开发',
      slug: 'frontend'
    }
  }
]; 