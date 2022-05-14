<template>
  <el-dialog
    title="文件上传"
    center=""
    :visible.sync="show"
    width="30%"
    :before-close="handleClose"
  >
    <el-upload
      class="upload-main"
      action="http://8.129.8.125:8080/api/v1/file/upload_file"
      :headers="{
        Authorization:`Bearer ${token}`,
      }"
      :on-preview="handlePreview"
      :on-remove="handleRemove"
      :on-success="handleSuccess"
      :show-file-list="true"
      :before-remove="beforeRemove"
      multiple
      drag
      :limit="3"
      :on-exceed="handleExceed"
      :file-list="fileList"
    >
      <i class="el-icon-upload"></i>
      <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
    </el-upload>
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
      token: this.$store.getters.token,
      fileList: [],
    };
  },
  created() {
    console.log("this.type", this.type);
  },
  methods: {
    beforeRemove(file) {},
    handlePreview(file) {},
    handleRemove(file) {},
    handleSuccess(response, file, fileList) {
      console.log("handleSuccess", { response, file, fileList });
    },
    handleExceed(file) {
      console.log("handleExceed", file);
    },
    handleClose() {
      this.$emit("update:show", false);
    },
  },
};
</script>
<style lang="scss" scoped>
.upload-main {
  text-align: center;
}
</style>
