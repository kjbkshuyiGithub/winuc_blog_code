import Link from 'next/link';
import Image from 'next/image';
import { FeaturedPosts } from '@/components/home/FeaturedPosts';
import { RecentPosts } from '@/components/home/RecentPosts';
import { HeroSection } from '@/components/home/HeroSection';
import { TeamSection } from '@/components/home/TeamSection';
import { NewsletterSection } from '@/components/home/NewsletterSection';

export const metadata = {
  title: '团队博客 | 首页',
  description: '我们团队的官方博客，分享最新的技术文章、团队动态和行业见解。',
};

export default function Home() {
  return (
    <main className="flex flex-col items-center min-h-screen">
      {/* 英雄区域 */}
      <HeroSection />
      
      {/* 特色文章 */}
      <section className="w-full max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100 sm:text-4xl">
            精选文章
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500 dark:text-gray-400">
            我们团队的最新技术探索和见解
          </p>
        </div>
        <FeaturedPosts />
      </section>
      
      {/* 最新文章 */}
      <section className="w-full bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100 sm:text-4xl">
              最新发布
            </h2>
            <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500 dark:text-gray-400">
              保持更新，了解我们的最新动态
            </p>
          </div>
          <RecentPosts />
          <div className="mt-12 text-center">
            <Link 
              href="/blog" 
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors duration-200"
            >
              查看所有文章
            </Link>
          </div>
        </div>
      </section>
      
      {/* 团队介绍 */}
      <TeamSection />
      
      {/* 订阅区域 */}
      <NewsletterSection />
    </main>
  );
} 