<template>
  <div class="page">
    <div class="page-main">
      <div class="box">
        <div class="custom-label">
          <span> 实现方案 </span>
          <span class="right-tool">
            <span class="tool-item" @click="openFileList('claim')">
              <i class="el-icon-paperclip"></i>
              <span class="tool-label">附件列表</span>
            </span>
            <span class="tool-item" @click="openUploadFile('claim')">
              <i class="el-icon-upload2"></i>
              <span class="tool-label">上传附件</span>
            </span>
            <span class="tool-item" @click="openRecord('claim')">
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
          v-model="formData.claim.text"
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
import { implementPlan } from "@/api/table";

export default {
  components: { uploadFile, record, fileList },
  watch: {
    id(n, o) {
      console.log("n", n, o);
      this.formData.id = n;
    },
  },
  data() {
    return {
      timer: null,
      formData: {
        id: this.id || '001',
        claim: {
          text: "",
          attachments: [],
          recordFiles: [],
        },
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
  created(){
    console.log('this.data',this.id)
  },
  methods: {
    handleNext() {},
    handleLast() {},
    handleSave() {
      console.log("this", this.formData);
      implementPlan(this.formData).then((res) => {
        console.log("res", res);
        this.$message.success("保存成功");
      }).catch(err=>{
        this.$message.error(err.message)
      })
    },
    inputChange(){
      console.log('进来')
      if(this.timer){
        clearTimeout(this.timer)
      }
      this.timer = setTimeout(()=>{
        console.log('触发')
        this.handleSave()
      },1000)
    },
    uploadRecord(data) {
      this.formData[this.recordType]["recordFiles"].push(data);
      console.log("formData", this.formData[this.recordType]["recordFiles"]);
    },
    uploadFile(data) {
      this.formData[this.uploadFileType]["attachments"].push(data);
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
      this.showFileList = true;
      this.fileListType = type;
      this.currentRecordList = this.formData[type].recordFiles;
      this.currentFileList = this.formData[type].attachments;
    },
  },
  beforeDestroy(){
    clearTimeout(this.timer)
  }
};
</script>
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
