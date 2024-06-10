"use client";
import React, { useEffect, useRef, useState } from "react";
import "./page.css";
import { useReactToPrint } from "react-to-print";
import template1 from "./templates/Template1.png";
import template2 from "./templates/Template2.png";
import template3 from "./templates/Template3.png";
import template_4 from "./templates/Template_4.png";
import template5 from "./templates/Template5.png";
import template6 from "./templates/Template6.png";
import template7 from "./templates/Template7.png";
import template8 from "./templates/Template8.png";
import template9 from "./templates/Template9.gif";
import template10 from "./templates/Template10.jpg";
import template11 from "./templates/Template11.png";
import ReactToPrint from "react-to-print";
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
  // eslint-disable-next-line react/require-render-return
  render(): React.ReactNode {
    let headingUsed = false;
    switch (this.props.template) {
      case "template4": {
        headingUsed = true;
        return (
          <div
            style={{ position: "relative" }}
            id="template2"
            className="select-none rounded-md bg-white md:left-0"
            draggable={false}
          >
            <Image
              src={template_4}
              className="w-full h-full"
              width={2000}
              height={2000}
              alt=""
              draggable={false}
            />
            <p
              style={{
                color: "black",
                position: "absolute",
                top: "8.1%",
                left: "2.4%",
              }}
              className={`${opensans.className} xl:text-[18px] lg:text-[1.2vw] md:text-[15px] text-[1.94vw]`}
            >
              {this.props.topTitle === "" ? (
                <span className="text-base h-10 flex leading-[1.281] text-gray-500">
                  Microsoft Learn <br className="" /> Student Ambassadors
                </span>
              ) : (
                this.props.topTitle
              )}
            </p>
            <h1
              style={{
                color: "black",
                position: "absolute",
                top: "28%",
                left: "3.42%",
                wordBreak: "break-all",
              }}
              className={`${playball.className} xl:text-[48px] lg:text-[3.69vw] md:text-[48px] text-[6.21vw]`}
            >
              {this.props.name === "" ? "Name" : this.props.name}
            </h1>
            <h6
              style={{
                fontWeight: "600",
                color: "#000",
                width: "60%",
                position: "absolute",
                top: "45.6%",
                left: "4.1%",
              }}
              className={`select-none xl:text-[15px] lg:text-[1.2vw] md:text-[15px] text-[1.94vw] ${playfair.className}`}
            >
              {this.props.desc === "" ? (
                <span>
                  In recognition of your attendance and completion of <br />
                  the Microsoft Student Ambassadors Event
                </span>
              ) : (
                this.props.desc.split("\n").map((item: string, key: number) => (
                  <span key={key}>
                    {item}
                    {key !== this.props.desc.split("\n").length - 1 && <br />}
                  </span>
                ))
              )}
            </h6>
            <h1
              style={{
                color: "black",
                position: "absolute",
                top: "64%",
                left: "19.36%",
                wordBreak: "break-all",
              }}
              className={`select-none xl:text-[15px] lg:text-[1.2vw] md:text-[15px] text-[1.94vw] ${playfair_500.className}`}
            >
              {this.props.author === "" ? "Author Name" : this.props.author}
            </h1>
            <h1
              style={{
                color: "black",
                position: "absolute",
                top: "68%",
                left: "4.1%",
                wordBreak: "break-all",
              }}
              className={`select-none xl:text-[15px] lg:text-[1.2vw] md:text-[15px] text-[1.96vw] ${playfair_500.className}`}
            >
              {this.props.lowerText === ""
                ? "Microsoft Learn Student Ambassador"
                : this.props.lowerText}
            </h1>
          </div>
        );
      }
    }
    this.props.setHeadingUsed(headingUsed);
    return null; // Add a return statement
  }
}

