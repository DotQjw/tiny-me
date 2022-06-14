<template>
  <el-dialog
    :title="title"
    :before-close="handleClose"
    center
    :visible.sync="show"
    :close-on-click-modal="false"
    width="480px"
  >
    <el-form
      :model="form"
      ref="form"
      class="form"
      label-width="0"
      :rules="formRule"
    >
      <div class="custom-label">账号</div>
      <el-form-item prop="username">
        <el-input
          disabled
          v-model="form.username"
          class="custom-input"
          autocomplete="off"
        ></el-input>
      </el-form-item>
      <div class="custom-label">密码</div>
      <el-form-item prop="password">
        <el-input
          v-model="form.password"
          class="custom-input"
          autocomplete="off"
        ></el-input>
      </el-form-item>
    </el-form>
    <div class="dialog-footer">
      <el-button @click="handleClose">返 回</el-button>
      <el-button type="primary" @click="submit">确 定</el-button>
    </div>
  </el-dialog>
</template>
<script>
import { changePassword } from "@/api/table";

export default {
  props: {
    show: {
      type: Boolean,
      default: false,
    },
    pswData: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      title: "新增账号",
      showMore: false,
      isEdit: false,
      formRule: {
        password: [
          {
            required: true,
            validator(a, value, cb) {
              if (!value || value.length < 5) cb(new Error("密码长度至少为5"));
              cb();
            },
            trigger: "blur",
          },
        ],
        username: [{ required: true, message: "请输入姓名", change: "blur" }],
      },
      form: this.pswData,
    };
  },
  created() {
    if (this.curId) {
      this.title = "编辑账号";
    }
  },
  methods: {
    handleClose() {
      this.$emit("update:show", false);
    },
    handleMore() {
      this.showMore = true;
    },
    submit() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          changePassword(this.form).then((res) => {
            this.$message.success("密码修改成功");
            this.$parent.fetchData();
            this.handleClose();
          });
        }
      });
    },
    changePassword() {
      const param = Object.assign({}, this.form, { role: +this.form.role });
      console.log("param", param);
      userEdit(param)
        .then((res) => {
          if (res.code === 0) {
            this.$message.success("编辑成功");
            this.$parent.fetchData();
            this.$emit("update:show", false);
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
      const param = Object.assign({}, this.form, { role: +this.form.role });
      console.log("param", param);
      userCreate(param)
        .then((res) => {
          if (res.code === 0) {
            this.$message.success("新建成功");
            this.$parent.fetchData();
            this.$emit("update:show", false);
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
<style lang="scss">
.el-dialog--center .el-dialog__body {
  padding: 0;
}
</style>
<style lang="scss" scoped>
.custom-label {
  font-family: "Nunito Sans";
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 21px;
  color: #1d2129;
  margin-bottom: 10px;
}
.custom-input {
  width: 300px;
}
.more {
  text-align: center;
  cursor: pointer;
}
.dialog-footer {
  padding: 10px;
  border-top: 1px solid #e5e6e8;
  text-align: right;
}
.form {
  padding: 25px 25px;
}
</style>
