<template>
  <div class="login-container">
    <div class="login_bg">
      <div class="bg_text">
        <div class="title">
          <img src="@/assets/login_images/logo_s.svg" alt="">
          <span>DAJIA PAT</span>
        </div>
        <div class="b_text">
          引导式流程
        </div>
        <div class="s_text">
          预设模板提高撰写效率
        </div>
      </div>
      <img class="bg_img" src="@/assets/login_images/Group.svg" alt="">
    </div>
    <el-form
      ref="loginForm"
      :model="loginForm"
      :rules="loginRules"
      class="login-form"
      label-position="left"
    >
      <div class="title-container">
        <div class="icon">
          <img src="@/assets/login_images/logo_b.svg" alt="">
        </div>
        <h3 class="title">欢迎使用 DAJIA PAT</h3>
      </div>

      <el-form-item prop="username">
        <!-- <span class="svg-container">
        </span> -->
        <el-input
          auto-complete="new-password"
          v-model="loginForm.username"
          placeholder="请输入手机号/账号"
          type="text"
          tabindex="1" 
          class="login_input"
        >
          <template slot="prepend">
            <span class="input_icon">
              <!-- <svg-icon icon-class="user" style="font-size: 16px"/> -->
              <i class="el-icon-user" style="font-size: 16px"></i>
            </span>
          </template>
        </el-input>
      </el-form-item>

      <el-form-item prop="password">
        <!-- <span class="svg-container">
          <svg-icon icon-class="password" />
        </span> -->
        <el-input
          auto-complete="new-password"
          ref="password"
          v-model="loginForm.password"
          :type="passwordType"
          placeholder="请输入密码"
          tabindex="2"
          @keyup.enter.native="handleLogin"
          class="login_input"
        >
          <template slot="prepend">
            <span class="input_icon">
              <!-- <svg-icon icon-class="password" style="font-size: 16px"/> -->
              <i class="el-icon-lock" style="font-size: 16px"></i>
            </span>
          </template>
          <template slot="append">
            <span class="show-pwd" @click="showPwd">
              <svg-icon
                :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'"
                style="font-size: 16px"
              />
            </span>
          </template>
        </el-input>
        <!-- <span class="show-pwd" @click="showPwd">
          <svg-icon
            :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'"
          />
        </span> -->
      </el-form-item>

      <el-button
        :loading="loading"
        type="primary"
        style="width: 100%; margin-bottom: 30px"
        @click.native.prevent="handleLogin"
        >登录系统</el-button
      >
      <div class="form-btm">
        <span><i class="el-icon-chat-line-round" style="font-size: 16px;margin-right: 8px"></i>联系客服使用本产品</span>
      </div>
    </el-form>
  </div>
</template>

<script>
import { validUsername } from "@/utils/validate";

