<template>
  <div class="page">
    <div class="page-main">
      <div class="box step4">
        <div class="custom-label">
          <span>本专利如何解决上述缺陷的？</span>
          <span class="right-tool">
            <span
              class="tool-item"
              v-if="
                formData.fixDefectMethod.recordFiles.length ||
                formData.fixDefectMethod.attachments.length
              "
              @click="openFileList('fixDefectMethod')"
            >
              <i class="el-icon-paperclip"></i>
              <span class="tool-label">附件列表</span>
            </span>
            <span class="tool-item" @click="openUploadFile('fixDefectMethod')">
              <i class="el-icon-upload2"></i>
              <span class="tool-label">上传附件</span>
            </span>
            <span class="tool-item" @click="openRecord('fixDefectMethod')">
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
          v-model="formData.fixDefectMethod.text"
          placeholder="请输入内容"
        ></el-input>
      </div>
    </div>
    <div class="bottom">
      <el-button type="primary" @click="saveData('next')">下一步</el-button>
      <el-button @click="saveData('last')">上一步</el-button>
      <el-button @click="saveData('save')">保 存</el-button>
    </div>
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
      :recordList="currentRecordList"
      :fileList="currentFileList"
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
    fixDefectMethod: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      timer: null,
      formData: {
        id: this.id,
        fixDefectMethod: this.fixDefectMethod,
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
    console.log("four step", this.id, this.fixDefectMethod);
  },
  methods: {
    saveData(type) {
      this.$emit("saveData", {
        type,
        step: 4,
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
    },
    uploadFile(data) {
      this.formData[this.uploadFileType]["attachments"].push(data);
      this.saveData("autoFile");
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
.step4 {
  .el-textarea__inner {
    height: 300px !important;
  }
}
</style>
<style lang="scss" scoped>
.page-main {
  background: #fff;
  padding: 30px 50px;
}
.box {
  margin: 0 auto;
}
.custom-label {
  margin: 20px 0;
}
.right-tool {
  float: right;
  .tool-item {
    display: inline-block;
    padding: 5px 20px;
    background: #f2f3f5;
    margin-right: 10px;
    cursor: pointer;
  }
  .tool-label {
    margin-left: 10px;
  }
}
.bottom {
  margin-top: 20px;
  text-align: center;
}
</style>
