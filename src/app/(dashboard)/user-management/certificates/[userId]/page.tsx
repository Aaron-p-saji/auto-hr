"use client";
import React, { useState, useEffect } from "react";
import Tables from "./_components/tables";
import "./cer.css";
import axios from "axios";
import { useAuthStore } from "@/providers/context";
import Image from "next/image";

export type certificate = {
  id: string;
  filename: string;
};

const Page = (params: { params: { userId: string } }) => {
  const [selectedId, setSelectedId] = useState<string>("");
  const [animationClass, setAnimationClass] = useState<string>("");
  const [tableLoading, setTableLoading] = useState(false);
  const [certList, setCertList] = useState<certificate[]>([]);
  const [previewLoading, setPreviewLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [thumbanil, setThumbnail] = useState("");

  const handleSelection = () => {
    if (selectedId !== "") {
      setAnimationClass("animate-exit");
    } else {
      setAnimationClass("animate-enter");
    }
  };
  useEffect(() => {
    const getCert = async () => {
      try {
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
    const fetchThumbnail = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8000/api/pdfs/thumbnail/${params.params.userId}/${selectedId}/`,
          {
            headers: {
              Authorization: `Bearer ${useAuthStore.getState().token}`,
            },
            onDownloadProgress(progressEvent) {
              setProgress(progress);
            },
          }
        );
        setThumbnail(response.data);
      } catch (error) {
        console.error("Error fetching thumbnail:", error);
      }
    };

    fetchThumbnail();
  }, [selectedId, params]);
  return (
    <div className="grid grid-cols-10 grid-rows-[auto] w-full">
      <div
        className={`${
          selectedId === "" ? "col-span-10" : "col-span-8"
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
        />
      </div>
      <div
        className={`${
          selectedId === "" ? "hidden" : `col-span-2 `
        } p-2 transition ease-in-out ${animationClass}`}
      >
        <div className="bg-gray-100 w-full h-full rounded-lg flex flex-col py-5 px-2">
          <span className="text-2xl text-black mb-3">Preview</span>
          <div
            className={`w-full h-[25%] border-4 rounded-lg border-gray-500/[0.25] ${
              previewLoading ? "bg-gray-300 animate-pulse" : ""
            }`}
          >
            {previewLoading ? (
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
              <Image src="" alt="preview" width={1000} height={1000} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