export default {
  name: "Login",
  data() {
    return {
      loginForm: {
        username: "",
        password: "",
      },
      loginRules: {
        username: [
          { required: true, trigger: "blur", message: "请输入手机号" },
        ],
        password: [{ required: true, trigger: "blur", message: "请输入密码" }],
      },
      loading: false,
      passwordType: "password",
      redirect: undefined,
    };
  },
  watch: {
    $route: {
      handler: function (route) {
        this.redirect = route.query && route.query.redirect;
      },
      immediate: true,
    },
  },
  methods: {
    showPwd() {
      if (this.passwordType === "password") {
        this.passwordType = "";
      } else {
        this.passwordType = "password";
      }
      this.$nextTick(() => {
        this.$refs.password.focus();
      });
    },
    handleLogin() {
      this.$refs.loginForm.validate((valid) => {
        if (valid) {
          // if (this.loginForm.password !== "hello2022") {
          //   this.$message.error("password error");
          //   return;
          // }
          this.loading = true;
          this.$store
            .dispatch("user/login", this.loginForm)
            .then((res) => {
              console.log("res", res);
              if (res.role === 1) {
                this.$router.push({ path: "/interface" });
              } else {
                console.log('走i这里')
                this.$router.push({ path: "/case-list" });
              }
              this.loading = false;
            })
            .catch((error) => {
              console.log("error", error);
              this.$message.error(error.message || "密码错误，请确认账号密码");
              this.loading = false;
            });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

$bg: #283443;
$light_gray: #fff;
$cursor: #fff;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .login-container .el-input input {
    color: $cursor;
  }
}

/* reset element-ui css */
.login-container {
  position: relative;
  background: #EEEFF5;
  display: flex;
  justify-content: center;
  align-items: center;
  .login_bg {
    // position: absolute;
    // width: 100%;
    // height: 100%;
    // min-height: 1200px;
    // background: #EEEFF5;
    // top: 0;
    // z-index: 1;
    height: 700px;
    width: 480px;
    margin-right: 250px;
    position: relative;
    .bg_text {
      height: 100%;
      width: 100%;
      position: absolute;
      top: 0;
      z-index: 1;
      .title{
        display: flex;
        align-items: center;
        img {
          width: 22px;
          height: 22px;
          margin-right: 8px;
        }
        span {
          font-family: 'PingFang SC';
          font-style: normal;
          font-weight: 600;
          font-size: 20px;
          color: #151B4D;
        }
      }
      .b_text {
        font-size: 96px;
        font-family: 'PingFang SC';
        font-weight: 600;
        font-style: normal;
        color: #151B4D;
        padding: 42px 0;
      }
      .s_text {
        font-size: 40px;
        font-family: 'PingFang SC';
        font-weight: 600;
        font-style: normal;
        color: #151B4D;
      }
    }
    .bg_img {
      position: absolute;
      bottom: 40px;
    }
  }
  .login-form {
    // position: absolute;
    // top: 50%;
    width: 503px;
    height: 700px;
    background-color: #fff;
    z-index: 10;
    border-radius: 16px;
    // transform: translateY(-50%);
    position: relative;
    .title-container {
      display: flex;
      justify-content: center;
      flex-direction: column;
      align-items: center;
      .icon {
        img {
          width: 102px;
          height: 102px;
          display: flex;
          justify-content: center;
          align-items: center;
          margin-bottom: 12px;
          border-radius: 17px;
        }
      }
      .title {
        font-family: 'PingFang SC';
        font-style: normal;
        font-weight: 600;
        font-size: 24px;
        color: #4E5969;
      }
    }
    .login_input {
      // display: inline-block;
      height: 47px;
      width: 320px;
      display: flex;
      border: 1px solid #E5E6EB;
      border-radius: 2px;
      box-sizing: border-box;
      ::v-deep .el-input-group__prepend {
        // .input_icon {
        //   display: flex;
        //   align-items: center;
        //   justify-content: center;
        // }
        border: none;
        padding: 15px 10px;
        background-color: #fff;
      }
      ::v-deep .el-input__inner {
        height: 45px !important;
        border: none;
      }
      ::v-deep .el-input-group__append {
        border: none;
        padding: 15px 10px;
        background-color: #fff;
        right: 12px;
      }
      // input {
      //   background: transparent;
      //   border: 0px;
      //   -webkit-appearance: none;
      //   border-radius: 0px;
      //   padding: 12px 5px 12px 15px;
      //   color: $light_gray;
      //   height: 47px;
      //   caret-color: $cursor;

      //   &:-webkit-autofill {
      //     box-shadow: 0 0 0px 1000px $bg inset !important;
      //     -webkit-text-fill-color: $cursor !important;
      //   }
      // }
    }
    .form-btm {
      padding: 24px 0 27px 0;
      width: 100%;
      display: flex;
      justify-content: center;
      position: absolute;
      left: 0;
      bottom: 0;
      border-top: 1px solid #E5E6EB;
      span {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 180px;
        height: 42px;
        background: #F7F8FA;
        font-family: 'PingFang SC';
        font-style: normal;
        font-weight: 400;
        font-size: 14px;
        cursor: pointer;
      }
    }
  }
}
</style>

<style lang="scss" scoped>
$bg: #2d3a4b;
$dark_gray: #889aa4;
$light_gray: #eee;
::v-deep .el-form-item {
  // border: 1px solid rgba(255, 255, 255, 0.1);
  // background: rgba(0, 0, 0, 0.1);
  // border-radius: 5px;
  // color: #454545;
  width: 320px;
  height: 47px;
}
.login-container {
  min-height: 100%;
  width: 100%;
  // background-color: $bg;
  min-width: 1300px;
  overflow: hidden;
  .login-form {
    // width: 520px;
    max-width: 100%;
    padding-top: 128px;
    padding-left: 92px;
    padding-right: 92px;
    // margin: 0 auto;
    overflow: hidden;
  }

  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;

    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }

  // .svg-container {
  //   padding: 6px 5px 6px 15px;
  //   color: $dark_gray;
  //   vertical-align: middle;
  //   width: 30px;
  //   // display: inline-block;
  // }

  .title-container {
    position: relative;
    text-align: center;
    .title {
      font-size: 26px;
      color: $light_gray;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }
    // .title-text{
    //   padding-right: 20px;
    // }
  }

  .show-pwd {
    // position: absolute;
    // right: 10px;
    // top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }
}
</style>
