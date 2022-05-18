<template>
  <div class="page">
    <div class="page-title">项目管理</div>
    <el-table border :data="tableData" style="width: 100%">
      <el-table-column prop="caseNo" align="center" label="客户案号" width="180">
      </el-table-column>
      <el-table-column prop="tianyuan" align="center" label="天元案号" width="180">
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
      <el-table-column fixed="right" align="center" label="操作" width="100">
        <template slot-scope="scope">
          <el-button @click="handleCheck(scope.row)" type="text" size="small"
            >审核</el-button
          >
          <el-button @click="handleEdit(scope.row)" type="text" size="small"
            >编辑</el-button
          >
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
      tableData: [
        {
          date: "2016-05-02",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄",
        },
        {
          date: "2016-05-04",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1517 弄",
        },
        {
          date: "2016-05-01",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1519 弄",
        },
        {
          date: "2016-05-03",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1516 弄",
        },
      ],
    };
  },
  created(){
    this.fetchData()
  },  
  methods: {
    fetchData(){
      const param = {
        currentPage:1,
        perPage:15
      }
      getList(param).then(res=>{
        console.log('res',res)
        this.tableData = res.data.list;

      })
    },
    handleCheck(row) {
      console.log("check", row);
    },
    handleEdit(row) {
      console.log("edit", row);
      this.$router.push({path:'/data-edit',query:{id:row.id}})
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
