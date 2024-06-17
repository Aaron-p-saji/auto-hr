"use client";
import React, { useEffect, useState } from "react";
import { Raleway } from "next/font/google";
import axios from "axios";
// import { useAuthStore } from "@/providers/context";
import { useRouter } from "next/navigation";
import { ServerCrashIcon, ServerOffIcon } from "lucide-react";

type Props = {};

const raleway = Raleway({ weight: "900", subsets: ["latin"] });

type RegisterFields = {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  password: string;
  send_email: boolean;
  userType: string;
};
const CreateUser: React.FC<Props> = (props: Props) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isAlert, setAlert] = useState(false);
  const router = useRouter();
  const [data, setData] = useState<RegisterFields>({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    password: "",
    send_email: true,
    userType: "user",
  });

  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [usernameError, setUsernameError] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);

  const checkEmailExists = async (email: string) => {
    const response = await axios.get("http://localhost:8000/api/check_email/", {
      params: {
        email: email,
      },
    });
    if (response.status === 200) {
      return response.data.exists;
    }
  };

  useEffect(() => {
    if (data.email) {
      const timeoutId = setTimeout(async () => {
        const exists = await checkEmailExists(data.email);
        if (exists) {
          setEmailError("Email already exists.");
        } else {
          setEmailError(null);
        }
      }, 500);
      return () => clearTimeout(timeoutId);
    }
  }, [data.email]);

  //   const submitData = async (e: React.FormEvent<HTMLFormElement>) => {
  //     e.preventDefault();
  //     if (validatePassword(data.password)) {
  //       setIsLoading(true);
  //     //   const token = useAuthStore.getState().token;
  //       try {
  //         if (token) {
  //           const res = await axios.post(
  //             "http://localhost:8000/api/user/",
  //             {
  //               email: data.email,
  //               first_name: data.first_name,
  //               last_name: data.last_name,
  //               username: data.username,
  //               password: data.password,
  //               is_superuser: data.userType === "admin" ? true : false,
  //               is_staff: data.userType === "admin" ? true : false,
  //               send_mail: data.send_email,
  //             },
  //             {
  //               headers: {
  //                 Authorization: `Bearer ${token}`,
  //               },
  //             }
  //           );

  //           if (res.status === 200) {
  //             router.push("/user-management");
  //           } else {
  //             setAlert(true);
  //             setTimeout(() => {
  //               setAlert(false);
  //             }, 1000);
  //             router.push("/");
  //           }
  //         }
  //       } catch (error) {
  //         console.log(error);
  //         setAlert(true);
  //         setTimeout(() => {
  //           setAlert(false);
  //         }, 1000);
  //         router.push("/");
  //       } finally {
  //         setIsLoading(false);
  //       }
  //     }
  //   };

  return (
    <div className="h-full mt-[10vh] text-black ml-[10%] w-[80%]">
      {isAlert && (
        <div className="toast toast-top toast-center !w-[10vw]">
          <div className="alert alert-error w-full">
            <span className="flex space-x-3 w-full">
              <ServerOffIcon />
              Internal Server Error
            </span>
          </div>
        </div>
      )}
      <div className="flex flex-col space-y-[2vw]">
        <div>
          <span className={`text-6xl ${raleway.className}`}>Create User</span>
        </div>
        <div className="w-full h-[70vh] overflow-y-scroll pr-10 scrollbar scrollbar-w-2 scrollbar-thumb-[#696969b1] scrollbar-thumb-rounded-full scrollbar-h-2 scrollbar-transparent">
          <form
            className="space-y-[2vw]"
            //   onSubmit={submitData} WIP
          >
            <div className="space-y-[2vw]">
              <span className={`text-2xl`}>General Details</span>

              <div className="grid grid-cols-12 grid-rows-[auto] gap-2">
                <div className="lg:col-span-4  col-span-12">
                  <label className="form-control w-full">
                    <div className="label">
                      <span className="label-text">First Name</span>
                    </div>
                    <input
                      type="text"
                      placeholder="Devin"
                      className="input input-bordered w-full"
                      value={data.first_name}
                      onChange={(e) => {
                        setData({
                          ...data,
                          first_name: e.target.value,
                        });
                      }}
                    />
                    <div className="label"></div>
                  </label>
                </div>

                <div className="lg:col-span-4 col-span-12">
                  <label className="form-control w-full">
                    <div className="label">
                      <span className="label-text">Middle Name</span>
                    </div>
                    <input
                      type="text"
                      placeholder="Carlos"
                      className="input input-bordered w-full"
                      value={data.last_name}
                      onChange={(e) => {
                        setData({
                          ...data,
                          last_name: e.target.value,
                        });
                      }}
                    />
                    <div className="label"></div>
                  </label>
                </div>

                <div className="lg:col-span-4 col-span-12">
                  <label className="form-control w-full">
                    <div className="label">
                      <span className="label-text">Last Name</span>
                    </div>
                    <input
                      type="text"
                      placeholder="John"
                      className="input input-bordered w-full"
                      value={data.last_name}
                      onChange={(e) => {
                        setData({
                          ...data,
                          last_name: e.target.value,
                        });
                      }}
                    />
                    <div className="label"></div>
                  </label>
                </div>

                <div className="lg:col-span-4 col-span-12">
                  <label className="form-control w-full">
                    <div className="label">
                      <span className="label-text">phone number</span>
                    </div>
                    <input
                      type="tel"
                      placeholder="+91 94254 XXXXX"
                      className="input input-bordered w-full"
                      value={data.phone}
                      onChange={(e) => {
                        setData({
                          ...data,
                          phone: e.target.value.toLowerCase(),
                        });
                      }}
                    />
                    {usernameError && (
                      <div className="label">
                        <span className="label-text-alt text-red-500">
                          {usernameError}
                        </span>
                      </div>
                    )}
                  </label>
                </div>

                <div className="lg:col-span-4 col-span-12">
                  <label className="form-control w-full">
                    <div className="label">
                      <span className="label-text">Email</span>
                    </div>
                    <input
                      type="email"
                      placeholder="devin.carlos@domain.com"
                      className="input input-bordered w-full"
                      value={data.email}
                      onChange={(e) => {
                        setData({
                          ...data,
                          email: e.target.value.toLowerCase(),
                        });
                      }}
                    />
                    {emailError && (
                      <div className="label">
                        <span className="label-text-alt text-red-500">
                          {emailError}
                        </span>
                      </div>
                    )}
                  </label>
                </div>

                <div className="lg:col-span-4 col-span-12">
                  <label className="form-control w-full">
                    <div className="label">
                      <span className="label-text">Employee ID</span>
                    </div>
                    <input
                      type="text"
                      placeholder=""
                      className="input input-bordered w-full disabled:bg-black/10"
                      disabled
                      value={data.password} // WIP
                      onChange={(e) => {
                        setData({
                          ...data,
                          password: e.target.value,
                        });
                      }}
                    />
                    {passwordError && (
                      <div className="label">
                        <span className="label-text-alt text-red-500">
                          {passwordError}
                        </span>
                      </div>
                    )}
                  </label>
                </div>
              </div>
            </div>
            <div className="space-y-[2vw]">
              <span className={`text-2xl`}>Employement Details</span>

              <div className="grid grid-cols-12 grid-rows-[auto] gap-2">
                <div className="lg:col-span-2 col-span-12">
                  <div className="label">
                    <span className="label-text">Level</span>
                  </div>
                  <select
                    className="select select-bordered w-full"
                    value={data.userType}
                    onChange={(e) => {
                      setData({
                        ...data,
                        userType: e.target.value,
                      });
                    }}
                  >
                    <option className="focus:h-10" value="on-site">
                      Fresher
                    </option>
                    <option value="remote">Junior</option>
                    <option value="hybrid">Senior</option>
                  </select>
                </div>
                <div className="lg:col-span-5 col-span-12">
                  <label className="form-control w-full">
                    <div className="label">
                      <span className="label-text">Job Title</span>
                    </div>
                    <input
                      type="text"
                      placeholder="Web Developer"
                      className="input input-bordered w-full"
                      value={data.first_name}
                      onChange={(e) => {
                        setData({
                          ...data,
                          first_name: e.target.value,
                        });
                      }}
                    />
                    <div className="label"></div>
                  </label>
                </div>

                <div className="lg:col-span-5 col-span-12">
                  <label className="form-control w-full">
                    <div className="label">
                      <span className="label-text">Start Date</span>
                    </div>
                    <input
                      type="date"
                      className="input input-bordered w-full"
                      value={data.last_name}
                      placeholder="dd-mm-yyyy"
                      onChange={(e) => {
                        setData({
                          ...data,
                          last_name: e.target.value,
                        });
                      }}
                    />
                    <div className="label"></div>
                  </label>
                </div>
              </div>
            </div>

            <div className="col-span-12 justify-center flex">
              <button
                className="btn btn-neutral w-[40%] bg-black hover:bg-black/90"
                type="submit"
              >
                Create User
                {isLoading && (
                  <span className="loading loading-dots loading-md"></span>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateUser;
