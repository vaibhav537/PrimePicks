  "use client";
import { login } from "@/lib/api/auth";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useAppStore } from "../../store/store";

const Page = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const { setUserInfo } = useAppStore();
  const handleLogin = async () => {
    if (email && password) {
      const response = await login(email, password, true);
      console.log(email, password);
      if (response?.result === true) {
        setUserInfo(response.addMsg);
        router.push("/admin");
      }
    }
  };
  return (
    <section className="bg-gray-50">
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
        <Link href="#">
          <Image
            src="/primepicks_main_logo.png"
            alt="primepicks logo"
            height={170}
            width={170}
          />
        </Link>
        <div className="w-full bg-white rounded-lg shadow md:mt-0 sm:max-w-md xl:p-0">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl ">
              Login to Your Account
            </h1>
            <div className="space-y-4 md:space-y-6">
              <div>
                <label
                  htmlFor="email"
                  className="block mb-2 text-sm font-medium text-gray-900 "
                >
                  Your Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-gray-50 border border-e-gray-300 text-gray-900 sm:text-sm rounded-lg p-2.5 w-full block focus:ring-orange-700 outline-none focus:border-orange-800"
                  autoComplete="off"
                  placeholder="name@company.com"
                />
              </div>
              <div>
                <label
                  htmlFor="password"
                  className="block mb-2 text-sm font-medium text-gray-900 "
                >
                  Your Email
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-gray-50 border border-e-gray-300 text-gray-900 sm:text-sm rounded-lg p-2.5 w-full block focus:ring-orange-700 outline-none focus:border-orange-800"
                  autoComplete="off"
                  placeholder="*************"
                />
              </div>
              <button
                className="w-full text-white bg-orange-500 hover:bg-orange-600 font-medium text-sm py-2.5 rounded-lg px-5 text-center"
                onClick={handleLogin}
              >
                Login
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Page;
