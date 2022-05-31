<template>
  <div class="page">
    <div class="page-title">项目管理</div>
    <el-table v-loading="tableLoading" :data="tableData" style="width: 100%">
      <el-table-column
        prop="caseNo"
        align="center"
        label="客户案号"
        width="180"
      >
      </el-table-column>
      <el-table-column
        prop="tianyuan"
        align="center"
        label="天元案号"
        width="180"
      >
      </el-table-column>
      <el-table-column prop="proposalName" align="center" label="提案名称">
      </el-table-column>
      <el-table-column prop="address" align="center" label="专利名称">
        <template slot-scope="scope">
          <div>
            {{ scope.row.address || "-" }}
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="status" align="center" label="状态">
        <template slot-scope="scope">
          <div>
            {{ formatStatus(scope.row.status) }}
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="address" align="clientName" label="客户名称">
      </el-table-column>
      <el-table-column prop="address" align="center" label="事件">
        <template slot-scope="scope">
          <div>
            {{ scope.row.address || "-" }}
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="address" align="center" label="联系人">
        <template slot-scope="scope">
          <div>
            {{ scope.row.address || "-" }}
          </div>
        </template>
      </el-table-column>
      <el-table-column fixed="right" align="center" label="操作" width="200">
        <template slot-scope="scope">
          <span v-if="role === 2 ">
            <el-button
              v-if="scope.row.status === 1"
              @click="handleEditRichText(scope.row)"
              type="text"
              size="small"
              >撰写</el-button
            >
            <el-button
              @click="handleEditRichText(scope.row)"
              type="text"
              size="small"
              >查看详情</el-button
            >
          </span>
          <span v-if="role === 1 ">
            <!-- <el-button
              @click="handleCheck(scope.row)"
              disabled
              type="text"
              size="small"
              >审核</el-button
            > -->
            <el-button @click="handleEdit(scope.row)" type="text" size="small"
              >编辑</el-button
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
  </div>
</template>
<script>
import { getList } from "@/api/table";

export default {
  data() {
    return {
      pages: {
        total: 0,
        currentPage: 1,
        perPage: 20,
      },
      tableLoading:false,
      statusList: [
        { label: "进行中", value: 1 },
        { label: "暂停", value: 2 },
        { label: "完成", value: 3 },
        { label: "撤案", value: 4 },
      ],
      tableData: [],
      role: this.$store.getters.roles,
    };
  },
  created() {
    console.log("roles", this.$store.getters.roles);
    this.fetchData();
  },
  methods: {
    formatStatus(status) {
      return this.statusList.find((v) => v.value === status).label;
    },
    fetchData() {
      const param = {
        currentPage: this.pages.currentPage,
        perPage: this.pages.perPage,
      };
      this.tableLoading = true
      getList(param).then((res) => {
        console.log("res", res);
        this.tableLoading = false
        this.tableData = res.data.list;
        this.pages.total = res.data.count;
      }).catch(err=>{
        this.tableLoading = false
        this.$message.err(err.message)
      })
    },
    handleCheck(row) {
      console.log("check", row);
    },
    handleEdit(row) {
      console.log("edit", row);
      this.$router.push({ path: "/data-edit", query: { id: row.id } });
    },
    handleEditRichText(row) {
      console.log("richMan");
      this.$router.push({path:"/rich-text-edit", query: { id: row.id }})
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
    margin-bottom: 20px;
  }
}
</style>
