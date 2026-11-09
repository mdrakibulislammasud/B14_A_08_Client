"use client";
import { use, useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { api, fmtDay, isUpcoming, FALLBACK_AVATAR } from "@/lib/api";
import { typeColor } from "@/lib/constants";
import { authClient } from "@/lib/auth-client";
import SafeImg from "@/components/SafeImg";
import Icon from "@/components/Icons";
const GUIDE = ["Please arrive 15 minutes before the scheduled time at the designated location.", "Wear comfortable clothing suitable for physical work and distribution.", "Bring any pre-coordinated supplies or items if requested by the organiser."];
export default function EventDetails({ params }) {
  const { id } = use(params);
  const [event, setEvent] = useState(null);
  const [status, setStatus] = useState("loading");
  const [joined, setJoined] = useState(false);
  const [busy, setBusy] = useState(false);
  const { data: session } = authClient.useSession();
  const router = useRouter();
  const email = session?.user?.email;
  const load = useCallback(() => api(`/events/${id}`).then((e) => { setEvent(e); setStatus("ok"); }).catch(() => setStatus("missing")), [id]);
  useEffect(() => { load(); }, [load]);
  useEffect(() => { if (!email) { setJoined(false); return; } api(`/joins/check/${id}`, {}, true).then((d) => setJoined(d.joined)).catch(() => {}); }, [email, id]);
  const join = async () => {
    if (!session) { toast.error("Log in to join this event."); return router.push("/login"); }
    setBusy(true);
    try { await api("/joins", { method: "POST", body: JSON.stringify({ eventId: id }) }, true); setJoined(true); toast.success("You joined this event!"); load(); }
    catch (e) { toast.error(e.message); } finally { setBusy(false); }
  };
  const leave = async () => {
    setBusy(true);
    try { await api(`/joins/${id}`, { method: "DELETE" }, true); setJoined(false); toast.success("You left this event."); load(); }
    catch (e) { toast.error(e.message); } finally { setBusy(false); }
  };
  const share = async () => { try { await navigator.clipboard.writeText(window.location.href); toast.success("Event link copied!"); } catch { toast.error("Could not copy the link."); } };
  if (status === "loading") return <div className="max-w-4xl mx-auto p-8"><div className="skeleton h-96 w-full rounded-2xl" /></div>;
  if (status === "missing") return (<div className="max-w-xl mx-auto px-4 py-24 text-center"><h1 className="text-3xl font-extrabold mb-3">Event not found</h1><p className="mb-6 opacity-70">This event may have been removed by its organiser.</p><Link href="/events" className="btn btn-primary">See upcoming events</Link></div>);
  const over = !isUpcoming(event.date);
  const n = event.joinCount ?? 0;
  return (<div className="max-w-4xl mx-auto px-4 py-10">
    <Link href="/events" className="inline-flex items-center gap-1.5 text-sm opacity-70 hover:text-primary mb-4"><Icon n="left" />Back to Upcoming Events</Link>
    <div className="surface overflow-hidden">
      <div className="relative h-64 md:h-80">
        <SafeImg src={event.thumbnail} alt={event.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        <span className={`absolute top-4 left-4 inline-flex items-center gap-1 text-xs font-semibold bg-white/95 rounded-full px-3 py-1 ${typeColor(event.type)}`}><Icon n="tag" className="w-3 h-3" />{event.type}</span>
        <div className="absolute bottom-5 left-5 right-5 text-white"><h1 className="text-2xl md:text-4xl font-extrabold leading-tight">{event.title}</h1>
          <p className="mt-2 text-sm flex flex-wrap gap-x-4 gap-y-1"><span className="inline-flex items-center gap-1.5"><Icon n="pin" />{event.location}</span><span className="inline-flex items-center gap-1.5"><Icon n="calendar" />{fmtDay(event.date)}</span></p></div>
      </div>
      <div className="m-4 md:m-6 rounded-xl border border-base-300 p-4 flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
        <div className="flex items-center gap-3"><span className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center"><Icon n="users" className="w-5 h-5" /></span>
          <div><p className="font-bold text-sm">{n} {n === 1 ? "Volunteer" : "Volunteers"} Joined</p><p className="text-xs opacity-60">{joined ? "You are confirmed for this initiative" : "Join to help this initiative"}</p></div></div>
        <div className="flex items-center gap-2">
          <button onClick={share} className="btn btn-ghost btn-sm btn-circle border border-base-300" aria-label="Copy event link"><Icon n="share" /></button>
          {over ? <button className="btn btn-sm" disabled>This event has ended</button>
            : joined ? <button onClick={leave} disabled={busy} className="btn btn-primary btn-sm"><Icon n="checkc" />{busy ? "Please wait..." : "Joined (Click to Leave)"}</button>
            : <button onClick={join} disabled={busy} className="btn btn-primary btn-sm">{busy ? "Joining..." : "Join Event"}</button>}</div>
      </div>
      <div className="px-4 md:px-6 pb-6 grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2">
          <h2 className="text-lg font-bold mb-2">About this Social Initiative</h2>
          <p className="opacity-80 leading-relaxed whitespace-pre-line">{event.description}</p>
          <h3 className="text-xs font-bold tracking-widest uppercase mt-6 mb-3 opacity-70">Volunteer Guidelines</h3>
          <ul className="space-y-2 text-sm opacity-80">{GUIDE.map((g) => <li key={g} className="flex gap-2"><Icon n="check" className="w-4 h-4 mt-0.5 text-primary" />{g}</li>)}</ul>
        </div>
        <aside className="space-y-4">
          <div className="rounded-xl border border-base-300 p-4"><h3 className="text-xs font-bold tracking-widest uppercase opacity-70 mb-3">Initiative Organizer</h3>
            <div className="flex items-center gap-3"><span className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center"><Icon n="user" className="w-5 h-5" /></span>
              <p className="font-semibold text-sm">{event.creatorName || "Community organiser"}</p></div>
            <p className="mt-3 text-xs text-primary flex items-center gap-1.5"><Icon n="shield" className="w-3.5 h-3.5" />Verified platform member</p></div>
          <div className="rounded-xl border border-base-300 p-4"><h3 className="text-xs font-bold tracking-widest uppercase opacity-70 mb-3">Confirmed Volunteers ({n})</h3>
            {event.volunteers?.length ? <ul className="space-y-2">{event.volunteers.map((v, i) => <li key={i} className="flex items-center gap-2 text-sm"><span className="avatar"><span className="w-6 rounded-full"><SafeImg src={v.image} fallback={FALLBACK_AVATAR} alt="" /></span></span>{v.name}</li>)}</ul> : <p className="text-sm opacity-60">No volunteers yet. Be the first to join.</p>}</div>
        </aside>
      </div>
    </div></div>);
}
