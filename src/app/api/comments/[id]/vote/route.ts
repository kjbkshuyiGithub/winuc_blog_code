import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/lib/auth';

// 此处处理评论的点赞/踩功能
// 由于原数据库模型中没有专门的表来存储点赞信息，这里先简化处理
// 后续可以添加CommentVote表来跟踪用户对评论的点赞情况

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // 1. 验证用户登录状态
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json(
        { message: '请先登录后再进行点赞' },
        { status: 401 }
      );
    }
    
    // 2. 获取评论ID和动作类型
    const commentId = params.id;
    const { action } = await request.json();
    
    if (!['like', 'dislike'].includes(action)) {
      return NextResponse.json(
        { message: '无效的操作类型' },
        { status: 400 }
      );
    }
    
    // 3. 验证评论存在
    const comment = await prisma.comment.findUnique({
      where: { id: commentId },
    });
    
    if (!comment) {
      return NextResponse.json(
        { message: '评论不存在' },
        { status: 404 }
      );
    }
    
    // 4. 模拟点赞/踩功能
    // 注意：这是临时实现，没有真正在数据库中记录用户的点赞
    // 后续应该添加CommentVote表来记录用户对评论的点赞/踩情况
    
    // 现在只是返回成功消息，但没有实际更新数据库
    // 在前端可以通过客户端状态模拟点赞/踩效果
    return NextResponse.json({
      message: action === 'like' ? '点赞成功' : '踩评论成功',
      commentId,
      action,
    });
    
    /* 
    后续完整的实现应该是这样的：
    
    // 检查用户是否已经对该评论进行过点赞/踩
    const existingVote = await prisma.commentVote.findUnique({
      where: {
        userId_commentId: {
          userId: session.user.id,
          commentId,
        },
      },
    });
    
    if (existingVote) {
      // 用户已经点过赞/踩，更新状态
      if (existingVote.type === action) {
        // 用户重复点击同一按钮，取消点赞/踩
        await prisma.commentVote.delete({
          where: {
            userId_commentId: {
              userId: session.user.id,
              commentId,
            },
          },
        });
        return NextResponse.json({
          message: action === 'like' ? '取消点赞' : '取消踩评论',
        });
      } else {
        // 用户改变点赞/踩状态
        await prisma.commentVote.update({
          where: {
            userId_commentId: {
              userId: session.user.id,
              commentId,
            },
          },
          data: {
            type: action,
          },
        });
      }
    } else {
      // 用户首次点赞/踩该评论
      await prisma.commentVote.create({
        data: {
          userId: session.user.id,
          commentId,
          type: action,
        },
      });
    }
    
    // 重新计算评论的点赞/踩数量
    const likeCount = await prisma.commentVote.count({
      where: {
        commentId,
        type: 'like',
      },
    });
    
    const dislikeCount = await prisma.commentVote.count({
      where: {
        commentId,
        type: 'dislike',
      },
    });
    
    return NextResponse.json({
      message: action === 'like' ? '点赞成功' : '踩评论成功',
      likes: likeCount,
      dislikes: dislikeCount,
    });
    */
  } catch (error) {
    console.error('处理评论点赞失败:', error);
    return NextResponse.json(
      { message: '处理评论点赞时出现系统错误', error: (error as Error).message },
      { status: 500 }
    );
  }
} 