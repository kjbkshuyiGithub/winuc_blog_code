'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface Tab {
  label: string;
  href: string;
  isActive?: boolean;
}

interface DashboardTabsProps {
  tabs: Tab[];
}

export default function DashboardTabs({ tabs }: DashboardTabsProps) {
  const pathname = usePathname();
  
  return (
    <div className="border-b border-gray-200 dark:border-gray-700">
      <nav className="flex space-x-8">
        {tabs.map((tab) => {
          // 如果没有显式设置isActive，则通过路径判断
          const isActive = tab.isActive !== undefined ? tab.isActive : pathname === tab.href;
          
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`inline-flex items-center px-1 py-4 border-b-2 text-sm font-medium ${
                isActive
                  ? 'border-primary-600 text-primary-600 dark:border-primary-400 dark:text-primary-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300 dark:hover:border-gray-600'
              }`}
              aria-current={isActive ? 'page' : undefined}
            >
              {tab.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
} 