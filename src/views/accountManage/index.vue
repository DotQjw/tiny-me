<template>
  <div class="page">
    <div class="title-box">
      <div class="page-title">
        <el-radio-group v-model="role" @change="fetchData">
          <el-radio-button :label="0">全部</el-radio-button>
          <el-radio-button :label="1">主办人</el-radio-button>
          <el-radio-button :label="2">协办人</el-radio-button>
        </el-radio-group>
      </div>
      <el-input
        style="max-width: 300px; display: inline-block; margin-right: 10px"
        suffix-icon="el-icon-search"
        placeholder="请输入手机/身份证号或者姓名的关键字进行搜索"
        v-model="queryWord"
        @keyup.enter.native="fetchData"
      >
      </el-input>
      <el-button type="primary" @click="handleEdit({})"> 新增账号 </el-button>
    </div>
    <el-table
      header-cell-class-name="table_header"
      @sort-change="sortChange"
      v-loading="tableLoading"
      :data="tableData"
      style="width: 100%"
      v-if="showTable"
    >
      <el-table-column prop="phoneNo" label="手机号" width="180">
      </el-table-column>
      <el-table-column prop="username" label="姓名" width="180">
      </el-table-column>
      <el-table-column prop="idCard" align="center" label="身份证号码">
        <template slot="header" slot-scope="">
          <span>身份证号码</span>
          <span
            style="margin-left: 10px; color: #409eff; cursor: pointer"
            @click="handleShow('showId')"
            >{{ formatLabel() }}</span
          >
        </template>
        <template slot-scope="scope">
          <div>
            {{ formatId(scope.row.idCard) || "-" }}
          </div>
        </template>
      </el-table-column>
      <el-table-column sortable="custom" prop="role" label="账号类型">
        <template slot-scope="scope">
          <div>
            <span :class="`role${scope.row.role}`">
              {{ formatRole(scope.row.role) }}
            </span>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="createAt" label="创建时间"> </el-table-column>

      <el-table-column fixed="right" label="操作" width="200">
        <template slot-scope="scope">
          <span>
            <el-button @click="handleEdit(scope.row)" type="text" size="small"
              >编辑</el-button
            >
            <!-- <el-button @click="handleEdit(scope.row)" type="text" size="small"
              >更多</el-button
            > -->
            <el-popover placement="bottom" width="50" trigger="click">
              <div
                class="delete-suer"
                v-if="scope.row.showDelete"
                @click="handleDelete(scope.row)"
              >
                删除
              </div>
              <div class="edit-psw" @click="handleEditPsw(scope.row)">
                修改密码
              </div>
              <span
                slot="reference"
                style="cursor: pointer; color: #409eff; font-size: 12px"
              >
                更多</span
              >
            </el-popover>
          </span>
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

    <edit v-if="showEdit" :show.sync="showEdit" :curData="curData" />
    <editpsw v-if="showEditPsw" :show.sync="showEditPsw" :pswData="pswData" />
  </div>
</template>
<script>
import { userList, userDelete } from "@/api/table";
import edit from "./edit.vue";
import editpsw from "./editpsw.vue";
export default {
  components: { edit, editpsw },
  data() {
    var that = this;
    return {
      showTable: true,
      curData: {},
      showEdit: false,
      showEditPsw: false,
      pswData: {},
      role: 0,
      showPassword: false,
      showId: false,
      pages: {
        total: 0,
        currentPage: 1,
        perPage: 20,
      },
      tableLoading: false,
      sortField: "",
      sortType: "",
      queryWord: "",
      statusList: [
        { label: "进行中", value: 1 },
        { label: "暂停中", value: 2 },
        { label: "已完成", value: 3 },
        { label: "已撤案", value: 4 },
      ],
      tableData: [],
    };
  },
  created() {
    this.fetchData();
  },
  methods: {
    formatId(id) {
      if (!id) return "-";
      if (this.showId) return id;
      var ids = id.slice(0, 14);
      console.log("ids", ids, id);
      return ids + "****";
    },
    formatLabel() {
      return this.showId ? "隐藏" : "显示";
    },
    formatRole(role) {
      return role === 1 ? "主办人" : "协办人";
    },
    handleDelete(row) {
      this.$confirm("确定要删除当前账号数据吗", "提示", {
        confirmButtonText: "确定删除",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        userDelete({ id: row.id }).then((res) => {
          this.$message.success("删除成功");
          this.fetchData();
        });
      });
    },
    handleEditPsw(row) {
      this.showEditPsw = true;
      this.pswData = {
        id: row.id,
        username: row.username,
      };
    },
    handleShow() {
      this.showId = !this.showId;
      this.showTable = false;
      this.$nextTick(() => {
        this.showTable = true;
      });
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
    updateStatus(row, status) {
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
        role: this.role,
        queryWord: this.queryWord,
      };
      this.tableLoading = true;
      userList(param)
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
    handleEdit(row = {}) {
      console.log("edit", row);
      this.curData = row;
      this.showEdit = true;
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
.role2 {
  padding: 3px 8px;
  color: #00b42a;
  background: #e8ffea;
}
.role1 {
  padding: 3px 8px;
  color: #ff7d00;
  background: #fff7e8;
}
.title-box {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}
.page-title {
  flex: 1;
}
.delete-suer {
  padding-left: 10px;
  color: red;
  margin-bottom: 6px;
  cursor: pointer;
}
.edit-psw {
  padding-left: 10px;
  color: #409eff;
  cursor: pointer;
}
</style>
<style lang="scss">
.el-popover {
  min-width: 100px;
}
</style>
