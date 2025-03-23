import { Metadata } from 'next';
import Link from 'next/link';
import { FiArrowLeft, FiSearch } from 'react-icons/fi';
import BlogList from '@/components/blog/BlogList';
import BlogPagination from '@/components/blog/BlogPagination';
import BlogSearch from '@/components/blog/BlogSearch';
import BlogCategories from '@/components/blog/BlogCategories';

interface SearchPageProps {
  searchParams: {
    q?: string;
    page?: string;
  };
}

export async function generateMetadata({ searchParams }: SearchPageProps): Promise<Metadata> {
  const searchTerm = searchParams.q || '';
  
  return {
    title: `搜索: ${searchTerm} - 博客`,
    description: `搜索"${searchTerm}"的结果`,
  };
}

export default function SearchPage({ searchParams }: SearchPageProps) {
  const searchTerm = searchParams.q || '';
  const currentPage = Number(searchParams.page) || 1;
  
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
              <FiSearch className="mr-2" />
              搜索结果: {searchTerm}
            </h1>
            {searchTerm ? (
              <p className="text-gray-600 dark:text-gray-400">
                以下是与"{searchTerm}"相关的文章
              </p>
            ) : (
              <p className="text-gray-600 dark:text-gray-400">
                请输入搜索词以查找相关文章
              </p>
            )}
          </div>
          
          {searchTerm ? (
            <>
              <BlogList searchTerm={searchTerm} />
              
              <BlogPagination 
                currentPage={currentPage} 
                totalPages={5} 
                baseUrl={`/blog/search?q=${encodeURIComponent(searchTerm)}`} 
              />
            </>
          ) : (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-8 text-center">
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                请使用右侧搜索框输入关键词进行搜索
              </p>
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                你可以搜索文章标题、内容或标签
              </p>
            </div>
          )}
        </div>
        
        {/* 侧边栏 */}
        <div className="w-full md:w-1/3 space-y-6">
          <BlogSearch initialSearchTerm={searchTerm} />
          <BlogCategories />
        </div>
      </div>
    </div>
  );
} 