import React, { useState } from "react";
import Navbar from "../components/Navbar";

export default function Privacy() {
  const [section, setSection] = useState("intro");
  return (
    <div className="min-h-screen min-w-full bg-[#F7F8FA] px-8 py-8 mr-24 font-inter">
      <Navbar pagename={<p className="text-[#3070B5]">Privacy Policy</p>} />
      <div className="flex gap-6 mt-12">
        <div className="h-max bg-white border rounded-xl px-6 py-10 w-[25%] flex flex-col gap-4 text-[15px] text-[#7D7D7D] font-semibold">
          <button
            onClick={() => setSection("intro")}
            className="hover:bg-[#F7F8FA] rounded-md p-3 text-start"
          >
            Introduction
          </button>
          <button
            onClick={() => setSection("share")}
            className="hover:bg-[#F7F8FA] rounded-md p-3 text-start"
          >
            Sharing Your Information
          </button>
          <button
            onClick={() => setSection("data")}
            className="hover:bg-[#F7F8FA] rounded-md p-3 text-start"
          >
            Data Security
          </button>
          <button onClick={() => setSection("children")} className=" hover:bg-[#F7F8FA] rounded-md p-3 text-start">
            Children's Privacy
          </button>
          <button className=" hover:bg-[#F7F8FA] rounded-md p-3 text-start ">
            Contact us
          </button>
        </div>

        {section === "intro" && (
          <div className="h-max w-[75%] border rounded-xl bg-white px-6 py-10 flex flex-col gap-1">
            <h1 className="text-2xl font-semibold text-[#323232]">
              1. Introduction
            </h1>
            <p className="mt-6">
              Welcome to Paraillel! This Privacy Policy explains how we collect,
              use, disclose, and protect your personal information when you
              visit our website and use our services. We are committed to
              safeguarding your privacy and ensuring the security of your
              personal information. By using our website and services, you
              consent to the practices described in this Privacy Policy.
            </p>
            <p className="mt-6 font-bold underline">
              1. Information we collect
            </p>
            <p>
              Personal Information We may collect various types of personal
              information, which may include but are not limited to:
            </p>
            <ul className="list-disc list-inside mt-2">
              <li>
                Contact information, such as your name, email address, and phone
                number.
              </li>
              <li>
                Professional information, including your teaching credentials,
                institution, and subject areas.
              </li>
              <li>
                User-generated content, such as comments, discussions, and
                messages on our platform.
              </li>
              <li>
                Payment information, when you subscribe to premium features or
                make purchases.
              </li>
            </ul>
            <p className="font-bold underline mt-6">
              Automatically Collected Information We may also collect certain
              information automatically when you use our website, which may
              include:
            </p>
            <ul className="list-disc list-inside mt-2 ">
              <li>
                Log data, such as your IP address, browser type, device
                information, and operating system.
              </li>
              <li>
                Usage information, including your interactions with our
                platform, pages visited, and features used.
              </li>
              <li>
                Cookies and similar technologies to track your activity and
                improve your experience.
              </li>
              <li>
                Service providers who assist us in operating our website and
                services.
              </li>
              <li>Affiliates and trusted partners for business purposes.</li>
              <li>
                Law enforcement, government authorities, or other third parties
                when required by law or in response to legal processes.
              </li>
              <li>Data Security</li>
              <li>
                We take security seriously and employ reasonable measures to
                protect your personal information. While we strive to protect
                your data, no system is completely secure, and we cannot
                guarantee absolute security.
              </li>
              <li>Your Privacy Choices</li>
              <li>
                You have choices regarding the personal information we collect:
              </li>
              <li>
                You can access, correct, or delete your personal information.
              </li>
              <li>
                You can opt out of marketing communications. with excellent
                services while protecting your privacy.
              </li>
            </ul>
          </div>
        )}

        {section === "share" && (
          <div className="h-max w-[75%] border rounded-xl bg-white px-6 py-10 flex flex-col gap-1">
            <h1 className="text-2xl font-semibold text-[#323232]">
              Sharing Your Information
            </h1>
            <ul className="list-disc list-inside mt-2">
              <li>
                We may share your personal information with the following
                categories of third parties:
              </li>
              <li>
                Service providers who assist us in operating our website and
                services.
              </li>
              <li>Affiliates and trusted partners for business purposes.</li>
              <li>
                Law enforcement, government authorities, or other third parties
                when required by law or in response to legal processes.
              </li>
            </ul>
          </div>
        )}

        {section === "data" && (
          <div className="h-max w-[75%] border rounded-xl bg-white px-6 py-10 flex flex-col gap-1">
            <h1 className="text-2xl font-semibold text-[#323232]">
              Data Security
            </h1>

            <p className="mt-6">
              We take security seriously and employ reasonable measures to
              protect your personal information. While we strive to protect your
              data, no system is completely secure, and we cannot guarantee
              absolute security. 
            </p>

            <p className="mt-2 font-bold underline">1. Your Privacy Choices</p>
            <ul className="list-disc list-inside mt-2">
              <li>
                You have choices regarding the personal information we collect:
              </li>
              <li>
                You can access, correct, or delete your personal information.
              </li>
              <li>You can opt out of marketing communications.</li>
              <li>
                You can configure your browser to reject cookies or similar
                tracking technologies.
              </li>
            </ul>
          </div>
        )}

        {section === "children" && (
          <div className="h-max w-[75%] border rounded-xl bg-white px-6 py-10 flex flex-col gap-1">
            <h1 className="text-2xl font-semibold text-[#323232]">
              Children's Privacy
            </h1>

            <p className="mt-6">
              Our services are not intended for children under 13 years of age.
              We do not knowingly collect personal information from children
              under this age. If you believe we have collected personal
              information from a child, please contact us, and we will take
              appropriate action.{" "}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
