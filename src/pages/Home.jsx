import React, { useEffect } from "react";
import { Helmet } from "react-helmet";
import { BsArrowRight, BsGithub } from "react-icons/bs";
import { Link, useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const isInitiated = localStorage.getItem("TRACK_TAKA_INITIATED");
    if (isInitiated && JSON.parse(isInitiated) === true) {
      navigate("/dashboard");
    }
  }, []);

  const initApp = () => {
    localStorage.setItem("TRACK_TAKA_INITIATED", JSON.stringify(true));
    navigate("/dashboard", { replace: true });
  };

  return (
    <>
      <Helmet>
        <title>Home - Track Taka</title>
      </Helmet>
      <div className="container mx-auto min-h-screen flex items-start sm:items-center justify-center flex-col">
        <img
          src="icons/android-chrome-512x512.png"
          alt="Track Taka"
          width="100px"
          height="100px"
        />
        <h1 className="font-bold text-3xl sm:text-4xl mt-6">Track Taka</h1>
        <p className="mt-2 text-base">
          track your daily life expenses with track taka app
        </p>

        <div className="flex flex-wrap items-center gap-2 mt-10">
          <button className="btn btn-primary gap-1" onClick={initApp}>
            Go to Dashboard <BsArrowRight />
          </button>
          <Link className="btn btn-warning gap-1" to="/">
            Github <BsGithub />
          </Link>
        </div>
      </div>
    </>
  );
};

export default Home;
