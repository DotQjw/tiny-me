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
        <el-table
          header-cell-class-name="table_header"
          :data="claims"
          style="width: 100%; margin-top: 15px"
          @cell-mouse-enter="mouseEnter"
          @cell-mouse-leave="mouseLeave"
        >
          <el-table-column prop="realIndex" label="序号" width="100">
            <template slot-scope="scope">
              <div
                :class="[
                  scope.row.no === scope.row.parentNo
                    ? 'sort-index'
                    : 'child-index',
                ]"
              >
                {{ scope.$index + 1 }}
              </div>

              <div
                v-if="scope.row.showTip"
                @click="handleDelete(scope.row)"
                class="row-click"
              >
                删除
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="name" label="权利名称" width="280">
            <template slot-scope="scope">
              <div>
                <div
                  class="name-input"
                  v-if="
                    scope.row.no === scope.row.parentNo &&
                    scope.row.no === scope.row.ancestorNo
                  "
                >
                  <el-input
                    :ref="`input${scope.row.realIndex}`"
                    @input="nameInputChange($event, scope.row, 'name')"
                    type="textarea"
                    rows="1"
                    v-model="scope.row.name"
                  ></el-input>
                  <el-button
                    icon="el-icon-plus"
                    style="margin-top: 10px"
                    @click="handleChild(scope.row, scope.$index)"
                    >添加从权</el-button
                  >
                </div>
                <div v-else class="child-name">
                  <div>
                    <span
                      >根据
                      <!-- <span style="color: #165dff">权利要求</span> -->
                    </span>
                    <el-input
                      :ref="`input${scope.row.realIndex}`"
                      @input="nameInputChange($event, scope.row, 'name')"
                      v-model="scope.row.name"
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
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="kernel" min-width="150px" label="内核">
            <template slot-scope="scope">
              <span>
                <div
                  @mouseenter="
                    kernelMouseEnter(item, index, scope.row.claimContent)
                  "
                  @mouseleave="
                    kernelMouseLeave(item, index, scope.row.claimContent)
                  "
                  v-for="(item, index) in scope.row.claimContent"
                  :key="index"
                >
                  <el-input
                    @input="inputChange"
                    class="kernel"
                    type="textarea"
                    rows="1"
                    v-model="item.kernel"
                  ></el-input>
                  <div
                    v-if="item.isShowDelete && index != 0"
                    @click="
                      handleKernelDelete(item, index, scope.row.claimContent)
                    "
                    class="kernel-delete"
                  >
                    删除
                  </div>
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
          <el-table-column prop="" label="有益效果" class="ccccc">
            <template slot-scope="scope">
              <span class="main-upload">
                <el-upload
                  :headers="{
                    Authorization: `Bearer ${token}`,
                  }"
                  :show-file-list="false"
                  :action="uploadUrl"
                  :on-success="handleSuccess"
                  :before-upload="(file) => beforeUpload(file, scope.row)"
                >
                  <el-button size="small" class="el-icon-plus"
                    >点击上传</el-button
                  >
                </el-upload>

                <el-input
                  class="good-input"
                  type="textarea"
                  rows="1"
                  @input="nameInputChange($event, scope.row, 'goodEffect')"
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
      <el-button @click="saveData('last')">上一步</el-button>
      <el-button @click="saveData('save')">保 存</el-button>
    </div>
  </div>
