import React from "react";
import logo from "../assets/logo.png";
import { AlertCircle, BarChart2, BookOpenText, Calendar, FolderOpen, LayoutDashboard, Link, MessageSquareText, Settings, Users } from "lucide-react";


export default function Sidebar() {
  const strokeWidth = 1.5;
  return (
    <aside className="left-0 w-[250px] min-h-screen bg-[#F7F8FA] px-5 py-10 border-r-2 hidden sm:block">
      <div className="flex gap-3">
        <img className="w-8 h-8" src={logo} alt="" />
        <div className="font-inter flex gap-0 flex-col -translate-y-1">
          <h1 className="font-bold m-0">Parallel</h1>
          <p className="text-sm text-[#A7A7A7] font-medium -translate-y-1">
            Grow Together
          </p>
        </div>
      </div>

      <div className="mt-12">
        <div>
          <p className="text-sm px-2 text-[#A7A7A7] font-medium mb-2">General</p>
          <div className="flex flex-col gap-2">
          <NavButton icon={<LayoutDashboard strokeWidth={strokeWidth}/>} text={"Dashboard"} />
          <NavButton icon={<Calendar strokeWidth={strokeWidth}/>} text={"Calendar"}/>
          <NavButton icon={<BookOpenText strokeWidth={strokeWidth}/>} text={"Assignments"}/>
          <NavButton icon={<FolderOpen strokeWidth={strokeWidth}/>} text={"Resources"}/>
          </div>
        </div>
      </div>


      <div className="mt-6">
        <div>
          <p className="text-sm px-2 text-[#A7A7A7] font-medium mb-2">Communications</p>
          <div className="flex flex-col gap-2">
          <NavButton icon={<Link strokeWidth={strokeWidth}/>} text={"Collaborations"} />
          <NavButton icon={<MessageSquareText strokeWidth={strokeWidth}/>} text={"Messages"}/>
          </div>
        </div>
      </div>

      <div className="mt-6">
        <div>
          <p className="text-sm px-2 text-[#A7A7A7] font-medium mb-2">Data</p>
          <div className="flex flex-col gap-2">
          <NavButton icon={<Users strokeWidth={strokeWidth}/>} text={"Roster"} />
          <NavButton icon={<BarChart2 strokeWidth={strokeWidth}/>} text={"Analytics"}/>
          <NavButton icon={<AlertCircle strokeWidth={strokeWidth}/>} text={"Reports"}/>
          </div>
        </div>
      </div>

      <div className="mt-6">
        <div>
          <p className="text-sm px-2 text-[#A7A7A7] font-medium mb-2">Control</p>
          <div className="flex flex-col gap-2">
          <NavButton icon={<Settings strokeWidth={strokeWidth}/>} text={"Settings"} />
          </div>
        </div>
      </div>
    </aside>
  );
}

function NavButton({ icon,  text }) {
  return <button className="text-[15px] hover:bg-white hover:border hover:border-[#EBEBEB] text-[#706F77] px-2 rounded-md h-[40px] w-full flex gap-4 font-inter font-semibold items-center">
    <div className="text-[#706F77]  ">
    {icon}
    </div>
    {text}
    </button>;
}
