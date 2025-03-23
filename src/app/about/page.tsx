// 'use client';

import { Metadata } from 'next';
import dynamic from 'next/dynamic';

// 动态导入客户端组件
const ClientTeamSection = dynamic(() => import('@/components/about/ClientTeamSection'), { ssr: true });

export const metadata: Metadata = {
  title: '关于我们 | 团队博客',
  description: '了解我们的团队、使命和价值观',
};

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      {/* 页面头部 */}
      <div className="bg-gradient-to-r from-primary-600 to-secondary-600 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-extrabold text-white sm:text-5xl md:text-6xl">
            关于我们
          </h1>
          <p className="mt-4 max-w-3xl mx-auto text-xl text-white opacity-90">
            了解我们的团队以及我们的理念和价值观
          </p>
        </div>
      </div>

      {/* 公司简介 */}
      <section className="py-16 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                我们的故事
              </h2>
              <div className="mt-6 space-y-6 text-lg text-gray-600 dark:text-gray-300">
                <p>
                  团队博客是一个由热爱技术的开发者组成的团队创建的博客平台。我们成立于2020年，致力于分享高质量的技术内容，包括前端、后端、移动开发、人工智能等各个领域。
                </p>
                <p>
                  我们相信知识的力量和分享的价值。通过我们的博客，我们希望能够帮助更多的开发者学习新技术、解决问题，并在技术社区中建立联系。
                </p>
                <p>
                  无论是经验丰富的开发者还是刚刚入门的新手，我们都希望能够提供有价值的内容，帮助大家在技术的道路上不断进步。
                </p>
              </div>
            </div>
            <div className="relative h-80 lg:h-96 rounded-lg overflow-hidden shadow-xl">
              {/* 使用渐变背景替代图片 */}
              <div 
                className="absolute inset-0 bg-gradient-to-br from-primary-400 to-secondary-400 rounded-lg flex items-center justify-center p-6"
              >
                <p className="text-white text-center text-lg font-medium">
                  我们的团队由充满激情的技术爱好者组成，致力于创造高质量的内容和技术解决方案
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 使命与愿景 */}
      <section className="py-16 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
              使命与愿景
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white dark:bg-gray-900 rounded-lg p-8 shadow-md">
              <div className="flex items-center mb-4">
                <div className="bg-primary-100 dark:bg-primary-900 p-3 rounded-full">
                  <span className="h-6 w-6 text-primary-600 dark:text-primary-400">目标</span>
                </div>
                <h3 className="ml-4 text-xl font-semibold text-gray-900 dark:text-white">
                  我们的使命
                </h3>
              </div>
              <p className="text-gray-600 dark:text-gray-300">
                通过高质量的内容和开放的社区，赋能开发者，促进技术创新与知识共享。我们致力于创造一个开发者可以学习、交流和成长的平台。
              </p>
            </div>
            <div className="bg-white dark:bg-gray-900 rounded-lg p-8 shadow-md">
              <div className="flex items-center mb-4">
                <div className="bg-primary-100 dark:bg-primary-900 p-3 rounded-full">
                  <span className="h-6 w-6 text-primary-600 dark:text-primary-400">远景</span>
                </div>
                <h3 className="ml-4 text-xl font-semibold text-gray-900 dark:text-white">
                  我们的愿景
                </h3>
              </div>
              <p className="text-gray-600 dark:text-gray-300">
                成为开发者最信赖的技术社区，让技术知识的获取和分享变得更加简单和高效。我们期望看到越来越多的开发者通过我们的平台成长并做出贡献。
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 核心价值观 */}
      <section className="py-16 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
              核心价值观
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 shadow-md text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 mb-4 bg-primary-100 dark:bg-primary-900 rounded-full">
                <span className="text-primary-600 dark:text-primary-400">优秀</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                卓越
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                我们追求卓越，致力于提供最高质量的内容和最好的用户体验。
              </p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 shadow-md text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 mb-4 bg-primary-100 dark:bg-primary-900 rounded-full">
                <span className="text-primary-600 dark:text-primary-400">社区</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                社区
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                我们相信开放和包容的社区力量，鼓励多元的声音和观点。
              </p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 shadow-md text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 mb-4 bg-primary-100 dark:bg-primary-900 rounded-full">
                <span className="text-primary-600 dark:text-primary-400">创新</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                创新
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                我们拥抱变化和新技术，不断探索和创新，推动技术的发展。
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 团队成员 */}
      <ClientTeamSection />

      {/* 里程碑 */}
      <section className="py-16 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
              我们的里程碑
            </h2>
          </div>
          <div className="relative">
            {/* 时间线轴 */}
            <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-0.5 bg-gray-300 dark:bg-gray-700"></div>
            
            {/* 时间点 */}
            <div className="relative mb-12">
              <div className="flex items-center justify-center">
                <div className="bg-primary-600 dark:bg-primary-500 w-8 h-8 rounded-full z-10 flex items-center justify-center">
                  <span className="text-white">📅</span>
                </div>
              </div>
              <div className="bg-white dark:bg-gray-900 shadow-md rounded-lg p-6 mx-4 mt-4 lg:w-1/2 lg:mx-auto">
                <div className="font-bold text-primary-600 dark:text-primary-400 mb-1">2020年5月</div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  团队成立
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  我们的团队正式成立，开始了技术博客的创建之旅。
                </p>
              </div>
            </div>
            
            <div className="relative mb-12">
              <div className="flex items-center justify-center">
                <div className="bg-primary-600 dark:bg-primary-500 w-8 h-8 rounded-full z-10 flex items-center justify-center">
                  <span className="text-white">📅</span>
                </div>
              </div>
              <div className="bg-white dark:bg-gray-900 shadow-md rounded-lg p-6 mx-4 mt-4 lg:w-1/2 lg:ml-auto lg:mr-0">
                <div className="font-bold text-primary-600 dark:text-primary-400 mb-1">2021年3月</div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  社区成立
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  我们创建了开发者社区，为用户提供一个交流和学习的平台。
                </p>
              </div>
            </div>
            
            <div className="relative mb-12">
              <div className="flex items-center justify-center">
                <div className="bg-primary-600 dark:bg-primary-500 w-8 h-8 rounded-full z-10 flex items-center justify-center">
                  <span className="text-white">📅</span>
                </div>
              </div>
              <div className="bg-white dark:bg-gray-900 shadow-md rounded-lg p-6 mx-4 mt-4 lg:w-1/2 lg:mx-0">
                <div className="font-bold text-primary-600 dark:text-primary-400 mb-1">2022年1月</div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  平台升级
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  我们对平台进行了全面升级，提供了更多功能和更好的用户体验。
                </p>
              </div>
            </div>
            
            <div className="relative">
              <div className="flex items-center justify-center">
                <div className="bg-primary-600 dark:bg-primary-500 w-8 h-8 rounded-full z-10 flex items-center justify-center">
                  <span className="text-white">📅</span>
                </div>
              </div>
              <div className="bg-white dark:bg-gray-900 shadow-md rounded-lg p-6 mx-4 mt-4 lg:w-1/2 lg:ml-auto lg:mr-0">
                <div className="font-bold text-primary-600 dark:text-primary-400 mb-1">2023年9月</div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  国际化扩展
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  我们的平台开始支持多语言，向国际化迈出了重要的一步。
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
} 