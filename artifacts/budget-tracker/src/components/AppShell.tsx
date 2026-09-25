import { Link, useLocation } from 'wouter';
import { BarChart3, ChevronRight, CircleDollarSign, LayoutDashboard, Menu, Settings, Tags, WalletCards, X } from 'lucide-react';
import { useState } from 'react';
import type { ReactNode } from 'react';

const links = [
  {href:'/',label:'Overview',icon:LayoutDashboard},
  {href:'/transactions',label:'Transactions',icon:WalletCards},
  {href:'/budgets',label:'Budgets',icon:Tags},
  {href:'/settings',label:'Settings',icon:Settings},
];
export function AppShell({children}:{children:ReactNode}) {
  const [location] = useLocation(); const [open,setOpen] = useState(false);
  return <div className="min-h-[100dvh] bg-background">
    <aside className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col bg-sidebar text-sidebar-foreground transition-transform md:translate-x-0 ${open?'translate-x-0':'-translate-x-full'}`}>
      <div className="flex h-20 items-center justify-between border-b border-sidebar-border px-6">
        <Link href="/" data-testid="link-brand" className="flex items-center gap-3"><span className="grid h-9 w-9 place-items-center rounded-xl bg-sidebar-primary text-sidebar-primary-foreground"><CircleDollarSign size={21}/></span><span className="font-serif text-xl font-bold tracking-tight">Pocketwise</span></Link>
        <button onClick={()=>setOpen(false)} data-testid="button-close-menu" className="md:hidden"><X size={20}/></button>
      </div>
      <nav className="flex-1 space-y-2 p-4 pt-8">
        <p className="mb-4 px-3 text-[10px] font-bold uppercase tracking-[0.2em] text-sidebar-foreground/45">Workspace</p>
        {links.map(({href,label,icon:Icon})=><Link key={href} href={href} onClick={()=>setOpen(false)} data-testid={`link-nav-${label.toLowerCase()}`} className={`group flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition ${location===href?'bg-sidebar-accent text-sidebar-accent-foreground':'text-sidebar-foreground/65 hover:bg-sidebar-accent/70 hover:text-sidebar-foreground'}`}><Icon size={18}/><span>{label}</span>{location===href&&<ChevronRight size={15} className="ml-auto text-sidebar-primary"/>}</Link>)}
      </nav>
      <div className="m-4 rounded-2xl border border-sidebar-border bg-sidebar-accent/60 p-4">
        <p className="text-xs leading-5 text-sidebar-foreground/65">A clearer month starts with one small check-in.</p>
        <Link href="/transactions" data-testid="link-sidebar-add" className="mt-3 inline-flex items-center text-xs font-bold text-sidebar-primary">Add a transaction <ChevronRight size={13} className="ml-1"/></Link>
      </div>
      <div className="border-t border-sidebar-border p-5 text-[11px] text-sidebar-foreground/40">Your money, your pace.</div>
    </aside>
    {open&&<button className="fixed inset-0 z-30 bg-foreground/30 md:hidden" data-testid="button-menu-backdrop" onClick={()=>setOpen(false)} aria-label="Close navigation"/>}
    <main className="md:pl-64">
      <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-border/70 bg-background/90 px-4 backdrop-blur md:px-10">
        <button onClick={()=>setOpen(true)} data-testid="button-open-menu" className="rounded-lg p-2 hover:bg-muted md:hidden"><Menu size={21}/></button>
        <div className="hidden md:block"><p className="text-xs font-medium text-muted-foreground">Personal finance workspace</p></div>
        <div className="ml-auto flex items-center gap-3"><span className="h-2 w-2 rounded-full bg-emerald-500"/><span className="text-xs font-semibold text-muted-foreground">Local data only</span></div>
      </header>
      <div className="mx-auto max-w-[1440px] px-4 py-8 md:px-10 md:py-10">{children}</div>
    </main>
  </div>;
}