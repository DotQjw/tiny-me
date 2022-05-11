<template>
  <el-dialog
    title="创建案件"
    :before-close="handleClose"
    center
    :visible.sync="show"
    width="480px"
  >
    <el-form :model="form">
      <el-form-item label="客户案号：">
        <el-input
          v-model="form.name"
          class="custom-input"
          autocomplete="off"
        ></el-input>
      </el-form-item>
      <el-form-item label="天元案号：">
        <el-input
          v-model="form.name"
          class="custom-input"
          autocomplete="off"
        ></el-input>
      </el-form-item>
      <el-form-item label="客户名称：">
        <el-input
          v-model="form.name"
          class="custom-input"
          autocomplete="off"
        ></el-input>
      </el-form-item>
      <el-form-item label="提案名称：">
        <el-input
          v-model="form.name"
          class="custom-input"
          autocomplete="off"
        ></el-input>
      </el-form-item>
      <el-form-item label="专利类型：">
        <el-radio v-model="form.type" label="1">发明</el-radio>
        <el-radio v-model="form.type" label="2">实用类型</el-radio>
      </el-form-item>
      <div class="more" v-if="!showMore" @click="handleMore">更多信息</div>
      <el-form-item v-if="showMore" label="协办人：">
        <el-input
          v-model="form.name"
          class="custom-input"
          autocomplete="off"
        ></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="handleClose">返 回</el-button>
      <el-button type="primary" @click="submit">确 定</el-button>
    </div>
  </el-dialog>
</template>
<script>
export default {
  props: {
    show: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      showMore: false,
      form: {
        name: "",
        region: "",
        date1: "",
        date2: "",
        delivery: false,
        type: "",
        resource: "",
        desc: "",
      },
    };
  },
  methods: {
    handleClose() {
      this.$emit("update:show", false);
      this.$router.go(-1);
    },
    handleMore() {
      this.showMore = true;
    },
    submit() {
      this.$emit("update:show", false);
    },
  },
};
</script>
<style lang="scss" scoped>
.custom-input {
  width: 300px;
}
.more {
  text-align: center;
  cursor: pointer;
}
</style>
