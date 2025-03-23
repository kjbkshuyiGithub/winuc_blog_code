import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { authOptions } from '@/lib/auth';

// 文章表单验证架构
const postSchema = z.object({
  id: z.string(),
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

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;

    // 验证用户会话
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ message: '未授权' }, { status: 401 });
    }

    const sessionUserId = session.user.id;
    if (!sessionUserId) {
      return NextResponse.json({ message: '会话中没有有效的用户ID' }, { status: 401 });
    }

    console.log('API PUT - 会话用户ID:', sessionUserId);

    // 查找文章
    const existingPost = await prisma.post.findUnique({
      where: { id },
      include: { author: true },
    });

    if (!existingPost) {
      return NextResponse.json({ message: '文章不存在' }, { status: 404 });
    }

    // 检查权限 (只有作者本人可以编辑)
    if (existingPost.authorId !== sessionUserId) {
      console.error('权限错误: 用户无权编辑此文章', {
        articleAuthorId: existingPost.authorId,
        sessionUserId
      });
      return NextResponse.json({ message: '无权编辑此文章' }, { status: 403 });
    }

    // 处理表单数据
    const formData = await request.formData();
    
    // 提取基础字段
    const postData = {
      id: formData.get('id') as string,
      title: formData.get('title') as string,
      content: formData.get('content') as string,
      description: (formData.get('description') as string) || undefined,
      categoryId: (formData.get('categoryId') as string) || undefined,
      published: formData.get('published') as string,
      slug: formData.get('slug') as string,
    };

    console.log('更新文章数据:', { 
      id: postData.id,
      title: postData.title, 
      authorId: existingPost.authorId,
      published: postData.published,
      slug: postData.slug
    });

    // 验证数据
    const validationResult = postSchema.safeParse(postData);
    if (!validationResult.success) {
      const errors = validationResult.error.flatten();
      console.error('数据验证失败:', errors);
      return NextResponse.json(
        { message: '数据验证失败', errors },
        { status: 400 }
      );
    }

    // 验证标签
    const tagIds = formData.getAll('tags[]') as string[];
    console.log('标签IDs:', tagIds);

    // 提取封面图片 (处理上传的文件将在后续实现)
    const coverImage = formData.get('coverImage') as File | null;
    const removeCoverImage = formData.get('removeCoverImage') === 'true';
    
    // 生成更新对象
    const updateData = {
      title: postData.title,
      content: postData.content,
      description: postData.description ? postData.description : null,
      categoryId: postData.categoryId ? postData.categoryId : null,
      published: validationResult.data.published,
      slug: postData.slug,
      // 封面图片处理将在后续实现
    };

    // 更新文章
    const updatedPost = await prisma.post.update({
      where: { id },
      data: {
        ...updateData,
        tags: {
          set: [], // 先清除所有标签
          connect: tagIds.map(id => ({ id })), // 再连接新标签
        },
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

    console.log('文章更新成功:', updatedPost.id);

    // 重新验证页面
    revalidatePath('/blog');
    revalidatePath(`/blog/${updatedPost.slug}`);
    revalidatePath('/dashboard/posts');
    revalidatePath(`/dashboard/posts/${id}/edit`);

    return NextResponse.json(
      { message: '文章更新成功', post: updatedPost },
      { status: 200 }
    );
  } catch (error) {
    console.error('更新文章时出错:', error);
    return NextResponse.json(
      { message: '更新文章时发生错误', error: (error as Error).message },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;

    // 验证用户会话
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ message: '未授权' }, { status: 401 });
    }

    const sessionUserId = session.user.id;
    if (!sessionUserId) {
      return NextResponse.json({ message: '会话中没有有效的用户ID' }, { status: 401 });
    }

    console.log('API DELETE - 会话用户ID:', sessionUserId);

    // 查找文章
    const existingPost = await prisma.post.findUnique({
      where: { id },
      include: { author: true },
    });

    if (!existingPost) {
      return NextResponse.json({ message: '文章不存在' }, { status: 404 });
    }

    // 检查权限 (只有作者和管理员可以删除)
    const userRole = session.user.role;
    
    const isAuthor = existingPost.authorId === sessionUserId;
    const isAdmin = userRole === 'ADMIN';
    
    if (!isAuthor && !isAdmin) {
      console.error('权限错误: 用户无权删除此文章', {
        articleAuthorId: existingPost.authorId,
        sessionUserId,
        userRole
      });
      return NextResponse.json({ message: '无权删除此文章' }, { status: 403 });
    }

    // 删除文章 (包括关联的标签关系)
    await prisma.post.delete({
      where: { id },
    });

    console.log('文章删除成功:', id);

    // 重新验证页面
    revalidatePath('/blog');
    revalidatePath('/dashboard/posts');

    return NextResponse.json(
      { message: '文章已成功删除' },
      { status: 200 }
    );
  } catch (error) {
    console.error('删除文章时出错:', error);
    return NextResponse.json(
      { message: '删除文章时发生错误', error: (error as Error).message },
      { status: 500 }
    );
  }
} 