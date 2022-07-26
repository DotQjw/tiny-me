<template>
  <div :class="classObj" class="app-wrapper">
    <!-- <div v-if="device==='mobile'&&sidebar.opened" class="drawer-bg" @click="handleClickOutside" /> -->
    <!-- <sidebar class="sidebar-container" /> -->
    <div>
      <!-- <div :class="{'fixed-header':fixedHeader}">
        <navbar />
      </div> -->
        <div class="interface-header" v-if="userInfo.role === 2">
            <span class="title">
                <img src="@/assets/login_images/logo_t.svg" alt="" style="width: 33px;height: 33px">
                <span class="title-text">大贾知本</span>
            </span>
            <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" @select="handleMenu">
                <el-menu-item index="work">
                    <template slot="title">
                        <div class="link">
                            <a href="#" @click="stopClick">
                                <img src="@/assets/interface_images/work.svg" alt="" v-if="activeIndex !== 'work'">
                                <img src="@/assets/interface_images/active_work.svg" alt="" v-else>
                                <span class="skip">工作台</span>
                            </a>
                        </div>
                    </template>
                </el-menu-item>
                <el-menu-item index="case">
                    <template slot="title">
                        <div class="link">
                            <router-link to="/case-list">
                                <img src="@/assets/interface_images/case.svg" alt="" v-if="activeIndex !== 'case'">
                                <img src="@/assets/interface_images/active_case.svg" alt="" v-else>
                                <span class="skip">案件管理</span>
                            </router-link>
                        </div>
                    </template>
                </el-menu-item>
                <el-menu-item index="alert">
                    <template slot="title">
                        <div class="link">
                            <a href="#" @click="stopClick">
                                <img src="@/assets/interface_images/alert.svg" alt="">
                                <span class="skip">绩效统计</span>
                            </a>
                        </div>
                    </template>
                </el-menu-item>
            </el-menu>
            <el-popover
                placement="bottom-start"
            >
                <div class="user_info">
                    <div class="info_top">
                        <img src="@/assets/interface_images/photo.svg" alt="" class="info_img">
                        <div class="role">
                            <span class="name">
                                {{userInfo.username}}
                            </span>
                            <span class="p1" v-if="userInfo.role === 1 && !userInfo.isAdmin">
                                主办人
                            </span>
                            <span class="p2" v-if="userInfo.role === 2">
                                协办人
                            </span>
                            <span class="admin" v-if="userInfo.isAdmin">
                                超级管理员
                            </span>
                        </div>
                    </div>
                    <div class="info_btm">
                        <div style="margin-bottom: 26px" v-if="userInfo.isAdmin" @click="gotoAccount">
                            <img src="@/assets/interface_images/manage.svg" alt="" style="font-size: 24px">
                            账号管理
                        </div>
                        <div @click="logout">
                            <img src="@/assets/interface_images/quit.svg" alt="" style="font-size: 24px">
                            退出登录
                        </div>
                    </div>
                </div>
                <img src="@/assets/interface_images/photo.svg" alt="" class="user" slot="reference">
            </el-popover>
        </div>
      <app-main />
    </div>
  </div>
</template>

<script>
import { Navbar, Sidebar, AppMain } from './components'
import ResizeMixin from './mixin/ResizeHandler'
import { mapGetters } from "vuex";


