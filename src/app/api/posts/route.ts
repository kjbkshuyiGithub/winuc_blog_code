import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { authOptions } from '@/lib/auth';

// 文章表单验证架构
const postSchema = z.object({
  title: z.string().min(2, '标题至少需要2个字符').max(100, '标题不能超过100个字符'),
  content: z.string().min(10, '内容至少需要10个字符'),
  description: z.string().optional(),
  categoryId: z.string().optional(),
  published: z.preprocess(
    (val) => val === 'true' || val === true,
    z.boolean().default(false)
  ),
  slug: z.string(),
});

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    
    // 获取过滤参数
    const category = searchParams.get('category');
    const tag = searchParams.get('tag');
    const search = searchParams.get('search');
    const userId = searchParams.get('userId');
    
    // 分页参数
    const limitParam = searchParams.get('limit');
    const skipParam = searchParams.get('skip');
    
    const limit = limitParam ? parseInt(limitParam) : 10;
    const skip = skipParam ? parseInt(skipParam) : 0;
    
    // 构建查询条件
    const whereClause: any = {};
    
    // 只返回已发布的文章，除非指定了userId
    if (userId) {
      whereClause.authorId = userId;
    } else {
      whereClause.published = true;
    }
    
    if (category) {
      whereClause.category = {
        slug: category,
      };
    }
    
    if (tag) {
      whereClause.tags = {
        some: {
          slug: tag,
        },
      };
    }
    
    if (search) {
      whereClause.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { content: { contains: search, mode: 'insensitive' } },
      ];
    }
    
    // 获取文章列表
    const posts = await prisma.post.findMany({
      where: whereClause,
      include: {
        category: true,
        tags: true,
        author: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: limit,
      skip: skip,
    });
    
    // 获取总数
    const total = await prisma.post.count({ where: whereClause });
    
    return NextResponse.json({
      posts,
      pagination: {
        total,
        limit,
        skip,
        hasMore: skip + limit < total,
      },
    });
  } catch (error) {
    console.error('获取文章列表失败:', error);
    return NextResponse.json(
      { message: '获取文章列表失败', error: (error as Error).message },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // 1. 验证用户会话
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      console.error('未授权: 用户未登录');
      return NextResponse.json(
        { message: '未授权，请先登录' },
        { status: 401 }
      );
    }
    
    const sessionUserId = session.user.id;
    if (!sessionUserId) {
      console.error('未授权: 会话中没有有效的用户ID');
      return NextResponse.json(
        { message: '无法获取用户信息' },
        { status: 400 }
      );
    }
    
    console.log('API POST - 会话用户ID:', sessionUserId);
    
    // 2. 处理表单数据
    const formData = await request.formData();
    
    const postData = {
      title: formData.get('title') as string,
      content: formData.get('content') as string,
      description: (formData.get('description') as string) || undefined,
      categoryId: (formData.get('categoryId') as string) || undefined,
      published: formData.get('published') as string,
      slug: formData.get('slug') as string,
    };
    
    console.log('创建文章数据:', { 
      title: postData.title, 
      authorId: sessionUserId,
      published: postData.published,
      slug: postData.slug
    });
    
    // 3. 验证数据
    const validationResult = postSchema.safeParse(postData);
    if (!validationResult.success) {
      const errors = validationResult.error.flatten();
      console.error('数据验证失败:', errors);
      return NextResponse.json(
        { message: '数据验证失败', errors },
        { status: 400 }
      );
    }
    
    // 4. 验证用户
    const user = await prisma.user.findUnique({
      where: { id: sessionUserId },
    });
    
    if (!user) {
      console.error('找不到有效用户:', sessionUserId);
      return NextResponse.json(
        { message: '找不到有效用户' },
        { status: 400 }
      );
    }
    
    // 5. 验证标签
    const tagIds = formData.getAll('tags[]') as string[];
    console.log('标签IDs:', tagIds);
    
    // 6. 提取封面图片 (处理上传的文件将在后续实现)
    const coverImage = formData.get('coverImage') as File | null;
    
    // 7. 创建文章
    const createdPost = await prisma.post.create({
      data: {
        title: postData.title,
        content: postData.content,
        description: postData.description ? postData.description : null,
        categoryId: postData.categoryId ? postData.categoryId : null,
        published: validationResult.data.published,
        slug: postData.slug,
        authorId: sessionUserId, // 直接设置authorId
        tags: {
          connect: tagIds.map(id => ({ id })),
        },
        // 封面图片处理将在后续实现
      },
      include: {
        category: true,
        tags: true,
        author: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
    });
    
    console.log('文章创建成功:', createdPost.id);
    
    // 8. 重新验证页面
    revalidatePath('/blog');
    revalidatePath(`/blog/${createdPost.slug}`);
    revalidatePath('/dashboard/posts');
    
    return NextResponse.json(
      { message: '文章创建成功', post: createdPost },
      { status: 201 }
    );
  } catch (error) {
    console.error('创建文章失败:', error);
    return NextResponse.json(
      { message: '创建文章失败', error: (error as Error).message },
      { status: 500 }
    );
  }
}