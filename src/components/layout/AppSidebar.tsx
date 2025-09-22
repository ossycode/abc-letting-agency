"use client";
import React, { useEffect, useRef, useCallback, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Box as BoxCubeIcon,
  Calendar as CalendarIcon,
  MessageSquare as ChatIcon,
  ChevronDown as ChevronDownIcon,
  FileText as DocsIcon,
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

const navItems: NavItem[] = [
  {
    icon: <GridIcon />,
    name: "Dashboard",
    path: "/app",
    // subItems: [
    //   { name: "Overview", path: "/app" },
    //   { name: "Arrears Monitor", path: "/dashboard/arrears" },
    //   { name: "Expiring Tenancies", path: "/dashboard/expiries", new: true },
    //   { name: "Worklist", path: "/dashboard/worklist" },
    // ],
  },

  {
    icon: <UserCircleIcon />,
    name: "Landlords",
    path: "/app/landlords",
    // subItems: [
    //   { name: "All Landlords", path: "/app/landlords" },
    //   { name: "Statements", path: "/app/landlords/statements" },
    //   { name: "Communication Log", path: "/app/landlords/comms" },
    //   { name: "Documents", path: "/app/landlords/documents" },
    // ],
  },

  {
    icon: <UserCircleIcon />,
    name: "Tenants",
    subItems: [
      { name: "All Tenants", path: "/app/tenants" },
      { name: "Arrears", path: "/app/tenants/arrears" },
      { name: "Documents", path: "/app/tenants/documents" },
      { name: "Status Tracking", path: "/app/tenants/status" },
    ],
  },

  {
    icon: <GridIcon />,
    name: "Properties",
    subItems: [
      { name: "All Properties", path: "/properties" },
      { name: "Managed", path: "/properties/managed" },
      { name: "Availability", path: "/properties/availability" },
      { name: "Maintenance History", path: "/properties/maintenance" },
      { name: "Documents", path: "/properties/documents" },
    ],
  },

  {
    icon: <TaskIcon />,
    name: "Tenancies",
    subItems: [
      { name: "Active", path: "/tenancies" },
      { name: "Expiring Soon", path: "/tenancies/expiring" },
      { name: "Deposit Ledger", path: "/tenancies/deposits" },
      { name: "Documents", path: "/tenancies/documents" },
    ],
  },
  {
    icon: <TableIcon />,
    name: "Rent Book",
    subItems: [
      { name: "Payments", path: "/payments" },
      { name: "Allocate Receipts", path: "/payments/allocate" },
      { name: "Arrears", path: "/payments/arrears" },
      { name: "Receipts", path: "/payments/receipts" },
    ],
  },
  {
    icon: <BoxCubeIcon />,
    name: "Money Held",
    subItems: [
      { name: "Deposits", path: "/money-held/deposits" },
      { name: "Client Funds", path: "/money-held/client-funds" },
      { name: "Reconciliations", path: "/money-held/reconcile" },
      { name: "Transfers", path: "/money-held/transfers" },
    ],
  },
  {
    icon: <DocsIcon />,
    name: "Invoices",
    subItems: [
      { name: "Received", path: "/invoices/received" },
      { name: "Raised", path: "/invoices/raised" },
      { name: "Credit Notes", path: "/invoices/credit-notes" },
      { name: "Aging", path: "/invoices/aging" },
    ],
  },
  {
    icon: <ChatIcon />,
    name: "Updates / Notes",
    subItems: [
      { name: "All Updates", path: "/updates" },
      { name: "By Entity", path: "/updates/search" },
      { name: "Tags", path: "/updates/tags" },
    ],
  },
  { icon: <CalendarIcon />, name: "Calendar", path: "/calendar" },
  { icon: <UserCircleIcon />, name: "User Profile", path: "/profile" },
];

// === OTHERS (Reports & admin utilities) ===
const othersItems: NavItem[] = [
  {
    icon: <PieChartIcon />,
    name: "Reports",
    subItems: [
      { name: "Rent Roll", path: "/reports/rent-roll" },
      { name: "Arrears Summary", path: "/reports/arrears" },
      { name: "Money Held Summary", path: "/reports/money-held" },
      { name: "Landlord Statements", path: "/reports/landlord-statements" },
      { name: "Audit Log", path: "/reports/audit-log" },
      { name: "Exports", path: "/reports/exports" },
    ],
  },
  {
    icon: <PlugInIcon />,
    name: "Administration",
    subItems: [
      { name: "Users & Roles", path: "/admin/users" },
      { name: "Reference Data", path: "/admin/reference" },
      { name: "Integrations", path: "/admin/integrations" },
      { name: "Backups", path: "/admin/backups" },
      { name: "System Health", path: "/admin/health" },
    ],
  },
];

// === SUPPORT (Comms & inboxes) ===
const supportItems: NavItem[] = [
  { icon: <ChatIcon />, name: "Chat", path: "/chat" },
  {
    icon: <MailIcon />,
    name: "Email",
    subItems: [
      { name: "Inbox", path: "/inbox" },
      { name: "Details", path: "/inbox-details" },
    ],
  },
  {
    icon: <PageIcon />,
    name: "Documents",
    subItems: [
      { name: "File Manager", path: "/documents" },
      { name: "Templates", path: "/documents/templates" },
    ],
  },
];

const AppSidebar: React.FC = () => {
  const { isExpanded, isMobileOpen, isHovered, setIsHovered } = useSidebar();
  const pathname = usePathname();

  const renderMenuItems = (
    navItems: NavItem[],
    menuType: "main" | "support" | "others"
  ) => (
    <ul className="flex flex-col gap-4">
      {navItems.map((nav, index) => (
        <li key={nav.name}>
          {nav.subItems ? (
            <button
              onClick={() => handleSubmenuToggle(index, menuType)}
              className={`menu-item group  ${
                openSubmenu?.type === menuType && openSubmenu?.index === index
                  ? "menu-item-active"
                  : "menu-item-inactive"
              } cursor-pointer ${
                !isExpanded && !isHovered
                  ? "lg:justify-center"
                  : "lg:justify-start"
              }`}
            >
              <span
                className={` ${
                  openSubmenu?.type === menuType && openSubmenu?.index === index
                    ? "menu-item-icon-active"
                    : "menu-item-icon-inactive"
                }`}
              >
                {nav.icon}
              </span>
              {(isExpanded || isHovered || isMobileOpen) && (
                <span className={`menu-item-text`}>{nav.name}</span>
              )}
              {(isExpanded || isHovered || isMobileOpen) && (
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
                className={`menu-item group ${
                  isActive(nav.path) ? "menu-item-active" : "menu-item-inactive"
                }`}
              >
                <span
                  className={`${
                    isActive(nav.path)
                      ? "menu-item-icon-active"
                      : "menu-item-icon-inactive"
                  }`}
                >
                  {nav.icon}
                </span>
                {(isExpanded || isHovered || isMobileOpen) && (
                  <span className={`menu-item-text`}>{nav.name}</span>
                )}
              </Link>
            )
          )}
          {nav.subItems && (isExpanded || isHovered || isMobileOpen) && (
            <div
              ref={(el) => {
                subMenuRefs.current[`${menuType}-${index}`] = el;
              }}
              className="overflow-hidden transition-all duration-300"
              style={{
                height:
                  openSubmenu?.type === menuType && openSubmenu?.index === index
                    ? `${subMenuHeight[`${menuType}-${index}`]}px`
                    : "0px",
              }}
            >
              <ul className="mt-2 space-y-1 ml-9">
                {nav.subItems.map((subItem) => (
                  <li key={subItem.name}>
                    <Link
                      href={subItem.path}
                      className={`menu-dropdown-item ${
                        isActive(subItem.path)
                          ? "menu-dropdown-item-active"
                          : "menu-dropdown-item-inactive"
                      }`}
                    >
                      {subItem.name}
                      <span className="flex items-center gap-1 ml-auto">
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
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </li>
      ))}
    </ul>
  );

  const [openSubmenu, setOpenSubmenu] = useState<{
    type: "main" | "support" | "others";
    index: number;
  } | null>(null);
  const [subMenuHeight, setSubMenuHeight] = useState<Record<string, number>>(
    {}
  );
  const subMenuRefs = useRef<Record<string, HTMLDivElement | null>>({});

  // const isActive = (path: string) => path === pathname;

  const isActive = useCallback((path: string) => path === pathname, [pathname]);

  useEffect(() => {
    // Check if the current path matches any submenu item
    let submenuMatched = false;
    ["main", "support", "others"].forEach((menuType) => {
      const items =
        menuType === "main"
          ? navItems
          : menuType === "support"
          ? supportItems
          : othersItems;
      items.forEach((nav, index) => {
        if (nav.subItems) {
          nav.subItems.forEach((subItem) => {
            if (isActive(subItem.path)) {
              setOpenSubmenu({
                type: menuType as "main" | "support" | "others",
                index,
              });
              submenuMatched = true;
            }
          });
        }
      });
    });

    // If no submenu item matches, close the open submenu
    if (!submenuMatched) {
      setOpenSubmenu(null);
    }
  }, [pathname, isActive]);

  useEffect(() => {
    // Set the height of the submenu items when the submenu is opened
    if (openSubmenu !== null) {
      const key = `${openSubmenu.type}-${openSubmenu.index}`;
      if (subMenuRefs.current[key]) {
        setSubMenuHeight((prevHeights) => ({
          ...prevHeights,
          [key]: subMenuRefs.current[key]?.scrollHeight || 0,
        }));
      }
    }
  }, [openSubmenu]);

  const handleSubmenuToggle = (
    index: number,
    menuType: "main" | "support" | "others"
  ) => {
    setOpenSubmenu((prevOpenSubmenu) => {
      if (
        prevOpenSubmenu &&
        prevOpenSubmenu.type === menuType &&
        prevOpenSubmenu.index === index
      ) {
        return null;
      }
      return { type: menuType, index };
    });
  };

  return (
    <aside
      className={`fixed mt-16 flex flex-col lg:mt-0 top-0 px-5 left-0 bg-white dark:bg-gray-900 dark:border-gray-800 text-gray-900 h-full transition-all duration-300 ease-in-out z-50 border-r border-gray-200 
        ${
          isExpanded || isMobileOpen
            ? "w-[290px]"
            : isHovered
            ? "w-[290px]"
            : "w-[90px]"
        }
        ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0`}
      onMouseEnter={() => !isExpanded && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className={`py-8 flex  ${
          !isExpanded && !isHovered ? "lg:justify-center" : "justify-start"
        }`}
      >
        {isExpanded || isHovered || isMobileOpen ? (
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
          <Link href={"/"}>ABC</Link>
        )}
      </div>
      <div className="flex flex-col overflow-y-auto  duration-300 ease-linear no-scrollbar">
        <nav className="mb-6">
          <div className="flex flex-col gap-4">
            <div>
              <h2
                className={`mb-4 text-xs uppercase flex leading-[20px] text-gray-400 ${
                  !isExpanded && !isHovered
                    ? "lg:justify-center"
                    : "justify-start"
                }`}
              >
                {isExpanded || isHovered || isMobileOpen ? (
                  "Menu"
                ) : (
                  <HorizontaLDots />
                )}
              </h2>
              {renderMenuItems(navItems, "main")}
            </div>
            <div>
              <h2
                className={`mb-4 text-xs uppercase flex leading-[20px] text-gray-400 ${
                  !isExpanded && !isHovered
                    ? "lg:justify-center"
                    : "justify-start"
                }`}
              >
                {isExpanded || isHovered || isMobileOpen ? (
                  "Support"
                ) : (
                  <HorizontaLDots />
                )}
              </h2>
              {renderMenuItems(supportItems, "support")}
            </div>
            <div>
              <h2
                className={`mb-4 text-xs uppercase flex leading-[20px] text-gray-400 ${
                  !isExpanded && !isHovered
                    ? "lg:justify-center"
                    : "justify-start"
                }`}
              >
                {isExpanded || isHovered || isMobileOpen ? (
                  "Others"
                ) : (
                  <HorizontaLDots />
                )}
              </h2>
              {renderMenuItems(othersItems, "others")}
            </div>
          </div>
        </nav>
        {/* {isExpanded || isHovered || isMobileOpen ? <SidebarWidget /> : null} */}
      </div>
    </aside>
  );
};

export default AppSidebar;
