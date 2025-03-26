'use client';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize from 'rehype-sanitize';

interface MarkdownContentProps {
  content: string;
}

export function MarkdownContent({ content }: MarkdownContentProps) {
  if (!content) {
    return <div className="italic text-gray-400">暂无内容</div>;
  }

  return (
    <div className="markdown-body">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw, rehypeSanitize]}
        components={{
          img: ({ node, ...props }) => (
            <img 
              {...props}
              className="rounded-md my-6 max-w-full h-auto"
              alt={props.alt || '文章图片'}
            />
          ),
          a: ({ node, ...props }) => (
            <a 
              {...props}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary-600 dark:text-primary-400 hover:underline"
            >
              {props.children}
            </a>
          ),
          pre: ({ node, ...props }) => (
            <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-md overflow-auto" {...props} />
          ),
          code: ({ node, ...props }) => (
            <code className="bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded text-sm font-mono" {...props} />
          )
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
} 