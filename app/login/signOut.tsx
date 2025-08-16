import { signOut } from "next-auth/react";

<button onClick={() => signOut({ callbackUrl: "/login" })}>Sign out</button>
