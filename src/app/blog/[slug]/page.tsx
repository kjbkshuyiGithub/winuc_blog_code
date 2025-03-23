import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { FiCalendar, FiUser, FiTag, FiClock } from 'react-icons/fi';

import BlogComments from '../../../components/blog/BlogComments';
import BlogRelatedPosts from '../../../components/blog/BlogRelatedPosts';
import BlogShareButtons from '../../../components/blog/BlogShareButtons';

// 模拟获取博客文章数据
function getBlogPost(slug: string) {
  // 在实际应用中，这里会从数据库或API获取数据
  const posts = [
    {
      slug: 'how-to-build-high-performance-react-apps',
      title: '如何构建高性能的React应用',
      description: '探索React性能优化的最佳实践，包括代码分割、懒加载、缓存策略等技术。',
      content: `
        <p>在当今的Web开发中，用户体验至关重要，而性能是用户体验的核心组成部分。React作为一个流行的前端库，提供了许多优化性能的方法。本文将探讨如何构建高性能的React应用。</p>
        
        <h2>代码分割</h2>
        <p>代码分割是一种将代码分成小块的技术，这样用户只需下载他们当前页面所需的代码。React提供了<code>React.lazy</code>和<code>Suspense</code>来实现组件级别的代码分割：</p>
        
        <pre><code>
const LazyComponent = React.lazy(() => import('./LazyComponent'));

function MyComponent() {
  return (
    <React.Suspense fallback={<div>Loading...</div>}>
      <LazyComponent />
    </React.Suspense>
  );
}
        </code></pre>
        
        <h2>使用React.memo避免不必要的重新渲染</h2>
        <p>React.memo是一个高阶组件，它可以帮助你的组件避免不必要的重新渲染：</p>
        
        <pre><code>
const MyComponent = React.memo(function MyComponent(props) {
  // 只有当props改变时才会重新渲染
  return <div>{props.name}</div>;
});
        </code></pre>
        
        <h2>使用useMemo和useCallback</h2>
        <p>useMemo和useCallback钩子可以帮助你缓存计算结果和函数引用，避免在每次渲染时重新创建：</p>
        
        <pre><code>
// 缓存计算结果
const memoizedValue = useMemo(() => computeExpensiveValue(a, b), [a, b]);

// 缓存函数引用
const memoizedCallback = useCallback(() => {
  doSomething(a, b);
}, [a, b]);
        </code></pre>
        
        <h2>虚拟化长列表</h2>
        <p>当渲染大量数据时，可以使用"窗口化"技术，只渲染用户当前可见的部分。React Virtualized和React Window是两个流行的库：</p>
        
        <pre><code>
import { FixedSizeList } from 'react-window';

const Row = ({ index, style }) => (
  <div style={style}>Row {index}</div>
);

const Example = () => (
  <FixedSizeList
    height={500}
    width={500}
    itemSize={35}
    itemCount={1000}
  >
    {Row}
  </FixedSizeList>
);
        </code></pre>
        
        <h2>优化Context</h2>
        <p>Context是一个强大的工具，但如果使用不当，可能会导致性能问题。将状态分割成多个上下文，并确保只有需要特定状态的组件才订阅该上下文：</p>
        
        <pre><code>
// 分割上下文
const ThemeContext = React.createContext();
const UserContext = React.createContext();

// 在不同的提供者中提供状态
function App() {
  return (
    <ThemeContext.Provider value={theme}>
      <UserContext.Provider value={user}>
        <Main />
      </UserContext.Provider>
    </ThemeContext.Provider>
  );
}
        </code></pre>
        
        <h2>使用生产构建</h2>
        <p>确保在部署应用时使用生产构建。生产构建会移除开发警告，并进行各种优化，如代码压缩和树摇动。</p>
        
        <h2>结论</h2>
        <p>构建高性能的React应用需要综合考虑多种因素。通过代码分割、避免不必要的渲染、缓存计算结果和函数引用、虚拟化长列表以及优化Context使用，你可以显著提升应用的性能。记住，性能优化是一个持续的过程，应该根据实际需求和用户反馈不断调整。</p>
      `,
      date: '2023-12-15',
      readingTime: '8 min',
      author: {
        name: '张三',
        avatar: '/images/avatars/author-1.jpg',
        bio: '资深前端开发工程师，React专家'
      },
      category: '前端开发',
      tags: ['React', '性能优化', 'Web开发'],
      coverImage: '/images/blog/react-performance.jpg'
    },
    {
      slug: 'future-trends-in-cloud-native-architecture',
      title: '云原生架构的未来趋势',
      description: '深入分析云原生技术的发展方向，包括服务网格、无服务器架构、GitOps等新兴技术。',
      content: `<p>云原生技术正在快速发展...</p>`,
      date: '2023-12-10',
      readingTime: '10 min',
      author: {
        name: '李四',
        avatar: '/images/avatars/author-2.jpg',
        bio: '云计算架构师，Kubernetes专家'
      },
      category: '云计算',
      tags: ['云原生', 'Kubernetes', '微服务'],
      coverImage: '/images/blog/cloud-native.jpg'
    }
  ];
  
  const post = posts.find(post => post.slug === slug);
  
  if (!post) {
    return null;
  }
  
  return post;
}

