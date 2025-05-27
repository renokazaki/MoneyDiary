"use client";
import { SignedIn, UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { Home, Calendar } from "lucide-react";
import { usePathname } from "next/navigation";

export default function Header() {
  const pathname = usePathname();

  const navigation = [
    { name: "Home", href: "/dashboard", icon: Home },
    { name: "Calendars", href: "/calendar", icon: Calendar },
  ];

  return (
    <SignedIn>
      <div className="w-full sm:px-6 lg:px-8 ">
        <div className="flex justify-between items-center h-12">
          <div className="flex">
            <nav className="text-lg font-medium flex space-x-4">
              {navigation.map((item) => {
                const isActive = pathname === item.href;
                const Icon = item.icon;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center px-4 py-1 ${
                      isActive
                        ? "border-b-2 border-blue-500 text-blue-400"
                        : "text-gray-300 hover:text-white"
                    }`}
                  >
                    <Icon className="mr-2 w-5 h-5" />
                    <span className="hidden sm:inline-block">{item.name}</span>
                  </Link>
                );
              })}
            </nav>
          </div>
          <div className="flex items-center gap-4 ">
            <UserButton />
          </div>
        </div>
      </div>
    </SignedIn>
  );
}
