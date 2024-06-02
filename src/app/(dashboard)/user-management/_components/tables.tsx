"use client";
import Image from "next/image";
import Link from "next/link";
import React from "react";

type users = {
  id: number;
  first_name: string;
  email: string;
  is_staff: true;
};

type Props = {
  userList: Array<users>;
};

const Tables = ({ userList }: Props) => {
  return (
    <div className="overflow-x-auto border-2 rounded-lg max-h-[60vh] select-none scrollbar scrollbar-w-2 scrollbar-thumb-[#696969b1] scrollbar-thumb-rounded-full scrollbar-h-2 scrollbar-transparent">
      <table className="table">
        <thead>
          <tr>
            <th>Id</th>
            <th>Name</th>
            <th>User Type</th>

            <th></th>
          </tr>
        </thead>

        <tbody>
          {userList.length > 0 ? (
            userList.map((value, index) => (
              <tr key={index} className="hover:bg-[#a0a0a098] transition-all">
                <td>{value.id}</td>
                <td>
                  <div className="flex items-center gap-3">
                    <div className="avatar">
                      <div className="mask mask-squircle w-12 h-12">
                        <Image
                          width={40}
                          height={40}
                          src="https://img.daisyui.com/tailwind-css-component-profile-2@56w.png"
                          alt="Avatar Tailwind CSS Component"
                        />
                      </div>
                    </div>
                    <div>
                      <div className="font-bold">{value.first_name}</div>
                      <div className="text-sm">{value.email}</div>
                    </div>
                  </div>
                </td>
                <td>
                  <span
                    className={`badge badge-ghost badge-sm ${
                      value.is_staff && "bg-red-400 text-white border-0"
                    }`}
                  >
                    {value.is_staff ? "Admin" : "Non-Admin"}
                  </span>
                </td>

                <th>
                  <Link href={`/user-management/details/${value.id}`}>
                    <button className="btn btn-ghost btn-xs">details</button>
                  </Link>
                </th>
              </tr>
            ))
          ) : (
            <></>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Tables;
