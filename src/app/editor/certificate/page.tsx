"use client";
import React, { useEffect, useRef, useState } from "react";
import "react-quill/dist/quill.snow.css";
import "./_components/page.css";
import ReactQuill from "react-quill";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import offerletter from "./_components/templates/offerletter.png";
import Image from "next/image";
import parse from "html-react-parser";
import { Open_Sans, Roboto_Serif } from "next/font/google";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Rnd } from "react-rnd";
import { useAuthStore } from "@/providers/context";
import axios from "axios";
import { UserFields } from "@/providers/zodTypes";
import html2canvas from "html2canvas-pro";
import jsPDF from "jspdf";
import { Ampersand, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast as alertT } from "sonner";
const opensans = Open_Sans({ subsets: ["latin"] });
const roboto = Roboto_Serif({ subsets: ["latin"] });

const Page = () => {
  const modules = {
    toolbar: [
      [{ size: ["small", false, "large", "huge"] }],
      ["bold", "italic", "underline"],
      [{ align: ["", "center", "right", "justify"] }],
      [{ list: "ordered" }, { list: "bullet" }],
      ["clean"],
    ],
  };

  const formats = [
    "font",
    "size",
    "bold",
    "italic",
    "underline",
    "align",
    "list",
    "bullet",
  ];

  const [desc, setDesc] = useState<string>(
    `<p>Dear {{intern}},</p><p><br></p><p class="ql-align-justify">We are pleased to offer you the position of Software Developer Trainee at Bi. Enterprises. We were impressed by your qualifications and enthusiasm for software development, and we are confident that you will make valuable contributions to our team.</p><p class="ql-align-justify"><br></p><p class="ql-align-justify">This internship is scheduled to begin on {{startDate}}, with the possibility of extension based on performance and mutual agreement. Your working hours will be 8 Hrs. per day, with a schedule to be determined in consultation with your supervisor.</p><p class="ql-align-justify"><br></p><p class="ql-align-justify">During your internship, you will have the opportunity to:</p><ul><li class="ql-align-justify">Gain hands-on experience in various aspects of software development, including coding, testing, and debugging.</li><li class="ql-align-justify">Participate in team meetings, code reviews, and other collaborative activities to enhance your skills.</li><li class="ql-align-justify">Receive feedback and mentorship to support your professional growth and development as a software developer.</li></ul><p class="ql-align-justify">We are excited to welcome you to the Bi. Enterprises team and look forward to working together.</p>`
  );
  const [contDesc, setContDesc] = useState<string>(desc);

  const [isClicked, setIsClicked] = useState(false);
  const [resizeEnabled, setResizeEnabled] = useState(false);
  const [userLoading, setUserLoading] = useState(false);
  const [userList, setUserList] = useState<UserFields[]>([]);
  const [selectedUser, setSelectedUser] = useState<UserFields | null>(null);
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [loader, setLoader] = useState(false);
  const [warning, setWarning] = useState(true);
  const [result, setResult] = useState(false);
  const [toast, setToast] = useState(0);
  const [message, setMessage] = useState("");
  const [iLoading, setLoading] = useState(false);

  const router = useRouter();

  const handleChange = (content: string) => {
    if (selectedUser?.start_date) {
      const start_Date = new Date(selectedUser.start_date);
      setStartDate(start_Date);
      let updatedContent = content.replace(
        /{{startDate}}/g,
        `${start_Date.getDate()}/${
          start_Date.getMonth() + 1
        }/${start_Date.getFullYear()}`
      );

      // Assuming you also want to replace {{endDate}} similarly
      if (selectedUser?.endDate) {
        const endDate = new Date(selectedUser.endDate);
        updatedContent = updatedContent.replace(
          /{{endDate}}/g,
          `${endDate.getDate()}/${
            endDate.getMonth() + 1
          }/${endDate.getFullYear()}`
        );
      }

      if (selectedUser.full_name) {
        updatedContent = updatedContent.replace(
          /{{intern}}/g,
          `${selectedUser?.full_name}`
        );
      }
      setDesc(content);
      setContDesc(updatedContent);
    }
  };

  const handleDoubleClick = () => {
    setResizeEnabled(!resizeEnabled);
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setUserLoading(true);
        const res = await axios.get("http://localhost:8000/api/intern/", {
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
    setSelectedUser(userList[0]);
  }, [useAuthStore.getState().token]);

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

  const handleSend = async () => {
    if (selectedUser) {
      const certificate = document.querySelector(".certificate");
      if (certificate instanceof HTMLElement) {
        setLoader(true);
        html2canvas(certificate, { scale: 3 }).then(async (canvas) => {
          const imgData = canvas.toDataURL("image/png");
          const doc = new jsPDF({
            unit: "px",
            format: [580, 821], // Adjusted to match the size of your certificate
            compress: false,
          });
          doc.addImage(imgData, "PNG", 0, 0, 580, 821, "", "NONE");
          const pdfOutput = doc.output("blob");

          const formData = new FormData();
          formData.append("file", pdfOutput, "certificate.pdf");
          formData.append("user_id", String(selectedUser?.intern_code));

          try {
            if (selectedUser !== null) {
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
              router.push("/intern-management");
            }
          } catch (error) {
            console.error("Error:", error);
            console.log(selectedUser);
          }
          setLoader(false);
        });
      }
    } else {
      alertT.error("An Inter should be selected", {
        duration: 1500,
        action: {
          label: "Close",
          onClick(event) {
            alertT.dismiss(event.currentTarget.value);
          },
        },
      });
    }
  };

  const handleSave_Send = async () => {
    const certificate = document.querySelector(".certificate");

    if (selectedUser) {
      if (certificate instanceof HTMLElement) {
        setLoader(true);
        html2canvas(certificate, { scale: 3 }).then(async (canvas) => {
          const imgData = canvas.toDataURL("image/png");
          const doc = new jsPDF({
            unit: "px",
            format: [580, 821], // Adjusted to match the size of your certificate
            compress: false,
          });
          doc.addImage(imgData, "PNG", 0, 0, 580, 821, "", "NONE");
          const pdfOutput = doc.output("blob");

          const formData = new FormData();
          formData.append("file", pdfOutput, "certificate.pdf");
          formData.append("user_id", String(selectedUser?.intern_code));

          try {
            if (selectedUser !== null) {
              const res = await axios.post(
                "http://localhost:8000/api/upload/",
                formData,
                {
                  headers: {
                    "Content-Type": "multipart/form-data",
                  },
                }
              );
              sendCertificate(String(res.data.filename).split(".")[0]);
              setResult(true);
              setTimeout(() => {
                setResult(false);
              }, 1500);
              router.push("/intern-management");
            }
          } catch (error) {
            console.error("Error:", error);
            console.log(selectedUser);
          }
          setLoader(false);
        });
      }
    } else {
      alertT.error("An Inter should be selected", {
        duration: 1500,
      });
    }
  };

  useEffect(() => {
    if (selectedUser) {
      handleChange(desc);
    }
  }, [selectedUser, desc, contDesc]);

  useEffect(() => {
    handleChange(desc);
  }, []);

  const areaRef = useRef<HTMLDivElement>(null);
  const [cursorStyle, setCursorStyle] = useState("default");

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Control") {
        setCursorStyle("move");
      }
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      if (event.key === "Control") {
        setCursorStyle("default");
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("keyup", handleKeyUp);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  return (
    <div className="h-full w-full">
      <div className="w-full h-full grid grid-rows-[auto] grid-cols-8 bg-stone-400 pattern ">
        <div className="col-span-1 bg-gray-100 flex flex-col items-center pt-5">
          <span className="text-black font-bold text-xl">Templates</span>
          <div className="h-[80%] overflow-y-auto"></div>
        </div>
        <div
          ref={areaRef}
          className={`col-span-5 w-full h-full cursor-${cursorStyle}`}
        >
          <div
            role="alert"
            className={`alert justify-between absolute ${
              result ? "alert-success" : "alert-error"
            } w-[50%] ${
              result ? "text_animate flex" : "text_animate_end hidden"
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
          <TransformWrapper
            centerOnInit={true}
            centerZoomedOut={true}
            minScale={0.2}
            smooth={true}
            wheel={{ activationKeys: ["Control"], step: 3 }}
            panning={{ activationKeys: ["Control"] }}
            doubleClick={{ disabled: true }}
          >
            <TransformComponent
              wrapperClass="!w-full !h-full"
              contentClass="!item-center flex-col !justify-center"
            >
              <div className="w-[580px] h-[821px] text-white flex relative flex-col justify-center items-center certificate">
                <div className="w-full h-full absolute -z-[1]">
                  <Image
                    src={offerletter}
                    width={1000}
                    height={1000}
                    alt="offerletter"
                  />
                </div>

                <div
                  className={`w-full h-full text-black relative ${roboto.className}`}
                >
                  <Rnd
                    default={{
                      x: 460,
                      y: 180,
                      width: 100,
                      height: 30,
                    }}
                  >
                    <div className="text-black absolute font-bold hover:border-green-500 hover:border">
                      {startDate.getDate()}/{startDate.getMonth() + 1}/
                      {startDate.getFullYear()}
                    </div>
                  </Rnd>

                  <div className="ql-editor">
                    <Rnd
                      default={{
                        x: 40,
                        y: 200,
                        width: 500,
                        height: 500,
                      }}
                      minWidth={200}
                      minHeight={150}
                      bounds="parent"
                      onMouseDown={() => setIsClicked(true)}
                      onMouseUp={() => setIsClicked(false)}
                      onDoubleClick={handleDoubleClick}
                      enableResizing={false}
                      className={`border ${
                        isClicked ? "border-blue-500" : "border-transparent"
                      } hover:border-green-500`}
                    >
                      {parse(contDesc)}
                    </Rnd>
                  </div>
                </div>
              </div>
            </TransformComponent>
          </TransformWrapper>
        </div>
        <div className="col-span-2 bg-gray-100 flex flex-col items-center pt-5 space-y-4 ">
          <div className="flex flex-col items-center scrollbar scrollbar-w-1 scrollbar-thumb-[#696969b1] scrollbar-thumb-rounded-full scrollbar-h-2 overflow-y-auto">
            <span className="text-black font-bold text-xl">Data</span>
            <div className={`p-4 !text-black space-y-14`}>
              <ReactQuill
                theme="snow"
                value={desc}
                onChange={handleChange}
                modules={modules}
                formats={formats}
                placeholder="Type Here"
                className={`h-[35%] ${roboto.className}`}
              />
              <div className="flex flex-col">
                <label className="form-control w-full">
                  {userLoading ? (
                    <>
                      <div className="flex flex-col items-center mt-5">
                        <div className="newtons-cradle">
                          <div className="newtons-cradle__dot"></div>
                          <div className="newtons-cradle__dot"></div>
                          <div className="newtons-cradle__dot"></div>
                          <div className="newtons-cradle__dot"></div>
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="label">
                        <span className="label-text">Select Intern</span>
                      </div>
                      <select
                        className="select select-bordered bg-transparent"
                        onChange={(e) => {
                          const selectedIntern = userList.find(
                            (val) => val.intern_code === e.target.value
                          );
                          setSelectedUser(selectedIntern || null);
                        }}
                      >
                        <option disabled selected>
                          Select an option
                        </option>
                        {userList.map((intern, index) => (
                          <option
                            key={index}
                            value={intern.intern_code}
                            className="overflow-hidden text-ellipsis w-full"
                          >
                            {index + 1} • {intern.full_name} • {intern.email}
                          </option>
                        ))}
                      </select>
                    </>
                  )}
                </label>
              </div>
              <div className={`w-fit p-2 items-center flex flex-col space-y-4`}>
                <span className="text-black font-bold text-xl">
                  Formattings
                </span>
                <div className="flex flex-col text-black text-sm items-center">
                  <div>
                    <span className="text-red-500">{"{{startDate}}"} - </span>
                    <span className="text-blue-600">
                      Replace with the selected start date in the document
                    </span>
                  </div>
                  <div>
                    <span className="text-red-500">{"{{endDate}}"} - </span>
                    <span className="text-blue-600">
                      Replace with the selected end date in the document
                    </span>
                  </div>
                  <div>
                    <span className="text-red-500">{"{{intern}}"} - </span>
                    <span className="text-blue-600">
                      Replace with the selected intern in the document
                    </span>
                  </div>
                </div>
              </div>
              <div className="w-full h-fit flex gap-2">
                <div
                  className={`btn btn-neutral flex-grow bg-black hover:bg-black/80 ${
                    loader
                      ? "!bg-gray-600 !cursor-not-allowed !text-white animate-none"
                      : ""
                  }`}
                  onClick={handleSend}
                >
                  {loader && <span className="loading loading-dots"></span>}
                  Save PDF
                </div>
                <div
                  className={`btn btn-neutral flex-grow bg-black hover:bg-black/80 ${
                    loader
                      ? "!bg-gray-600 !cursor-not-allowed !text-white animate-none"
                      : ""
                  }`}
                  onClick={handleSave_Send}
                >
                  {loader && <span className="loading loading-dots"></span>}
                  Save
                  <span className="font-bold text-lg">&</span>
                  Send PDF
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
