import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import DeletePostForm from '@/components/dashboard/posts/DeletePostForm';

export const metadata: Metadata = {
  title: '删除文章 | 团队博客',
  description: '删除您的博客文章',
};

export default async function DeletePostPage({
  params,
}: {
  params: { id: string };
}) {
  // 获取当前用户会话
  const session = await getServerSession();
  if (!session?.user) {
    redirect('/login?callbackUrl=/dashboard/posts');
  }

  // 获取文章数据
  const post = await prisma.post.findUnique({
    where: { id: params.id },
    include: {
      author: true,
      category: true,
      tags: true,
    },
  });

  // 如果文章不存在，重定向到文章列表
  if (!post) {
    redirect('/dashboard/posts');
  }

  // 检查权限 (只有作者和管理员可以删除文章)
  const userEmail = session.user.email as string;
  const userRole = session.user.role;
  const isAuthor = post.author.email === userEmail;
  const isAdmin = userRole === 'ADMIN';

  if (!isAuthor && !isAdmin) {
    redirect('/dashboard/posts');
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">删除文章</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            您即将删除文章，此操作不可撤销
          </p>
        </div>

        <DeletePostForm post={post} />
      </div>
    </div>
  );
} 