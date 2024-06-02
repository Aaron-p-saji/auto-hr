import Sidebar from "@/components/sidebar";
import React from "react";

type Props = {
  children: React.ReactNode;
};

const layout = ({ children }: Props) => {
  return (
    <div className="flex">
      <Sidebar />
      <div className="flex justify-center w-full pt-[10vh]">
        <div className="flex w-[60vw]">{children}</div>
      </div>
    </div>
  );
};

export default layout;
