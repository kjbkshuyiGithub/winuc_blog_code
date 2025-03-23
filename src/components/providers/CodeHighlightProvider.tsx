'use client';

import { useEffect } from 'react';
import Prism from 'prismjs';

// 导入基础样式
import 'prismjs/themes/prism.css';

// 导入语言支持
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-jsx';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-tsx';
import 'prismjs/components/prism-css';
import 'prismjs/components/prism-scss';
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-java';
import 'prismjs/components/prism-c';
import 'prismjs/components/prism-cpp';
import 'prismjs/components/prism-csharp';
import 'prismjs/components/prism-go';
import 'prismjs/components/prism-rust';
import 'prismjs/components/prism-bash';
import 'prismjs/components/prism-yaml';
import 'prismjs/components/prism-json';
import 'prismjs/components/prism-markdown';
import 'prismjs/components/prism-sql';
import 'prismjs/components/prism-graphql';

export default function CodeHighlightProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    // 初始化时高亮所有代码块
    Prism.highlightAll();

    // 创建一个MutationObserver来监听DOM变化
    const observer = new MutationObserver(() => {
      Prism.highlightAll();
    });

    // 开始观察文档的变化
    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    // 清理函数
    return () => {
      observer.disconnect();
    };
  }, []);

  return <>{children}</>;
}

// 添加自动语言检测函数
export function detectLanguage(code: string): string {
  // 简单的语言检测逻辑
  if (code.includes('import React') || code.includes('export default') || code.includes('const') || code.includes('function')) {
    if (code.includes('tsx') || code.includes('<') && code.includes('>') && code.includes(':')) {
      return 'tsx';
    } else if (code.includes('jsx') || (code.includes('<') && code.includes('>'))) {
      return 'jsx';
    } else if (code.includes('ts') || code.includes(':')) {
      return 'typescript';
    } else {
      return 'javascript';
    }
  } else if (code.includes('@media') || code.includes('@import') || code.includes('{') && code.includes('}') && code.includes(';')) {
    if (code.includes('@tailwind') || code.includes('@apply')) {
      return 'css';
    } else if (code.includes('$') && code.includes('@mixin')) {
      return 'scss';
    } else {
      return 'css';
    }
  } else if (code.includes('def ') || code.includes('import ') && code.includes('print(')) {
    return 'python';
  } else if (code.includes('public class') || code.includes('private') || code.includes('void')) {
    return 'java';
  } else if (code.includes('#include') && code.includes('int main')) {
    if (code.includes('std::')) {
      return 'cpp';
    } else {
      return 'c';
    }
  } else if (code.includes('package main') || code.includes('func ')) {
    return 'go';
  } else if (code.includes('fn ') || code.includes('let mut')) {
    return 'rust';
  } else if (code.includes('SELECT') || code.includes('FROM') || code.includes('WHERE')) {
    return 'sql';
  } else if (code.includes('```') || code.includes('#') && code.includes('##')) {
    return 'markdown';
  } else if (code.includes('{') && code.includes('}') && !code.includes(';')) {
    return 'json';
  } else if (code.includes('---') || code.includes(':') && !code.includes('{')) {
    return 'yaml';
  } else if (code.includes('#!/bin/') || code.includes('echo ')) {
    return 'bash';
  } else {
    return 'plaintext';
  }
} 