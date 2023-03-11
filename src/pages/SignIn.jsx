import React from "react";
import { BsFacebook, BsGithub } from "react-icons/bs";
import { FcGoogle } from "react-icons/fc";

const SignIn = () => {
  return (
    <div className="container mx-auto min-h-screen flex items-start sm:items-center justify-center flex-col">
      <h1 className="font-bold text-3xl sm:text-4xl mt-6">Hello User</h1>
      <p className="mt-2 text-base">
        to continue please login with any of these methods
      </p>

      <div className="flex flex-col items-stretch gap-2 mt-10 w-full max-w-[300px] pb-20">
        <button className="btn bg-white justify-between border border-slate-300 text-black">
          Google <FcGoogle className="text-2xl" />
        </button>
        <button className="btn bg-[#1877f2] justify-between text-white">
          Facebook <BsFacebook className="text-xl" />
        </button>
        <button className="btn bg-[#333] justify-between text-white">
          Github <BsGithub className="text-xl" />
        </button>
      </div>
    </div>
  );
};

export default SignIn;
