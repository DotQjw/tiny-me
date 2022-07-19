<template>
  <div class="page">
    <div class="title-box">
      <div class="page-title">
        <div class="title-text">案件管理</div>
        <el-tabs
          v-model="status"
          class="filter"
          type="card"
          @tab-click="handleStatusClick"
        >
          <el-tab-pane label="全部" name="0"></el-tab-pane>
          <el-tab-pane label="进行中" name="1"></el-tab-pane>
          <el-tab-pane label="暂停中" name="2"></el-tab-pane>
          <el-tab-pane label="已完成" name="3"></el-tab-pane>
          <el-tab-pane label="已撤案" name="4"></el-tab-pane>
        </el-tabs>
      </div>
      <div class="search">
        <div class="full">
          <el-checkbox v-model="isFull">显示完整表格</el-checkbox>
        </div>
        <div class="search_btm">
          <el-input
            style="max-width: 200px; display: inline-block; margin-right: 10px"
            placeholder="输入关键词搜索"
            class="search_input"
            v-model="keyword"
            @keyup.enter.native="fetchData"
          >
            <template slot="suffix">
              <i class="el-icon-search" @click="fetchData"></i>
            </template>
          </el-input>
          <el-button type="primary" @click="handleCreate"> 创建案件 </el-button>
        </div>
      </div>
    </div>
    <div style="padding: 0 35px">
      <el-table
      header-cell-class-name="table_header"
      @sort-change="sortChange"
      @cell-mouse-enter="mouseEnter"
      @cell-mouse-leave="mouseLeave"
      v-loading="tableLoading"
      :data="tableData"
      :height="pgaeHeight"
      fit
      style="wdith: 100%; cursor: pointer; background: #f8f8f8"
      class="p1-table"
      @row-click="rowClick"
    >
      <el-table-column prop="caseNo" label="客户案号">
        <template slot-scope="scope">
            <div class="tian_name" :title="scope.row.caseNo">
              {{ scope.row.caseNo }}
            </div>
        <div v-if="scope.row.showTip" style="margin-top:5px;color:#86909C;font-size:14px;">点击进入撰写流程</div>
        </template>
      </el-table-column>
      <el-table-column prop="tianyuan" label="天元案号">
        <template slot-scope="scope">
          <div class="tian_name" :title="scope.row.tianyuan">
            {{ scope.row.tianyuan }}
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="proposalName" label="提案名称">
        <template slot-scope="scope">
          <div class="tian_name" :title="scope.row.proposalName">
            {{ scope.row.proposalName }}
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="patentName" label="专利名称">
        <template slot-scope="scope">
          <div>
            {{ scope.row.patentName || "-" }}
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="status" label="状态" width="101px">
        <template slot-scope="scope">
          <div>
            <span>
              <span
                v-if="![1, 2].includes(scope.row.status)"
                :class="`status-item status-item${scope.row.status}`"
              >
                {{ formatStatus(scope.row) }}</span
              >
              <el-popover v-else placement="bottom" width="50" trigger="click">
                <div
                  class="pause-case"
                  v-if="scope.row.status === 1"
                  @click="updateStatus(scope.row, 2)"
                >
                  暂停
                </div>
                <div
                  class="doing-case"
                  v-if="scope.row.status === 2"
                  @click="updateStatus(scope.row, 1)"
                >
                  进行
                </div>
                <div class="cancel-case" @click="updateStatus(scope.row, 4)">
                  撤案
                </div>
                <span
                  :class="`status-item status-item${scope.row.status}`"
                  slot="reference"
                >
                  {{ formatStatus(scope.row) }}</span
                >
              </el-popover>
            </span>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="clientName" label="客户名称">
        <template slot-scope="scope">
          <div class="tian_name" :title="scope.row.clientName">
            {{ scope.row.clientName }}
          </div>
        </template>
      </el-table-column>
      <el-table-column
        prop="createdAt"
        label="时间"
        width="205px"
        sortable="custom"
      >
        <template slot-scope="scope">
          <div>
            <div style="margin-bottom: 10px">
              创建：{{ formatTime(scope.row.createdAt) }}
            </div>
            <div>完成：{{ formatTime(scope.row.finishedAt) || "-" }}</div>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="" label="联系人">
        <template slot-scope="scope">
          <div style="margin-bottom: 10px">
            P1：{{ scope.row.createUserName }}
          </div>
          <div v-if="isFull">P2：{{ scope.row.assistUserName || "-" }}</div>
        </template>
      </el-table-column>

      <el-table-column fixed="right" label="操作" width="134px">
        <template slot-scope="scope">
          <el-button
            @click="handleCheck(scope.row, 'review')"
            v-if="scope.row.reviewStatus === 1 && scope.row.status === 1"
            type="text"
            size="small"
            class="operation-btn"
            >审核</el-button
          >
          <el-button
            @click="handleCreate(scope.row)"
            type="text"
            style="font-size: 12px"
            size="small"
            v-if="scope.row.status != 3"
            class="operation-btn"
            >编辑</el-button
          >
          <el-button
            @click="handleRemove(scope.row)"
            type="text"
            v-if="[2, 4].includes(scope.row.status)"
            style="color: red; font-size: 12px"
            class="operation-btn"
            >删除</el-button
          >

          <el-button
            v-if="scope.row.status === 3"
            @click="handleCheck(scope.row, 'check')"
            type="text"
            size="small"
            class="operation-btn"
            >查看详情</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    </div>

    <el-pagination
      style="margin-top: 20px; text-align: center"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pages.currentPage"
      :page-sizes="[20, 30, 50]"
      :page-size="pages.perPage"
      layout="total, sizes, prev, pager, next, jumper"
      :total="pages.total"
    >
    </el-pagination>
    <create-case
      v-if="showDialog"
      @getData="fetchData"
      :createData="createData"
      :show.sync="showDialog"
    />
  </div>
