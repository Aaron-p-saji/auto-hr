import { Metadata } from "next";
import React from "react";

type Props = {
  children: React.ReactNode;
};

export const metadata: Metadata = {
  title: {
    template: "%s's Profile",
    default: "Intern Management",
  },
  description: "Create & Manage Intern Profiles",
};

const Layout = ({ children }: Props) => {
  return <div className="w-full">{children}</div>;
};

export default Layout;
