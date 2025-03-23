import { Metadata } from 'next';
import Link from 'next/link';
import { FiArrowLeft, FiTag } from 'react-icons/fi';
import BlogList from '@/components/blog/BlogList';
import BlogPagination from '@/components/blog/BlogPagination';
import BlogSearch from '@/components/blog/BlogSearch';
import BlogCategories from '@/components/blog/BlogCategories';

interface TagPageProps {
  params: {
    slug: string;
  };
  searchParams: {
    page?: string;
  };
}

// 模拟获取标签信息
const getTagInfo = (slug: string) => {
  const tags = {
    'react': { name: 'React', description: 'React相关的文章，包括React基础、React Hooks、React性能优化等' },
    'nextjs': { name: 'Next.js', description: 'Next.js相关的文章，包括Next.js基础、App Router、SSR等' },
    'typescript': { name: 'TypeScript', description: 'TypeScript相关的文章，包括TypeScript基础、高级类型、类型推断等' },
    'performance': { name: '性能优化', description: '性能优化相关的文章，包括前端性能优化、后端性能优化、数据库性能优化等' },
    'microservices': { name: '微服务', description: '微服务相关的文章，包括微服务架构、服务通信、服务治理等' },
    'docker': { name: 'Docker', description: 'Docker相关的文章，包括Docker基础、Docker Compose、Docker部署等' },
    'kubernetes': { name: 'Kubernetes', description: 'Kubernetes相关的文章，包括K8s基础、Pod、Service、Deployment等' },
    'database': { name: '数据库', description: '数据库相关的文章，包括SQL、NoSQL、数据库设计、数据库优化等' },
  };
  
  return tags[slug as keyof typeof tags] || { name: slug, description: `与"${slug}"相关的文章` };
};

export async function generateMetadata({ params }: TagPageProps): Promise<Metadata> {
  const tag = getTagInfo(params.slug);
  
  return {
    title: `${tag.name} - 博客标签`,
    description: tag.description,
  };
}

export default function TagPage({ params, searchParams }: TagPageProps) {
  const currentPage = Number(searchParams.page) || 1;
  const tag = getTagInfo(params.slug);
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center mb-6">
        <Link href="/blog" className="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 mr-2">
          <FiArrowLeft className="inline mr-1" />
          返回博客
        </Link>
      </div>
      
      <div className="flex flex-col md:flex-row gap-8">
        {/* 主内容区 */}
        <div className="w-full md:w-2/3">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 mb-8">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 flex items-center">
              <FiTag className="mr-2" />
              标签: {tag.name}
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              {tag.description}
            </p>
          </div>
          
          <BlogList tag={tag.name} />
          
          <BlogPagination 
            currentPage={currentPage} 
            totalPages={5} 
            baseUrl={`/blog/tag/${params.slug}`} 
          />
        </div>
        
        {/* 侧边栏 */}
        <div className="w-full md:w-1/3 space-y-6">
          <BlogSearch />
          <BlogCategories />
        </div>
      </div>
    </div>
  );
} 