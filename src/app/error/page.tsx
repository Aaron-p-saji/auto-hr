"use client";
import React, { useState } from "react";
import "./error.css";
import { Archivo_Black, Josefin_Sans } from "next/font/google";
import { useRouter } from "next/navigation";
import Image from "next/image";
import server_error from "./_components/server_error.svg";
import Link from "next/link";

type Props = {};

const archivo = Archivo_Black({ subsets: ["latin"], weight: "400" });

const Page = (props: Props) => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  return (
    <div className="w-screen h-screen flex text-black justify-center mt-10 relative">
      <div
        className={`absolute w-screen h-screen bg-black/50 z-10 flex-col items-center justify-center ${
          loading ? "flex" : "hidden"
        }`}
      >
        <div className="spinner">
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>
      </div>
      <div className="h-[40%] flex flex-col items-center">
        <span className={`text-6xl ${archivo.className}`}>HTTP 500</span>
        <div className="w-full h-full flex select-none">
          <Image
            src={server_error}
            alt="server_error"
            width={1000}
            height={1000}
            draggable={false}
          />
        </div>

        <span> {"Can't connect to backend server"}</span>
        <div
          className="button-container mt-10 select-none"
          onClick={() => {
            setLoading(true);
            router.push("/");
            setLoading(false);
          }}
        >
          <span className={`text ${archivo.className}`}>
            <span className="span-mother">
              <span>R</span>
              <span>E</span>
              <span>L</span>
              <span>O</span>
              <span>A</span>
              <span>D</span>
            </span>
            <span className="span-mother2">
              <span>R</span>
              <span>E</span>
              <span>L</span>
              <span>O</span>
              <span>A</span>
              <span>D</span>
            </span>
          </span>
        </div>
      </div>
    </div>
  );
};

export default Page;
