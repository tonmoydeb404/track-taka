import React from "react";
import { Helmet } from "react-helmet";
import { BsChatLeftQuoteFill } from "react-icons/bs";
import { Link } from "react-router-dom";
import ExportTransections from "../common/components/Settings/ExportTransections";
import ImportTransections from "../common/components/Settings/ImportTransections";
import Profile from "../common/components/Settings/Profile";
import SignIn from "../common/components/Settings/SignIn";
import { useAuth } from "../common/contexts/authContext";

const Settings = () => {
  const { error, status } = useAuth();
  return (
    <>
      <Helmet>
        <title>Dashboard - Track Taka</title>
      </Helmet>
      <div>
        <div className="mb-10">
          <h2 className="text-2xl font-semibold">Settings</h2>
        </div>
        <div className="flex flex-col gap-2 max-w-[500px]">
          {status === "AUTHORIZED" ? (
            <>
              <Profile />
              <ImportTransections />
              <ExportTransections />
            </>
          ) : (
            <>
              <SignIn />
            </>
          )}
          <Link to={"/feedback"} className="settings_item">
            <h3 className="settings_item_title">Share Your Feedback</h3>

            <button className="btn btn-icon btn-primary ml-auto">
              <BsChatLeftQuoteFill />
            </button>
          </Link>
        </div>
      </div>
    </>
  );
};

export default Settings;
