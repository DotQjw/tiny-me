<template>
  <div class="page">
    <!-- <div class="title-box">
      <div class="page-title">案件管理</div>
      <el-input
        style="max-width: 200px; display: inline-block; margin-right: 10px"
        suffix-icon="el-icon-search"
        placeholder="输入关键词搜索"
        v-model="keyword"
        @keyup.enter.native="fetchData"
      >
      </el-input>
    </div> -->
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
        </div>
      </div>
    </div>
    <div class="p2">
      <el-table
        header-cell-class-name="table_header"
        @sort-change="sortChange"
        v-loading="tableLoading"
        :data="tableData"
        :height="pgaeHeight"
        style="width: 100%"
        class="p2-table"
      >
        <el-table-column prop="tianyuan" label="天元案号" width="180">
        </el-table-column>
        <el-table-column prop="proposalName" label="提案名称"> </el-table-column>
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
              <span :class="`status-item status-item${scope.row.status}`">
                {{ formatStatus(scope.row) }}
              </span>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="createdAt" width="200px" label="时间" sortable="custom">
          <template slot-scope="scope">
            <div>
              <div style="margin-bottom: 10px">
                创建：{{ scope.row.createdAt }}
              </div>
              <div>完成：{{ scope.row.finishedAt || "-" }}</div>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="finishedAt" label="联系人" sortable="custom">
          <template slot-scope="scope">
            <div>
              <div>
                {{ scope.row.createUserName }}
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="200">
          <template slot-scope="scope">
            <span>
              <el-button
                v-if="scope.row.status === 1"
                :disabled="scope.row.reviewStatus === 1"
                @click="handleEditRichText(scope.row)"
                type="text"
                size="small"
                >撰写</el-button
              >
              <span>
                <el-button
                  v-if="scope.row.status === 3"
                  @click="handleCheck(scope.row, 'check')"
                  type="text"
                  size="small"
                  style="margin-left: 5px"
                  >查看详情</el-button
                >
              </span>
            </span>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <el-pagination
      style="margin-top: 20px;text-align: center"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pages.currentPage"
      :page-sizes="[20, 30, 50]"
      :page-size="pages.perPage"
      layout="total, sizes, prev, pager, next, jumper"
      :total="pages.total"
    >
    </el-pagination>
  </div>
</template>
<script>
import { getList, deleteCase } from "@/api/table";
import { mapGetters } from "vuex";

export default {
  data() {
    return {
      showPopover: false,
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
      status: "0",
    };
  },
  created() {
    console.log("roles", this.$store.getters.roles);
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
      // if(row.status === 1 && row.reviewStatus  === 1) return '审核中'
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
        path: "/case-review",
        query: { id: row.id, type: type, proposalName: row.proposalName, active: 'case' },
      });
    },
    handleEdit(row) {
      console.log("edit", row);
      this.$router.push({ path: "/data-edit", query: { id: row.id } });
    },
    handleEditRichText(row) {
      console.log("type");
      this.$router.push({
        path: "/rich-text-edit",
        query: { id: row.id, proposalName: row.proposalName, active: 'case' },
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
  // cursor: pointer;
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
      padding-bottom: 45px;
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
</style>
<style lang="scss">
.el-popover {
  min-width: 100px;
}
.p2{
  padding: 0 35px;
  .p2-table {
      cursor: pointer;
      background: rgb(248, 248, 248);
    .el-table__body-wrapper {
      tbody {
        vertical-align: top;
      }
    }
  }
}

</style>
