<template>
  <div>
    <div class="custom-navbar"><span @click="gotoList">首页</span> / 审核</div>
    <div v-if="!fetchDataLoading">
      <div style="float: right;margin-bottom:20px;" v-if="type === 'review'">
        <el-button type="plain" @click="handleWord()">下载文档</el-button>
        <el-button type="danger" @click="handleReview('nopass')"
          >打回修改</el-button
        >
        <el-button type="success" @click="handleReview('pass')"
          >审核通过</el-button
        >
      </div>
      <div class="iframeContent">
        <iframe
          v-if="pdfUrl"
          :src="pdfUrl"
          width="100%"
          height="100%"
          frameborder="0"
        ></iframe>
      </div>
    </div>

    <div v-if="fetchDataLoading">
      <div style="text-align: center">预览生成中，请耐心等候</div>
      <div style="float: right">
        <div class="custom-div"></div>
        <div class="custom-div"></div>
        <div class="custom-div"></div>
      </div>
      <div class="iframeContent gujiapin">
        <div class="content"></div>
      </div>
    </div>
  </div>
</template>
<script>
import { download_description, reviewCase } from "@/api/table";
import { baseUrl } from "@/utils/baseUrl";

export default {
  data() {
    return {
      id: "",
      pdfUrl: "",
      type: "check",
      fetchDataLoading:true,
    };
  },
  created() {
    console.log("in", this.$route);
    this.id = this.$route.query.id;
    this.type = this.$route.query.type;
    if (this.id) {
      console.log("获取数据");
      this.getPdfUrl();
    } else {
      this.$message.error("缺少必需参数");
    }
  },
  methods: {
    handleWord() {
      const param = {
        type: 2,
        id: this.id,
      };
      // this.startLoading("下载word文档中，请耐心等候")
      download_description(param)
        .then((res) => {
          // this.closeLoading()
          wordUrl = baseUrl() + res.data.url;
          window.open(wordUrl);
        })
        .catch((err) => {
          // this.closeLoading()
          this.$message.error(err.message);
        });
    },
    handleReview(type) {
      const params = {
        id: this.id,
        pass: type === "pass" ? true : false,
      };
      reviewCase(params)
        .then((res) => {
          const tips = type === "pass" ? "审核通过" : "已打回修改";
          this.$message.success(tips);
          this.gotoList();
        })
        .catch((err) => {
          this.$message.error(err.message || "接口繁忙，请稍后再试");
        });
    },
    startLoading(text) {
      this.loading = this.$loading({
        lock: true,
        text: text,
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.8)",
      });
    },
    /**关闭loading**/
    closeLoading() {
      this.loading.close();
    },
    getPdfUrl() {
      const param = {
        type: 1,
        id: this.id,
      };
      // this.startLoading("生成预览文件中，请耐心等候")
      download_description(param)
        .then((res) => {
          // this.closeLoading()
          this.fetchDataLoading = false;
          this.pdfUrl = baseUrl() + res.data.url;
        })
        .catch((err) => {
          // this.closeLoading()
          this.fetchDataLoading = false;
          this.$message.error(err.message);
        });
    },
    gotoList() {
      this.$router.push({ path: "/data-list" });
    },
  },
};
</script>
<style lang="scss" scoped>
.steps-box {
  text-align: center;
  margin: 0 auto 20px;
}
.custom-navbar {
  cursor: pointer;
  font-size: 12px;
  color: gray;
  margin-bottom: 20px;
}
.iframeContent {
  height: calc(100vh - 250px);
  margin-top: 60px;
}
.gujiapin {
  background: gray;
  margin-top:80px;
  .content {
    width: 50%;
    height: 100%;
    background: gainsboro;
    margin: 0 auto;
    animation: blink 1.2s ease-in-out infinite;
  }
}
.custom-div {
  display: inline-block;
  margin-left: 10px;
  margin-top:20px;
  width: 98px;
  height: 40px;
  background: gainsboro;
  animation: blink 1.2s ease-in-out infinite;
  border-radius: 4px;
  // border:1px solid red;
}
@keyframes blink {
  50% {
    opacity: 0.5;
  }
}
</style>
