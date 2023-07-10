"use client";

import {
  IconCategories,
  IconDashboard,
  IconLogout,
  IconOrders,
  IconProducts,
} from "@lib/icons";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import imgLogo from "../public/assets/logo.png";
import Image from "next/image";
import { signOut } from "next-auth/react";

export default function Nav({ showNav }) {
  const pathname = usePathname();
  const router = useRouter();

  const inactiveLink = "flex gap-2 md:gap-1 p-2 md:p-0";
  const activeLink = inactiveLink + " text-gray-900 bg-accent/20 rounded-sm";
  const inactiveIcon = "w-6 h-6";
  const activeIcon = inactiveIcon + " text-accent";

  const asideStyles =
    "p-4 text-gray-700 transition-all duration-200 fixed md:static w-2/3 md:w-auto shadow-lg md:shadow-none z-30 md:z-0 bg-neutral-100 md:bg-transparent -left-full ";
  return (
    <aside className={showNav ? asideStyles + "left-0" : asideStyles + ""}>
      <Link href={"/"} className="items-center gap-1 mb-4 mr-4 hidden md:flex">
        <Image src={imgLogo} width={40} height={40} />
        <h1 className="font-logo uppercase font-medium">Vision Vault</h1>
      </Link>
      <nav className="flex flex-col gap-4 md:gap-2">
        <Link
          href={"/"}
          className={pathname === "/" ? activeLink : inactiveLink}
        >
          <IconDashboard clas={pathname === "/" ? activeIcon : inactiveIcon} />
          Dashboard
        </Link>
        <Link
          href={"/products"}
          className={pathname.includes("/products") ? activeLink : inactiveLink}
        >
          <IconProducts
            clas={pathname.includes("/products") ? activeIcon : inactiveIcon}
          />
          Products
        </Link>
        <Link
          href={"/categories"}
          className={
            pathname.includes("/categories") ? activeLink : inactiveLink
          }
        >
          <IconCategories
            clas={pathname.includes("/categories") ? activeIcon : inactiveIcon}
          />
          Categories
        </Link>
        <Link
          href={"/orders"}
          className={pathname.includes("/orders") ? activeLink : inactiveLink}
        >
          <IconOrders
            clas={pathname.includes("/orders") ? activeIcon : inactiveIcon}
          />
          Orders
        </Link>
        <button
          onClick={async () => {
            router.push("/");
            await signOut();
          }}
          className={inactiveLink}
        >
          <IconLogout clas="w-6 h-6" />
          Logout
        </button>
      </nav>
    </aside>
  );
}
