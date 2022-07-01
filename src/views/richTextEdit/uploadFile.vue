<template>
  <el-dialog
    title="说明书附图管理"
    center=""
    :visible.sync="show"
    width="600px"
    top="5%"
    :close-on-click-modal="false"
    :before-close="handleClose"
  >
    <div class="dialog-box">
      <div
        v-for="(item, index) in fileList"
        :key="index"
        style="margin-bottom: 20px"
      >
        <div class="item-box">
          <el-image
            v-on:mouseover="handleOver(item, index)"
            class="item-img"
            :src="imgBaseUrl + item.url"
          ></el-image>
          <span
            v-if="item.showSpan"
            v-on:mouseout="handleOut(item, index)"
            @click="handleSetImg(item, index)"
            class="item-span"
            >设置为<br />摘要附图</span
          >

          <span v-if="selectedUrl === item.url" class="selected-item">
            摘要附图
          </span>
          <div class="item-title">
            <div class="item-main-title">{{ item.name }}</div>
            <div @click="handleEditSub(item, index)" v-if="!item.edit">
              <span v-if="item.desc">
                {{ item.desc }}
              </span>
              <span v-else>请添加附图说明</span>
            </div>
            <el-input
              style="max-width: 150px"
              @blur="handleBlur(item, index)"
              v-else
              v-model="inputValue"
            ></el-input>
            <i class="el-icon-delete delete-icon"  @click="handleDelete(item,index)">
              
            </i>
          </div>
        </div>
      </div>
      <el-upload
        class="upload-main"
        :action="uploadUrl"
        :headers="{
          Authorization: `Bearer ${token}`,
        }"
        accept=".png,.jeg,.jpeg,.gif"
        :on-preview="handlePreview"
        :on-remove="handleRemove"
        :on-success="handleSuccess"
        :before-upload="beforeUpload"
        :before-remove="beforeRemove"
        :show-file-list="false"
        :limit="30"
        :on-exceed="handleExceed"
      >
        <div style="background: #f2f3f5; width: 100%; padding: 20px 0">
          <i class="el-icon-picture"></i>
          <div class="el-upload__text">添加附图</div>
        </div>
      </el-upload>
    </div>
    <div
      style="border-top: 1px solid #e5e6e8; padding: 10px; text-align: right"
    >
      <el-button @click="handleClose">关 闭</el-button>
    </div>
  </el-dialog>
</template>
<script>
import store from "@/store";
import { getToken } from "@/utils/auth";
import { uploadFileUrl, baseUrl } from "@/utils/baseUrl";

export default {
  props: {
    type: {
      type: String,
      default: "",
    },
    imgList: {
      type: Array,
      default: () => [],
    },
    show: {
      type: Boolean,
      default: false,
    },
    abstractUrl: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      inputValue: "",
      selectedUrl: this.abstractUrl,
      uploadUrl: uploadFileUrl(),
      imgBaseUrl: baseUrl(),
      token: this.$store.getters.token || getToken(),
      fileList: this.imgList,
    };
  },
  created() {},
  methods: {
    beforeRemove(file) {},
    handlePreview(file) {},
    handleRemove(file) {},
    handleSuccess(response, file, fileList) {
      console.log("handleSuccess", { response, file, fileList });
      if (response.code === 0) {
        this.fileList.push({
          name: `图${this.fileList.length + 1}`,
          url: response.data.url,
          size: file.size,
          desc: "",
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
      const isJpg = /image\/(png|jpe?g|gif)$/.test(file.type)
      if(!isJpg){
        this.$message.warning('只能上传png,jpg,jpeg,gif格式的图片,上传的文件格式有误，请重试')
        return false;
      }
      
    },
    handleExceed(file) {
      console.log("handleExceed", file);
      this.$message.warning("最多同时上传三个文件");
    },
    handleClose() {
      this.$emit("uploadFile", this.selectedUrl);
      this.$emit("update:show", false);
    },
    handleEditSub(item, index) {
      // item.edit = true;
      this.$set(this.fileList[index], "edit", true);
      this.$nextTick(() => {
        this.inputValue = item.desc;
      });
    },
    handleBlur(item, index) {
      if (this.inputValue === item.desc) {
        console.log("没有改变");
      } else {
        this.$set(this.fileList[index], "desc", this.inputValue);
        this.inputValue = "";
      }

      this.$set(this.fileList[index], "edit", false);
    },
    handleOver(item, index) {
      console.log("我路过了", item.name);
      if (item.url === this.selectedUrl) return;
      if (item.showSpan) return;
      this.$set(this.fileList[index], "showSpan", true);
    },
    handleOut(item, index) {
      console.log("我离开了", item.name);
      this.$set(this.fileList[index], "showSpan", false);

      // if (this.time) clearTimeout(this.timer);
      // this.timer = setTimeout(() => {
      //   this.$set(this.fileList[index], "showSpan", false);
      // }, 300);
    },
    handleSetImg(item, index) {
      console.log("img", item.url);
      this.selectedUrl = item.url;
      this.$set(this.fileList[index], "showSpan", false);
    },
    handleDelete(item,index){
      if(item.url ===  this.selectedUrl ){
         this.selectedUrl  = ""
      }
      this.fileList.splice(index,1);
    }
  },
};
</script>
<style lang="scss" scoped>
::v-deep .el-dialog__body {
  padding: 0;
}
.dialog-box {
  padding: 20px 30px;
  max-height: 500px;
  overflow-y: scroll;
}
.upload-main {
  text-align: center;
  background: #f2f3f5;
  margin-top: 20px;
}
.item-img {
  width: 81px;
  height: 81px;
  border-radius: 4px;
}
.item-box {
  position: relative;
  display: flex;
  margin-top: 20px;
}
.item-title {
  flex: 1;
  margin-left: 20px;
}
.item-main-title {
  margin-bottom: 10px;
}
.item-span {
  border: 1px solid purple;
  display: block;
  width: 81px;
  padding: 0 10px;
  height: 81px;
  border-radius: 4px;
  position: absolute;
  z-index: 2;
  background-color: rgba(0, 0, 0, 0.5);
  // opacity: 0.5;
  color: #fff;
  text-align: center;
  padding-top: 20px;
  cursor: pointer;
}
.selected-item {
  position: absolute;
  z-index: 2;
  background: #498edf;
  border-radius: 6px;
  line-height: 22px;
  color: #fff;
  width: 61px;
  left: 10px;
  font-size: 12px;
  bottom: 10px;
  text-align: center;
}
.delete-icon{
  margin-top:22px;
  cursor: pointer;
  &:hover{
    color:red;
  }
}
</style>