// 生成元数据
export async function generateMetadata({ 
  params 
}: { 
  params: { slug: string } 
}): Promise<Metadata> {
  const post = getBlogPost(params.slug);
  
  if (!post) {
    return {
      title: '文章未找到',
      description: '请查看其他文章'
    };
  }
  
  return {
    title: post.title,
    description: post.description,
    openGraph: {
      title: post.title,
      description: post.description,
      type: 'article',
      publishedTime: post.date,
      authors: [post.author.name],
      images: [
        {
          url: post.coverImage,
          width: 1200,
          height: 630,
          alt: post.title
        }
      ]
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.description,
      images: [post.coverImage]
    }
  };
}

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = getBlogPost(params.slug);
  
  if (!post) {
    notFound();
  }
  
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
            {post.date}
          </span>
          <span className="flex items-center">
            <FiUser className="mr-1 h-4 w-4" />
            {post.author.name}
          </span>
          <span className="flex items-center">
            <FiTag className="mr-1 h-4 w-4" />
            {post.category}
          </span>
          <span className="flex items-center">
            <FiClock className="mr-1 h-4 w-4" />
            {post.readingTime}
          </span>
        </div>
        
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6">
          {post.title}
        </h1>
        
        <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
          {post.description}
        </p>
      </div>
      
      {/* 封面图 */}
      {post.coverImage && (
        <div className="relative w-full h-96 mb-10 rounded-xl overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary-400 to-secondary-400 opacity-70"></div>
        </div>
      )}
      
      {/* 文章内容 */}
      <div className="prose prose-lg dark:prose-invert max-w-none mb-12">
        <div dangerouslySetInnerHTML={{ __html: post.content || '' }} />
      </div>
      
      {/* 标签 */}
      <div className="mb-8">
        <div className="flex flex-wrap gap-2">
          {post.tags.map(tag => (
            <Link 
              key={tag} 
              href={`/blog/tag/${tag.toLowerCase()}`}
              className="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full text-sm hover:bg-primary-100 dark:hover:bg-primary-900 transition-colors"
            >
              #{tag}
            </Link>
          ))}
        </div>
      </div>
      
      {/* 作者信息 */}
      <div className="flex items-center p-6 bg-gray-50 dark:bg-gray-800 rounded-xl mb-12">
        <div className="flex-shrink-0 mr-4">
          <div className="w-16 h-16 rounded-full bg-gray-300 dark:bg-gray-700"></div>
        </div>
        <div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            {post.author.name}
          </h3>
          <p className="text-gray-600 dark:text-gray-300">
            {post.author.bio}
          </p>
        </div>
      </div>
      
      {/* 分享按钮 */}
      <BlogShareButtons 
        title={post.title} 
        url={fullUrl} 
        description={post.description} 
      />
      
      {/* 相关文章 */}
      <BlogRelatedPosts 
        currentPostSlug={post.slug} 
        category={post.category} 
      />
      
      {/* 评论区 */}
      <BlogComments />
    </div>
  );
} 