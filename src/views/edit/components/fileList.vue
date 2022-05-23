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
        <el-tab-pane label="录音文件" name="1"></el-tab-pane>
        <el-tab-pane label="上传文件" name="2"></el-tab-pane>
      </el-tabs>
      <div v-if="activeName === '1'">
        <audio v-if="audioSrc" :src="audioSrc" controls></audio>
        <div v-if="recordList && recordList.length">
          <div
            v-for="(item, index) in recordList"
            :key="index"
            class="list-item"
          >
            <span>{{item.name}} </span>
            <span class="tool-box">
              <span
                @click="handlePlay(item)"
                class="el-icon-video-play tool-icon"
              ></span>
              <span
                @click="changeText(item)"
                class="el-icon-delete tool-icon"
              ></span>
            </span>
          </div>
        </div>
        <div v-else>还没有录音文件哦</div>
      </div>
      <div v-else>
        <div v-if="fileList && fileList.length">
          <div v-for="(item, index) in fileList" :key="index">
            {{ item.name }}
          </div>
        </div>
        <div v-else>还没有录音文件哦</div>
      </div>
    </div>
  </el-dialog>
</template>
<script>
import { audioToText } from "@/api/table";
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
      activeName: "1",
      audioSrc: "",
      baseUrl: "https://x-patent.oss-cn-shenzhen.aliyuncs.com/",
    };
  },
  created() {
    console.log("this.type", this.type, this.recordList, this.fileList);
  },
  methods: {
    handleClick() {},
    handlePlay(item) {
      this.audioSrc = this.baseUrl +item.url;
      console.log("audioSrc", this.audioSrc);
    },
    changeText(item) {
      audioToText({ url:item.url }).then((res) => {
        console.log("res", res.data.text);
        if (res.data && res.data.text) {
          // this.$message.success("录音转文字成功");
          this.$copyText(res.data.text).then(
             (e)=> {
               console.log('res.data.text',res.data.text)
              this.$message.success("录音转文字成功,去复制吧");
            },
             (e)=> {
               this.$message.success("复制失败,请重试");
            }
          );
        }
      });
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
