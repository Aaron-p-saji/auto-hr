"use client";
import { certificate } from "@/providers/zodTypes";
import Image from "next/image";
import Link from "next/link";
import React, { useState, useRef, useEffect } from "react";
import ReactDOM from "react-dom";

type Props = {
  certiList: Array<certificate>;
  isLoading: Boolean;
  onClick: any;
  selectedId: certificate | null;
};

type DropdownMenuProps = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  buttonRef: React.RefObject<HTMLButtonElement>;
  menuRef: React.RefObject<HTMLDivElement>;
  userId: string;
};

const DropdownMenu = ({
  open,
  setOpen,
  buttonRef,
  menuRef,
  userId,
}: DropdownMenuProps) => {
  const [position, setPosition] = useState({ top: 0, left: 0 });

  useEffect(() => {
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setPosition({ top: rect.bottom, left: rect.left });
    }
  }, [buttonRef, open]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target as Node) &&
        !buttonRef.current?.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handler);

    return () => {
      document.removeEventListener("mousedown", handler);
    };
  }, [menuRef, buttonRef, setOpen]);

  return open
    ? ReactDOM.createPortal(
        <div
          ref={menuRef}
          className="absolute z-[100] mt-2 w-56 rounded-md border border-gray-100 bg-white shadow-lg"
          style={{ top: position.top, left: position.left }}
          role="menu"
        >
          <div className="p-2">
            <Link
              href={`/intern-management/certificates/${userId}`}
              className="block rounded-lg px-4 py-2 text-sm text-gray-500 hover:bg-gray-50 hover:text-gray-700"
              role="menuitem"
            >
              Send Certificate
            </Link>
            <Link
              href="#"
              className="block rounded-lg px-4 py-2 text-sm text-gray-500 hover:bg-gray-50 hover:text-gray-700"
              role="menuitem"
            >
              Send Email
            </Link>
            <Link
              href="#"
              className="block rounded-lg px-4 py-2 text-sm text-gray-500 hover:bg-gray-50 hover:text-gray-700"
              role="menuitem"
            >
              Edit User
            </Link>
            <Link
              href="#"
              className="flex w-full items-center gap-2 rounded-lg px-4 py-2 text-sm text-red-700 hover:bg-red-50"
              role="menuitem"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
              Delete Product
            </Link>
          </div>
        </div>,
        document.body
      )
    : null;
};

const Tables = ({ certiList, isLoading, onClick, selectedId }: Props) => {
  const [open, setOpen] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const handleOptionsClick = (userId: string) => {
    setCurrentUserId(userId);
    setOpen(!open);
  };

  return (
    <div
      className={`overflow-x-auto ${
        isLoading ? "border-0" : "border-2"
      } rounded-lg max-h-[60vh] select-none scrollbar scrollbar-w-2 scrollbar-thumb-[#696969b1] scrollbar-thumb-rounded-full scrollbar-h-2 scrollbar-transparent`}
    >
      {isLoading ? (
        <>
          <div className="skeleton h-[10vw] w-full"></div>
        </>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>Id</th>
              <th>File Name</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {certiList.length > 0 ? (
              certiList.map((value, index) => (
                <tr
                  key={index}
                  className="hover:bg-[#a0a0a098] transition-all"
                  onClick={(e) => {
                    e.preventDefault();
                    console.log(selectedId);
                    console.log(value);
                    if (selectedId !== null) {
                      if (selectedId.id !== value.id) {
                        onClick({
                          id: value.id,
                          filename: value.filename,
                        });
                      } else {
                        onClick(null);
                      }
                    } else {
                      onClick({
                        id: value.id,
                        filename: value.filename,
                      });
                    }
                  }}
                >
                  <td>{index + 1}</td>
                  <td>
                    <span>{value.filename}</span>
                  </td>
                  <th>
                    <button
                      ref={buttonRef}
                      className="btn btn-ghost btn-xs"
                      onClick={() => {}}
                    >
                      Send
                    </button>
                  </th>
                </tr>
              ))
            ) : (
              <></>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Tables;
