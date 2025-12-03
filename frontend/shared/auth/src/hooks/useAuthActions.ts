export const useAuthActions = () => {
  const logout = async () => {
    console.log('Logging out user...');
  };

  return {
    logout,
  };
};
