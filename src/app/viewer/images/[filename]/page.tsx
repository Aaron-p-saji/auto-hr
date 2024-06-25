"use client";
import { useAuthStore } from "@/providers/context";
import axios from "axios";
import Image from "next/image";
import React, { useEffect, useState } from "react";

type Props = {};

const Page = (props: { params: { filename: string } }) => {
  const [image, setImage] = useState("");
  const [isLoading, setLoading] = useState<boolean>(false);
  useEffect(() => {
    const getFile = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          `http://localhost:8000/api/pdfs/thumbnail/${props.params.filename}`,
          {
            headers: {
              Authorization: `Bearer ${useAuthStore.getState().token}`,
            },
            responseType: "arraybuffer",
          }
        );
        const base64Image = Buffer.from(res.data, "binary").toString("base64");
        const imageUrl = `data:image/png;base64,${base64Image}`;
        setImage(imageUrl);
      } catch (error) {
        console.error("Error fetching thumbnail:", error);
      } finally {
        setLoading(false);
      }
    };
    getFile();
  }, []);
  return (
    <div style={{ textAlign: "center" }} className="w-screen">
      <div className="bg-[rgba(12,12,12)] w-full flex items-center justify-center">
        <Image
          src={image}
          alt={`Image`}
          width={1000}
          height={1000}
          className="!w-fit !h-screen"
        />
      </div>
    </div>
  );
};

export default Page;
