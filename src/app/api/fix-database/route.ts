import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { UserRole } from '@prisma/client';

export async function GET() {
  try {
    // 1. 添加测试管理员用户（如果不存在）
    const adminEmail = 'admin@example.com';
    const existingAdmin = await prisma.user.findUnique({
      where: { email: adminEmail }
    });

    if (!existingAdmin) {
      await prisma.user.create({
        data: {
          name: '管理员',
          email: adminEmail,
          password: '$2a$12$iQRYmwUMZX/ftmQ2oXO7/.MmSQrnbV1Hf/0YDZ6cJR0KAHwvBUMqO', // 密码: admin123
          role: 'ADMIN',
        }
      });
      console.log('创建了管理员用户');
    }

    // 2. 查找出所有没有角色的用户(如果有)
    // 注意: 由于Schema中User.role字段已设置默认值, 理论上不应该有没有角色的用户
    // 但为保险起见，仍做检查
    const usersToFix = await prisma.$queryRaw`
      SELECT id FROM users WHERE role IS NULL
    `;
    
    const userIdsToFix = (usersToFix as any[]).map(user => user.id);

    if (userIdsToFix.length > 0) {
      await prisma.user.updateMany({
        where: {
          id: {
            in: userIdsToFix
          }
        },
        data: {
          role: 'USER'
        }
      });
      console.log(`更新了 ${userIdsToFix.length} 个用户的角色`);
    }

    // 3. 检查文章作者是否存在
    const posts = await prisma.post.findMany({
      select: {
        id: true,
        authorId: true,
      }
    });

    // 提取唯一的作者ID（不使用Set展开）
    const authorIdSet = new Set<string>();
    posts.forEach(post => authorIdSet.add(post.authorId));
    const authorIds = Array.from(authorIdSet);
    
    const existingAuthors = await prisma.user.findMany({
      where: {
        id: {
          in: authorIds
        }
      },
      select: {
        id: true
      }
    });

    const existingAuthorIds = existingAuthors.map(author => author.id);
    const invalidPosts = posts.filter(post => !existingAuthorIds.includes(post.authorId));

    if (invalidPosts.length > 0) {
      console.log(`发现 ${invalidPosts.length} 篇文章的作者不存在`);
      
      // 如果存在管理员用户，将这些文章分配给管理员
      const adminUser = await prisma.user.findFirst({
        where: {
          role: UserRole.ADMIN
        },
        select: {
          id: true
        }
      });

      if (adminUser) {
        await prisma.post.updateMany({
          where: {
            id: {
              in: invalidPosts.map(post => post.id)
            }
          },
          data: {
            authorId: adminUser.id
          }
        });
        console.log(`已将无效作者的文章分配给管理员用户`);
      }
    }

    return NextResponse.json({
      success: true,
      message: '数据库修复完成',
      stats: {
        usersFixed: userIdsToFix.length,
        postsFixed: invalidPosts.length
      }
    });
  } catch (error) {
    console.error('数据库修复失败:', error);
    return NextResponse.json({ 
      success: false,
      error: (error as Error).message 
    }, { status: 500 });
  }
} 