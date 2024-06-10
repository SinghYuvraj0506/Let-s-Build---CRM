import React from "react";

const layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <div className="w-full h-full flex items-center justify-center">
    {children}
  </div>
};

export default layout;
