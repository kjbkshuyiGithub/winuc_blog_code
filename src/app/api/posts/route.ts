import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
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
    // 1. 获取用户会话
    console.log("开始处理文章创建请求");
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      console.error('未授权: 用户未登录', session);
      return NextResponse.json(
        { message: '请先登录后再发布文章' },
        { status: 401 }
      );
    }
    
    // 2. 获取用户ID
    const userId = session.user.id;
    if (!userId) {
      console.error('会话中没有用户ID:', session);
      // 不再立即返回错误，尝试使用用户名查找用户
      if (session.user.email) {
        console.log(`尝试通过邮箱 ${session.user.email} 查找用户`);
        const userByEmail = await prisma.user.findUnique({
          where: { email: session.user.email },
          select: { id: true, name: true, role: true }
        });
        
        if (userByEmail) {
          console.log(`通过邮箱找到用户，ID: ${userByEmail.id}`);
          // 使用找到的用户ID继续处理请求
          const formData = await request.formData();
          return await processPostCreation(formData, userByEmail, session);
        }
      }
      
      return NextResponse.json(
        { message: '无法获取用户身份信息，请重新登录' },
        { status: 400 }
      );
    }
    
    console.log(`正在创建文章，用户ID: ${userId}, 用户: ${session.user.name || 'unknown'}`);
    
    // 3. 验证用户存在
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, name: true, role: true }
    });
    
    if (!user) {
      console.error(`找不到ID为 ${userId} 的用户，尝试使用会话信息`);
      // 尝试通过邮箱查找用户
      if (session.user.email) {
        const userByEmail = await prisma.user.findUnique({
          where: { email: session.user.email },
          select: { id: true, name: true, role: true }
        });
        
        if (userByEmail) {
          console.log(`通过邮箱找到用户，ID: ${userByEmail.id}`);
          // 使用找到的用户ID继续处理请求
          const formData = await request.formData();
          return await processPostCreation(formData, userByEmail, session);
        }
      }
      
      return NextResponse.json(
        { message: '用户账户不存在或已被删除' },
        { status: 404 }
      );
    }
    
    console.log("已找到有效用户:", user);
    
    // 4. 处理表单数据
    const formData = await request.formData();
    return await processPostCreation(formData, user, session);
    
  } catch (error) {
    console.error('创建文章失败:', error);
    return NextResponse.json(
      { message: '创建文章时出现系统错误', error: (error as Error).message },
      { status: 500 }
    );
  }
}

// 提取文章创建逻辑为单独的函数
async function processPostCreation(
  formData: FormData, 
  user: { id: string, name: string | null, role: string | any },
  session: any
) {
  const postData = {
    title: formData.get('title') as string,
    content: formData.get('content') as string,
    description: (formData.get('description') as string) || undefined,
    categoryId: (formData.get('categoryId') as string) || undefined,
    published: formData.get('published') as string,
    slug: formData.get('slug') as string,
  };
  
  console.log('文章数据:', {
    title: postData.title,
    userId: user.id,
    userName: user.name || 'unnamed',
    published: postData.published,
  });
  
  // 5. 验证数据
  const validationResult = postSchema.safeParse(postData);
  if (!validationResult.success) {
    const errors = validationResult.error.flatten();
    console.error('数据验证失败:', errors);
    return NextResponse.json(
      { message: '提交的文章数据无效', errors },
      { status: 400 }
    );
  }
  
  // 6. 获取标签
  const tagIds = formData.getAll('tags[]') as string[];
  console.log('标签IDs:', tagIds);
  
  // 7. 创建文章
  const post = await prisma.post.create({
    data: {
      title: postData.title,
      content: postData.content,
      description: postData.description || "",
      categoryId: postData.categoryId || null,
      published: validationResult.data.published,
      slug: postData.slug,
      authorId: user.id, // 使用验证过的用户ID
      tags: tagIds.length > 0 ? {
        connect: tagIds.map(id => ({ id }))
      } : undefined,
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
  
  console.log('文章创建成功:', post.id);
  
  // 8. 重新验证页面
  revalidatePath('/blog');
  revalidatePath(`/blog/${post.slug}`);
  revalidatePath('/dashboard/posts');
  
  return NextResponse.json(
    { message: '文章创建成功', post },
    { status: 201 }
  );
}