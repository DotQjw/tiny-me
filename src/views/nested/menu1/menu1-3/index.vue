<template >
  <div>
    <!-- <el-alert :closable="false" title="menu 1-3" type="success" /> -->
    <!-- <el-button type="primary" @click.native.prevent="onCancel">下载</el-button> -->
    <!-- <el-button @click="onCancel">Cancel</el-button> -->
    <span type="primary" @click.native.prevent="openUrl">Create</span>
    <!-- <a href="/assets/vue-admin-template.zip">go</a> -->

  </div>
</template>
<script>
export default {
  data(){
    return {}
  },
  methods:{
    openUrl(){
      console.log('1')
      location.href = '@/assets/vue-admin-template.zip'
    },
    onCancel(){
      console.log("??")
    }
  }
}
</script>
