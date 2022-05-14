<template>
  <div class="page">
    <div class="page-top">
      <div>权力要求书</div>
      <div @click="donwload">下载</div>
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
          <el-table-column prop="id" label="ID" width="280">
            <template slot-scope="scope">
              <div>
                <el-input v-model="scope.row.id"></el-input>
                <el-button
                  icon="el-icon-plus"
                  style="margin-top: 10px"
                  @click="handleChild(scope.row)"
                  >添加从权</el-button
                >
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="name" label="姓名">
            <template slot-scope="scope">
              <div v-if="scope.row.type === 'button'">
                <el-button icon="el-icon-plus" @click="handleInner(scope.row)">
                  添加内核
                </el-button>
              </div>

              <el-input v-else v-model="scope.row.name"></el-input>
            </template>
          </el-table-column>
          <el-table-column prop="amount1" label="数值 1（元）">
            <template slot-scope="scope">
              <div v-if="!scope.row.type">
                <el-input v-model="scope.row.amount1"></el-input>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="amount2" label="数值 2（元）">
            <template slot-scope="scope">
              <div v-if="!scope.row.type">
                <el-input v-model="scope.row.amount2"></el-input>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="amount3" label="数值 3（元）">
            <template slot-scope="scope">
              <div v-if="!scope.row.type">
                <el-input v-model="scope.row.amount3"></el-input>
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
export default {
  data() {
    return {
      content: "",
      allIndex: 2,
      tableData: [
        {
          id: "12987122",
          name: "王小虎",
          amount1: "234",
          amount2: "3.2",
          amount3: 10,
          maxRowspan: 0,
          parentId: "12987122",
        },
        {
          parentId: "12987122",
          type: "button",
          id: "00000",
          name: "",
          amount1: "",
          amount2: "",
          amount3: null,
          maxRowspan: 0,
        },
      ],
    };
  },
  created() {
    this.handleDealData();
  },
  methods: {
    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      // console.log("rowIndex", { row, column, rowIndex, columnIndex });
      if (columnIndex === 0) {
        return {
          rowspan: row.maxRowspan,
          colspan: 1,
        };
      }
    },
    handleChild(row) {
      console.log('row',row);
      var curIndex;
      this.tableData.some((item, index) => {
        if (item.parentId === row.parentId && item.type === "button") {
          console.log("index", index);
          curIndex = index;
          return;
        }
      });
      const id = this.getRandom(16);
      const childId = this.getRandom(8);
      this.tableData.splice(curIndex+1, 0, {
        parentId:id,
        id: id,
        name: `根据${row.name}`,
        amount1: "165",
        amount2: "4.43",
        amount3: 12,
        connectId:row.id
      },
      {
          parentId: id,
          type: "button",
          id: childId,
          name: "",
          amount1: "",
          amount2: "",
          amount3: "",
          maxRowspan: 0,
        });
      this.handleDealData();
    },
    handleInner(row) {
      console.log("row", row);
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
      this.tableData.splice(curIndex, 0, {
        parentId: row.parentId,
        id: childId,
        name: "INNER1",
        amount1: "165",
        amount2: "4.43",
        amount3: 12,
      });
      this.handleDealData();
    },
    handleDealData() {
      var selectedIndex = 0;
      this.tableData.map((item, index) => {
        // debugger;
        if (index === 0) {
          // 第一个 默认给1
          this.tableData[index].maxRowspan = 1;
          selectedIndex = 0;
        } else if (
          this.tableData[index].parentId === this.tableData[index - 1].parentId
        ) {
          console.log("进来", this.tableData[index].parentId, selectedIndex);
          this.tableData[selectedIndex].maxRowspan =
            this.tableData[selectedIndex].maxRowspan + 1;
          if (selectedIndex != index - 1) {
            this.tableData[index].maxRowspan = 0;
          }
        } else {
          console.log("diff", item);
          selectedIndex = index;
          this.tableData[selectedIndex].maxRowspan = 1;
        }
      });
      console.log("tableData", this.tableData);
    },
    handleSingle() {
      const id = this.getRandom(16);
      const childId = this.getRandom(8);
      this.tableData.push(
        {
          id: id,
          name: "443123",
          amount1: "12313",
          amount2: "323",
          amount3: 10,
          maxRowspan: 1,
          parentId: id,
        },
        {
          parentId: id,
          type: "button",
          id: childId,
          name: "",
          amount1: "",
          amount2: "",
          amount3: "",
          maxRowspan: 0,
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
    donwload() {
      // window.open('http://43.138.155.219/download/five.zip')
      window.open("http://tiny-wenql.com/download/five.zip");
    },
  },
};
</script>
<style lang="scss">
.no-border-input {
  .el-input__inner {
    border: 1px solid #fff !important;
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
