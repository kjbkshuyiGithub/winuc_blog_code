'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { FiClock, FiTag } from 'react-icons/fi';
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

export function FeaturedPosts() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFeaturedPosts = async () => {
      setIsLoading(true);
      try {
        // 获取精选文章（只要已发布的前3篇）
        const response = await fetch('/api/posts?limit=3');
        if (!response.ok) {
          throw new Error('获取精选文章失败');
        }
        
        const data = await response.json();
        // 添加数据验证，确保文章数据完整
        const validPosts = data.posts.filter((post: any) => 
          post && post.id && post.title && post.slug
        );
        setPosts(validPosts);
      } catch (err) {
        console.error('获取精选文章时出错:', err);
        setError('获取文章失败，请稍后重试');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchFeaturedPosts();
  }, []);
  
  if (isLoading) {
    return (
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {[...Array(3)].map((_, index) => (
          <div key={index} className="animate-pulse">
            <div className="bg-gray-200 dark:bg-gray-700 h-48 w-full rounded-t-xl"></div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-b-xl">
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
          {error || '暂无精选文章'}
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
      {posts.map((post, index) => (
        <motion.div
          key={post.id}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          viewport={{ once: true }}
          className="group relative overflow-hidden rounded-xl bg-white dark:bg-gray-800 shadow-md hover:shadow-xl transition-shadow duration-300"
        >
          <Link href={`/blog/${post.slug}`} className="block">
            <div className="relative h-48 w-full overflow-hidden">
              {post.coverImage ? (
                <img 
                  src={post.coverImage} 
                  alt={post.title}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="absolute inset-0 bg-gray-200 dark:bg-gray-700">
                  <div className="h-full w-full bg-gradient-to-br from-primary-400 to-secondary-400 opacity-70"></div>
                </div>
              )}
              <div className="absolute top-4 right-4 z-10">
                {post.category && (
                  <span className="inline-flex items-center rounded-full bg-white/90 dark:bg-gray-900/90 px-3 py-1 text-xs font-medium text-gray-800 dark:text-gray-200">
                    <FiTag className="mr-1 h-3 w-3" />
                    {post.category.name}
                  </span>
                )}
              </div>
            </div>
            
            <div className="p-6">
              <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400 mb-3">
                <span className="inline-flex items-center">
                  <FiClock className="mr-1 h-3 w-3" />
                  {format(new Date(post.createdAt), 'yyyy-MM-dd')}
                </span>
              </div>
              
              <h3 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors duration-200">
                {post.title}
              </h3>
              
              <p className="mt-3 text-sm text-gray-600 dark:text-gray-300 line-clamp-3">
                {post.description || post.content.substring(0, 150) + '...'}
              </p>
              
              <div className="mt-6 flex items-center">
                {post.author.image ? (
                  <img 
                    src={post.author.image}
                    alt={post.author.name || '作者'}
                    className="h-8 w-8 rounded-full object-cover"
                  />
                ) : (
                  <div className="h-8 w-8 rounded-full bg-gray-300 dark:bg-gray-600">
                    {/* 作者头像占位符 */}
                  </div>
                )}
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {post.author.name || '匿名作者'}
                  </p>
                </div>
              </div>
            </div>
          </Link>
        </motion.div>
      ))}
    </div>
  );
} 