'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { FiMail, FiCheck, FiAlertCircle } from 'react-icons/fi';

export function NewsletterSection() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      setStatus('error');
      setMessage('请输入您的邮箱地址');
      return;
    }
    
    // 模拟API调用
    setStatus('loading');
    
    try {
      // 在实际项目中，这里应该是真实的API调用
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      setStatus('success');
      setMessage('感谢订阅！我们会定期发送最新内容到您的邮箱。');
      setEmail('');
    } catch (error) {
      setStatus('error');
      setMessage('订阅失败，请稍后再试。');
    }
  };

  return (
    <section className="py-16 bg-gradient-to-r from-primary-500 to-secondary-500 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-8"
        >
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            订阅我们的通讯
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-xl text-white/80">
            获取最新的技术文章、教程和团队动态，直接发送到您的邮箱
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          viewport={{ once: true }}
          className="max-w-lg mx-auto"
        >
          <form onSubmit={handleSubmit} className="sm:flex">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <FiMail className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="block w-full rounded-l-md border-0 py-3 pl-10 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm"
                placeholder="输入您的邮箱地址"
                disabled={status === 'loading'}
              />
            </div>
            <button
              type="submit"
              disabled={status === 'loading'}
              className="mt-3 sm:mt-0 w-full sm:w-auto rounded-r-md bg-primary-700 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-primary-800 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-70 disabled:cursor-not-allowed transition-colors duration-200"
            >
              {status === 'loading' ? '订阅中...' : '订阅'}
            </button>
          </form>

          {status === 'success' && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mt-3 flex items-center text-sm text-white bg-green-500/20 rounded-md p-3"
            >
              <FiCheck className="h-5 w-5 mr-2" />
              {message}
            </motion.div>
          )}

          {status === 'error' && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mt-3 flex items-center text-sm text-white bg-red-500/20 rounded-md p-3"
            >
              <FiAlertCircle className="h-5 w-5 mr-2" />
              {message}
            </motion.div>
          )}

          <p className="mt-3 text-sm text-white/70 text-center">
            我们尊重您的隐私，不会向第三方分享您的信息
          </p>
        </motion.div>
      </div>
    </section>
  );
} 