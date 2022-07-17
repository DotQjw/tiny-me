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
          :label="`上传文件${fileAry.length}`"
          name="1"
        ></el-tab-pane>
      </el-tabs>
      <div>
        <div v-if="fileAry && fileAry.length">
          <div v-for="(item, index) in fileAry" :key="index" class="list-item">
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
    fileList: {
      type: Array,
      default: () => [],
    },
    show: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      recordAry: this.recordList,
      fileAry: this.fileList,
      copyText: "",
      activeName: "1",
      audioSrc: "",
      baseUrl: baseUrl(),
    };
  },
  created() {
  },
  methods: {
    handleClick() {},
    handleDownLoad(item) {
      const url = this.baseUrl + item.url;
      window.open(url);
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
        this.copyText = res.data.text;
        this.$nextTick(() => {
          this.copyData();
        });
      }
    },
    copyData() {
      this.$copyText(this.copyText).then(
        (e) => {
           this.$nextTick(()=>{
            this.copyDataAgain();
          })
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
  },
};
</script>
<style lang="scss" scoped>
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
