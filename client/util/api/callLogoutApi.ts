const callLogoutApi = async () => {
  await fetch('/api/auth/logout');
};

export default callLogoutApi;
