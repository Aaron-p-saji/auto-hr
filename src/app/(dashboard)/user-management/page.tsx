"use client";
import React, { useEffect, useState } from "react";
import Tables from "./_components/tables";
import Link from "next/link";
import { Plus } from "lucide-react";

type Props = {};

const Page = (props: Props) => {
  type user = {
    id: number;
    first_name: string;
    email: string;
    is_staff: true;
  };
  const [userList, setUserList] = useState<user[]>([]);
  const [filteredUserList, setFilteredUserList] = useState<user[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [alert, setAlert] = useState<boolean>(false);

  useEffect(() => {
    // Filter user list based on search query
    const filtered = userList.filter(
      (user) =>
        user.first_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredUserList(filtered);
  }, [searchQuery, userList]);
  return (
    <div className="flex flex-col w-full space-y-[5vh]">
      {alert && (
        <div
          role="alert"
          className="alert alert-error w-[25vw] bottom-10 absolute right-10"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="stroke-current shrink-0 h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span>Error! Fetch failed successfully.</span>
        </div>
      )}
      <span className={`text-[3vw] font-uber_move`}>User Management</span>
      <div className="flex justify-between">
        <input
          type="text"
          placeholder="Search"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="input input-bordered !border-[#4e4e4e] border-2 w-[40%]"
        />
        <Link href="user-management/create">
          <button className="btn btn-info">
            <Plus />
            Create User
          </button>
        </Link>
      </div>
      <Tables userList={filteredUserList} />
    </div>
  );
};

export default Page;
