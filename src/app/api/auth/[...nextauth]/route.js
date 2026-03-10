import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Имэйл болон нууц үгээ оруулна уу.");
        }

        try {
          const res = await fetch("http://localhost:8086/api/auth/login", {
            method: "POST",
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password,
            }),
            headers: { "Content-Type": "application/json" },
          });

          const response = await res.json();

          if (res.ok && response.result) {
            return {
              id: response.data.id,
              name: response.data.username,
              email: credentials.email,
              accessToken: response.data.token,
            };
          }

          throw new Error(
            response.message || "Нэвтрэх нэр эсвэл нууц үг буруу.",
          );
        } catch (error) {
          throw new Error(error.message || "Сервертэй холбогдож чадсангүй.");
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.accessToken = user.accessToken;
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.accessToken = token.accessToken;
        session.user.id = token.id;
        session.user.name = token.name;
        session.user.email = token.email || token.sub;
      }
      return session;
    },
  },
  pages: {
    signIn: "/auth/signin",
    error: "/auth/signin",
  },

  secret: process.env.NEXTAUTH_SECRET || "your-development-secret-key-12345",
  session: {
    strategy: "jwt",
    maxAge: 2 * 60, // 2 min
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
