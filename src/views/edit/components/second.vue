<template>
  <div class="page">
    <div class="page-main">
      <div class="box">
        <div class="custom-label">
          <span> 本专利属于哪个技术领域 </span>
          <span class="right-tool">
            <span class="tool-item" @click="openFileList('type1')">
              <i class="el-icon-paperclip"></i>
              <span class="tool-label">附件列表</span>
            </span>
            <span class="tool-item" @click="openUploadFile('type1')">
              <i class="el-icon-upload2"></i>
              <span class="tool-label">上传附件</span>
            </span>
            <span class="tool-item" @click="openRecord('type1')">
              <i class="el-icon-headset"></i>
              <span class="tool-label"> 语音转文字 </span>
            </span>
          </span>
        </div>
        <el-input
          type="textarea"
          :rows="4"
          class="custom-input"
          v-model="content"
          placeholder="请输入内容"
        ></el-input>
      </div>
      <div class="box">
        <div class="custom-label">
          <span>该领域存在什么痛点</span>
          <span class="right-tool">
            <span class="tool-item" @click="openFileList('type2')">
              <i class="el-icon-paperclip"></i>
              <span class="tool-label">附件列表</span>
            </span>
            <span class="tool-item" @click="openUploadFile('type2')">
              <i class="el-icon-upload2"></i>
              <span class="tool-label">上传附件</span>
            </span>
            <span class="tool-item" @click="openRecord('type2')">
              <i class="el-icon-headset"></i>
              <span class="tool-label"> 语音转文字 </span>
            </span>
          </span>
        </div>
        <el-input
          :rows="4"
          type="textarea"
          class="custom-input"
          v-model="content"
          placeholder="请输入内容"
        ></el-input>
      </div>
      <div class="box">
        <div class="custom-label">
          <span>当前是如何解决这些痛点的</span>
          <span class="right-tool">
            <span class="tool-item" @click="openFileList('type3')">
              <i class="el-icon-paperclip"></i>
              <span class="tool-label">附件列表</span>
            </span>
            <span class="tool-item" @click="openUploadFile('type3')">
              <i class="el-icon-upload2"></i>
              <span class="tool-label">上传附件</span>
            </span>
            <span class="tool-item" @click="openRecord('type3')">
              <i class="el-icon-headset"></i>
              <span class="tool-label"> 语音转文字 </span>
            </span>
          </span>
        </div>
        <el-input
          :rows="4"
          type="textarea"
          class="custom-input"
          v-model="content"
          placeholder="请输入内容"
        ></el-input>
      </div>
      <div class="box">
        <div class="custom-label">
          <span>解决这些痛点的方案所存在的且本专利要解决的缺陷有哪些？</span>
          <span class="right-tool">
            <span class="tool-item" @click="openFileList('type4')">
              <i class="el-icon-paperclip"></i>
              <span class="tool-label">附件列表</span>
            </span>
            <span class="tool-item" @click="openUploadFile('type4')">
              <i class="el-icon-upload2"></i>
              <span class="tool-label">上传附件</span>
            </span>
            <span class="tool-item" @click="openRecord('type4')">
              <i class="el-icon-headset"></i>
              <span class="tool-label"> 语音转文字 </span>
            </span>
          </span>
        </div>
        <el-input
          :rows="4"
          type="textarea"
          class="custom-input"
          v-model="content"
          placeholder="请输入内容"
        ></el-input>
      </div>
    </div>
    <div class="bottom">
      <el-button type="primary">下一步</el-button>
      <el-button type="success">上一步</el-button>
      <el-button>保 存</el-button>
    </div>
    <upload-file
      :type="uploadFileType"
      v-if="showUpload"
      :show.sync="showUpload"
      @uploadFile="uploadFile"
    />
    <record
      :type="recordType"
      @uploadRecord="uploadRecord"
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
  data() {
    return {
      content: "",
      showUpload: false,
      uploadFileType: null,
      showRecord: false,
      recordType: null,
      showFileList: false,
      fileListType: null,
      currentRecordList: [],
      currentFileList: [],
      formData: {
        type1: {
          recordList: [],
          fileList: [],
        },
        type2: {
          recordList: [],
          fileList: [],
        },
        type3: {
          recordList: [],
          fileList: [],
        },
        type4: {
          recordList: [],
          fileList: [],
        },
      },
    };
  },
  methods: {
    uploadRecord(data) {
      this.formData[this.recordType]["recordList"].push(data);
      console.log("formData", this.formData[this.recordType]["recordList"]);
    },
    uploadFile(data) {
      this.formData[this.uploadFileType]["fileList"].push(data);
      console.log("formData", this.formData[this.uploadFileType]["fileList"]);
    },
    openUploadFile(type) {
      this.uploadFileType = type;
      this.showUpload = true;
    },
    openRecord(type) {
      this.recordType = type;
      this.showRecord = true;
    },
    openFileList(type) {
      this.showFileList = true;
      this.fileListType = type;
      this.currentRecordList = this.formData[type].recordList;
      this.currentFileList = this.formData[type].fileList;
    },
  },
};
</script>
<style lang="scss" scoped>
.page {
  // text-align: center;
  //   padding: 30px 50px;
}
.page-main {
  background: #fff;
  padding: 30px 50px;
}
.box {
  // border:2px solid red;
  //   width: 400px;
  margin: 0 auto;
}
.custom-label {
  // text-align: center;
  margin: 20px 0;
}
.custom-input {
  //   width: 300px;
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
