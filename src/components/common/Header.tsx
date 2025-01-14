"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { IoClose, IoMenu } from "react-icons/io5";
import { useAuthContext } from "@/contexts/AuthContext";
import Container from "../wrappers/Container";
import Button from "../ui/Button";

const navItems = [
  { name: "Home", href: "/" },
  { name: "Hackathons List", href: "#hackathons-list" },
];

const Header: React.FC = () => {
  const pathname = usePathname();

  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrollingUp, setScrollingUp] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isTop, setIsTop] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setIsTop(currentScrollY <= 40);

      if (currentScrollY > lastScrollY && currentScrollY > 20) {
        setScrollingUp(false);
      } else {
        setScrollingUp(true);
      }
      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [lastScrollY]);

  const NavLinks = ({ className }: { className?: string }) => (
    <nav
      className={`flex flex-col lg:flex-row justify-between lg:items-center gap-6 lg:gap-14 w-full ${className}`}
    >
      {navItems.map((item, index) => (
        <Link
          key={index}
          href={item.href}
          className={`font-medium transition-all duration-300 hover:text-white ${
            pathname === item.href ? "text-white" : "text-[#D4D2D3]"
          }`}
          onClick={() => isMobileMenuOpen && setMobileMenuOpen(false)}
        >
          {item.name}
        </Link>
      ))}
    </nav>
  );

  return (
    <header
      className={`shadow-sm fixed top-0 left-0 w-full z-50 transition-transform duration-300 ${
        isScrollingUp ? "lg:translate-y-0" : " lg:-translate-y-full"
      } ${
        isTop
          ? "bg-black lg:bg-transparent"
          : "bg-black lg:bg-black/80 lg:backdrop-blur"
      }`}
    >
      <Container className="py-4">
        <div className="flex justify-between items-center gap-8 w-full">
          <div className="">
            <BrandLogo />
          </div>
          <div className="hidden lg:block">
            <NavLinks />
          </div>

          <div className="hidden lg:block">
            <NavButtons />
          </div>

          <div className="lg:hidden">
            <button
              className="text-3xl"
              onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <IoClose /> : <IoMenu />}
            </button>
          </div>
        </div>
      </Container>

      {isMobileMenuOpen && (
        <div className="fixed inset-0 flex bg-black/50 backdrop-blur z-40 w-full h-full">
          <div className="relative w-full h-full p-4 !bg-black drop-shadow-lg">
            <BrandLogo />
            <NavLinks className="mt-8" />
            <NavButtons />

            <button
              className="absolute top-4 right-4 text-3xl hover:text-[#E16B31]"
              onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}
            >
              <IoClose />
            </button>
          </div>

          <div className="flex-1" onClick={() => setMobileMenuOpen(false)} />
        </div>
      )}
    </header>
  );
};

export default Header;

const BrandLogo = () => (
  <Link href="/" className="flex items-center gap-2">
    <Image
      src="/images/logo.png"
      alt="logo"
      width={200}
      height={200}
      quality={100}
      className="object-contain w-10 lg:w-12 h-10 lg:h-12"
    />
    <div className="-space-y-1">
      <p className="text-lg lg:text-2xl font-extrabold text-nowrap">
        Hackathon
      </p>
      <p className="text-xs lg:text-sm font-extrabold text-nowrap text-end">
        Management
      </p>
    </div>
  </Link>
);

const NavButtons = () => {
  const { user } = useAuthContext();
  return (
    <div>
      {user ? (
        <Link href="/dashboard">
          <Button className="uppercase">Dashboard</Button>
        </Link>
      ) : (
        <div className="flex flex-col lg:flex-row lg:items-center gap-6 lg:gap-4">
          <Link href="/login">
            <Button className="uppercase">Login</Button>
          </Link>
          <Link href="/signup">
            <Button variant="secondary" className="uppercase">
              Sign up
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
};
