"use client";
import axios from "axios";
import { Copy, DownloadIcon, Share2Icon, X } from "lucide-react";
import React, { useEffect, useState } from "react";
import {
  EmailShareButton,
  FacebookIcon,
  FacebookShareButton,
  LinkedinShareButton,
  TelegramShareButton,
  WhatsappIcon,
  WhatsappShareButton,
} from "react-share";

const Page = (params: { params: { fileId: string } }) => {
  const [file, setFile] = useState("");
  const [cache, setCached] = useState(false);
  const [progress, setProgress] = useState(0);

  const [shareClick, setShare] = useState<boolean>(false);

  useEffect(() => {
    const fetchThumbnail = async () => {
      try {
        setFile("");
        setCached(false);
        setProgress(0);

        const response = await axios.get(
          `http://localhost:8000/api/retrieve/`,
          {
            params: {
              filename: params.params.fileId,
            },
            responseType: "blob",
            onDownloadProgress: (progressEvent) => {
              if (progressEvent.total) {
                const progress = Math.floor(
                  (progressEvent.loaded / progressEvent.total) * 100
                );
                setProgress(progress);
              }
            },
          }
        );

        if (response.status === 200) {
          const blobUrl = URL.createObjectURL(response.data);
          setFile(blobUrl);
          setCached(true);
        }
      } catch (error) {
        console.error("Error fetching thumbnail:", error);
      }
    };

    fetchThumbnail();
  }, [params.params.fileId]); // Dependency array ensures useEffect runs on fileId change

  const shareUrl = `http://localhost:3000/viewer/file/${params.params.fileId}.pdf`;

  return file !== "" ? (
    <div className="flex w-full h-[100vh] relative">
      <iframe
        src={`${file}#toolbar=0`}
        id="viewer"
        width="100%"
        height="100%"
        title={params.params.fileId}
      />
      <button
        className="group absolute w-fit h-fit bg-white bottom-14 right-20 p-4 rounded-full hover:bg-gray-300 hover:scale-110 transition-all "
        aria-label="Download"
      >
        <span className="invisible group-hover:visible opacity-0 group-hover:opacity-100 absolute -top-14 bg-black/75 -right-3 text-white px-10 py-2 text-nowrap rounded-lg">
          Download PDF
        </span>
        <a href={file} download>
          <DownloadIcon className="hover:text-black" />
        </a>
      </button>
      <button
        className="group absolute w-fit h-fit bg-white bottom-14 right-40 p-4 rounded-full hover:bg-gray-300 hover:scale-110 transition-all "
        aria-label="Share"
        onClick={() => {
          setShare(true);
        }}
      >
        <span className="invisible group-hover:visible opacity-0 group-hover:opacity-100 absolute -top-14 bg-black/75 -right-3 text-white px-10 py-2 text-nowrap rounded-lg">
          Share PDF
        </span>
        <span>
          <Share2Icon className="hover:text-black" />
        </span>
      </button>
      <div
        className={`absolute w-full h-full bg-black/50  items-center justify-center ${
          shareClick ? "flex" : "hidden"
        }`}
      >
        <div className="flex flex-col bg-[#212121] w-[25%] h-[30%] rounded-xl p-4 space-y-2">
          <div className="flex justify-between text-white text-lg items-center">
            <span>Share</span>
            <div
              className="p-2 hover:text-[#a4a4a4] rounded-full transition"
              onClick={(e) => {
                setShare(false);
              }}
            >
              <X />
            </div>
          </div>
          <div className="flex flex-col space-y-10 py-5">
            <div className="flex space-x-2">
              <FacebookShareButton url={shareUrl} lang="english">
                <FacebookIcon className="rounded-full" />
              </FacebookShareButton>
              <WhatsappShareButton
                url={shareUrl}
                lang="english"
                title="Checkout my Certificate"
              >
                <WhatsappIcon className="rounded-full" />
              </WhatsappShareButton>
            </div>
            <div className="w-full border-2 p-2 border-white/20 rounded-xl flex h-fit space-x-7 items-center bg-black">
              <span className="text-white text-sm text-ellipsis whitespace-nowrap overflow-hidden w-[85%] select-none">
                {shareUrl}
              </span>
              <button
                type="button"
                className="p-2 px-4 text-black bg-[#3ea6ff] hover:bg-[#3ea6ff]/70 transition-all flex items-center rounded-full"
                onClick={() => {
                  navigator.clipboard.writeText(shareUrl);
                }}
              >
                Copy
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  ) : (
    <div className="h-[100vh] flex items-center justify-center">
      {progress < 100 ? (
        <div
          className="radial-progress"
          style={{ "--value": progress } as React.CSSProperties}
          role="progressbar"
        >
          {progress}%
        </div>
      ) : (
        <div>Not Found</div>
      )}
    </div>
  );
};

export default Page;
