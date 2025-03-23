import { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { format } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import { FiEdit, FiEye, FiPlus, FiTrash } from 'react-icons/fi';
import { authOptions } from '@/lib/auth';

export const metadata: Metadata = {
  title: '我的文章 | 团队博客',
  description: '管理您的博客文章',
};

export default async function PostsPage() {
  // 获取当前用户会话
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    redirect('/login?callbackUrl=/dashboard/posts');
  }

  // 确保用户ID存在
  if (!session.user.id) {
    console.error('用户会话中缺少ID', session);
    throw new Error('无法获取用户ID');
  }

  console.log('仪表盘 - 用户ID:', session.user.id);

  // 获取用户的文章
  const posts = await prisma.post.findMany({
    where: { 
      authorId: session.user.id 
    },
    include: {
      category: true,
      tags: true,
    },
    orderBy: { 
      createdAt: 'desc' 
    },
  });

  console.log(`找到 ${posts.length} 篇文章，用户ID: ${session.user.id}`);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">我的文章</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            管理您发布的所有博客文章
          </p>
        </div>
        <Link 
          href="/dashboard/posts/new" 
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
        >
          <FiPlus className="mr-2" />
          新建文章
        </Link>
      </div>

      {posts.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 text-center">
          <p className="text-gray-500 dark:text-gray-400 mb-4">您还没有发布任何文章</p>
          <Link 
            href="/dashboard/posts/new" 
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            <FiPlus className="mr-2" />
            开始写作
          </Link>
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    标题
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    分类
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    状态
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    日期
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    操作
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {posts.map((post) => (
                  <tr key={post.id} className="hover:bg-gray-50 dark:hover:bg-gray-750">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {post.coverImage && (
                          <div className="flex-shrink-0 h-10 w-10 mr-4">
                            <img 
                              className="h-10 w-10 rounded-md object-cover" 
                              src={post.coverImage} 
                              alt={post.title} 
                            />
                          </div>
                        )}
                        <div className="overflow-hidden text-ellipsis font-medium text-gray-900 dark:text-white">
                          {post.title}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {post.category ? (
                        <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                          {post.category.name}
                        </span>
                      ) : (
                        <span className="text-gray-500 dark:text-gray-400 text-sm">
                          未分类
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {post.published ? (
                        <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
                          已发布
                        </span>
                      ) : (
                        <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300">
                          草稿
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {format(new Date(post.createdAt), 'yyyy年MM月dd日', { locale: zhCN })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                      <div className="flex justify-end space-x-2">
                        {post.published && (
                          <Link 
                            href={`/blog/${post.slug}`} 
                            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300" 
                            title="查看"
                          >
                            <FiEye />
                          </Link>
                        )}
                        <Link 
                          href={`/dashboard/posts/${post.id}/edit`} 
                          className="text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300" 
                          title="编辑"
                        >
                          <FiEdit />
                        </Link>
                        <Link 
                          href={`/dashboard/posts/${post.id}/delete`} 
                          className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300" 
                          title="删除"
                        >
                          <FiTrash />
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
} 