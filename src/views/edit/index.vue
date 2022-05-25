<template>
  <div>
    <div class="custom-navbar">首页/xxxxxx</div>
    <div class="steps-box">
      <el-steps :active="active" finish-status="success" align-center>
        <el-step title="技术领域" @click.native="handleSteps(1)"></el-step>
        <el-step title="背景技术" @click.native="handleSteps(2)"></el-step>
        <el-step title="方案描述 " @click.native="handleSteps(3)"></el-step>
        <el-step title="实现方案" @click.native="handleSteps(4)"></el-step>
        <el-step title="权利要求" @click.native="handleSteps(5)"></el-step>
      </el-steps>
    </div>
    <first
      v-if="active === 1"
      @saveData="saveData"
      :id="formData.id"
      :techArea.sync="formData.techArea"
      :type="type"
    />
    <second
      v-if="active === 2"
      @saveData="saveData"
      :secondStepsData="secondStepsData"
      :id="formData.id"
    />
    <third
      v-if="active === 3"
      @saveData="saveData"
      :idea="formData.idea"
      :id="formData.id"
    />
    <four
      v-if="active === 4"
      @saveData="saveData"
      :fixDefectMethod="formData.fixDefectMethod"
      :id="formData.id"
    />
    <five v-if="active === 5" @saveData="saveData" :claims="formData.claims" />
    <create-case v-if="showDilag" @updateId="updateId" :show.sync="showDilag" />
  </div>
</template>
<script>
import first from "./components/first.vue";
import second from "./components/second.vue";
import third from "./components/third.vue";
import four from "./components/four.vue";
import five from "./components/five.vue";
import createCase from "./components/createCase";
import {
  patentDetail,
  implementPlan,
  techArea,
  saveTechbg,
  planOutline,
} from "@/api/table";

export default {
  components: { first, second, third, four, five, createCase },

  data() {
    return {
      active: null,
      type: "add",
      id: "",
      showDilag: false,
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
        claims: [
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
    };
  },
  created() {
    console.log("in", this.$route);
    this.type = this.$route.query.type;
    this.formData.id = this.$route.query.id;
    if (this.formData.id) {
      console.log("获取数据");
      this.getDetail();
    } else {
      this.showDilag = true;
    }
  },
  methods: {
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
    getDetail() {
      patentDetail({ id: this.formData.id }).then((res) => {
        console.log("res", res);
        let data = (this.formData = res.data);
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
        console.log("THIS", this.formData, this.formData.fixDefectMethod);
      });
    },
    handleSteps(index) {
      // if(index >= this.active) return
      this.active = index;
    },
    updateId(id) {
      this.secondStepsData.id = this.formData.id = id;
      this.active = 1;
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
  font-size: 12px;
  color: gray;
  margin-bottom: 20px;
}
</style>
