<template>
  <el-dialog
    center
    :visible.sync="show"
    width="500px"
    :before-close="handleClose"
  >
    <div class="dialog-main">
      <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
        <el-tab-pane label="用户管理" name="1"></el-tab-pane>
        <el-tab-pane label="配置管理" name="2"></el-tab-pane>
      </el-tabs>
      <div v-if="activeName === '1'">
        <div>录音1</div>
        <div>录音2</div>
        <div>录音3</div>
        <div>录音4</div>
        <div>录音5</div>
      </div>
      <div v-else>
        <div>文件1</div>
        <div>文件2</div>
        <div>文件3</div>
        <div>文件4</div>
        <div>文件5</div>
      </div>
    </div>
  </el-dialog>
</template>
<script>
export default {
  props: {
    type: {
      type: Number,
      default: null,
    },
    show: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      activeName: "1",
    };
  },
  created() {
    console.log("this.type", this.type);
  },
  methods: {
    handleClick() {},
    handleClose() {
      this.$emit("update:show", false);
      this.$router.go(-1);
    },
  },
};
</script>
<style lang="scss" scoped>
.dialog-main {
  line-height: 30px;
}
.dialog-btn {
  margin-top: 20px;
  margin-bottom: 20px;
  text-align: center;
}
.unready {
  color: gray;
}
.recording {
  color: #67c23a;
}
</style>
