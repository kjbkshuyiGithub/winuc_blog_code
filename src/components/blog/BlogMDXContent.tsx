'use client';

import { MDXRemote, MDXRemoteSerializeResult } from 'next-mdx-remote';
import Image from 'next/image';
import Link from 'next/link';
import BlogCodeBlock from './BlogCodeBlock';

interface BlogMDXContentProps {
  source: MDXRemoteSerializeResult;
}

// 自定义组件
const components = {
  // 增强图片组件
  img: ({ src, alt, width, height, ...props }: any) => (
    <div className="my-6 relative">
      <Image
        src={src || ''}
        alt={alt || '博客图片'}
        width={width ? parseInt(width) : 1200}
        height={height ? parseInt(height) : 630}
        className="rounded-lg mx-auto"
        {...props}
      />
      {alt && <p className="text-center text-sm text-gray-500 mt-2">{alt}</p>}
    </div>
  ),
  
  // 增强链接组件
  a: ({ href, children, ...props }: any) => (
    <Link 
      href={href || '#'} 
      className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 transition-colors"
      {...props}
    >
      {children}
    </Link>
  ),
  
  // 代码块组件
  pre: ({ children, className, ...props }: any) => {
    // 从className中提取语言信息 (如 language-javascript)
    const language = className ? className.replace('language-', '') : '';
    
    // 获取代码内容
    const code = children?.props?.children || '';
    
    return (
      <BlogCodeBlock code={code} language={language} {...props} />
    );
  },
  
  // 行内代码
  code: ({ children, className, ...props }: any) => {
    // 如果有className，说明是代码块的一部分，不处理
    if (className) {
      return <code className={className} {...props}>{children}</code>;
    }
    
    // 行内代码样式
    return (
      <code className="px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-800 font-mono text-sm" {...props}>
        {children}
      </code>
    );
  },
  
  // 标题组件
  h1: ({ children, ...props }: any) => (
    <h1 className="text-3xl font-bold mt-8 mb-4" {...props}>{children}</h1>
  ),
  h2: ({ children, ...props }: any) => (
    <h2 className="text-2xl font-bold mt-8 mb-4" {...props}>{children}</h2>
  ),
  h3: ({ children, ...props }: any) => (
    <h3 className="text-xl font-bold mt-6 mb-3" {...props}>{children}</h3>
  ),
  h4: ({ children, ...props }: any) => (
    <h4 className="text-lg font-bold mt-6 mb-3" {...props}>{children}</h4>
  ),
  
  // 段落
  p: ({ children, ...props }: any) => (
    <p className="my-4 leading-relaxed" {...props}>{children}</p>
  ),
  
  // 列表
  ul: ({ children, ...props }: any) => (
    <ul className="list-disc pl-6 my-4 space-y-2" {...props}>{children}</ul>
  ),
  ol: ({ children, ...props }: any) => (
    <ol className="list-decimal pl-6 my-4 space-y-2" {...props}>{children}</ol>
  ),
  
  // 引用
  blockquote: ({ children, ...props }: any) => (
    <blockquote className="border-l-4 border-primary-500 pl-4 py-1 my-4 bg-gray-50 dark:bg-gray-800 italic" {...props}>
      {children}
    </blockquote>
  ),
  
  // 表格
  table: ({ children, ...props }: any) => (
    <div className="overflow-x-auto my-6">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700" {...props}>
        {children}
      </table>
    </div>
  ),
  th: ({ children, ...props }: any) => (
    <th className="px-4 py-3 bg-gray-100 dark:bg-gray-800 text-left text-sm font-medium" {...props}>
      {children}
    </th>
  ),
  td: ({ children, ...props }: any) => (
    <td className="px-4 py-3 border-t border-gray-200 dark:border-gray-700 text-sm" {...props}>
      {children}
    </td>
  ),
};

export default function BlogMDXContent({ source }: BlogMDXContentProps) {
  return (
    <div className="prose prose-lg dark:prose-invert max-w-none">
      <MDXRemote {...source} components={components} />
    </div>
  );
} 