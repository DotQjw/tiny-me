<template>
  <div class="page">
    <div class="page-main">
      <div class="box">
        <div class="custom-label">本专利属于哪个技术领域</div>
        <el-input
          class="custom-input"
          v-model="form.techArea"
          placeholder="请输入内容"
          @input="inputChange"
        ></el-input>
      </div>
    </div>
    <div class="bottom">
      <el-button type="primary" @click="saveData('next')">下一步</el-button>
      <el-button @click="saveData('save')">保 存</el-button>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    type: {
      type: String,
      default: "",
    },
    id: {
      type: String,
      default: "",
    },
    techArea: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      timer: null,
      showDilag: this.type === "add" ? true : false,
      content: "",
      form: {
        techArea: this.techArea,
        id: "",
      },
    };
  },
  created() {
    console.log("this.id", this.id, this.techArea);
  },
  methods: {
    saveData(type) {
      console.log('before',this.form.techArea)
      this.$emit("saveData", {
        type,
        step: 1,
        techArea:this.form.techArea
      });
    },
    inputChange() {
      if (this.timer) {
        clearTimeout(this.timer);
      }
      this.timer = setTimeout(() => {
        this.saveData("autoSave");
      }, 1000);
    },
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
