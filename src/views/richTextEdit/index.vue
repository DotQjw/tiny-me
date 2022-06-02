<template>
  <div class="page">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item><a>说明书编辑</a></el-breadcrumb-item>
      <el-breadcrumb-item>项目名称</el-breadcrumb-item>
    </el-breadcrumb>

    <div class="left-tool">
      <div
        v-for="(item, index) in toolList"
        @click="handleTool(index)"
        :key="index"
        :class="{ active: currentTool == index }"
      >
        {{ item }}
      </div>
    </div>
    <div id="box1">
      <div class="box1-content">
        <div class="first-left">
          <div class="left-title">
            <div class="custom-title">说明书编辑</div>
            <el-button v-if="!showTechList" @click="showTechList = true"
              >查看技术交底</el-button
            >
          </div>
          <editor
            v-if="allContent"
            selectorId="edit1"
            :defaultValue="allContent"
          />
        </div>
        <div class="first-right" v-if="showTechList">
          <div class="first-right-title">
            <div class="">技术交底</div>
            <el-button @click="showTechList = false">收起</el-button>
          </div>
          <div class="right-content">
            <div class="content-item">
              <div class="content-item-title">
                1.技术领域： {{ detailData.techArea }}
              </div>
            </div>
            <div class="content-item">
              <div class="content-item-title">2.本专利应用在哪个领域</div>
              <div class="content-item-text">{{ detailData.domain.text }}</div>
            </div>
            <div class="content-item">
              <div class="content-item-title">3.该领域存在什么痛点</div>
              <div class="content-item-text">
                {{ detailData.painPoint.text }}
              </div>
            </div>
            <div class="content-item">
              <div class="content-item-title">4.当前是如何解决这些痛点的的</div>
              <div class="content-item-text">
                {{ detailData.currentSolution.text }}
              </div>
            </div>
            <div class="content-item">
              <div class="content-item-title">
                5.解决这些痛点的方案所存在的且本专利要解决的问题有哪些
              </div>
              <div class="content-item-text">
                {{ detailData.pendingDefect.text }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div>
        <hr style="color: grey" />
        <h4>附图标记</h4>
      </div>
    </div>
    <div id="box2">
      <div class="custom-title">摘要</div>
      <div class="custom-tips">
        要编辑摘要，请先填写好上方的内容，再点击下方的生成摘要按钮
      </div>
      <el-button v-if="!showMainEdit" @click="handleMainEdit" type="primary"
        >生成摘要</el-button
      >
      <div v-show="showMainEdit" class="main-edit">
        <editor selectorId="mainEdit" :defaultValue="mainContent" />
      </div>
    </div>
    <div id="box3">
      <div class="custom-title">附图</div>
      <div class="custom-tips">你还没有任何附图</div>
      <span class="el-icon-picture-outline addimg">添加附图</span>
    </div>

    <div class="bottom-btn">
      <el-button type="primary">提 交</el-button>
      <el-button type="success">预 览</el-button>
      <el-button type="warning">保 存</el-button>
    </div>
  </div>
</template>
<script>
import Editor from "@/components/Editor/index";
import {
  patentDetail,
  implementPlan,
  techArea,
  saveTechbg,
  planOutline,
  saveClaim,
  submit,
} from "@/api/table";
export default {
  components: { Editor },
  data() {
    return {
      number: [
        { number: "1", label: "一" },
        { number: "2", label: "二" },
        { number: "3", label: "三" },
        { number: "4", label: "四" },
        { number: "5", label: "五" },
        { number: "6", label: "三" },
        { number: "7", label: "一" },
        { number: "8", label: "二" },
        { number: "9", label: "三" },
      ],
      showTechList: false,
      detailData: {},
      toolList: ["攥写", "摘要", "附图", "预览"],
      currentTool: 0,
      showMainEdit: false,
      allContent: "",
      allContentTemp: `<h1 class="custom" style="text-align: center;">权 利 要 求 书</h1><hr style="border: 1px solid #000; background: #000;" size="1px" width="90%">
        <p>&nbsp;</p>
        <p >single</p>
        <h1 class="custom" style="text-align: center;">说 明 书</h1><hr style="border: 1px solid #000; background: #000;" size="1px" width="90%">
        `,
      mainContent:
        '<h1 class="custom" style="text-align: center;">说 明 书 摘 要</h1><hr width="90%" size="1px" style="border:1px solid #000;background:#000" /',
    };
  },
  created() {
    if (this.$route.query.id) {
      console.log("获取数据");
      this.getDetail(this.$route.query.id);
      // this.allContent = this.allContent.replace(/(7.1)/,"")
    } else {
      this.$$message.warning("缺少必需参数");
    }
  },
  methods: {
    getDetail(id) {
      patentDetail({ id }).then((res) => {
        console.log("res", res);
        this.detailData = res.data;
        this.claim = res.data.claim;
        this.handleClaim(res.data.claim);
      });
    },
    handleClaim(data) {
      console.log("claim", data);
      let name,
        childName,
        childKernel,
        kernel,
        str = "",
        childStr;
      data.forEach((item) => {
        if (item.no === item.parentNo && item.no === item.ancestorNo) {
          // 独权
          name = item.name;
          if (item.claimContent) {
            item.claimContent.forEach((childItem) => {
              kernel = kernel
                ? kernel + "," + childItem.kernel
                : childItem.kernel;
            });
            str += `${name}其特征在于${kernel}`;
          }
        } else {
          //从权
          console.log("item", item);
          childName = this.changeNumToHan(+item.name);
          if (item.claimContent) {
            item.claimContent.forEach((childItem) => {
              childKernel = childKernel
                ? childKernel + "," + childItem.kernel
                : childItem.kernel;
            });
            str += `<p>根据权利要求${childName}所述的${name},其特征在于${childKernel}</p>`;
            childKernel = null;
          }
          console.log("childKernel", childKernel);
        }
      });
      console.log("str", str);
      // console.log("str", str, this.allContentTemp);
      let content;
      content = this.allContentTemp.replace(/single/, str);
      // content = content.replace(/inner/, childStr);
      this.allContent = content;
      // console.log("all", this.allContent);
    },
    handleTool(index) {
      this.currentTool = index;
      console.log("#", `#box${index}`);
      this.$el.querySelector(`#box${index + 1}`).scrollIntoView();
    },
    handleMainEdit() {
      this.showMainEdit = true;
    },
    changeNumToHan(num) {
      var arr1 = ["零", "一", "二", "三", "四", "五", "六", "七", "八", "九"];
      var arr2 = [
        "",
        "十",
        "百",
        "千",
        "万",
        "十",
        "百",
        "千",
        "亿",
        "十",
        "百",
        "千",
        "万",
        "十",
        "百",
        "千",
        "亿",
      ];
      if (!num || isNaN(num)) return "零";
      var english = num.toString().split("");
      var result = "";
      for (var i = 0; i < english.length; i++) {
        var des_i = english.length - 1 - i; // 倒序排列设值
        result = arr2[i] + result;
        var arr1_index = english[des_i];
        result = arr1[arr1_index] + result;
      }
      result = result.replace(/零(千|百|十)/g, "零").replace(/十零/g, "十"); // 将【零千、零百】换成【零】 【十零】换成【十】
      result = result.replace(/零+/g, "零"); // 合并中间多个零为一个零
      result = result.replace(/零亿/g, "亿").replace(/零万/g, "万"); // 将【零亿】换成【亿】【零万】换成【万】
      result = result.replace(/亿万/g, "亿"); // 将【亿万】换成【亿】
      result = result.replace(/零+$/, ""); // 移除末尾的零
      // 将【一十】换成【十】
      result = result.replace(/^一十/g, "十");
      return result;
    },
  },
};
</script>
<style lang="scss" scoped>
.page {
  margin: 0 10px;
  .custom-title {
    font-weight: bold;
    margin-bottom: 20px;
  }
  .custom-tips {
    color: gray;
    font-size: 13px;
    margin: 10px 0 20px 0;
  }
}

#box1 {
  background: #fff;
  width: 100%;
  // min-height: 195vh;
  margin-top: 20px;
  box-shadow: -2px 2px 100px gainsboro;
  padding: 30px;
  border-radius: 8px;
  .box1-content {
    display: flex;
    flex-wrap: nowrap;
    .first-left {
      // width: 70%;
      flex: 1;
      align-items: center;
      .left-title {
        display: flex;
        justify-content: space-between;
        margin-bottom: 20px;
      }
    }
    .first-right {
      width: 25%;
      margin-left: 20px;
      padding: 0 20px;
      height: 640px;
      overflow-y: scroll;
      // border: 1px solid red;
      .content-item {
        margin: 10px 0 20px 0;
        &-title {
          margin-bottom: 8px;
        }
        &-text {
          margin-left: 14px;
        }
      }
    }
    .first-right-title {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 5px 0;
      margin-bottom: 20px;
      .custom-fold {
        cursor: pointer;
        display: inline-block;
        border: 1px solid #e5e6eb;
        padding: 5px 8px;
        font-size: 14px;
        border-radius: 10px;
      }
    }
  }
}
#box2 {
  margin-top: 20px;
  border-radius: 8px;
  background: #fff;
  box-shadow: -2px 2px 100px gainsboro;
  padding: 30px;
}
#box3 {
  margin-top: 20px;
  border-radius: 8px;
  background: #fff;
  box-shadow: -2px 2px 100px gainsboro;
  padding: 30px;
  .addimg {
    background: gainsboro;
    padding: 5px 8px;
  }
}

.left-tool {
  cursor: pointer;
  position: fixed;
  z-index: 10000;
  left: 0;
  top: 30vh;
  background: #fff;
  box-shadow: 1px 1px 10px gainsboro;
  border-top-right-radius: 8px;
  border-bottom-right-radius: 8px;
  padding: 10px 10px;
  div {
    text-align: center;
    padding: 8px 0;
    margin: 15px 0;
    width: 40px;
  }
  .active {
    border-bottom: 3px solid #409eff;
    color: #409eff;
  }
}
.bottom-btn {
  text-align: center;
  margin: 30px 0;
}
.main-edit {
  width: 100%;
  // height: 500px;
}
</style>
