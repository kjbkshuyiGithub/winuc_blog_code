'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { FiMail, FiPhone, FiMapPin, FiSend, FiAlertCircle, FiCheck, FiHelpCircle } from 'react-icons/fi';

// 表单验证架构
const formSchema = z.object({
  name: z.string().min(2, '姓名至少需要2个字符').max(50, '姓名不能超过50个字符'),
  email: z.string().email('请输入有效的电子邮件地址'),
  subject: z.string().min(5, '主题至少需要5个字符').max(100, '主题不能超过100个字符'),
  message: z.string().min(10, '消息至少需要10个字符').max(1000, '消息不能超过1000个字符'),
});

type FormValues = z.infer<typeof formSchema>;

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [submitMessage, setSubmitMessage] = useState('');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    setSubmitStatus('idle');
    setSubmitMessage('');

    try {
      // 发送请求到后端API
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      
      const result = await response.json();
      
      if (response.ok && result.success) {
        setSubmitStatus('success');
        setSubmitMessage(result.message || '感谢您的留言！我们会尽快回复您。');
        reset(); // 重置表单
      } else {
        setSubmitStatus('error');
        setSubmitMessage(result.message || '提交表单时发生错误，请稍后重试。');
      }
    } catch (error) {
      console.error('提交表单时出错:', error);
      setSubmitStatus('error');
      setSubmitMessage('提交表单时发生错误，请稍后重试。');
    } finally {
      setIsSubmitting(false);
    }
  };

  // FAQ 数据
  const faqs = [
    {
      question: '如何注册账号？',
      answer: '点击网站右上角的"注册"按钮，填写相关信息即可完成注册。我们支持邮箱注册和第三方账号登录。'
    },
    {
      question: '如何投稿文章？',
      answer: '注册并登录后，进入个人仪表盘，点击"发布文章"按钮，按照提示填写文章内容并提交审核。'
    },
    {
      question: '文章审核需要多长时间？',
      answer: '我们通常会在1-3个工作日内完成文章审核。如果文章符合我们的内容标准，将会被发布；否则，我们会通过邮件告知您需要修改的地方。'
    },
    {
      question: '如何成为团队成员？',
      answer: '我们欢迎热爱技术的朋友加入我们的团队。请通过本页面的联系表单或发送简历到hr@teamblog.com，我们会尽快与您联系。'
    }
  ];

  return (
    <div className="min-h-screen">
      {/* 页面头部 */}
      <div className="bg-gradient-to-r from-primary-600 to-secondary-600 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-4xl font-extrabold text-white sm:text-5xl md:text-6xl"
          >
            联系我们
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-4 max-w-3xl mx-auto text-xl text-white opacity-90"
          >
            有任何问题或建议？请随时联系我们
          </motion.p>
        </div>
      </div>

      {/* 主要内容 */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* 联系表单 */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8"
          >
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">发送消息</h2>
            
            {submitStatus === 'success' && (
              <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/30 rounded-md flex items-start">
                <FiCheck className="h-5 w-5 text-green-500 dark:text-green-400 mt-0.5 mr-2" />
                <p className="text-green-700 dark:text-green-300">{submitMessage}</p>
              </div>
            )}
            
            {submitStatus === 'error' && (
              <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/30 rounded-md flex items-start">
                <FiAlertCircle className="h-5 w-5 text-red-500 dark:text-red-400 mt-0.5 mr-2" />
                <p className="text-red-700 dark:text-red-300">{submitMessage}</p>
              </div>
            )}
            
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="grid grid-cols-1 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    姓名
                  </label>
                  <input
                    type="text"
                    id="name"
                    {...register('name')}
                    className="block w-full px-4 py-3 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                    placeholder="请输入您的姓名"
                  />
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.name.message}</p>
                  )}
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    电子邮件
                  </label>
                  <input
                    type="email"
                    id="email"
                    {...register('email')}
                    className="block w-full px-4 py-3 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                    placeholder="请输入您的电子邮件"
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.email.message}</p>
                  )}
                </div>
                
                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    主题
                  </label>
                  <input
                    type="text"
                    id="subject"
                    {...register('subject')}
                    className="block w-full px-4 py-3 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                    placeholder="请输入主题"
                  />
                  {errors.subject && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.subject.message}</p>
                  )}
                </div>
                
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    消息
                  </label>
                  <textarea
                    id="message"
                    {...register('message')}
                    rows={5}
                    className="block w-full px-4 py-3 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                    placeholder="请输入您的消息"
                  ></textarea>
                  {errors.message && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.message.message}</p>
                  )}
                </div>
                
                <div>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full inline-flex justify-center items-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                  >
                    {isSubmitting ? (
                      <>处理中...</>
                    ) : (
                      <>
                        <FiSend className="mr-2 h-5 w-5" />
                        发送消息
                      </>
                    )}
                  </button>
                </div>
              </div>
            </form>
          </motion.div>
          
          {/* 联系信息 */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">联系方式</h2>
              
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <div className="bg-primary-100 dark:bg-primary-900 p-3 rounded-full">
                      <FiMail className="h-6 w-6 text-primary-600 dark:text-primary-400" />
                    </div>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">电子邮件</h3>
                    <a 
                      href="mailto:info@teamblog.com" 
                      className="text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                    >
                      info@teamblog.com
                    </a>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <div className="bg-primary-100 dark:bg-primary-900 p-3 rounded-full">
                      <FiPhone className="h-6 w-6 text-primary-600 dark:text-primary-400" />
                    </div>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">电话</h3>
                    <a 
                      href="tel:+86-010-12345678" 
                      className="text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                    >
                      +86 (010) 1234-5678
                    </a>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      周一至周五，9:00 - 18:00
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <div className="bg-primary-100 dark:bg-primary-900 p-3 rounded-full">
                      <FiMapPin className="h-6 w-6 text-primary-600 dark:text-primary-400" />
                    </div>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">地址</h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      北京市海淀区中关村大街1号<br />
                      科技大厦B座15层
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* 地图 */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 h-64 relative">
              <div className="absolute inset-0 m-8 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center text-gray-500 dark:text-gray-400">
                <div className="text-center">
                  <FiMapPin className="h-8 w-8 mx-auto mb-2" />
                  <p>这里将显示地图</p>
                  <p className="text-sm">(实际项目中将嵌入真实地图)</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
      
      {/* FAQ部分 */}
      <section className="bg-gray-50 dark:bg-gray-800 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
              常见问题
            </h2>
            <p className="mt-4 max-w-3xl mx-auto text-xl text-gray-500 dark:text-gray-400">
              以下是一些用户经常问到的问题
            </p>
          </motion.div>
          
          <div className="space-y-8 max-w-3xl mx-auto">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white dark:bg-gray-900 shadow-md rounded-lg p-6"
              >
                <div className="flex items-start">
                  <div className="flex-shrink-0 mt-1">
                    <FiHelpCircle className="h-6 w-6 text-primary-600 dark:text-primary-400" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      {faq.question}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
} 