"use client";
import Link from "next/link";
import { fmtDay } from "@/lib/api";
import { typeColor } from "@/lib/constants";
import SafeImg from "./SafeImg";
import Icon from "./Icons";
// `footer` replaces the organiser line (used on the Joined page); `children` replaces the View button (Manage page).
export default function EventCard({ event, children, footer }) {
  return (
    <div className="surface h-full flex flex-col overflow-hidden hover:shadow-md transition-shadow">
      <div className="relative h-48 shrink-0">
        <SafeImg src={event.thumbnail} alt={event.title} className="w-full h-48 object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        <span className={`absolute top-3 left-3 inline-flex items-center gap-1 text-xs font-semibold bg-white/95 rounded-full px-2.5 py-1 ${typeColor(event.type)}`}><Icon n="tag" className="w-3 h-3" />{event.type}</span>
        <span className="absolute bottom-3 left-3 inline-flex items-center gap-1.5 text-xs font-semibold text-white bg-black/45 rounded-full px-2.5 py-1"><Icon n="calendar" className="w-3 h-3" />{fmtDay(event.date)}</span>
      </div>
      <div className="p-4 flex flex-col flex-1">
        <h3 className="text-lg font-bold leading-snug line-clamp-1">{event.title}</h3>
        <p className="flex items-center gap-1.5 text-sm text-primary mt-1 font-medium"><Icon n="pin" className="w-3.5 h-3.5" /><span className="line-clamp-1">{event.location}</span></p>
        <p className="text-sm opacity-70 mt-2 line-clamp-2 min-h-10">{event.description}</p>
        <div className="border-t border-base-300 mt-3 pt-3 text-xs opacity-80 min-h-10 flex items-center gap-1.5">
          {footer || <><Icon n="user" className="w-3.5 h-3.5" />{event.creatorName || "Community organiser"}</>}</div>
        <div className="mt-auto pt-3 flex gap-2">
          {children || <Link href={`/events/${event._id}`} className="btn btn-primary btn-sm w-full">View Event<Icon n="right" /></Link>}</div>
      </div>
    </div>
  );
}
