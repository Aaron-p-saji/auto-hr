"use client";
import React, { useEffect, useState } from "react";
import { Raleway } from "next/font/google";
import axios from "axios";
// import { useAuthStore } from "@/providers/context";
import { useRouter } from "next/navigation";
import { ServerOffIcon } from "lucide-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import InstituteSearch from "./_component/search";
import { AddressAutofill, SearchBox } from "@mapbox/search-js-react";
import { CountrySearch } from "./_component/country_search";

type Props = {};

const raleway = Raleway({ weight: "900", subsets: ["latin"] });

type RegisterFields = {
  fullname: string;
  dob: Date;
  email: string;
  phone: string;
  password: string;
  jobTitle: string;
  street: string;
  institution: string;
  zip: string | null;
  startDate: Date;
  endDate: Date;
};

const CreateUser: React.FC<Props> = (props: Props) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isAlert, setAlert] = useState(false);
  const router = useRouter();
  const [data, setData] = useState<RegisterFields>({
    fullname: "",
    dob: new Date(),
    email: "",
    phone: "",
    password: "",
    jobTitle: "intern",
    street: "",
    institution: "",
    zip: "",
    startDate: new Date(),
    endDate: new Date(),
  });

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

  // Add the submitData function here if needed

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
          <span className={`text-6xl ${raleway.className}`}>Create Intern</span>
        </div>
        <div className="w-full h-[70vh] overflow-y-scroll pr-10 scrollbar scrollbar-w-2 scrollbar-thumb-[#696969b1] scrollbar-thumb-rounded-full scrollbar-h-2 scrollbar-transparent">
          <form className="space-y-[2vw]">
            <div className="space-y-[2vw]">
              <div className="grid grid-cols-12 grid-rows-[auto] gap-2">
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
                  </label>
                </div>
                <div className="lg:col-span-4 col-span-12">
                  <label className="form-control w-full">
                    <div className="label">
                      <span className="label-text">Full Name</span>
                    </div>
                    <input
                      type="text"
                      placeholder="Devin Jacob Tharayan"
                      className="input input-bordered w-full"
                      value={data.fullname}
                      onChange={(e) => {
                        setData({
                          ...data,
                          fullname: e.target.value,
                        });
                      }}
                    />
                    <div className="label"></div>
                  </label>
                </div>

                <div className="lg:col-span-4 col-span-12">
                  <label className="form-control w-full">
                    <div className="label">
                      <span className="label-text">Date of Birth</span>
                    </div>
                    <DatePicker
                      selected={data.dob}
                      onChange={(e) => {
                        if (e) {
                          setData({ ...data, dob: e });
                        }
                      }}
                      dateFormat="dd/MM/yyyy"
                      className="input input-bordered w-full bg-transparent"
                    />
                  </label>
                </div>

                <div className="lg:col-span-4 col-span-12">
                  <div className="label">
                    <span className="label-text">Job Title</span>
                  </div>
                  <select
                    className="select select-bordered w-full"
                    value={data.jobTitle}
                    onChange={(e) => {
                      setData({
                        ...data,
                        jobTitle: e.target.value,
                      });
                    }}
                  >
                    <option value="intern">Intern</option>
                    <option value="trainee">Trainee</option>
                  </select>
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
                      <span className="label-text">Phone Number</span>
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
                  </label>
                </div>

                <div className="lg:col-span-4 col-span-12">
                  <div className="label">
                    <span className="label-text">Institute</span>
                  </div>
                  <InstituteSearch />
                </div>

                <div className="lg:col-span-4 col-span-12">
                  <div className="label">
                    <span className="label-text">Country</span>
                  </div>
                  <CountrySearch />
                </div>

                <div className="lg:col-span-4 col-span-12">
                  <div className="label">
                    <span className="label-text">Street</span>
                  </div>
                  <SearchBox
                    accessToken="pk.eyJ1IjoiYWFyb25wc2FqaSIsImEiOiJjbG1hZ3E1amsweTg5M25teHloYnB5bjZjIn0.PNCqXiN4opvMCXlsK41OMQ"
                    value={data.street}
                    options={{
                      language: "en",
                      country: "US",
                    }}
                    onChange={(e) => {
                      setData({
                        ...data,
                        street: e,
                      });
                    }}
                  />
                </div>

                <div className="lg:col-span-4 col-span-12">
                  <label className="form-control w-full">
                    <div className="label">
                      <span className="label-text">ZIP</span>
                    </div>
                    <input
                      type="text"
                      inputMode="numeric"
                      placeholder="687541"
                      className="input input-bordered w-full"
                      value={String(data.zip)}
                      onChange={(e) => {
                        setData({
                          ...data,
                          zip: e.target.value,
                        });
                      }}
                    />
                  </label>
                </div>

                <div className="lg:col-span-4 col-span-12">
                  <label className="form-control w-full">
                    <div className="label">
                      <span className="label-text">Start Date</span>
                    </div>
                    <DatePicker
                      selected={data.startDate}
                      onChange={(e) => {
                        if (e) {
                          setData({ ...data, startDate: e });
                        }
                      }}
                      dateFormat="dd/MM/yyyy"
                      className="input input-bordered w-full bg-transparent"
                    />
                  </label>
                </div>

                <div className="lg:col-span-4 col-span-12">
                  <label className="form-control w-full">
                    <div className="label">
                      <span className="label-text">End Date</span>
                    </div>
                    <DatePicker
                      selected={data.endDate}
                      onChange={(e) => {
                        if (e) {
                          setData({ ...data, endDate: e });
                        }
                      }}
                      dateFormat="dd/MM/yyyy"
                      className="input input-bordered w-full bg-transparent"
                    />
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
