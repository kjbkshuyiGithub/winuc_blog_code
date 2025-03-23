'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { FiCalendar, FiUser, FiTag, FiMessageSquare, FiEye } from 'react-icons/fi';
import { format } from 'date-fns';
import BlogPagination from './BlogPagination';

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

interface BlogListProps {
  category?: string;
  tag?: string;
  searchTerm?: string;
}

export default function BlogList({ category, tag, searchTerm }: BlogListProps) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 5;
  
  // 获取文章数据
  useEffect(() => {
    const fetchPosts = async () => {
      setIsLoading(true);
      try {
        // 构建查询参数
        const params = new URLSearchParams();
        if (category) params.append('category', category);
        if (tag) params.append('tag', tag);
        if (searchTerm) params.append('search', searchTerm);
        
        const response = await fetch(`/api/posts?${params.toString()}`);
        if (!response.ok) {
          throw new Error('获取文章失败');
        }
        
        const data = await response.json();
        setPosts(data.posts);
      } catch (err) {
        console.error('获取文章时出错:', err);
        setError('获取文章失败，请稍后重试');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchPosts();
  }, [category, tag, searchTerm]);
  
  // 计算当前页面显示的文章
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost);
  
  // 处理页面变化
  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    // 滚动到页面顶部
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  if (isLoading) {
    return (
      <div className="text-center py-12">
        <div className="animate-pulse space-y-4">
          {[...Array(3)].map((_, index) => (
            <div key={index} className="bg-gray-200 dark:bg-gray-700 h-48 rounded-xl"></div>
          ))}
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="text-center py-12">
        <h3 className="text-xl font-medium text-red-600 dark:text-red-400 mb-2">出错了</h3>
        <p className="text-gray-600 dark:text-gray-400">{error}</p>
      </div>
    );
  }
  
  if (posts.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">没有找到相关文章</h3>
        <p className="text-gray-600 dark:text-gray-400">
          请尝试其他分类、标签或搜索词
        </p>
      </div>
    );
  }
  
  return (
    <div>
      <div className="space-y-10">
        {currentPosts.map((post, index) => (
          <motion.article
            key={post.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
          >
            {post.coverImage ? (
              <div className="relative h-48 w-full">
                <img
                  src={post.coverImage}
                  alt={post.title}
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div className="relative h-48 w-full bg-gray-200 dark:bg-gray-700">
                <div className="absolute inset-0 bg-gradient-to-br from-primary-400 to-secondary-400 opacity-70"></div>
              </div>
            )}
            
            <div className="p-6">
              <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 space-x-4 mb-2">
                <span className="flex items-center">
                  <FiCalendar className="mr-1 h-3 w-3" />
                  {format(new Date(post.createdAt), 'yyyy-MM-dd')}
                </span>
                <span className="flex items-center">
                  <FiUser className="mr-1 h-3 w-3" />
                  {post.author?.name || '匿名用户'}
                </span>
                {post.category && (
                  <span className="flex items-center">
                    <FiTag className="mr-1 h-3 w-3" />
                    {post.category.name}
                  </span>
                )}
              </div>
              
              <Link href={`/blog/${post.slug}`}>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white hover:text-primary-600 dark:hover:text-primary-400 transition-colors duration-200 mb-3">
                  {post.title}
                </h2>
              </Link>
              
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                {post.description || post.content.substring(0, 150) + '...'}
              </p>
              
              <Link 
                href={`/blog/${post.slug}`}
                className="inline-flex items-center text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors"
              >
                阅读更多
              </Link>
            </div>
          </motion.article>
        ))}
      </div>
      
      {/* 分页 */}
      {posts.length > postsPerPage && (
        <div className="mt-12">
          <BlogPagination 
            currentPage={currentPage}
            totalPages={Math.ceil(posts.length / postsPerPage)}
            onPageChange={handlePageChange}
          />
        </div>
      )}
    </div>
  );
} 