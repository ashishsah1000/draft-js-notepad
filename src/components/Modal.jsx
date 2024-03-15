import React, { useState } from "react";

function Modal({ isOpen, onClose }) {
  const handleClose = () => {
    onClose();
  };

  return (
    <div
      className={`fixed inset-0 z-50 overflow-auto bg-black bg-opacity-50 flex items-center justify-center ${
        isOpen ? "" : "hidden"
      }`}
      onClick={handleClose}
    >
      {/* Modal content */}
      <div
        className="bg-white p-6 rounded-lg shadow-lg relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          className="absolute top-0 right-0 px-3 py-1 text-lg text-gray-700 hover:text-black focus:outline-none"
          onClick={handleClose}
        >
          &times;
        </button>
        {/* Modal content */}
        <div className="modal-content text-xs">
          <div className="text-xl my-4 font-extrabold">
            Use the following to add notes
          </div>
          <div className="flex flex-col gap-2 items-start">
            <div className="flex justify-center items-center gap-2">
              <pre>'# '</pre>
              <span className="">
                Inserts a heading (reuse to stop heading)
              </span>
            </div>
            <div className="flex justify-center items-center gap-2">
              <pre>'* '</pre>
              <span className="font-bold">
                Will make bold (reuse to stop bold)
              </span>
            </div>
            <div className="flex justify-center items-center gap-2">
              <pre>'** '</pre>
              <span className="  text-pink-600 font-bold">
                Add a red line (Add red font)
              </span>
            </div>
            <div className="flex justify-center items-center gap-2">
              <pre>'*** '</pre>
              <span className=" border-b border-gray-600">
                Underline (reuse to stop the underline)
              </span>
            </div>
            <div className="flex justify-center items-center gap-2">
              <pre>'``` '</pre>
              <span className="">
                Code-block (reuse to stop the code block)
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Modal;
