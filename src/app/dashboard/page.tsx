import { Metadata } from 'next';
import { getServerSession } from 'next-auth';
import Link from 'next/link';
import { FiUser, FiSettings, FiFileText, FiEdit } from 'react-icons/fi';

export const metadata: Metadata = {
  title: '用户仪表盘 - 团队博客',
  description: '管理您的账户、文章和设置',
};

export default async function DashboardPage() {
  const session = await getServerSession();
  
  const quickLinks = [
    {
      title: '账户资料',
      description: '查看和编辑您的个人资料信息',
      href: '/dashboard/profile',
      icon: FiUser,
      color: 'bg-blue-500',
    },
    {
      title: '账号设置',
      description: '管理您的账号设置和偏好',
      href: '/dashboard/settings',
      icon: FiSettings,
      color: 'bg-purple-500',
    },
    {
      title: '我的文章',
      description: '管理您发布的文章和草稿',
      href: '/dashboard/posts',
      icon: FiFileText,
      color: 'bg-green-500',
    },
    {
      title: '写新文章',
      description: '创建和发布新的博客文章',
      href: '/dashboard/posts/new',
      icon: FiEdit,
      color: 'bg-orange-500',
    },
  ];
  
  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <header>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">仪表盘</h1>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            欢迎回来，{session?.user?.name || '用户'}。在这里管理您的账户和内容。
          </p>
        </header>
        
        {/* 快速统计信息 */}
        <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                已发布文章
              </dt>
              <dd className="mt-1 text-3xl font-semibold text-gray-900 dark:text-white">
                0
              </dd>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                收到评论
              </dt>
              <dd className="mt-1 text-3xl font-semibold text-gray-900 dark:text-white">
                0
              </dd>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                文章阅读量
              </dt>
              <dd className="mt-1 text-3xl font-semibold text-gray-900 dark:text-white">
                0
              </dd>
            </div>
          </div>
        </div>
        
        {/* 快速链接 */}
        <h2 className="mt-10 text-lg font-medium text-gray-900 dark:text-white">快速访问</h2>
        <div className="mt-4 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {quickLinks.map((link) => (
            <Link
              key={link.title}
              href={link.href}
              className="relative group bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden"
            >
              <div className={`absolute top-0 left-0 w-1.5 h-full ${link.color}`}></div>
              <div>
                <span className="inline-flex items-center justify-center p-3 rounded-md text-white" style={{ backgroundColor: link.color.replace('bg-', '#').replace('-500', '') }}>
                  <link.icon className="h-6 w-6" aria-hidden="true" />
                </span>
              </div>
              <div className="mt-4">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">{link.title}</h3>
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">{link.description}</p>
              </div>
              <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gray-200 dark:bg-gray-700 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></div>
            </Link>
          ))}
        </div>
        
        {/* 最近活动 */}
        <h2 className="mt-10 text-lg font-medium text-gray-900 dark:text-white">最近活动</h2>
        <div className="mt-4 bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-md">
          <div className="p-8 text-center text-gray-500 dark:text-gray-400">
            暂无活动记录
          </div>
        </div>
      </div>
    </div>
  );
} 