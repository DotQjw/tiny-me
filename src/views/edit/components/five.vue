<template>
  <div class="page">
    <div class="page-top">
      <div>权利要求书</div>
      <el-button type="primary" icon="el-icon-plus" @click="handleSingle"
        >添加独权</el-button
      >
    </div>
    <div class="page-main no-border-input">
      <div class="box">
        <el-table :data="claims" style="width: 100%; margin-top: 20px">
          <el-table-column prop="realIndex" label="序号" width="100">
          </el-table-column>
          <el-table-column prop="name" label="权利名称" width="280">
            <template slot-scope="scope">
              <div>
                <el-input
                  v-if="
                    scope.row.no === scope.row.parentNo &&
                    scope.row.no === scope.row.ancestorNo
                  "
                  @input="nameInputChange($event, scope.row)"
                  type="textarea"
                  rows="1"
                  v-model="scope.row.name"
                ></el-input>
                <div v-else>
                  <span>根据权利要求</span>
                  <el-input
                    @input="nameInputChange($event, scope.row)"
                    v-model.number="scope.row.name"
                    class="child-input"
                  ></el-input>
                </div>
                <el-button
                  icon="el-icon-plus"
                  style="margin-top: 10px"
                  @click="handleChild(scope.row, scope.$index)"
                  >添加从权</el-button
                >
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="kernel" label="内核">
            <template slot-scope="scope">
              <span>
                <div
                  v-for="(item, index) in scope.row.claimContent"
                  :key="index"
                >
                  <el-input
                    @input="inputChange"
                    type="textarea"
                    rows="1"
                    v-model="item.kernel"
                  ></el-input>
                </div>
                <el-button
                  icon="el-icon-plus"
                  @click="handleInner(scope.row, scope.$index, treeData)"
                >
                  添加内核
                </el-button>
              </span>
            </template>
          </el-table-column>
          <el-table-column prop="" label="校核" width="270px">
            <template slot-scope="scope">
              <div class="check-row-box">
                <div
                  v-for="(item, index) in scope.row.claimContent"
                  class="check-row"
                  :key="index"
                >
                  <el-checkbox v-model="item.check.necessaryStep"
                    >必经</el-checkbox
                  >
                  <el-checkbox v-model="item.check.visible">可视</el-checkbox>
                  <el-checkbox v-model="item.check.logic">逻辑</el-checkbox>
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="note" label="备注">
            <template slot-scope="scope">
              <div class="note-row">
                <div
                  v-for="(item, index) in scope.row.claimContent"
                  :key="index"
                >
                  <el-input
                    @input="inputChange"
                    v-model="item.note"
                    type="textarea"
                    rows="1"
                  ></el-input>
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="" label="有益效果">
            <template slot-scope="scope">
              <span>
                <el-upload
                  :headers="{
                    Authorization: `Bearer ${token}`,
                  }"
                  :show-file-list="false"
                  action="http://8.129.8.125:8080/api/v1/file/upload_file"
                  :on-success="handleSuccess"
                  :before-upload="(file) => beforeUpload(file, scope.row)"
                >
                  <el-button size="small" type="primary">点击上传</el-button>
                </el-upload>

                <el-input
                  type="textarea"
                  rows="1"
                   @input="inputChange"
                  v-model="scope.row.goodEffect"
                ></el-input>
                <div v-if="scope.row.attachments" style="margin-top: 10px">
                  <span
                    v-for="(item, index) in scope.row.attachments"
                    :key="index"
                  >
                    <div>
                      {{ item.name }}
                    </div>
                  </span>
                </div>
              </span>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <div class="bottom">
      <el-button type="primary" @click="saveData('submit')">提 交</el-button>
      <el-button type="success" @click="saveData('last')">上一步</el-button>
      <el-button @click="saveData('save')">保 存</el-button>
    </div>
  </div>
</template>
<script>
import { cloneDeep } from "lodash";
import { getToken } from "@/utils/auth";
import { uploadFile } from "@/api/upload";

