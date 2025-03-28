'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiUser, FiMessageSquare, FiSend, FiThumbsUp, FiThumbsDown, FiFlag, FiAlertCircle, FiLoader } from 'react-icons/fi';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { Avatar } from '@/components/Avatar';

interface CommentAuthor {
  id: string;
  name: string | null;
  image: string | null;
}

interface Comment {
  id: string;
  content: string;
  createdAt: string;
  authorId: string;
  author: CommentAuthor;
  replies?: Comment[];
  // 客户端状态
  likes: number;
  dislikes: number;
  isSubmitting?: boolean;
}

interface BlogCommentsProps {
  postId: string;
}

export default function BlogComments({ postId }: BlogCommentsProps) {
  const { data: session } = useSession();
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newComment, setNewComment] = useState('');
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // 获取评论列表
  useEffect(() => {
    const fetchComments = async () => {
      try {
        setIsLoading(true);
        
        const response = await fetch(`/api/comments?postId=${postId}`);
        if (!response.ok) {
          throw new Error('获取评论失败');
        }
        
        const data = await response.json();
        
        // 为每条评论添加客户端状态（用于点赞/踩）
        const commentsWithClientState = data.comments.map((comment: any) => ({
          ...comment,
          likes: 0,
          dislikes: 0,
          replies: comment.replies?.map((reply: any) => ({
            ...reply,
            likes: 0,
            dislikes: 0,
          })) || [],
        }));
        
        setComments(commentsWithClientState);
      } catch (error) {
        console.error('获取评论列表失败:', error);
        setError('获取评论列表失败，请刷新页面重试');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchComments();
  }, [postId]);
  
  // 提交新评论
  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || isSubmitting) return;
    
    try {
      setIsSubmitting(true);
      
      const response = await fetch('/api/comments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: newComment,
          postId,
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || '发表评论失败');
      }
      
      const data = await response.json();
      
      // 将新评论添加到列表并添加客户端状态
      const newCommentWithState = {
        ...data.comment,
        likes: 0,
        dislikes: 0,
        replies: [],
      };
      
      setComments([newCommentWithState, ...comments]);
      setNewComment('');
    } catch (error) {
      console.error('发表评论失败:', error);
      alert(`发表评论失败: ${error instanceof Error ? error.message : '请稍后重试'}`);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // 提交回复
  const handleSubmitReply = async (commentId: string) => {
    if (!replyContent.trim() || isSubmitting) return;
    
    try {
      // 找到要回复的评论，设置其isSubmitting状态
      setComments(prev => 
        prev.map(comment => 
          comment.id === commentId 
            ? { ...comment, isSubmitting: true } 
            : comment
        )
      );
      
      const response = await fetch('/api/comments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: replyContent,
          postId,
          parentId: commentId,
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || '发表回复失败');
      }
      
      const data = await response.json();
      
      // 将新回复添加到对应评论的回复列表
      const newReplyWithState = {
        ...data.comment,
        likes: 0,
        dislikes: 0,
      };
      
      setComments(prev => 
        prev.map(comment => {
          if (comment.id === commentId) {
            return {
              ...comment,
              isSubmitting: false,
              replies: [...(comment.replies || []), newReplyWithState],
            };
          }
          return comment;
        })
      );
      
      setReplyContent('');
      setReplyingTo(null);
    } catch (error) {
      console.error('发表回复失败:', error);
      alert(`发表回复失败: ${error instanceof Error ? error.message : '请稍后重试'}`);
      
      // 清除提交状态
      setComments(prev => 
        prev.map(comment => 
          comment.id === commentId 
            ? { ...comment, isSubmitting: false } 
            : comment
        )
      );
    }
  };
  
  // 点赞/踩评论（仅在客户端状态模拟）
  const handleVote = async (commentId: string, parentId: string | null, isLike: boolean) => {
    if (!session?.user) {
      alert('请先登录后再点赞');
      return;
    }
    
    try {
      // 先在客户端更新状态，提供即时反馈
      setComments(prev => {
        if (parentId === null) {
          // 点赞/踩顶级评论
          return prev.map(comment => {
            if (comment.id === commentId) {
              return {
                ...comment,
                likes: isLike ? comment.likes + 1 : comment.likes,
                dislikes: !isLike ? comment.dislikes + 1 : comment.dislikes,
              };
            }
            return comment;
          });
        } else {
          // 点赞/踩回复
          return prev.map(comment => {
            if (comment.id === parentId) {
              return {
                ...comment,
                replies: comment.replies?.map(reply => {
                  if (reply.id === commentId) {
                    return {
                      ...reply,
                      likes: isLike ? reply.likes + 1 : reply.likes,
                      dislikes: !isLike ? reply.dislikes + 1 : reply.dislikes,
                    };
                  }
                  return reply;
                }),
              };
            }
            return comment;
          });
        }
      });
      
      // 调用API（目前仅模拟）
      const response = await fetch(`/api/comments/${commentId}/vote`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: isLike ? 'like' : 'dislike',
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || '点赞操作失败');
      }
      
      // 如果API返回了具体的点赞数量，可以在这里更新状态
      // 目前简化处理，保持客户端计数
    } catch (error) {
      console.error('点赞操作失败:', error);
      // 可选：回滚客户端状态
    }
  };
  
  // 加载中状态
  if (isLoading) {
    return (
      <div className="mt-12">
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          评论加载中...
        </h3>
        <div className="flex justify-center py-8">
          <FiLoader className="animate-spin h-8 w-8 text-primary-500" />
        </div>
      </div>
    );
  }
  
  // 加载失败
  if (error) {
    return (
      <div className="mt-12">
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          评论
        </h3>
        <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg text-red-800 dark:text-red-200 flex items-center">
          <FiAlertCircle className="mr-2" /> {error}
        </div>
      </div>
    );
  }
  
  return (
    <div className="mt-12">
      <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
        评论 ({comments.reduce((acc, comment) => acc + 1 + (comment.replies?.length || 0), 0)})
      </h3>
      
      {/* 评论列表 */}
      <div className="space-y-6 mb-8">
        {comments.length === 0 ? (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            暂无评论，来发表第一条评论吧
          </div>
        ) : (
          <AnimatePresence>
            {comments.map((comment) => (
              <motion.div 
                key={comment.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow"
              >
                <div className="flex items-start space-x-4">
                  <Avatar
                    src={comment.author.image}
                    name={comment.author.name || ''}
                    alt={`${comment.author.name || '用户'}的头像`}
                    size="md"
                  />
                  
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-gray-900 dark:text-white">{comment.author.name || '匿名用户'}</h4>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {new Date(comment.createdAt).toLocaleDateString('zh-CN')}
                      </span>
                    </div>
                    
                    <p className="mt-2 text-gray-700 dark:text-gray-300">{comment.content}</p>
                    
                    <div className="mt-3 flex items-center space-x-4 text-sm">
                      <button 
                        onClick={() => handleVote(comment.id, null, true)}
                        className="flex items-center text-gray-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400"
                      >
                        <FiThumbsUp className="mr-1" />
                        <span>{comment.likes}</span>
                      </button>
                      
                      <button 
                        onClick={() => handleVote(comment.id, null, false)}
                        className="flex items-center text-gray-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400"
                      >
                        <FiThumbsDown className="mr-1" />
                        <span>{comment.dislikes}</span>
                      </button>
                      
                      <button 
                        onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
                        className="flex items-center text-gray-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400"
                        disabled={!session?.user}
                      >
                        <FiMessageSquare className="mr-1" />
                        <span>回复</span>
                      </button>
                      
                      <button className="flex items-center text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400">
                        <FiFlag className="mr-1" />
                        <span>举报</span>
                      </button>
                    </div>
                    
                    {/* 回复表单 */}
                    {session?.user && replyingTo === comment.id && (
                      <div className="mt-4">
                        <div className="flex items-start space-x-2">
                          <Avatar
                            src={session.user.image}
                            name={session.user.name || ''}
                            alt="用户头像"
                            size="sm"
                          />
                          <div className="flex-1">
                            <textarea
                              value={replyContent}
                              onChange={(e) => setReplyContent(e.target.value)}
                              placeholder="写下你的回复..."
                              className="w-full px-3 py-2 text-sm text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700"
                              rows={3}
                              disabled={comment.isSubmitting}
                            />
                            <div className="mt-2 flex justify-end">
                              <button
                                onClick={() => handleSubmitReply(comment.id)}
                                className="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                                disabled={!replyContent.trim() || comment.isSubmitting}
                              >
                                {comment.isSubmitting ? (
                                  <>
                                    <FiLoader className="animate-spin mr-2" />
                                    提交中...
                                  </>
                                ) : (
                                  '提交回复'
                                )}
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {/* 回复列表 */}
                    {comment.replies && comment.replies.length > 0 && (
                      <div className="mt-4 pl-4 border-l-2 border-gray-200 dark:border-gray-700 space-y-4">
                        {comment.replies.map((reply) => (
                          <div key={reply.id} className="flex items-start space-x-3">
                            <Avatar
                              src={reply.author.image}
                              name={reply.author.name || ''}
                              alt={`${reply.author.name || '用户'}的头像`}
                              size="sm"
                            />
                            
                            <div className="flex-1">
                              <div className="flex items-center justify-between">
                                <h5 className="font-medium text-gray-900 dark:text-white">{reply.author.name || '匿名用户'}</h5>
                                <span className="text-xs text-gray-500 dark:text-gray-400">
                                  {new Date(reply.createdAt).toLocaleDateString('zh-CN')}
                                </span>
                              </div>
                              
                              <p className="mt-1 text-sm text-gray-700 dark:text-gray-300">{reply.content}</p>
                              
                              <div className="mt-2 flex items-center space-x-4 text-xs">
                                <button 
                                  onClick={() => handleVote(reply.id, comment.id, true)}
                                  className="flex items-center text-gray-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400"
                                  disabled={!session?.user}
                                >
                                  <FiThumbsUp className="mr-1" />
                                  <span>{reply.likes}</span>
                                </button>
                                
                                <button 
                                  onClick={() => handleVote(reply.id, comment.id, false)}
                                  className="flex items-center text-gray-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400"
                                  disabled={!session?.user}
                                >
                                  <FiThumbsDown className="mr-1" />
                                  <span>{reply.dislikes}</span>
                                </button>
                                
                                <button className="flex items-center text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400">
                                  <FiFlag className="mr-1" />
                                  <span>举报</span>
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>
      
      {/* 评论表单 */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow">
        <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-4 flex items-center">
          <FiMessageSquare className="mr-2" />
          发表评论
        </h4>
        
        {session ? (
          <form onSubmit={handleSubmitComment}>
            <div className="mb-4">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="写下你的想法..."
                className="w-full px-4 py-3 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700"
                rows={4}
                required
                disabled={isSubmitting}
              />
            </div>
            
            <div className="flex justify-between items-center">
              <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                <Avatar
                  src={session.user?.image}
                  name={session.user?.name || '用户'}
                  alt={session.user?.name || '用户头像'}
                  size="sm"
                  className="mr-2"
                />
                <span>评论者: {session.user?.name || '用户'}</span>
              </div>
              
              <button
                type="submit"
                className="px-6 py-2 flex items-center text-white bg-primary-600 rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={!newComment.trim() || isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <FiLoader className="animate-spin mr-2" />
                    提交中...
                  </>
                ) : (
                  <>
                    <FiSend className="mr-2" />
                    提交评论
                  </>
                )}
              </button>
            </div>
          </form>
        ) : (
          <div className="text-center py-6">
            <p className="text-gray-600 dark:text-gray-400 mb-4">请登录后发表评论</p>
            <Link
              href="/login"
              className="px-6 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-md transition-colors inline-block"
            >
              登录账号
            </Link>
          </div>
        )}
      </div>
    </div>
  );
} 