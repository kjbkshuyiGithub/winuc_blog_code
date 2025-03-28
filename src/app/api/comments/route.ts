import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { authOptions } from '@/lib/auth';

// 评论表单验证架构
const commentSchema = z.object({
  content: z.string().min(1, '评论内容不能为空').max(1000, '评论不能超过1000个字符'),
  postId: z.string(),
  parentId: z.string().optional(),
});

// 获取特定文章的评论列表
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    
    // 必须提供文章ID
    const postId = searchParams.get('postId');
    if (!postId) {
      return NextResponse.json(
        { message: '缺少文章ID参数' },
        { status: 400 }
      );
    }
    
    // 获取顶级评论
    const comments = await prisma.comment.findMany({
      where: {
        postId,
        parentId: null, // 只获取顶级评论
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
        replies: {
          include: {
            author: {
              select: {
                id: true,
                name: true,
                image: true,
              },
            },
          },
          orderBy: {
            createdAt: 'asc',
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    
    return NextResponse.json({ comments });
  } catch (error) {
    console.error('获取评论列表失败:', error);
    return NextResponse.json(
      { message: '获取评论列表失败', error: (error as Error).message },
      { status: 500 }
    );
  }
}

// 创建新评论
export async function POST(request: NextRequest) {
  try {
    // 1. 获取用户会话
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json(
        { message: '请先登录后再发表评论' },
        { status: 401 }
      );
    }
    
    // 2. 验证用户存在
    const userId = session.user.id;
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });
    
    if (!user) {
      return NextResponse.json(
        { message: '用户账户不存在或已被删除' },
        { status: 404 }
      );
    }
    
    // 3. 解析和验证请求数据
    const data = await request.json();
    const validationResult = commentSchema.safeParse(data);
    
    if (!validationResult.success) {
      return NextResponse.json(
        { message: '评论数据无效', errors: validationResult.error.errors },
        { status: 400 }
      );
    }
    
    // 4. 验证文章存在
    const post = await prisma.post.findUnique({
      where: { id: validationResult.data.postId },
    });
    
    if (!post) {
      return NextResponse.json(
        { message: '评论的文章不存在' },
        { status: 404 }
      );
    }
    
    // 5. 如果有父评论，验证其存在
    if (validationResult.data.parentId) {
      const parentComment = await prisma.comment.findUnique({
        where: { id: validationResult.data.parentId },
      });
      
      if (!parentComment) {
        return NextResponse.json(
          { message: '回复的评论不存在' },
          { status: 404 }
        );
      }
      
      // 确保父评论属于同一篇文章
      if (parentComment.postId !== validationResult.data.postId) {
        return NextResponse.json(
          { message: '回复的评论不属于指定文章' },
          { status: 400 }
        );
      }
    }
    
    // 6. 创建评论
    const comment = await prisma.comment.create({
      data: {
        content: validationResult.data.content,
        authorId: userId,
        postId: validationResult.data.postId,
        parentId: validationResult.data.parentId || null,
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
    });
    
    // 7. 更新缓存
    revalidatePath(`/blog/${post.slug}`);
    
    return NextResponse.json({
      message: '评论发表成功',
      comment,
    });
  } catch (error) {
    console.error('创建评论失败:', error);
    return NextResponse.json(
      { message: '创建评论时出现系统错误', error: (error as Error).message },
      { status: 500 }
    );
  }
} 