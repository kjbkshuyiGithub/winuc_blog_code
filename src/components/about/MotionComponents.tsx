'use client';

import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { FiCalendar } from 'react-icons/fi';

export const Title = ({ children }: { children: ReactNode }) => (
  <motion.h1 
    initial={{ opacity: 0, y: -20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    className="text-4xl font-extrabold text-white sm:text-5xl md:text-6xl"
  >
    {children}
  </motion.h1>
);

export const Description = ({ children }: { children: ReactNode }) => (
  <motion.p 
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.5, delay: 0.2 }}
    className="mt-4 max-w-3xl mx-auto text-xl text-white opacity-90"
  >
    {children}
  </motion.p>
);

export const StorySection = ({ children }: { children: ReactNode }) => (
  <motion.div
    initial={{ opacity: 0, x: -20 }}
    whileInView={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.5 }}
    viewport={{ once: true }}
  >
    {children}
  </motion.div>
);

export const ImageSection = () => (
  <motion.div
    initial={{ opacity: 0, x: 20 }}
    whileInView={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.5 }}
    viewport={{ once: true }}
    className="relative h-80 lg:h-96 rounded-lg overflow-hidden shadow-xl"
  >
    {/* 使用渐变背景替代图片 */}
    <div 
      className="absolute inset-0 bg-gradient-to-br from-primary-400 to-secondary-400 rounded-lg flex items-center justify-center p-6"
    >
      <p className="text-white text-center text-lg font-medium">
        我们的团队由充满激情的技术爱好者组成，致力于创造高质量的内容和技术解决方案
      </p>
    </div>
  </motion.div>
);

export const SectionTitle = ({ children }: { children: ReactNode }) => (
  <motion.h2
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    viewport={{ once: true }}
    className="text-3xl font-bold text-gray-900 dark:text-white"
  >
    {children}
  </motion.h2>
);

export const Mission = ({ icon }: { icon: ReactNode }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay: 0.1 }}
    viewport={{ once: true }}
    className="bg-white dark:bg-gray-900 rounded-lg p-8 shadow-md"
  >
    <div className="flex items-center mb-4">
      <div className="bg-primary-100 dark:bg-primary-900 p-3 rounded-full">
        {icon}
      </div>
      <h3 className="ml-4 text-xl font-semibold text-gray-900 dark:text-white">
        我们的使命
      </h3>
    </div>
    <p className="text-gray-600 dark:text-gray-300">
      通过高质量的内容和开放的社区，赋能开发者，促进技术创新与知识共享。我们致力于创造一个开发者可以学习、交流和成长的平台。
    </p>
  </motion.div>
);

export const Vision = ({ icon }: { icon: ReactNode }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay: 0.2 }}
    viewport={{ once: true }}
    className="bg-white dark:bg-gray-900 rounded-lg p-8 shadow-md"
  >
    <div className="flex items-center mb-4">
      <div className="bg-primary-100 dark:bg-primary-900 p-3 rounded-full">
        {icon}
      </div>
      <h3 className="ml-4 text-xl font-semibold text-gray-900 dark:text-white">
        我们的愿景
      </h3>
    </div>
    <p className="text-gray-600 dark:text-gray-300">
      成为开发者最信赖的技术社区，让技术知识的获取和分享变得更加简单和高效。我们期望看到越来越多的开发者通过我们的平台成长并做出贡献。
    </p>
  </motion.div>
);

export const ValueCard = ({ 
  icon, 
  title, 
  description, 
  delay 
}: { 
  icon: ReactNode; 
  title: string; 
  description: string; 
  delay: number 
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay }}
    viewport={{ once: true }}
    className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 shadow-md text-center"
  >
    <div className="inline-flex items-center justify-center w-12 h-12 mb-4 bg-primary-100 dark:bg-primary-900 rounded-full">
      {icon}
    </div>
    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
      {title}
    </h3>
    <p className="text-gray-600 dark:text-gray-300">
      {description}
    </p>
  </motion.div>
);

export const Timeline = () => (
  <section className="py-16 bg-gray-50 dark:bg-gray-800">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-12">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-3xl font-bold text-gray-900 dark:text-white"
        >
          我们的里程碑
        </motion.h2>
      </div>
      <div className="relative">
        {/* 时间线轴 */}
        <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-0.5 bg-gray-300 dark:bg-gray-700"></div>
        
        {/* 时间点1 */}
        <TimelineItem 
          date="2020年5月"
          title="团队成立"
          description="我们的团队正式成立，开始了技术博客的创建之旅。"
          delay={0.1}
          align="center"
        />
        
        {/* 时间点2 */}
        <TimelineItem 
          date="2021年3月"
          title="社区成立"
          description="我们创建了开发者社区，为用户提供一个交流和学习的平台。"
          delay={0.2}
          align="right"
        />
        
        {/* 时间点3 */}
        <TimelineItem 
          date="2022年1月"
          title="平台升级"
          description="我们对平台进行了全面升级，提供了更多功能和更好的用户体验。"
          delay={0.3}
          align="left"
        />
        
        {/* 时间点4 */}
        <TimelineItem 
          date="2023年9月"
          title="国际化扩展"
          description="我们的平台开始支持多语言，向国际化迈出了重要的一步。"
          delay={0.4}
          align="right"
          isLast={true}
        />
      </div>
    </div>
  </section>
);

const TimelineItem = ({ 
  date, 
  title, 
  description, 
  delay,
  align,
  isLast = false
}: { 
  date: string; 
  title: string; 
  description: string; 
  delay: number;
  align: 'left' | 'right' | 'center';
  isLast?: boolean;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay }}
    viewport={{ once: true }}
    className={`relative ${!isLast ? 'mb-12' : ''}`}
  >
    <div className="flex items-center justify-center">
      <div className="bg-primary-600 dark:bg-primary-500 w-8 h-8 rounded-full z-10 flex items-center justify-center">
        <FiCalendar className="text-white" />
      </div>
    </div>
    <div className={`bg-white dark:bg-gray-900 shadow-md rounded-lg p-6 mx-4 mt-4 ${
      align === 'center' ? 'lg:w-1/2 lg:mx-auto' : 
      align === 'right' ? 'lg:w-1/2 lg:ml-auto lg:mr-0' : 
      'lg:w-1/2 lg:mx-0'
    }`}>
      <div className="font-bold text-primary-600 dark:text-primary-400 mb-1">{date}</div>
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
        {title}
      </h3>
      <p className="text-gray-600 dark:text-gray-300">
        {description}
      </p>
    </div>
  </motion.div>
);

export default {
  Title,
  Description,
  StorySection,
  ImageSection,
  SectionTitle,
  Mission,
  Vision,
  ValueCard,
  Timeline
}; 