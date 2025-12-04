import { useClientEffect } from './hooks/useClientEffect';

export const ClientLoader = () => {
  useClientEffect(); // 🚀 Executes the effect automatically on mount
  return null; // This component doesn't render anything
};
