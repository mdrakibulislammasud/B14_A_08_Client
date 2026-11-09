"use client";
import { useRef, useState } from "react";
import { localToday, localTomorrow } from "@/lib/api";
import { EVENT_TYPES, PHOTO_PRESETS } from "@/lib/constants";
import Icon from "./Icons";
const isUrl = (s) => { try { return /^https?:$/.test(new URL(s).protocol); } catch { return false; } };
export default function EventForm({ initial = {}, onSubmit, label, email }) {
  const [errors, setErrors] = useState({});
  const [busy, setBusy] = useState(false);
  const thumb = useRef(null);
  const types = initial.type && !EVENT_TYPES.includes(initial.type) ? [...EVENT_TYPES, initial.type] : EVENT_TYPES;
  const submit = async (e) => {
    e.preventDefault();
    const f = Object.fromEntries(new FormData(e.target));
    const er = {};
    if (f.title.trim().length < 5) er.title = "Title needs at least 5 characters.";
    if (f.description.trim().length < 20) er.description = "Describe the event in at least 20 characters.";
    if (!f.type) er.type = "Pick an event type.";
    if (!isUrl(f.thumbnail.trim())) er.thumbnail = "Enter a valid image URL starting with http(s).";
    if (!f.location.trim()) er.location = "Location is required.";
    if (!f.date) er.date = "Pick an event date.";
    else if (f.date <= localToday()) er.date = "Pick a date in the future. Past dates are not allowed.";
    setErrors(er);
    if (Object.keys(er).length) return;
    setBusy(true); try { await onSubmit(f); } finally { setBusy(false); }
  };
  const Err = ({ k }) => errors[k] ? <span role="alert" className="text-error text-xs mt-1">{errors[k]}</span> : null;
  const L = ({ children }) => <span className="text-sm font-semibold mb-1.5">{children} <span className="text-error">*</span></span>;
  return (
    <form onSubmit={submit} className="grid gap-4" noValidate>
      <label className="flex flex-col"><L>Event Title</L><span className="field"><Icon n="type" className="w-4 h-4 opacity-50" /><input name="title" defaultValue={initial.title} placeholder="e.g. Winter Clothes Distribution – Mirpur 10" /></span><Err k="title" /></label>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="flex flex-col"><L>Event Type</L><span className="field"><Icon n="tag" className="w-4 h-4 opacity-50" /><select name="type" defaultValue={initial.type || ""} className="grow bg-transparent outline-none"><option value="" disabled>Choose type</option>{types.map((t) => <option key={t}>{t}</option>)}</select></span><Err k="type" /></label>
        <label className="flex flex-col"><L>Event Date</L><span className="field"><Icon n="calendar" className="w-4 h-4 opacity-50" /><input type="date" name="date" min={localTomorrow()} defaultValue={initial.date?.slice(0, 10)} /></span>
          {errors.date ? <Err k="date" /> : <span className="text-xs opacity-60 mt-1">Date must be in the future.</span>}</label>
      </div>
      <label className="flex flex-col"><L>Location / Venue</L><span className="field"><Icon n="pin" className="w-4 h-4 opacity-50" /><input name="location" defaultValue={initial.location} placeholder="e.g. Mohammadpur Town Hall, Dhaka" /></span><Err k="location" /></label>
      <div className="flex flex-col"><label className="flex flex-col"><L>Thumbnail Image URL</L><span className="field"><Icon n="image" className="w-4 h-4 opacity-50" /><input ref={thumb} name="thumbnail" defaultValue={initial.thumbnail} placeholder="https://images.unsplash.com/photo-..." /></span></label><Err k="thumbnail" />
        <p className="text-xs opacity-70 mt-1.5 flex flex-wrap gap-x-2 gap-y-1 items-center">Quick photo presets: {PHOTO_PRESETS.map(([n, u]) => <button type="button" key={n} onClick={() => { thumb.current.value = u; }} className="text-primary font-medium hover:underline">{n}</button>)}</p></div>
      <label className="flex flex-col"><L>Event Description</L><textarea name="description" defaultValue={initial.description} className="textarea textarea-bordered h-28 bg-base-100" placeholder="Explain the purpose of the drive, what volunteers should bring and what they will do." /><Err k="description" /></label>
      {email && <div className="flex items-center justify-between rounded-lg bg-base-200 px-4 py-2.5 text-xs"><span className="flex items-center gap-2 opacity-70"><Icon n="mail" />Organizer Email attached</span><span className="font-semibold break-all">{email}</span></div>}
      <button disabled={busy} className="btn btn-primary w-full"><Icon n="checkc" />{busy ? "Saving..." : label}</button>
    </form>
  );
}
