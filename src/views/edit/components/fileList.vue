<template>
  <div>
    <el-dialog
      center
      :visible.sync="show"
      width="500px"
      :before-close="handleClose"
      :close-on-click-modal="false"
    >
      <div class="dialog-main">
        <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
          <el-tab-pane
            :label="`录音文件${recordAry.length}`"
            name="1"
          ></el-tab-pane>
          <el-tab-pane
            :label="`上传文件${fileAry.length}`"
            name="2"
          ></el-tab-pane>
        </el-tabs>
        <div v-if="activeName === '1'">
          <audio v-if="audioSrc" :src="audioSrc" controls></audio>
          <div v-if="recordAry && recordAry.length">
            <div
              v-for="(item, index) in recordAry"
              :key="index"
              class="list-item"
            >
              <div class="item-box">
                <i class="el-icon-service" style="margin: 0 13px"></i>
                <span @click="handlePlay(item)" style="cursor: pointer"
                  >{{ item.name }}
                </span>
                <span
                  @click="changeText(item)"
                  style="float: right; margin-top: 7px"
                  class="el-icon-refresh tool-icon"
                  >&#x3000;转文字</span
                >
              </div>
              <span class="tool-box">
                <!-- <span
                @click="handlePlay(item)"
                class="el-icon-video-play tool-icon"
              ></span> -->
                <span
                  @click="handleRemove(item, index, 'recordAry')"
                  class="el-icon-delete-solid tool-icon"
                ></span>
              </span>
            </div>
          </div>
          <div v-else>
            你还没有任何录音文件，<span class="tips-link" @click="gotoRecord"
              >马上录制</span
            >
          </div>
        </div>
        <div v-else>
          <div v-if="fileAry && fileAry.length">
            <div
              v-for="(item, index) in fileAry"
              :key="index"
              class="list-item"
            >
              <div class="item-box">
                <span> {{ item.name }}</span>
                <span
                  style="float: right; margin-top: 7px"
                  @click="handleDownLoad(item)"
                  class="el-icon-download tool-icon"
                ></span>
              </div>

              <span class="tool-box">
                <span
                  @click="handleRemove(item, index, 'fileAry')"
                  class="el-icon-delete-solid tool-icon"
                ></span>
              </span>
            </div>

            <el-upload
              class="upload-input"
              :action="uploadUrl"
              :headers="{
                Authorization: `Bearer ${token}`,
              }"
              :on-success="handleSuccess"
              :show-file-list="false"
              :before-upload="beforeUpload"
              drag
            >
              <i style="margin-top: 10px" class="el-icon-plus"></i>
              <div class="el-upload__text">继续上传</div>
            </el-upload>
          </div>
          <div v-else>
            <el-upload
              class="upload-textaree"
              :action="uploadUrl"
              :headers="{
                Authorization: `Bearer ${token}`,
              }"
              :on-success="handleSuccess"
              :show-file-list="false"
              :before-upload="beforeUpload"
              drag
            >
              <i style="margin-top: 65px" class="el-icon-plus"></i>
              <div class="el-upload__text">
                <span class="upload-text-title"
                  >你可以点击或者拖拽文件到这个区域来上传文件</span
                >
                <div class="upload-text-sub">
                  暂只支持PDF, JPG, PNG,word，ppt，excel 等格式.
                  单个文件最大支持100MB
                </div>
              </div>
            </el-upload>
          </div>
        </div>
      </div>
    </el-dialog>
    <record
      v-if="showRecord"
      @uploadRecord="uploadRecord"
      :type="this.type"
      :maxIndex="recordList.length + 1"
      :show.sync="showRecord"
    />
  </div>
</template>
<script>
import { audioToText } from "@/api/table";
import { baseUrl, uploadFileUrl } from "@/utils/baseUrl";
import { getToken } from "@/utils/auth";
import store from "@/store";
import record from "./record.vue";

