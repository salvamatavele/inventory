"use client";

import { Fragment, useState, memo } from "react";
import { Dialog, DialogPanel, Transition, TransitionChild, } from "@headlessui/react";
import {
  Bars3Icon,
  XMarkIcon,
  HomeIcon,
  CubeIcon,
  TagIcon,
  TruckIcon,
  ChartBarIcon,
  UserGroupIcon,
  ArrowRightEndOnRectangleIcon,
} from "@heroicons/react/24/outline";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { labels } from "@/config/labels";

const navigation = [
  { name: labels.navigation.dashboard, href: "/dashboard", icon: HomeIcon },
  { name: labels.navigation.products, href: "/products", icon: CubeIcon },
  { name: labels.navigation.categories, href: "/categories", icon: TagIcon },
  { name: labels.navigation.suppliers, href: "/suppliers", icon: TruckIcon },
  { name: labels.navigation.transactions, href: "/transactions", icon: ArrowRightEndOnRectangleIcon },
  { name: labels.navigation.reports, href: "/reports", icon: ChartBarIcon },
  { name: labels.navigation.users, href: "/users", icon: UserGroupIcon },
];

const NavigationItem = memo(({ item, pathname }: { item: typeof navigation[0], pathname: string }) => (
  <li key={item.name}>
    <Link
      href={item.href}
      className={cn(
        pathname === item.href
          ? "bg-gray-800 text-white"
          : "text-gray-400 hover:text-white hover:bg-gray-800",
        "group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold"
      )}
    >
      <item.icon className="h-6 w-6 shrink-0" aria-hidden="true" />
      {item.name}
    </Link>
  </li>
));
NavigationItem.displayName = "NavigationItem";

const NavigationList = memo(({ pathname }: { pathname: string }) => (
  <ul role="list" className="-mx-2 space-y-1">
    {navigation.map((item) => (
      <NavigationItem key={item.href} item={item} pathname={pathname} />
    ))}
  </ul>
));
NavigationList.displayName = "NavigationList";

const SidebarContent = memo(({ pathname }: { pathname: string }) => (
  <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-gray-900 px-6 pb-4">
    <div className="flex h-16 shrink-0 items-center">
      <h1 className="text-xl font-bold text-white">Inventário</h1>
    </div>
    <nav className="flex flex-1 flex-col">
      <ul role="list" className="flex flex-1 flex-col gap-y-7">
        <li>
          <NavigationList pathname={pathname} />
        </li>
        <li className="mt-auto">
          <button
            onClick={() => signOut()}
            className="text-gray-400 hover:text-white hover:bg-gray-800 group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold w-full"
          >
            <ArrowRightEndOnRectangleIcon
              className="h-6 w-6 shrink-0"
              aria-hidden="true"
            />
            {labels.auth.signOut}
          </button>
        </li>
      </ul>
    </nav>
  </div>
));
SidebarContent.displayName = "SidebarContent";

function MainLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  const { data: session } = useSession();

  return (
    <>
      <div>
        <Transition show={sidebarOpen} as={Fragment}>
          <Dialog
            as="div"
            className="relative z-50 lg:hidden"
            onClose={setSidebarOpen}
          >
            <TransitionChild
              as={Fragment}
              enter="transition-opacity ease-linear duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="transition-opacity ease-linear duration-300"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-gray-900/80" />
            </TransitionChild>

            <div className="fixed inset-0 flex">
              <TransitionChild
                as={Fragment}
                enter="transition ease-in-out duration-300 transform"
                enterFrom="-translate-x-full"
                enterTo="translate-x-0"
                leave="transition ease-in-out duration-300 transform"
                leaveFrom="translate-x-0"
                leaveTo="-translate-x-full"
              >
                <DialogPanel className="relative mr-16 flex w-full max-w-xs flex-1">
                  <TransitionChild
                    as={Fragment}
                    enter="ease-in-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in-out duration-300"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                  >
                    <div className="absolute left-full top-0 flex w-16 justify-center pt-5">
                      <button
                        type="button"
                        className="-m-2.5 p-2.5"
                        onClick={() => setSidebarOpen(false)}
                      >
                        <span className="sr-only">Fechar menu</span>
                        <XMarkIcon
                          className="h-6 w-6 text-white"
                          aria-hidden="true"
                        />
                      </button>
                    </div>
                  </TransitionChild>
                  <SidebarContent pathname={pathname} />
                </DialogPanel>
              </TransitionChild>
            </div>
          </Dialog>
        </Transition>

        {/* Static sidebar for desktop */}
        <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
          <SidebarContent pathname={pathname} />
        </div>

        <div className="lg:pl-72">
          <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-slate-600 px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
            <button
              type="button"
              className="-m-2.5 p-2.5 text-gray-700 lg:hidden"
              onClick={() => setSidebarOpen(true)}
            >
              <span className="sr-only">Abrir menu</span>
              <Bars3Icon className="h-6 w-6" aria-hidden="true" />
            </button>

            <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
              <div className="flex items-center gap-x-4 lg:gap-x-6 ml-auto">
                <span className="text-sm font-medium">
                  {session?.user?.name || session?.user?.email}
                </span>
              </div>
            </div>
          </div>

          <main className="py-10">
            <div className="px-4 sm:px-6 lg:px-8 ">{children}</div>
          </main>
        </div>
      </div>
    </>
  );
}

export default memo(MainLayout); 