export default {
  name: 'Layout',
  components: {
    Navbar,
    Sidebar,
    AppMain
  },
  mixins: [ResizeMixin],
  data() {
    return {
      activeIndex: 'case'
    }
  },
  watch: {
      $route: {
          handler(val, oldVal) {
              this.activeIndex = val.query?.active
          },
          deep: true
      }
  },
  computed: {
    ...mapGetters(["sidebar", "avatar", "name", , "userInfo"]),
    sidebar() {
      return this.$store.state.app.sidebar
    },
    device() {
      return this.$store.state.app.device
    },
    fixedHeader() {
      return this.$store.state.settings.fixedHeader
    },
    classObj() {
      return {
        hideSidebar: !this.sidebar.opened,
        openSidebar: this.sidebar.opened,
        withoutAnimation: this.sidebar.withoutAnimation,
        mobile: this.device === 'mobile'
      }
    }
  },
  methods: {
    handleClickOutside() {
      this.$store.dispatch('app/closeSideBar', { withoutAnimation: false })
    },
    handleMenu(key, keyPath) {
        this.activeIndex = key
        console.log('index', this.activeIndex)
        console.log('key', key)
        console.log('keyPath', keyPath)
    },
    stopClick() {
        this.$message('敬请期待');
    },
    async logout() {
        console.log('wadawd')
      await this.$store.dispatch("user/logout");
      this.$router.push(`/login?redirect=${this.$route.fullPath}`);
    },
    gotoAccount() {
      window.open("/#/account-manage");
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "~@/styles/mixin.scss";
  @import "~@/styles/variables.scss";
   .el-popover {
      padding-top: 0;
      padding-bottom: 0;
      .user_info {
          width: 222px;
          // height: 246px;
          border-radius: 6px;
          .info_top {
              border-bottom: 1px solid #F2F3F5;
              box-sizing: border-box;
              display: flex;
              justify-content: center;
              align-items: center;
              padding: 12px 0 24px 0;
              .info_img {
                  width: 78px;
                  height: 78px;
                  border-radius: 50%;
                  margin-right: 16px;
              }
              .role {
                  height: 78px;
                  display: flex;
                  flex-direction: column;
                  justify-content: center;
                  .name {
                      margin-bottom: 9px;
                      font-family: 'PingFang SC';
                      font-style: normal;
                      font-weight: 500;
                      font-size: 16px;
                      line-height: 22px;
                      color: #4E5969;
                  }
                  .p1 {
                      display: block;
                      width: 86px;
                      height: 24px;
                      line-height: 22px;
                      text-align: center;
                      background: #E8FFFB;
                      border-radius: 2px;
                      font-family: 'Nunito Sans';
                      font-style: normal;
                      font-weight: 400;
                      font-size: 14px;
                      color: #0FC6C2;
                  }
                  .p2 {
                      display: block;
                      height: 24px;
                      line-height: 22px;
                      text-align: center;
                      background: #FFF7E8;
                      border-radius: 2px;
                      font-family: 'Nunito Sans';
                      font-style: normal;
                      font-weight: 400;
                      font-size: 14px;
                      color: #FF7D00;
                  }
                  .admin {
                      display: block;
                      width: 86px;
                      height: 24px;
                      line-height: 22px;
                      text-align: center;
                      background: #FFECE8;
                      border-radius: 2px;
                      font-family: 'Nunito Sans';
                      font-style: normal;
                      font-weight: 400;
                      font-size: 14px;
                      color: #F53F3F;
                  }
              }
          }
          .info_btm {
              display: flex;
              justify-content: center;
              align-items: center;
              flex-direction: column;
              padding: 25px 0 13px 0;
              div {
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  font-family: 'PingFang SC';
                  font-style: normal;
                  font-weight: 400;
                  font-size: 16px;
                  line-height: 22px;
                  color: #1D2129;
                  cursor: pointer;
                  img {
                      margin-right: 10px;
                  }
              }
          }
      }
  }
  .app-wrapper {
    @include clearfix;
    position: relative;
    height: 100%;
    width: 100%;
    &.mobile.openSidebar{
      position: fixed;
      top: 0;
    }
    .interface-header {
        height: 64px;
        background-color: #1842A3;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0 32px;
        box-sizing: border-box;
        .title {
            display: flex;
            align-items: center;
            .title-text {
                font-family: 'Inter';
                font-style: normal;
                font-weight: 800;
                font-size: 20px;
                line-height: 24px;
                color: #E6E9F1;
                margin-left: 8px;
            }
        }
        .el-menu-demo {
            height: 100%;
            background-color: #1842A3;
            border: none;
            .el-menu-item {
                height: 64px;
                color: #8FA0C1;
                line-height: 64px;
                .link {
                    display: block;
                    height: 100%;
                    a {
                        display: block;
                        padding: 0 16px;
                        height: 100%;
                        .skip{
                            margin-left: 9px;
                            width: 100%;
                            height: 100%;
                        }
                    }
                }
                &:hover {
                    background-color: #2552BA;
                }
            }
            .is-active {
                border-bottom: 2px solid #fff;
                background: #2552BA;
                color: #fff;
            }
            
        }
        .user {
            width: 32px;
            height: 32px;
            border-radius: 50%;
            cursor: pointer;
        }
    }
  }
  .drawer-bg {
    background: #000;
    opacity: 0.3;
    width: 100%;
    top: 0;
    height: 100%;
    position: absolute;
    z-index: 999;
  }

  .fixed-header {
    position: fixed;
    top: 0;
    right: 0;
    z-index: 9;
    width: calc(100% - #{$sideBarWidth});
    transition: width 0.28s;
  }

  .hideSidebar .fixed-header {
    width: calc(100% - 54px)
  }

  .mobile .fixed-header {
    width: 100%;
  }
</style>