export default {
  components: { record },
  props: {
    recordList: {
      type: Array,
      default: () => [],
    },
    fileList: {
      type: Array,
      default: () => [],
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
      uploadUrl: uploadFileUrl(),
      token: this.$store.getters.token || getToken(),
      filename: "",
      showRecord: false,
      recordAry: this.recordList,
      fileAry: this.fileList,
      copyText: "",
      activeName: "1",
      audioSrc: "",
      baseUrl: baseUrl(),
    };
  },
  created() {
    console.log("this.type", this.type);
  },
  methods: {
    handleClick() {},
    gotoRecord() {
      console.log("ttotttttototot");
      this.showRecord = true;
    },
    handleDownLoad(item) {
      const url = this.baseUrl + item.url;
      const fileName = item.name;
      const x = new XMLHttpRequest();
      x.open("GET", url, true);
      x.responseType = "blob";
      x.onload = function () {
        const url = window.URL.createObjectURL(x.response);
        const a = document.createElement("a");
        a.href = url;
        a.download = fileName;
        a.click();
      };
      x.send();
    },
    handlePlay(item) {
      this.audioSrc = this.baseUrl + item.url;
      console.log("audioSrc", this.audioSrc);
    },
    uploadRecord(data) {
      console.log("data", data);
      this.$emit("uploadRecord", data);
    },
    async changeText(item) {
      this.$notify({
        title: "提示",
        message: "录音转文字中，请耐心等待",
        duration: 3000,
      });
      const res = await audioToText({ url: item.url });
      if (res.data && res.data.text) {
        this.copyText = res.data.text;
        this.$nextTick(() => {
          this.copyData();
        });
      }
    },
    copyData() {
      this.$copyText(this.copyText).then(
        (e) => {
          this.$nextTick(() => {
            this.copyDataAgain();
          });
        },
        (e) => {
          this.$message.success("复制失败,请重试");
        }
      );
    },
    copyDataAgain() {
      this.$copyText(this.copyText).then(
        (e) => {
          this.$message.success("已将录音转文字复制到您的粘贴板了,去粘贴吧");
        },
        (e) => {
          this.$message.success("复制失败,请重试");
        }
      );
    },
    handleRemove(item, index, type) {
      this[type].splice(index, 1);
      this.$parent.saveData("updaetFile");
    },
    handleClose() {
      this.$emit("update:show", false);
    },
    beforeUpload(file) {
      this.filename = file.name;
      const fileNameType = file.name.split(".")[1];
      const typeList = [
        "doc",
        "docx",
        "pdf",
        "jpg",
        "jpeg",
        "png",
        "excel",
        "xls",
        "xlsx",
        "dwg",
        "stp",
        "rar",
        "zip",
      ];
      if (!typeList.includes(fileNameType)) {
        this.$message.warning(
          "只能上传格式为doc,docx,pdf,jpg,jpeg,png,excel,xls,xlsx,dwg,stp,rar,zip的文件"
        );
        return false;
      }
      let fileSize = file.size < 1024 * 1024 * 100;
      if (!fileSize) {
        this.$message.warning("文件大小不能超过100M");
        return false;
      }
    },
    handleSuccess(res, file, fileList) {
      console.log({ res, file, fileList });
      if (res.code === 0) {
        this.$message.success("文件上传成功");
        this.$emit("uploadFile", {
          name: this.filename,
          url: res.data.url,
          size: file.size,
        });
      } else if (res.code === 20103) {
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
  },
};
</script>
<style lang="scss" scoped>
::v-deep .el-upload-dragger {
  width: 450px;
  height: 240px;
  background: #f7f8fa;
}
::v-deep .el-tabs__item.is-active {
  color: #165dff;
}
.tool-box {
  // float:right;
  position: relative;
  top: -6px;
}
.list-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.item-box {
  flex: 1;
  vertical-align: middle;
  background: #f7f8fa;
  border-radius: 2px;
  margin-bottom: 10px;
}
.tool-icon {
  margin: 0 10px;
  cursor: pointer;
  // position: relative;
  margin-top: -8px;
}
.tool-icon:hover {
  color: #165dff;
}
.dialog-main {
  line-height: 30px;
  min-height: 310px;
}
.dialog-btn {
  margin-top: 20px;
  margin-bottom: 20px;
  text-align: center;
}
.unready {
  color: gray;
}
.recording {
  color: #67c23a;
}
.tips-link {
  color: #0e42d2;
  cursor: pointer;
}
.upload-textaree {
  width: 450px;
}
.upload-text-title {
  font-family: "Nunito Sans";
  font-style: normal;
  font-weight: 600;
  font-size: 16px;
  line-height: 24px;
  text-align: center;
  color: #4e5969;
}
.upload-text-sub {
  width: 60%;
  margin: 0 auto;
  font-family: "Nunito Sans";
  font-style: normal;
  font-weight: 400;
  font-size: 12px;
  line-height: 18px;
  text-align: center;
  color: #86909c;
}
.upload-input {
  height: 100px;
  ::v-deep .el-upload-dragger {
    height: 78px !important;
  }
}
</style>
