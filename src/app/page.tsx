"use client";
import { login } from "@/functions/auth";
import { useAuthStore } from "@/providers/context";
import { LoginFields, loginSchema } from "@/providers/zodTypes";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

export default function Home() {
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFields>({
    resolver: zodResolver(loginSchema),
  });

  const loginFunction = async (data: {
    username: string;
    password: string;
  }) => {
    try {
      setIsLoading(true);
      const res = await login(data.username, data.password);
      if (res) {
        router.push("/intern-management");
      } else {
        setError("Invalid Credentials");
      }
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    try {
      setIsLoading(true);
      if (useAuthStore.getState().token) {
        router.replace("/intern-management");
      }
      setIsLoading(false);
    } catch (error) {}
  }, [router]);
  return (
    <main className="flex min-h-screen w-screen flex-col justify-between">
      <div className="bg-white py-6 sm:py-8 lg:py-12">
        <div className="mx-auto max-w-screen-2xl px-4 md:px-8">
          <h2 className="mb-4 text-center text-2xl font-bold text-gray-800 md:mb-8 lg:text-3xl">
            Login
          </h2>

          <form
            className="mx-auto max-w-lg rounded-lg border"
            onSubmit={handleSubmit(loginFunction)}
          >
            <div className="flex flex-col gap-4 p-4 md:p-8">
              <div>
                <label className="form-control w-full">
                  <div className="label">
                    <span className="label-text">Username</span>
                  </div>
                  <input
                    type="text"
                    placeholder="administrator"
                    autoComplete="username"
                    className="input input-bordered w-full"
                    {...register("username")}
                    disabled={isLoading}
                  />
                  <div className="label">
                    {errors.username && (
                      <span className="label-text-alt text-red-500">
                        {errors.username.message}
                      </span>
                    )}
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
                    {...register("password")}
                    disabled={isLoading}
                  />
                </label>
                <div className="label">
                  {errors.password && (
                    <span className="label-text-alt text-red-500">
                      {errors.password.message}
                    </span>
                  )}
                </div>
              </div>

              <button
                className="btn btn-neutral"
                type="submit"
                disabled={isLoading}
              >
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
