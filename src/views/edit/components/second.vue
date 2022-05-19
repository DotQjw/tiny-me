<template>
  <div class="page">
    <div class="page-main">
      <div class="box">
        <div class="custom-label">
          <span> 本专利属于哪个技术领域 </span>
          <span class="right-tool">
            <span class="tool-item" @click="openFileList('domain')">
              <i class="el-icon-paperclip"></i>
              <span class="tool-label">附件列表</span>
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
          class="custom-input"
          v-model="formData.domain.text"
          placeholder="请输入内容"
        ></el-input>
      </div>
      <div class="box">
        <div class="custom-label">
          <span>该领域存在什么痛点</span>
          <span class="right-tool">
            <span class="tool-item" @click="openFileList('painPoint')">
              <i class="el-icon-paperclip"></i>
              <span class="tool-label">附件列表</span>
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
          type="textarea"
          class="custom-input"
          v-model="formData.painPoint.text"
          placeholder="请输入内容"
        ></el-input>
      </div>
      <div class="box">
        <div class="custom-label">
          <span>当前是如何解决这些痛点的</span>
          <span class="right-tool">
            <span class="tool-item" @click="openFileList('currentSolution')">
              <i class="el-icon-paperclip"></i>
              <span class="tool-label">附件列表</span>
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
          type="textarea"
          class="custom-input"
          v-model="formData.currentSolution.text"
          placeholder="请输入内容"
        ></el-input>
      </div>
      <div class="box">
        <div class="custom-label">
          <span>解决这些痛点的方案所存在的且本专利要解决的缺陷有哪些？</span>
          <span class="right-tool">
            <span class="tool-item" @click="openFileList('pendingDefect')">
              <i class="el-icon-paperclip"></i>
              <span class="tool-label">附件列表</span>
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
          type="textarea"
          class="custom-input"
          v-model="formData.pendingDefect.text"
          placeholder="请输入内容"
        ></el-input>
      </div>
    </div>
    <div class="bottom">
      <el-button type="primary" @click="handleNext">下一步</el-button>
      <el-button type="success" @click="handleLast">上一步</el-button>
      <el-button @click="handleSave">保 存</el-button>
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
import { saveTechbg } from "@/api/table";
export default {
  components: { uploadFile, record, fileList },
  props:{
    id:{
      type:String,
      default:""
    }
  },
  watch:{
    id(n,o){
      console.log('n',n,o)
      this.formData.id = n;
    }
  },
  data() {
    return {
      showUpload: false,
      uploadFileType: null,
      showRecord: false,
      recordType: null,
      showFileList: false,
      fileListType: null,
      currentRecordList: [],
      currentFileList: [],
      formData: {
        id:this.id ,
        domain: {
          text: "",
          attachments: [],
          recordFiles: [],
        },
        painPoint: {
          text: "",
          attachments: [],
          recordFiles: [],
        },
        currentSolution: {
          text: "",
          attachments: [],
          recordFiles: [],
        },
        pendingDefect: {
          text: "",
          attachments: [],
          recordFiles: [],
        },
      },
    };
  },
  methods: {
    handleNext(){

    },
    handleLast(){

    },
    handleSave(){
      console.log('this',this.formData)
      saveTechbg(this.formData).then(res=>{
        console.log('res',res)
        this.$message.success('保存成功')
      }).catch(err=>{
        this.$message.error(err.message)
      })
    },
    uploadRecord(data) {
      this.formData[this.recordType]["recordFiles"].push(data);
      console.log("formData", this.formData[this.recordType]["recordFiles"]);
    },
    uploadFile(data) {
      this.formData[this.uploadFileType]["attachments"].push(data);
      console.log("formData", this.formData[this.uploadFileType]["attachments"]);
    },
    openUploadFile(type) {
      this.uploadFileType = type;
      this.maxIndex = this.formData[type].attachments.length+1;
      this.showUpload = true;
    },
    openRecord(type) {
      this.recordType = type;
      this.maxIndex = this.formData[type].recordFiles.length+1;
      this.showRecord = true;
    },
    openFileList(type) {
      this.showFileList = true;
      this.fileListType = type;
      this.currentRecordList = this.formData[type].recordFiles;
      this.currentFileList = this.formData[type].attachments;
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
