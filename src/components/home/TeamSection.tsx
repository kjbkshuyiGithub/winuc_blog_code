'use client';

import { motion } from 'framer-motion';
import { FiGithub, FiTwitter, FiLinkedin } from 'react-icons/fi';

// 模拟数据，实际项目中应从API或数据库获取
const teamMembers = [
  {
    id: 1,
    name: '张三',
    role: '前端开发工程师',
    bio: '专注于React和TypeScript，热爱创造流畅的用户体验。',
    social: {
      github: 'https://github.com',
      twitter: 'https://twitter.com',
      linkedin: 'https://linkedin.com',
    },
  },
  {
    id: 2,
    name: '李四',
    role: '后端开发工程师',
    bio: 'Node.js和Go语言专家，微服务架构爱好者。',
    social: {
      github: 'https://github.com',
      twitter: 'https://twitter.com',
      linkedin: 'https://linkedin.com',
    },
  },
  {
    id: 3,
    name: '王五',
    role: 'DevOps工程师',
    bio: '专注于自动化部署和CI/CD流程优化，Kubernetes专家。',
    social: {
      github: 'https://github.com',
      twitter: 'https://twitter.com',
      linkedin: 'https://linkedin.com',
    },
  },
  {
    id: 4,
    name: '赵六',
    role: 'UI/UX设计师',
    bio: '热衷于创造美观且实用的用户界面，注重细节和用户体验。',
    social: {
      github: 'https://github.com',
      twitter: 'https://twitter.com',
      linkedin: 'https://linkedin.com',
    },
  },
];

export function TeamSection() {
  return (
    <section className="py-16 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100 sm:text-4xl">
            认识我们的团队
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500 dark:text-gray-400">
            一群充满激情的技术爱好者，致力于分享知识和创造价值
          </p>
        </motion.div>

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {teamMembers.map((member, index) => (
            <motion.div
              key={member.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-gray-50 dark:bg-gray-800 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300"
            >
              <div className="p-6 text-center">
                <div className="mx-auto h-24 w-24 rounded-full bg-gradient-to-br from-primary-400 to-secondary-400 flex items-center justify-center text-white text-2xl font-bold mb-4">
                  {member.name.charAt(0)}
                </div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  {member.name}
                </h3>
                <p className="text-sm text-primary-600 dark:text-primary-400 mb-2">
                  {member.role}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                  {member.bio}
                </p>
                <div className="flex justify-center space-x-4">
                  <a
                    href={member.social.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-500 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400 transition-colors"
                    aria-label="GitHub"
                  >
                    <FiGithub className="h-5 w-5" />
                  </a>
                  <a
                    href={member.social.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-500 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400 transition-colors"
                    aria-label="Twitter"
                  >
                    <FiTwitter className="h-5 w-5" />
                  </a>
                  <a
                    href={member.social.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-500 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400 transition-colors"
                    aria-label="LinkedIn"
                  >
                    <FiLinkedin className="h-5 w-5" />
                  </a>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
} 