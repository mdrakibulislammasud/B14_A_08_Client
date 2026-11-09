"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";
import Icon from "./Icons";
import { Logo } from "./Heads";
const isUrl = (s) => { try { return /^https?:$/.test(new URL(s).protocol); } catch { return false; } };
export default function AuthForm({ mode }) {
  const reg = mode === "register";
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const [errors, setErrors] = useState({});
  const [busy, setBusy] = useState(false);
  const [show, setShow] = useState(false);
  const [pw, setPw] = useState("");
  useEffect(() => { if (!isPending && session && !busy) router.replace("/"); }, [isPending, session, busy, router]);
  const rules = [[/[A-Z]/.test(pw), "At least one uppercase letter (A-Z)"], [/[a-z]/.test(pw), "At least one lowercase letter (a-z)"], [pw.length >= 6, "Minimum 6 characters length"]];
  const submit = async (e) => {
    e.preventDefault();
    const f = Object.fromEntries(new FormData(e.target));
    const er = {};
    if (reg && !f.name.trim()) er.name = "Name is required.";
    if (!/^\S+@\S+\.\S+$/.test(f.email.trim())) er.email = "Enter a valid email.";
    if (reg && f.photoURL.trim() && !isUrl(f.photoURL.trim())) er.photoURL = "Enter a valid photo URL starting with http(s).";
    if (reg && !rules.every((r) => r[0])) er.password = "Password needs 6+ characters, an uppercase and a lowercase letter.";
    if (!reg && !f.password) er.password = "Password is required.";
    setErrors(er);
    if (Object.keys(er).length) return toast.error(Object.values(er)[0]);
    setBusy(true);
    try {
      const { error } = reg
        ? await authClient.signUp.email({ name: f.name.trim(), email: f.email.trim(), password: f.password, image: f.photoURL.trim() || undefined })
        : await authClient.signIn.email({ email: f.email.trim(), password: f.password });
      if (error) return toast.error(error.message || "Authentication failed.");
      toast.success(reg ? "Account created. Welcome!" : "Welcome back!");
      router.replace("/");
    } catch { toast.error("Something went wrong. Please try again."); }
    finally { setBusy(false); }
  };
  const google = () => authClient.signIn.social({ provider: "google", callbackURL: "/" });
  const Err = ({ k }) => errors[k] ? <span role="alert" className="text-error text-xs mt-1">{errors[k]}</span> : null;
  const Lb = ({ children }) => <span className="text-sm font-semibold mb-1.5">{children}</span>;
  return (<div className="px-4 py-12"><div className="surface max-w-md mx-auto p-6 md:p-8 shadow-md">
    <div className="text-center mb-6"><Logo className="w-12 h-12 mx-auto mb-3" /><h1 className="text-2xl font-extrabold">{reg ? "Create Account" : "Welcome Back"}</h1>
      <p className="text-sm opacity-70 mt-1">{reg ? "Join the community and start driving social change." : "Log in to join drives and manage your events."}</p></div>
    <form onSubmit={submit} className="grid gap-4" noValidate>
      {reg && <label className="flex flex-col"><Lb>Full Name</Lb><span className="field"><Icon n="user" className="w-4 h-4 opacity-50" /><input name="name" placeholder="Your full name" autoComplete="name" /></span><Err k="name" /></label>}
      <label className="flex flex-col"><Lb>Email Address</Lb><span className="field"><Icon n="mail" className="w-4 h-4 opacity-50" /><input name="email" type="email" placeholder="name@example.com" autoComplete="email" /></span><Err k="email" /></label>
      {reg && <label className="flex flex-col"><Lb>Profile Photo URL</Lb><span className="field"><Icon n="image" className="w-4 h-4 opacity-50" /><input name="photoURL" placeholder="https://images.unsplash.com/..." /></span>{errors.photoURL ? <Err k="photoURL" /> : <span className="text-xs opacity-60 mt-1">Optional. Leave empty for default avatar.</span>}</label>}
      <label className="flex flex-col"><Lb>Password</Lb><span className="field"><Icon n="lock" className="w-4 h-4 opacity-50" /><input name="password" type={show ? "text" : "password"} value={pw} onChange={(e) => setPw(e.target.value)} placeholder="••••••••" autoComplete={reg ? "new-password" : "current-password"} />
        <button type="button" onClick={() => setShow(!show)} className="text-xs font-semibold text-primary">{show ? "Hide" : "Show"}</button></span><Err k="password" /></label>
      {reg && <ul className="text-xs space-y-1 -mt-1">{rules.map(([ok, t]) => <li key={t} className={`flex items-center gap-2 ${ok ? "text-success" : "opacity-60"}`}><Icon n={ok ? "check" : "filterx"} className="w-3 h-3" />{t}</li>)}</ul>}
      <button disabled={busy} className="btn btn-primary w-full">{busy ? "Please wait..." : reg ? "Register" : "Login"}{!busy && <Icon n="right" />}</button>
      {!reg && <><div className="divider text-xs my-0">OR</div><button type="button" onClick={google} className="btn btn-outline w-full">Continue with Google</button></>}
    </form>
    <p className="mt-5 text-center text-sm opacity-80">{reg ? "Already have an account?" : "New here?"} <Link className="link link-primary font-semibold" href={reg ? "/login" : "/register"}>{reg ? "Login here" : "Create an account"}</Link></p>
  </div></div>);
}
