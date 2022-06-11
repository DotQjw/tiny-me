<template>
  <div class="sidebar-logo-container" :class="{ collapse: collapse }">
    <transition name="sidebarLogoFade">
      <!-- <div  v-if="collapse">{{name}}</div> -->
      <!-- <el-avatar
        v-if="collapse"
        :size="22"
        icon="el-icon-user-solid"
        style="margin-top:29px;"
      >
      </el-avatar> -->
      <el-popover placement="right" v-if="collapse" width="150" trigger="click">
        <div style="text-align: center" @click="logout">退出登录</div>
        <div slot="reference">
          <el-avatar
            :size="22"
            icon="el-icon-user-solid"
            style="margin-top: 29px"
          >
          </el-avatar>
          {{ name }}
          <i
            class="el-icon-arrow-right"
            style="float: right; line-height: 80px; margin-right: 20px"
          ></i>
        </div>
      </el-popover>
      <div v-else key="expand" class="sidebar-logo-link">
        <div class="sys-name">
          <el-popover placement="right" width="150" trigger="click">
            <div style="text-align: center" @click="logout">退出登录</div>
            <div slot="reference">
              <el-avatar
                :size="22"
                icon="el-icon-user-solid"
                style="vertical-align: middle"
              >
              </el-avatar>
              {{ name }}
              <i
                class="el-icon-arrow-right"
                style="float: right; line-height: 80px; margin-right: 20px"
              ></i>
            </div>
          </el-popover>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "SidebarLogo",
  computed: {
    ...mapGetters(["name"]),
  },
  props: {
    collapse: {
      type: Boolean,
      required: true,
    },
  },
  data() {
    return {
      title: "Vue Admin Template",
      logo: "https://wpimg.wallstcn.com/69a1c46c-eb1c-4b46-8bd4-e9e686ef5251.png",
    };
  },
  methods: {
    async logout() {
      await this.$store.dispatch("user/logout");
      this.$router.push(`/login?redirect=${this.$route.fullPath}`);
    },
  },
};
</script>

<style lang="scss" scoped>
.sys-name {
  position: fixed;
  width: 210px;
  height: 80px;
  color: #fff;
  line-height: 80px;
  font-weight: bolder;
  font-size: 16px;
  background: #0d0d1f;
  left: 0;
  bottom: 0;
  padding-left: 20px;
  z-index: 2222;
  cursor: pointer;
}
.sidebarLogoFade-enter-active {
  transition: opacity 1.5s;
}

.sidebarLogoFade-enter,
.sidebarLogoFade-leave-to {
  opacity: 0;
}

.sidebar-logo-container {
  position: relative;
  width: 100%;
  height: 80px;
  line-height: 50px;
  background: #2b2f3a;
  text-align: center;
  overflow: hidden;

  & .sidebar-logo-link {
    height: 100%;
    width: 100%;

    & .sidebar-logo {
      width: 32px;
      height: 32px;
      vertical-align: middle;
      margin-right: 12px;
    }

    & .sidebar-title {
      display: inline-block;
      margin: 0;
      color: #fff;
      font-weight: 600;
      line-height: 80px;
      font-size: 24px;
      font-family: Avenir, Helvetica Neue, Arial, Helvetica, sans-serif;
      vertical-align: middle;
    }
  }

  &.collapse {
    .sidebar-logo {
      margin-right: 0px;
    }
  }
}
</style>
