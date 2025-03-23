import { ReactNode } from 'react';
import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import DashboardLayout from '@/components/dashboard/DashboardLayout';

interface DashboardRootLayoutProps {
  children: ReactNode;
}

export default async function DashboardRootLayout({ children }: DashboardRootLayoutProps) {
  // 获取用户会话，检查用户是否已登录
  const session = await getServerSession();
  
  // 如果用户未登录，重定向到登录页面
  if (!session?.user) {
    redirect('/login?callbackUrl=/dashboard');
  }
  
  return <DashboardLayout>{children}</DashboardLayout>;
} 