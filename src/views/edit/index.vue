<template>
  <div>
    <div class="custom-navbar">首页/xxxxxx</div>
    <div class="steps-box">
      <el-steps :active="active" finish-status="success" align-center>
        <el-step title="技术领域"  @click.native="handleSteps(1)"></el-step>
        <el-step title="背景技术"   @click.native="handleSteps(2)"></el-step>
        <el-step title="方案描述 "  @click.native="handleSteps(3)"></el-step>
        <el-step title="实现方案"   @click.native="handleSteps(4)"></el-step>
        <el-step title="权利要求"   @click.native="handleSteps(5)"></el-step>
      </el-steps>
    </div>
    <first  v-if="active===1" :type="type" />
    <second v-if="active===2" />
    <third  v-if="active===3" />
    <four   v-if="active===4" />
    <five   v-if="active===5" />
  </div>
</template>
<script>
import first from "./components/first.vue"
import second from "./components/second.vue"
import third from "./components/third.vue"
import four from "./components/four.vue"
import five from "./components/five.vue"

export default {
  components:{first,second,third,four,five},
  data() {
    return {
        active:2,
        type:'add'
    };
  },
  created(){
    console.log('in',this.$route)
    this.type = this.$route.query.type
  },
  methods:{
      handleSteps(index){
          console.log('Okok',index)
          // if(index >= this.active) return
          this.active = index;
      }
  }
};
</script>
<style lang="scss" scoped>
    .steps-box{
        text-align: center;
        margin: 0 auto 20px;
    }
    .custom-navbar{
        font-size: 12px;
        color: gray;
        margin-bottom: 20px;
    }
</style>
