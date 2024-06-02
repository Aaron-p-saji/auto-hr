"use client";
import Image from "next/image";
import { useState } from "react";

export default function Home() {
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  return (
    <main className="flex min-h-screen w-screen flex-col justify-between">
      <div className="bg-white py-6 sm:py-8 lg:py-12">
        <div className="mx-auto max-w-screen-2xl px-4 md:px-8">
          <h2 className="mb-4 text-center text-2xl font-bold text-gray-800 md:mb-8 lg:text-3xl">
            Login
          </h2>

          <form
            className="mx-auto max-w-lg rounded-lg border"
            // onSubmit={handleSubmit(loginFunction)}
          >
            <div className="flex flex-col gap-4 p-4 md:p-8">
              <div>
                <label className="form-control w-full">
                  <div className="label">
                    <span className="label-text">Email</span>
                  </div>
                  <input
                    type="email"
                    placeholder="admin@testnetwork.com"
                    className="input input-bordered w-full"
                    // {...register("email")}
                  />
                  <div className="label">
                    {/* {errors.email && (
                      <span className="label-text-alt text-red-500">
                        {errors.email.message}
                      </span>
                    )} */}
                  </div>
                </label>
              </div>

              <div>
                <label className="form-control w-full">
                  <div className="label">
                    <span className="label-text">Password</span>
                  </div>
                  <input
                    type="password"
                    placeholder="••••••••"
                    className="input input-bordered w-full"
                    // {...register("password")}
                  />
                </label>
                <div className="label">
                  {/* {errors.password && (
                    <span className="label-text-alt text-red-500">
                      {errors.password.message}
                    </span>
                  )} */}
                </div>
              </div>

              <button className="btn btn-neutral" type="submit">
                {isLoading && <span className="loading loading-spinner"></span>}
                Login
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}
