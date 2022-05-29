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
        <el-table
          :data="tableData"
          :span-method="objectSpanMethod"
          style="width: 100%; margin-top: 20px"
        >
          <el-table-column prop="no" label="序号" width="100">
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
                  @click="handleChild(scope.row)"
                  >添加从权</el-button
                >
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="kernel" label="内核">
            <template slot-scope="scope">
              <div v-if="scope.row.type === 'button'">
                <el-button icon="el-icon-plus" @click="handleInner(scope.row)">
                  添加内核
                </el-button>
              </div>

              <el-input
                @input="inputChange"
                v-else
                type="textarea"
                rows="1"
                v-model="scope.row.claimContent.kernel"
              ></el-input>
            </template>
          </el-table-column>
          <el-table-column prop="" label="校核" width="270px">
            <template slot-scope="scope">
              <div v-if="!scope.row.type">
                <el-checkbox
                  v-model="scope.row.claimContent.check.necessaryStep"
                  >必经</el-checkbox
                >
                <el-checkbox v-model="scope.row.claimContent.check.visible"
                  >可视</el-checkbox
                >
                <el-checkbox v-model="scope.row.claimContent.check.logic"
                  >逻辑</el-checkbox
                >
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="logic" label="备注">
            <template slot-scope="scope">
              <div v-if="!scope.row.type">
                <el-input
                  @input="inputChange"
                  v-model="scope.row.claimContent.note"
                  type="textarea"
                  rows="1"
                ></el-input>
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
    <div class="bottom">
      <el-button type="primary">下一步</el-button>
      <el-button type="success">上一步</el-button>
      <el-button>保 存</el-button>
    </div>
  </div>
</template>
<script>
// TODO 组装数据
// 如何把内核的数据 提取出来
// 1.parentNo = no， 这样子来判断是同一个集合。 × 貌似不可行
//  -1 加一个类型判断 是inner?  通过id？
// 2.从权的parentNo != no,

// ----

// 1. 通过id来判断是否是同一个集合， 统筹内核，
// 2. 通过parentNo = no 来判断是不是从权。

import { cloneDeep } from "lodash";

