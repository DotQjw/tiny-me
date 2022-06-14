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
      <div class="custom-label">请先你选择你要添加的账号类型</div>
      <el-form-item prop="role">
        <el-radio v-model="form.role" label="1">主办人</el-radio>
        <el-radio v-model="form.role" label="2">协办人</el-radio>
      </el-form-item>
      <template v-if="form.role">
        <div class="custom-label">请输入账号</div>
        <el-form-item prop="phoneNo">
          <el-input
            v-model="form.phoneNo"
            class="custom-input"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <template v-if="!isEdit">
          <div class="custom-label">密码</div>
          <el-form-item prop="password">
            <el-input
              v-model="form.password"
              class="custom-input"
              autocomplete="off"
            ></el-input>
          </el-form-item>
        </template>
        <template v-if="form.role == '1'">
          <div class="custom-label">主办人姓名</div>
          <el-form-item label="" prop="username">
            <el-input
              v-model="form.username"
              class="custom-input"
              autocomplete="off"
            ></el-input>
          </el-form-item>
        </template>
        <template v-if="form.role == '2'">
          <div class="custom-label">协办办人姓名</div>
          <el-form-item label="" prop="username">
            <el-input
              v-model="form.username"
              class="custom-input"
              autocomplete="off"
            ></el-input>
          </el-form-item>
          <div class="custom-label">协办人证件号码</div>
          <el-form-item prop="idCard">
            <el-input
              v-model="form.idCard"
              class="custom-input"
              autocomplete="off"
            ></el-input>
          </el-form-item>
        </template>
      </template>
    </el-form>
    <div class="dialog-footer">
      <el-button @click="handleClose">返 回</el-button>
      <el-button type="primary" @click="submit">确 定</el-button>
    </div>
  </el-dialog>
</template>
<script>
import { userCreate, userEdit } from "@/api/table";

export default {
  props: {
    show: {
      type: Boolean,
      default: false,
    },
    curData: {
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
        role: [{ required: true, message: "请选择类型", change: "change" }],
        phoneNo: [
          {
            required: true,
            validator(a, value, cb) {
              const regex = /^1[3456789]\d{9}$/; //使用此正则即可
              if (!regex.test(value)) cb(new Error("请输入正确手机格式"));

              cb();
            },
            trigger: "blur",
          },
        ],
        password: [
          {
            required: true,
            validator(a, value, cb) {
              if (!value||value.length < 5) cb(new Error("密码长度至少为5"));
              cb();
            },
            trigger: "blur",
          },
        ],
        username: [{ required: true, message: "请输入姓名", trigger: "blur" }],
        idCard: [
          {
            required: true,
            validator(a, value, cb) {
              const regex = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/; //使用此正则即可
              if (!regex.test(value)) cb(new Error("请输入证件号码"));

              cb();
            },
            trigger: "blur",
          },
        ],
      },
      form: this.curData,
    };
  },
  created() {
    console.log("????", this.curData);
    if (Object.keys(this.curData).length) {
      this.title = "编辑账号";
      this.isEdit = true;
      this.form = Object.assign({}, this.curData, {
        role: this.curData.role + "",
      });
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
          if (this.form.id) {
            this.edit();
          } else {
            this.create();
          }
        }
      });
    },
    edit() {
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
