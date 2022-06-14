<template>
  <el-dialog
    title="文件上传"
    center=""
    :visible.sync="show"
    width="500px"
    :close-on-click-modal="false"
    :before-close="handleClose"
  >
    <el-upload
      class="upload-main"
      :action="uploadUrl"
      :headers="{
        Authorization: `Bearer ${token}`,
      }"
      :on-preview="handlePreview"
      :on-remove="handleRemove"
      :on-success="handleSuccess"
      :show-file-list="false"
      :before-upload="beforeUpload"
      :before-remove="beforeRemove"
      drag
      :on-exceed="handleExceed"
      :file-list="fileList"
    >
      <i class="el-icon-upload"></i>
      <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
    </el-upload>
    <div v-if="this.filename">
      <div style="margin: 10px 0">
        {{ this.filename }}  
        <span >{{percentage === 100 ? '上传成功':'正在上传中'}}</span>
      </div>
      <el-progress
        v-if="percentage != 0"
        :text-inside="true"
        :stroke-width="16"
        :percentage="percentage"
      ></el-progress>

      <div style="margin:10px 0;" v-for="(item, index) in fileList" :key="index">
       <i class="el-icon-success" style="color:#165DFF;" /> {{ item.name }}
      </div>
    </div>
  </el-dialog>
</template>
<script>
import store from "@/store";
import { getToken } from "@/utils/auth";
import { uploadFileUrl,baseUrl } from '@/utils/baseUrl';

export default {
  props: {
    maxIndex: {
      type: Number,
      default: 1,
    },
    type: {
      type: String,
      default: "",
    },
    show: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      uploadUrl:uploadFileUrl(),
      timer: null,
      percentage: 0,
      token: this.$store.getters.token || getToken(),
      fileList: [],
      filename: "",
    };
  },
  created() {
    console.log("this.type", this.type, this.id);
  },
  methods: {
    beforeRemove(file) {},
    handlePreview(file) {},
    handleRemove(file) {},
    handleSuccess(response, file, fileList) {
      clearInterval(this.timer);
      this.fileList = fileList;
      console.log('fileList',this.fileList)
      this.percentage = 100;
      console.log("handleSuccess", { response, file, fileList });
      if (response.code === 0) {
        this.$message.success("文件上传成功");
        this.$emit("uploadFile", {
          name: this.filename,
          url: response.data.url,
          size: file.size,
        });
      } else if (response.code === 20103) {
        this.$confirm("登录过期,请重新登录", "提示", {
          confirmButtonText: "重新登录",
          cancelButtonText: "取消",
          type: "warning",
        }).then(() => {
          store.dispatch("user/resetToken").then(() => {
            location.reload();
          });
        });
      }
    },
    beforeUpload(file) {
      console.log("file", file);
      this.percentage = 0;
      this.filename = file.name;
      this.timer = setInterval(() => {
        this.percentage += 1;
        if (this.percentage === 95) {
          clearInterval(this.timer);
        }
      }, 100);
      console.log("fileData", this.fileData);
    },
    handleExceed(file) {
      console.log("handleExceed", file);
      this.$message.warning("最多同时上传三个文件");
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
