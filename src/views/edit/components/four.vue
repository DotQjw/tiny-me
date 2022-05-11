<template>
  <div class="page">
    <div class="page-main">
      <div class="box">
        <div class="custom-label">
          <span> 实现方案 </span>
          <span class="right-tool">
            <span class="tool-item">
              <i class="el-icon-upload2"></i>
              <span>上传附件</span>
            </span>
            <span class="tool-item">
              <i class="el-icon-headset"></i>
              <span> 语音转文字 </span>
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

    </div>
    <div class="bottom">
      <el-button type="primary">下一步</el-button>
      <el-button type="success">上一步</el-button>
      <el-button>保 存</el-button>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      content: "",
    };
  },
};
</script>
<style lang="scss" scoped>
.page {
  // text-align: center;
//   padding: 30px 50px;
}
.page-main{
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
  }
}
.bottom {
  margin-top: 20px;
  text-align: center;
}
</style>
