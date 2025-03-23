import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import PostEditor from '@/components/dashboard/posts/PostEditor';
import { authOptions } from '@/lib/auth';

export const metadata: Metadata = {
  title: '发布新文章 - 团队博客',
  description: '创建并发布一篇新的博客文章',
};

export default async function NewPostPage() {
  console.log('开始加载新建文章页面...');
  
  // 获取用户会话
  const session = await getServerSession(authOptions);
  
  console.log('新建文章页面 - 会话状态:', {
    hasSession: !!session,
    hasUser: !!session?.user,
    hasUserId: !!session?.user?.id,
    userData: session?.user ? {
      id: session.user.id,
      name: session.user.name,
      email: session.user.email,
      role: session.user.role
    } : null
  });
  
  // 如果用户未登录，重定向到登录页面
  if (!session?.user) {
    console.log('用户未登录，重定向到登录页面');
    redirect('/login?callbackUrl=/dashboard/posts/new');
  }
  
  // 确保用户ID存在
  if (!session.user.id) {
    console.error('用户会话中缺少ID', JSON.stringify(session));
    throw new Error('无法获取用户ID');
  }
  
  const userId = session.user.id;
  console.log('当前用户ID:', userId);
  
  // 获取所有分类
  const categories = await prisma.category.findMany({
    orderBy: {
      name: 'asc',
    },
  });
  
  // 获取所有标签
  const tags = await prisma.tag.findMany({
    orderBy: {
      name: 'asc',
    },
  });
  
  console.log('新建文章页面 - 已获取分类和标签数据');
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">发布新文章</h1>
        
        <PostEditor 
          categories={categories}
          tags={tags}
          userId={userId}
        />
      </div>
    </div>
  );
} 