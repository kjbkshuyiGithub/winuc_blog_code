'use client';

import { useState } from 'react';

interface AvatarProps {
  src?: string | null;
  alt?: string;
  name?: string | null;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export function Avatar({ src, alt = '用户头像', name = '', size = 'md', className = '' }: AvatarProps) {
  const [imgError, setImgError] = useState(false);
  
  // 根据size决定尺寸class
  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-10 w-10',
    lg: 'h-12 w-12',
    xl: 'h-16 w-16',
  };
  
  const sizeClass = sizeClasses[size];
  
  // 从名字中获取首字母，用于无头像时显示
  const getInitial = () => {
    if (!name) return '用';
    
    const trimmedName = name.trim();
    if (!trimmedName) return '用';
    
    // 中文名取第一个字，英文名取首字母
    return trimmedName.charAt(0).toUpperCase();
  };
  
  // 根据名称生成一个固定的颜色
  const getColorByName = () => {
    if (!name) return 'bg-primary-500';
    
    const colors = [
      'bg-pink-500', 'bg-purple-500', 'bg-indigo-500', 'bg-blue-500',
      'bg-cyan-500', 'bg-teal-500', 'bg-green-500', 'bg-yellow-500',
      'bg-orange-500', 'bg-red-500'
    ];
    
    // 简单的哈希算法，根据名字的Unicode值选择颜色
    let sum = 0;
    for (let i = 0; i < name.length; i++) {
      sum += name.charCodeAt(i);
    }
    
    return colors[sum % colors.length];
  };
  
  return (
    <div className={`${sizeClass} rounded-full overflow-hidden flex-shrink-0 ${className}`}>
      {!imgError && src ? (
        <img
          src={src}
          alt={alt}
          className="w-full h-full object-cover"
          onError={() => setImgError(true)}
        />
      ) : (
        <div className={`${getColorByName()} w-full h-full flex items-center justify-center text-white font-bold`}>
          {getInitial()}
        </div>
      )}
    </div>
  );
} 