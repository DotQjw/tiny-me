<template>
  <el-dialog
    :title="title"
    :before-close="handleClose"
    center
    :visible.sync="show"
    :close-on-click-modal="false"
    width="480px"
  >
    <div class="tips" v-if="showTip">
      创建案件后你可以点击对应项目名称开始项目撰写流程
      <i class="el-icon-close close" @click="closeTips"></i>
    </div>
    <el-form
      :model="form"
      ref="form"
      label-width="100px"
      class="custom-form"
      :rules="formRule"
    >
      <el-form-item label="客户案号：">
        <el-input
          v-model="form.caseNo"
          class="custom-input"
          autocomplete="off"
        ></el-input>
      </el-form-item>
      <el-form-item label="天元案号：" prop="tianyuan">
        <el-input
          v-model="form.tianyuan"
          class="custom-input"
          autocomplete="off"
        ></el-input>
      </el-form-item>
      <el-form-item label="客户名称：" prop="clientName">
        <el-input
          v-model="form.clientName"
          class="custom-input"
          autocomplete="off"
        ></el-input>
      </el-form-item>
      <el-form-item label="提案名称：" prop="proposalName">
        <el-input
          v-model="form.proposalName"
          class="custom-input"
          autocomplete="off"
        ></el-input>
      </el-form-item>
      <el-form-item label="专利类型：" prop="type">
        <el-radio v-model="form.type" :label="1">发明</el-radio>
        <el-radio v-model="form.type" :label="2">实用新型</el-radio>
      </el-form-item>
      <div class="more" v-if="!showMore" @click="handleMore">更多信息</div>
      <el-form-item v-if="showMore" label="协办人：">
        <el-autocomplete
          class="custom-input"
          v-model="form.assistUserName"
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
    <div class="dialog-footer">
      <el-button @click="handleClose">返 回</el-button>
      <el-button type="primary" @click="submit">确 定</el-button>
    </div>
  </el-dialog>
</template>
<script>
import { createCase, userSearch, editCase } from "@/api/table";

export default {
  props: {
    show: {
      type: Boolean,
      default: false,
    },
    createData: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      showTip: false,
      title: this.createData.id ? "编辑案件" : "创建案件",
      showMore: false,
      form: this.createData,
      formRule: {
        caseNo: [{ required: true, message: "请输入客户案号", change: "blur" }],
        tianyuan: [
          { required: true, message: "请输入天元案号", change: "blur" },
        ],
        clientName: [
          { required: true, message: "请输入客户名称", change: "blur" },
        ],
        proposalName: [
          { required: true, message: "请输入提案名称", change: "blur" },
        ],
        type: [
          {
            required: true,
            validator(f, v, c) {
              if (v) {
                c();
              } else {
                c(new Error("请选择专利类型"));
              }
            },
            change: "change",
          },
        ],
      },
      // form: {
      //   caseNo: "",
      //   tianyuan: "",
      //   clientName: "",
      //   proposalName: "",
      //   type: "",
      //   assistUserId: "",
      //   assistUserName:""
      // },
    };
  },
  created() {
    this.showTip = this.createData.id ? false : true;
  },
  methods: {
    closeTips() {
      this.showTip = false;
    },
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
      this.form.assistUserName = item.username;
    },
    handleClose() {
      this.$emit("update:show", false);
      console.log("this.form", this.form);
      // if (!this.form.id) {
      //   this.$router.go(-1);
      // }
    },
    handleMore() {
      this.showMore = true;
    },
    submit() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          if (this.form.id) {
            this.edit();
          } else {
            this.create();
          }
        }
      });
    },
    edit() {
      editCase(this.form)
        .then((res) => {
          if (res.code === 0) {
            // this.$message.success("编辑成功");
            this.$emit("update:show", false);
            // this.$router.push({ path: "/data-edit", query: { id: this.form.id }});
          } else {
            this.$message.error("服务器有点忙，请重试");
          }
        })
        .catch((err) => {
          console.log("err", err);
          this.$message.error(err.message);
        });
    },
    create() {
      createCase(this.form)
        .then((res) => {
          if (res.code === 0) {
            this.$message.success("新建成功");
            // this.$emit("updateId", res.data.id);
            this.$emit("update:show", false);
            this.$router.push({
              path: "/data-edit",
              query: { id: res.data.id },
            });
          } else {
            this.$message.error("服务器有点忙，请重试");
          }
        })
        .catch((err) => {
          console.log("err", err);
          this.$message.error(err.message);
        });
    },
  },
};
</script>
<style lang="scss" scoped>
::v-deep .el-dialog__body {
  padding: 0;
}
::v-deep .el-dialog {
  border-radius: 4px;
}

.custom-form {
  padding: 0 30px;
  margin-top: 20px;
}
.custom-input {
  width: 300px;
}
.more {
  text-align: center;
  cursor: pointer;
}
.dialog-footer {
  border-top: 1px solid #e5e6e8;
  margin-top: 18px;
  text-align: right;
  padding: 16px 20px 16px 0;
}
.tips {
  background: #e8f3ff;
  padding: 9px 20px;
  color: #165dff;
}
.close {
  float: right;
  cursor: pointer;
}
</style>
