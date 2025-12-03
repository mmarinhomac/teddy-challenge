export const useAuthActions = () => {
  const logout = async () => {
    console.log('Logging out user...');
  };

  const getCurrentUser = async () => {
    console.log('Fetching current user...');
  };

  return {
    logout,
    getCurrentUser,
  };
};
