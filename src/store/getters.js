const getters = {
  sidebar: (state) => state.app.sidebar,
  device: (state) => state.app.device,
  token: (state) => state.user.userInfo.token,
  avatar: (state) => state.user.userInfo.avatar,
  name: (state) => state.user.userInfo.username,
  roles: (state) => state.user.userInfo.role,
  userInfo: (state) => state.user.userInfo,
};
export default getters;