</template>
<script>
import { getList, updateStatus, deleteCase } from "@/api/table";
import createCase from "@/views/commonComponents/createCase.vue";
export default {
  components: { createCase },
  data() {
    return {
      showDialog: false,
      pages: {
        total: 0,
        currentPage: 1,
        perPage: 20,
      },
      tableLoading: false,
      sortField: "",
      sortType: "",
      keyword: "",
      statusList: [
        { label: "进行中", value: 1 },
        { label: "暂停中", value: 2 },
        { label: "已完成", value: 3 },
        { label: "已撤案", value: 4 },
      ],
      tableData: [],
      role: this.$store.getters.roles,
      isFull: false,
      status: "0",
    };
  },
  created() {
    console.log("roles", this.$store.getters);
    this.fetchData();
  },
  computed: {
    pgaeHeight() {
      const page = document.documentElement.clientHeight;
      const height = page - 240;
      return height;
    },
  },
  methods: {
    rowClick(row, column, event) {
      if (column.label === "状态" || column.label === "操作") return;
      console.log({ row, column, event });
      this.handleEdit(row);
    },
    formatTime(time) {
      if (!time) return "-";
      return time.slice(0, 16);
    },
    sortChange(column, prop, order) {
      console.log({ column, prop, order });
      this.sortField = column.prop;

      if (column.order === "descending") {
        this.sortType = "desc";
      } else if (column.order === "ascending") {
        this.sortType = "asc";
      } else {
        this.ssortType = "";
      }
      this.fetchData();
    },
    formatStatus(row) {
      if (!row.status) return "";
      return this.statusList.find((v) => v.value === row.status).label;
    },
    handleRemove(row) {
      deleteCase({
        id: row.id,
      })
        .then((res) => {
          this.$message.success("删除成功");
          this.fetchData();
        })
        .catch((err) => {
          this.$message.error(res.message);
        });
    },
    mouseEnter(row, column, cell, event) {
      this.$set(row, "showTip", true);
    },
    mouseLeave(row, column, cell, event) {
      this.$set(row, "showTip", false);
    },
    updateStatus(row, status) {
      row.status = null;
      updateStatus({
        id: row.id,
        status,
      })
        .then((res) => {
          this.$message.success("状态更新成功");
          this.fetchData();
        })
        .catch((err) => {
          this.$message.error(res.message);
        });
    },
    fetchData() {
      const param = {
        currentPage: this.pages.currentPage,
        perPage: this.pages.perPage,
        sortType: this.sortType,
        sortField: this.sortField,
        keyword: this.keyword,
        status: this.status
      };
      this.tableLoading = true;
      getList(param)
        .then((res) => {
          console.log("res", res);
          this.tableLoading = false;
          this.tableData = res.data.list;
          this.pages.total = res.data.count;
        })
        .catch((err) => {
          this.tableLoading = false;
          this.$message.error(err.message);
        });
    },
    handleCheck(row, type) {
      console.log("check", row);
      this.$router.push({
        path: "/data-review",
        query: { id: row.id, type: type, proposalName: row.proposalName, active: 'case' },
      });
    },
    handleCreate(data) {
      this.createData = {};
      if (data.id) {
        this.createData = {
          id: data.id,
          caseNo: data.caseNo,
          tianyuan: data.tianyuan,
          clientName: data.clientName,
          proposalName: data.proposalName,
          type: data.type,
          assistUserId: data.assistUserId,
          assistUserName: data.assistUserName,
        };
      }
      this.showDialog = true;
    },
    handleEdit(row) {
      this.$router.push({
        path: "/data-edit",
        query: { id: row.id, proposalName: row.proposalName, active: "case" },
      });
    },
    handleEditRichText(row) {
      console.log("type");
      this.$router.push({
        path: "/rich-text-edit",
        query: { id: row.id },
      });
    },
    handleSizeChange(val) {
      this.pages.perPage = val;
      this.pages.currentPage = 1;
      this.fetchData();
    },
    handleCurrentChange(val) {
      this.pages.currentPage = val;
      this.fetchData();
    },
    handleStatusClick() {
      this.pages.currentPage = 1;
      this.pages.perPage = 20;
      this.fetchData();
    },
  },
};
</script>
<style lang="scss">
.el-table td,
.el-table th {
  vertical-align: text-top;
}
.p1-table{
  .el-table__body-wrapper {
    tbody {
      vertical-align: top;
    }
  }
}
</style>
<style lang="scss" scoped>
.page {
  &-title {
    font-weight: bold;
    font-size: 18px;
  }
  .el-table {
    height: calc(100vh - 237px);
    .el-table__fixed-right {
      ::v-deep .el-table__fixed-right-patch {
        width: 0;
      }
    }
    ::v-deep .el-table__body-wrapper::-webkit-scrollbar {
      width: 0px; /*滚动条宽度*/
      height: 0px; /*滚动条高度*/
    }
    ::v-deep .el-table__body-wrapper::-webkit-scrollbar-track {
      border-radius: 0px; /*滚动条的背景区域的圆角*/
      background-color: rgba(2, 29, 87, 1); /*滚动条的背景颜色*/
    }
    ::v-deep .el-table__body-wrapper::-webkit-scrollbar-corner {
      background-color: rgba(2, 29, 87, 1);
    }
    ::v-deep .el-table__body-wrapper::-webkit-scrollbar-thumb {
      border-radius: 4px; /*滚动条的圆角*/
      background-color: rgba(24, 144, 255, 0.5); /*滚动条的背景颜色*/
    }
  }
}
.status-item {
  display: inline-block;
  padding: 1px 8px;
  cursor: pointer;
}
.status-item1 {
  color: #00b42a;
  background: #e8ffea;
}
.status-item2 {
  color: #ff7d00;
  background: #fff7e8;
}
.status-item3 {
  color: #1d2129;
  background: #f2f3f5;
}
.status-item4 {
  color: #165dff;
  background: #e8f3ff;
}
.tian_name {
  height: 46px;
  display: -webkit-box; /** 对象作为伸缩盒子模型显示 **/
  overflow: hidden;
  word-break: break-all; /* break-all(允许在单词内换行。)  对pc端可以不要*/
  text-overflow: ellipsis; /* 超出部分省略号 */
  -webkit-box-orient: vertical; /** 设置或检索伸缩盒对象的子元素的排列方式 **/
  -webkit-line-clamp: 2;
}
.cancel-case {
  color: #1d2129;
  background: #f2f3f5;
  text-align: center;
  padding: 5px 0;
  cursor: pointer;
}
.pause-case {
  color: #ff7d00;
  background: #fff7e8;
  text-align: center;
  margin-bottom: 10px;
  padding: 5px 0;
  cursor: pointer;
}
.doing-case {
  color: #00b42a;
  background: #e8ffea;
  text-align: center;
  margin-bottom: 10px;
  padding: 5px 0;
  cursor: pointer;
}
.title-box {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding: 15px 40px 0 40px;
  .page-title {
    // flex: 1;
    .title-text {
      margin-bottom: 20px;
      font-family: "PingFang SC";
      font-style: normal;
      font-size: 24px;
      color: #1d2129;
    }
    .filter {
      background: #fff;
      ::v-deep .el-tabs__header {
        margin: 0;
      }
    }
  }
  .search {
    .full {
      text-align: right;
      padding-bottom: 25px;
    }
    .search_btm{
      display: flex;
      justify-content: center;
      align-items: center;
      box-sizing: border-box;
      .search_input {
        ::v-deep .el-input__suffix {
          width: 25px;
          height: 100%;
          right: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
        }
      }
    }
  }
}
.table_header {
  background: #f2f3f5 !important;
  box-shadow: 1px 0px 0px #f2f3f5;
}
.operation-btn {
  margin-left: 24px;
  &:first-child {
    margin-left: 0;
  }
}
</style>
<style lang="scss">
.el-popover {
  min-width: 100px;
}
</style>
