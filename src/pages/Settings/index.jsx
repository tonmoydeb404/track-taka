import React from "react";

const Settings = () => {
  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <h2 className="text-2xl font-semibold">Setttings</h2>
      </div>

      <div className="mt-10">
        <div className="w-full lg:w-[500px] flex flex-col gap-2.5">
          <div className="settings_item">
            <h2>Login with google</h2>

            <button className="btn btn-primary ml-auto">
              <i className="bi bi-google"></i>
            </button>
          </div>

          <div className="settings_item">
            <img
              src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde"
              alt=""
              class="w-12 h-12 rounded"
            />

            <h2>Tonmoy Deb</h2>

            <button className="btn btn-danger ml-auto">
              <i className="bi bi-box-arrow-right"></i>
            </button>
          </div>

          <div className="flex flex-col gap-1.5">
            <div className="settings_item ">
              <h2>Automatic sync data in</h2>

              <select className="ml-auto text-sm py-1 pl-2 select">
                <option value="03 Days">03 Days</option>
                <option value="07 Days">07 Days</option>
                <option value="15 Days">15 Days</option>
              </select>
            </div>
            <p className="text-xs pl-2 text-gray-600 dark:text-gray-300 ">
              last synced 3 days ago
            </p>
          </div>

          <div className="settings_item">
            <h2>Sync Data Now</h2>

            <button className="btn btn-success ml-auto">
              <i className="bi bi-arrow-repeat"></i>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Settings;
