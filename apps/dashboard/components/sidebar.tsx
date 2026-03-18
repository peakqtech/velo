"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  LayoutDashboard,
  DollarSign,
  Users,
  Globe,
  ListChecks,
  Search,
  FileText,
  Puzzle,
  Shield,
  Settings,
  LogOut,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import { signOut } from "next-auth/react";

import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

type User = {
  name?: string | null;
  email?: string | null;
  image?: string | null;
} | null;

type NavItem = {
  label: string;
  href: string;
  icon: React.ReactNode;
};

type NavSection = {
  label: string;
  items: NavItem[];
};

const navSections: NavSection[] = [
  {
    label: "Overview",
    items: [
      {
        label: "Dashboard",
        href: "/",
        icon: <LayoutDashboard size={16} />,
      },
      {
        label: "Revenue",
        href: "/billing",
        icon: <DollarSign size={16} />,
      },
    ],
  },
  {
    label: "Manage",
    items: [
      {
        label: "Clients",
        href: "/clients",
        icon: <Users size={16} />,
      },
      {
        label: "Sites",
        href: "/sites",
        icon: <Globe size={16} />,
      },
      {
        label: "Changes",
        href: "/changes",
        icon: <ListChecks size={16} />,
      },
    ],
  },
  {
    label: "Growth",
    items: [
      {
        label: "SEO",
        href: "/seo",
        icon: <Search size={16} />,
      },
      {
        label: "Content",
        href: "/content",
        icon: <FileText size={16} />,
      },
    ],
  },
  {
    label: "System",
    items: [
      {
        label: "Integrations",
        href: "/integrations",
        icon: <Puzzle size={16} />,
      },
      {
        label: "QA Reports",
        href: "/qa-reports",
        icon: <Shield size={16} />,
      },
      {
        label: "Settings",
        href: "/settings",
        icon: <Settings size={16} />,
      },
    ],
  },
];

function getInitials(name?: string | null, email?: string | null): string {
  if (name) {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  }
  if (email) {
    return email[0].toUpperCase();
  }
  return "U";
}

function SidebarSection({ section }: { section: NavSection }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(true);

  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <CollapsibleTrigger className="flex w-full items-center justify-between px-3 py-1.5 group">
        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground group-hover:text-foreground transition-colors">
          {section.label}
        </span>
        {open ? (
          <ChevronDown size={12} className="text-muted-foreground group-hover:text-foreground transition-colors" />
        ) : (
          <ChevronRight size={12} className="text-muted-foreground group-hover:text-foreground transition-colors" />
        )}
      </CollapsibleTrigger>
      <CollapsibleContent>
        <div className="mt-0.5 mb-2 space-y-0.5">
          {section.items.map((item) => {
            const isActive =
              item.href === "/"
                ? pathname === "/"
                : pathname === item.href || pathname.startsWith(item.href + "/");

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`relative flex items-center gap-2.5 px-3 py-2 rounded-md text-sm transition-all duration-150 ${
                  isActive
                    ? "bg-accent text-accent-foreground font-medium"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
                }`}
              >
                {isActive && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-[3px] rounded-r-full bg-blue-500" />
                )}
                <span className="shrink-0">{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}

export function AppSidebar({ user }: { user: User }) {
  const initials = getInitials(user?.name, user?.email);
  const displayName = user?.name ?? user?.email ?? "User";

  return (
    <aside className="w-64 shrink-0 border-r border-border bg-sidebar flex flex-col h-screen">
      {/* Logo */}
      <div className="h-14 flex items-center px-5 border-b border-border shrink-0">
        <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent">
          Velo
        </span>
        <span className="ml-2 text-[10px] font-semibold uppercase tracking-wider text-violet-400 bg-violet-500/10 border border-violet-500/20 px-1.5 py-0.5 rounded">
          Agency
        </span>
      </div>

      {/* Nav */}
      <ScrollArea className="flex-1 py-3">
        <nav className="px-3 space-y-1">
          {navSections.map((section) => (
            <SidebarSection key={section.label} section={section} />
          ))}
        </nav>
      </ScrollArea>

      {/* User menu */}
      <div className="p-3 border-t border-border shrink-0">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex w-full items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-accent transition-colors cursor-pointer text-left outline-none focus-visible:ring-2 focus-visible:ring-ring">
              <Avatar className="h-8 w-8 shrink-0">
                {user?.image && <AvatarImage src={user.image} alt={displayName} />}
                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-violet-500 text-white text-xs font-bold">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1">
                <div className="text-sm font-medium text-foreground truncate">
                  {displayName}
                </div>
                {user?.email && user?.name && (
                  <div className="text-[11px] text-muted-foreground truncate">
                    {user.email}
                  </div>
                )}
              </div>
              <ChevronDown size={14} className="text-muted-foreground shrink-0" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" side="top" className="w-52 mb-1">
            <DropdownMenuItem asChild>
              <Link href="/settings" className="cursor-pointer">
                <Settings size={14} />
                Profile
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-destructive focus:text-destructive cursor-pointer"
              onClick={() => signOut({ callbackUrl: "/login" })}
            >
              <LogOut size={14} />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </aside>
  );
}
