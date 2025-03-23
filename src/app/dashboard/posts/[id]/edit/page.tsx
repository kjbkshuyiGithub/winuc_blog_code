import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import PostEditor from '@/components/dashboard/posts/PostEditor';

export const metadata: Metadata = {
  title: '编辑文章 | 团队博客',
  description: '编辑您的博客文章',
};

export default async function EditPostPage({
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
      tags: true,
      category: true,
      author: true,
    },
  });

  // 如果文章不存在，重定向到文章列表
  if (!post) {
    redirect('/dashboard/posts');
  }

  // 检查权限 (只有作者和管理员可以编辑文章)
  const userEmail = session.user.email as string;
  const userRole = session.user.role;
  const isAuthor = post.author.email === userEmail;
  const isAdmin = userRole === 'ADMIN';

  if (!isAuthor && !isAdmin) {
    redirect('/dashboard/posts');
  }

  // 获取所有分类和标签
  const categories = await prisma.category.findMany({
    orderBy: { name: 'asc' },
  });

  const tags = await prisma.tag.findMany({
    orderBy: { name: 'asc' },
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">编辑文章</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          修改您的文章内容和设置
        </p>
      </div>

      <PostEditor
        categories={categories}
        tags={tags}
        userId={session.user.id as string}
        post={post}
      />
    </div>
  );
} 