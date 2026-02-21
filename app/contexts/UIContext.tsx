"use client";

import { createContext, useContext, useState, ReactNode } from "react";

interface UIContextType {
  isPreviewModalOpen: boolean;
  previewFeatureName: string;
  openPreviewModal: (featureName: string) => void;
  closePreviewModal: () => void;
  isArchiveModalOpen: boolean;
  openArchiveModal: () => void;
  closeArchiveModal: () => void;
  isAboutModalOpen: boolean;
  openAboutModal: () => void;
  closeAboutModal: () => void;
}

const UIContext = createContext<UIContextType | undefined>(undefined);

export function UIProvider({ children }: { children: ReactNode }) {
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [previewFeatureName, setPreviewFeatureName] = useState("");
  const [isArchiveModalOpen, setIsArchiveModalOpen] = useState(false);
  const [isAboutModalOpen, setIsAboutModalOpen] = useState(false);

  const openPreviewModal = (featureName: string) => {
    setPreviewFeatureName(featureName);
    setIsPreviewModalOpen(true);
  };
  const closePreviewModal = () => setIsPreviewModalOpen(false);

  const openArchiveModal = () => setIsArchiveModalOpen(true);
  const closeArchiveModal = () => setIsArchiveModalOpen(false);

  const openAboutModal = () => setIsAboutModalOpen(true);
  const closeAboutModal = () => setIsAboutModalOpen(false);

  return (
    <UIContext.Provider value={{ 
      isPreviewModalOpen, previewFeatureName, openPreviewModal, closePreviewModal,
      isArchiveModalOpen, openArchiveModal, closeArchiveModal,
      isAboutModalOpen, openAboutModal, closeAboutModal
    }}>
      {children}
    </UIContext.Provider>
  );
}

export function useUI() {
  const context = useContext(UIContext);
  if (context === undefined) {
    throw new Error("useUI must be used within a UIProvider");
  }
  return context;
}
