import { Metadata } from 'next';
import Link from 'next/link';
import { FiArrowLeft, FiFolder } from 'react-icons/fi';
import BlogList from '@/components/blog/BlogList';
import BlogPagination from '@/components/blog/BlogPagination';
import BlogSearch from '@/components/blog/BlogSearch';
import BlogCategories from '@/components/blog/BlogCategories';

interface CategoryPageProps {
  params: {
    slug: string;
  };
  searchParams: {
    page?: string;
  };
}

// 模拟获取分类信息
const getCategoryInfo = (slug: string) => {
  const categories = {
    'frontend': { name: '前端开发', description: '前端开发相关的文章，包括HTML、CSS、JavaScript、React、Vue等技术' },
    'backend': { name: '后端开发', description: '后端开发相关的文章，包括Node.js、Java、Python、Go等技术' },
    'cloud-computing': { name: '云计算', description: '云计算相关的文章，包括AWS、Azure、Google Cloud等云服务' },
    'devops': { name: 'DevOps', description: 'DevOps相关的文章，包括CI/CD、Docker、Kubernetes等技术' },
    'ai': { name: '人工智能', description: '人工智能相关的文章，包括机器学习、深度学习、自然语言处理等技术' },
    'mobile': { name: '移动开发', description: '移动开发相关的文章，包括iOS、Android、React Native等技术' },
    'database': { name: '数据库', description: '数据库相关的文章，包括MySQL、PostgreSQL、MongoDB等技术' },
    'security': { name: '安全', description: '安全相关的文章，包括Web安全、网络安全、加密等技术' },
  };
  
  return categories[slug as keyof typeof categories] || { name: '未知分类', description: '该分类不存在' };
};

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const category = getCategoryInfo(params.slug);
  
  return {
    title: `${category.name} - 博客分类`,
    description: category.description,
  };
}

export default function CategoryPage({ params, searchParams }: CategoryPageProps) {
  const currentPage = Number(searchParams.page) || 1;
  const category = getCategoryInfo(params.slug);
  
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
              <FiFolder className="mr-2" />
              {category.name}
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              {category.description}
            </p>
          </div>
          
          <BlogList category={params.slug} />
          
          <BlogPagination 
            currentPage={currentPage} 
            totalPages={5} 
            baseUrl={`/blog/category/${params.slug}`} 
          />
        </div>
        
        {/* 侧边栏 */}
        <div className="w-full md:w-1/3 space-y-6">
          <BlogSearch />
          <BlogCategories activeCategory={params.slug} />
        </div>
      </div>
    </div>
  );
} 