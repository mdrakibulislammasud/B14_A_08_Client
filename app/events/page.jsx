"use client";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import { api, isUpcoming, localToday } from "@/lib/api";
import { EVENT_TYPES } from "@/lib/constants";
import EventCard from "@/components/EventCard";
import CardSkeletons from "@/components/Skeletons";
import Icon from "@/components/Icons";
import { PageHead } from "@/components/Heads";
export default function Events() {
  const [events, setEvents] = useState(null);
  const [type, setType] = useState("All");
  const [q, setQ] = useState("");
  useEffect(() => { api(`/events?from=${localToday()}`).then((d) => setEvents(d.filter((e) => isUpcoming(e.date)))).catch((e) => { toast.error(e.message); setEvents([]); }); }, []);
  const shown = useMemo(() => {
    const s = q.trim().toLowerCase();
    return (events || []).filter((e) => (type === "All" || e.type === type) && (!s || `${e.title} ${e.location} ${e.description}`.toLowerCase().includes(s)));
  }, [events, type, q]);
  const reset = () => { setType("All"); setQ(""); };
  return (<div className="max-w-6xl mx-auto px-4 py-10">
    <PageHead badge="Future Community Drives" title="Upcoming Events" sub="Discover verified volunteer initiatives scheduled for upcoming dates. Past events are automatically excluded so you can focus on active drives that need support."
      action={<Link href="/create-event" className="btn btn-primary btn-sm self-start sm:self-auto"><Icon n="plus" />Create Event</Link>} />
    <div className="flex flex-col lg:flex-row gap-4 lg:items-center justify-between mb-8">
      <div className="flex flex-wrap gap-2">{["All", ...EVENT_TYPES].map((t) => <button key={t} onClick={() => setType(t)} className={`btn btn-xs sm:btn-sm rounded-full ${type === t ? "btn-primary" : "btn-ghost bg-base-100 border border-base-300"}`}>{t}</button>)}</div>
      <label className="field input-sm w-full lg:w-64"><Icon n="search" className="w-4 h-4 opacity-50" /><input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search events or areas..." aria-label="Search events" /></label>
    </div>
    {!events ? <CardSkeletons /> : shown.length === 0 ?
      <div className="surface py-16 px-4 text-center"><Icon n="filter" className="w-10 h-10 mx-auto opacity-40 mb-3" /><h2 className="text-xl font-bold">No Upcoming Events Found</h2>
        <p className="text-sm opacity-70 mt-1 mb-5">There are currently no upcoming events matching your selected filter or search term.</p>
        <div className="flex gap-3 justify-center flex-wrap"><button onClick={reset} className="btn btn-sm btn-outline">Reset Filters</button><Link href="/create-event" className="btn btn-sm btn-primary">Create New Event</Link></div></div> :
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{shown.map((e) => <EventCard key={e._id} event={e} />)}</div>}</div>);
}
