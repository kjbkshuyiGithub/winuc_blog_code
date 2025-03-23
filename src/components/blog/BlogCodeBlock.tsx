'use client';

import { useEffect, useState } from 'react';
import { FiCopy, FiCheck } from 'react-icons/fi';
import { detectLanguage } from '../providers/CodeHighlightProvider';

interface BlogCodeBlockProps {
  code: string;
  language?: string;
  filename?: string;
}

export default function BlogCodeBlock({ code, language, filename }: BlogCodeBlockProps) {
  const [copied, setCopied] = useState(false);
  const [detectedLang, setDetectedLang] = useState(language || '');

  useEffect(() => {
    // 如果没有提供语言，尝试自动检测
    if (!language) {
      const detected = detectLanguage(code);
      setDetectedLang(detected);
    }
  }, [code, language]);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="code-block my-6 rounded-lg overflow-hidden">
      <div className="flex justify-between items-center px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
        {filename && (
          <div className="text-sm font-mono truncate">
            {filename}
          </div>
        )}
        {!filename && detectedLang && (
          <div className="text-sm font-mono">
            {detectedLang}
          </div>
        )}
        <button
          onClick={handleCopy}
          className="p-1 rounded hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
          aria-label="复制代码"
        >
          {copied ? <FiCheck className="text-green-500" /> : <FiCopy />}
        </button>
      </div>
      <pre className={`language-${detectedLang || 'plaintext'}`}>
        <code className={`language-${detectedLang || 'plaintext'}`}>
          {code}
        </code>
      </pre>
    </div>
  );
} 