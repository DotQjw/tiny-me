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
          v-model="form.caseNo"
          class="custom-input"
          autocomplete="off"
        ></el-input>
      </el-form-item>
      <el-form-item label="天元案号：">
        <el-input
          v-model="form.tianyuan"
          class="custom-input"
          autocomplete="off"
        ></el-input>
      </el-form-item>
      <el-form-item label="客户名称：">
        <el-input
          v-model="form.clientName"
          class="custom-input"
          autocomplete="off"
        ></el-input>
      </el-form-item>
      <el-form-item label="提案名称：">
        <el-input
          v-model="form.proposalName"
          class="custom-input"
          autocomplete="off"
        ></el-input>
      </el-form-item>
      <el-form-item label="专利类型：">
        <el-radio v-model="form.type" :label="1">发明</el-radio>
        <el-radio v-model="form.type" :label="2">实用类型</el-radio>
      </el-form-item>
      <div class="more" v-if="!showMore" @click="handleMore">更多信息</div>
      <el-form-item v-if="showMore" label="协办人：">
        <el-autocomplete
          class="custom-input"
          v-model="form.userName"
          :fetch-suggestions="querySearch"
          placeholder="请输入内容"
          :trigger-on-focus="false"
          @select="handleSelect"
        >
          <template slot-scope="{ item }">
            <div>{{ item.username }}</div>
          </template>
        </el-autocomplete>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="handleClose">返 回</el-button>
      <el-button type="primary" @click="submit">确 定</el-button>
    </div>
  </el-dialog>
</template>
<script>
import { createCase, userSearch } from "@/api/table";

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
        caseNo: "",
        tianyuan: "",
        clientName: "",
        proposalName: "",
        type: "",
        assistUserId: "",
        userName:""
      },
    };
  },
  methods: {
    querySearch(queryString, cb) {
      if (queryString.length === 11) {
        userSearch({
          phoneNo: queryString,
          role: 2,
        }).then((res) => {
          console.log("...res", res);
          cb(res.data);
        });
      } else {
        cb([]);
      }
      console.log("queryString", queryString);
      // var restaurants = this.restaurants;
      // var results = queryString
      //   ? restaurants.filter(this.createFilter(queryString))
      //   : restaurants;
      // 调用 callback 返回建议列表的数据
      // cb(results);
    },
    handleSelect(item) {
      console.log(item);
      this.form.assistUserId = item.id;
      this.form.userName = item.username
    },
    handleClose() {
      this.$emit("update:show", false);
      this.$router.go(-1);
    },
    handleMore() {
      this.showMore = true;
    },
    submit() {
      createCase(this.form).then((res) => {
        if (res.code === 0) {
          this.$message.success("新建成功");
          this.$emit("updateId", res.data.id);
          this.$emit("update:show", false);
        } else {
          this.$message.error("服务器有点忙，请重试");
        }
      });
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
