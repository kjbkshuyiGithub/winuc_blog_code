import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { FiCalendar, FiUser, FiTag, FiClock } from 'react-icons/fi';
import { prisma } from '@/lib/prisma';
import { format } from 'date-fns';

import BlogComments from '../../../components/blog/BlogComments';
import BlogRelatedPosts from '../../../components/blog/BlogRelatedPosts';
import BlogShareButtons from '../../../components/blog/BlogShareButtons';

// 从数据库获取博客文章
async function getBlogPost(slug: string) {
  try {
    const post = await prisma.post.findUnique({
      where: {
        slug: slug,
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            image: true,
            bio: true
          }
        },
        category: true,
        tags: true
      }
    });
    
    console.log(`查询文章: ${slug}, 结果:`, post ? '找到文章' : '未找到文章');
    
    return post;
  } catch (error) {
    console.error("获取文章详情失败:", error);
    return null;
  }
}

// 生成元数据
export async function generateMetadata({ 
  params 
}: { 
  params: { slug: string } 
}): Promise<Metadata> {
  const post = await getBlogPost(params.slug);
  
  if (!post) {
    return {
      title: '文章未找到',
      description: '请查看其他文章'
    };
  }
  
  return {
    title: `${post.title} | 团队博客`,
    description: post.description || '阅读我们团队的技术分享',
    openGraph: {
      title: post.title,
      description: post.description || '',
      type: 'article',
      publishedTime: post.createdAt.toString(),
      authors: [post.author?.name || '团队成员'],
      images: post.coverImage ? [
        {
          url: post.coverImage,
          width: 1200,
          height: 630,
          alt: post.title
        }
      ] : []
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.description || '',
      images: post.coverImage ? [post.coverImage] : []
    }
  };
}

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = await getBlogPost(params.slug);
  
  if (!post) {
    notFound();
  }
  
  // 计算阅读时间（假设每分钟阅读200个字）
  const wordCount = post.content.split(/\s+/).length;
  const readingTime = Math.max(1, Math.ceil(wordCount / 200));
  
  // 构建完整URL用于分享
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://yourblog.com';
  const fullUrl = `${baseUrl}/blog/${post.slug}`;
  
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      {/* 文章头部 */}
      <div className="mb-8">
        <div className="flex flex-wrap items-center text-sm text-gray-500 dark:text-gray-400 mb-4 space-x-4">
          <span className="flex items-center">
            <FiCalendar className="mr-1 h-4 w-4" />
            {format(new Date(post.createdAt), 'yyyy-MM-dd')}
          </span>
          <span className="flex items-center">
            <FiUser className="mr-1 h-4 w-4" />
            {post.author?.name || '匿名作者'}
          </span>
          {post.category && (
            <span className="flex items-center">
              <FiTag className="mr-1 h-4 w-4" />
              {post.category.name}
            </span>
          )}
          <span className="flex items-center">
            <FiClock className="mr-1 h-4 w-4" />
            {readingTime} 分钟阅读
          </span>
        </div>
        
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6">
          {post.title}
        </h1>
        
        {post.description && (
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
            {post.description}
          </p>
        )}
      </div>
      
      {/* 封面图 */}
      {post.coverImage && (
        <div className="relative w-full h-96 mb-10 rounded-xl overflow-hidden">
          <img 
            src={post.coverImage}
            alt={post.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}
      
      {/* 文章内容 */}
      <div className="prose prose-lg dark:prose-invert max-w-none mb-12">
        <div dangerouslySetInnerHTML={{ __html: post.content || '' }} />
      </div>
      
      {/* 标签 */}
      {post.tags.length > 0 && (
        <div className="mb-8">
          <div className="flex flex-wrap gap-2">
            {post.tags.map(tag => (
              <Link 
                key={tag.id} 
                href={`/blog/tag/${tag.slug}`}
                className="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full text-sm hover:bg-primary-100 dark:hover:bg-primary-900 transition-colors"
              >
                {tag.name}
              </Link>
            ))}
          </div>
        </div>
      )}
      
      {/* 作者信息 */}
      {post.author && (
        <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-6 mb-8">
          <div className="flex items-center">
            {post.author.image && (
              <div className="flex-shrink-0 mr-4">
                <img
                  src={post.author.image}
                  alt={post.author.name || '作者头像'}
                  className="h-12 w-12 rounded-full object-cover"
                />
              </div>
            )}
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                {post.author.name || '匿名作者'}
              </h3>
              {post.author.bio && (
                <p className="text-gray-600 dark:text-gray-400">
                  {post.author.bio}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
      
      {/* 分享按钮 */}
      <BlogShareButtons url={fullUrl} title={post.title} description={post.description || ''} />
      
      {/* 相关文章 */}
      <BlogRelatedPosts currentPostId={post.id} categoryId={post.categoryId || undefined} tags={post.tags} />
      
      {/* 评论区 */}
      <BlogComments postId={post.id} />
    </div>
  );
} 