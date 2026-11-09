import Link from "next/link";
import Icon from "./Icons";
import { Logo } from "./Heads";
const X_PATH = "M18.9 2H22l-7.3 8.3L23.3 22h-6.7l-5.2-6.8L5.4 22H2.3l7.8-8.9L1.9 2h6.9l4.7 6.2L18.9 2Zm-1.2 18h1.8L7.4 3.9H5.5L17.7 20Z";
const socials = [["X", "https://x.com", null], ["Facebook", "https://facebook.com", "f"], ["Instagram", "https://instagram.com", "ig"], ["LinkedIn", "https://linkedin.com", "in"], ["GitHub", "https://github.com", "gh"]];
const badge = "w-9 h-9 rounded-full border border-base-300 flex items-center justify-center text-xs font-bold hover:bg-primary hover:text-primary-content hover:border-primary transition-colors";
const links = [["/events", "Upcoming Events", "calendar"], ["/create-event", "Create an Event", "plus"], ["/manage-events", "Manage My Events", "edit"], ["/joined-events", "My Joined Events", "checkc"]];
const causes = [["bg-pink-500", "Winter Clothes & Blanket Relief"], ["bg-emerald-500", "City Clean-up & Waste Segregation"], ["bg-green-600", "Urban Tree Plantation Drives"], ["bg-amber-500", "Underprivileged Meal Sharing"]];
export default function Footer() {
  return (
    <footer className="bg-base-100 border-t border-base-300 mt-20 relative">
      <div className="h-1 bg-gradient-to-r from-primary via-secondary to-accent" />
      <div className="max-w-6xl mx-auto px-4 py-12 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
        <div><div className="flex items-center gap-2.5 mb-3"><Logo /><span className="text-xl font-extrabold">Neighbourly</span></div>
          <p className="text-sm opacity-70">A community-driven platform that helps everyday citizens create, join and track social service events in their neighbourhood.</p>
          <p className="text-sm opacity-70 mt-3">Mirpur 10, Dhaka, Bangladesh<br />hello@neighbourly.app</p></div>
        <div><h4 className="text-xs font-bold tracking-widest uppercase mb-4">Explore Platform</h4><ul className="space-y-2.5 text-sm">{links.map(([h, l, i]) => <li key={h}><Link href={h} className="flex items-center gap-2 opacity-80 hover:text-primary hover:opacity-100"><Icon n={i} className="w-4 h-4 text-primary" />{l}</Link></li>)}</ul></div>
        <div><h4 className="text-xs font-bold tracking-widest uppercase mb-4">Active Causes</h4><ul className="space-y-2.5 text-sm">{causes.map(([c, l]) => <li key={l} className="flex items-center gap-2 opacity-80"><span className={`w-2 h-2 rounded-full ${c}`} />{l}</li>)}</ul></div>
        <div><h4 className="text-xs font-bold tracking-widest uppercase mb-4">Community Spirit</h4>
          <p className="text-sm opacity-70">Every small action counts. Connect with local volunteers, turn compassion into direct community aid and be the change your city needs.</p>
          <div className="flex gap-2.5 mt-4">{socials.map(([n, h, t]) => <a key={n} href={h} target="_blank" rel="noreferrer" aria-label={n} className={badge}>{t ?? <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d={X_PATH} /></svg>}</a>)}</div></div>
      </div>
      <p className="text-center text-xs opacity-60 py-5 border-t border-base-300">© {new Date().getFullYear()} Neighbourly. All rights reserved.</p>
    </footer>
  );
}
