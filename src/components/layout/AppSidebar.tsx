"use client";
import React, { useEffect, useRef, useCallback, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Calendar as CalendarIcon,
  MessageSquare as ChatIcon,
  ChevronDown as ChevronDownIcon,
  LayoutGrid as GridIcon,
  MoreHorizontal as HorizontaLDots,
  Mail as MailIcon,
  File as PageIcon,
  PieChart as PieChartIcon,
  Plug as PlugInIcon,
  Table as TableIcon,
  ClipboardList as TaskIcon,
  UserCircle as UserCircleIcon,
} from "lucide-react";
import { useSidebar } from "@/context/SidebarContext";
import { Logo } from "../ui/Logo";
// import SidebarWidget from "./SidebarWidget";

type NavItem = {
  name: string;
  icon: React.ReactNode;
  path?: string;
  subItems?: { name: string; path: string; pro?: boolean; new?: boolean }[];
};

// === MAIN ===
export const mainNav: NavItem[] = [
  { icon: <GridIcon />, name: "Dashboard", path: "/app/overview" },

  {
    icon: <UserCircleIcon />,
    name: "Landlords Management",
    subItems: [
      { name: "All Landlords", path: "/app/landlords" },
      { name: "Portfolios", path: "/app/landlords/portfolios" },
      { name: "Bank Details & Payouts", path: "/app/landlords/payouts" },
      { name: "Statements", path: "/app/landlords/statements" },
      { name: "Communication Log", path: "/app/landlords/comms" },
      { name: "Documents", path: "/app/landlords/documents" },
    ],
  },

  {
    icon: <TaskIcon />,
    name: "Tenancy Management",
    subItems: [
      { name: "Onboarding Wizard", path: "/app/tenancy/onboarding" },
      { name: "Tenancies", path: "/app/tenancy/tenancies" },
      { name: "Tenants", path: "/app/tenancy/tenants" },
      { name: "Arrears (Ops View)", path: "/app/tenancy/arrears" },
      { name: "Compliance Checks", path: "/app/tenancy/compliance" },
      { name: "Documents", path: "/app/tenancy/documents" },
      { name: "Notes / Updates", path: "/app/tenancy/notes" },
    ],
  },

  {
    icon: <GridIcon />,
    name: "Properties Management",
    subItems: [
      { name: "All Properties", path: "/app/properties" },
      { name: "Managed Properties", path: "/app/properties/managed" },
      { name: "Availability", path: "/app/properties/availability" },
      { name: "Maintenance & Jobs", path: "/app/properties/maintenance" },
      { name: "Inspections", path: "/app/properties/inspections" },
      { name: "Documents", path: "/app/properties/documents" },
    ],
  },

  { icon: <CalendarIcon />, name: "Calendar", path: "/app/calendar" },
  { icon: <UserCircleIcon />, name: "User Profile", path: "/app/profile" },
];

// === FINANCE ===
export const financeNav: NavItem[] = [
  {
    icon: <TableIcon />,
    name: "Finance",
    subItems: [
      { name: "Rent Book", path: "/app/finance/rent-book" },
      { name: "Payments & Receipts", path: "/app/finance/receipts" },
      { name: "Allocate Receipts", path: "/app/finance/allocations" },
      { name: "Arrears (Finance)", path: "/app/finance/arrears" },
      { name: "Deposits (Money Held)", path: "/app/finance/deposits" },
      { name: "Landlord Payouts", path: "/app/finance/payouts" },
      { name: "Reconciliations", path: "/app/finance/reconciliations" },
      { name: "Transfers", path: "/app/finance/transfers" },
      {
        name: "Invoices",
        path: "/app/finance/invoices", // parent landing / tabs
        // optional nested tabs if you prefer deeper nesting:
        // subItems: [
        //   { name: "Received",     path: "/app/finance/invoices/received" },
        //   { name: "Raised",       path: "/app/finance/invoices/raised" },
        //   { name: "Credit Notes", path: "/app/finance/invoices/credit-notes" },
        //   { name: "Aging",        path: "/app/finance/invoices/aging" },
        // ],
      },
      { name: "Bank Accounts / Feeds", path: "/app/finance/banking" },
    ],
  },
];

