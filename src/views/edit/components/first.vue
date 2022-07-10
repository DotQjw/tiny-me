<template>
  <div class="page">
    <div class="page-main">
      <div class="box">
        <div class="title">
          <img src="@/assets/work_images/star.svg" alt="">
          <span>技术领域</span>
        </div>
        <div class="custom-label">
          <span class="label-text"> 本专利应用在哪个领域？ </span>
          <el-input
            class="custom-input"
            v-model="form.techArea"
            placeholder="请输入内容"
            @input="inputChange"
          ></el-input>
        </div>
      </div>
    </div>
    <!-- <div class="bottom">
      <el-button type="primary" @click="saveData('next')">下一步</el-button>
      <el-button @click="saveData('save')">保 存</el-button>
    </div> -->
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
    console.log("this.id+++++++++", this.id, this.techArea);
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
.page {
  margin-bottom: 18px;
}
.page-main {
  background: #fff;
  // text-align: center;
  padding: 0 50px 30px 50px;
}
.box {
  // border:2px solid red;
  width: 100%;
  // margin: 0 auto;
}
.title {
  // text-align: center;
  height: 68px;
  margin-bottom: 23px;
  display: flex;
  align-items: center;
  border-bottom: 1px solid #E5E6EB;
  img {
    margin-right: 10px;
  }
  span {
    color: #1D2129;
    font-weight: 500;
    font-size: 20px;
    font-family: 'PingFang SC';
  }
}
.custom-label {
  display: flex;
  flex-direction: column;
  .label-text {
    margin-bottom: 16px;
  }
}
.custom-input {
  width: 300px;
}
.bottom {
  margin-top: 20px;
  text-align: center;
}
</style>
