// import { useCallback, useEffect } from "preact/hooks";
import { useEffect } from "react";
import toast from "react-hot-toast";
import { HiOutlineLightBulb } from "react-icons/hi/";
import { useRegisterSW } from "virtual:pwa-register/react";

const ServiceWorker = () => {
  const {
    offlineReady: [offlineReady, setOfflineReady],
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW();

  useEffect(() => {
    if (offlineReady) {
      localStorage.setItem("TRACK_TAKA_INITIATED", JSON.stringify(true));
      console.log(
        "[📦 Track Taka] - Your app has been installed, it now works offline!"
      );
    } else if (needRefresh) {
      console.log("[📦 Track Taka] - A new update is available!");
      toast.custom(
        (t) => (
          <div
            className={`${
              t.visible ? "animate-enter" : "animate-leave"
            } max-w-sm w-full bg-white dark:bg-slate-700 shadow-lg rounded pointer-events-auto flex ring-1 ring-black dark:ring-slate-500 ring-opacity-5`}
          >
            <div className="flex-1 flex flex-wrap items-center gap-2 p-4">
              <HiOutlineLightBulb className="text-lg" />
              <p className="text-sm font-medium">New update available</p>

              <button
                onClick={async () => {
                  toast.dismiss(t.id);
                  await updateServiceWorker();
                  setOfflineReady(false);
                  setNeedRefresh(false);
                }}
                className="btn btn-primary btn-sm ml-auto "
              >
                update now
              </button>
            </div>
          </div>
        ),
        { duration: Infinity }
      );
    }
  }, [needRefresh, offlineReady]);

  return null;
};

export default ServiceWorker;

// TODO: Make update app mandatory
