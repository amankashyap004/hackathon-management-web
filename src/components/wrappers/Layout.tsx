import React, { ReactNode } from "react";
import Header from "../common/Header";
import Footer from "../common/Footer";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="w-full overflow-hidden">
      <Header />
      {children}
      <Footer />
    </div>
  );
};

export default Layout;
