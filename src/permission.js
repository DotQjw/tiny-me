import router from "./router";
import store from "./store";
import NProgress from "nprogress"; // progress bar
import "nprogress/nprogress.css"; // progress bar style
import { getToken } from "@/utils/auth"; // get token from cookie
import getPageTitle from "@/utils/get-page-title";
import { MessageBox, Message } from "element-ui";

NProgress.configure({ showSpinner: false }); // NProgress Configuration

const whiteList = ["/login"]; // no redirect whitelist

router.beforeEach(async (to, from, next) => {
  // start progress bar、
  NProgress.start();

  // set page title
  // document.title = getPageTitle(to.meta.title)
  document.title = "DAJIA PAT";

  // determine whether the user has logged in
  const hasToken = getToken();
  // const hasToken = localStorage.getItem("token");
  if (hasToken) {
    if (to.path === "/login") {
      if (store.getters.roles === 1) {
        next({ path: "/data-list" });
      } else {
        next({ path: "/case-list" });
      }
      NProgress.done();
    } else {
      // router.addRoutes(store.getters.asyncRoutes);
      const hasGetUserInfo = store.getters.name;
      if (hasGetUserInfo) {
        next();
      } else {
        try {
          // get user info
          // await store.dispatch('user/getInfo')

          next();
        } catch (error) {
          // remove token and go to login page to re-login
          await store.dispatch("user/resetToken");
          Message.error(error || "Has Error");
          next(`/login?redirect=${to.path}`);
          NProgress.done();
        }
      }
    }
  } else {
    if (to.path === "/data-list") {
      next(`/login?redirect=${to.path}`);
      return;
    }
    if (whiteList.indexOf(to.path) !== -1) {
      // in the free login whitelist, go directly
      next();
    } else {
      MessageBox.confirm("登录过期,请重新登录", "提示", {
        confirmButtonText: "重新登录",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        store.dispatch("user/resetToken").then(() => {
          console.log("0000");
          next(`/login?redirect=${to.path}`);
          NProgress.done();
        });
      });
      // next(`/login?redirect=${to.path}`)
      // NProgress.done()
    }
  }
});

router.afterEach(() => {
  // finish progress bar
  NProgress.done();
});
