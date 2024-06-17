"use client";
import { useAuthStore } from "@/providers/context";
import axios from "axios";
import { LucideMessageSquareX, Paperclip, X } from "lucide-react";
import Image from "next/image";
import React, { MouseEventHandler, useEffect, useState } from "react";
import SearchBar from "./_component/search";
import { useRouter, useSearchParams } from "next/navigation";

type Props = {};

const Page = (props: Props) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [isFocused, setIsFocused] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [status, setStatus] = useState<
    "initial" | "uploading" | "success" | "fail"
  >("initial");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [recipients, setRecipient] = useState("");
  const [subject, setSubject] = useState("");
  const [mailBody, setMailBody] = useState("");
  const [isUploadable, setIsUploadable] = useState<boolean>(true);
  const [toast, setToast] = useState(0);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (files.length > 0) {
      setIsUploadable(files.every((file) => file.size <= 25000000));
    } else {
      setIsUploadable(true);
    }
  }, [files]);

  useEffect(() => {
    const queryEmail = searchParams.get("email");
    if (queryEmail) {
      setRecipient(queryEmail);
      const currentPath = window.location.pathname;
      router.replace(currentPath);
    }
  }, [searchParams]);

  const handleFocus = () => setIsFocused(true);
  const handleBlur = () => setIsFocused(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const newFiles = Array.from(event.target.files);
      setFiles(newFiles);
    }
  };

  const removeFile = (index: number) => {
    setFiles(files.filter((file, i) => i !== index));
  };

  const handleSubmit = async () => {
    try {
      const data = new FormData();
      data.append("recipient", recipients);
      data.append("subject", subject);
      data.append("mail", mailBody);
      files.map((item, index) => {
        data.append("files", item);
      });
      const res = await axios.post(
        "http://localhost:8000/api/sendmail/",
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (res.status === 200) {
        setToast(200);
        setMessage("Email Successfully send");
        setTimeout(() => {
          setToast(0);
        }, 1500);
      }
    } catch (error) {
      setToast(500);
      setMessage("Failed To Send Email");
      setTimeout(() => {
        setToast(0);
      }, 1500);
    }
  };

  return (
    <div className="text-black ml-[10%] w-[80%] mt-[10vh] mb-10 h-full relative flex flex-col items-center">
      <div
        role="alert"
        className={`alert ${
          toast === 200 ? "alert-success" : "alert-error"
        } w-[50%] justify-between ${
          toast !== 0 ? "text_animate flex" : "text_animate_end hidden"
        }`}
      >
        <div className="flex space-x-3">
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
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
          <span>{message}</span>
        </div>
        <X
          size={18}
          className="border-2 border-black rounded-full cursor-pointer"
          onClick={() => {
            // setWarning(false);
          }}
        />
      </div>
      <form className="w-full" onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 grid-rows-10 space-y-2">
          {/* Recipient */}
          <SearchBar search={recipients} />
          {/* Subject */}
          <div className="h-fit col-span-1 row-span-2">
            <label className="form-control w-full">
              <div className="label">
                <span className="label-text">Subject</span>
              </div>
              <input
                type="text"
                placeholder="Your Upcoming Performance Review - Schedule Your Meeting"
                className="input input-bordered w-full"
                value={subject}
                onChange={(e) => {
                  setSubject(e.target.value);
                }}
              />
            </label>
          </div>
          {/* Compose */}
          <div className="row-span-6 space-y-2">
            <label className="form-control h-full">
              <div className="label">
                <span className="label-text">Message</span>
              </div>
              <textarea
                className="textarea textarea-bordered h-full resize-none"
                placeholder="Dear [...employee]"
                value={mailBody}
                onChange={(e) => {
                  setMailBody(e.target.value);
                }}
              ></textarea>
            </label>
            <div className="min-w-[25%] w-full h-fit flex flex-col p-1 items-start space-y-4">
              <div className="flex space-x-3 w-full justify-between">
                <div className="flex bg-black/10 hover:bg-black/20 transition-all rounded-lg p-0">
                  <input
                    type="file"
                    multiple
                    accept=".doc,.docx,.pdf,.csv,.xlsx, .pptx, .ppt"
                    id="file-input"
                    onChange={handleFileChange}
                    className="file-input file-input-bordered w-full max-w-xs"
                  />
                </div>
                <button
                  className="btn btn-active btn-neutral flex-grow max-w-md"
                  type="submit"
                >
                  Neutral
                </button>
              </div>

              <div className="space-4 flex flex-wrap mb-14">
                {files &&
                  files.map((file, index) => (
                    <span
                      key={index}
                      className={`group mb-1.5 mx-1 flex justify-between max-w-64 h-6 items-center gap-x-1.5 py-1.5 ps-3 pe-2 rounded-full text-xs font-medium relative cursor-pointer ${
                        file.size > 25000000
                          ? "text-red-800 bg-red-100"
                          : "text-blue-800 bg-blue-100"
                      }`}
                    >
                      <div
                        className={`${
                          file.size > 25000000 &&
                          "group-hover:block group-hover:opacity-100"
                        } opacity-0 hidden transition absolute top-7 left-0 bg-red-200 p-2 rounded-md z-50`}
                      >
                        <span>
                          This File Exceeds the file size limit remove the file
                        </span>
                      </div>
                      <span className="overflow-hidden text-ellipsis whitespace-nowrap">
                        {file.name}
                      </span>
                      <button
                        type="button"
                        onClick={() => removeFile(index)}
                        className="flex-shrink-0 size-4 inline-flex items-center justify-center rounded-full hover:bg-blue-200 focus:outline-none focus:bg-blue-200 focus:text-blue-500"
                      >
                        <span className="sr-only">Remove badge</span>
                        <svg
                          className="flex-shrink-0 size-3"
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          stroke-width="2"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        >
                          <path d="M18 6 6 18"></path>
                          <path d="m6 6 12 12"></path>
                        </svg>
                      </button>
                    </span>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Page;
