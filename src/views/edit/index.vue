<template>
  <div class="edit-page">
    <!-- <div class="custom-navbar"><span @click="gotoList">首页</span> / {{formData.proposalName || '-'}}</div> -->
    <!-- <div class="steps-box"> -->
      <!-- <el-steps :active.sync="active" finish-status="success" align-center>
        <el-step title="技术领域" @click.native="changeSteps(0)"></el-step>
        <el-step title="背景技术" @click.native="changeSteps(1)"></el-step>
        <el-step title="方案描述 " @click.native="changeSteps(2)"></el-step>
        <el-step title="实现方案" @click.native="changeSteps(3)"></el-step>
        <el-step title="权利要求" @click.native="changeSteps(4)"></el-step>
      </el-steps> -->
    <!-- </div> -->
    <!-- <custom-step
    style="margin-bottom:40px;padding-top:20px;"
      :active="active"
      @changeSteps="changeSteps"
      :steps.sync="steps"
    ></custom-step> -->
    <el-row class="edit-header">
      <el-col :span="3" class="header-title">
        <div @click="gotoList" class="icon_back"><i class="el-icon-arrow-left"></i>返回</div>
        <div class="title-name" :title="proposalName">{{proposalName}}</div>
      </el-col>
      <el-col :span="18">
        <el-tabs class="custom-table" v-model="activeName">
          <el-tab-pane label="技术方案" name="first">
          </el-tab-pane>
          <el-tab-pane label="权利要求" name="second">
          </el-tab-pane>
        </el-tabs>
      </el-col>
      <el-col :span="3" class="add-single" v-show="activeName === 'second'">
        <el-button type="primary" icon="el-icon-plus" @click="handleSingle"
        >添加独权</el-button
      >
      </el-col>
    </el-row>
    <div class="custom-content">
      <div class="left-tool" v-show="activeName === 'first'">
        <div
          v-for="(item, index) in toolList"
          @click="handleTool(index)"
          :key="index"
          :class="{ active: currentTool == index }"
        >
          {{ item }}
        </div>
      </div>
      <div class="table-content" v-if="isShow">
        <div v-show="activeName ==='first'">
          <div id="box1">
            <first
              @saveData="saveData"
              :id="formData.id"
              :techArea="formData.techArea"
              :type="type"
            />
          </div>
          <div id="box2">
            <second
              @saveData="saveData"
              :secondStepsData="secondStepsData"
              :id="formData.id"
            />
          </div>
          <div id="box3">
            <third
              @saveData="saveData"
              :idea="formData.idea"
              :id="formData.id"
            />
          </div>
          <div id="box4">
            <four
              @saveData="saveData"
              :fixDefectMethod="formData.fixDefectMethod"
              :id="formData.id"
            />
          </div>
        </div>
        <div v-show="activeName === 'second'">
          <five
            @saveData="saveData"
            :claimData="formData.claim"
            ref="five"
          />
        </div>
      </div>
    </div>
    <div class="bottom">
      <el-button type="primary" @click="saveStep('submit')" v-show="activeName === 'second'">提交</el-button>
      <el-button type="primary" @click="saveStep('next')" v-show="activeName === 'first'">下一步</el-button>
      <el-button @click="saveStep('last')" v-show="activeName === 'second'">上一步</el-button>
      <el-button @click="saveStep('save')">保 存</el-button>
    </div>
  </div>
