import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    
    // 获取查询参数
    const exclude = searchParams.get('exclude'); // 当前文章ID
    const categoryId = searchParams.get('category');
    const tagSlugs = searchParams.get('tags'); // 逗号分隔的标签slug
    const limitParam = searchParams.get('limit');
    
    const limit = limitParam ? parseInt(limitParam) : 3;
    
    if (!exclude) {
      return NextResponse.json(
        { message: '必须提供要排除的文章ID' },
        { status: 400 }
      );
    }
    
    // 构建查询条件
    let whereClause: any = {
      id: { not: exclude },
      published: true,
    };
    
    // 如果提供了分类ID，添加到查询条件
    if (categoryId) {
      whereClause.categoryId = categoryId;
    }
    
    // 如果提供了标签，添加到查询条件
    let tagWhere: any = undefined;
    if (tagSlugs) {
      const tags = tagSlugs.split(',');
      tagWhere = {
        some: {
          slug: { in: tags },
        },
      };
    }
    
    // 使用相同分类或标签来查找相关文章
    const relatedPosts = await prisma.post.findMany({
      where: {
        ...whereClause,
        ...(tagWhere ? { tags: tagWhere } : {}),
      },
      include: {
        category: true,
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
    });
    
    // 如果相关文章数量不够，再补充一些同分类的文章
    if (relatedPosts.length < limit && categoryId) {
      const additionalCount = limit - relatedPosts.length;
      const excludeIds = [exclude, ...relatedPosts.map(post => post.id)];
      
      const additionalPosts = await prisma.post.findMany({
        where: {
          id: { notIn: excludeIds },
          categoryId,
          published: true,
        },
        include: {
          category: true,
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
        take: additionalCount,
      });
      
      relatedPosts.push(...additionalPosts);
    }
    
    // 如果相关文章数量还是不够，再补充一些最新文章
    if (relatedPosts.length < limit) {
      const additionalCount = limit - relatedPosts.length;
      const excludeIds = [exclude, ...relatedPosts.map(post => post.id)];
      
      const latestPosts = await prisma.post.findMany({
        where: {
          id: { notIn: excludeIds },
          published: true,
        },
        include: {
          category: true,
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
        take: additionalCount,
      });
      
      relatedPosts.push(...latestPosts);
    }
    
    return NextResponse.json({ posts: relatedPosts });
  } catch (error) {
    console.error('获取相关文章失败:', error);
    return NextResponse.json(
      { message: '获取相关文章失败', error: (error as Error).message },
      { status: 500 }
    );
  }
} 