const Popup = ({ setpop, trigger }: { setpop: any; trigger: boolean }) => {
  return trigger ? (
    <div className="popup">
      <div className="popup-box">
        <button onClick={() => setpop(false)}>x</button>
        <h3 style={{ fontWeight: "100" }}>Rules for Setup Printing Page</h3>
        <div className="content">
          <li>Destination: Save as PDF</li>
          <li>Pages: All</li>
          <li>Layout: Landscape</li>
        </div>
        <h3 style={{ fontWeight: "100", marginTop: "10px" }}>More Settings</h3>
        <div className="content">
          <li>Paper Size: A4</li>
          <li>Paper per Sheet:1</li>
          <li>Margins: none</li>
          <li>Scale: Custom 200</li>
        </div>
      </div>
    </div>
  ) : null;
};
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
  const [topTitlem, setTopTitle] = useState("");
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
    <div className="main h-full w-full lg:bg-gray-100 ">
      <Popup trigger={pop} setpop={setpop}></Popup>
      <div className="grid lg:grid-cols-12 lg:grid-rows-[auto] grid-rows-12 grid-cols-1 h-full w-full">
        <div className="col-span-1 bg-gray-100 p-5 space-y-5 hidden lg:block">
          <h1 className="text-black text-center lg:text-xs">Templates</h1>
          <div
            className={`templates ${
              template === "template4" ? "border-blue-500" : "border-black"
            } border-4 p-1  rounded-lg`}
            onClick={() => settemplate("template4")}
          >
            <Image src={template_4} alt="" className="w-[10vw]" />
          </div>
        </div>
        <div className="row-span-8 col-span-1 lg:col-span-8 p-5 flex flex-col items-center pattern w-full">
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
          <div className="flex justify-center items-center h-full">
            <div className="certificate mt-5 flex flex-col items-center justify-center xl:w-[786px] xl:h-[534px] md:h-[500px]">
              <ComponentToPrint
                ref={componentRef}
                topTitle={topTitlem}
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
        </div>
        <div className="col-span-3 px-10 p-5 flex flex-col bg-gray-100">
          <div className="form space-y-4">
            <h1 className="text-black text-center text-3xl">
              Customise Fields
            </h1>
            <div className="">
              <div className="form-control w-full ">
                <div className="label">
                  <span className="label-text">Top Title</span>
                </div>
                <input
                  type="text"
                  className="input input-bordered w-full !text-black"
                  placeholder="Enter Author Name"
                  onChange={(e) => setTopTitle(e.target.value)}
                />
              </div>
              <label className="form-control w-full">
                <div className="label">
                  <span className="label-text">Heading</span>
                </div>
                <input
                  type="text"
                  placeholder="Enter Heading"
                  className={`input input-bordered w-full text-blacktext-blacktext-blacktext-black`}
                  onChange={(e) => {
                    setheading(e.target.value);
                  }}
                  disabled={!headingUsed}
                />
              </label>
              <div className="form-control w-full">
                <div className="label">
                  <span className="label-text">Name</span>
                </div>
                <input
                  type="text"
                  className="input input-bordered w-full text-blacktext-blacktext-black"
                  placeholder="Enter participant Name"
                  onChange={(e) => {
                    setname(e.target.value);
                  }}
                />
              </div>
              <div className="form-control w-full ">
                <div className="label">
                  <span className="label-text">Description</span>
                </div>
                <textarea
                  className="textarea textarea-bordered h-24 w-full "
                  placeholder="Enter Description"
                  onChange={(e) =>
                    setdesc(e.target.value.replace(/\\n/g, "\n"))
                  }
                  value={desc}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault(); // Prevent default behavior of Enter key
                      const target = e.target as HTMLTextAreaElement; // Cast EventTarget to HTMLTextAreaElement
                      const cursorPosition = target.selectionStart; // Get the cursor position
                      const newDesc =
                        desc.substring(0, cursorPosition) +
                        "\n" +
                        desc.substring(cursorPosition); // Insert newline at cursor position
                      setdesc(newDesc); // Set the updated value
                    }
                  }}
                />
              </div>
              <div className="form-control w-full ">
                <div className="label">
                  <span className="label-text">Author Name</span>
                </div>
                <input
                  type="text"
                  className="input input-bordered w-full !text-black"
                  placeholder="Enter Author Name"
                  onChange={(e) => setauthor(e.target.value)}
                />
              </div>

              <label className="form-control w-full">
                <div className="label">
                  <span className="label-text">User</span>
                </div>
                <select
                  className="select select-bordered"
                  value={String(selectedUser)}
                  onChange={(e) => setSelectedUser(e.target.value)}
                >
                  <option>Select a user</option>
                  {userList.map((value) => (
                    <option key={value.id} value={value.id}>
                      {value.first_name} {value.middle_name} {value.last_name}
                    </option>
                  ))}
                </select>
              </label>
              <div className="form-control w-full ">
                <div className="label">
                  <span className="label-text">Lower Text</span>
                </div>
                <input
                  type="text"
                  className="input input-bordered w-full !text-black"
                  placeholder="Enter Lower Text"
                  onChange={(e) => setLowerText(e.target.value)}
                />
              </div>
              <button
                className="btn btn-primary w-full !text-black mt-5"
                onClick={generatePDF}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <span className="loading loading-spinner"></span> Loading
                  </>
                ) : (
                  <p>Download PDF</p>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PDFGenerate;
