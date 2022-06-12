<template>
  <div class="page">
    <div class="step-box"></div>
    <div class="step-main">
      <div class="step-text">
        <div
          @click="handleClick('1')"
          :class="{ custom2: content1, 'is-active': active == 1 }"
        >
          <span
            class="step-circle"
            :class="{ 'el-icon-check': content1 && active != 1 }"
            >{{ active == 1 || !content1 ? 1 : "" }}</span
          >
          <div>技术领域</div>
        </div>
        <div
          @click="handleClick('2')"
          :class="{ 'is-active': active == 2, custom2: content2 }"
        >
          <span
            class="step-circle"
            :class="{ 'el-icon-check': content2 && active != 2 }"
            >{{ active == 2 || !content2 ? 2 : "" }}</span
          >
          <div>背景技术</div>
        </div>
        <div
          @click="handleClick('3')"
          :class="{ 'is-active': active == 3, custom2: content3 }"
        >
          <span
            class="step-circle"
            :class="{ 'el-icon-check': content3 && active != 3 }"
            >{{ active == 3 || !content3 ? 3 : "" }}</span
          >
          <div>方案描述</div>
        </div>
        <div
          @click="handleClick('4')"
          :class="{ custom2: content4, 'is-active': active == 4 }"
        >
          <span
            class="step-circle"
            :class="{ 'el-icon-check': content4 && active != 4 }"
            >{{ active == 4 || !content4 ? 4 : "" }}</span
          >
          <div>实现方案</div>
        </div>
        <div
          @click="handleClick('5')"
          :class="{ 'is-active': active == 5, custom2: content5 }"
        >
          <span
            class="step-circle"
            :class="{ 'el-icon-check': content5 && active != 5 }"
            >{{ active == 5 || !content5 ? 5 : "" }}</span
          >
          <div>权利要求</div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    active: {
      type: Number,
      default: 0,
    },
    steps: {
      type: Object,
      default: () => {},
    },
  },
  watch: {
    steps: {
      handler(n, o) {
        console.log("steps", n, o);
        this.content1 = n.content1;
        this.content2 = n.content2;
        this.content3 = n.content3;
        this.content4 = n.content4;
        this.content5 = n.content5;
      },
      immediate: true,
      deep: true,
    },
  },
  data() {
    return {
      // active: 1,
      content1: false,
      content2: false,
      content3: false,
      content4: false,
      content5: false,
      //完成 没完成 点击
    };
  },
  created() {
    console.log("    this.active,this.content4", this.active, this.steps);
  },
  methods: {
    handleClick(index) {
      // this.active = index;
      this.$emit("changeSteps", +index);
    },
  },
};
</script>
<style lang="scss" scope>
.page {
  position: relative;
  // cursor: pointer;
}
.step-box {
  width: 80%;
  margin-left: 10%;
  height: 1;
  border: 1px solid;
}
.step-main {
  position: relative;
  top: -12px;
  z-index: 2;
  cursor: pointer;
}
.step-text {
  color: #c0c4cc;
  display: flex;
  justify-content: space-between;
  align-items: center;
  div {
    text-align: center;
    // flex-basis: 20%;
    flex: 1;
  }
  .step-circle {
    display: inline-block;
    width: 24px;
    height: 24px;
    border: 2px solid;
    border-radius: 50%;
    text-align: center;
    line-height: 20px;
    background: #fff;
    margin-bottom: 10px;
    font-size: 14px;
    font-weight: bold;
    box-sizing: border-box;
  }
  .is-active {
    color: #303133 !important;
    font-weight: bold;
  }
  .custom2 {
    color: #67c23a;
  }
}
</style>
