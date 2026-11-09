"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
// Waits for the session to load first, so a logged-in user is never sent to /login on reload.
export default function PrivateRoute({ children }) {
  const { data: session, isPending } = authClient.useSession();
  const router = useRouter();
  useEffect(() => { if (!isPending && !session) router.replace("/login"); }, [isPending, session, router]);
  if (isPending || !session) return <div className="max-w-6xl mx-auto p-8"><div className="skeleton h-64 w-full" /></div>;
  return children;
}
