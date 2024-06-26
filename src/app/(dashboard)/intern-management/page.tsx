"use client";
import React, { useEffect, useState } from "react";
import Tables from "./_components/tables";
import Link from "next/link";
import { Plus } from "lucide-react";
import axios from "axios";
import { useAuthStore } from "@/providers/context";
import { UserFields } from "@/providers/zodTypes";
import { toast as alertT } from "sonner";
type Props = {};

const Page = (props: Props) => {
  const [userList, setUserList] = useState<UserFields[]>([]);
  const [filteredUserList, setFilteredUserList] = useState<UserFields[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [tableLoading, setTableLoading] = useState<boolean>(false);

  useEffect(() => {
    const filtered = userList.filter(
      (user) =>
        user.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredUserList(filtered);
  }, [searchQuery, userList]);

  useEffect(() => {
    const fetchUserList = async () => {
      try {
        setTableLoading(true);
        const res = await axios.get("http://localhost:8000/api/intern/", {
          params: {
            all: true,
          },
          headers: {
            Authorization: `Bearer ${useAuthStore.getState().token}`,
          },
        });
        if (res.status === 200) {
          setUserList(res.data);
        } else {
          alertT.error("An Unexpected Error Occured", {
            description: `Error ${res.status}`,
            duration: 2000,
          });
        }
      } catch (error) {
        console.log(error);
        alertT.error("An Unexpected Error Occured", {
          description: `Error ${error}`,
          duration: 2000,
        });
      } finally {
        setTableLoading(false);
      }
    };
    fetchUserList();
  }, []);
  return (
    <div className="flex flex-col mt-[10vh] ml-[10%] w-[80%] space-y-[5vh] ">
      <span className={`text-[3vw] font-uber_move font-bold`}>
        User Management
      </span>
      <div className="flex justify-between">
        <input
          type="text"
          placeholder="Search"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="input input-bordered !border-[#4e4e4e] border-2 w-[40%]"
        />
        <Link href="intern-management/create">
          <button className="btn btn-info">
            <Plus />
            Create User
          </button>
        </Link>
      </div>
      <Tables userList={filteredUserList} isLoading={tableLoading} />
    </div>
  );
};

export default Page;
