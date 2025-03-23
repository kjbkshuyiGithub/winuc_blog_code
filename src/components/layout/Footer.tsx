'use client';

import Link from 'next/link';
import { FiGithub, FiTwitter, FiLinkedin, FiMail } from 'react-icons/fi';
import { motion } from 'framer-motion';

const footerLinks = [
  {
    title: '导航',
    links: [
      { label: '首页', href: '/' },
      { label: '博客', href: '/blog' },
      { label: '分类', href: '/categories' },
      { label: '团队', href: '/team' },
      { label: '关于我们', href: '/about' },
    ],
  },
  {
    title: '资源',
    links: [
      { label: '文档', href: '/docs' },
      { label: '教程', href: '/tutorials' },
      { label: '常见问题', href: '/faq' },
      { label: '隐私政策', href: '/privacy' },
      { label: '服务条款', href: '/terms' },
    ],
  },
  {
    title: '联系我们',
    links: [
      { label: '联系方式', href: '/contact' },
      { label: '加入我们', href: '/join' },
      { label: '反馈建议', href: '/feedback' },
      { label: '合作伙伴', href: '/partners' },
      { label: '支持我们', href: '/support' },
    ],
  },
];

const socialLinks = [
  { label: 'GitHub', icon: FiGithub, href: 'https://github.com' },
  { label: 'Twitter', icon: FiTwitter, href: 'https://twitter.com' },
  { label: 'LinkedIn', icon: FiLinkedin, href: 'https://linkedin.com' },
  { label: 'Email', icon: FiMail, href: 'mailto:contact@example.com' },
];

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* Logo和简介 */}
          <div className="space-y-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <Link href="/" className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                团队博客
              </Link>
              <p className="mt-4 text-sm text-gray-600 dark:text-gray-400 max-w-xs">
                我们团队的官方博客，分享最新的技术文章、团队动态和行业见解。
              </p>
            </motion.div>
            
            {/* 社交媒体链接 */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
              className="flex space-x-4"
            >
              {socialLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <a
                    key={link.label}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-500 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400 transition-colors"
                    aria-label={link.label}
                  >
                    <Icon className="h-5 w-5" />
                  </a>
                );
              })}
            </motion.div>
          </div>

          {/* 链接列表 */}
          {footerLinks.map((section, i) => (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 + i * 0.1 }}
              viewport={{ once: true }}
              className="space-y-4"
            >
              <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-900 dark:text-gray-100">
                {section.title}
              </h3>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-gray-600 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400 transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* 版权信息 */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          viewport={{ once: true }}
          className="mt-12 border-t border-gray-200 dark:border-gray-800 pt-8 text-center"
        >
          <p className="text-sm text-gray-500 dark:text-gray-400">
            &copy; {currentYear} 团队博客. 保留所有权利.
          </p>
        </motion.div>
      </div>
    </footer>
  );
} 