<template>
  <div class="navbar">
    <!-- <hamburger :is-active="sidebar.opened" class="hamburger-container" @toggleClick="toggleSideBar" /> -->

    <!-- <breadcrumb class="breadcrumb-container" /> -->
    <div class="title" @click="gotoIndex">
      专利设计辅助系统 <span class="sub-title">v1.0</span>
    </div>
    <div class="right-menu">
      <el-dropdown class="avatar-container" trigger="click">
        <div class="avatar-wrapper">
          <!-- <img :src="avatar+'?imageView2/1/w/80/h/80'" class="user-avatar"> -->
          <span class="name">欢迎您:{{ name }}</span>
          <!-- <i class="el-icon-caret-bottom" /> -->
        </div>
        <el-dropdown-menu slot="dropdown" class="user-dropdown">
          <!-- <router-link to="/">
            <el-dropdown-item>
              Home
            </el-dropdown-item>
          </router-link> -->
          <!-- <a target="_blank" href="https://github.com/PanJiaChen/vue-admin-template/">
            <el-dropdown-item>Github</el-dropdown-item>
          </a>
          <a target="_blank" href="https://panjiachen.github.io/vue-element-admin-site/#/">
            <el-dropdown-item>Docs</el-dropdown-item>
          </a> -->
          <el-dropdown-item @click.native="logout">
            <span style="display: block">退出登录</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <span v-if="userInfo.isAdmin" class="account" @click="gotoAccount"
      >账号管理</span
    >
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import Breadcrumb from "@/components/Breadcrumb";
import Hamburger from "@/components/Hamburger";

export default {
  components: {
    Breadcrumb,
    Hamburger,
  },
  computed: {
    ...mapGetters(["sidebar", "avatar", "name", , "userInfo"]),
  },
  created() {
    console.log("userInfo", this.userInfo);
  },
  methods: {
    gotoIndex() {
      if (this.userInfo.role === 2) {
        this.$router.push(`/case-list`);
      } else if (this.userInfo.role === 1) {
        this.$router.push(`/data-list`);
      }
    },
    gotoAccount() {
      window.open("/#/account-manage");
    },
    toggleSideBar() {
      this.$store.dispatch("app/toggleSideBar");
    },
    async logout() {
      await this.$store.dispatch("user/logout");
      this.$router.push(`/login?redirect=${this.$route.fullPath}`);
    },
  },
};
</script>

<style lang="scss" scoped>
.account {
  float: right;
  height: 100%;
  line-height: 50px;
  margin-right: 10px;
  font-size: 14px;
  cursor: pointer;
}
.name {
  // vertical-align: text-bottom;
  display: inline-block;
  line-height: 50px;
  margin-left: 3px;
}
.title {
  line-height: 50px;
  margin-left: 20px;
  display: inline-block;
  font-size: 20px;
  font-weight: bold;
  cursor: pointer;
}
.sub-title {
  display: inline;
  position: relative;
  top: -2px;
  font-size: 12px;
  margin-left: 5px;
  color: #4a43fb;
  background: #e9ecfa;
  padding: 5px 10px;
  border-radius: 6px;
}
.navbar {
  height: 50px;
  overflow: hidden;
  position: relative;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);

  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background 0.3s;
    -webkit-tap-highlight-color: transparent;

    &:hover {
      background: rgba(0, 0, 0, 0.025);
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .right-menu {
    float: right;
    height: 100%;
    line-height: 50px;

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background 0.3s;

        &:hover {
          background: rgba(0, 0, 0, 0.025);
        }
      }
    }

    .avatar-container {
      margin-right: 30px;
      cursor: pointer;
      .avatar-wrapper {
        // margin-top: 5px;
        position: relative;

        .user-avatar {
          vertical-align: middle;
          cursor: pointer;
          width: 40px;
          height: 40px;
          border-radius: 10px;
        }

        .el-icon-caret-bottom {
          cursor: pointer;
          position: absolute;
          right: -20px;
          top: 25px;
          font-size: 12px;
        }
      }
    }
  }
}
</style>
