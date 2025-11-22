import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import GitHubProvider from "next-auth/providers/github"
import { compare } from "bcryptjs"
import prisma from "@/lib/prisma"

export const authOptions = {
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      profile(profile) {
        return {
          id: profile.id.toString(),
          name: profile.name || profile.login,
          email: profile.email,
          image: profile.avatar_url,
        }
      }
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Пароль", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        })

        if (!user) return null

        const isValid = await compare(credentials.password, user.password)
        if (!isValid) return null

        return { id: user.id, name: user.name, email: user.email }
      },
    }),
  ],
  session: { strategy: "jwt" },
  secret: process.env.NEXTAUTH_SECRET,
  pages: { signIn: "/login" },
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account.provider === "github") {
        try {
          let existingUser = await prisma.user.findFirst({
            where: {
              OR: [
                { githubId: profile.id.toString() },
                { email: profile.email }
              ]
            }
          })

          if (!existingUser) {
            existingUser = await prisma.user.create({
              data: {
                email: profile.email,
                name: profile.name || profile.login,
                githubId: profile.id.toString(), 
                avatar: profile.avatar_url,   
                password: ""
              },
            })
            console.log('Created new GitHub user with githubId:', profile.id)
          } else if (!existingUser.githubId) {
            existingUser = await prisma.user.update({
              where: { id: existingUser.id },
              data: {
                githubId: profile.id.toString(), 
                avatar: profile.avatar_url
              }
            })
            console.log('Updated existing user with githubId:', profile.id)
          } else {
            console.log('User already has githubId:', existingUser.githubId)
          }

          user.id = existingUser.id  
          
        } catch (error) {
          console.error("Error in GitHub signIn:", error)
          return false
        }
      }
      return true
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = Number(user.id)
      }
      return token
    },
    async session({ session, token }) {
      if (token?.id) {
        session.user.id = Number(token.id)
      }
      return session
    },
  },
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }