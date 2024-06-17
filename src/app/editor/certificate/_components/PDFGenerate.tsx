"use client";
import React, { useEffect, useRef, useState } from "react";
import "./page.css";
import { useReactToPrint } from "react-to-print";
import offerletter from "./templates/offerletter.png";
import "react-quill/dist/quill.snow.css";
import Image from "next/image";
import {
  Great_Vibes,
  Open_Sans,
  Playball,
  Playfair_Display,
} from "next/font/google";
import html2canvas from "html2canvas-pro";
import jsPDF from "jspdf";
import axios from "axios";
import { useAuthStore } from "@/providers/context";
import { user } from "@/providers/typeProviders";
import { X } from "lucide-react";
import { useRouter } from "next/navigation";
import ReactQuill from "react-quill";
import parse from "html-react-parser";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";

const playball = Playball({ weight: "400", subsets: ["latin"] });
const playfair_500 = Playfair_Display({ weight: "500", subsets: ["latin"] });
const playfair = Playfair_Display({ subsets: ["latin"] });
const opensans = Open_Sans({ weight: "600", subsets: ["latin"] });

const fields = [""];

export class ComponentToPrint extends React.PureComponent<{
  template: any;
  heading: any;
  name: any;
  topTitle: any;
  desc: any;
  author: any;
  lowerText: any;
  setHeadingUsed: (used: boolean) => void;
}> {
  render(): React.ReactNode {
    let headingUsed = false;
    switch (this.props.template) {
      case "template4": {
        headingUsed = true;
        return (
          <div
            id="template2"
            className="select-none rounded-md bg-white flex w-full h-full"
            draggable={false}
          >
            <Image
              src={offerletter}
              width={1000}
              height={1000}
              alt="offer-letter"
            />
          </div>
        );
      }
    }
    this.props.setHeadingUsed(headingUsed);
    return null; // Add a return statement
  }
}

function PDFGenerate() {
  const [pop, setpop] = useState(false);
  const [isLoading, setLoader] = useState(false);
  const [name, setname] = useState("YourName");
  const [heading, setheading] = useState("");
  const [desc, setdesc] = useState("");
  const [author, setauthor] = useState("");
  const [lowerText, setLowerText] = useState("");
  const [template, settemplate] = useState("template4");
  const componentRef = useRef(null);
  const [theme, setTheme] = useState("dark");
  const [headingUsed, setHeadingUsed] = useState(false);
  const [topTitle, setTopTitle] = useState("");
  const [userLoading, setUserLoading] = useState(false);
  const [warning, setWarning] = useState(true);
  const [userList, setUserList] = useState<user[]>([]);
  const [result, setResult] = useState(false);
  const [selectedUser, setSelectedUser] = useState<String>("");

  const router = useRouter();
  const generatePDF = () => {
    const certificate = document.querySelector(".certificate");
    if (certificate instanceof HTMLElement) {
      setLoader(true);
      html2canvas(certificate, { scale: 4 }).then(async (canvas) => {
        const imgData = canvas.toDataURL("img/png");
        const doc = new jsPDF({
          orientation: "l",
          unit: "px",
          format: [786, 534],
          compress: false,
        });
        doc.addImage(imgData, "PNG", 0, 0, 786, 534, "", "NONE");
        const pdfOutput = doc.output("blob");

        const formData = new FormData();
        formData.append("file", pdfOutput, "certificate.pdf");
        formData.append("user_id", String(selectedUser));

        try {
          if (selectedUser !== "") {
            const res = await axios.post(
              "http://localhost:8000/api/upload/",
              formData,
              {
                headers: {
                  "Content-Type": "multipart/form-data",
                },
              }
            );
            console.log("Success:", res.data);
            setResult(true);
            setTimeout(() => {
              setResult(false);
            }, 1500);
            router.push("/user-management");
          }
        } catch (error) {
          console.error("Error:", error);
          console.log(selectedUser);
        }
        setLoader(false);
      });
    }
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setUserLoading(true);
        const res = await axios.get("http://localhost:8000/api/user/", {
          params: {
            all: true,
          },
          headers: {
            Authorization: `Bearer ${useAuthStore.getState().token}`,
          },
        });
        if (res.status === 200) {
          setUserList(res.data);
        } else {
          console.log(res.status);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setUserLoading(false);
      }
    };

    if (useAuthStore.getState().token) {
      fetchUser();
    }
  }, [useAuthStore.getState().token]);

  useEffect(() => {
    setWarning(true);
    setTimeout(() => {
      setWarning(false);
    }, 3000);
  }, []);

  return (
    <div className="main h-full w-full lg:bg-gray-100">
      <div className="grid lg:grid-cols-12 lg:grid-rows-[auto] grid-rows-12 grid-cols-1 h-full w-full">
        <div className="col-span-1 bg-gray-100 p-5 space-y-5 hidden lg:block">
          <h1 className="text-black text-center lg:text-xs">Templates</h1>
          <div
            className={`templates ${
              template === "template4" ? "border-blue-500" : "border-black"
            } border-4 p-1 rounded-lg`}
            onClick={() => settemplate("template4")}
          >
            <Image src={offerletter} alt="" className="w-[10vw]" />
          </div>
        </div>
        <div className="row-span-8 col-span-1 lg:col-span-8 flex flex-col items-center pattern w-full">
          <TransformWrapper
            initialScale={1}
            initialPositionX={200}
            initialPositionY={100}
          >
            <div
              role="alert"
              className={`alert alert-warning w-[50%] justify-between ${
                warning ? "text_animate flex" : "text_animate_end hidden"
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
                <span>
                  In Preview the text might overlap but the output is optimized
                </span>
              </div>
              <X
                size={18}
                className="border-2 border-black rounded-full cursor-pointer"
                onClick={() => {
                  setWarning(false);
                }}
              />
            </div>
            <div
              role="alert"
              className={`alert justify-between ${
                result ? "alert-success" : "alert-error"
              } w-[50%] ${
                result ? "text_animate flex" : "text_animate_end hidden"
              }`}
            >
              <div className="flex spacex3">
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
                <span>
                  {result ? "Successfully Created" : "PDF Generation Failed"}
                </span>
              </div>
              <X
                size={18}
                className="border-2 border-black rounded-full cursor-pointer"
                onClick={() => {
                  setWarning(false);
                }}
              />
            </div>
            <TransformComponent>
              <div className="flex justify-center items-center h-full">
                <div className="certificate mt-5 flex flex-col items-center justify-center xl:w-[786px] xl:h-[960px]">
                  <ComponentToPrint
                    ref={componentRef}
                    topTitle={topTitle}
                    name={name}
                    heading={heading}
                    desc={desc}
                    author={author}
                    lowerText={lowerText}
                    template={template}
                    setHeadingUsed={setHeadingUsed}
                  />
                </div>
              </div>
            </TransformComponent>
          </TransformWrapper>
        </div>
        <div className="col-span-3 px-10 p-5 flex flex-col bg-gray-100">
          <div className="form space-y-4">
            <h1 className="text-black text-center text-3xl">
              Customise Fields
            </h1>
            <ReactQuill theme="snow" value={desc} onChange={setdesc} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default PDFGenerate;
