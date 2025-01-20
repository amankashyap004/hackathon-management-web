import React from "react";
import Sidebar from "@/components/dashboard/Sidebar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex justify-start items-start w-full lg:p-2 lg:h-screen">
      <div className="lg:w-1/6" />
      <div className="fixed top-0 lg:top-2 lg:left-2  lg:h-[96%] w-full lg:w-1/6 z-20 lg:z-auto">
        <Sidebar />
      </div>
      <div className="flex-1 overflow-auto lg:px-2 mt-20 lg:mt-0 z-10 lg:z-auto">
        <div className="p-4 lg:p-8">{children}</div>
      </div>
    </div>
  );
}
