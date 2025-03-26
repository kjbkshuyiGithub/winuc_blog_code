import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import Link from 'next/link';
import { FiEdit2, FiUser, FiMail, FiInfo, FiCalendar, FiEye, FiMessageSquare, FiHeart } from 'react-icons/fi';
import { Avatar } from '@/components/Avatar';

export const metadata: Metadata = {
  title: '我的账户资料 - 团队博客',
  description: '查看和管理您的个人账户资料信息',
};

export default async function ProfilePage() {
  // 获取用户会话，检查用户是否已登录
  const session = await getServerSession();
  
  // 如果用户未登录，重定向到登录页面
  if (!session?.user) {
    redirect('/login?callbackUrl=/dashboard/profile');
  }
  
  // 这里可以添加获取更多用户资料信息的逻辑
  // 例如从API或数据库获取用户完整资料
  
  // 模拟用户统计数据
  const userStats = [
    { label: '发布文章', value: 5, icon: <FiUser className="h-4 w-4" /> },
    { label: '文章阅读量', value: 1205, icon: <FiEye className="h-4 w-4" /> },
    { label: '收到评论', value: 42, icon: <FiMessageSquare className="h-4 w-4" /> },
    { label: '获得点赞', value: 128, icon: <FiHeart className="h-4 w-4" /> }
  ];
  
  // 模拟最近活动
  const recentActivities = [
    { 
      type: '发布文章', 
      title: '如何提高团队协作效率', 
      date: '2023-12-15',
      url: '/blog/how-to-improve-team-collaboration'
    },
    { 
      type: '收到评论', 
      title: '关于"前端框架选择指南"的评论', 
      date: '2023-12-10',
      url: '/blog/frontend-framework-guide#comments'
    },
    { 
      type: '点赞文章', 
      title: '2024年技术趋势预测', 
      date: '2023-12-05',
      url: '/blog/tech-trends-2024'
    }
  ];
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">我的账户资料</h1>
        
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
          {/* 资料头部 - 带有背景和头像 */}
          <div className="relative h-40 bg-gradient-to-r from-primary-500 to-primary-700">
            <div className="absolute -bottom-12 left-6">
              <div className="w-24 h-24 rounded-full border-4 border-white dark:border-gray-800 overflow-hidden">
                <Avatar
                  src={session.user.image}
                  name={session.user.name}
                  alt={session.user.name || '用户头像'}
                  size="xl"
                />
              </div>
            </div>
            <div className="absolute top-4 right-4">
              <Link
                href="/dashboard/settings"
                className="flex items-center px-3 py-1.5 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white rounded-md transition-colors text-sm"
              >
                <FiEdit2 className="mr-1.5" />
                编辑资料
              </Link>
            </div>
          </div>
          
          {/* 资料内容 */}
          <div className="pt-16 px-6 pb-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              {session.user.name || '用户'}
            </h2>
            
            {/* 用户统计数据 */}
            <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
              {userStats.map((stat, index) => (
                <div key={index} className="bg-gray-50 dark:bg-gray-700/40 rounded-lg p-4 text-center">
                  <div className="flex items-center justify-center mb-2">
                    <div className="p-2 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400">
                      {stat.icon}
                    </div>
                  </div>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{stat.label}</p>
                </div>
              ))}
            </div>
            
            <div className="mt-8 grid md:grid-cols-2 gap-6">
              {/* 基本信息 */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2">
                  基本信息
                </h3>
                
                {/* 电子邮件 */}
                <div className="flex items-start">
                  <div className="flex-shrink-0 mt-0.5">
                    <FiMail className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                  </div>
                  <div className="ml-3">
                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      电子邮件
                    </h4>
                    <p className="text-sm text-gray-900 dark:text-white mt-1">
                      {session.user.email}
                    </p>
                  </div>
                </div>
                
                {/* 用户角色 */}
                <div className="flex items-start">
                  <div className="flex-shrink-0 mt-0.5">
                    <FiUser className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                  </div>
                  <div className="ml-3">
                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      用户角色
                    </h4>
                    <p className="text-sm text-gray-900 dark:text-white mt-1">
                      {session.user.role === 'ADMIN' ? '管理员' : 
                       session.user.role === 'AUTHOR' ? '作者' : '普通用户'}
                    </p>
                  </div>
                </div>
                
                {/* 注册时间 - 这里使用的是假设的数据，实际应从用户资料中获取 */}
                <div className="flex items-start">
                  <div className="flex-shrink-0 mt-0.5">
                    <FiCalendar className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                  </div>
                  <div className="ml-3">
                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      注册时间
                    </h4>
                    <p className="text-sm text-gray-900 dark:text-white mt-1">
                      {/* 这里应该显示实际的注册时间 */}
                      2023年1月1日
                    </p>
                  </div>
                </div>
                
                {/* 个人简介 - 如果有的话 */}
                <div className="flex items-start">
                  <div className="flex-shrink-0 mt-0.5">
                    <FiInfo className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                  </div>
                  <div className="ml-3">
                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      个人简介
                    </h4>
                    <p className="text-sm text-gray-900 dark:text-white mt-1">
                      {/* 这里应该显示用户的个人简介，如果有的话 */}
                      这里是用户的个人简介内容。如果用户尚未设置个人简介，可以显示一条提示信息，鼓励用户完善自己的资料。
                    </p>
                  </div>
                </div>
              </div>
              
              {/* 最近活动 */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2">
                  最近活动
                </h3>
                
                <div className="mt-4 space-y-4">
                  {recentActivities.length > 0 ? (
                    recentActivities.map((activity, index) => (
                      <div key={index} className="bg-gray-50 dark:bg-gray-700/40 rounded-lg p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800 dark:bg-primary-900/30 dark:text-primary-300">
                              {activity.type}
                            </span>
                            <h4 className="mt-1 text-sm font-medium text-gray-900 dark:text-white">
                              <Link href={activity.url} className="hover:underline">
                                {activity.title}
                              </Link>
                            </h4>
                          </div>
                          <time className="text-xs text-gray-500 dark:text-gray-400">
                            {activity.date}
                          </time>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-4 text-gray-500 dark:text-gray-400">
                      暂无活动记录
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* 操作按钮区 */}
        <div className="mt-6 flex justify-end">
          <Link
            href="/dashboard/settings"
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            <FiEdit2 className="mr-2" />
            编辑个人资料
          </Link>
        </div>
      </div>
    </div>
  );
} 