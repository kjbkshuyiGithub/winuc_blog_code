import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import DashboardTabs from '@/components/dashboard/DashboardTabs';
import SettingsLayout from '@/components/dashboard/settings/SettingsLayout';
import NotificationsForm from '@/components/dashboard/settings/NotificationsForm';

export const metadata: Metadata = {
  title: '通知偏好 - 账号设置 - 团队博客',
  description: '管理您的通知偏好设置，选择接收哪些通知以及如何接收它们',
};

export default async function NotificationsPage() {
  // 获取用户会话，检查用户是否已登录
  const session = await getServerSession();
  
  // 如果用户未登录，重定向到登录页面
  if (!session?.user) {
    redirect('/login?callbackUrl=/dashboard/settings/notifications');
  }
  
  const tabs = [
    { label: '个人资料', href: '/dashboard/settings', isActive: false },
    { label: '账号安全', href: '/dashboard/settings/security', isActive: false },
    { label: '通知偏好', href: '/dashboard/settings/notifications', isActive: true },
    { label: '个性化', href: '/dashboard/settings/appearance', isActive: false },
  ];
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">账号设置</h1>
        
        <DashboardTabs tabs={tabs} />
        
        <div className="mt-6">
          <SettingsLayout>
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">通知偏好</h2>
              <NotificationsForm />
            </div>
          </SettingsLayout>
        </div>
      </div>
    </div>
  );
} 