// === REPORTS & ADMIN ===
export const reportsAndAdminNav: NavItem[] = [
  {
    icon: <PieChartIcon />,
    name: "Reports",
    subItems: [
      { name: "Rent Roll", path: "/app/reports/rent-roll" },
      { name: "Arrears Summary", path: "/app/reports/arrears" },
      { name: "Money Held Summary", path: "/app/reports/money-held" },
      { name: "Landlord Statements", path: "/app/reports/statements" },
      { name: "Property Performance", path: "/app/reports/performance" },
      { name: "Audit Log", path: "/app/reports/audit" },
      { name: "Exports", path: "/app/reports/exports" },
    ],
  },
  {
    icon: <PlugInIcon />,
    name: "Administration",
    subItems: [
      { name: "Users & Roles", path: "/app/admin/users" },
      { name: "Reference Data", path: "/app/admin/reference-data" },
      { name: "Integrations", path: "/app/admin/integrations" },
      { name: "Templates (Docs/Email)", path: "/app/admin/templates" },
      { name: "Backups", path: "/app/admin/backups" },
      { name: "System Health", path: "/app/admin/health" },
    ],
  },
];

// === SUPPORT ===
export const supportNav: NavItem[] = [
  { icon: <ChatIcon />, name: "Chat", path: "/app/support/chat" },
  {
    icon: <MailIcon />,
    name: "Email",
    subItems: [
      { name: "Inbox", path: "/app/support/email/inbox" },
      { name: "Details", path: "/app/support/email/details" },
    ],
  },
  {
    icon: <PageIcon />,
    name: "Documents",
    subItems: [
      { name: "File Manager", path: "/app/support/files" },
      { name: "Templates", path: "/app/support/templates" },
    ],
  },
];