</template>
<script>
import { cloneDeep } from "lodash";
import { getToken } from "@/utils/auth";
import { uploadFile } from "@/api/upload";
import { uploadFileUrl, baseUrl } from "@/utils/baseUrl";
//  不支持import 语法，也就是module引入
const jsDiff = require('diff');
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
      parentChildren: [],
      uploadUrl: uploadFileUrl(),
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
        name: "",
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
    const a= jsDiff.diffChars("我的钓鱼","钓的鱼")
    console.log('jsDiff',a)
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
    kernelMouseEnter(item, index, data) {
      console.log("kernelMouseMove", item);
      this.$set(item, "isShowDelete", true);
    },
    kernelMouseLeave(item, index, data) {
      this.$set(item, "isShowDelete", false);
    },
    handleKernelDelete(item, index, data){
      console.log({item, index, data})
      data.splice(index,1)
      this.saveData("autoSave");
    },
    handleDelete(row) {
      console.log("row", row, this.treeData);
      //第一级，。
      this.parentChildren = this.treeData;
      this.findTreeData(row.no, this.treeData);
      this.$nextTick(() => {
        console.log("parentChildren", this.parentChildren);
        // return
        let index = this.parentChildren.findIndex((v) => v.no === row.no);
        console.log("index", index);
        this.parentChildren.splice(index, 1);
        console.log("this.treeData", this.treeData);
        this.claims = [];
        this.realIndex = 0;
        this.handleArrayData(this.treeData);
        this.inputChange();
      });
      // console.log(this.treeData);
    },
    findTreeData(no, data) {
      data.forEach((el, index) => {
        if (el.no === no) {
          this.parentChildren = data;
          console.log("找到了", el, index, this.parentChildren);
        } else {
          if (el.children && el.children[0]) {
            console.log("进阿里了？");
            this.findTreeData(no, el.children);
          }
        }
      });
    },
    mouseEnter(row, column, cell, event) {
      if (row.no === 1) return;
      this.$set(row, "showTip", true);
    },
    mouseLeave(row, column, cell, event) {
      if (row.no === 1) return;
      this.$set(row, "showTip", false);
    },
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
            kernel: "", //内核
            check: {
              necessaryStep: false,
              visible: false,
              logic: false,
            },
            note: "", //备注
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
    nameInputChange(value, row, type) {
      console.log("回填数据", value, row);
      // this.treeData
      this.fillTreeData(value, row, this.treeData, type);
      this.inputChange();
    },
    fillTreeData(value, row, originData, type) {
      originData.forEach((item) => {
        if (item.no === row.no) {
          console.log("我找到了");
          item[type] = value;
        } else if (item.children && item.children.length) {
          console.log("还没有找到，不过继续");
          this.fillTreeData(value, row, item.children, type);
        }
      });
    },
    handleArrayData(data) {
      data.map((item, index) => {
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
          if (!item.name || item.isAdd) {
            // console.log("我是新增的走这里", data[index - 1]);
            // obj.name = this.ancestorName + "";
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

      this.$nextTick(() => {
        this.claims = [];
        this.realIndex = 0;
        this.handleArrayData(this.treeData);
        console.log("claims", this.claims);
      });
    },
    handlePushChildData(item, itemIndex, data) {
      //找到这个东西
      // 这里也要递归
      var template = cloneDeep(this.template);
      data.forEach((child, index) => {
        if (child.no === item.no) {
          console.log("找到啦", child, item.realIndex);
          child.children = child.children ? child.children : [];
          child.children.push(
            Object.assign({}, template, {
              no: this.claims.length + 1,
              parentNo: item.no,
              ancestorNo: item.ancestorNo,
              name: `权利要求${item.realIndex}`,
              isAdd: true,
            })
          );
        } else if (child.children) {
          this.handlePushChildData(item, itemIndex, child.children);
        }
      });
    },
    handleSingle() {
      var template = cloneDeep(this.template);
      this.treeData.push(
        Object.assign({}, template, {
          realIndex: this.claims.length + 1,
          no: this.claims.length + 1,
          parentNo: this.claims.length + 1,
          ancestorNo: this.claims.length + 1,
          name: "",
        })
      );
      this.claims = [];
      this.realIndex = 0;
      this.handleArrayData(this.treeData);
      let name = `input${this.claims.length}`;
      this.$nextTick(() => {
        this.$refs[name].focus();
      });
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
.el-table {
  position: relative;
}
.el-table td,
.el-table th {
  vertical-align: text-top;
  // position: absolute;
  // top:5px;
}
.el-textarea__inner:focus {
  border: 1px solid #165dff !important;
}
.no-border-input {
  .el-textarea__inner {
    margin: 10px 0;
    padding: 5px 2px;
    height: 124px !important;
  }
  .el-table tbody tr:hover > td {
    background-color: #fff !important;
  }
  .good-input {
    .el-textarea__inner {
      margin: 10px 0;
      padding: 5px 2px;
      height: 30px !important;
      max-height: 124px !important;
    }
  }
  .child-input {
    max-width: 120px;
    .el-input__inner {
      padding: 0 3px;
      border: 1px solid #fff !important;
      color: #165dff;
    }
  }
}
</style>
<style lang="scss" scoped>
// .name-input{
//   position: absolute;
//   top:10px;
// }
.page {
  // text-align: center;
  //   padding: 30px 50px;
}
.main-upload {
  position: absolute;
  top: 24px;
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
  margin-bottom: 15px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.check-row {
  // margin: 30px 0;
  // line-height: 124px;
  height: 144px;
  position: relative;
  top: -20px;
}
.note-row,
.check-row-box {
  padding-bottom: 41px;
}
.check-row-box {
  position: absolute;
  top: 40px;
}

// .fisrt-check-row{
//   position: relative;
//   top:-20px;
// }
.sort-index {
  position: absolute;
  top: 24px;
}
.row-click {
  position: absolute;
  bottom: 5px;
  left: 10px;
  color: red;
  cursor: pointer;
}
.row-top {
  position: absolute;
  top: 10px;
}
.child-name {
  position: absolute;
  top: 18px;
}
.child-index {
  position: absolute;
  top: 26px;
}
.kernel-delete {
  color: red;
  cursor: pointer;
}
</style>
