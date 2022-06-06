<template>
  <div>
    <div class="custom-navbar"><span @click="gotoList">首页</span> / 编辑</div>
    <div style="float:right;">
      <el-button type="plain">下载文档</el-button>
      <el-button type="danger" @click="handleReview('nopass')">打回修改</el-button>
      <el-button type="success" @click="handleReview('pass')">审核通过</el-button>
    </div>
    <div class="iframeContent">
      <iframe v-if="pdfUrl" :src="pdfUrl" width="100%" height="100%" frameborder="0"></iframe>
    </div>
  </div>
</template>
<script>
import { download_description,reviewCase } from "@/api/table";
import { baseUrl } from "@/utils/baseUrl";

export default {
  data() {
    return {
      id: "",
      pdfUrl: "",
    };
  },
  created() {
    console.log("in", this.$route);
    this.id = this.$route.query.id;
    if (this.id) {
      console.log("获取数据");
      this.getPdfUrl();
    } else {
      this.$message.error("缺少必需参数");
    }
  },
  methods: {
    handleReview(type){
      const params = {
        id:this.id,
        pass:type==='pass' ? true:false
      }
      reviewCase(params).then(res=>{
        const tips = type === 'pass' ?'审核通过':"已打回修改"
        this.$message.success(tips);
        this.gotoList();
      }).catch(err=>{
        this.$message.error(err.message || '接口繁忙，请稍后再试')
      })
    },
    getPdfUrl() {
      const param = {
        type: 1,
        id: this.id,
      };
      download_description(param)
        .then((res) => {
          this.pdfUrl = baseUrl() + res.data.url;
        })
        .catch((err) => {
          this.$message.error(res.message);
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
.iframeContent{
  height: calc(100vh - 200px);
  margin-top:80px;
}
</style>
