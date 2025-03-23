'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { FiUser, FiMessageSquare, FiSend, FiThumbsUp, FiThumbsDown, FiFlag } from 'react-icons/fi';
import { useSession } from 'next-auth/react';
import Link from 'next/link';

// 模拟评论数据
const initialComments = [
  {
    id: 1,
    author: '李明',
    avatar: '/images/avatars/user-1.jpg',
    content: '这篇文章非常有见地，特别是关于性能优化的部分给了我很多启发。',
    date: '2023-12-16',
    likes: 5,
    dislikes: 0,
    replies: [
      {
        id: 101,
        author: '张华',
        avatar: '/images/avatars/user-2.jpg',
        content: '我也觉得，尤其是代码分割那部分的建议很实用。',
        date: '2023-12-16',
        likes: 2,
        dislikes: 0,
      }
    ]
  },
  {
    id: 2,
    author: '王芳',
    avatar: '/images/avatars/user-3.jpg',
    content: '文章中提到的懒加载技术我已经应用到我的项目中，确实提升了不少性能。',
    date: '2023-12-15',
    likes: 3,
    dislikes: 1,
    replies: []
  }
];

interface Comment {
  id: number;
  author: string;
  avatar: string;
  content: string;
  date: string;
  likes: number;
  dislikes: number;
  replies?: Comment[];
}

export default function BlogComments() {
  const { data: session } = useSession();
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [newComment, setNewComment] = useState('');
  const [replyingTo, setReplyingTo] = useState<number | null>(null);
  const [replyContent, setReplyContent] = useState('');
  
  // 提交新评论
  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    
    const newCommentObj: Comment = {
      id: Date.now(),
      author: session?.user?.name || '访客用户',
      avatar: session?.user?.image || '/images/avatars/default.jpg',
      content: newComment,
      date: new Date().toISOString().split('T')[0],
      likes: 0,
      dislikes: 0,
      replies: []
    };
    
    setComments([...comments, newCommentObj]);
    setNewComment('');
  };
  
  // 提交回复
  const handleSubmitReply = (commentId: number) => {
    if (!replyContent.trim()) return;
    
    const newReply: Comment = {
      id: Date.now(),
      author: session?.user?.name || '访客用户',
      avatar: session?.user?.image || '/images/avatars/default.jpg',
      content: replyContent,
      date: new Date().toISOString().split('T')[0],
      likes: 0,
      dislikes: 0
    };
    
    const updatedComments = comments.map(comment => {
      if (comment.id === commentId) {
        return {
          ...comment,
          replies: [...(comment.replies || []), newReply]
        };
      }
      return comment;
    });
    
    setComments(updatedComments);
    setReplyContent('');
    setReplyingTo(null);
  };
  
  // 点赞/踩评论
  const handleVote = (commentId: number, parentId: number | null, isLike: boolean) => {
    const updatedComments = comments.map(comment => {
      if (parentId === null && comment.id === commentId) {
        return {
          ...comment,
          likes: isLike ? comment.likes + 1 : comment.likes,
          dislikes: !isLike ? comment.dislikes + 1 : comment.dislikes
        };
      } else if (parentId !== null && comment.id === parentId) {
        const updatedReplies = comment.replies?.map(reply => {
          if (reply.id === commentId) {
            return {
              ...reply,
              likes: isLike ? reply.likes + 1 : reply.likes,
              dislikes: !isLike ? reply.dislikes + 1 : reply.dislikes
            };
          }
          return reply;
        });
        return { ...comment, replies: updatedReplies };
      }
      return comment;
    });
    
    setComments(updatedComments);
  };
  
  return (
    <div className="mt-12">
      <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
        评论 ({comments.reduce((acc, comment) => acc + 1 + (comment.replies?.length || 0), 0)})
      </h3>
      
      {/* 评论列表 */}
      <div className="space-y-6 mb-8">
        {comments.map((comment) => (
          <motion.div 
            key={comment.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow"
          >
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-10 h-10 bg-gray-300 dark:bg-gray-600 rounded-full overflow-hidden">
                {comment.avatar && (
                  <img 
                    src={comment.avatar} 
                    alt={`${comment.author}的头像`}
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
              
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-gray-900 dark:text-white">{comment.author}</h4>
                  <span className="text-sm text-gray-500 dark:text-gray-400">{comment.date}</span>
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
                {replyingTo === comment.id && (
                  <div className="mt-4">
                    <div className="flex items-start space-x-2">
                      <div className="flex-shrink-0 w-8 h-8 bg-gray-300 dark:bg-gray-600 rounded-full overflow-hidden">
                        {session?.user?.image && (
                          <img 
                            src={session.user.image} 
                            alt="用户头像"
                            className="w-full h-full object-cover"
                          />
                        )}
                      </div>
                      <div className="flex-1">
                        <textarea
                          value={replyContent}
                          onChange={(e) => setReplyContent(e.target.value)}
                          placeholder="写下你的回复..."
                          className="w-full px-3 py-2 text-sm text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700"
                          rows={3}
                        />
                        <div className="mt-2 flex justify-end">
                          <button
                            onClick={() => handleSubmitReply(comment.id)}
                            className="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
                          >
                            提交回复
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
                        <div className="flex-shrink-0 w-8 h-8 bg-gray-300 dark:bg-gray-600 rounded-full overflow-hidden">
                          {reply.avatar && (
                            <img 
                              src={reply.avatar} 
                              alt={`${reply.author}的头像`}
                              className="w-full h-full object-cover"
                            />
                          )}
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h5 className="font-medium text-gray-900 dark:text-white">{reply.author}</h5>
                            <span className="text-xs text-gray-500 dark:text-gray-400">{reply.date}</span>
                          </div>
                          
                          <p className="mt-1 text-sm text-gray-700 dark:text-gray-300">{reply.content}</p>
                          
                          <div className="mt-2 flex items-center space-x-4 text-xs">
                            <button 
                              onClick={() => handleVote(reply.id, comment.id, true)}
                              className="flex items-center text-gray-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400"
                            >
                              <FiThumbsUp className="mr-1" />
                              <span>{reply.likes}</span>
                            </button>
                            
                            <button 
                              onClick={() => handleVote(reply.id, comment.id, false)}
                              className="flex items-center text-gray-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400"
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
              />
            </div>
            
            <div className="flex justify-between items-center">
              <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                <div className="w-6 h-6 rounded-full bg-gray-300 dark:bg-gray-700 flex items-center justify-center overflow-hidden mr-2">
                  {session.user?.image ? (
                    <img
                      src={session.user.image}
                      alt={session.user.name || '用户头像'}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <FiUser className="text-gray-600 dark:text-gray-400" />
                  )}
                </div>
                <span>评论者: {session.user?.name || '用户'}</span>
              </div>
              
              <button
                type="submit"
                className="px-6 py-2 flex items-center text-white bg-primary-600 rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <FiSend className="mr-2" />
                提交评论
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