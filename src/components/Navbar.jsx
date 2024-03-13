import React from "react";
import { BiSolidSave } from "react-icons/bi";
import { HiOutlineDocumentDownload } from "react-icons/hi";
import { AiFillEdit, AiFillQuestionCircle } from "react-icons/ai";
import { CiCircleQuestion, CiSaveDown2 } from "react-icons/ci";

export default function Navbar() {
  return (
    <div>
      <div className="bg-gray-200 shadow-lg fixed top-0 left-0 right-0 p-4 flex gap-2">
        <div className="logo font-bold text-sky-950 text-2xl">Bropad.</div>
        <div></div>
        <div className=" flex-grow flex justify-center items-center">
          {/* <input
            type="text"
            placeholder="Enter title here"
            className=" bg-transparent p-2 outline-none "
          /> */}
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-2 rounded-md  flex gap-2 justify-center items-center text-sm  text-gray-700 ">
            <HiOutlineDocumentDownload size={18} />
            Open Recent
          </button>
          <button className="px-4 py-2 rounded-md shadow-sm flex gap-2 justify-center items-center text-sm  text-gray-700 ">
            <AiFillQuestionCircle size={18} />
            Get help
          </button>
          <button className="px-4 py-2 rounded-md shadow-sm flex gap-2 justify-center items-center text-sm bg-violet-700 text-gray-100 font-thin">
            <CiSaveDown2 size={18} />
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
