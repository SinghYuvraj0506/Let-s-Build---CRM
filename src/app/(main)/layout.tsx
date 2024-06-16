import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import React from "react";

const layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <ClerkProvider appearance={{ baseTheme: dark }}>
    {children}
  </ClerkProvider>
};

export default layout;
