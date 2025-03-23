'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  FiShare2, 
  FiTwitter, 
  FiFacebook, 
  FiLinkedin, 
  FiMail, 
  FiLink, 
  FiCheck 
} from 'react-icons/fi';

interface BlogShareButtonsProps {
  title: string;
  url: string;
  description?: string;
}

export default function BlogShareButtons({ 
  title, 
  url, 
  description = '' 
}: BlogShareButtonsProps) {
  const [copied, setCopied] = useState(false);
  
  // 编码分享内容
  const encodedTitle = encodeURIComponent(title);
  const encodedUrl = encodeURIComponent(url);
  const encodedDescription = encodeURIComponent(description);
  
  // 分享链接
  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`;
  const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
  const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`;
  const mailUrl = `mailto:?subject=${encodedTitle}&body=${encodedDescription}%0A%0A${encodedUrl}`;
  
  // 复制链接到剪贴板
  const copyToClipboard = () => {
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };
  
  // 分享按钮配置
  const shareButtons = [
    {
      name: 'Twitter',
      icon: <FiTwitter />,
      url: twitterUrl,
      color: 'bg-[#1DA1F2] hover:bg-[#0c85d0]'
    },
    {
      name: 'Facebook',
      icon: <FiFacebook />,
      url: facebookUrl,
      color: 'bg-[#4267B2] hover:bg-[#365899]'
    },
    {
      name: 'LinkedIn',
      icon: <FiLinkedin />,
      url: linkedinUrl,
      color: 'bg-[#0077B5] hover:bg-[#00669c]'
    },
    {
      name: 'Email',
      icon: <FiMail />,
      url: mailUrl,
      color: 'bg-gray-600 hover:bg-gray-700'
    }
  ];
  
  return (
    <div className="flex flex-col space-y-4">
      <div className="flex items-center text-gray-700 dark:text-gray-300">
        <FiShare2 className="mr-2" />
        <span className="font-medium">分享这篇文章</span>
      </div>
      
      <div className="flex flex-wrap gap-2">
        {/* 社交媒体分享按钮 */}
        {shareButtons.map((button) => (
          <motion.a
            key={button.name}
            href={button.url}
            target="_blank"
            rel="noopener noreferrer"
            className={`flex items-center justify-center w-10 h-10 rounded-full text-white ${button.color} transition-transform`}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            aria-label={`分享到 ${button.name}`}
          >
            {button.icon}
          </motion.a>
        ))}
        
        {/* 复制链接按钮 */}
        <motion.button
          onClick={copyToClipboard}
          className={`flex items-center justify-center w-10 h-10 rounded-full text-white ${
            copied 
              ? 'bg-green-600 hover:bg-green-700' 
              : 'bg-gray-800 hover:bg-gray-900'
          } transition-colors`}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          aria-label="复制链接"
        >
          {copied ? <FiCheck /> : <FiLink />}
        </motion.button>
      </div>
      
      {/* 复制成功提示 */}
      {copied && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="text-sm text-green-600 dark:text-green-400"
        >
          链接已复制到剪贴板！
        </motion.div>
      )}
    </div>
  );
} 