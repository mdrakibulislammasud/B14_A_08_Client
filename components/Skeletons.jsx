export default function CardSkeletons({ n = 6 }) {
  return <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{Array.from({ length: n }).map((_, i) => <div key={i} className="skeleton h-96 w-full rounded-2xl" />)}</div>;
}
