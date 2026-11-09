"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import PrivateRoute from "@/components/PrivateRoute";
import EventForm from "@/components/EventForm";
import EventCard from "@/components/EventCard";
import CardSkeletons from "@/components/Skeletons";
import Icon from "@/components/Icons";
import { PageHead } from "@/components/Heads";
import { api } from "@/lib/api";
import { authClient } from "@/lib/auth-client";
export default function ManageEvents() {
  const { data: session } = authClient.useSession();
  const [events, setEvents] = useState(null);
  const [editing, setEditing] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [busy, setBusy] = useState(false);
  const email = session?.user?.email;
  const load = () => api("/my-events", {}, true).then(setEvents).catch((e) => { toast.error(e.message); setEvents([]); });
  useEffect(() => { if (email) load(); }, [email]);
  const update = async (f) => {
    try { await api(`/events/${editing._id}`, { method: "PUT", body: JSON.stringify(f) }, true); toast.success("Event updated."); setEditing(null); load(); }
    catch (e) { toast.error(e.message); }
  };
  const remove = async () => {
    setBusy(true);
    try { await api(`/events/${deleting._id}`, { method: "DELETE" }, true); toast.success("Event deleted."); setDeleting(null); load(); }
    catch (e) { toast.error(e.message); } finally { setBusy(false); }
  };
  return (<PrivateRoute><div className="max-w-6xl mx-auto px-4 py-10">
    <PageHead badge="Organizer Dashboard" icon="shield" title="Manage My Events" sub="View, edit and manage the social drives you have published. Only you have permission to edit or delete your created initiatives." action={<Link href="/create-event" className="btn btn-primary btn-sm self-start sm:self-auto"><Icon n="plus" />Create New Event</Link>} />
    {!events ? <CardSkeletons /> : events.length === 0 ? <div className="surface py-16 px-4 text-center"><h2 className="text-xl font-bold">You haven't created any events yet</h2><p className="text-sm opacity-70 mt-1 mb-5">Start a drive and invite your neighbours.</p><Link href="/create-event" className="btn btn-primary btn-sm">Create an Event</Link></div> :
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{events.map((e) => <EventCard key={e._id} event={e}>
        <Link href={`/events/${e._id}`} className="btn btn-ghost bg-base-200 btn-sm flex-1">View</Link>
        <button className="btn btn-outline btn-primary btn-sm" onClick={() => setEditing(e)}><Icon n="edit" />Edit</button>
        <button className="btn btn-error btn-outline btn-sm" onClick={() => setDeleting(e)}><Icon n="trash" />Delete</button></EventCard>)}</div>}
    {editing && <dialog className="modal modal-open"><div className="modal-box max-w-2xl"><h3 className="font-bold text-xl mb-4">Update event</h3>
      <EventForm initial={editing} onSubmit={update} label="Save changes" /><button className="btn btn-ghost mt-3" onClick={() => setEditing(null)}>Cancel</button></div></dialog>}
    {deleting && <dialog className="modal modal-open"><div className="modal-box"><h3 className="font-bold text-xl mb-2">Delete this event?</h3>
      <p className="opacity-80">“{deleting.title}” and everyone's sign-ups for it will be removed. This cannot be undone.</p>
      <div className="modal-action"><button className="btn btn-ghost" onClick={() => setDeleting(null)} disabled={busy}>Keep it</button><button className="btn btn-error" onClick={remove} disabled={busy}>{busy ? "Deleting..." : "Yes, delete"}</button></div></div></dialog>}
  </div></PrivateRoute>);
}
