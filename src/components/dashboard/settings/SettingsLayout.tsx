'use client';

import { useState } from 'react';
import { FiChevronRight } from 'react-icons/fi';

interface SettingsLayoutProps {
  children: React.ReactNode;
}

export default function SettingsLayout({ children }: SettingsLayoutProps) {
  const [showSidebar, setShowSidebar] = useState(false);
  
  return (
    <div className="md:flex md:space-x-6">
      {/* 移动端菜单开关 */}
      <div className="md:hidden mb-4">
        <button
          onClick={() => setShowSidebar(!showSidebar)}
          className="w-full flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-md shadow-sm border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          <span className="text-gray-700 dark:text-gray-300 font-medium">设置菜单</span>
          <FiChevronRight className={`transform transition-transform ${showSidebar ? 'rotate-90' : ''}`} />
        </button>
      </div>
      
      {/* 侧边栏菜单 */}
      <div className={`md:w-64 ${showSidebar ? 'block' : 'hidden'} md:block`}>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 sticky top-20">
          <nav className="space-y-1">
            <SidebarItem href="/dashboard/settings" label="个人资料" />
            <SidebarItem href="/dashboard/settings/security" label="账号安全" />
            <SidebarItem href="/dashboard/settings/notifications" label="通知偏好" />
            <SidebarItem href="/dashboard/settings/appearance" label="个性化" />
          </nav>
        </div>
      </div>
      
      {/* 内容区域 */}
      <div className="flex-1">
        {children}
      </div>
    </div>
  );
}

interface SidebarItemProps {
  href: string;
  label: string;
}

function SidebarItem({ href, label }: SidebarItemProps) {
  // 获取当前路径以高亮当前菜单项
  const isActive = typeof window !== 'undefined' && window.location.pathname === href;
  
  return (
    <a
      href={href}
      className={`flex items-center px-3 py-2 text-sm font-medium rounded-md ${
        isActive
          ? 'bg-primary-50 text-primary-600 dark:bg-primary-900 dark:text-primary-400'
          : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
      }`}
      aria-current={isActive ? 'page' : undefined}
    >
      <span>{label}</span>
    </a>
  );
} 