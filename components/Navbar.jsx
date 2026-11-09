"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";
import { FALLBACK_AVATAR } from "@/lib/api";
import SafeImg from "./SafeImg";
import ThemeToggle from "./ThemeToggle";
import Icon from "./Icons";
import { Logo } from "./Heads";
const MENU = [["/create-event", "Create Event", "plus"], ["/manage-events", "Manage Events", "edit"], ["/joined-events", "Joined Events", "checkc"], ["/profile", "My Profile", "user"]];
export default function Navbar() {
  const { data: session, isPending } = authClient.useSession();
  const router = useRouter();
  const path = usePathname();
  const user = session?.user;
  const logout = async () => { await authClient.signOut(); toast.success("You are logged out."); router.push("/"); };
  const close = () => document.activeElement?.blur();
  const active = path === "/events" ? "text-primary" : "";
  return (
    <header className="bg-base-100/95 backdrop-blur border-b border-base-300 sticky top-0 z-40">
      <div className="navbar max-w-6xl mx-auto px-3 sm:px-4 min-h-16">
        <div className="navbar-start">
          <Link href="/" className="flex items-center gap-2.5"><Logo />
            <span className="leading-tight"><span className="block text-xl font-extrabold">Neighbourly</span><span className="block text-[10px] font-semibold tracking-widest uppercase opacity-60">Community Care</span></span></Link>
        </div>
        <div className="navbar-center hidden sm:flex"><Link href="/events" className={`btn btn-ghost btn-sm ${active}`}><Icon n="calendar" />Upcoming Events</Link></div>
        <div className="navbar-end gap-1 sm:gap-2">
          <Link href="/events" className="btn btn-ghost btn-sm sm:hidden" aria-label="Upcoming Events"><Icon n="calendar" className="w-5 h-5" /></Link>
          <ThemeToggle />
          {isPending ? <span className="skeleton w-10 h-10 rounded-full" /> : user ? (
            <>
              <div className="dropdown dropdown-end">
                <div tabIndex={0} role="button" className="flex items-center gap-1 cursor-pointer">
                  <div className="avatar tooltip tooltip-bottom" data-tip={user.name}><div className="w-9 rounded-full ring-2 ring-primary/30"><SafeImg src={user.image} fallback={FALLBACK_AVATAR} alt={user.name} /></div></div>
                </div>
                <ul tabIndex={0} className="dropdown-content menu bg-base-100 rounded-box z-50 w-60 p-2 shadow-lg border border-base-300 mt-3">
                  <li className="px-3 py-2 pointer-events-none"><span className="block p-0"><span className="block font-bold">{user.name}</span><span className="block text-xs opacity-60 break-all">{user.email}</span></span></li>
                  {MENU.map(([h, l, i]) => <li key={h}><Link href={h} onClick={close}><Icon n={i} className="w-4 h-4 text-primary" />{l}</Link></li>)}
                  <li className="sm:hidden"><button onClick={logout} className="text-error"><Icon n="logout" />Logout</button></li>
                </ul>
              </div>
              <button onClick={logout} className="btn btn-sm btn-outline btn-error hidden sm:inline-flex"><Icon n="logout" />Logout</button>
            </>
          ) : <Link href="/login" className="btn btn-primary btn-sm"><Icon n="login" />Login</Link>}
        </div>
      </div>
    </header>
  );
}
