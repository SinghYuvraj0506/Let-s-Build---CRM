"use client"

import { Agency, User } from "@prisma/client";
import React, { createContext, useContext, useEffect, useState } from "react";

interface modelContextType {
  data: ModalData;
  isOpen: boolean;
  setOpen: (modal: React.ReactNode, fetchData?: () => Promise<any>) => void;
  setClose: () => void;
}

interface ModalProviderProps {
  children: React.ReactNode;
}

export type ModalData = {
  user?: User;
  agency?: Agency;
};

const modelContext = createContext<modelContextType>({
  data: {},
  isOpen: false,
  setOpen: (modal: React.ReactNode, fetchData?: () => Promise<any>) => {},
  setClose: () => {},
});

const ModalProvider: React.FC<ModalProviderProps> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [data, setData] = useState<ModalData>({});
  const [isShowingModal, setIsShowingModal] = useState<React.ReactNode>(null);

  useEffect(() => {
    setIsMounted(true);
  }, [isMounted]);

  const setOpen = async (
    modal: React.ReactNode,
    fetchData?: () => Promise<any>
  ) => {
    if (modal) {
      if (fetchData) {
        setData({ ...data, ...(await fetchData()) });
      }
      setIsShowingModal(modal);
      setIsOpen(true);
    }
  };

  const setClose = () => {
    setIsOpen(false);
    setData({});
    setIsShowingModal(null);
  };

  if (!isMounted) return null;

  return (
    <modelContext.Provider value={{ data, isOpen, setOpen, setClose }}>
      {children}
      {isShowingModal}
    </modelContext.Provider>
  );
};

export const useModal = () => {
  return useContext(modelContext);
};


export default ModalProvider;