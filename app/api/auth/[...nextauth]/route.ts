import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import connect from "@/db";
import User from "@/models/users";

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },

      async authorize(credentials) {
        await connect();

        const user = await User.findOne({ email: credentials?.email });
        if (!user) throw new Error("No user found with this email");

        const isValid = await bcrypt.compare(credentials!.password, user.password);
        if (!isValid) throw new Error("Invalid password");

        return {
          id: user._id.toString(),
          name: user.fullName,
          email: user.email,
          isAdmin: user.email === process.env.ADMIN_EMAIL?.replace(/"/g, ''),
        };
      },
    }),
  ],

  session: {
    strategy: "jwt",
  },

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.email = user.email;
        token.isAdmin = user.isAdmin || (user.email === process.env.ADMIN_EMAIL?.replace(/"/g, ''));
      }
      return token;
    },

    async session({ session, token }) {
      if (token && session.user) {
        session.user = {
          ...session.user,
          email: token.email as string,
          isAdmin: token.isAdmin as boolean,
        };
      }
      return session;
    },
  },

  pages: {
    signIn: "/signin",
  },

  secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };
