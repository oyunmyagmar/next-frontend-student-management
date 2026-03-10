import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      // Frontend-ээс (SignIn.js) дамжуулсан email, password энд орж ирнэ
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
            // Буцааж буй объект 'user' хувьсагчид хадгалагдана
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
      }
      return token;
    },
    // 2. Session callback: useSession() ашиглан Frontend-ээс өгөгдөл авахад ажиллана
    async session({ session, token }) {
      if (token) {
        session.accessToken = token.accessToken;
        session.user.id = token.id;
        session.user.name = token.name;
      }
      return session;
    },
  },
  // Нэвтрэх хуудас болон бусад auth хуудсуудын замыг зааж өгнө
  pages: {
    signIn: "/auth/signin",
    error: "/auth/signin", // Алдаа гарвал буцаад нэвтрэх хуудас руу шиднэ
  },
  // JWT нууцлалын тохиргоо (Бодит төсөлд заавал .env-ээс авна)
  secret: process.env.NEXTAUTH_SECRET || "your-development-secret-key-12345",
  session: {
    strategy: "jwt", // Бид JWT ашиглаж байгаа тул 'jwt' гэж зааж өгнө
    maxAge: 24 * 60 * 60, // 24 цаг
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
