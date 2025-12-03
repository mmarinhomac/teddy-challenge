import { useAuthEffect } from "./hooks/useAuthEffect";

export const AuthLoader = () => {
  useAuthEffect(); // 🚀 Executes the effect automatically on mount
  return null; // This component doesn't render anything
};
