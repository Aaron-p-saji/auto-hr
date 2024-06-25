"use client";
import React, { useState, useEffect, use } from "react";
import Tables from "./_components/tables";
import "./cer.css";
import axios from "axios";
import { useAuthStore } from "@/providers/context";
import Image from "next/image";
import { X } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { UserFields, certificate } from "@/providers/zodTypes";

const Page = (params: { params: { userId: string } }) => {
  const [selectedId, setSelectedId] = useState<certificate | null>(null);
  const [animationClass, setAnimationClass] = useState<string>("");
  const [tableLoading, setTableLoading] = useState(false);
  const [certList, setCertList] = useState<certificate[]>([]);
  const [previewLoading, setPreviewLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [thumbanil, setThumbnail] = useState("");
  const [cache, setCached] = useState<boolean>(false);
  const [fetchedUser, setFetchedUser] = useState<UserFields | null>(null);
  const [toast, setToast] = useState(0);
  const [message, setMessage] = useState("");
  const [isLoading, setLoading] = useState(false);

  const router = useRouter();

  const handleSelection = () => {
    if (selectedId !== null) {
      setAnimationClass("animate-exit");
    } else {
      setAnimationClass("animate-enter");
    }
  };
  useEffect(() => {
    const getCert = async () => {
      try {
        setCertList([]);
        setTableLoading(true);
        const res = await axios.get("http://localhost:8000/api/pdfs/list/", {
          params: {
            user_id: params.params.userId,
          },
          headers: {
            Authorization: `Bearer ${useAuthStore.getState().token}`,
          },
        });
        if (res.status === 200) {
          setCertList(res.data);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setTableLoading(false);
      }
    };
    params.params.userId && getCert();
  }, [params]);

  useEffect(() => {
    const fetchUser = async () => {
      setFetchedUser(null);
      try {
        const res = await axios.get("http://localhost:8000/api/user/", {
          params: {
            id: params.params.userId,
          },
          headers: {
            Authorization: `Bearer ${useAuthStore.getState().token}`,
          },
        });
        if (res.status === 200) {
          setFetchedUser(res.data);
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchUser();
  }, [selectedId]);

  const sendCertificate = async (filename: string) => {
    try {
      setLoading(true);
      const res = await axios.get(
        "http://localhost:8000/api/sendcertificate/",
        {
          params: {
            filename,
          },
          headers: {
            Authorization: `Bearer ${useAuthStore.getState().token}`,
          },
        }
      );
      if (res.status === 200) {
        setToast(200);
        setMessage(
          "Email request was send to the server and will complete within 1hr"
        );
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
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchThumbnail = async () => {
      try {
        setThumbnail("");
        setCached(false);
        const response = await axios.get(
          `http://localhost:8000/api/pdfs/thumbnail/${selectedId?.filename}/`,
          {
            headers: {
              Authorization: `Bearer ${useAuthStore.getState().token}`,
            },
            responseType: "arraybuffer",
            onDownloadProgress: (progressEvent) => {
              const progress = Math.floor(
                (progressEvent.loaded / progressEvent.total!) * 100
              );
              setProgress(progress);
            },
          }
        );
        const base64Image = Buffer.from(response.data, "binary").toString(
          "base64"
        );
        const imageUrl = `data:image/png;base64,${base64Image}`;
        setThumbnail(imageUrl);
        setCached(true);
      } catch (error) {
        console.error("Error fetching thumbnail:", error);
      }
    };

    if (selectedId !== null) {
      fetchThumbnail();
      setProgress(0);
    }
  }, [selectedId]);

  return (
    <div className="relative flex w-full h-full justify-center">
      <div className="grid grid-cols-10 grid-rows-[auto] w-full">
        <div
          className={`${
            selectedId === null ? "col-span-10" : "col-span-8"
          } mt-[10vh] px-[5vw] space-y-[2vw] transition-all duration-[1s]`}
        >
          <div>
            <span className="text-black font-extrabold text-6xl">
              Certificates
            </span>
          </div>
          <Tables
            certiList={certList}
            isLoading={false}
            onClick={(data: any) => {
              setSelectedId(data);
            }}
            selectedId={selectedId}
          />
        </div>
        <div
          className={`${
            selectedId === null ? "hidden" : `col-span-2 `
          } p-2 transition ease-in-out ${animationClass}`}
        >
          <div className="bg-gray-100 w-full h-full rounded-lg flex flex-col py-5 px-2">
            <div className="flex flex-col w-full">
              <div className="flex  align-top">
                <div className="flex space-x-2">
                  <Image
                    src="https://drive-thirdparty.googleusercontent.com/64/type/application/pdf"
                    alt="PDF"
                    width={100}
                    height={100}
                    className="w-5 h-5 m-2 mt-3"
                  />
                  <span className="m-2 text-black/80">
                    {selectedId?.filename}
                  </span>
                </div>
                <div
                  className="p-2 h-fit rounded-full hover:bg-[#1f1f1f20]"
                  aria-label="Click to close"
                >
                  <X size={20} />
                </div>
              </div>
              <span className="text-2xl text-black mb-3">Preview</span>
            </div>
            <div
              className={`w-full ${
                cache ? "h-fit" : "h-[25%]"
              } border-4 rounded-lg border-gray-500/[0.25] ${
                !cache ? "bg-gray-300 animate-pulse" : ""
              }`}
            >
              {!cache ? (
                <div className="w-full h-full flex justify-center items-center opacity-55">
                  <div
                    className="radial-progress"
                    style={{ "--value": progress } as React.CSSProperties}
                    role="progressbar"
                  >
                    {progress}%
                  </div>
                </div>
              ) : (
                <Image
                  src={thumbanil}
                  alt=""
                  width={1000}
                  height={1000}
                  className="object-fill"
                />
              )}
            </div>
            <div className="mt-5 ml-1 space-y-2 text-black">
              <span className="text-2xl">File Details</span>
              <div className="flex flex-col">
                <div className="flex flex-col space-y-5">
                  <span>Certificate</span>
                  <div className="flex justify-center space-x-2">
                    <Link href={`/viewer/file/${selectedId?.filename}`}>
                      <button className="btn btn-ghost max-w-20 !rounded-xl border border-[#747775] hover:!border-[#747775] hover:!border hover:!bg-[#0b57d0] hover:!bg-opacity-[0.08] text-[#0b57d0]">
                        Preview
                      </button>
                    </Link>
                    <button
                      className="btn btn-ghost max-w-20 !rounded-xl border border-[#747775] hover:!border-[#747775] hover:!border hover:!bg-[#0b57d0] hover:!bg-opacity-[0.08] text-[#0b57d0]"
                      onClick={() => {
                        if (selectedId !== null) {
                          sendCertificate(selectedId.filename);
                        }
                      }}
                    >
                      {isLoading ? "Sending" : "Send"}
                    </button>
                  </div>
                </div>
                <div className="flex flex-col text-sm">
                  <span>File Owner</span>
                  <span className="font-ubermove_regular text-gray-500">
                    {fetchedUser !== null
                      ? `${fetchedUser?.full_name}`
                      : "undefined"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        role="alert"
        className={`alert absolute top-5 ${
          toast === 200 ? "alert-success" : "alert-error"
        } w-[25%] justify-between ${
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
    </div>
  );
};

export default Page;
