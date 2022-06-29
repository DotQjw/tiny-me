<template>
  <div>
    <div class="custom-navbar"><span @click="gotoList">首页</span> / {{formData.proposalName || '-'}}</div>
    <div class="steps-box">
      <!-- <el-steps :active.sync="active" finish-status="success" align-center>
        <el-step title="技术领域" @click.native="changeSteps(0)"></el-step>
        <el-step title="背景技术" @click.native="changeSteps(1)"></el-step>
        <el-step title="方案描述 " @click.native="changeSteps(2)"></el-step>
        <el-step title="实现方案" @click.native="changeSteps(3)"></el-step>
        <el-step title="权利要求" @click.native="changeSteps(4)"></el-step>
      </el-steps> -->
    </div>
    <custom-step
    style="margin-bottom:40px;padding-top:20px;"
      :active="active"
      @changeSteps="changeSteps"
      :steps.sync="steps"
    ></custom-step>
    <first
      v-if="active === 1"
      @saveData="saveData"
      :id="formData.id"
      :techArea="formData.techArea"
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
    <five
      v-if="active === 5"
      @saveData="saveData"
      :claimData="formData.claim"
    />
  </div>
</template>
<script>
import first from "./components/first.vue";
import second from "./components/second.vue";
import third from "./components/third.vue";
import four from "./components/four.vue";
import five from "./components/five.vue";
import customStep from "./components/customStep.vue";
import {
  patentDetail,
  implementPlan,
  techArea,
  saveTechbg,
  planOutline,
  saveClaim,
} from "@/api/table";
export default {
  components: { first, second, third, four, five, customStep },
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
    };
  },
  created() {
    this.type = this.$route.query.type;
    this.formData.id = this.$route.query.id;
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
</style>
