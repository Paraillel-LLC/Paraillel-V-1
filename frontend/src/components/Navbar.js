import { Bell, Search } from "lucide-react";
import React, { useState } from "react";

export default function Navbar({ pagename }) {
    const [search, setSearch] = useState(false);
  return (
    <>
    <div className="flex justify-between items-center text-[#4B5563]">
      <h1 className="text-2xl font-inter font-semibold ">{pagename}</h1>
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-1">
        <Search hidden={search} onClick={() => setSearch(true)} className="w-5" />
        <input placeholder={` Search ${pagename}`} hidden={!search}></input>
        </div>
        <Bell className="w-5" />
        <UserButton name="John Doe" email={"johndoe@gmail.com"} />
      </div>
    </div>
    </>
  );
}

function UserButton({ name, email }) {
  const letter = name[0].toUpperCase();
  return (
    <div className="flex items-center gap-2 font-inter">
      <div className="border w-8 h-8  rounded-full flex items-center justify-center text-[#4B5563]">
        <div className="bg-[#F3F4F6] rounded-full flex items-center justify-center w-6 h-6 font-semibold">
          {letter}
        </div>
      </div>
      <div>
        <h1 className="text-sm font-bold">{name}</h1>
        <p className="text-xs font-normal text-[#6B7280]">{email}</p>
      </div>
    </div>
  );
}
