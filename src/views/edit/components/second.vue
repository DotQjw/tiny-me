<template>
  <div class="page">
    <div class="page-main">
      <div class="box">
        <div class="custom-label">
          <span> 本专利属于哪个技术领域 </span>
          <span class="right-tool">
            <span class="tool-item" @click="openFileList(1)">
              <i class="el-icon-paperclip"></i>
              <span class="tool-label">附件列表</span>
            </span>
            <span class="tool-item" @click="openUploadFile(1)">
              <i class="el-icon-upload2"></i>
              <span class="tool-label">上传附件</span>
            </span>
            <span class="tool-item" @click="openRecord(1)">
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
            <span class="tool-item" @click="openFileList(2)">
              <i class="el-icon-paperclip"></i>
              <span class="tool-label">附件列表</span>
            </span>
            <span class="tool-item" @click="openUploadFile(2)">
              <i class="el-icon-upload2"></i>
              <span class="tool-label">上传附件</span>
            </span>
            <span class="tool-item" @click="openRecord(2)">
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
            <span class="tool-item" @click="openFileList(3)">
              <i class="el-icon-paperclip"></i>
              <span class="tool-label">附件列表</span>
            </span>
            <span class="tool-item" @click="openUploadFile(3)">
              <i class="el-icon-upload2"></i>
              <span class="tool-label">上传附件</span>
            </span>
            <span class="tool-item" @click="openRecord(3)">
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
            <span class="tool-item" @click="openFileList(4)">
              <i class="el-icon-paperclip"></i>
              <span class="tool-label">附件列表</span>
            </span>
            <span class="tool-item" @click="openUploadFile(4)">
              <i class="el-icon-upload2"></i>
              <span class="tool-label">上传附件</span>
            </span>
            <span class="tool-item" @click="openRecord(4)">
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
    />
    <record :type="recordType" v-if="showRecord" :show.sync="showRecord" />
    <file-list :type="fileListType" v-if="showFileList" :show.sync="showFileList" />
  </div>
</template>
<script>
import uploadFile from "./uploadFile";
import record from "./record";
import fileList from "./fileList"
export default {
  components: { uploadFile, record,fileList },
  data() {
    return {
      content: "",
      showUpload: false,
      uploadFileType: null,
      showRecord: false,
      recordType: null,
      showFileList:false,
      fileListType:null
    };
  },
  methods: {
    openUploadFile(type) {
      this.uploadFileType = type;
      this.showUpload = true;
    },
    openRecord(type) {
      this.recordType = type;
      this.showRecord = true;
    },
    openFileList(type){
      this.showFileList = true;
      this.fileListType = type;
    }
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
