import Navigation from "@/components/site/navigation";
import React from "react";

const layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <main className="h-full dark:bg-gradient-to-r from-[#060B27] via-[#000000] to-[#060B27] ">
    <Navigation/>
    {children}
  </main>

};

export default layout;
