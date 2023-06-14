import React from "react";
import { Helmet } from "react-helmet";
import { BsArrowRight, BsChatLeftQuoteFill } from "react-icons/bs";
import { Link } from "react-router-dom";

const Home = () => {
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
          <Link to={"/dashboard"} className="btn btn-primary gap-1">
            Go to Dashboard <BsArrowRight />
          </Link>
          <Link className="btn btn-warning gap-1" to="/feedback">
            User Feedbacks <BsChatLeftQuoteFill />
          </Link>
        </div>
      </div>
    </>
  );
};

export default Home;
