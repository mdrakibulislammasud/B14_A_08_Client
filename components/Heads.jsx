import Icon from "./Icons";
// Centered heading used by every home-page section, so all section titles look the same.
export function SectionHead({ eyebrow, title, sub }) {
  return (<div className="text-center mb-10"><p className="text-xs font-bold tracking-widest uppercase text-primary mb-2">{eyebrow}</p>
    <h2 className="text-3xl md:text-4xl font-extrabold">{title}</h2>{sub && <p className="mt-3 opacity-70 max-w-2xl mx-auto">{sub}</p>}</div>);
}
// Left-aligned heading used at the top of the inner pages.
export function PageHead({ badge, icon = "calendar", title, sub, action }) {
  return (<div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8"><div>
    <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary bg-primary/10 rounded-full px-3 py-1 mb-3"><Icon n={icon} className="w-3.5 h-3.5" />{badge}</span>
    <h1 className="text-3xl md:text-4xl font-extrabold">{title}</h1>{sub && <p className="mt-2 opacity-70 max-w-xl text-sm md:text-base">{sub}</p>}</div>{action}</div>);
}
export const Logo = ({ className = "w-9 h-9" }) => <span className={`${className} rounded-xl bg-primary text-primary-content flex items-center justify-center`}><Icon n="heart" className="w-5 h-5" /></span>;
