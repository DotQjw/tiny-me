<template>
  <div class="page">
    <div class="page-title">项目管理</div>
    <el-table border :data="tableData" style="width: 100%">
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
      <el-table-column prop="assistUserName" align="center" label="专利名称">
      </el-table-column>
      <el-table-column prop="status" align="center" label="状态">
      </el-table-column>
      <el-table-column prop="address" align="clientName" label="客户名称">
      </el-table-column>
      <el-table-column prop="address" align="center" label="事件">
      </el-table-column>
      <el-table-column prop="address" align="center" label="联系人">
      </el-table-column>
      <el-table-column fixed="right" align="center" label="操作" width="200">
        <template slot-scope="scope">
          <span v-if="role === 2">
            <el-button
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
          <span v-else>
            <el-button @click="handleCheck(scope.row)" type="text" size="small"
              >审核</el-button
            >
            <el-button @click="handleEdit(scope.row)" type="text" size="small"
              >编辑</el-button
            >
          </span>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
import { getList } from "@/api/table";

export default {
  data() {
    return {
      tableData: [],
      role: this.$store.getters.roles,
    };
  },
  created() {
    console.log("roles", this.$store.getters.roles);
    this.fetchData();
  },
  methods: {
    fetchData() {
      const param = {
        currentPage: 1,
        perPage: 15,
      };
      getList(param).then((res) => {
        console.log("res", res);
        this.tableData = res.data.list;
      });
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
