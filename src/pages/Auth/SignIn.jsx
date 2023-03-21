import React from "react";
import { BiError } from "react-icons/bi";
import { CgSpinner } from "react-icons/cg";
import { FcGoogle } from "react-icons/fc";
import { useAuth } from "../../common/contexts/authContext";
import authErrorMessage from "../../utilities/authErrorMessage";

const SignIn = () => {
  const { handleGoogleSignIn, error, status } = useAuth();

  return (
    <div className="container mx-auto min-h-screen flex items-start sm:items-center justify-center flex-col">
      <h1 className="font-bold text-3xl sm:text-4xl mt-6">Hello User</h1>
      <p className="mt-2 text-base">
        to continue please login with any of these methods
      </p>
      {error ? (
        <p className="bg-red-500 w-full max-w-[300px] mt-5 p-2 rounded-sm sm:text-center text-white flex items-center sm:justify-center gap-1 flex-wrap text-sm">
          <BiError /> {authErrorMessage(error)}
        </p>
      ) : null}

      <div className="flex flex-col items-stretch gap-2 mt-10 w-full max-w-[300px] pb-20">
        {status === "LOADING" ? (
          <>
            <div className="btn shadow-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 justify-between cursor-progress">
              Signin In <CgSpinner className="animate-spin" />
            </div>
          </>
        ) : (
          <>
            <button
              onClick={handleGoogleSignIn}
              className="btn bg-white justify-between border border-slate-300 text-black"
            >
              Google <FcGoogle className="text-2xl" />
            </button>
            {/* <button
              className="btn bg-[#1877f2] justify-between text-white"
              onClick={handleFacebookSignIn}
            >
              Facebook <BsFacebook className="text-xl" />
            </button>
            <button
              className="btn bg-[#333] justify-between text-white"
              onClick={handleGithubSignIn}
            >
              Github <BsGithub className="text-xl" />
            </button> */}
          </>
        )}
      </div>
    </div>
  );
};

export default SignIn;
