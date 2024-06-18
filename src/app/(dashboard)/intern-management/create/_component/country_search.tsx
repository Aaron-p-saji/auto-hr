"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useRouter, useSearchParams } from "next/navigation";
import styles from "./search.module.css";
import { useDebounce } from "./debounce";

type Props = {};

export type Institute = {
  name: string;
};

const CountrySearch = (props: Props) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [search, setSearch] = useState("");
  const debouncedInput = useDebounce(search);
  const [searchResults, setSearchResults] = useState<Institute[]>([]);
  const [institution, setInstitution] = useState<Institute | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

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
  }, [searchParams, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setInstitution(null); // Clear the institution when typing a new search
  };

  const transformInstituteData = (data: any): Institute => {
    return {
      name: data.name.common,
    };
  };

  useEffect(() => {
    const handleSearch = async () => {
      setIsLoading(true);
      try {
        if (search !== "") {
          const response = await axios.get(
            `https://restcountries.com/v3.1/name/${search}`
          );
          const transformedData = response.data.map(transformInstituteData);
          setSearchResults(transformedData);
        } else {
          setSearchResults([]);
        }
      } catch (error) {
        console.error("Error searching institutions:", error);
        setSearchResults([]);
      } finally {
        setIsLoading(false);
      }
    };

    const delayDebounceFn = setTimeout(() => {
      handleSearch();
    }, 300); // Debounce search to avoid excessive API calls

    return () => clearTimeout(delayDebounceFn);
  }, [search]);

  const handleInstitute = (institute: Institute) => {
    setInstitution(institute);
    setSearch("");
    setSearchResults([]);
  };

  return (
    <section className="col-span-1 row-span-2">
      <div className="relative w-full">
        <label className="form-control w-full">
          <input
            type="text"
            className={`input input-bordered w-full`}
            placeholder="Search ..."
            autoComplete="off"
            value={search || institution?.name || ""}
            onChange={handleChange}
          />
        </label>

        <div
          className={`${styles.search_result} ${
            search
              ? "bg-white border-gray-200 border-[1.5px] h-fit overflow-y-scroll scrollbar scrollbar-w-1 scrollbar-thumb-[#696969b1] scrollbar-thumb-rounded-full scrollbar-h-2"
              : ""
          } z-50`}
        >
          {isLoading ? (
            <div className="py-1 flex flex-col space-y-2 w-full justify-center animate-pulse">
              {[...Array(10)].map((_, index) => (
                <div
                  key={index}
                  className="h-5 w-[100%] rounded-lg bg-slate-400 text-sm"
                ></div>
              ))}
            </div>
          ) : (
            searchResults &&
            searchResults.map((item, index) => (
              <div
                key={index}
                onClick={() => handleInstitute(item)}
                className="hover:overflow-hidden hover:bg-neutral-200 p-2 rounded-lg cursor-pointer text-ellipsis"
              >
                {item.name}
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
};

export { CountrySearch };
