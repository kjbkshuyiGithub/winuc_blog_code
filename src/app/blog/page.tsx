import { Metadata } from 'next';
import BlogList from '@/components/blog/BlogList';
import BlogPagination from '@/components/blog/BlogPagination';
import BlogSearch from '@/components/blog/BlogSearch';
import BlogCategories from '@/components/blog/BlogCategories';
import BlogTags from '@/components/blog/BlogTags';

export const metadata: Metadata = {
  title: '博客 - 团队技术分享',
  description: '我们团队的技术博客，分享前端、后端、DevOps、云计算等领域的技术文章和经验',
};

interface BlogPageProps {
  searchParams: {
    page?: string;
  };
}

export default function BlogPage({ searchParams }: BlogPageProps) {
  const currentPage = Number(searchParams.page) || 1;
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          团队技术博客
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          分享我们在前端、后端、DevOps、云计算等领域的技术文章和经验
        </p>
      </div>
      
      <div className="flex flex-col md:flex-row gap-8">
        {/* 主内容区 */}
        <div className="w-full md:w-2/3">
          <BlogList />
          
          <BlogPagination 
            currentPage={currentPage} 
            totalPages={5} 
            baseUrl="/blog" 
          />
        </div>
        
        {/* 侧边栏 */}
        <div className="w-full md:w-1/3 space-y-6">
          <BlogSearch />
          <BlogCategories />
          <BlogTags />
        </div>
      </div>
    </div>
  );
} 