export default {
  watch:{
    maxParentNo(n){
      console.log('change',n)
    }
  },
  data() {
    return {
      content: "",
      maxParentNo: 1,
      template: {
        no: null,
        realNo: null,
        parentNo: null,
        name: "",
        claimContent: {
          kernel: "", //内核
          check: {
            necessaryStep: false,
            visible: false,
            logic: false,
          },
          note: "", //备注
          attachment: [],
        },
      },
      tableData: [
        // {
        //   no: 1,
        //   realNo: 1,
        //   parentNo: 1,
        //   name: "王小虎",
        //   kernel: "",
        //   check: {
        //     necessaryStep: false,
        //     visible: false,
        //     logic: false,
        //   },
        //   note: "",
        //   attachment: [],
        //   id: "12987122",
        //   childMaxNo: 1,
        //   maxRowspan: 0,
        //   parentId: "12987122",
        // },
        // {
        //   no: null,
        //   parentNo: 1,
        //   name: "",
        //   kernel: "",
        //   check: {
        //     necessaryStep: false,
        //     visible: false,
        //     logic: false,
        //   },
        //   note: "",
        //   attachment: [],
        //   parentId: "12987122",
        //   type: "button",
        //   id: "00000",
        //   maxRowspan: 0,
        //   childMaxNo: 1,
        // },
      ],
    };
  },
  created() {
    this.createdData();
    // this.handleDealData();
  },
  methods: {
    createdData() {
      let template = cloneDeep(this.template);
      this.tableData.push(
        Object.assign({}, template, {
          no: 1,
          realNo: 1,
          parentNo: 1,
          id: "12987122",
          parentId: "12987122",
          name: "大脑虎",
          childMaxNo: 1,
          maxRowspan: 0,
        }),
        {
          parentNo: 1,
          parentId: "12987122",
          type: "button",
        }
      );
      console.log("【initData】:", this.tableData);
      this.handleDealData();
    },
    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      // console.log("rowIndex", { row, column, rowIndex, columnIndex });
      if (columnIndex === 0 || columnIndex === 1 || columnIndex === 5) {
        return {
          rowspan: row.maxRowspan,
          colspan: 1,
        };
      }
    },
    handleChild(row) {
      let template = cloneDeep(this.template);
      console.log("template", template);
      console.log("【handleChild row】", row, this.tableData);
      var curIndex;
      // row.childMaxNo = row.childMaxNo? row.childMaxNo + 1 :row.parentNo+1
      let parentRow = this.tableData.find(
        (v) => v.realNo === v.parentNo && v.parentNo === row.parentNo
      );
      parentRow.childMaxNo = parentRow.childMaxNo + 1;
      this.maxParentNo += 1;
      console.log('child', this.maxParentNo )
      console.log('【parentRow】',parentRow, parentRow.childMaxNo)
      this.tableData.some((item, index) => {
        if (item.parentNo === parentRow.parentNo) {
          console.log(" 【index】:", index);
          curIndex = index;
        }
      });
      const id = this.getRandom(16);
      const childId = this.getRandom(8);
      // debugger
      this.tableData.splice(
        curIndex + 1,
        0,
        Object.assign({}, template, {
          realNo: parentRow.childMaxNo,
          childMaxNo:parentRow.childMaxNo,
          no: this.maxParentNo,
          parentNo: parentRow.realNo,
          parentId: id,
          id: id,
          name: `根据${row.name}`
                  }),
        // {
        //   realNo: this.maxParentNo,
        //   no: this.maxParentNo,
        //   parentNo: parentRow.no,
        //   parentId: id,
        //   id: id,
        //   name: `根据${row.name}`,
        //   maxParentNo: this.maxParentNo,
        // },
        {
          parentNo: parentRow.no,
          parentId: id,
          type: "button",
          // id: childId,
          name: "",
          // maxRowspan: 0,
        }
      );
      this.handleDealData();
    },
    handleInner(row) {
      console.log("row", row);
            let parentRow = this.tableData.find(
        (v) => v.realNo === v.parentNo && v.parentNo === row.parentNo
      );
      // var obj = this.tableData.find((v) => v.id === row.parentId);
      var curIndex;
      this.tableData.some((item, index) => {
        if (item.parentId === row.parentId && item.type === "button") {
          console.log("index", index);
          curIndex = index;
          return;
        }
      });
      const childId = this.getRandom(8);
      this.tableData.splice(
        curIndex,
        0,
        Object.assign(
          {},
          {
            parentNo: parentRow.no,
            claimContent: {
              kernel: "", //内核
              check: {
                necessaryStep: false,
                visible: false,
                logic: false,
              },
              note: "", //备注
              attachment: []
            },
          },
          {
            parentId: row.parentId,
            id: childId,
            name: "INNER1",
          }
        )
      );
      this.handleDealData();
    },
    handleDealData() {
      var selectedIndex = 0;
      let currentNo = 1;
      this.tableData.map((item, index) => {
        if (item.no && index > 0) {
          // console.log("【map No】:", item.no, currentNo);
          if (item.no < currentNo) {
            // console.log("进来了");
            currentNo = item.no;
          } else {
            // console.log('我比他大')
            currentNo = currentNo + 1;
            // console.log('currenNo',currentNo)
            item.no = currentNo;
          }
        }
        if (index === 0) {
          // 第一个 默认给1
          this.tableData[index].maxRowspan = 1;
          selectedIndex = 0;
        } else if (
          this.tableData[index].parentId === this.tableData[index - 1].parentId
        ) {
          // console.log("进来", this.tableData[index].parentId, selectedIndex);
          this.tableData[selectedIndex].maxRowspan =
            this.tableData[selectedIndex].maxRowspan + 1;
          if (selectedIndex != index - 1) {
            this.tableData[index].maxRowspan = 0;
          }
        } else {
          selectedIndex = index;
          this.tableData[selectedIndex].maxRowspan = 1;
        }
      });
      console.log("tableData", this.tableData);
    },
    handleSingle() {
      const id = this.getRandom(16);
      const childId = this.getRandom(8);
      this.maxParentNo += 1
      console.log('single',this.maxParentNo)
      this.tableData.push(
        Object.assign({}, this.template, {
          no: this.maxParentNo,
          realNo: this.maxParentNo,
          parentNo: this.maxParentNo,
          childMaxNo:1,
          parentId: id,
          id: id,
          name: `独权${this.maxParentNo}`,
        }),

        {
          parentNo: this.maxParentNo,
          parentId: id,
          type: "button",
        }
      );
      console.log("tableData", this.tableData);
      this.handleDealData();
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
    inputChange() {
      console.log("【changeData】", this.tableData);
      this.dealSaveData();
    },
    dealSaveData() {
      let currentNo = null;
      this.tableData.map((item, index) => {
        // console.log({ });
        if (item.type != 'button') {
          if (item.realNo === item.parentNo) {
            // 这是组长
            currentNo = item.realNo;
            console.log("【我是组长，编号】", currentNo);
          } else if (item.parentNo === currentNo) {
            console.log(
              "【我是组员，编号】",
              item.realNo,
              "【我爹是】",
              currentNo
            );
          }else{
            console.log('我不知道我是谁',item.realNo,'但是我爹是',item.parentNo)
          }
        }
      });
    },
  },
};
</script>
<style lang="scss">
.no-border-input {
  .el-textarea__inner {
    border: 1px solid #fff !important;
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
</style>
