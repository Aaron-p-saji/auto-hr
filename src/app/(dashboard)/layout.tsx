import Sidebar from "@/components/sidebar";
import React from "react";

type Props = {
  children: React.ReactNode;
};

const layout = ({ children }: Props) => {
  return (
    <div className="flex">
      <Sidebar />
      <div className="flex justify-center w-full">
        <div className="flex w-full">{children}</div>
      </div>
    </div>
  );
};

export default layout;
