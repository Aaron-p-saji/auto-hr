"use client";
import React, { useEffect, useState } from "react";
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
import { user } from "@/providers/typeProviders";
import { useAuthStore } from "@/providers/context";
import axios from "axios";

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
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [endDate, setEndDate] = useState<Date>(
    new Date(startDate.getTime() + 7 * 24 * 60 * 60 * 1000)
  );

  const [isClicked, setIsClicked] = useState(false);
  const [resizeEnabled, setResizeEnabled] = useState(false);
  const [userLoading, setUserLoading] = useState(false);
  const [userList, setUserList] = useState<user[]>([]);
  const [selectedUser, setSelectedUser] = useState<user | null>(null);

  const handleChange = (content: string) => {
    let updatedContent = content.replace(
      /{{startDate}}/g,
      `${startDate.getDate()}/${
        startDate.getMonth() + 1
      }/${startDate.getFullYear()}`
    );
    updatedContent = updatedContent.replace(
      /{{endDate}}/g,
      `${endDate.getDate()}/${endDate.getMonth() + 1}/${endDate.getFullYear()}`
    );

    updatedContent = updatedContent.replace(
      /{{intern}}/g,
      `${selectedUser?.first_name} ${selectedUser?.middle_name} ${selectedUser?.last_name}`
    );
    setDesc(content);
    setContDesc(updatedContent);
  };

  const handleEndDateChange = (date: Date | null) => {
    if (date) {
      const minimumEndDate = new Date(startDate);
      minimumEndDate.setDate(minimumEndDate.getDate() + 7);

      const timeDifference = Math.abs(date.getTime() - startDate.getTime());
      const differenceInDays = Math.ceil(timeDifference / (1000 * 3600 * 24));

      if (date < minimumEndDate || differenceInDays < 7) {
        setEndDate(minimumEndDate);
      } else {
        setEndDate(date);
      }
    } else {
      setEndDate(new Date(startDate.getTime() + 7 * 24 * 60 * 60 * 1000));
    }
  };

  useEffect(() => {
    const updatedEndDate = new Date(
      startDate.getTime() + 7 * 24 * 60 * 60 * 1000
    );
    setEndDate(updatedEndDate);
  }, [startDate]);

  const handleDoubleClick = () => {
    setResizeEnabled(!resizeEnabled);
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
    setSelectedUser(userList[0]);
  }, [useAuthStore.getState().token]);

  useEffect(() => {
    if (selectedUser) {
      handleChange(desc);
    }
  }, [selectedUser, desc, startDate, endDate, contDesc]);

  useEffect(() => {
    handleChange(desc);
  }, []);

  return (
    <div className="h-full w-full">
      <div className="w-full h-full grid grid-rows-[auto] grid-cols-8 bg-stone-400 pattern">
        <div className="col-span-1 bg-gray-100 flex flex-col items-center pt-5">
          <span className="text-black font-bold text-xl">Templates</span>
          <div className="h-[80%] overflow-y-auto"></div>
        </div>
        <div className="col-span-5 w-full h-full">
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
              <div className="w-[580px] h-[821px] text-white flex relative flex-col justify-center items-center">
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
        <div className="col-span-2 bg-gray-100 flex flex-col items-center pt-5 space-y-4 @apply scrollbar scrollbar-w-1 scrollbar-thumb-[#696969b1] scrollbar-thumb-rounded-full scrollbar-h-2; overflow-y-auto">
          <span className="text-black font-bold text-xl">Data</span>
          <div className={`p-4 !text-black space-y-14`}>
            <ReactQuill
              theme="snow"
              value={desc}
              onChange={handleChange}
              modules={modules}
              formats={formats}
              placeholder="Type Here"
              className={`h-[45%] ${roboto.className}`}
            />
            <div className="flex flex-col">
              <div className="flex space-x-4">
                <label className="form-control w-full">
                  <div className="label">
                    <span className="label-text">Start Date</span>
                  </div>
                  <DatePicker
                    selected={startDate}
                    onChange={(date: Date | null) =>
                      setStartDate(date ?? new Date())
                    }
                    dateFormat="dd/MM/yyyy"
                    className="input input-bordered w-full bg-transparent"
                  />
                </label>
                <label className="form-control w-full">
                  <div className="label">
                    <span className="label-text">End Date</span>
                  </div>
                  <DatePicker
                    selected={endDate}
                    onChange={handleEndDateChange}
                    minDate={
                      new Date(startDate.getTime() + 7 * 24 * 60 * 60 * 1000)
                    }
                    dateFormat="dd/MM/yyyy"
                    className="input input-bordered w-full bg-transparent"
                  />
                </label>
              </div>
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
                          (val) => val.id === e.target.value
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
                          value={intern.id}
                          className="overflow-hidden text-ellipsis w-full"
                        >
                          {index + 1} • {intern.first_name} • {intern.email}
                        </option>
                      ))}
                    </select>
                  </>
                )}
              </label>
            </div>
            <div className={`w-fit p-2 items-center flex flex-col space-y-4`}>
              <span className="text-black font-bold text-xl">Formattings</span>
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
