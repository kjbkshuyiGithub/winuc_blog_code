'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { FiArrowRight } from 'react-icons/fi';

export function HeroSection() {
  return (
    <section className="relative w-full overflow-hidden bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-950 py-16 sm:py-24 md:py-32">
      {/* 背景装饰 */}
      <div className="absolute inset-0 z-0 opacity-20 dark:opacity-10">
        <div className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-primary-200 dark:bg-primary-900 blur-3xl" />
        <div className="absolute -bottom-24 -left-24 h-96 w-96 rounded-full bg-secondary-200 dark:bg-secondary-900 blur-3xl" />
      </div>

      <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-5xl md:text-6xl">
              <span className="block">探索、分享、成长</span>
              <span className="block text-primary-600 dark:text-primary-400">
                我们的团队博客
              </span>
            </h1>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mt-6 text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto"
          >
            在这里，我们分享技术见解、行业趋势和团队故事。加入我们的旅程，一起探索技术的无限可能。
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-10 flex flex-col sm:flex-row justify-center gap-4"
          >
            <Link
              href="/blog"
              className="rounded-md bg-primary-600 px-8 py-3 text-base font-medium text-white shadow-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-colors duration-200 flex items-center justify-center"
            >
              浏览文章
              <FiArrowRight className="ml-2" />
            </Link>
            <Link
              href="/about"
              className="rounded-md bg-white dark:bg-gray-800 px-8 py-3 text-base font-medium text-primary-600 dark:text-primary-400 shadow-md hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-colors duration-200"
            >
              了解我们
            </Link>
          </motion.div>
        </div>

        {/* 移除波浪装饰，避免任何遮挡 */}
      </div>
    </section>
  );
} 