"use client";

import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff, Mail, Lock, User } from "lucide-react";
import { AppDispatch } from "@/types/page";
import { signInAction } from "@/redux/action/userAction";

export default function SignIn() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const searchParams = useSearchParams();
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const callback = searchParams.get("callback") || "/";

  const username =
    typeof window !== "undefined" ? localStorage.getItem("username") : null;

  useEffect(() => {
    const username = localStorage.getItem("username");
    const password = localStorage.getItem("password");
    if (username && password) {
      router.push("/");
    }
  }, [router]);

  useEffect(() => {
    const loginTime = localStorage.getItem("loginTime");
    const sessionDuration = 60 * 60 * 1000;

    if (loginTime && Date.now() - parseInt(loginTime, 10) > sessionDuration) {
      localStorage.removeItem("username");
      localStorage.removeItem("loginTime");
      router.push("/auth/signin");
    }
  }, [router]);

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      login(formData);
    }
  };

  const login = (formData: any) => {
    dispatch(
      signInAction({
        formData,
        onSuccess: (res) => {
          if (res.status === 200) {
            localStorage.setItem("username", res.data.user.name);
            localStorage.setItem("userData", JSON.stringify(res.data.user));
            localStorage.setItem("loginTime", Date.now().toString());
            router.push("/");
          }
        },
        onFailure: (error) => {
          if (error && error.status === 301) {
            setErrors({ general: error?.response?.data?.error });
          } else {
            setErrors({ general: error?.response?.data?.error });
          }
        },
      })
    );
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleProfileClick = () => {
    if (username) {
      // User is logged in, go to profile page or open menu
      router.push("/profile"); // or show dropdown menu
    } else {
      // User is not logged in, go to sign-in page
      router.push("/auth/signin");
    }
  };

  return (
    <div
      className="min-h-[calc(100vh-80px)] bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative"
      style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
    >
      <style jsx global>{`
        div::-webkit-scrollbar {
          display: none;
        }
      `}</style>
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center">
          <h3 className="mt-6 text-2xl font-medium text-gray-900">
            Sign in to your account
          </h3>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {errors.general && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm">
                {errors.general}
              </div>
            )}

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email address
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className={`appearance-none block w-full pl-10 pr-3 py-2 border ${
                    errors.email ? "border-red-300" : "border-gray-300"
                  } rounded-md placeholder-gray-400 focus:outline-none focus:ring-[#a58c3d] focus:border-[#a58c3d] sm:text-sm`}
                  placeholder="Enter your email"
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className={`appearance-none block w-full pl-10 pr-10 py-2 border ${
                    errors.password ? "border-red-300" : "border-gray-300"
                  } rounded-md placeholder-gray-400 focus:outline-none focus:ring-[#a58c3d] focus:border-[#a58c3d] sm:text-sm`}
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password}</p>
              )}
            </div>

            <div>
              <button
                type="submit"
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-[#a58c3d] hover:bg-[#73632f] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#a58c3d] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Sign in
              </button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  New to Apollonian?
                </span>
              </div>
            </div>

            <div className="mt-6">
              <Link
                href="/auth/signup"
                className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#a58c3d] transition-colors"
              >
                Create new account
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