export default {
  props: {
    claimData: {
      type: Array,
      default: () => [],
    },
  },
  watch: {
    realIndex(n) {
      console.log("realIndex,", n);
    },
    treeData(n) {
      console.log("treeData change", n);
    },
  },
  data() {
    return {
      token: this.$store.getters.toke || getToken(),
      realIndex: 1,
      ancestorName: null,
      treeData: [],
      claims: [],
      template: {
        realIndex: 1,
        no: 1,
        parentNo: 1,
        ancestorNo: 1,
        name: "独权1",
        goodEffect: "",
        claimContent: [
          {
            kernel: "", //内核
            check: {
              necessaryStep: false,
              visible: false,
              logic: false,
            },
            note: "", //备注
          },
        ],
        attachments: [],
        children: [],
      },
    };
  },
  created() {
    console.log("init", this.claimData);
    if (this.claimData.length) {
      console.log("装载一下树结构");
      this.treeData = [];
      this.realIndex = 0;
      this.handleEditData(this.claimData);
    } else {
      var template = cloneDeep(this.template);
      this.treeData.push(template);
      this.claims = [];
      this.realIndex = 0;
      this.handleArrayData(this.treeData);
    }
  },
  methods: {
    saveData(type) {
      console.log("before", this.claims);
      this.$emit("saveData", {
        type,
        step: 5,
        claims: this.claims,
      });
    },
    handleEditData(data) {
      var list = cloneDeep(data);
      list.forEach((item) => {
        console.log("okok", item);
        if (item.parentNo === item.no && item.no === item.ancestorNo) {
          // 子父孙三级相同， 说明是一个，直接push
          // if (item.no === item.ancestorNo) {
          console.log("三级相同");
          if (!item.attachments) {
            item.attachments = [];
          }
          this.treeData.push(item);
          // }
        } else {
          //抽离出来
          this.findSonData(item, this.treeData);
        }
      });
      this.claims = [];
      this.realIndex = 0;
      this.handleArrayData(this.treeData);
      console.log("【treeData】", this.treeData);
    },
    findSonData(curData, treeData) {
      treeData.forEach((child) => {
        if (curData.parentNo === child.no) {
          console.log("我找到爹了", curData.name, child.name, child);
          child.children = child.children ? child.children : [];
          if (!curData.attachments) {
            curData.attachments = [];
          }
          child.children.push(curData);
        } else if (child.children && child.children.length) {
          this.findSonData(curData, child.children);
        }
      });
    },
    handleInner(item, itemIndex, data) {
      data.forEach((child, index) => {
        if (child.no === item.no) {
          console.log("找到啦", child);
          child.claimContent.push({
            kernel: "添加的内核", //内核
            check: {
              necessaryStep: false,
              visible: false,
              logic: false,
            },
            note: "备注", //备注
          });
          console.log("add", child);
        } else if (child.children) {
          this.handleInner(item, itemIndex, child.children);
        }
      });
      console.log("treeData", this.treeData);
      this.claims = [];
      this.realIndex = 0;
      this.handleArrayData(this.treeData);
    },
    inputChange() {
      if (this.timer) {
        clearTimeout(this.timer);
      }
      this.timer = setTimeout(() => {
        this.saveData("autoSave");
      }, 1000);
      console.log("this.claims", this.claims);
    },
    nameInputChange(value, row) {
      console.log("回填数据", value, row);
      // this.treeData
      this.fillTreeData(value, row, this.treeData);
      this.inputChange();
    },
    fillTreeData(value, row, originData) {
      originData.forEach((item) => {
        if (item.no === row.no) {
          console.log("我找到了");
          item.name = value;
        } else if (item.children && item.children.length) {
          console.log("还没有找到，不过继续");
          this.fillTreeData(value, row, item.children);
        }
      });
    },
    handleArrayData(data) {
      data.map((item) => {
        this.realIndex += 1;
        if (item.no === item.parentNo && item.no === item.ancestorNo) {
          this.ancestorName = this.realIndex;
          this.claims.push(
            Object.assign({}, item, { realIndex: this.realIndex, children: [] })
          );
          console.log("【重置ancestorName】", item, this.ancestorName);
        } else {
          console.log("【我走这里】", item, this.ancestorName);
          // 子孙级的变化就是name变成了 父级的realINdex
          // 如果name有值就不变化
          let obj = {
            realIndex: this.realIndex,
            children: [],
          };
          if (!item.name) {
            obj.name = this.ancestorName + "";
          }
          this.claims.push(Object.assign({}, item, obj));
        }
        if (item.children && item.children.length > 0) {
          this.handleArrayData(item.children);
        }
      });
    },
    handleChild(item, itemIndex) {
      const obj = this.claims.find((v) => v.no === item.no);
      console.log("obj", obj);
      var template = cloneDeep(this.template);
      this.handlePushChildData(item, itemIndex, this.treeData);
    },
    handlePushChildData(item, itemIndex, data) {
      //找到这个东西
      // 这里也要递归
      var template = cloneDeep(this.template);
      data.forEach((child, index) => {
        if (child.no === item.no) {
          console.log("找到啦", child);
          child.children = child.children ? child.children : [];
          child.children.push(
            Object.assign({}, template, {
              no: this.claims.length + 1,
              parentNo: item.no,
              ancestorNo: item.ancestorNo,
              name: String(item.ancestorNo),
            })
          );
        } else if (child.children) {
          this.handlePushChildData(item, itemIndex, child.children);
        }
      });
      console.log("tree", this.treeData);
      this.claims = [];
      this.realIndex = 0;
      this.handleArrayData(this.treeData);
      console.log("claims", this.claims);
    },
    handleSingle() {
      var template = cloneDeep(this.template);
      this.treeData.push(
        Object.assign({}, template, {
          realIndex: this.claims.length + 1,
          no: this.claims.length + 1,
          parentNo: this.claims.length + 1,
          ancestorNo: this.claims.length + 1,
          name: "新独权" + (this.claims.length + 1),
        })
      );
      this.claims = [];
      this.realIndex = 0;
      this.handleArrayData(this.treeData);
    },
    dealTableData() {
      let currentNo = 1;
      this.claims.map((item, index) => {
        if (item.no && index > 0) {
          // console.log("【map No】:", item.no, currentNo);
          if (item.no < currentNo) {
            // console.log("进来了");
            currentNo = item.no;
          } else {
            // console.log("我比他大");
            currentNo = currentNo + 1;
            // console.log('currenNo',currentNo)
            item.no = currentNo;
          }
        }
      });
      // console.log("dealTableData", this.claims);
    },
    getRandom(length) {
      var randomStr =
        "1234567890abcdefghijklnmopqovwrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
      var str = "";
      for (let i = 0; i < length; i++) {
        str += randomStr[parseInt(Math.random() * 65)];
      }
      return str;
    },
    handleSuccess(response, file, fileList) {
      console.log(" this.fileData", this.fileData);
      if (response.code === 0) {
        // 两个数据都要填
        this.fileData.url = response.data.url;
        this.handFindFileFather(
          this.fileData,
          this.uploadFileRow.no,
          this.treeData
        );
        this.uploadFileRow.attachments.push(this.fileData);
        console.log("claims", this.claims, this.uploadFileRow);
      } else if (response.code === 20103) {
        this.$confirm("登录过期,请重新登录", "提示", {
          confirmButtonText: "重新登录",
          cancelButtonText: "取消",
          type: "warning",
        }).then(() => {
          this.$store.dispatch("user/resetToken").then(() => {
            location.reload();
          });
        });
      }
    },
    handFindFileFather(fileData, no, treeData) {
      treeData.map((el) => {
        if (el.no === fileData.no) {
          console.log("找到啦");
          el.attachments.push(fileData);
        } else if (el.children && el.children.length) {
          this.handFindFileFather(fileData, no, el.children);
        }
      });
      console.log("this..t", this.treeData);
    },
    beforeUpload(file, row) {
      console.log("file", file, row);
      const { size, name } = file;
      const { no } = row;
      this.fileData = { size, name };
      this.uploadFileRow = row;
    },
  },
};
</script>
<style lang="scss">
.no-border-input {
  .el-textarea__inner {
    border: 1px solid #fff !important;
    margin: 10px 0;
    padding:5px 2px;
  }
  .el-textarea__inner:focus {
    border: 1px solid #67c23a !important;
  }
  .el-table tbody tr:hover > td {
    background-color: #fff !important;
  }
  .el-table td,
  .el-table th.is-leaf {
    // border-bottom:20px solid gray;
  }
  .child-input {
    max-width: 50px;
    .el-input__inner {
      padding: 0 3px;
      border: 1px solid #fff !important;
    }
  }
}
</style>
<style lang="scss" scoped>
.page {
  // text-align: center;
  //   padding: 30px 50px;
}
.page-main {
  background: #fff;
  padding: 30px 50px;
}
.box {
  // border:2px solid red;
  //   width: 400px;
  margin: 0 auto;
}
.custom-label {
  // text-align: center;
  margin: 20px 0;
}
.custom-input {
  //   width: 300px;
}
.right-tool {
  float: right;
  .tool-item {
    display: inline-block;
    padding: 5px 20px;
    background: #f2f3f5;
    margin-right: 10px;
  }
}
.bottom {
  margin-top: 20px;
  text-align: center;
}
.page-top {
  padding: 15px 50px;
  background: #fff;
  margin-bottom: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.check-row {
  // margin: 30px 0;
  line-height: 53px;
}
.note-row,
.check-row-box {
  padding-bottom: 41px;
}
</style>
