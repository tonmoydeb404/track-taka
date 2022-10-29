// import { useCallback, useEffect } from "preact/hooks";
import { useEffect } from "react";
import toast from "react-hot-toast";
import { useRegisterSW } from "virtual:pwa-register/react";

const ServiceWorker = () => {
  const {
    offlineReady: [offlineReady, setOfflineReady],
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW();

  useEffect(() => {
    // console.log({ offlineReady, needRefresh });

    if (offlineReady) {
      console.log(
        "[📦 pheralb/Preact-PWA] - Your app has been installed, it now works offline!"
      );
    } else if (needRefresh) {
      // console.log("[📦 pheralb/Preact-PWA] - A new update is available!");
      toast.custom(
        (t) => (
          <div
            className={`${
              t.visible ? "animate-enter" : "animate-leave"
            } max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}
          >
            <div className="flex-1 w-0 p-4">
              <div className="flex items-start">
                <div className="ml-3 flex-1">
                  <p className="text-sm font-medium text-gray-900">
                    new update available
                  </p>
                </div>
              </div>
            </div>
            <div className="flex border-l border-gray-200">
              <button
                onClick={async () => {
                  toast.dismiss(t.id);
                  await updateServiceWorker();
                  setOfflineReady(false);
                  setNeedRefresh(false);
                }}
                className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-indigo-600 hover:text-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
