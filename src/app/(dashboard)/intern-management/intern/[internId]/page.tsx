"use client";
import { useAuthStore } from "@/providers/context";
import { UserFields, certificate } from "@/providers/zodTypes";
import axios from "axios";
import {
  CalendarPlus,
  EllipsisVertical,
  HardDrive,
  Option,
  PencilIcon,
  Send,
  Trash,
} from "lucide-react";
import { Poppins } from "next/font/google";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import not_found from "./_components/error.svg";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast as alertT } from "sonner";

type Props = {};

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "700", "800", "900"],
});

const Page = (props: { params: { internId: string } }) => {
  const [user, setUser] = useState<UserFields | null>(null);
  const [isUser, setIsUser] = useState(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isCertificateLoading, setIsCertificateLoading] =
    useState<boolean>(false);
  const [certList, setCertList] = useState<certificate[]>([]);
  const [toast, setToast] = useState(0);
  const [message, setMessage] = useState("");
  const [iLoading, setLoading] = useState(false);

  const router = useRouter();

  const [profilePic, setProfilePic] = useState<string>("");
  const getCert = async () => {
    try {
      setCertList([]);
      const res = await axios.get("http://localhost:8000/api/pdfs/list/", {
        params: {
          user_id: props.params.internId,
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
    }
  };
  useEffect(() => {
    const getProfilePic = async () => {
      try {
        const res = await axios.get(
          `http://localhost:8000/api/get_profile_pic`,
          {
            params: {
              id: props.params.internId,
            },
            headers: {
              Authorization: `Bearer ${useAuthStore.getState().token}`,
            },
          }
        );
        if (res.status === 200) {
          setProfilePic(res.data.base64_image);
        } else {
          setProfilePic("");
        }
      } catch (error) {
        setProfilePic("");
      }
    };

    getCert();
    const getUser = async () => {
      try {
        setIsLoading(true);
        const res = await axios.get("http://localhost:8000/api/intern", {
          params: {
            id: `${props.params.internId}`,
          },
          headers: {
            Authorization: `Bearer ${useAuthStore.getState().token}`,
          },
        });

        if (res.status === 200) {
          setUser(res.data);
          getProfilePic();
          getCert();
          setIsUser(true);
        } else {
          setIsUser(false);
        }
      } catch (error) {
        setIsUser(false);
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };

    getUser();
  }, []);

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

  const deleteCertificate = async (filename: string) => {
    setIsCertificateLoading(true);
    try {
      const res = await axios.delete("http://localhost:8000/api/pdfs/list", {
        data: {
          pdf_id: filename,
        },
        headers: {
          Authorization: `Bearer ${useAuthStore.getState().token}`,
        },
      });
      if (res.status === 200) {
        getCert();
        router.refresh();
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsCertificateLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center w-full mt-10 min-h-screen space-y-5 text-black pb-10">
      {isLoading ? (
        <>
          <div className="flex px-2 w-full">
            <div className="flex flex-col w-full relative box-border !mx-4 rounded-xl">
              <div className=" w-full h-52 rounded-xl">
                <div className="relative h-full w-full">
                  <div className="absolute w-full h-full rounded-xl skeleton"></div>
                </div>
              </div>
              <div className="w-full flex">
                <div className="flex flex-col w-[90%] h-fit items-center space-x-4 -translate-y-16 translate-x-10 md:flex-row">
                  <div className="flex items-center justify-between w-full flex-col md:flex-row space-y-4">
                    <div className="flex items-center space-x-4 flex-col md:flex-row w-full">
                      <div className="flex relative w-fit rounded-full border-8 border-white">
                        <div className="w-52 h-52 flex">
                          <div className="w-full h-full skeleton rounded-full "></div>
                        </div>
                      </div>
                      <div className="flex flex-col w-full space-y-2">
                        <span
                          className={`${poppins.className} font-extrabold text-3xl skeleton w-52 h-7`}
                        ></span>
                        <span
                          className={`${poppins.className} font-extrabold text-3xl skeleton w-48 h-3`}
                        ></span>
                      </div>
                    </div>
                    <div>
                      <button className="btn btn-info border-0 skeleton w-28"></button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="w-fit px-2">
            <div className="mx-4 w-fit flex flex-col space-y-5 items-center">
              <div className="flex sticky bg-white w-full h-fit top-0 justify-center">
                <span
                  className={`${poppins.className} font-bold text-5xl py-4 w-80 h-10 skeleton`}
                ></span>
              </div>
              <div className="flex w-fit justify-center">
                <div className="flex flex-col items-center w-fit">
                  <div className="grid grid-rows-[auto] grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
                    {[...Array(6)].map((i, index) => (
                      <a
                        key={index}
                        href="#"
                        className="block rounded-lg p-4 shadow-sm shadow-indigo-400 hover:shadow-lg transition-all flex-grow max-w-96 min-w-[350px]"
                      >
                        <div className="h-56 w-full skeleton"></div>
                        <div className="mt-2">
                          <dl className="space-y-2">
                            <div>
                              <dt className="sr-only">Filename</dt>

                              <dd className="text-sm text-gray-500 w-20 h-4 skeleton"></dd>
                            </div>

                            <div>
                              <dt className="sr-only">Address</dt>

                              <dd className="text-sm text-gray-500 w-full h-4 skeleton"></dd>
                            </div>
                          </dl>
                        </div>
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : isUser ? (
        <>
          <div className="flex px-2 w-full">
            <div className="flex flex-col w-full relative box-border bg-[#F7F9F2] !mx-4 rounded-xl">
              <div className="bg-[#83B4FF]/30 w-full h-52 rounded-xl">
                <div className="relative h-full w-full">
                  <Image
                    src={
                      "https://images.unsplash.com/photo-1666224182627-7dc792e4b419?q=80&w=2515&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                    }
                    width={1000}
                    height={1000}
                    alt="banner"
                    placeholder="empty"
                    priority={true}
                    className="w-full h-full object-cover rounded-xl absolute"
                  />
                  <div className="absolute w-full h-full bg-black/50 rounded-xl"></div>
                </div>
              </div>
              <div className="w-full flex">
                <div className="flex flex-col w-[90%] h-fit items-center space-x-4 -translate-y-16 translate-x-10 md:flex-row">
                  <div className="flex items-center justify-between w-full flex-col md:flex-row space-y-4">
                    <div className="flex items-center space-x-4 flex-col md:flex-row w-full">
                      <div className="flex relative w-fit rounded-full border-8 border-white">
                        <div className="w-52 h-52 flex">
                          {profilePic ? (
                            <Image
                              src={profilePic}
                              alt="user-profile"
                              width={1000}
                              height={1000}
                              className="rounded-full object-cover w-full"
                            />
                          ) : (
                            <Image
                              src={not_found}
                              alt="user-profile"
                              width={1000}
                              height={1000}
                              className="rounded-full object-cover w-full"
                            />
                          )}
                        </div>
                        <div className="bg-gray-900/50 absolute opacity-0 hover:opacity-100 transition-all w-full h-full rounded-full flex items-center flex-col justify-center">
                          <input
                            type="file"
                            className="absolute w-full h-full opacity-0"
                          />
                          <span className="bg-white p-2 rounded-full">
                            <PencilIcon color="black" />
                          </span>
                          <span className="text-white">
                            Click to Change Picture
                          </span>
                        </div>
                      </div>
                      <div className="flex flex-col w-full">
                        <span
                          className={`${poppins.className} font-extrabold text-3xl`}
                        >
                          {user?.full_name}
                        </span>
                        <span>{user?.email}</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-5">
                      <Link
                        className="btn btn-info whitespace-nowrap"
                        href={`${props.params.internId}/edit`}
                      >
                        <span>Edit User</span>
                      </Link>
                      <div className="dropdown dropdown-end">
                        <div
                          tabIndex={0}
                          role="button"
                          className="btn !bg-transparent rounded-full"
                        >
                          <EllipsisVertical />
                        </div>
                        <ul
                          tabIndex={0}
                          className="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow"
                        >
                          <li>
                            <Link
                              href={`/editor/certificate?id=${user?.intern_code}&type=Offer Letter`}
                            >
                              <span>Send Offer Letter</span>
                            </Link>
                          </li>
                          <li>
                            <span>Send Another Letter</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {isCertificateLoading ? (
            <div className="w-fit px-2">
              <div className="mx-4 w-fit flex flex-col space-y-5 items-center">
                <div className="flex sticky bg-white w-full h-fit top-0 justify-center">
                  <span
                    className={`${poppins.className} font-bold text-5xl py-4 w-80 h-10 skeleton`}
                  ></span>
                </div>
                <div className="flex w-fit justify-center">
                  <div className="flex flex-col items-center w-fit">
                    <div className="grid grid-rows-[auto] grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
                      {[...Array(6)].map((i, index) => (
                        <a
                          key={index}
                          href="#"
                          className="block rounded-lg p-4 shadow-sm shadow-indigo-400 hover:shadow-lg transition-all flex-grow max-w-96 min-w-[350px]"
                        >
                          <div className="h-56 w-full skeleton"></div>
                          <div className="mt-2">
                            <dl className="space-y-2">
                              <div>
                                <dt className="sr-only">Filename</dt>

                                <dd className="text-sm text-gray-500 w-20 h-4 skeleton"></dd>
                              </div>

                              <div>
                                <dt className="sr-only">Address</dt>

                                <dd className="text-sm text-gray-500 w-full h-4 skeleton"></dd>
                              </div>
                            </dl>
                          </div>
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="w-fit px-2">
              <div className="mx-4 w-fit flex flex-col space-y-5 items-center">
                <div className="flex sticky bg-white w-full h-fit top-0 justify-center">
                  <span
                    className={`${poppins.className} font-bold text-5xl py-4 `}
                  >
                    Certificates
                  </span>
                </div>
                <div className="flex w-fit justify-center">
                  {certList.length > 0 ? (
                    <div className="flex flex-col items-center w-fit">
                      <div className="grid grid-rows-[auto] grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
                        {certList.map((item, index) => (
                          <div
                            key={index}
                            className="block rounded-lg p-4 shadow-sm shadow-indigo-400 hover:shadow-lg transition-all flex-grow max-w-96"
                          >
                            {toast === 200 ? (
                              <div className="w-full h-40">
                                <span className="text-black items-center flex flex-col justify-center text-start">
                                  {message}
                                </span>
                              </div>
                            ) : (
                              <Link href={`/viewer/file/${item.filename}.pdf`}>
                                <Image
                                  alt=""
                                  width={1000}
                                  height={1000}
                                  className="w-full h-40 object-cover object-top"
                                  src={`http://localhost:8000/api/pdfs/thumbnail/${item.filename}.png`}
                                />
                              </Link>
                            )}

                            <div className="mt-2">
                              <dl>
                                <div>
                                  <dt className="sr-only">Price</dt>

                                  <dd className="text-sm text-gray-500">
                                    {item.filename}.pdf
                                  </dd>
                                </div>
                              </dl>

                              <div className="mt-6 flex items-center justify-between text-xs">
                                <div className="sm:inline-flex sm:shrink-0 sm:items-center sm:gap-2">
                                  <CalendarPlus className="text-indigo-700" />

                                  <div className="mt-1.5 sm:mt-0">
                                    <p className="text-gray-500">Created at</p>

                                    <p className="font-medium text-sm">
                                      {new Date(item.created_date).getDate()}/
                                      {new Date(item.created_date).getMonth()}/
                                      {new Date(
                                        item.created_date
                                      ).getFullYear()}
                                      {new Date(
                                        item.created_date
                                      ).toLocaleTimeString()}
                                    </p>
                                  </div>
                                </div>
                                <div className="flex space-x-1">
                                  <div
                                    className="sm:inline-flex sm:shrink-0 sm:items-center sm:gap-2 rounded-full hover:bg-gray-300 p-2 items-center"
                                    onClick={() => {
                                      let deletealert = alertT(
                                        <div className="flex flex-col w-full space-y-4">
                                          <span>
                                            Are You Sure to delete the
                                            Certificate
                                          </span>
                                          <div className="flex space-x-2">
                                            <button
                                              className="btn btn-error flex-grow"
                                              onClick={() => {
                                                alertT.promise(
                                                  deleteCertificate(
                                                    item.filename
                                                  ),
                                                  {
                                                    loading: "Deleteing",
                                                    success:
                                                      "Successfully Deleted",
                                                    error: "Error",
                                                    duration: 1000,
                                                  }
                                                );
                                                alertT.dismiss(deletealert);
                                              }}
                                            >
                                              Yes
                                            </button>
                                            <button
                                              className="btn btn-info flex-grow"
                                              onClick={() => {
                                                alertT.info(
                                                  "Certificate not deleted",
                                                  {
                                                    duration: 1000,
                                                  }
                                                );
                                                alertT.dismiss(deletealert);
                                              }}
                                            >
                                              No
                                            </button>
                                          </div>
                                        </div>
                                      );
                                    }}
                                  >
                                    <Trash
                                      className="text-indigo-700"
                                      size={20}
                                    />
                                  </div>
                                  <div
                                    className="sm:inline-flex sm:shrink-0 sm:items-center sm:gap-2 rounded-full hover:bg-gray-300 p-2 items-center"
                                    onClick={() => {
                                      sendCertificate(item.filename);
                                    }}
                                  >
                                    <Send
                                      className="text-indigo-700"
                                      size={20}
                                    />
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="min-h-60 flex flex-col bg-white rounded-xl">
                      <div className="flex flex-auto flex-col justify-center items-center p-4 md:p-5">
                        <HardDrive size={50} />
                        <p className="mt-2 text-xl text-gray-800/70">
                          No data to show
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="w-full h-full">
          <div className="flex flex-col items-center">
            <Image
              src={not_found}
              width={1000}
              height={1000}
              alt="not_found"
              className="w-96 h-96"
            />
            <span className="text-9xl font-poppins font-bold">404</span>
            <span className="text-2xl font-poppins font-bold">
              Intern Not Found
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default Page;
