<template>
  <div :class="{ 'has-logo': showLogo }">
    <logo :collapse="isCollapse" />

    <el-scrollbar wrap-class="scrollbar-wrapper" style="height:calc(100% - 160px);">
      <el-menu
        :default-active="activeMenu"
        :collapse="isCollapse"
        :background-color="variables.menuBg"
        :text-color="variables.menuText"
        :unique-opened="false"
        :active-text-color="variables.menuActiveText"
        :collapse-transition="false"
        mode="vertical"
      >
        <sidebar-item
          v-for="route in routes"
          :key="route.path"
          :item="route"
          :base-path="route.path"
        />
      </el-menu>
    </el-scrollbar>
    <name :collapse="isCollapse" />
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import Logo from "./Logo";
import Name from "./Name.vue"
import SidebarItem from "./SidebarItem";
import variables from "@/styles/variables.scss";

export default {
  components: { SidebarItem, Logo,Name },
  computed: {
    ...mapGetters(["sidebar"]),
    routes() {
      return this.$router.options.routes.filter((v) => v.path === "/account");
    },
    activeMenu() {
      const route = this.$route;
      const { meta, path } = route;
      // if set path, the sidebar will highlight the path you set
      if (meta.activeMenu) {
        return meta.activeMenu;
      }
      return path;
    },
    showLogo() {
      return this.$store.state.settings.sidebarLogo;
    },
    variables() {
      return variables;
    },
    isCollapse() {
      return !this.sidebar.opened;
    },
  },
  created() {
    console.log(".", this.$router.options.routes);
  },
};
</script>
<style scoped>
.sys-title {
  height: 80px;
  width: 210px;
  /* position: absolute; */
  float: right;
  left: 0;
  top: 0;
  z-index: 9999;
  color: red;
}
</style>
