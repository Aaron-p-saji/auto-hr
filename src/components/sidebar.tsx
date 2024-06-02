"use client";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { Raleway } from "next/font/google";
// import { useUserStore } from "@/providers/context";
import { usePathname } from "next/navigation";
import Link from "next/link";
// import { logout } from "@/functions/auth";
import { boolean, string } from "zod";
import { User } from "lucide-react";

type Props = {};

const raleway = Raleway({ weight: "900", subsets: ["latin"] });

const Sidebar = (props: Props) => {
  //   const { first_name, email } = useUserStore();
  //   const { staff } = useUserStore();
  const pathname = usePathname();
  const navlinks = [
    { name: "User Management", link: "/user-management", adminOnly: true },
    { name: "Post Management", link: "/post-management", adminOnly: false },
  ];
  useEffect(() => {});
  return (
    <div className="flex h-screen flex-col justify-between border-e bg-white w-[8vw] lg:w-[25vw] lg:max-w-[300px] transition-all ease-linear">
      <div className="px-[1vw] py-[3vh]">
        <Link href="/" className="cursor-pointer">
          <span
            className={`hidden py-[0.8vh] w-[60%] place-content-center rounded-lg lg:flex bg-gray-100 text-lg font-bold text-gray-600 ${raleway.className}`}
          >
            dominé
          </span>
          <span
            className={`flex py-[0.8vh] w-[60%] place-content-center rounded-lg lg:hidden bg-gray-100 text-lg font-bold text-gray-600 ${raleway.className} w-fit p-3`}
          >
            d
          </span>
        </Link>

        <ul className="mt-[1.2vh] space-y-[0.5vh]">
          {navlinks.map((nav, index) =>
            true ? ( //WIP
              <li key={index}>
                <Link
                  href={nav.link}
                  className={`block rounded-lg w-fit lg:w-full p-2 text-sm font-medium text-gray-700 ${
                    pathname.includes(nav.link)
                      ? "bg-gray-100"
                      : "bg-transparent"
                  }`}
                >
                  <User className="lg:hidden block" width={20} />
                  <span className="lg:block hidden">{nav.name}</span>
                </Link>
              </li>
            ) : (
              !nav.adminOnly && (
                <li key={index}>
                  <Link
                    href={nav.link}
                    className={`block rounded-lg w-fit p-2 text-sm font-medium text-gray-700 ${
                      pathname.includes(nav.link)
                        ? "bg-gray-100"
                        : "bg-transparent"
                    }`}
                  >
                    <User className="lg:hidden block" width={20} />
                    <span className="lg:block hidden">{nav.name}</span>
                  </Link>
                </li>
              )
            )
          )}
        </ul>
      </div>

      <div className="sticky inset-x-0 bottom-0 border-t border-gray-100">
        <div className="flex items-center gap-2 p-2 bg-white hover:bg-gray-50">
          <div className="dropdown dropdown-top">
            <Image
              tabIndex={0}
              alt=""
              width={20}
              height={20}
              src="https://images.unsplash.com/photo-1600486913747-55e5470d6f40?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80"
              className="size-10 rounded-full object-cover"
            />
            <ul
              tabIndex={0}
              className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52"
            >
              <li>{/* <span onClick={logout}>Logout</span> */}</li> {/**WIP */}
              <li>
                <a>Item 2</a>
              </li>
            </ul>
          </div>

          <div>
            <p className="text-xs lg:block hidden">
              {/* <strong className="block font-medium">{first_name}</strong> */}{" "}
              WIP
              {/* <span> {email} </span> */} WIP
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
