import NextAuth from "next-auth";
import { authOptions } from "fugue-state-ui/constants/authOptions";
const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
