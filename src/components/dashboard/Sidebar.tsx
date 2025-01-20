"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import { getAuth, signOut } from "firebase/auth";
import { IoClose, IoMenu } from "react-icons/io5";
import Button from "@/components/ui/Button";
import UserProfile from "./UserProfile";

const Sidebar = () => {
  const router = useRouter();
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    const auth = getAuth();
    try {
      await signOut(auth);
      router.push("/");
      console.log("User logged out successfully");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const navItems = [
    { label: "Dashboard", href: "/dashboard" },
    { label: "Profile", href: "/dashboard/profile" },
    { label: "Hackathons", href: "/dashboard/hackathon" },
  ];

  const activePath = usePathname();

  const closeMobileMenu = () => setMobileMenuOpen(false);

  return (
    <div className="relative w-full lg:h-full bg-gray-800 text-white lg:rounded-lg">
      <section className="hidden lg:flex flex-col h-full">
        <div className="mb-4 p-4">
          <BrandLogo />
        </div>

        <div className="border-y px-4 py-6">
          <UserProfile />
        </div>

        <nav className="flex flex-col gap-2 p-4">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href}>
              <div
                className={`px-4 py-3 cursor-pointer rounded-md transition-colors duration-300 ${
                  activePath === item.href ? "bg-gray-700" : "hover:bg-gray-700"
                }`}
              >
                {item.label}
              </div>
            </Link>
          ))}
        </nav>

        <div className="lg:absolute lg:left-1/2 lg:transform lg:-translate-x-1/2 lg:bottom-6 lg:w-3/4 mt-4">
          <Button onClick={handleLogout} className="bg-red-500">
            Logout
          </Button>
        </div>
      </section>

      <section className="flex justify-between items-center w-full h-full p-4">
        <div className="">
          <BrandLogo />
        </div>

        <div className="flex items-center gap-4">
          <Button onClick={handleLogout} className="bg-red-500 !w-auto !py-2.5">
            Logout
          </Button>
          <button
            className="lg:hidden text-3xl"
            onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <IoClose /> : <IoMenu />}
          </button>
        </div>
      </section>

      {isMobileMenuOpen && (
        <section
          className={`fixed inset-0 flex lg:hidden bg-black backdrop-blur w-full h-screen z-[200] transform transition-all duration-500 ${
            isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="relative w-full h-full p-6 bg-black/80 backdrop-blur text-white">
            <div className="mb-4">
              <BrandLogo />
            </div>

            <div className="absolute top-6 right-4">
              <button
                className="lg:hidden text-3xl"
                onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? <IoClose /> : <IoMenu />}
              </button>
            </div>

            <div className="border-y px-4 py-6">
              <UserProfile />
            </div>

            <nav className="flex flex-col gap-2 p-4">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={closeMobileMenu}
                >
                  <div
                    className={`px-4 py-3 cursor-pointer rounded-md transition-colors duration-300 ${
                      activePath === item.href
                        ? "bg-gray-700"
                        : "hover:bg-gray-700"
                    }`}
                  >
                    {item.label}
                  </div>
                </Link>
              ))}
            </nav>

            <div className="lg:absolute lg:left-1/2 lg:transform lg:-translate-x-1/2 lg:bottom-6 lg:w-3/4 mt-4">
              <Button onClick={handleLogout} className="bg-red-500">
                Logout
              </Button>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default Sidebar;

const BrandLogo = () => (
  <Link href="/" className="flex items-center gap-2">
    <Image
      src="/images/logo.png"
      alt="logo"
      width={200}
      height={200}
      quality={100}
      className="object-contain w-8 lg:w-12 h-8 lg:h-12"
    />
    <div className="-space-y-1">
      <p className="lg:text-2xl font-extrabold text-nowrap">Hackathon</p>
      <p className="text-[10px] lg:text-sm font-extrabold text-nowrap text-end">
        Management
      </p>
    </div>
  </Link>
);
