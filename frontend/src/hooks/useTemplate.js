import { useContext } from "react";
import { TemplateContext } from "../context/TemplateContext";

// Custom hook to use Template Context
export const useTemplate = () => {
  const context = useContext(TemplateContext);

  if (!context) {
    throw new Error("useTemplate must be used within a TemplateProvider");
  }

  return context;
};