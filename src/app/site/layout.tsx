import Navigation from "@/components/site/navigation";
import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import React from "react";

const layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <ClerkProvider appearance={{ baseTheme: dark }}>
      <main className="h-max dark:bg-gradient-to-r from-[#060B27] via-[#000000] to-[#060B27] ">
        <Navigation />
        {children}
      </main>
    </ClerkProvider>
  );
};

export default layout;
