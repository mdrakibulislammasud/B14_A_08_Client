"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import PrivateRoute from "@/components/PrivateRoute";
import EventForm from "@/components/EventForm";
import Icon from "@/components/Icons";
import { api } from "@/lib/api";
import { authClient } from "@/lib/auth-client";
export default function CreateEvent() {
  const router = useRouter();
  const { data: session } = authClient.useSession();
  const create = async (f) => {
    try { await api("/events", { method: "POST", body: JSON.stringify(f) }, true); toast.success("Event created successfully!"); router.push("/events"); }
    catch (e) { toast.error(e.message); }
  };
  return (<PrivateRoute><div className="max-w-2xl mx-auto px-4 py-10">
    <Link href="/events" className="inline-flex items-center gap-1.5 text-sm opacity-70 hover:text-primary mb-4"><Icon n="left" />Back to Upcoming Events</Link>
    <div className="surface p-6 md:p-8">
      <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary bg-primary/10 rounded-full px-3 py-1 mb-3"><Icon n="heart" className="w-3.5 h-3.5" />Social Service Drive</span>
      <h1 className="text-2xl md:text-3xl font-extrabold">Create a Community Event</h1>
      <p className="text-sm opacity-70 mt-1 mb-6">Organize a relief effort, environmental clean-up or community support drive.</p>
      <EventForm onSubmit={create} label="Publish Event" email={session?.user?.email} />
    </div></div></PrivateRoute>);
}
