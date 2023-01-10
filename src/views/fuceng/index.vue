<template>
  <div class="guide-container">
    <div class="box">
      <div class="sub" style="margin-right: 24px" @click="handleClick(2)">
        <img src="@/assets/work_images/icon.svg" alt="" />
        <span>创建案件</span>
      </div>
      <div class="sub" @click="handleClick(1)">
        <img src="@/assets/work_images/frame.svg" alt="" />
        <span>管理案件</span>
      </div>
    </div>
    <create-case
      v-if="showDialog"
      :createData="createData"
      :show.sync="showDialog"
    />
  </div>
</template>

<script>
import createCase from "@/views/commonComponents/createCase.vue";

export default {
  name: "daohan",
  components: { createCase },
  data() {
    return {
      showDialog: false,
      createData: {},
      loginForm: {
        username: "admin",
        password: "",
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
    handleClick(index) {
      console.log("index", index);
      if (index === 1) {
        this.$router.push({ path: "/data-list", query: { active: "case" } });
      } else {
        this.showDialog = true;
        // this.$router.push({ path: "/data-edit", query: { type: "add" } });
      }
    },
  },
};
</script>

<style lang="scss" scoped>
$bg: #f8f8f8;
$dark_gray: #889aa4;
$light_gray: #eee;

.guide-container {
  padding: 105px 192px 0 192px;
  display: flex;
  justify-content: center;
  .box {
    width: 440px;
    height: 206px;
    display: flex;
    justify-content: center;
    // border:2px solid palegoldenrod;
    // background: skyblue;
    // position: absolute;
    // top: 105px;
    // text-align: center;
    .sub {
      background: #fff;
      // height: 50%;
      // margin-top: 30px;
      // padding: 30px 50px;
      width: 208px;
      height: 206px;
      border-radius: 8px;
      // line-height: 100px;
      // border: 1px solid red;
      border: 1px solid #efefef;
      font-weight: bold;
      cursor: pointer;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      img {
        margin-bottom: 24px;
      }
    }
  }
  .guide-container {
    min-height: 100%;
    width: 100%;
    background-color: $bg;
    overflow: hidden;

    .login-form {
      position: relative;
      width: 520px;
      max-width: 100%;
      padding: 160px 35px 0;
      margin: 0 auto;
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

    .svg-container {
      padding: 6px 5px 6px 15px;
      color: $dark_gray;
      vertical-align: middle;
      width: 30px;
      display: inline-block;
    }

    .title-container {
      position: relative;

      .title {
        font-size: 26px;
        color: $light_gray;
        margin: 0px auto 40px auto;
        text-align: center;
        font-weight: bold;
      }
    }

    .show-pwd {
      position: absolute;
      right: 10px;
      top: 7px;
      font-size: 16px;
      color: $dark_gray;
      cursor: pointer;
      user-select: none;
    }
  }
}
// test 6
</style>
