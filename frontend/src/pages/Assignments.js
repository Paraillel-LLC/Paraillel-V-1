import React from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { EllipsisVerticalIcon, Plus } from "lucide-react";
export default function Assignment() {
  const images = [
    "data:image/jpeg;base64,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",
  ];
  return (
    <>
      <div className="flex">
        <Sidebar />
        <div className="w-full px-8 py-8 mr-24">
          <Navbar pagename={"Assignments"} />
          <div className="mt-16">
            <button className="flex gap-3 items-center border rounded-md p-2 bg-[#3E8CEE] hover:bg-blue-400 text-white">
              <Plus className="w-4" />
              <span className="text-sm font-semibold">Add Assignment</span>
            </button>

            <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 mt-6">
              <AssignmentCard
                title="Math Assignment"
                subject="Math"
                grade="10"
                dueDate="July 3 2022"
                createdAt="Aug 20 2023"
                images={images}
              />
              <AssignmentCard
                title="Math Assignment"
                subject="Math"
                grade="10"
                dueDate="July 3 2022"
                createdAt="Aug 20 2023"
                images={images}
              />
              <AssignmentCard
                title="Math Assignment"
                subject="Math"
                grade="10"
                dueDate="July 3 2022"
                createdAt="Aug 20 2023"
                images={images}
              />
               <AssignmentCard
                title="Math Assignment"
                subject="Math"
                grade="10"
                dueDate="July 3 2022"
                createdAt="Aug 20 2023"
                images={images}
              />
               <AssignmentCard
                title="Math Assignment"
                subject="Math"
                grade="10"
                dueDate="July 3 2022"
                createdAt="Aug 20 2023"
                images={images}
              />
               <AssignmentCard
                title="Math Assignment"
                subject="Math"
                grade="10"
                dueDate="July 3 2022"
                createdAt="Aug 20 2023"
                images={images}
              />

              </div>
          </div>
        </div>
      </div>
    </>
  );
}

function AssignmentCard({ title, subject, grade, dueDate, createdAt, images }) {
  return (
    <div className="p-3 rounded-[14px] w-[296px] border font-inter">
      <div className="flex justify-between">
        <p className="text-[12px] text-[#858585]">Due on {dueDate}</p>
        <EllipsisVerticalIcon className="w-4" />
      </div>
      <p className="mt-1 font-semibold text-[15px]">{title}</p>
      <div className="flex items-center gap-2 text-[12px] text-[#A5A5A5]">
        <p>{subject}</p>
        <p>Grade {grade}</p>
      </div>
      <p className="text-[12px] mt-2 text-[#A5A5A5]">{createdAt}</p>
      <div className="flex items-center justify-between">
        <div class="flex -space-x-2 overflow-hidden mt-8">
          {images.map((image, index) => (
            <img
              key={index}
              class="inline-block h-6 w-6 rounded-full ring-2 ring-white object-cover" // Added object-cover
              src={image}
              alt=""
            />
          ))}
          <button class=" text-white flex items-center justify-center h-6 w-6 rounded-full ring-2 ring-white bg-blue-400">
            <Plus strokeWidth={3} className="w-4 " />
          </button>
        </div>
        <button className="bg-[#EEF7FF] text-[#103052] font-semibold border-[#CBE6FF] translate-y-3 border rounded-[6px] text-[12px] p-1">
          2 days left
        </button>
      </div>
    </div>
  );
}
