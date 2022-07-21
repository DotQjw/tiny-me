<template>
  <div class="page">
    <div class="page-main">
      <div class="title">
        <img src="@/assets/work_images/star.svg" alt="" />
        <span>方案概述</span>
      </div>
      <div class="box step3">
        <div class="custom-label">
          <span class="right-label-title"> 本专利的解决思路？ </span>
          <span class="right-tool">
            <span
              class="file-list-tool"
              v-if="
                formData.idea.recordFiles.length ||
                formData.idea.attachments.length
              "
              @click="openFileList('idea')"
            >
              <span class="tool-item-file-list">
                <i class="el-icon-paperclip"></i>
                <span class="tool-label">附件列表</span>
              </span>
              <i class="el-icon-arrow-down custom-arrow-down"></i>
            </span>
            <span class="tool-item" @click="openUploadFile('idea')">
              <i class="el-icon-upload2"></i>
              <span class="tool-label">上传附件</span>
            </span>
            <span class="tool-item" @click="openRecord('idea')">
              <i class="el-icon-microphone"></i>
              <span class="tool-label"> 语音转文字 </span>
            </span>
          </span>
        </div>
        <el-input
          type="textarea"
          :rows="4"
          class="custom-input"
          @input="inputChange"
          v-model="formData.idea.text"
          placeholder="请输入内容"
        ></el-input>
      </div>
    </div>
    <!-- <div class="bottom">
      <el-button type="primary" @click="saveData('next')">下一步</el-button>
      <el-button @click="saveData('last')">上一步</el-button>
      <el-button @click="saveData('save')">保 存</el-button>
    </div> -->
    <upload-file
      :type="uploadFileType"
      v-if="showUpload"
      :show.sync="showUpload"
      :maxIndex="maxIndex"
      @uploadFile="uploadFile"
    />
    <record
      :type="recordType"
      @uploadRecord="uploadRecord"
      :maxIndex="maxIndex"
      v-if="showRecord"
      :show.sync="showRecord"
    />
    <file-list
      :type="fileListType"
      :recordList.sync="currentRecordList"
      @uploadRecord="uploadRecord"
      @uploadFile="uploadFile"
      :fileList.sync="currentFileList"
      v-if="showFileList"
      :show.sync="showFileList"
    />
  </div>
</template>
<script>
import uploadFile from "./uploadFile";
import record from "./record";
import fileList from "./fileList";

export default {
  components: { uploadFile, record, fileList },
  props: {
    id: {
      type: String,
      default: "",
    },
    idea: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      timer: null,
      formData: {
        id: this.id || "001",
        idea: this.idea,
      },
      showUpload: false,
      uploadFileType: null,
      showRecord: false,
      recordType: null,
      showFileList: false,
      fileListType: null,
      currentRecordList: [],
      currentFileList: [],
    };
  },
  created() {
    console.log("this.data", this.id, this.idea);
  },
  methods: {
    saveData(type) {
      this.$emit("saveData", {
        type,
        step: 3,
      });
    },
    inputChange() {
      if (this.timer) {
        clearTimeout(this.timer);
      }
      this.timer = setTimeout(() => {
        this.saveData("autoSave");
      }, 1000);
    },
    uploadRecord(data) {
      this.formData[this.recordType]["recordFiles"].push(data);
      this.saveData("autoFile");

      console.log("formData", this.formData[this.recordType]["recordFiles"]);
    },
    uploadFile(data) {
      this.formData[this.uploadFileType]["attachments"].push(data);
      this.saveData("autoFile");

      console.log(
        "formData",
        this.formData[this.uploadFileType]["attachments"]
      );
    },
    openUploadFile(type) {
      this.uploadFileType = type;
      this.maxIndex = this.formData[type].attachments.length + 1;
      this.showUpload = true;
    },
    openRecord(type) {
      this.recordType = type;
      this.maxIndex = this.formData[type].recordFiles.length + 1;
      this.showRecord = true;
    },
    openFileList(type) {
      this.recordType = type;
      this.uploadFileType = type;
      this.showFileList = true;
      this.fileListType = type;
      this.currentRecordList = this.formData[type].recordFiles;
      this.currentFileList = this.formData[type].attachments;
    },
  },
  beforeDestroy() {
    clearTimeout(this.timer);
  },
};
</script>
<style lang="scss">
.step3 {
  .el-textarea__inner {
    height: 300px !important;
  }
}
</style>
<style lang="scss" scoped>
.page {
  margin-bottom: 18px;
}
.page-main {
  background: #fff;
  padding: 0 50px 30px 50px;
}
.box {
  margin: 0 auto;
}
.custom-label {
  margin: 32px 0 16px 0;
}
.right-tool {
  float: right;
  margin-bottom: 16px;
  .tool-item {
    display: inline-block;
    padding: 5px 16px;
    background: #f2f3f5;
    margin-left: 10px;
    cursor: pointer;
    border-radius: 2px;
    background: #f2f3f5;
    font-family: "Nunito Sans";
    font-style: normal;
    font-weight: 400;
    font-size: 14px;
    line-height: 22px;
    color: #4e5969;
    &:hover {
      color: #165dff;
    }
  }
  .tool-label {
    margin-left: 10px;
  }
}
.bottom {
  margin-top: 20px;
  text-align: center;
}
.title {
  // text-align: center;
  height: 60px;
  margin-bottom: 23px;
  display: flex;
  align-items: center;
  border-bottom: 1px solid #e5e6eb;
  img {
    margin-right: 10px;
  }
  span {
    color: #1d2129;
    font-weight: 500;
    font-size: 20px;
    font-family: "PingFang SC";
  }
}
.custom-arrow-down {
  display: inline-block;
  background: #f2f3f5;
  line-height: 22px;
  border-top-right-radius: 2px;
  border-bottom-right-radius: 2px;
  padding: 5px 11px;
  cursor: pointer;
  position: relative;
  top: 0.5px;
}
.tool-item-file-list {
  display: inline-block;
  padding: 5px 20px;
  line-height: 28px;
  background: #f2f3f5;
  margin-left: 10px;
  border-top-left-radius: 2px;
  border-bottom-left-radius: 2px;
  cursor: pointer;
  border-right: 1px solid #e5e6eb;
  font-family: "Nunito Sans";
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 22px;
  &:hover {
    color: #165dff;
  }
}
.file-list-tool {
  color: #4e5969;
  &:hover {
    color: #165dff !important;
  }
}
.right-label-title {
  position: relative;
  top: 8px;
}
</style>
