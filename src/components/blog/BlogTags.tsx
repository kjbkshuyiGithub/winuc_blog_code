'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { FiTag } from 'react-icons/fi';

// 模拟标签数据
const tags = [
  { name: 'React', count: 15, slug: 'react' },
  { name: 'Next.js', count: 12, slug: 'nextjs' },
  { name: 'TypeScript', count: 10, slug: 'typescript' },
  { name: '性能优化', count: 8, slug: 'performance' },
  { name: '微服务', count: 7, slug: 'microservices' },
  { name: 'Docker', count: 6, slug: 'docker' },
  { name: 'Kubernetes', count: 5, slug: 'kubernetes' },
  { name: '数据库', count: 9, slug: 'database' },
  { name: 'JavaScript', count: 14, slug: 'javascript' },
  { name: 'CSS', count: 11, slug: 'css' },
  { name: 'Node.js', count: 8, slug: 'nodejs' },
  { name: 'GraphQL', count: 4, slug: 'graphql' },
];

interface BlogTagsProps {
  activeTag?: string;
}

export default function BlogTags({ activeTag }: BlogTagsProps) {
  // 根据文章数量计算标签大小
  const getTagSize = (count: number) => {
    if (count >= 12) return 'text-lg font-medium';
    if (count >= 8) return 'text-base font-medium';
    if (count >= 5) return 'text-sm';
    return 'text-xs';
  };
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
        <FiTag className="mr-2" />
        热门标签
      </h3>
      
      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => (
          <motion.div
            key={tag.slug}
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
          >
            <Link
              href={`/blog/tag/${tag.slug}`}
              className={`inline-block px-3 py-1 rounded-full ${
                activeTag === tag.name
                  ? 'bg-primary-100 dark:bg-primary-900 text-primary-600 dark:text-primary-400'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              } ${getTagSize(tag.count)} transition-colors`}
            >
              {tag.name}
              <span className="ml-1 text-xs text-gray-500 dark:text-gray-400">
                ({tag.count})
              </span>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
} 