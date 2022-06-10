import axios from "axios";
import { MessageBox, Message } from "element-ui";
import Nprogress from "nprogress"; //js实现进度条效果
import "nprogress/nprogress.css"; //css美化进度条
import store from "@/store";
import { getToken } from "@/utils/auth";

// create an axios instance
const service = axios.create({
  baseURL: "http://8.129.8.125:8080/", // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 300000, // request timeout
});

// request interceptor
service.interceptors.request.use(
  (config) => {
    Nprogress.start();
    if (getToken()) {
      const token = getToken();
      config.headers["Authorization"] = "Bearer " + token;
    }
    if (config.ContentType) {
      config.headers["Content-Type"] = config.ContentType;
    }
    return config;
  },
  (error) => {
    // do something with request error
    return Promise.reject(error);
  }
);

// response interceptor
service.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
   */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  (response) => {
    const res = response.data;
    Nprogress.done();
    if (res.code != 0) {
      // if the custom code is not 20000, it is judged as an error.
      // Message({
      //   message: res.message || 'Error',
      //   type: 'error',
      //   duration: 5 * 1000
      // })

      // 50008: Illegal token; 50012: Other clients logged in; 50014: Token expired;
      if (res.code === 20103) {
        // to re-login
        MessageBox.confirm("登录过期,请重新登录", "提示", {
          confirmButtonText: "重新登录",
          cancelButtonText: "取消",
          type: "warning",
        }).then(() => {
          store.dispatch("user/resetToken").then(() => {
            location.reload();
          });
        });
      }
      // if (res.code === 10003) {
      //   Message.error("参数错误，请重试");
      //   return
      // }
      // return res
      return Promise.reject(res);
    } else {
      return res;
    }
  },
  (error) => {
    if (error.code === "20103") return;
    Message({
      message: error.message,
      type: "error",
      duration: 5 * 1000,
    });
    return Promise.reject(error);
  }
);

export default service;
