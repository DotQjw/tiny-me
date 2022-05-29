<template>
  <div class="page">
    <div class="page-top">
      <div>权力要求书</div>
      <el-button type="primary" icon="el-icon-plus" @click="handleSingle"
        >添加独权</el-button
      >
    </div>
    <div class="page-main no-border-input">
      <div class="box">
        <el-table :data="claims" style="width: 100%; margin-toIp: 20px">
          <el-table-column prop="realIndex" label="序号" width="100">
          </el-table-column>
          <el-table-column prop="name" label="权力名称" width="280">
            <template slot-scope="scope">
              <div>
                <el-input
                  @input="inputChange"
                  type="textarea"
                  rows="1"
                  v-model="scope.row.name"
                ></el-input>
                <el-button
                  icon="el-icon-plus"
                  style="margin-top: 10px"
                  @click="handleChild(scope.row, scope.$index, treeData)"
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
              <div v-if="!scope.row.type">
                <el-button>上传附件</el-button>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>
<script>
import { cloneDeep } from "lodash";

export default {
  watch: {
    realIndex(n) {
      console.log("realIndex,", n);
    },
  },
  data() {
    return {
      realIndex: 1,
      treeData: [],
      claims: [],
      template: {
        realIndex:1,
        no: 1,
        parentNo: 1,
        name: "第一个独权",
        claimContent: [
          {
            kernel: "第一个内核", //内核
            check: {
              necessaryStep: false,
              visible: false,
              logic: false,
            },
            note: "备注", //备注
            attachment: [],
          },
        ],
        children: [],
      },
    };
  },
  created() {
    let id = this.getRandom(8);
    var template = cloneDeep(this.template);
    this.treeData.push(template);
    this.claims = [];
    this.realIndex = 0;
    this.handleArrayData(this.treeData);
  },
  methods: {
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
            attachment: [],
          });
          console.log('add',child)
        } else if (child.children) {
          this.handleInner(item, itemIndex, child.children);
        }
      });
      console.log('treeData',this.treeData)
      this.claims = [];
      this.realIndex = 0;
      this.handleArrayData(this.treeData);
    },
    inputChange() {
      console.log("this.claims", this.claims);
    },
    handleArrayData(data) {
      data.map((item) => {
        this.realIndex += 1;
        this.claims.push(
          Object.assign({}, item,{ realIndex: this.realIndex })
        );
        if (item.children && item.children.length > 0) {
          this.handleArrayData(item.children);
        }
      });
      console.log("claims", this.claims);
    },
    handleChild(item, itemIndex, data) {
      var template = cloneDeep(this.template);
      console.log("thisc", this.claims, this.claims.length);
      //找到这个东西
      // 这里也要递归
      data.forEach((child, index) => {
        if (child.no === item.no) {
          console.log("找到啦", child);
          child.children ? child.children : [];
          child.children.push(
            Object.assign({}, template, {
              no: this.claims.length + 1,
              parentNo: item.no,
              pioneerNo: item.no,
              name: `${item.name}的baby`,
            })
          );
        } else if (child.children) {
          this.handleChild(item, itemIndex, child.children);
        }
      });
      console.log("tree", this.treeData);
      this.claims = [];
      this.realIndex = 0;
      this.handleArrayData(this.treeData);
    },
    handleSingle() {
      var template = cloneDeep(this.template);
      this.treeData.push(
        Object.assign({}, template, {
          realIndex:this.claims.length + 1,
          no: this.claims.length + 1,
          parentNo: this.claims.length + 1,
          pioneerNo: this.claims.length + 1,
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
  },
};
</script>
<style lang="scss">
.no-border-input {
  .el-textarea__inner {
    // border: 1px solid #fff !important;
    margin: 10px 0;
  }
  .el-textarea__inner:focus {
    border: 1px solid #67c23a !important;
  }
  .el-table tbody tr:hover > td {
    background-color: #fff !important;
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
