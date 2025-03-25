'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { FiFileText, FiTag, FiList, FiImage, FiInfo, FiSave, FiEye, FiX } from 'react-icons/fi';

// 文章表单验证架构
const postSchema = z.object({
  title: z.string().min(2, '标题至少需要2个字符').max(100, '标题不能超过100个字符'),
  content: z.string().min(10, '内容至少需要10个字符'),
  description: z.string().max(200, '摘要不能超过200个字符').optional(),
  categoryId: z.string().optional(),
  published: z.boolean().default(false),
});

type PostFormData = z.infer<typeof postSchema>;

// 分类类型
type Category = {
  id: string;
  name: string;
  slug: string;
};

// 标签类型
type Tag = {
  id: string;
  name: string;
  slug: string;
};

type PostEditorProps = {
  categories: Category[];
  tags: Tag[];
  userId: string;
  post?: {
    id: string;
    title: string;
    content: string;
    description?: string | null;
    published: boolean;
    categoryId?: string | null;
    tags: Tag[];
    slug: string;
    coverImage?: string | null;
  };
};

export default function PostEditor({ categories, tags, userId, post }: PostEditorProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedTags, setSelectedTags] = useState<string[]>(
    post?.tags.map(tag => tag.id) || []
  );
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [coverImagePreview, setCoverImagePreview] = useState<string | null>(
    post?.coverImage || null
  );
  const [statusMessage, setStatusMessage] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);
  
  // 仅记录用户ID，不阻止操作
  useEffect(() => {
    console.log('当前用户ID:', userId);
  }, [userId]);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<PostFormData>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      title: post?.title || '',
      content: post?.content || '',
      description: post?.description || '',
      categoryId: post?.categoryId || undefined,
      published: post?.published || false,
    },
  });
  
  // 监听发布状态变化
  const published = watch('published');
  
  // 处理封面图片变更
  const handleCoverImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCoverImage(file);
      
      // 创建预览URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setCoverImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  
  // 移除封面图片
  const handleRemoveCoverImage = () => {
    setCoverImage(null);
    setCoverImagePreview(null);
  };
  
  // 处理标签选择
  const handleTagSelection = (tagId: string) => {
    setSelectedTags(prev => {
      if (prev.includes(tagId)) {
        return prev.filter(id => id !== tagId);
      } else {
        return [...prev, tagId];
      }
    });
  };
  
  // 生成 slug
  const generateSlug = (title: string): string => {
    return title
      .toLowerCase()
      .replace(/[^\w\u4e00-\u9fa5]+/g, '-') // 将非字母数字汉字替换为短横线
      .replace(/^-|-$/g, '') // 移除开头和结尾的短横线
      + '-' + Date.now().toString().slice(-6); // 添加时间戳后6位，确保唯一性
  };
  
  // 处理表单提交
  const onSubmit = async (formData: PostFormData) => {
    try {
      setIsSubmitting(true);
      setStatusMessage(null);

      // 创建FormData对象
      const formPayload = new FormData();
      formPayload.append("title", formData.title);
      formPayload.append("content", formData.content);
      formPayload.append("description", formData.description || "");
      formPayload.append("slug", post?.id ? post.slug : generateSlug(formData.title));
      formPayload.append("published", formData.published.toString());
      
      if (formData.categoryId) {
        formPayload.append("categoryId", formData.categoryId);
      }
      
      // 附加标签
      selectedTags.forEach(tagId => {
        formPayload.append("tags[]", tagId);
      });
      
      // 处理封面图片
      if (coverImage) {
        formPayload.append("coverImage", coverImage);
      } else if (coverImagePreview === null && post?.coverImage) {
        // 如果清除了封面图片
        formPayload.append('removeCoverImage', 'true');
      }
      
      // 定义请求URL和方法 - 注意：ID在URL中，不需要在formData中传递
      const url = post?.id ? `/api/posts/${post.id}` : "/api/posts";
      const method = post?.id ? "PUT" : "POST";
      
      console.log(`发送${method}请求到: ${url}`);
      
      // 发送请求
      const response = await fetch(url, {
        method: method,
        body: formPayload,
      });

      // 处理响应
      const responseData = await response.json();
      
      if (!response.ok) {
        throw new Error(responseData.message || "保存文章时出现错误");
      }
      
      // 成功后设置状态
      setStatusMessage({
        type: 'success',
        text: post?.id ? '文章已成功更新' : '文章已成功创建'
      });
      
      // 如果是新文章，重定向到编辑页面
      if (!post?.id && responseData.post) {
        router.push(`/dashboard/posts/${responseData.post.id}/edit`);
      } else {
        // 刷新页面以显示最新内容
        router.refresh();
      }
      
    } catch (error) {
      console.error("提交文章时出错:", error);
      setStatusMessage({
        type: 'error',
        text: `保存失败: ${error instanceof Error ? error.message : "未知错误"}`
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* 状态消息 */}
      {statusMessage && (
        <div className={`p-4 rounded-md ${
          statusMessage.type === 'success' 
            ? 'bg-green-50 text-green-800 dark:bg-green-900/30 dark:text-green-300' 
            : 'bg-red-50 text-red-800 dark:bg-red-900/30 dark:text-red-300'
        }`}>
          {statusMessage.text}
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          {/* 标题 */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center">
              <FiFileText className="mr-2" />
              文章标题
            </label>
            <input
              id="title"
              type="text"
              {...register('title')}
              placeholder="输入文章标题"
              className={`mt-1 block w-full rounded-md ${
                errors.title
                  ? 'border-red-300 focus:ring-red-500 focus:border-red-500 dark:border-red-600'
                  : 'border-gray-300 focus:ring-primary-500 focus:border-primary-500 dark:border-gray-600'
              } dark:bg-gray-800 dark:text-white`}
            />
            {errors.title && (
              <p className="mt-2 text-sm text-red-600 dark:text-red-400">{errors.title.message}</p>
            )}
          </div>
          
          {/* 内容 */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
            <label htmlFor="content" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center">
              <FiFileText className="mr-2" />
              文章内容
            </label>
            <textarea
              id="content"
              {...register('content')}
              rows={15}
              placeholder="使用 Markdown 格式编写您的文章内容..."
              className={`mt-1 block w-full rounded-md ${
                errors.content
                  ? 'border-red-300 focus:ring-red-500 focus:border-red-500 dark:border-red-600'
                  : 'border-gray-300 focus:ring-primary-500 focus:border-primary-500 dark:border-gray-600'
              } dark:bg-gray-800 dark:text-white font-mono`}
            />
            {errors.content && (
              <p className="mt-2 text-sm text-red-600 dark:text-red-400">{errors.content.message}</p>
            )}
            <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
              支持 Markdown 格式，如 # 标题, **粗体**, *斜体*, [链接](url), ![图片](url), `代码` 等。
            </p>
          </div>
        </div>
        
        <div className="space-y-6">
          {/* 发布选项 */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">发布选项</h3>
            
            <div className="flex items-center mb-4">
              <input
                id="published"
                type="checkbox"
                {...register('published')}
                className="rounded border-gray-300 text-primary-600 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700"
              />
              <label htmlFor="published" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                {published ? '立即发布' : '保存为草稿'}
              </label>
            </div>
            
            <div className="mt-4 flex space-x-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 inline-flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FiSave className="mr-2" />
                {isSubmitting ? '保存中...' : '保存文章'}
              </button>
              
              <button
                type="button"
                onClick={() => router.push('/dashboard/posts')}
                className="inline-flex justify-center items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                <FiX className="mr-2" />
                取消
              </button>
            </div>
          </div>
          
          {/* 分类 */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
            <label htmlFor="categoryId" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center">
              <FiList className="mr-2" />
              分类
            </label>
            <select
              id="categoryId"
              {...register('categoryId')}
              className="mt-1 block w-full rounded-md border-gray-300 focus:ring-primary-500 focus:border-primary-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
            >
              <option value="">-- 选择分类 --</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
          
          {/* 标签 */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center">
              <FiTag className="mr-2" />
              标签
            </label>
            <div className="mt-2 flex flex-wrap gap-2">
              {tags.map((tag) => (
                <button
                  key={tag.id}
                  type="button"
                  onClick={() => handleTagSelection(tag.id)}
                  className={`inline-flex items-center px-3 py-1 rounded-full text-sm ${
                    selectedTags.includes(tag.id)
                      ? 'bg-primary-100 text-primary-800 dark:bg-primary-900/30 dark:text-primary-300'
                      : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                  } hover:bg-opacity-80 transition-colors`}
                >
                  {tag.name}
                </button>
              ))}
            </div>
          </div>
          
          {/* 封面图片 */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center">
              <FiImage className="mr-2" />
              封面图片
            </label>
            
            {coverImagePreview && (
              <div className="mt-2 mb-4 relative rounded-lg overflow-hidden h-40">
                <img
                  src={coverImagePreview}
                  alt="封面预览"
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={handleRemoveCoverImage}
                  className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                >
                  <FiX />
                </button>
              </div>
            )}
            
            <label className="mt-2 inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer">
              <FiImage className="mr-2" />
              <span>{coverImagePreview ? '更改封面图片' : '上传封面图片'}</span>
              <input
                type="file"
                accept="image/*"
                className="sr-only"
                onChange={handleCoverImageChange}
              />
            </label>
            <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
              推荐尺寸: 1200 x 630 像素
            </p>
          </div>
          
          {/* 摘要 */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center">
              <FiInfo className="mr-2" />
              文章摘要
            </label>
            <textarea
              id="description"
              {...register('description')}
              rows={3}
              placeholder="输入一段简短的文章摘要，将显示在列表页面"
              className="mt-1 block w-full rounded-md border-gray-300 focus:ring-primary-500 focus:border-primary-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
            />
            {errors.description && (
              <p className="mt-2 text-sm text-red-600 dark:text-red-400">{errors.description.message}</p>
            )}
            <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
              最多200个字符，如果留空将自动提取文章前100个字符作为摘要
            </p>
          </div>
        </div>
      </div>
    </form>
  );
} 