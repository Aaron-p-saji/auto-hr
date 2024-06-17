"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuthStore } from "@/providers/context";
import { X } from "lucide-react";
import { user } from "@/providers/typeProviders";
import styles from "./search.module.css";
import { useRouter, useSearchParams } from "next/navigation";

type Props = {
  search?: string;
};

const Search = (props: Props) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState<user[]>([]);
  const [recipient, setRecipient] = useState("");

  const handleClose = () => {
    setSearch("");
    setSearchResults([]);
  };

  useEffect(() => {
    const queryEmail = searchParams.get("email");
    if (queryEmail) {
      setSearch(queryEmail);
      const currentPath = window.location.pathname;
      router.replace(currentPath);
    }
  }, [searchParams]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setRecipient(""); // Clear the recipient when typing a new search
  };

  useEffect(() => {
    const handleSearch = async () => {
      if (search !== "") {
        try {
          const response = await axios.get(
            `http://127.0.0.1:8000/api/user/?search=${search}`,
            {
              headers: {
                Authorization: `Bearer ${useAuthStore.getState().token}`,
              },
            }
          );
          setSearchResults(response.data);
        } catch (error) {
          console.error("Error searching employees:", error);
        }
      }
    };

    if (search !== "") {
      handleSearch();
    } else {
      setSearchResults([]);
    }
  }, [search]);

  const handleSelectRecipient = (email: string) => {
    setRecipient(email);
    setSearch("");
    setSearchResults([]);
  };

  return (
    <section className="col-span-1 row-span-2">
      <div className="relative w-full">
        <label className="form-control w-full">
          <div className="label">
            <span className="label-text">What is your name?</span>
          </div>
          <input
            type="text"
            className={`input input-bordered w-full `}
            placeholder="Search ..."
            autoComplete="off"
            value={search || recipient}
            onChange={handleChange}
          />
        </label>

        <div
          className={`${styles.search_result} ${
            search ? "bg-white border-gray-200 border-[1.5px]" : ""
          } z-50`}
        >
          {searchResults.map((item, index) => (
            <div
              key={index}
              onClick={() => handleSelectRecipient(item.email)}
              className="hover:overflow-hidden hover:bg-neutral-200 p-2 rounded-lg cursor-pointer"
            >
              {item.first_name} • {item.email}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Search;