const AppSidebar: React.FC = () => {
  // const { isExpanded, isMobileOpen, isHovered, setIsHovered } = useSidebar();
  const { isExpanded, isMobileOpen } = useSidebar();

  const pathname = usePathname();

  const [openSubmenu, setOpenSubmenu] = useState<{
    type: "main" | "finance" | "reports" | "support";
    index: number;
  } | null>(null);

  const [subMenuHeight, setSubMenuHeight] = useState<Record<string, number>>(
    {}
  );
  const subMenuRefs = useRef<Record<string, HTMLDivElement | null>>({});

  // const isActive = (path: string) => path === pathname;

  const isActive = useCallback(
    (path: string) => pathname === path || pathname.startsWith(path + "/"),
    [pathname]
  );

  const normalize = (s: string) => s.split(/[?#]/)[0].replace(/\/+$/, "");

  const isExactActive = (pathname: string, path: string) =>
    normalize(pathname) === normalize(path);

  const isInTree = (pathname: string, path: string) => {
    const cur = normalize(pathname);
    const base = normalize(path);
    return cur === base || cur.startsWith(base + "/");
  };

  useEffect(() => {
    if (openSubmenu) return;
    const sections: Array<
      ["main" | "finance" | "reports" | "support", NavItem[]]
    > = [
      ["main", mainNav],
      ["finance", financeNav],
      ["reports", reportsAndAdminNav],
      ["support", supportNav],
    ];

    // let matched: {
    //   type: "main" | "finance" | "reports" | "support";
    //   index: number;
    // } | null = null;

    // sections.forEach(([type, items]) => {
    //   items.forEach((nav, index) => {
    //     if (nav.subItems?.some((si) => isActive(si.path!))) {
    //       matched = { type, index };
    //     }
    //   });
    // });

    // setOpenSubmenu(matched);

    for (const [type, items] of sections) {
      const idx = items.findIndex((nav) =>
        nav.subItems?.some((si) => isInTree(pathname, si.path!))
      );
      if (idx >= 0) {
        setOpenSubmenu({ type, index: idx });
        break;
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, isActive]);

  useEffect(() => {
    if (openSubmenu !== null) {
      const key = `${openSubmenu.type}-${openSubmenu.index}`;
      if (subMenuRefs.current[key]) {
        setSubMenuHeight((prev) => ({
          ...prev,
          [key]: subMenuRefs.current[key]?.scrollHeight || 0,
        }));
      }
    }
  }, [openSubmenu]);

  const handleSubmenuToggle = (
    index: number,
    menuType: "main" | "finance" | "reports" | "support"
  ) => {
    setOpenSubmenu((prev) =>
      prev && prev.type === menuType && prev.index === index
        ? null
        : { type: menuType, index }
    );
  };

  const renderMenuItems = (
    navItems: NavItem[],
    menuType: "main" | "finance" | "reports" | "support"
  ) => (
    <ul className="flex flex-col gap-4">
      {navItems.map((nav, index) => {
        const sectionCurrent =
          !!nav.subItems?.some(
            (si) => si.path && isInTree(pathname, si.path)
          ) ||
          (!!nav.path && isInTree(pathname, nav.path));

        return (
          <li key={nav.name}>
            {nav.subItems ? (
              <button
                onClick={() => handleSubmenuToggle(index, menuType)}
                // className={`menu-item group  ${
                //   openSubmenu?.type === menuType && openSubmenu?.index === index
                //     ? "menu-item-active"
                //     : "menu-item-inactive"
                // } cursor-pointer ${
                //   !isExpanded && !isHovered
                //     ? "lg:justify-center"
                //     : "lg:justify-start"
                // }`}
                className={`menu-item group cursor-pointer ${
                  sectionCurrent
                    ? "menu-item-parent-active"
                    : "menu-item-inactive"
                } ${
                  // !isExpanded && !isHovered
                  !isExpanded ? "lg:justify-center" : "lg:justify-start"
                }`}
              >
                {/* <span
                  className={` ${
                    openSubmenu?.type === menuType &&
                    openSubmenu?.index === index
                      ? "menu-item-icon-active"
                      : "menu-item-icon-inactive"
                  }`}
                > */}
                <span
                  className={`${
                    sectionCurrent
                      ? "menu-item-icon-active"
                      : "menu-item-icon-inactive"
                  }`}
                >
                  {nav.icon}
                </span>
                {(isExpanded || isMobileOpen) && (
                  // <span className={`menu-item-text`}>{nav.name}</span>
                  <span
                    className={`menu-item-text ${
                      sectionCurrent
                        ? "text-brand-600 dark:text-brand-400 font-medium"
                        : "text-inherit"
                    }`}
                  >
                    {nav.name}
                  </span>
                )}
                {(isExpanded || isMobileOpen) && (
                  <ChevronDownIcon
                    className={`ml-auto w-5 h-5 transition-transform duration-200  ${
                      openSubmenu?.type === menuType &&
                      openSubmenu?.index === index
                        ? "rotate-180 text-brand-500"
                        : ""
                    }`}
                  />
                )}
              </button>
            ) : (
              nav.path && (
                <Link
                  href={nav.path}
                  // className={`menu-item group ${
                  //   isActive(nav.path)
                  //     ? "menu-item-active"
                  //     : "menu-item-inactive"
                  // }`}
                  className={`menu-item group ${
                    isExactActive(pathname, nav.path)
                      ? "menu-item-active"
                      : "menu-item-inactive"
                  }`}
                >
                  {/* <span
                    className={`${
                      isActive(nav.path)
                        ? "menu-item-icon-active"
                        : "menu-item-icon-inactive"
                    }`}
                  > */}
                  <span
                    className={`${
                      isExactActive(pathname, nav.path)
                        ? "menu-item-icon-active"
                        : "menu-item-icon-inactive"
                    }`}
                  >
                    {nav.icon}
                  </span>
                  {(isExpanded || isMobileOpen) && (
                    <span className={`menu-item-text`}>{nav.name}</span>
                  )}
                </Link>
              )
            )}
            {nav.subItems && (isExpanded || isMobileOpen) && (
              <div
                ref={(el) => {
                  subMenuRefs.current[`${menuType}-${index}`] = el;
                }}
                className="overflow-hidden transition-all duration-300"
                style={{
                  height:
                    openSubmenu?.type === menuType &&
                    openSubmenu?.index === index
                      ? `${subMenuHeight[`${menuType}-${index}`]}px`
                      : "0px",
                }}
              >
                <ul className="mt-2 space-y-1 ml-9">
                  {nav.subItems.map((subItem) => (
                    <li key={subItem.name}>
                      <Link
                        href={subItem.path}
                        // className={`menu-dropdown-item ${
                        //   isActive(subItem.path)
                        //     ? "menu-dropdown-item-active"
                        //     : "menu-dropdown-item-inactive"
                        // }`}
                        className={`menu-dropdown-item ${
                          isExactActive(pathname, subItem.path)
                            ? "menu-dropdown-item-active"
                            : "menu-dropdown-item-inactive"
                        }`}
                      >
                        {subItem.name}
                        {/* <span className="flex items-center gap-1 ml-auto">
                          {subItem.new && (
                            <span
                              className={`ml-auto ${
                                isActive(subItem.path)
                                  ? "menu-dropdown-badge-active"
                                  : "menu-dropdown-badge-inactive"
                              } menu-dropdown-badge `}
                            >
                              new
                            </span>
                          )}
                          {subItem.pro && (
                            <span
                              className={`ml-auto ${
                                isActive(subItem.path)
                                  ? "menu-dropdown-badge-active"
                                  : "menu-dropdown-badge-inactive"
                              } menu-dropdown-badge `}
                            >
                              pro
                            </span>
                          )}
                        </span> */}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </li>
        );
      })}
    </ul>
  );

  return (
    <aside
      className={`fixed mt-16 flex flex-col lg:mt-0 top-0 px-5 left-0 bg-white dark:bg-gray-900 dark:border-gray-800 text-gray-900 h-full transition-all duration-300 ease-in-out z-50 border-r border-gray-200 
        ${
          isExpanded || isMobileOpen
            ? "w-[290px]"
            : // : isHovered
              // ? "w-[290px]"
              "w-[90px]"
        }
        ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0`}
      // onMouseEnter={() => !isExpanded && setIsHovered(true)}
      // onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className={`py-8 flex  ${
          !isExpanded ? "lg:justify-center" : "justify-start"
        }`}
      >
        {isExpanded || isMobileOpen ? (
          <>
            {/* <Image
                className="dark:hidden"
                src="/images/logo/logo.svg"
                alt="Logo"
                width={150}
                height={40}
              />
              <Image
                className="hidden dark:block"
                src="/images/logo/logo-dark.svg"
                alt="Logo"
                width={150}
                height={40}
              /> */}
            <Logo />
          </>
        ) : (
          <Link href={"/app"}>ABC</Link>
        )}
      </div>
      <div className="flex flex-col overflow-y-auto  duration-300 ease-linear no-scrollbar">
        <nav className="mb-6">
          <div className="flex flex-col gap-4">
            <div>
              <h2
                className={`mb-4 text-xs uppercase flex leading-[20px] text-gray-400 ${
                  !isExpanded ? "lg:justify-center" : "justify-start"
                }`}
              >
                {isExpanded || isMobileOpen ? "Main Menu" : <HorizontaLDots />}
              </h2>
              {renderMenuItems(mainNav, "main")}
            </div>
            <div>
              <h2
                className={`mb-4 text-xs uppercase flex leading-[20px] text-gray-400 ${
                  !isExpanded ? "lg:justify-center" : "justify-start"
                }`}
              >
                {isExpanded || isMobileOpen ? "Finance" : <HorizontaLDots />}
              </h2>
              {renderMenuItems(financeNav, "finance")}
            </div>
            <div>
              <h2
                className={`mb-4 text-xs uppercase flex leading-[20px] text-gray-400 ${
                  !isExpanded ? "lg:justify-center" : "justify-start"
                }`}
              >
                {isExpanded || isMobileOpen ? (
                  "Reports & Admin"
                ) : (
                  <HorizontaLDots />
                )}
              </h2>
              {renderMenuItems(reportsAndAdminNav, "reports")}
            </div>
            <div>
              <h2
                className={`mb-4 text-xs uppercase flex leading-[20px] text-gray-400 ${
                  !isExpanded ? "lg:justify-center" : "justify-start"
                }`}
              >
                {isExpanded || isMobileOpen ? "Support" : <HorizontaLDots />}
              </h2>
              {renderMenuItems(supportNav, "support")}
            </div>
          </div>
        </nav>
        {/* {isExpanded || isHovered || isMobileOpen ? <SidebarWidget /> : null} */}
      </div>
    </aside>
  );
};

export default AppSidebar;
