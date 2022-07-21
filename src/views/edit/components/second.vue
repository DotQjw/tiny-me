<template>
  <div class="page">
    <div class="page-main step2">
      <div class="title">
        <img src="@/assets/work_images/star.svg" alt="" />
        <span>背景技术</span>
      </div>
      <div class="box">
        <div class="custom-label">
          <span class="right-label-title"> 本专利应用在哪个领域？ </span>
          <span class="right-tool">
            <span
              class="file-list-tool"
              v-if="
                formData.domain.recordFiles.length ||
                formData.domain.attachments.length
              "
              @click="openFileList('domain')"
            >
              <span class="tool-item-file-list">
                <i class="el-icon-paperclip"></i>
                <span class="tool-label">附件列表</span>
              </span>
              <i class="el-icon-arrow-down custom-arrow-down"></i>
            </span>
            <span class="tool-item" @click="openUploadFile('domain')">
              <i class="el-icon-upload2"></i>
              <span class="tool-label">上传附件</span>
            </span>
            <span class="tool-item" @click="openRecord('domain')">
              <i class="el-icon-microphone"></i>
              <span class="tool-label"> 语音转文字 </span>
            </span>
          </span>
        </div>
        <el-input
          type="textarea"
          :rows="4"
          @input="inputChange"
          class="custom-input"
          v-model="formData.domain.text"
          placeholder="请输入内容"
        ></el-input>
      </div>
      <div class="box">
        <div class="custom-label">
          <span class="right-label-title">该领域存在什么痛点？</span>
          <span class="right-tool">
            <span
              class="file-list-tool"
              v-if="
                formData.painPoint.recordFiles.length ||
                formData.painPoint.attachments.length
              "
              @click="openFileList('painPoint')"
            >
              <span class="tool-item-file-list">
                <i class="el-icon-paperclip"></i>
                <span class="tool-label">附件列表</span>
              </span>
              <i class="el-icon-arrow-down custom-arrow-down"></i>
            </span>
            <span class="tool-item" @click="openUploadFile('painPoint')">
              <i class="el-icon-upload2"></i>
              <span class="tool-label">上传附件</span>
            </span>
            <span class="tool-item" @click="openRecord('painPoint')">
              <i class="el-icon-microphone"></i>
              <span class="tool-label"> 语音转文字 </span>
            </span>
          </span>
        </div>
        <el-input
          :rows="4"
          @input="inputChange"
          type="textarea"
          class="custom-input"
          v-model="formData.painPoint.text"
          placeholder="请输入内容"
        ></el-input>
      </div>
      <div class="box">
        <div class="custom-label">
          <span class="right-label-title">当前是如何解决这些痛点的？</span>
          <span class="right-tool">
            <span
              class="file-list-tool"
              v-if="
                formData.currentSolution.recordFiles.length ||
                formData.currentSolution.attachments.length
              "
              @click="openFileList('currentSolution')"
            >
              <span class="tool-item-file-list">
                <i class="el-icon-paperclip"></i>
                <span class="tool-label">附件列表</span>
              </span>
              <i class="el-icon-arrow-down custom-arrow-down"></i>
            </span>
            <span class="tool-item" @click="openUploadFile('currentSolution')">
              <i class="el-icon-upload2"></i>
              <span class="tool-label">上传附件</span>
            </span>
            <span class="tool-item" @click="openRecord('currentSolution')">
              <i class="el-icon-microphone"></i>
              <span class="tool-label"> 语音转文字 </span>
            </span>
          </span>
        </div>
        <el-input
          :rows="4"
          @input="inputChange"
          type="textarea"
          class="custom-input"
          v-model="formData.currentSolution.text"
          placeholder="请输入内容"
        ></el-input>
      </div>
      <div class="box">
        <div class="custom-label">
          <span class="right-label-title">解决这些痛点的方案所存在的且本专利要解决的缺陷有哪些？</span>
          <span class="right-tool">
            <span
              class="file-list-tool"
              v-if="
                formData.pendingDefect.recordFiles.length ||
                formData.pendingDefect.attachments.length
              "
              @click="openFileList('pendingDefect')"
            >
              <span class="tool-item-file-list">
                <i class="el-icon-paperclip"></i>
                <span class="tool-label">附件列表</span>
              </span>
              <i class="el-icon-arrow-down custom-arrow-down"></i>
            </span>
            <span class="tool-item" @click="openUploadFile('pendingDefect')">
              <i class="el-icon-upload2"></i>
              <span class="tool-label">上传附件</span>
            </span>
            <span class="tool-item" @click="openRecord('pendingDefect')">
              <i class="el-icon-microphone"></i>
              <span class="tool-label"> 语音转文字 </span>
            </span>
          </span>
        </div>
        <el-input
          :rows="4"
          @input="inputChange"
          type="textarea"
          class="custom-input"
          v-model="formData.pendingDefect.text"
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
    secondStepsData: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      timer: null,
      showUpload: false,
      uploadFileType: null,
      showRecord: false,
      recordType: null,
      showFileList: false,
      fileListType: null,
      currentRecordList: [],
      currentFileList: [],
      formData: this.secondStepsData,
    };
  },
  methods: {
    saveData(type) {
      this.$emit("saveData", {
        type,
        step: 2,
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
};
</script>
<style lang="scss">
.step2 {
  .custom-input {
    textarea {
      height: 210px !important;
    }
  }
}
</style>
<style lang="scss" scoped>
.page {
  // text-align: center;
  //   padding: 30px 50px;
  margin-bottom: 18px;
}
.page-main {
  background: #fff;
  padding: 0 50px 30px 50px;
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
.box {
  // border:2px solid red;
  //   width: 400px;
  margin: 0 auto;
}
.custom-label {
  // text-align: center;
  margin: 32px 0 16px 0;
}
.right-tool {
  float: right;
  margin-bottom: 16px;
  .tool-item {
    display: inline-block;
    padding: 5px 16px;
    background: #f2f3f5;
    font-family: "Nunito Sans";
    font-style: normal;
    font-weight: 400;
    font-size: 14px;
    line-height: 22px;
    color: #4e5969;
    margin-left: 10px;
    border-radius: 2px;
    cursor: pointer;
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
  padding: 5px 16px;
  line-height: 28px;
  background: #f2f3f5;
  margin-left: 10px;
  border-top-left-radius: 2px;
  border-bottom-left-radius: 2px;
  cursor: pointer;
  font-family: "Nunito Sans";
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 22px;
  // color: #4e5969;
  border-right: 1px solid #e5e6eb;
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
