import React from "react";

const Modal = ({ children, showModal = false, setShowModal = () => {} }) => {
  return showModal ? (
    <div className="modal fixed top-0 left-0 w-full h-full bg-black/50 z-[1002] flex items-center justify-center">
      <div className="modal_container w-11/12 sm:max-w-[400px] lg:max-w-[500px]">
        {children}
      </div>
    </div>
  ) : (
    ""
  );
};

export default Modal;
