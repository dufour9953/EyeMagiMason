"use client";

import { createContext, useContext, useState, ReactNode } from "react";

interface UIContextType {
  isPreviewModalOpen: boolean;
  previewFeatureName: string;
  openPreviewModal: (featureName: string) => void;
  closePreviewModal: () => void;
}

const UIContext = createContext<UIContextType | undefined>(undefined);

export function UIProvider({ children }: { children: ReactNode }) {
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [previewFeatureName, setPreviewFeatureName] = useState("");

  const openPreviewModal = (featureName: string) => {
    setPreviewFeatureName(featureName);
    setIsPreviewModalOpen(true);
  };

  const closePreviewModal = () => {
    setIsPreviewModalOpen(false);
  };

  return (
    <UIContext.Provider value={{ isPreviewModalOpen, previewFeatureName, openPreviewModal, closePreviewModal }}>
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
