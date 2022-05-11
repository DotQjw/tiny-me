<template>
  <div class="page">
    <div class="page-main">
      <div class="box">
        <div class="custom-label">本专利属于哪个技术领域</div>
        <el-input
          class="custom-input"
          v-model="content"
          placeholder="请输入内容"
        ></el-input>
      </div>
    </div>
    <div class="bottom">
      <el-button type="primary">下一步</el-button>
      <el-button>保 存</el-button>
    </div>
    <created-case v-if="showDilag" :show.sync="showDilag" />
  </div>
</template>
<script>
import createdCase from './createdCase'
export default {
  components:{createdCase},
  props:{
    type:{
      type:String,
      default:''
    }
  },
  data() {
    return {
      showDilag:this.type === 'add' ? true : false,
      content: "",
    };
  },
};
</script>
<style lang="scss" scoped>
.page-main {
  background: #fff;
  // text-align: center;
  padding: 30px 0;
}
.box {
  // border:2px solid red;
  width: 400px;
  margin: 0 auto;
}
.custom-label {
  // text-align: center;
  margin-bottom: 10px;
}
.custom-input {
  width: 300px;
}
.bottom {
  margin-top: 20px;
  text-align: center;
}
</style>
