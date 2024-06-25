import React from "react";

type Props = {
  children: React.ReactNode;
};

const Layout = ({ children }: Props) => {
  return (
    <div className="flex w-full h-full">
      <div className="w-full h-full">{children}</div>
    </div>
  );
};

export default Layout;
