import React from "react";
import { BsHouseFill } from "react-icons/bs";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="absolute top-0 left-0 w-full min-h-screen py-20 flex flex-col items-center justify-center">
      <h1 className="text-5xl mb-2 font-bold">404</h1>
      <h2 className="text-xl font-medium mb-10">request content not found</h2>
      <Link to={"/"} className="btn btn-primary">
        Go to home page <BsHouseFill />
      </Link>
    </div>
  );
};

export default NotFound;
