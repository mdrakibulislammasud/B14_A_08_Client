"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import PrivateRoute from "@/components/PrivateRoute";
import EventCard from "@/components/EventCard";
import CardSkeletons from "@/components/Skeletons";
import Icon from "@/components/Icons";
import { PageHead } from "@/components/Heads";
import { api, fmtStamp } from "@/lib/api";
import { authClient } from "@/lib/auth-client";
export default function JoinedEvents() {
  const { data: session } = authClient.useSession();
  const [events, setEvents] = useState(null);
  const email = session?.user?.email;
  useEffect(() => { if (email) api("/joins", {}, true).then((d) => setEvents([...d].sort((a, b) => String(a.date).localeCompare(String(b.date))))).catch((e) => { toast.error(e.message); setEvents([]); }); }, [email]);
  return (<PrivateRoute><div className="max-w-6xl mx-auto px-4 py-10">
    <PageHead badge="My Volunteer Commitments" icon="checkc" title="Joined Events" sub="Here are all the social development and community service drives you have signed up for, sorted by event date." />
    {!events ? <CardSkeletons /> : events.length === 0 ?
      <div className="surface py-16 px-4 text-center"><h2 className="text-xl font-bold">You haven't joined any events yet</h2><p className="text-sm opacity-70 mt-1 mb-5">Find a drive near you and sign up as a volunteer.</p><Link href="/events" className="btn btn-primary btn-sm">Browse Upcoming Events</Link></div> :
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{events.map((e) => <EventCard key={e._id} event={e} footer={<span className="leading-snug">You have signed up as a confirmed volunteer for this initiative.{e.joinedAt && <span className="block font-semibold text-primary mt-0.5">Joined {fmtStamp(e.joinedAt)}</span>}</span>} />)}</div>}</div></PrivateRoute>);
}
