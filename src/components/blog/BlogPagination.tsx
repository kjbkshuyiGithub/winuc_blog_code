'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

interface BlogPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange?: (page: number) => void;
  baseUrl?: string;
}

export default function BlogPagination({ 
  currentPage, 
  totalPages, 
  onPageChange,
  baseUrl = '/blog'
}: BlogPaginationProps) {
  const router = useRouter();
  
  // 生成页码数组
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxPagesToShow = 5;
    
    if (totalPages <= maxPagesToShow) {
      // 如果总页数小于等于最大显示页数，显示所有页码
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      // 否则，显示当前页附近的页码
      let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
      let endPage = startPage + maxPagesToShow - 1;
      
      if (endPage > totalPages) {
        endPage = totalPages;
        startPage = Math.max(1, endPage - maxPagesToShow + 1);
      }
      
      // 添加第一页
      if (startPage > 1) {
        pageNumbers.push(1);
        if (startPage > 2) {
          pageNumbers.push('...');
        }
      }
      
      // 添加中间页码
      for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
      }
      
      // 添加最后一页
      if (endPage < totalPages) {
        if (endPage < totalPages - 1) {
          pageNumbers.push('...');
        }
        pageNumbers.push(totalPages);
      }
    }
    
    return pageNumbers;
  };
  
  // 处理页面变化
  const handlePageClick = (page: number) => {
    if (onPageChange) {
      onPageChange(page);
    } else if (baseUrl) {
      // 如果没有提供onPageChange回调，使用路由导航
      router.push(`${baseUrl}?page=${page}`);
    }
  };
  
  // 如果只有一页，不显示分页
  if (totalPages <= 1) {
    return null;
  }
  
  return (
    <nav className="flex justify-center mt-8">
      <ul className="flex items-center space-x-1">
        {/* 上一页按钮 */}
        <li>
          <button
            onClick={() => currentPage > 1 && handlePageClick(currentPage - 1)}
            disabled={currentPage === 1}
            className={`flex items-center justify-center w-10 h-10 rounded-md ${
              currentPage === 1
                ? 'text-gray-400 cursor-not-allowed'
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
            aria-label="上一页"
          >
            <FiChevronLeft className="h-5 w-5" />
          </button>
        </li>
        
        {/* 页码按钮 */}
        {getPageNumbers().map((page, index) => (
          <li key={index}>
            {page === '...' ? (
              <span className="flex items-center justify-center w-10 h-10 text-gray-500 dark:text-gray-400">
                ...
              </span>
            ) : (
              <button
                onClick={() => typeof page === 'number' && handlePageClick(page)}
                className={`flex items-center justify-center w-10 h-10 rounded-md ${
                  currentPage === page
                    ? 'bg-primary-600 text-white'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
                aria-label={`第 ${page} 页`}
                aria-current={currentPage === page ? 'page' : undefined}
              >
                {page}
              </button>
            )}
          </li>
        ))}
        
        {/* 下一页按钮 */}
        <li>
          <button
            onClick={() => currentPage < totalPages && handlePageClick(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`flex items-center justify-center w-10 h-10 rounded-md ${
              currentPage === totalPages
                ? 'text-gray-400 cursor-not-allowed'
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
            aria-label="下一页"
          >
            <FiChevronRight className="h-5 w-5" />
          </button>
        </li>
      </ul>
    </nav>
  );
} 