</template>
<script>
import first from "./components/first.vue";
import second from "./components/second.vue";
import third from "./components/third.vue";
import four from "./components/four.vue";
import five from "./components/five.vue";
import customStep from "./components/customStep.vue";
import uploadFile from "./components/uploadFile";
import record from "./components/record";
import fileList from "./components/fileList";
import {
  patentDetail,
  implementPlan,
  techArea,
  saveTechbg,
  planOutline,
  saveClaim,
} from "@/api/table";
export default {
  components: { first, second, third, four, five, customStep, uploadFile, record, fileList },
  watch: {
    formData: {
      handler(n, o) {
        console.log("formData", n, o);
        // console.log('n.techArea',n.techArea)
        if (n.techArea) {
          console.log("步骤一");
          this.steps.content1 = true;
        } else {
          this.steps.content1 = false;
        }
        const domain = n.domain;
        const painPoint = n.painPoint;
        const currentSolution = n.currentSolution;
        const pendingDefect = n.pendingDefect;
        const idea = n.idea;
        const fixDefectMethod = n.fixDefectMethod;
        if (
          domain.text ||
          domain.attachments.length ||
          domain.recordFiles.length ||
          painPoint.text ||
          painPoint.attachments.length ||
          painPoint.recordFiles.length ||
          currentSolution.text ||
          currentSolution.attachments.length ||
          currentSolution.recordFiles.length ||
          pendingDefect.text ||
          pendingDefect.attachments.length ||
          pendingDefect.recordFiles.length
        ) {
          console.log("contetn2 ok");
          this.steps.content2 = true;
        } else {
          console.log("contetn2");
          this.steps.content2 = false;
        }
        if (idea.text || idea.attachments.length || idea.recordFiles.length) {
          this.steps.content3 = true;
        } else {
          this.steps.content3 = false;
        }
        if (
          fixDefectMethod.text ||
          fixDefectMethod.attachments.length ||
          fixDefectMethod.attachments.length
        ) {
          this.steps.content4 = true;
        } else {
          this.steps.content4 = false;
        }
        if (n.claim[0]) {
          this.steps.content5 = true;
        } else {
          this.steps.content5 = false;
        }
      },
      immediate: true,
      deep: true,
    },
  },
  data() {
    return {
      steps: {
        content1: false,
        content2: false,
        content3: false,
        content4: false,
        content5: false,
      },
      active: 0,
      activeName: 'first',
      type: "add",
      id: "",
      secondStepsData: {
        id: "",
        domain: {
          text: "",
          attachments: [],
          recordFiles: [],
        },
        painPoint: {
          text: "",
          attachments: [],
          recordFiles: [],
        },
        currentSolution: {
          text: "",
          attachments: [],
          recordFiles: [],
        },
        pendingDefect: {
          text: "",
          attachments: [],
          recordFiles: [],
        },
        claim: [
          {
            no: null,
            parentNo: null,
            name: "",
            claimContent: {
              kernel: "",
              check: {},
              note: "",
              attachment: {},
            },
          },
        ],
      },
      formData: {
        id: "",
        claim: [],
        techArea: "",
        idea: {
          text: "",
          recordFiles: [],
          attachments: [],
        },
        domain: {
          text: "",
          attachments: [],
          recordFiles: [],
        },
        painPoint: {
          text: "",
          attachments: [],
          recordFiles: [],
        },
        currentSolution: {
          text: "",
          attachments: [],
          recordFiles: [],
        },
        pendingDefect: {
          text: "",
          attachments: [],
          recordFiles: [],
        },
        fixDefectMethod: {
          text: "",
          recordFiles: [],
          attachments: [],
        },
      },
      isShow: false,
      proposalName: '',
      currentTool: 0,
      toolList: ["技术领域", "背景技术", "方案概述", "实现方案"],
    };
  },
  created() {
    this.type = this.$route.query.type;
    this.formData.id = this.$route.query.id;
    this.proposalName = this.$route.query.proposalName
    if (this.formData.id) {
      console.log("获取数据");
      this.getDetail();
    }
  },
  methods: {
    getDetail() {
      patentDetail({ id: this.formData.id }).then((res) => {
        console.log("res", res);
        let data = (this.formData = res.data);
        console.log('formData^^^^^',this.formData.techArea)
        this.secondStepsData = Object.assign(this.secondStepsData, {
          id: data.id,
          domain: data.domain,
          painPoint: data.painPoint,
          currentSolution: data.currentSolution,
          pendingDefect: data.pendingDefect,
        });
        if (!this.active) {
          this.active = 1;
        }
      }).finally(() => {
        this.isShow = true
      });
    },
    saveData(data) {
      console.log("data", data);
      switch (data.step) {
        case 1:
          this.step1Save(data.type, data.techArea);
          break;
        case 2:
          this.step2Save(data.type);
          break;
        case 3:
          this.step3Save(data.type);
          break;
        case 4:
          this.step4Save(data.type);
          break;
        case 5:
          this.step5Save(data.type, data.claims);
          break;
        default:
          break;
      }
    },
    step1Save(type, tech) {
      const params = {
        id: this.formData.id,
        techArea: tech,
      };
      console.log("this.form.area", this.formData);
      techArea(params).then((res) => {
        console.log("第一步保存成功");
        this.formData.techArea = tech;
        if (type === "save") {
          this.$message.success("保存成功");
        } else if (type === "next") {
          this.active += 1;
        } else if (type === "last") {
          this.active -= 1;
        }
      });
    },
    step2Save(type) {
      saveTechbg(this.secondStepsData).then((res) => {
        console.log("第二步保存成功");
        if (type === "save") {
          this.$message.success("保存成功");
        } else if (type === "next") {
          this.active += 1;
        } else if (type === "last") {
          this.active -= 1;
        }
      });
    },
    step3Save(type) {
      const params = {
        id: this.formData.id,
        idea: this.formData.idea,
      };
      planOutline(params).then((res) => {
        console.log("第三步保存成功");
        if (type === "save") {
          this.$message.success("保存成功");
        } else if (type === "next") {
          this.active += 1;
        } else if (type === "last") {
          this.active -= 1;
        }
      });
    },
    step4Save(type) {
      const params = {
        id: this.formData.id,
        fixDefectMethod: this.formData.fixDefectMethod,
      };
      implementPlan(params).then((res) => {
        console.log("第四步保存成功");
        if (type === "save") {
          this.$message.success("保存成功");
        } else if (type === "next") {
          this.active += 1;
        } else if (type === "last") {
          this.active -= 1;
        }
      });
    },
    step5Save(type, data) {
      console.log("data", data);
      const params = {
        id: this.formData.id,
        claims: data,
      };
      saveClaim(params).then((res) => {
        console.log("第五步保存成功");
        if (type === "save") {
          this.$message.success("保存成功");
          this.getDetail();
        } else if (type === 'autoSave'){
          this.getDetail();
        }else if (type === "next") {
          this.active += 1;
        } else if (type === "last") {
          this.active -= 1;
        } else if (type === "submit") {
          this.$message.success("提交成功");
          this.$router.push({ path: "/data-list" });
        }
      });
    },
    saveStep(type) {
        if (type === "save") {
          this.$message.success("保存成功");
        } else if (type === "next") {
          this.activeName = 'second'
        } else if (type === "last") {
          this.activeName = 'first'
        } else if (type === "submit") {
          this.$message.success("提交成功");
          this.$router.push({ path: "/data-list" });
        }
    },
    changeSteps(index) {
      console.log("index", index);
      // if (index >= this.active) return;
      this.active = index;
    },
    updateId(id) {
      this.secondStepsData.id = this.formData.id = id;
      this.active = 1;
    },
    gotoList() {
      this.$router.push({ path: "/data-list" });
    },
    // 新增
    inputChange() {
      if (this.timer) {
        clearTimeout(this.timer);
      }
      this.timer = setTimeout(() => {
        this.saveData("autoSave");
      }, 1000);
    },
    handleSingle () {
      this.$refs.five.handleSingle()
    },
    handleTool(index) {
      this.currentTool = index;
      this.$el.querySelector(`#box${index + 1}`).scrollIntoView();
    },
  },
};
</script>
<style lang="scss">
.left-tool {
  cursor: pointer;
  position: fixed;
  z-index: 1888;
  left: 0;
  top: 30vh;
  background: #fff;
  box-shadow: 1px 1px 10px gainsboro;
  border-top-right-radius: 8px;
  border-bottom-right-radius: 8px;
  padding: 16px 16px;
  div {
    text-align: center;
    padding: 8px 0;
    margin: 15px 0;
    width: 80px;
    font-size: 16px;
    line-height: 24px;
  }
  .active {
    background: rgba(106, 161, 255, 0.1);
    color: #165DFF;
  }
}
.edit-page {
  position: relative;
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
  .step2 {
    .custom-input {
      textarea {
        height: 210px !important;
      }
    }
  }
  .edit-header {
    background: #fff;
    margin-bottom: 15px;
    height: 80px;
    .header-title {
      padding: 15px 0 20px 33px;
      .icon_back {
        cursor: pointer;
        width: 60px;
        &:hover {
          color: #165DFF;
        }
      }
      .title-name {
        padding: 8px;
        font-family: 'PingFang SC';
        font-style: normal;
        font-weight: 500;
        font-size: 24px;
        color: #1D2129;
        width: 418px;
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
      }
    }
    .custom-table {
      .el-tabs__header {
        margin: 0;
        .el-tabs__nav-wrap {
          .el-tabs__nav-scroll {
            display: flex;
            justify-content: center;
            box-sizing: border-box;
            padding-top: 20px;
            height: 80px;
            .el-tabs__nav {
              .el-tabs__item {
                font-size: 16px;
                color: #4E5969;
                font-family: 'PingFang SC';
                font-style: normal;
                font-weight: 500;
              }
              .is-active {
                color: #0E42D2;
              }
              .el-tabs__active-bar {
                background-color: #0E42D2;
              }
            }
          }
          &:after{
            background-color: #fff;
          }
        }
      }
    }
    .add-single {
      padding: 25px 30px;
      text-align: right;
    }
  }
  .custom-content {
    height: calc(100vh - 230px);
    overflow-y: scroll;
    width: 100%;
    .table-content {
      width: 90%;
      min-width: 900px;
      margin: 0 auto;
    }
  }
  .bottom {
    width: 100%;
    height: 68px;
    display: flex;
    align-items: center;
    justify-content: center;
    // position: absolute;
    // bottom: 0;
    // z-index: 2;
    border-top: 1px solid rgba(0, 0, 0, 0.08);
    background: #fff;
  }
}
</style>
