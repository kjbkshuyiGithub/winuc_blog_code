import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import { compare } from "bcryptjs";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma) as any,
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30天
  },
  pages: {
    signIn: "/login",
    signOut: "/logout",
    error: "/login",
    newUser: "/register",
  },
  providers: [
    CredentialsProvider({
      name: "邮箱密码",
      credentials: {
        email: { label: "邮箱", type: "email" },
        password: { label: "密码", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email,
          },
        });

        if (!user || !user.password) {
          return null;
        }

        const isPasswordValid = await compare(credentials.password, user.password);

        if (!isPasswordValid) {
          return null;
        }

        // 日志记录登录成功的用户信息
        console.log("用户登录成功:", {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        });

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
        session.user.name = token.name as string;
        session.user.email = token.email as string;
        session.user.image = token.picture as string | null;
        session.user.role = token.role as string;
        
        // 日志记录会话信息 
        console.log("生成会话:", {
          userId: session.user.id,
          role: session.user.role
        });
      }
      return session;
    },
    async jwt({ token, user }) {
      // 初次登录时，将用户信息附加到token
      if (user) {
        token.id = user.id;
        token.role = user.role;
        
        // 日志记录JWT信息
        console.log("生成JWT令牌:", {
          userId: user.id,
          role: user.role
        });
      }
      return token;
    },
  },
  debug: process.env.NODE_ENV === "development",
}; 