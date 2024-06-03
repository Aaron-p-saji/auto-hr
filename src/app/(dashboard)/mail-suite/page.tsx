"use client";
import { Paperclip } from "lucide-react";
import Image from "next/image";
import React, { useState } from "react";

type Props = {};

const Page = (props: Props) => {
  const [isFocused, setIsFocused] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [status, setStatus] = useState<
    "initial" | "uploading" | "success" | "fail"
  >("initial");

  const handleFocus = () => setIsFocused(true);
  const handleBlur = () => setIsFocused(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setFiles(Array.from(event.target.files));
    }
  };

  const removeFile = (index: number) => {
    setFiles(files.filter((file, i) => i !== index));
  };
  return (
    <div className="text-black w-full">
      <form className="w-full">
        <div className="grid grid-cols-1 grid-rows-10">
          {/* Recipient */}
          <div className="col-span-1 row-span-2">
            <label className="form-control w-full">
              <div className="label">
                <span className="label-text">Recipient</span>
              </div>
              <div
                className={`w-full border-black/50 ring-offset-2 ring-black/60 flex space-x-2 h-full border-2 p-2 rounded-lg items-center transition-all ${
                  isFocused ? "ring-2" : ""
                }`}
              >
                <div className="inline-flex flex-nowrap items-center bg-white border border-gray-200 rounded-full p-1.5">
                  <div className="whitespace-nowrap text-sm font-medium text-gray-800">
                    testbot@gmail.com
                  </div>
                  <div className="ms-2.5 inline-flex justify-center items-center size-5 rounded-full text-gray-800 bg-gray-200 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 cursor-pointer">
                    <svg
                      className="flex-shrink-0 size-3"
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M18 6L6 18"></path>
                      <path d="M6 6l12 12"></path>
                    </svg>
                  </div>
                </div>
                <select
                  className="border-none focus:border-none hover:border-none focus:outline-none"
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                >
                  <option>Star Wars</option>
                  <option>Harry Potter</option>
                  <option>Lord of the Rings</option>
                  <option>Planet of the Apes</option>
                  <option>Star Trek</option>
                </select>
              </div>
            </label>
          </div>
          {/* Subject */}
          <div className="col-span-1 row-span-2">
            <label className="form-control w-full">
              <div className="label">
                <span className="label-text">Subject</span>
              </div>
              <input
                type="text"
                placeholder="Your Upcoming Performance Review - Schedule Your Meeting"
                className="input input-bordered w-full"
              />
            </label>
          </div>
          {/* Compose */}
          <div className="col-span-1 row-span-6">
            <label className="form-control h-full space-y-1">
              <div className="label">
                <span className="label-text">Message</span>
              </div>
              <textarea
                className="textarea textarea-bordered h-full resize-none"
                placeholder="Dear [...employee]"
              ></textarea>
              <div className="min-w-[25%] w-fit h-12 rounded-b-lg rounded-t-md border-black/30 border-2 flex p-1 items-center space-x-2">
                <div className="flex items-center bg-black/10 hover:bg-black/20 transition-all rounded-lg p-0">
                  <input
                    type="file"
                    id="file-input"
                    className="hidden"
                    multiple
                    accept=".doc,.docx,.pdf,.csv,.xlsx"
                    onChange={handleFileChange}
                  />
                  <label htmlFor="file-input">
                    <Paperclip size={20} className="m-2" />
                  </label>
                </div>
                {files &&
                  files.map((file, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center gap-x-1.5 py-1.5 ps-3 pe-2 rounded-full text-xs font-medium bg-blue-100 text-blue-800 "
                    >
                      {file.name}
                      <button
                        type="button"
                        onClick={() => {
                          removeFile(index);
                        }}
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
            </label>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Page;
