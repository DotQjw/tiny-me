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
    <first v-if="active === 1" :id.sync="id" :type="type" />
    <second v-if="active === 2" :id.sync="id" />
    <third v-if="active === 3" :id.sync="id" />
    <four v-if="active === 4" :id.sync="id" />
    <five v-if="active === 5" :id.sync="id" />
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


export default {
  components: { first, second, third, four, five, createCase },

  data() {
    return {
      active: 2,
      type: "add",
      id: "",
      showDilag: false,
    };
  },
  created() {
    console.log("in", this.$route);
    this.type = this.$route.query.type;
    this.id = this.$route.query.id;
    if(this.id){
      console.log('获取数据')
    }
  },
  methods: {
    handleSteps(index) {
      console.log("Okok", index);
      // if(index >= this.active) return
      this.active = index;
    },
    updateId(id) {
      console.log('ID',id)
      this.id = id;
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
