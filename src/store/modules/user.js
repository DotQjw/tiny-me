import { login, logout, getInfo } from "@/api/user";
import { getToken, setToken, removeToken } from "@/utils/auth";
import { resetRouter } from "@/router";

const getDefaultState = () => {
  return {
    token: "",
    name: "",
    avatar: "",
    roles: "",
  };
};

const state = {
  userInfo:JSON.parse(localStorage.getItem("USER_INFO")) || {}
}

const mutations = {
  RESET_STATE: (state) => {
    console.log("RESET_STATE");
    removeToken(); // must remove  token  first
    Object.assign(state, getDefaultState());
  },
  SET_TOKEN: (state, token) => {
    state.token = token;
  },
  SET_ROLES: (state, roles) => {
    console.log("SET_ROLES", roles);
    state.roles = roles;
  },
  SET_NAME: (state, name) => {
    console.log("SET_NAME", name);
    state.name = name;
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar;
  },
  SET_USER_INFO(state, data) {
    console.log('data',data)
    state.userInfo = data;
    localStorage.setItem("USER_INFO", JSON.stringify(data));
  },
};

const actions = {
  // user login
  login({ commit }, userInfo) {
    const { username, password } = userInfo;
    return new Promise((resolve, reject) => {
      login({ phoneNo: username.trim(), password: password })
        .then((response) => {
          const { data } = response;
          // commit("SET_TOKEN", data.token);
          // commit("SET_NAME", data.username);
          // commit("SET_ROLES", data.role);
          commit("SET_USER_INFO",{token: data.token,username:data.username,role:data.role})
          setToken(data.token);
          // localStorage.setItem('token',data.token)
          console.log("出来了");
          resolve(data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  },

  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getInfo(state.token)
        .then((response) => {
          const { data } = response;

          if (!data) {
            return reject("Verification failed, please Login again.");
          }

          const { name, avatar } = data;

          // commit('SET_NAME', name)
          // commit('SET_AVATAR', avatar)
          resolve(data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  },

  // user logout
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      commit("RESET_STATE");
      resolve();
    });
  },

  // remove token
  resetToken({ commit }) {
    return new Promise((resolve) => {
      // removeToken() // must remove  token  first
      commit("RESET_STATE");
      resolve();
    });
  },
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
};
