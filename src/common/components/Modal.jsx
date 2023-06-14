import { Dialog, Transition } from "@headlessui/react";
import React, { Fragment } from "react";

const Modal = ({
  isOpen,
  onClose = () => {},
  title,
  description,
  children,
}) => {
  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog open={isOpen} onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-slate-950 bg-opacity-80 z-[10000]" />
        </Transition.Child>
        <div className="fixed inset-0 overflow-y-auto z-[10001]">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white dark:bg-slate-800 p-4 sm:p-6 text-left align-middle shadow-xl transition-all">
                {title ? (
                  <Dialog.Title className={"text-xl font-semibold mb-2"}>
                    {title}
                  </Dialog.Title>
                ) : null}
                {description ? (
                  <Dialog.Description>{description}</Dialog.Description>
                ) : (
                  description
                )}
                <div className="mt-5">{children}</div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default Modal;
