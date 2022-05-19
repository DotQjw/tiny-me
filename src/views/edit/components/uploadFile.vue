<template>
  <el-dialog
    title="文件上传"
    center=""
    :visible.sync="show"
    width="30%"
    
    :close-on-click-modal="false"
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
      :before-uoload="beforeUpload"
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
import store from "@/store";
export default {
  props: {
    maxIndex:{
      type:Number,
      default:1
    },
    type: {
      type: String,
      default: '',
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
    console.log("this.type", this.type,this.id);
  },
  methods: {
    beforeRemove(file) {},
    handlePreview(file) {},
    handleRemove(file) {},
    handleSuccess(response, file, fileList) {
      console.log("handleSuccess", { response, file, fileList });
      if(response.code === 0){
        this.$emit('uploadFile',{
          name:`文件${this.maxIndex}`,
          url:response.data.url,
          size:file.size
        })
      }else if(response.code === 20103){
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
    beforeUpload(file){
      console.log('file',file)
    },
    handleExceed(file) {
      console.log("handleExceed", file);
      this.$message.warning('最多同时上传三个文件')
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
