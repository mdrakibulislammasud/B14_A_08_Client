import "./globals.css";
import Providers from "@/components/Providers";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
export const metadata = { title: "Neighbourly – Social Development Events", description: "Create, join and track community service events near you." };
// Sets the saved theme before the first paint so the page never flashes the wrong colours.
const themeScript = `try{var t=localStorage.getItem("theme");if(t==="dark"||t==="light")document.documentElement.setAttribute("data-theme",t)}catch(e){}`;
export default function RootLayout({ children }) {
  return (<html lang="en" data-theme="light" suppressHydrationWarning><head><script dangerouslySetInnerHTML={{ __html: themeScript }} /></head>
    <body className="bg-base-100 text-base-content min-h-screen flex flex-col">
    <Providers><Navbar /><main className="flex-1">{children}</main><Footer /></Providers></body></html>);
}
