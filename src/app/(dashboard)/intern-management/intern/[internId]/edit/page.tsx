"use client";
import React, { useEffect, useState } from "react";
import { Raleway } from "next/font/google";
import axios from "axios";
import { useRouter } from "next/navigation";
import { PauseIcon, RecycleIcon, ServerOffIcon, Trash2 } from "lucide-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {
  RegisterFields,
  UserFields,
  registerSchema,
} from "@/providers/zodTypes";
import { Controller, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import AsyncCreatableSelect from "react-select/async-creatable"; // Import AsyncCreatableSelect for async functionality
import { debounce } from "lodash";
import { useAuthStore } from "@/providers/context";
import Link from "next/link";
import { toast as alertT, toast } from "sonner";

type Props = {};

const raleway = Raleway({ weight: "900", subsets: ["latin"] });
interface CountryOption {
  label: string;
  value: string;
}

interface InstituteOption {
  label: string;
  value: string;
}

const CreateUser = (props: { params: { internId: string } }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isAlert, setAlert] = useState(false);
  const [profilePic, setProfilePic] = useState<File[]>([]);
  const [options, setOptions] = useState<CountryOption[]>([]);
  const [instituteOptions, setInstituteOptions] = useState<InstituteOption[]>(
    []
  );
  const [text, setText] = useState("");
  const [progress, SetUploadProgress] = useState<Number>(0);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [country, setCountry] = useState<CountryOption | null>();
  const [institute, setInstitute] = useState<InstituteOption | null>();
  const [user, setUser] = useState<UserFields | null>(null);
  const [isUser, setIsUser] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    control,
    setValue,
    reset,
    watch,
    clearErrors,
    formState: { errors, isValid },
  } = useForm<RegisterFields>({
    resolver: zodResolver(registerSchema),
  });

  const fetchCountries = debounce(async (inputValue: string) => {
    if (inputValue) {
      try {
        const response = await axios.get(
          `https://restcountries.com/v3.1/name/${inputValue}`
        );
        if (response.status === 200) {
          const countries = response.data.map((country: any) => ({
            label: country.nicename,
            value: country.id,
          }));
          setOptions(countries);
        }
      } catch (error) {
        console.error("Error fetching countries:", error);
      }
    }
  }, 300);

  useEffect(() => {
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
          console.log(res.data);
          setUser(res.data);
          reset(res.data);
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

  const getCountryById = async (inputValue: Number) => {
    try {
      const response = await axios.get(
        `http://127.0.0.1:8000/api/get_nationality/?id=${inputValue}`,
        {
          headers: {
            Authorization: `Bearer ${useAuthStore.getState().token}`,
          },
        }
      );
      if (response.status === 200) {
        return {
          label: response.data.nicename,
          value: response.data.id,
        };
      }
    } catch (error) {
      alertT.error("Error Fetching Country", {
        description: "This is likely from the server side",
        duration: 1500,
      });
    }
    return {
      label: "",
      value: "",
    };
  };

  useEffect(() => {
    if (institute == null) {
      if (user?.institute) {
        setInstitute({
          label: user.institute,
          value: user.institute,
        });
      }
    }
    if (country == null) {
      if (user?.nationality) {
        const data = getCountryById(user.nationality).then((e) => {
          setCountry({
            label: e.label,
            value: e.value,
          });
        });
      }
    }

    if (user?.dob) {
      setValue("dob", new Date(user.dob));
    }
    if (user?.start_date) {
      setValue("start_date", new Date(user.start_date));
    }
    if (user?.endDate) {
      setValue("endDate", new Date(user.endDate));
    }
  }, [user]);

  const fetchInstitutes = debounce(async (inputValue: string) => {
    if (inputValue) {
      try {
        const response = await axios.get(
          `http://universities.hipolabs.com/search?name=${inputValue}`
        );
        if (response.status === 200) {
          const institutes = response.data.map((institute: any) => ({
            label: institute.name,
            value: institute.name,
          }));
          setInstituteOptions(institutes);
        }
      } catch (error) {
        alertT.error("Error Fetching Institutes", {
          description: "This is likely from the server side",
          duration: 1500,
        });
      }
    }
  }, 300);

  const checkEmailExists = async (email: string) => {
    if (email !== user?.email) {
      try {
        const response = await axios.get(
          "http://localhost:8000/api/check_email",
          {
            params: { email: email },
            headers: {
              Authorization: `Bearer ${useAuthStore.getState().token}`,
            },
          }
        );
        if (response.status === 200) {
          return true;
        }
      } catch (error) {
        return false;
      }
      return false;
    } else if (email === user.email) {
      return false;
    }
  };

  const loadCountryOptions = async (inputValue: string) => {
    try {
      const response = await axios.get(
        `http://127.0.0.1:8000/api/get_nationality/?name=${inputValue}`
      );
      if (response.status === 200) {
        const countries = response.data.map((country: any) => ({
          label: country.name.common,
          value: country.name.common,
        }));
        return countries;
      }
    } catch (error) {
      alertT.error("Error Fetching Country", {
        description: "This is likely from the server side",
        duration: 1500,
      });
    }
    return [];
  };

  const loadInstituteOptions = async (inputValue: string) => {
    try {
      const response = await axios.get(
        `http://universities.hipolabs.com/search?name=${inputValue}`
      );
      if (response.status === 200) {
        const institutes = response.data.map((institute: any) => ({
          label: institute.name,
          value: institute.name,
        }));
        return institutes;
      }
    } catch (error) {
      alertT.error("Error Fetching Institutes", {
        description: "This is likely from the server side",
        duration: 1500,
      });
    }
    return [];
  };

  const handleCreateCountry = async (inputValue: any) => {
    const newOption = { label: inputValue, value: inputValue };
    setOptions((prev) => [...prev, newOption]);
    setValue("nationality", inputValue);
  };

  const handleCreateInstitute = async (inputValue: string) => {
    const newOption = { label: inputValue, value: inputValue };
    setInstituteOptions((prev) => [...prev, newOption]);
    setValue("institute", inputValue);
  };

  const email = useWatch({ control, name: "email" });

  useEffect(() => {
    if (email) {
      const timeoutId = setTimeout(async () => {
        const exists = await checkEmailExists(email);
        if (exists === true) {
          console.log("why");
          setEmailError("Email already exists.");
        } else {
          console.log("yeah");
          setEmailError(null);
        }
      }, 500);
      return () => clearTimeout(timeoutId);
    }
  }, [email]);
  const [formattedDate, setFormattedDate] = useState<Date | null>(null);

  const onSubmit = async (data: RegisterFields) => {
    setIsLoading(true);
    SetUploadProgress(0); // Initialize progress
    console.log(data);

    const resData = new FormData();
    Object.keys(data).forEach((key) => {
      const value = data[key as keyof RegisterFields];
      if (value instanceof Date) {
        resData.append(key, value.toISOString().split("T")[0]); // Convert Date to ISO string
      } else {
        resData.append(key, value as string); // Append other values directly
      }
      resData.append("intern_code", props.params.internId);
    });
    const loading = alertT.loading("Updating user");
    try {
      const uploadResponse = await axios.patch(
        "http://localhost:8000/api/intern/",
        resData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${useAuthStore.getState().token}`,
          },
        }
      );

      if (uploadResponse.status === 200) {
        router.replace("/");
        alertT.success("Successfully Updated User", {
          duration: 1500,
        });
      } else {
        alertT.error("Updated User was unsuccessfull", {
          duration: 1500,
        });
      }
    } catch (uploadError) {
      alertT.error("Updated User was unsuccessfull", {
        duration: 1500,
      });
    } finally {
      alertT.dismiss(loading);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const newFiles = Array.from(event.target.files);
      setProfilePic(newFiles);
    }
  };

  const removeFile = (index: number) => {
    setProfilePic(profilePic.filter((file, i) => i !== index));
  };

  return (
    <div className="h-fit mt-[10vh] text-black ml-[10%] w-[80%]">
      <div className="flex flex-col space-y-[2vw]">
        <div>
          <span className={`text-6xl ${raleway.className}`}>Create Intern</span>
        </div>
        <div className="w-full h-[70vh] overflow-y-scroll pr-10 scrollbar scrollbar-w-2 scrollbar-thumb-[#696969b1] scrollbar-thumb-rounded-full scrollbar-h-2 scrollbar-transparent">
          <form className="space-y-[2vw]" onSubmit={handleSubmit(onSubmit)}>
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
                      value={props.params.internId}
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
                      {...register("full_name")}
                    />
                    {errors.full_name && (
                      <div className="label">
                        <span className="label-text-alt text-red-500">
                          {errors.full_name.message}
                        </span>
                      </div>
                    )}
                  </label>
                </div>

                <div className="lg:col-span-4 col-span-12">
                  <label className="form-control w-full">
                    <div className="label">
                      <span className="label-text">Date of Birth</span>
                    </div>
                    <Controller
                      name="dob"
                      control={control}
                      render={({ field }) => (
                        <DatePicker
                          selected={field.value}
                          onChange={(date) => {
                            field.onChange(date);
                          }}
                          dateFormat="dd/MM/YYYY"
                          className="input input-bordered w-full bg-transparent"
                        />
                      )}
                    />
                    {errors.dob && (
                      <div className="label">
                        <span className="label-text-alt text-red-500">
                          {errors.dob.message}
                        </span>
                      </div>
                    )}
                  </label>
                </div>

                <div className="lg:col-span-4 col-span-12">
                  <div className="label">
                    <span className="label-text">Job Title</span>
                  </div>
                  <select
                    className="select select-bordered w-full"
                    {...register("job_title")}
                  >
                    <option value="Intern">Intern</option>
                    <option value="Trainee">Trainee</option>
                  </select>
                  {errors.job_title && (
                    <div className="label">
                      <span className="label-text-alt text-red-500">
                        {errors.job_title.message}
                      </span>
                    </div>
                  )}
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
                      {...register("email")}
                    />
                    {errors.email && (
                      <div className="label">
                        <span className="label-text-alt text-red-500">
                          {errors.email.message}
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
                      {...register("phone_number")}
                    />
                    {errors.phone_number && (
                      <div className="label">
                        <span className="label-text-alt text-red-500">
                          {errors.phone_number.message}
                        </span>
                      </div>
                    )}
                  </label>
                </div>

                <div className="lg:col-span-4 col-span-12">
                  <div className="label">
                    <span className="label-text">Country</span>
                  </div>
                  <Controller
                    name="nationality"
                    control={control}
                    render={({ field }) => (
                      <AsyncCreatableSelect
                        {...field}
                        isClearable
                        loadOptions={loadCountryOptions}
                        onChange={(selected) => {
                          setValue(
                            "nationality",
                            selected ? Number(selected.value) : 92
                          );
                          setCountry(selected);
                          clearErrors("nationality");
                        }}
                        onInputChange={(inputValue) => {
                          fetchCountries(inputValue);
                        }}
                        onCreateOption={(inputValue) => {
                          handleCreateCountry(inputValue);
                          clearErrors("nationality");
                        }}
                        value={country}
                      />
                    )}
                  />
                  {errors.nationality && (
                    <div className="label">
                      <span className="label-text-alt text-red-500">
                        {errors.nationality.message}
                      </span>
                    </div>
                  )}
                </div>

                <div className="lg:col-span-4 col-span-12">
                  <div className="label">
                    <span className="label-text">Institute</span>
                  </div>
                  <Controller
                    name="institute"
                    control={control}
                    render={({ field }) => (
                      <AsyncCreatableSelect
                        {...field}
                        isClearable
                        loadOptions={loadInstituteOptions}
                        onChange={(selected) => {
                          setValue("institute", selected ? selected.value : "");
                          setInstitute(selected);
                          clearErrors("institute");
                        }}
                        onInputChange={(inputValue) => {
                          fetchInstitutes(inputValue);
                        }}
                        onCreateOption={(inputValue) => {
                          handleCreateInstitute(inputValue);
                          clearErrors("institute");
                        }}
                        value={institute}
                      />
                    )}
                  />
                  {errors.institute && (
                    <div className="label">
                      <span className="label-text-alt text-red-500">
                        {errors.institute.message}
                      </span>
                    </div>
                  )}
                </div>

                <div className="lg:col-span-4 col-span-12">
                  <div className="label">
                    <span className="label-text">Street</span>
                  </div>
                  <input
                    type="text"
                    placeholder="Street"
                    className="input input-bordered w-full"
                    {...register("street_address")}
                  />
                  {errors.street_address && (
                    <div className="label">
                      <span className="label-text-alt text-red-500">
                        {errors.street_address.message}
                      </span>
                    </div>
                  )}
                </div>

                <div className="lg:col-span-4 col-span-12">
                  <label className="form-control w-full">
                    <div className="label">
                      <span className="label-text">ZIP</span>
                    </div>
                    <input
                      type="text"
                      placeholder="PIN Code"
                      className="input input-bordered w-full"
                      {...register("zip")}
                    />
                    {errors.zip && (
                      <div className="label">
                        <span className="label-text-alt text-red-500">
                          {errors.zip.message}
                        </span>
                      </div>
                    )}
                  </label>
                </div>

                <div className="lg:col-span-4 col-span-12">
                  <label className="form-control w-full">
                    <div className="label">
                      <span className="label-text">Start Date</span>
                    </div>
                    <Controller
                      name="start_date"
                      control={control}
                      render={({ field }) => (
                        <DatePicker
                          selected={field.value}
                          onChange={(date) => {
                            field.onChange(date);
                          }}
                          dateFormat="dd/MM/YYYY"
                          className="input input-bordered w-full bg-transparent"
                        />
                      )}
                    />
                    {errors.start_date && (
                      <div className="label">
                        <span className="label-text-alt text-red-500">
                          {errors.start_date.message}
                        </span>
                      </div>
                    )}
                  </label>
                </div>
                <div className="lg:col-span-4 col-span-12">
                  <label className="form-control w-full">
                    <div className="label">
                      <span className="label-text">End Date</span>
                    </div>
                    <Controller
                      name="endDate"
                      control={control}
                      render={({ field }) => (
                        <DatePicker
                          selected={field.value}
                          onChange={(date) => {
                            field.onChange(date);
                            console.log(date?.toISOString().split("T"));
                          }}
                          dateFormat="dd/MM/yy"
                          className="input input-bordered w-full bg-transparent"
                        />
                      )}
                    />
                    {errors.endDate && (
                      <div className="label">
                        <span className="label-text-alt text-red-500">
                          {errors.endDate.message}
                        </span>
                      </div>
                    )}
                  </label>
                </div>
              </div>
            </div>

            <div className="col-span-12 justify-center flex">
              <button
                className={`btn btn-neutral w-[40%]  bg-black hover:bg-black/90`}
                type="submit"
                disabled={isLoading}
              >
                Update Intern
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
