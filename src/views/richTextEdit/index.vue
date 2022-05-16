<template>
  <div class="page">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item><a>说明书编辑</a></el-breadcrumb-item>
      <el-breadcrumb-item>项目名称</el-breadcrumb-item>
    </el-breadcrumb>

    <div class="left-tool">
      <div
        v-for="(item, index) in toolList"
        @click="handleTool(index)"
        :key="index"
        :class="{ active: currentTool == index }"
      >
        {{ item }}
      </div>
    </div>
    <div id="box1">
      <div class="box1-content">
        <div class="first-left">
          <div class="custom-title">说明书编辑</div>
          <editor />
        </div>
        <div class="first-right">
          <div class="custom-title">技术交底</div>
        </div>
      </div>

      <div>
        <hr style="color: grey" />
        <h4>附图标记</h4>
      </div>
    </div>
    <div id="box2">
      <div class="custom-title">摘要</div>
      <div class="custom-tips">
        要编辑摘要，请先填写好上方的内容，再点击下方的生成摘要按钮
      </div>
      <el-button type="primary">生成摘要</el-button>
    </div>
    <div id="box3">
      <div class="custom-title">附图</div>
      <div class="custom-tips">你还没有任何附图</div>
      <span class="el-icon-picture-outline addimg">添加附图</span>
    </div>

    <div class="bottom-btn">
      <el-button type="primary">提 交</el-button>
      <el-button type="success">预 览</el-button>
      <el-button type="warning">保 存</el-button>
    </div>
  </div>
</template>
<script>
import Editor from "@/components/Editor/index";

export default {
  components: { Editor },
  data() {
    return {
      toolList: ["攥写", "摘要", "附图", "预览"],
      currentTool: 0,
    };
  },
  methods: {
    handleTool(index) {
      this.currentTool = index;
      console.log("#", `#box${index}`);
      this.$el.querySelector(`#box${index + 1}`).scrollIntoView();
    },
  },
};
</script>
<style lang="scss" scoped>
.page {
  margin: 0 10px;
  .custom-title {
    font-weight: bold;
    margin-bottom: 20px;
  }
  .custom-tips {
    color: gray;
    font-size: 13px;
    margin: 10px 0 20px 0;
  }
}

#box1 {
  background: #fff;
  width: 100%;
  // min-height: 195vh;
  margin-top: 20px;
  box-shadow: -2px 2px 100px gainsboro;
  padding: 30px;
  border-radius: 8px;
  .box1-content {
    display: flex;
    flex-wrap: nowrap;
    .first-left {
      width: 70%;
    }
    .first-right {
      flex:1;
      margin-left: 20px;
      border: 1px solid red;
    }
  }
}
#box2 {
  margin-top: 20px;
  border-radius: 8px;
  background: #fff;
  box-shadow: -2px 2px 100px gainsboro;
  padding: 30px;
}
#box3 {
  margin-top: 20px;
  border-radius: 8px;
  background: #fff;
  box-shadow: -2px 2px 100px gainsboro;
  padding: 30px;
  .addimg{
    background: gainsboro;
    padding: 5px 8px;
  }
}

.left-tool { 
  cursor: pointer;
  position: fixed;
  z-index: 10000;
  left: 0;
  top: 30vh;
  background: #fff;
  box-shadow: 1px 1px 10px gainsboro;
  border-top-right-radius: 8px;
  border-bottom-right-radius: 8px;
  padding: 10px 10px;
  div {
    text-align: center;
    padding: 8px 0;
    margin: 15px 0;
    width: 40px;
  }
  .active {
    border-bottom: 3px solid #409eff;
    color: #409eff;
  }
}
.bottom-btn{
  text-align: center;
  margin: 30px 0;
}
</style>
