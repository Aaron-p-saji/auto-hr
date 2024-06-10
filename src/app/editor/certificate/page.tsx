"use client";
import React, { useEffect, useState } from "react";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import fontkit from "@pdf-lib/fontkit";
import PDFGenerate from "./_components/PDFGenerate";

type Props = {};

const Page = (props: Props) => {
  return (
    <div className="h-full w-full">
      <PDFGenerate />
    </div>
  );
};

export default Page;
