'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FiCalendar, FiUser, FiArrowRight } from 'react-icons/fi';
import { format } from 'date-fns';

// 文章类型定义
interface Post {
  id: string;
  title: string;
  slug: string;
  content: string;
  description: string | null;
  published: boolean;
  coverImage: string | null;
  createdAt: string;
  updatedAt: string;
  authorId: string;
  categoryId: string | null;
  category: {
    id: string;
    name: string;
    slug: string;
  } | null;
  author: {
    id: string;
    name: string | null;
    image: string | null;
  };
  tags: {
    id: string;
    name: string;
    slug: string;
  }[];
}

export function RecentPosts() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRecentPosts = async () => {
      setIsLoading(true);
      try {
        // 获取最近文章（已发布的前4篇，跳过精选的3篇）
        const response = await fetch('/api/posts?limit=4&skip=3');
        if (!response.ok) {
          throw new Error('获取最近文章失败');
        }
        
        const data = await response.json();
        // 添加数据验证，确保文章数据完整
        const validPosts = data.posts.filter((post: any) => 
          post && post.id && post.title && post.slug
        );
        setPosts(validPosts);
      } catch (err) {
        console.error('获取最近文章时出错:', err);
        setError('获取文章失败，请稍后重试');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchRecentPosts();
  }, []);
  
  if (isLoading) {
    return (
      <div className="space-y-8">
        {[...Array(4)].map((_, index) => (
          <div key={index} className="animate-pulse">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-4"></div>
              <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full mb-2"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }
  
  if (error || posts.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600 dark:text-gray-400">
          {error || '暂无最近文章'}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {posts.map((post, index) => (
        <motion.div
          key={post.id}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          viewport={{ once: true }}
          className="group relative rounded-lg bg-white dark:bg-gray-800 p-6 shadow-md hover:shadow-lg transition-shadow duration-300"
        >
          <div className="flex flex-col md:flex-row md:items-center">
            <div className="flex-1">
              <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 space-x-4 mb-2">
                <span className="flex items-center">
                  <FiCalendar className="mr-1 h-3 w-3" />
                  {format(new Date(post.createdAt), 'yyyy-MM-dd')}
                </span>
                <span className="flex items-center">
                  <FiUser className="mr-1 h-3 w-3" />
                  {post.author.name || '匿名作者'}
                </span>
                {post.category && (
                  <span className="inline-flex items-center rounded-full bg-gray-100 dark:bg-gray-700 px-2.5 py-0.5 text-xs font-medium text-gray-800 dark:text-gray-200">
                    {post.category.name}
                  </span>
                )}
              </div>
              
              <Link href={`/blog/${post.slug}`}>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors duration-200">
                  {post.title}
                </h3>
              </Link>
              
              <p className="mt-2 text-gray-600 dark:text-gray-300 line-clamp-2">
                {post.description || post.content.substring(0, 150) + '...'}
              </p>
            </div>
            
            <div className="mt-4 md:mt-0 md:ml-6">
              <Link
                href={`/blog/${post.slug}`}
                className="inline-flex items-center text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors"
              >
                阅读更多
                <FiArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
} 