import Link from "next/link"
import { LayoutDashboard, LogOut, PlusCircle, Settings } from "lucide-react"
import { InstallButton } from "@/components/InstallButton"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      {/* Admin Sidebar/Header */}
      <header className="w-full border-b border-white/10 bg-zinc-950 px-4 md:px-6 h-16 flex items-center justify-between sticky top-0 z-50 backdrop-blur-md">
         <div className="flex items-center gap-4">
            <Link href="/admin" className="flex items-center">
              <img src="/wtf-logo.png" alt="WTFprompt" className="h-10 md:h-12 w-auto object-contain" />
              <span className="hidden sm:inline text-zinc-500 text-[10px] font-bold uppercase tracking-widest ml-1">HUB</span>
            </Link>
         </div>

         <nav className="flex items-center gap-4 md:gap-6 bg-white/5 px-3 py-1.5 md:bg-transparent md:px-0 md:py-0 rounded-full">
            <Link href="/admin" className="text-[11px] md:text-sm text-zinc-400 hover:text-white font-medium">Dashboard</Link>
            <Link href="/admin/manage" className="text-[11px] md:text-sm text-zinc-400 hover:text-white font-medium">Manage</Link>
            <Link href="/admin/upload" className="text-[11px] md:text-sm text-zinc-400 hover:text-white font-medium">Upload</Link>
         </nav>

          <div className="flex items-center gap-2 md:gap-3">
             <InstallButton />
             <Link href="/" className="flex items-center gap-1 md:gap-2 text-[11px] md:text-sm bg-white/10 border border-white/10 p-2 md:px-4 md:py-2 rounded-full hover:bg-white/20 transition-all font-medium">
               <LogOut className="w-3.5 h-3.5 rotate-180" /> <span className="hidden md:inline">View Site</span>
             </Link>
          </div>
      </header>

      {/* Main Page Content */}
      <main className="flex-1 pb-20">
         {children}
      </main>
    </div>
  )
}
