'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FiAlertTriangle, FiTrash, FiArrowLeft } from 'react-icons/fi';

type Post = {
  id: string;
  title: string;
  published: boolean;
  category?: {
    name: string;
  } | null;
};

export default function DeletePostForm({ post }: { post: Post }) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async () => {
    setIsDeleting(true);
    setError(null);

    try {
      const response = await fetch(`/api/posts/${post.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || '删除文章时出错');
      }

      // 删除成功，返回文章列表
      router.push('/dashboard/posts');
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : '删除文章时出错');
      setIsDeleting(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
      <div className="flex items-center justify-center bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-300 rounded-full w-12 h-12 mx-auto mb-4">
        <FiAlertTriangle className="w-6 h-6" />
      </div>

      <h2 className="text-xl font-semibold text-center text-gray-900 dark:text-white mb-4">
        确认删除
      </h2>

      <p className="text-gray-600 dark:text-gray-400 text-center mb-6">
        您确定要删除文章 <span className="font-semibold">{post.title}</span> 吗？
        此操作<span className="font-semibold text-red-500">不可撤销</span>。
      </p>

      {post.published && (
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-400 p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <FiAlertTriangle className="h-5 w-5 text-yellow-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700 dark:text-yellow-300">
                此文章当前已发布。删除后，所有已发布的链接将不再可用。
              </p>
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-400 p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <FiAlertTriangle className="h-5 w-5 text-red-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700 dark:text-red-300">
                {error}
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-col sm:flex-row-reverse sm:justify-center space-y-3 sm:space-y-0 sm:space-x-3 sm:space-x-reverse">
        <button
          type="button"
          onClick={handleDelete}
          disabled={isDeleting}
          className="inline-flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <FiTrash className="mr-2 h-4 w-4" />
          {isDeleting ? '删除中...' : '确认删除'}
        </button>

        <button
          type="button"
          onClick={() => router.back()}
          disabled={isDeleting}
          className="inline-flex justify-center items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <FiArrowLeft className="mr-2 h-4 w-4" />
          取消
        </button>
      </div>
    </div>
  );
} 