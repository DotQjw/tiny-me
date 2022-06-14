<template>
  <section class="app-main">
    <transition name="fade-transform" mode="out-in">
      <router-view :key="key" />
    </transition>
  </section>
</template>

<script>
export default {
  name: "AppMain",
  computed: {
    key() {
      return this.$route.path;
    },
  },
};
</script>

<style scoped>
.app-main {
  /*50 = navbar  */
  min-height: calc(100vh - 50px);
  background: #f8f8f8;
  padding: 20px 30px;
  width: 100%;
  position: relative;
  overflow: hidden;
}
.fixed-header + .app-main {
  padding-top: 50px;
}
</style>

<style lang="scss">
.el-checkbox__input.is-checked+.el-checkbox__label,
.el-radio__input.is-checked+.el-radio__label{
  color: #165dff !important;
}
.el-checkbox__input.is-checked .el-checkbox__inner, .el-checkbox__input.is-indeterminate .el-checkbox__inner,
.el-radio__input.is-checked .el-radio__inner{
    background-color: #165dff !important;
    border-color: #165dff !important;
}
.el-radio-button__orig-radio:checked+.el-radio-button__inner {
    color: #FFF;
    background-color: #165dff;
    border-color: #165dff;
}
.table_header {
  background: #f2f3f5 !important;
  box-shadow: 1px 0px 0px #f2f3f5;
}
.el-button--text {
  color: #165dff ;
}
.el-button--primary {
  color: #fff;
  background-color: #165dff !important;
  border-color: #165dff !important;
}
.el-button.is-disabled.el-button--text {
  background-color: transparent !important;
}
// fix css style bug in open el-dialog
.el-popup-parent--hidden {
  .fixed-header {
    padding-right: 15px;
  }
}
</style>
