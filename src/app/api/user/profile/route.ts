import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';

// 简单的 API 响应类型
type ApiResponse<T = any> = {
  success: boolean;
  message?: string;
  user?: T;
};

/**
 * 更新用户资料
 */
export async function PUT(request: Request): Promise<NextResponse<ApiResponse>> {
  try {
    // 获取认证会话
    const session = await getServerSession();
    
    // 检查用户是否已登录
    if (!session?.user?.email) {
      return NextResponse.json(
        { success: false, message: '未授权操作' },
        { status: 401 }
      );
    }
    
    // 获取表单数据
    const formData = await request.formData();
    const name = formData.get('name') as string;
    const bio = formData.get('bio') as string;
    const removeAvatar = formData.get('removeAvatar') as string;
    
    // 获取头像文件
    const avatarFile = formData.get('avatar') as File | null;
    let imageUrl = undefined;
    
    // 如果上传了新头像
    if (avatarFile) {
      // 在实际项目中，这里应该上传到云存储服务
      // 例如 Cloudinary、AWS S3 等
      // 以下是一个示例实现

      // 将文件转换为 Buffer
      const bytes = await avatarFile.arrayBuffer();
      const buffer = Buffer.from(bytes);
      
      // 生成唯一文件名
      const fileName = `avatar-${session.user.id}-${Date.now()}.${avatarFile.name.split('.').pop()}`;
      
      // 保存临时路径 (实际生产环境应使用云存储)
      // 以下仅作示例，实际上我们将模拟这个过程
      imageUrl = `/uploads/avatars/${fileName}`;
      
      // 模拟上传成功，设置头像 URL
      console.log(`[模拟] 头像已上传到: ${imageUrl}`);
    } else if (removeAvatar === 'true') {
      // 如果用户选择移除头像
      imageUrl = null;
    }
    
    // 在数据库中更新用户信息
    const updatedUser = await prisma.user.update({
      where: {
        email: session.user.email,
      },
      data: {
        name,
        bio,
        ...(imageUrl !== undefined && { image: imageUrl }), // 只有当设置了新头像或明确移除头像时才更新
      },
    });
    
    // 返回成功响应
    return NextResponse.json({
      success: true,
      message: '用户资料已成功更新',
      user: {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        image: updatedUser.image,
        bio: updatedUser.bio,
      },
    });
    
  } catch (error) {
    console.error('更新用户资料时出错:', error);
    return NextResponse.json(
      { success: false, message: '更新用户资料时发生错误' },
      { status: 500 }
    );
  }
} 