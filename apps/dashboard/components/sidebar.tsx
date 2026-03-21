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
  PanelLeftClose,
  PanelLeft,
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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type User = {
  name?: string | null;
  email?: string | null;
  image?: string | null;
} | null;

type NavItem = {
  label: string;
  href: string;
  icon: React.ReactNode;
  iconColor: string;
  iconBg: string;
};

type NavSection = {
  label: string;
  color: string;
  items: NavItem[];
};

const navSections: NavSection[] = [
  {
    label: "Overview",
    color: "text-blue-500",
    items: [
      {
        label: "Dashboard",
        href: "/",
        icon: <LayoutDashboard size={15} />,
        iconColor: "text-blue-600 dark:text-blue-400",
        iconBg: "bg-blue-500/10 dark:bg-blue-500/15",
      },
      {
        label: "Revenue",
        href: "/billing",
        icon: <DollarSign size={15} />,
        iconColor: "text-emerald-600 dark:text-emerald-400",
        iconBg: "bg-emerald-500/10 dark:bg-emerald-500/15",
      },
    ],
  },
  {
    label: "Manage",
    color: "text-violet-500",
    items: [
      {
        label: "Clients",
        href: "/clients",
        icon: <Users size={15} />,
        iconColor: "text-violet-600 dark:text-violet-400",
        iconBg: "bg-violet-500/10 dark:bg-violet-500/15",
      },
      {
        label: "Sites",
        href: "/sites",
        icon: <Globe size={15} />,
        iconColor: "text-cyan-600 dark:text-cyan-400",
        iconBg: "bg-cyan-500/10 dark:bg-cyan-500/15",
      },
      {
        label: "Changes",
        href: "/changes",
        icon: <ListChecks size={15} />,
        iconColor: "text-amber-600 dark:text-amber-400",
        iconBg: "bg-amber-500/10 dark:bg-amber-500/15",
      },
    ],
  },
  {
    label: "Growth",
    color: "text-emerald-500",
    items: [
      {
        label: "SEO",
        href: "/seo",
        icon: <Search size={15} />,
        iconColor: "text-orange-600 dark:text-orange-400",
        iconBg: "bg-orange-500/10 dark:bg-orange-500/15",
      },
      {
        label: "Content",
        href: "/content",
        icon: <FileText size={15} />,
        iconColor: "text-pink-600 dark:text-pink-400",
        iconBg: "bg-pink-500/10 dark:bg-pink-500/15",
      },
    ],
  },
  {
    label: "System",
    color: "text-slate-500",
    items: [
      {
        label: "Integrations",
        href: "/integrations",
        icon: <Puzzle size={15} />,
        iconColor: "text-indigo-600 dark:text-indigo-400",
        iconBg: "bg-indigo-500/10 dark:bg-indigo-500/15",
      },
      {
        label: "QA Reports",
        href: "/qa-reports",
        icon: <Shield size={15} />,
        iconColor: "text-teal-600 dark:text-teal-400",
        iconBg: "bg-teal-500/10 dark:bg-teal-500/15",
      },
      {
        label: "Settings",
        href: "/settings",
        icon: <Settings size={15} />,
        iconColor: "text-slate-600 dark:text-slate-400",
        iconBg: "bg-slate-500/10 dark:bg-slate-500/15",
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

function SidebarSection({
  section,
  collapsed,
}: {
  section: NavSection;
  collapsed: boolean;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(true);

  if (collapsed) {
    return (
      <div className="mb-2 space-y-1 px-1.5">
        {section.items.map((item) => {
          const isActive =
            item.href === "/"
              ? pathname === "/"
              : pathname === item.href || pathname.startsWith(item.href + "/");

          return (
            <Tooltip key={item.href}>
              <TooltipTrigger asChild>
                <Link
                  href={item.href}
                  className={`relative flex items-center justify-center h-10 w-10 mx-auto rounded-xl transition-all duration-150 ${
                    isActive
                      ? "bg-primary/10 dark:bg-primary/15 shadow-sm"
                      : "hover:bg-accent/80"
                  }`}
                >
                  {isActive && (
                    <span className="absolute left-0 top-1/2 -translate-y-1/2 h-6 w-[3px] rounded-r-full bg-primary" />
                  )}
                  <span
                    className={`flex h-7 w-7 items-center justify-center rounded-lg shrink-0 transition-colors ${
                      isActive
                        ? `${item.iconBg} ${item.iconColor}`
                        : "text-muted-foreground"
                    }`}
                  >
                    {item.icon}
                  </span>
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right" sideOffset={8}>
                {item.label}
              </TooltipContent>
            </Tooltip>
          );
        })}
      </div>
    );
  }

  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <CollapsibleTrigger className="flex w-full items-center justify-between px-3 py-2 group cursor-pointer">
        <span className="text-[11px] font-bold uppercase tracking-[0.08em] text-muted-foreground/70 group-hover:text-muted-foreground transition-colors">
          {section.label}
        </span>
        {open ? (
          <ChevronDown
            size={12}
            className="text-muted-foreground/50 group-hover:text-muted-foreground transition-colors"
          />
        ) : (
          <ChevronRight
            size={12}
            className="text-muted-foreground/50 group-hover:text-muted-foreground transition-colors"
          />
        )}
      </CollapsibleTrigger>
      <CollapsibleContent>
        <div className="mt-0.5 mb-3 space-y-0.5 px-2">
          {section.items.map((item) => {
            const isActive =
              item.href === "/"
                ? pathname === "/"
                : pathname === item.href ||
                  pathname.startsWith(item.href + "/");

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`relative flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-[13px] transition-all duration-150 ${
                  isActive
                    ? "bg-primary/10 dark:bg-primary/15 text-foreground font-semibold shadow-sm"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent/80"
                }`}
              >
                {isActive && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 h-6 w-[3px] rounded-r-full bg-primary" />
                )}
                <span
                  className={`flex h-7 w-7 items-center justify-center rounded-lg shrink-0 transition-colors ${
                    isActive
                      ? `${item.iconBg} ${item.iconColor}`
                      : "text-muted-foreground"
                  }`}
                >
                  {item.icon}
                </span>
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
  const [collapsed, setCollapsed] = useState(false);
  const initials = getInitials(user?.name, user?.email);
  const displayName = user?.name ?? user?.email ?? "User";

  return (
    <TooltipProvider delayDuration={0}>
      <aside
        className={`shrink-0 bg-background flex flex-col h-screen transition-all duration-300 ease-in-out ${
          collapsed ? "w-[68px]" : "w-[260px]"
        }`}
      >
        {/* Logo + Collapse toggle */}
        <div className="h-16 flex items-center justify-between px-3 shrink-0">
          {!collapsed ? (
            <>
              <div className="flex items-center gap-2.5 px-2">
                <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center shrink-0">
                  <span className="text-white font-bold text-sm">V</span>
                </div>
                <div>
                  <span className="font-bold text-base tracking-tight text-foreground">
                    Velocity
                  </span>
                  <span className="ml-1.5 text-[9px] font-bold uppercase tracking-wider text-violet-700 dark:text-violet-300 bg-violet-500/10 dark:bg-violet-500/15 px-1.5 py-0.5 rounded-md">
                    Agency
                  </span>
                </div>
              </div>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={() => setCollapsed(true)}
                    className="flex items-center justify-center h-8 w-8 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent/80 transition-colors cursor-pointer shrink-0"
                  >
                    <PanelLeftClose size={16} />
                  </button>
                </TooltipTrigger>
                <TooltipContent side="right" sideOffset={8}>
                  Collapse sidebar
                </TooltipContent>
              </Tooltip>
            </>
          ) : (
            <div className="flex items-center justify-center w-full">
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={() => setCollapsed(false)}
                    className="flex items-center justify-center h-8 w-8 rounded-xl bg-gradient-to-br from-blue-500 to-violet-600 cursor-pointer"
                  >
                    <span className="text-white font-bold text-sm">V</span>
                  </button>
                </TooltipTrigger>
                <TooltipContent side="right" sideOffset={8}>
                  Expand sidebar
                </TooltipContent>
              </Tooltip>
            </div>
          )}
        </div>

        {/* Nav */}
        <ScrollArea className="flex-1 py-2">
          <nav className={collapsed ? "px-1" : "px-2 space-y-1"}>
            {navSections.map((section) => (
              <SidebarSection
                key={section.label}
                section={section}
                collapsed={collapsed}
              />
            ))}
          </nav>
        </ScrollArea>

        {/* User menu */}
        <div className="p-3 shrink-0">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              {collapsed ? (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button className="flex items-center justify-center w-full py-2 rounded-xl hover:bg-accent transition-colors cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-ring">
                      <Avatar className="h-9 w-9 shrink-0">
                        {user?.image && (
                          <AvatarImage src={user.image} alt={displayName} />
                        )}
                        <AvatarFallback className="bg-gradient-to-br from-blue-500 to-violet-600 text-white text-xs font-bold">
                          {initials}
                        </AvatarFallback>
                      </Avatar>
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="right" sideOffset={8}>
                    {displayName}
                  </TooltipContent>
                </Tooltip>
              ) : (
                <button className="flex w-full items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-accent transition-colors cursor-pointer text-left outline-none focus-visible:ring-2 focus-visible:ring-ring">
                  <Avatar className="h-9 w-9 shrink-0">
                    {user?.image && (
                      <AvatarImage src={user.image} alt={displayName} />
                    )}
                    <AvatarFallback className="bg-gradient-to-br from-blue-500 to-violet-600 text-white text-xs font-bold">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-semibold text-foreground truncate">
                      {displayName}
                    </div>
                    {user?.email && user?.name && (
                      <div className="text-[11px] text-muted-foreground truncate">
                        {user.email}
                      </div>
                    )}
                  </div>
                  <ChevronDown
                    size={14}
                    className="text-muted-foreground shrink-0"
                  />
                </button>
              )}
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
    </TooltipProvider>
  );
}
