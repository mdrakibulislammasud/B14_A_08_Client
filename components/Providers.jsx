"use client";
import { Toaster } from "react-hot-toast";
export default function Providers({ children }) { return <>{children}<Toaster position="top-right" toastOptions={{ style: { fontSize: "14px" }, success: { iconTheme: { primary: "#0d8f73", secondary: "#fff" } } }} /></>; }
