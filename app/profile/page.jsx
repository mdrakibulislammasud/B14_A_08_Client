"use client";
import { useState } from "react";
import toast from "react-hot-toast";
import PrivateRoute from "@/components/PrivateRoute";
import SafeImg from "@/components/SafeImg";
import { FALLBACK_AVATAR } from "@/lib/api";
import { authClient } from "@/lib/auth-client";
const isUrl = (s) => { try { return /^https?:$/.test(new URL(s).protocol); } catch { return false; } };
export default function Profile() {
  const { data: session } = authClient.useSession();
  const user = session?.user;
  const [busy, setBusy] = useState(false);
  const [errors, setErrors] = useState({});
  const save = async (e) => {
    e.preventDefault();
    const f = Object.fromEntries(new FormData(e.target));
    const er = {};
    if (f.name.trim().length < 2) er.name = "Name needs at least 2 characters.";
    if (f.image.trim() && !isUrl(f.image.trim())) er.image = "Enter a valid photo URL starting with http(s).";
    setErrors(er);
    if (Object.keys(er).length) return toast.error(Object.values(er)[0]);
    setBusy(true);
    try {
      const { error } = await authClient.updateUser({ name: f.name.trim(), image: f.image.trim() || null });
      if (error) toast.error(error.message || "Could not update your profile.");
      else toast.success("Profile updated.");
    } catch { toast.error("Could not update your profile."); } finally { setBusy(false); }
  };
  return (<PrivateRoute><div className="max-w-md mx-auto px-4 py-12"><h1 className="text-3xl font-extrabold text-center mb-6">My Profile</h1>
    {user && <>
      <div className="flex flex-col items-center mb-6"><div className="avatar"><div className="w-24 rounded-full"><SafeImg src={user.image} fallback={FALLBACK_AVATAR} alt={user.name} /></div></div>
        <p className="mt-3 font-semibold">{user.name}</p><p className="opacity-70 text-sm">{user.email}</p></div>
      <form key={`${user.name}|${user.image}`} onSubmit={save} className="grid gap-4" noValidate>
        <label className="flex flex-col">Name<input name="name" defaultValue={user.name} className="input input-bordered" />{errors.name && <span role="alert" className="text-error text-sm">{errors.name}</span>}</label>
        <label className="flex flex-col">Photo URL<input name="image" defaultValue={user.image || ""} className="input input-bordered" placeholder="https://example.com/me.jpg" />{errors.image && <span role="alert" className="text-error text-sm">{errors.image}</span>}</label>
        <label className="flex flex-col">Email<input value={user.email} disabled className="input input-bordered" /></label>
        <button disabled={busy} className="btn btn-primary">{busy ? "Saving..." : "Save changes"}</button>
      </form></>}
  </div></PrivateRoute>);
}
