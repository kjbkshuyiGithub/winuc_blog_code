'use client';

import { useState, useEffect, useRef } from 'react';
import { FiMail, FiCheck, FiAlertTriangle } from 'react-icons/fi';

interface VerificationCodeInputProps {
  email: string;
  purpose: 'REGISTER' | 'LOGIN' | 'RESET_PASSWORD';
  onVerificationSuccess: (success: boolean) => void;
  onCodeChange: (code: string) => void;
}

export default function VerificationCodeInput({ 
  email, 
  purpose, 
  onVerificationSuccess, 
  onCodeChange 
}: VerificationCodeInputProps) {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const countdownRef = useRef<NodeJS.Timeout | null>(null);
  
  // 启动倒计时
  const startCountdown = () => {
    setCountdown(60);
    if (countdownRef.current) {
      clearInterval(countdownRef.current);
    }
    
    countdownRef.current = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(countdownRef.current!);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };
  
  // 组件卸载时清除倒计时
  useEffect(() => {
    return () => {
      if (countdownRef.current) {
        clearInterval(countdownRef.current);
      }
    };
  }, []);
  
  // 发送验证码
  const sendCode = async () => {
    if (countdown > 0) return;
    
    setLoading(true);
    setError('');
    
    try {
      const response = await fetch('/api/auth/verification-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, purpose }),
      });
      
      const data = await response.json();
      
      if (!data.success) {
        setError(data.message || '发送验证码失败，请稍后重试');
        return;
      }
      
      startCountdown();
    } catch (err) {
      setError('发送验证码时出错，请稍后重试');
      console.error('发送验证码失败:', err);
    } finally {
      setLoading(false);
    }
  };
  
  // 验证验证码
  const verifyCode = async () => {
    if (code.length !== 6) {
      setError('请输入6位验证码');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      const response = await fetch('/api/auth/verify-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code, purpose }),
      });
      
      const data = await response.json();
      
      if (!data.success) {
        setError(data.message || '验证码验证失败');
        onVerificationSuccess(false);
        return;
      }
      
      setSuccess(true);
      onVerificationSuccess(true);
    } catch (err) {
      setError('验证时出错，请稍后重试');
      onVerificationSuccess(false);
      console.error('验证码验证失败:', err);
    } finally {
      setLoading(false);
    }
  };
  
  // 处理验证码输入
  const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, '').slice(0, 6);
    setCode(value);
    onCodeChange(value);
    
    // 自动验证
    if (value.length === 6 && !success) {
      verifyCode();
    }
  };
  
  // 首次加载自动发送验证码
  useEffect(() => {
    if (email) {
      sendCode();
    }
  }, [email]); // eslint-disable-line react-hooks/exhaustive-deps
  
  return (
    <div className="space-y-4">
      {/* 验证码输入框 */}
      <div>
        <label htmlFor="verification-code" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          验证码
        </label>
        <div className="relative rounded-md shadow-sm">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FiMail className="text-gray-400" />
          </div>
          <input
            id="verification-code"
            type="text"
            value={code}
            onChange={handleCodeChange}
            disabled={loading || success}
            placeholder="请输入6位验证码"
            className={`block w-full pl-10 pr-24 py-2 rounded-md ${
              error
                ? 'border-red-300 focus:ring-red-500 focus:border-red-500 dark:border-red-600'
                : success
                ? 'border-green-300 focus:ring-green-500 focus:border-green-500 dark:border-green-600'
                : 'border-gray-300 focus:ring-primary-500 focus:border-primary-500 dark:border-gray-600'
            } dark:bg-gray-800 dark:text-white`}
          />
          <div className="absolute inset-y-0 right-0 flex items-center">
            <button
              type="button"
              onClick={sendCode}
              disabled={loading || countdown > 0 || success}
              className="h-full px-3 py-0 border-transparent bg-transparent text-sm font-medium text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {countdown > 0 ? `${countdown}秒后重发` : '获取验证码'}
            </button>
          </div>
        </div>
        
        {error && (
          <div className="mt-2 flex items-center text-sm text-red-600 dark:text-red-400">
            <FiAlertTriangle className="mr-1 h-4 w-4" />
            <span>{error}</span>
          </div>
        )}
        
        {success && (
          <div className="mt-2 flex items-center text-sm text-green-600 dark:text-green-400">
            <FiCheck className="mr-1 h-4 w-4" />
            <span>验证成功</span>
          </div>
        )}
      </div>
      
      <div className="text-xs text-gray-500 dark:text-gray-400">
        验证码将发送至您的邮箱：{email}
      </div>
    </div>
  );
} 