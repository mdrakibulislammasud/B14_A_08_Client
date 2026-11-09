import Link from "next/link";
export default function NotFound() {
  return (<div className="max-w-xl mx-auto px-4 py-24 text-center"><h1 className="text-3xl font-extrabold text-center mb-6">Page not found</h1>
    <p className="mb-6">The page you are looking for does not exist or has moved.</p><Link href="/" className="btn btn-primary">Back to home</Link></div>);
}
