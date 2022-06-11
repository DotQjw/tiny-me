<template>
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
            <span>{{ item.name }} </span>
            <span class="tool-box">
              <span
                @click="handlePlay(item)"
                class="el-icon-video-play tool-icon"
              ></span>
              <span
                @click="changeText(item)"
                class="el-icon-refresh tool-icon"
              ></span>
              <span @click="handleRemove(item,index,'recordAry')" class="el-icon-delete-solid tool-icon"></span>
            </span>
          </div>
        </div>
        <div v-else>还没有录音文件</div>
      </div>
      <div v-else>
        <div v-if="fileAry && fileAry.length">
          <div v-for="(item, index) in fileAry" :key="index"  class="list-item">
            <span> {{ item.name }}</span>
            <span class="tool-box">
              <span @click="handleDownLoad(item)" class="el-icon-download tool-icon"></span>
              <span @click="handleRemove(item,index,'fileAry')" class="el-icon-delete-solid tool-icon"></span>
            </span>
          </div>
        </div>
        <div v-else>还没有上传文件</div>
      </div>
    </div>
  </el-dialog>
</template>
<script>
import { audioToText } from "@/api/table";
import { baseUrl } from "@/utils/baseUrl";

export default {
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
      recordAry:this.recordList,
      fileAry:this.fileList,
      copyText: "",
      activeName: "1",
      audioSrc: "",
      baseUrl: baseUrl(),
    };
  },
  created() {
    console.log("this.type", this.type, this.recordAry, this.fileAry);
  },
  methods: {
    handleClick() {},
    handleDownLoad(item){
      const url = this.baseUrl + item.ur
      window.open(url)
    },
    handlePlay(item) {
      this.audioSrc = this.baseUrl + item.url;
      console.log("audioSrc", this.audioSrc);
    },
    async changeText(item) {
      this.$notify({
        title: "提示",
        message: "录音转文字中，请耐心等待",
        duration: 3000,
      });
      const res = await audioToText({ url: item.url });
      if (res.data && res.data.text) {
        // this.$message.success("录音转文字成功");
        this.copyText = res.data.text;
        setTimeout(() => {
          this.copyData();
        }, 10);
      }
    },
    copyData() {
      this.$copyText(this.copyText).then(
        (e) => {
          this.$message.success("已将录音转文字复制到您的粘贴板了,去粘贴吧");
        },
        (e) => {
          this.$message.success("复制失败,请重试");
        }
      );
    },
    handleRemove(item,index,type){
      this[type].splice(index,1);
      this.$parent.saveData('updaetFile')
    },
    handleClose() {
      this.$emit("update:show", false);
    },
  },
};
</script>
<style lang="scss" scoped>
// .tool-box{
//   float:right;
// }
.list-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.tool-icon {
  margin-right: 10px;
  cursor: pointer;
}
.tool-icon:hover {
  color: #409eff;
}
.dialog-main {
  line-height: 30px;
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
</style>
