"use client";
import React, { useEffect, useState } from "react";
import { Raleway } from "next/font/google";
import axios from "axios";
import { useRouter } from "next/navigation";
import { PauseIcon, RecycleIcon, ServerOffIcon, Trash2 } from "lucide-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { RegisterFields, registerSchema } from "@/providers/zodTypes";
import { Controller, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import AsyncCreatableSelect from "react-select/async-creatable"; // Import AsyncCreatableSelect for async functionality
import { debounce } from "lodash";
import { useAuthStore } from "@/providers/context";
import Link from "next/link";
import { toast as alerT } from "sonner";

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

const CreateUser: React.FC<Props> = (props: Props) => {
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
  const router = useRouter();

  const {
    register,
    handleSubmit,
    control,
    setValue,
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
            label: country.name.common,
            value: country.name.common,
          }));
          setOptions(countries);
        }
      } catch (error) {
        console.error("Error fetching countries:", error);
      }
    }
  }, 300);

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
        console.error("Error fetching institutes:", error);
      }
    }
  }, 300);

  const checkEmailExists = async (email: string) => {
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
        return response.data.exists;
      }
    } catch (error) {
      console.error("Error checking email:", error);
    }
    return false;
  };

  const loadCountryOptions = async (inputValue: string) => {
    try {
      const response = await axios.get(
        `https://restcountries.com/v3.1/name/${inputValue}`
      );
      if (response.status === 200) {
        const countries = response.data.map((country: any) => ({
          label: country.name.common,
          value: country.name.common,
        }));
        return countries;
      }
    } catch (error) {
      console.error("Error loading country options:", error);
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
      console.error("Error loading institute options:", error);
    }
    return [];
  };

  const handleCreateCountry = async (inputValue: string) => {
    const newOption = { label: inputValue, value: inputValue };
    setOptions((prev) => [...prev, newOption]);
    setValue("country", inputValue);
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
        if (exists) {
          setEmailError("Email already exists.");
        } else {
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
    });

    if (profilePic) {
      resData.append("intern_photo", profilePic[0]);

      const imageScanData = new FormData();
      imageScanData.append("file", profilePic[0]);

      try {
        const scanResponse = await axios.post(
          "https://www.virustotal.com/api/v3/files",
          imageScanData,
          {
            headers: {
              "x-ApiKey":
                "442b1f57eeec1355204ee89ce783193dfa9e3e246ef77af508ead0270cd4cddd",
              "Content-Type": "multipart/form-data",
            },
            onUploadProgress: (ProgressEvent) => {
              setText("Antivirus Check");
            },
          }
        );

        if (scanResponse.status === 200) {
          const analysisId = scanResponse.data.data.id;
          try {
            const analysisResponse = await axios.get(
              `https://www.virustotal.com/api/v3/analyses/${analysisId}`,
              {
                headers: {
                  "x-ApiKey":
                    "442b1f57eeec1355204ee89ce783193dfa9e3e246ef77af508ead0270cd4cddd",
                  "Content-Type": "application/json",
                },
              }
            );

            if (analysisResponse.status === 200) {
              const maliciousCount =
                analysisResponse.data.data.attributes.stats.malicious;
              if (maliciousCount === 0) {
                try {
                  const uploadResponse = await axios.post(
                    "http://localhost:8000/api/intern/",
                    resData,
                    {
                      headers: {
                        "Content-Type": "multipart/form-data",
                        Authorization: `Bearer ${
                          useAuthStore.getState().token
                        }`,
                      },
                      onUploadProgress: (progressEvent) => {
                        if (progressEvent.lengthComputable) {
                          if (
                            progressEvent.progress !== null &&
                            progressEvent.progress !== undefined
                          ) {
                            console.log(progressEvent.progress * 100);
                            SetUploadProgress(
                              Math.floor(Number(progressEvent.progress * 100))
                            );
                          }
                        }
                      },
                    }
                  );

                  if (uploadResponse.status === 201) {
                    router.replace("/");
                    alerT.success("Successfully User Created", {
                      duration: 1000,
                    });
                  } else {
                    alerT.error("500 Internal Server Error", {
                      duration: 1000,
                      position: "top-center",
                      icon: <ServerOffIcon />,
                    });
                  }
                } catch (uploadError) {
                  alerT.error("Error uploading user Data", {
                    duration: 1000,
                  });
                }
              } else {
                alerT.error("Malicious File Detected", {
                  duration: 1000,
                });
              }
            }
          } catch (analysisError) {
            alerT.error("Error Retrieveing Virus Scan", {
              duration: 1000,
            });
          }
        }
      } catch (scanError) {
        alerT.error("Scan Failed", {
          duration: 1000,
        });
      } finally {
        setIsLoading(false);
      }
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
                    name="country"
                    control={control}
                    render={({ field }) => (
                      <AsyncCreatableSelect
                        {...field}
                        isClearable
                        loadOptions={loadCountryOptions}
                        onChange={(selected) => {
                          setValue("country", selected ? selected.value : "");
                          setCountry(selected);
                          clearErrors("country");
                        }}
                        onInputChange={(inputValue) => {
                          fetchCountries(inputValue);
                        }}
                        onCreateOption={(inputValue) => {
                          handleCreateCountry(inputValue);
                          clearErrors("country");
                        }}
                        value={country}
                      />
                    )}
                  />
                  {errors.country && (
                    <div className="label">
                      <span className="label-text-alt text-red-500">
                        {errors.country.message}
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
            <div className="flex w-full space-x-2">
              <label className={`form-control max-w-xs"`}>
                <div className="label">
                  <span className="label-text">Passport Size Photo</span>
                </div>
                <input
                  type="file"
                  className="file-input file-input-bordered max-w-xs"
                  onChange={handleFileChange}
                  accept=".png, .jpg, .jpeg"
                />
              </label>
              {profilePic.length > 0 && (
                <label className="form-control w-full">
                  <div className="flex flex-col border-2 border-black/25 min-h-20 max-w-lg rounded-2xl p-4">
                    <div className="flex justify-between">
                      <div className="flex items-center space-x-2 cursor-pointer">
                        <svg
                          data-name="Layer 1"
                          height="32"
                          id="Layer_1"
                          viewBox="0 0 32 32"
                          width="32"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path d="M4,16a6,6,0,0,1,12,0Z" fill="#ffba00" />
                          <path
                            d="M22,10a6,6,0,0,1-6,6V4a6,6,0,0,1,6,6"
                            fill="#ea4435"
                          />
                          <path d="M28,16a6,6,0,0,1-12,0Z" fill="#0066da" />
                          <path
                            d="M10,22a6,6,0,0,1,6-6V28a6,6,0,0,1-6-6"
                            fill="#00ac47"
                          />
                        </svg>
                        <span>Image.png</span>
                      </div>
                      <div
                        className="flex items-center space-x-2 cursor-pointer"
                        onClick={() => removeFile(0)}
                      >
                        <Trash2
                          size={18}
                          className="hover:text-black/70 transition-all"
                        />
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <div className="flex-grow">
                        <progress
                          className="progress progress-success !bg-black/25"
                          color="#0aff70"
                          defaultValue={0}
                          value={String(progress)}
                          max="100"
                        ></progress>
                      </div>
                      <span>{String(progress)}%</span>
                    </div>
                  </div>
                </label>
              )}
            </div>
            <div className="col-span-12 justify-center flex">
              <button
                className={`btn btn-neutral w-[40%]  ${
                  !isValid
                    ? "disabled:bg-black/70 disabled:text-white"
                    : "bg-black hover:bg-black/90"
                }`}
                type="submit"
                disabled={isLoading || !isValid}
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
      <div className="absolute right-10 bottom-5 flex items-center space-x-2 select-none">
        <Link href="">
          <svg
            width="50"
            height="39"
            viewBox="0 0 100 89"
            xmlns="http://www.w3.org/2000/svg"
          >
            <title>Artboard 2</title>
            <path
              d="M45.292 44.5L0 89h100V0H0l45.292 44.5zM90 80H22l35.987-35.2L22 9h68v71z"
              fill="#394EFF"
              fill-rule="evenodd"
            />
          </svg>
        </Link>
        <span className="text-sm">
          Files Checked By <br /> VirusTotal
        </span>
      </div>
    </div>
  );
};

export default CreateUser;
