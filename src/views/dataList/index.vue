<template>
  <div class="page">
    <div class="title-box">
      <div class="page-title">项目管理</div>
      <el-input
        style="max-width: 200px; display: inline-block; margin-right: 10px"
        suffix-icon="el-icon-search"
        placeholder="输入关键词搜索"
        v-model="keyword"
        @keyup.enter.native="fetchData"
      >
      </el-input>
      <el-button type="primary" @click="handleCreate"> 创建案件 </el-button>
    </div>
    <el-table
      header-cell-class-name="table_header"
      @sort-change="sortChange"
      @cell-mouse-enter="mouseEnter"
      @cell-mouse-leave="mouseLeave"
      v-loading="tableLoading"
      :data="tableData"
      style="width: 100%; cursor: pointer"
      @row-click="rowClick"
    >
      <el-table-column prop="caseNo" label="客户案号" width="180">
        <template slot-scope="scope">
            <span>
              {{ scope.row.caseNo }}
            </span>
        <div v-if="scope.row.showTip" style="margin-top:5px;color:#86909C;font-size:14px;">点击进入撰写流程</div>
        </template>
      </el-table-column>
      <el-table-column prop="tianyuan" label="天元案号" width="180">
        <template slot-scope="scope">
          <div>
            {{ scope.row.tianyuan }}
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="proposalName" label="提案名称">
        <template slot-scope="scope">
          <div>
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
      <el-table-column sortable="custom" prop="status" label="状态">
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
      <el-table-column prop="clientName" label="客户名称"> </el-table-column>
      <el-table-column
        prop="createdAt"
        label="时间"
        width="180px"
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
      <el-table-column
        prop=""
        width="140px;"
        label="联系人"
      >
        <template slot-scope="scope">
          <div style="margin-bottom: 10px">
            P1：{{ scope.row.createUserName }}
          </div>
          <div>P2：{{ scope.row.assistUserName || "-" }}</div>
        </template>
      </el-table-column>

      <el-table-column fixed="right" label="操作" width="200">
        <template slot-scope="scope">
          <span>
            <el-button
              @click="handleCheck(scope.row, 'review')"
              v-if="scope.row.reviewStatus === 1 && scope.row.status === 1"
              type="text"
              size="small"
              >审核</el-button
            >
            <el-button @click="handleCreate(scope.row)" type="text" size="small"
              >编辑</el-button
            >
            <span
              @click="handleRemove(scope.row)"
              v-if="[2, 4].includes(scope.row.status)"
              style="
                color: red;
                margin-left: 10px;
                font-size: 12px;
                cursor: pointer;
              "
              >删除</span
            >

            <el-button
              v-if="scope.row.status === 3"
              @click="handleCheck(scope.row, 'check')"
              type="text"
              size="small"
              style="margin-left: 5px"
              >查看详情</el-button
            >
          </span>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      style="margin-top: 20px"
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
    };
  },
  created() {
    console.log("roles", this.$store.getters);
    this.fetchData();
  },
  methods: {
    rowClick(row, column, event) {
      if (column.label === "状态" ||  column.label === "操作") return;
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
    mouseEnter(row, column, cell, event){
      this.$set(row,'showTip',true)
    },
    mouseLeave(row, column, cell, event){
      this.$set(row,'showTip',false)
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
        query: { id: row.id, type: type },
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
      this.$router.push({ path: "/data-edit", query: { id: row.id } });
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
  },
};
</script>
<style lang="scss">
.el-table td,
.el-table th {
  vertical-align: text-top;
}
</style>
<style lang="scss" scoped>
.page {
  &-title {
    font-weight: bold;
    font-size: 18px;
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
  justify-content: center;
  align-items: center;
  margin-bottom: 20px;
  .page-title {
    flex: 1;
  }
}
.table_header {
  background: #f2f3f5 !important;
  box-shadow: 1px 0px 0px #f2f3f5;
}
</style>
<style lang="scss">
.el-popover {
  min-width: 100px;
}
</style>
