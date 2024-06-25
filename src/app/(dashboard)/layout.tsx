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
        <div className="flex w-full h-screen overflow-x-hidden overflow-y-auto scrollbar-h-2 scrollbar scrollbar-w-2 scrollbar-thumb-[#696969b1] scrollbar-thumb-rounded-full">
          {children}
        </div>
      </div>
    </div>
  );
};

export default layout;
