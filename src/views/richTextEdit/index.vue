<template>
  <div class="page">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/case-list' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item><a>说明书编辑</a></el-breadcrumb-item>
      <el-breadcrumb-item>{{
        detailData.proposalName || "-"
      }}</el-breadcrumb-item>
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
            <div v-if="bigPicUrl" class="big-pic">
              <i
                class="el-icon-error close-bigPic"
                @click="() => (bigPicUrl = '')"
              ></i>
              <el-image :src="bigPicUrl"></el-image>
            </div>
            <div class="custom-title">说明书编辑</div>
            <el-button v-if="!showTechList" @click="showTechList = true"
              >查看技术交底</el-button
            >
          </div>
          <editor
            v-if="allContent"
            selectorId="edit1"
            @updateRichText="updateRichText"
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
              <div class="tool-item" @click="openFileList('domain')">
                <i class="el-icon-paperclip"></i>
                <span class="tool-label">附件列表</span>
              </div>
            </div>
            <div class="content-item">
              <div class="content-item-title">3.该领域存在什么痛点</div>
              <div class="content-item-text">
                {{ detailData.painPoint.text }}
                <div class="tool-item" @click="openFileList('painPoint')">
                  <i class="el-icon-paperclip"></i>
                  <span class="tool-label">附件列表</span>
                </div>
              </div>
            </div>
            <div class="content-item">
              <div class="content-item-title">4.当前是如何解决这些痛点的的</div>
              <div class="content-item-text">
                {{ detailData.currentSolution.text }}
                <div class="tool-item" @click="openFileList('currentSolution')">
                  <i class="el-icon-paperclip"></i>
                  <span class="tool-label">附件列表</span>
                </div>
              </div>
            </div>
            <div class="content-item">
              <div class="content-item-title">
                5.解决这些痛点的方案所存在的且本专利要解决的问题有哪些
              </div>
              <div class="content-item-text">
                {{ detailData.pendingDefect.text }}

                <div class="tool-item" @click="openFileList('pendingDefect')">
                  <i class="el-icon-paperclip"></i>
                  <span class="tool-label">附件列表</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div>
        <hr style="color: grey" />
        <div class="patent-name-box">
          <div class="patent-name-title">专利名称</div>
          <el-button @click="updatePatentName()">添加标记至文档</el-button>
        </div>
        <el-input
          style="max-width: 300px"
          placeholder="请输入专利名称"
          v-model="patentName"
        ></el-input>
      </div>
    </div>
    <div id="imgmark">
      <div class="patent-name-box">
        <div class="patent-name-title">附图标记</div>
        <el-button @click="addImgTextToRich('add')">添加标记至文档</el-button>
      </div>
      <!-- <div class="custom-title">附图标记</div> -->
      <div class="custom-tips" v-if="imgMarkList.length === 0">
        你还没有添加任何附图标记
      </div>
      <el-tree
        v-else
        style="margin-bottom: 20px"
        :data="imgMarkList"
        :props="defaultProps"
        :expand-on-click-node="false"
        :default-expand-all="true"
      >
        <span class="custom-tree-node" slot-scope="{ node, data }">
          <div class="custom-tree-row">
            <!-- <span
              v-if="data.nameEdit != 1"
              @click="treeEdit(node, data, 'name')"
              >{{ data.name }}</span
            > -->
            <el-input
              v-if="data.nameEdit != 1"
              ref="input"
              size="mini"
            
              v-model="data.name"
              style="max-width: 100px"
            ></el-input>
            <el-input
              v-if="data.nameEdit == 1"
              ref="input"
              size="mini"
              @blur="() => submitEdit(node, data, 'name')"
              v-model="labelValue"
              style="max-width: 100px"
            ></el-input>
            <span
              v-if="data.numberEdit != 1"
              style="margin-left: 10px; color: gray"
              >{{ data.number }}</span
            >
            <el-input
              v-if="data.numberEdit == 1"
              ref="input"
              size="mini"
              @blur="() => submitEdit(node, data, 'num')"
              v-model="labelValue"
              style="max-width: 100px"
            ></el-input>
            <span style="margin-left: 20px">
              <el-button
                type="text"
                size="mini"
                @click="treeEdit(node, data, 'num')"
              >
                添加编号
              </el-button>
              <el-button
                type="text"
                size="mini"
                @click="() => handleAppendChild(node, data)"
              >
                添加子集
              </el-button>
              <el-button
                type="text"
                size="mini"
                @click="() => handleRemoveTreeData(node, data)"
              >
                删除
              </el-button>
            </span>
          </div>
        </span>
      </el-tree>
      <span class="addimg" @click="handleImgMark">添加附图标记</span>
    </div>
    <div id="box2">
      <!-- <div class="custom-title">摘要</div> -->
      <div class="patent-name-box">
        <div class="patent-name-title">摘要</div>
        <el-button v-if="showMainEdit" @click="handleMainEdit"
          >重新生成摘要</el-button
        >
      </div>
      <div v-if="!showMainEdit" class="custom-tips">
        要编辑摘要，请先填写好上方的内容，再点击下方的生成摘要按钮
      </div>
      <el-button v-if="!showMainEdit" @click="handleMainEdit" type="primary"
        >生成摘要</el-button
      >
      <div v-show="showMainEdit" class="main-edit">
        <editor
          v-if="mainContent"
          ref="mainEdit"
          selectorId="mainEdit"
          @updateRichText="updateMainRichText"
          :defaultValue="mainContent"
        />
      </div>
    </div>
    <div id="box3">
      <!-- <div class="custom-title">附图</div> -->
      <div class="patent-name-box">
        <div class="patent-name-title" style="line-height: 20px">附图</div>
        <div class="main-add-img">
          <span
            class="el-icon-picture-outline"
            style="font-size: 10px"
            v-if="drawings.length"
            @click="handleUpload"
          ></span>
          <span class="addimg" v-if="drawings.length" @click="handleUpload"
            >添加附图</span
          >
        </div>
      </div>
      <div class="custom-tips" v-if="!drawings.length">你还没有任何附图</div>
      <span
        class="el-icon-picture-outline addimg"
        v-if="!drawings.length"
        @click="handleUpload"
        >添加附图</span
      >
      <draggable v-model="drawings">
        <transition-group>
          <div class="img-box" v-for="(item, index) in drawings" :key="index">
            <div :key="index" class="item-content">
              <el-image
                @click="handleBigPic(fileBaseUrl + item.url)"
                class="item-img"
                :src="fileBaseUrl + item.url"
              ></el-image>
              <div>{{ item.name }}</div>
            </div>
          </div>
        </transition-group>
      </draggable>
    </div>

    <div class="bottom-btn">
      <el-button type="primary" @click="handleSave('submit')">提 交</el-button>
      <el-button type="" @click="handleSave('preview')">预 览</el-button>
      <el-button type="plain" @click="handleSave('save')">保 存</el-button>
    </div>

    <upload-file
      v-if="showUpload"
      :show.sync="showUpload"
      @uploadFile="updateUploadFile"
      :imgList="drawings"
      :abstractUrl="abstractUrl"
    />
    <file-list
      :recordList="currentRecordList"
      :fileList="currentFileList"
      v-if="showFileList"
      :show.sync="showFileList"
    />
  </div>
</template>
<script>
import fileList from "./fileList";
import Editor from "@/components/Editor/index";
import uploadFile from "./uploadFile";
import draggable from "vuedraggable";
import { baseUrl } from "@/utils/baseUrl";
import {
  patentDetail,
  editDescription,
  download_description,
  submitData,
} from "@/api/table";
export default {
  components: { Editor, uploadFile, draggable, fileList },
  watch: {
    drawings(n, o) {
      console.log({
        n,
        o,
      });
      n.forEach((el, index) => {
        el.name = `图${index + 1}`;
      });
    },
  },
  data() {
    return {
      drawingsEdit:false,
      timer: null,
      abstractUrl: "",
      showFileList: false,
      bigPicUrl: "",
      fileBaseUrl: baseUrl(),
      drawings: [],
      showUpload: false,
      mainTextOverLimit: false,
      treeDataStr: "",
      futushuomingList:
        '<p><span style="text-decoration: underline;">附图说明</span></p>',
      // 默认标识符
      treeDataStrDefalut: "<p><span>&#x3000;&#x3000;附图说明</span></p>",
      labelValue: "",
      imgMarkList: [],
      patentName: "", //专利名称
      oldPatentName1: "patentName1", //标识符
      oldPatentName2: "patentName2", //标识符
      defaultProps: {
        children: "children",
        label: "label",
      },
      typeLabel: "", //类型。1.发明 2。实用类型
      showTechList: false,
      detailData: {},
      toolList: ["攥写", "摘要", "附图", "预览"],
      currentTool: 0,
      showMainEdit: false,
      allContent: "",
      allContentTemp: `<h1 class="custom" style="text-align: center;">权  利  要  求  书</h1>
      <hr style="border: 1px solid #000; background: #000;" size="0" width="100%">
        <p>&nbsp;</p>
        <p >single</p>
         <hr style="border: 1px solid #000; background: #000;" size="1px" width="100%">
        <h1 class="custom" style="text-align: center;">说 明 书</h1>
        <hr style="border: 1px solid #000; background: #000;" size="1px" width="100%">
        <h3 style="text-align: center;"><strong>patentName1</strong></h3>
        <p><span style="text-decoration: underline;">技术领域</span></p>
        <p>本typeLabel1属于techArea1技术领域，尤其涉及patentName2</p>
        <p><span style="text-decoration: underline;">背景技术</span></p>
        domainText
        painPointText
        currentSolutionText
        pendingDefectText
        patentContent
        <p><span style="text-decoration: underline;">附图说明</span></p>
        <p>&#x3000;&#x3000;主要元件符号说明：</p>
        <p><span>&#x3000;&#x3000;附图说明</span></p>
        <p><span style="text-decoration: underline;">具体实施方式</span></p>
        methodDescp
        ideaText
        methodWay
        endText
        `,
      mainContentTemplete: `<h1 class="custom" style="text-align: center;">说 明 书 摘 要</h1>
                    <hr style="border: 1px solid #000; background: #000;" size="1px" width="100%">
                    <p></p>
        `,
      mainContent: ``,
    };
  },
  created() {
    if (this.$route.query.id) {
      console.log("获取数据");
      this.fetchData(this.$route.query.id);
    } else {
      this.$message.warning("缺少必需参数");
    }
  },
  methods: {
    updateRichText(data) {
      // console.log("我更新啦", data);
      this.allContent = data.content;

      if (this.timer) {
        clearTimeout(this.timer);
      }
      this.timer = setTimeout(() => {
        this.handleSave("autosave");
      }, 1000);
    },
    updateMainRichText(data) {
      this.mainContent = data.content;
      this.mainTextOverLimit = false;

      if (this.timer) {
        clearTimeout(this.timer);
      }
      this.timer = setTimeout(() => {
        if (data.length > 320) {
          this.mainTextOverLimit = true;
          this.$message.error("说明书摘要内容不能超过300个字");
        }
        this.handleSave("autosave");
      }, 1000);
    },
    fetchData(id) {
      patentDetail({ id }).then((res) => {
        console.log("res", res);
        this.detailData = res.data;
        this.claim = res.data.claim;
        this.drawings = res.data.drawings;
        if(this.drawings.length){
          this.drawingsEdit = true;
        }
        this.typeLabel = res.data.type === "1" ? "发明" : "实用类型";
        this.abstractUrl = res.data.abstractUrl;
        if (res.data.abstract) {
          this.mainContent = res.data.abstract;
          // console.log("mainContent", this.mainContent);
          this.showMainEdit = true;
        }
        if (res.data.drawingReferences[0]) {
          this.imgMarkList = res.data.drawingReferences;
          this.addImgTextToRich("edit");
        }
        if (res.data.patentName) {
          this.patentName = res.data.patentName;
          this.oldPatentName1 = res.data.patentName;
          this.oldPatentName2 = res.data.patentName;
        }

        if (res.data.description) {
          this.allContent = res.data.description;
          return;
        }
        console.log("还会进来吗？");
        // 处理独权从权
        if (res.data.claim[0]) {
          this.handleClaim(res.data);
          this.addToRich("edit");
        } else {
          this.allContent = this.allContentTemp;
        }
      });
    },
    handleClaim(detail) {
      console.log("detail", detail);
      let name,
        childName,
        childKernel,
        kernel,
        note,
        typeLabel = this.typeLabel,
        str = "",
        index = 0,
        goodEffect = "",
        // 独权的顺序
        singleIndex = 0,
        methodStr = "",
        patentContentBox = "",
        patentContent = `<p>${typeLabel}内容</p>
        <p>&#x3000;&#x3000;本${typeLabel}提供${detail.claim[0].name},旨在解决${detail.pendingDefect?.text}的问题</p>`;
      detail.claim.forEach((item, dataIndex) => {
        if (item.goodEffect) {
          goodEffect = goodEffect
            ? goodEffect + "," + item.goodEffect
            : item.goodEffect;
        }
        console.log("patentContentBox 1", patentContentBox);
        if (item.no === item.parentNo && item.no === item.ancestorNo) {
          console.log("item", item);
          console.log("patentContentBox 2", patentContentBox);
          // 独权
          name = item.name;
          if (item.claimContent) {
            item.claimContent.forEach((childItem) => {
              kernel = kernel
                ? kernel + "," + childItem.kernel
                : childItem.kernel;
              note = note ? note + "," + childItem.note : childItem.note;
            });
            index += 1;
            singleIndex += 1;
            let indexToHan = this.changeNumToHan(dataIndex + 1);
            let singleIndexToHan = this.changeNumToHan(singleIndex);
            let nameStr = `实施例${indexToHan}`;
            methodStr += `<p>${nameStr}</p>`;
            methodStr += `<p>本${nameStr},提供${name},${kernel}</p>`;
            methodStr += `<p>${item.goodEffect}</p>`;
            methodStr += `<p>${note}</p>`;
            methodStr += `<p>${detail.fixDefectMethod.text}</p>`;

            if (patentContentBox) {
              //在下一个独权之前，数据拼接走， 把str清空
              patentContent += patentContentBox;
              patentContentBox = "";
            }
            patentContentBox += `<p>第${singleIndexToHan}方面，本${typeLabel}提供的是${name},${kernel}</p>`;

            str += `<p>${index}. ${name}其特征在于${kernel}</p>`;
            kernel = "";
            note = "";
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
              note = note ? note + "," + childItem.note : childItem.note;
            });
            let noStr = `实施例` + this.changeNumToHan(dataIndex + 1);
            methodStr += `<p>${noStr}</p>`;
            methodStr += `<p>在实施例${childName}的基础上,本${noStr}的${childKernel}</p>`;
            methodStr += `<p>${item.goodEffect}</p>`;
            methodStr += `<p>${note}</p>`;
            methodStr += `<p>${detail.fixDefectMethod.text}</p>`;

            patentContentBox += `<p>可选地，${childKernel}</p>`;

            index += 1;
            str += `<p>${index}. 根据权利要求${childName}所述的${name},其特征在于${childKernel}</p>`;
            childKernel = "";
            note = "";
          }
          console.log("patentContentBox", patentContentBox);
          console.log("childKernel", childKernel);
        }
        // 防止最后一个的数据没提交上去length
        if (dataIndex + 1 === detail.claim.length) {
          console.log("我是最后一个了", patentContentBox, item);
          patentContent += patentContentBox;
          patentContentBox = "";
        }
      });
      // console.log("str", str);
      // console.log("methodStr", methodStr);
      // console.log("str", str, this.allContentTemp);
      let content;
      //把有益效果插入在patentContent的最后面
      patentContent += `<p>${goodEffect}</p>`;
      // console.log('patentContent',patentContent)
      content = this.allContentTemp.replace(/single/, str);
      content = content.replace(/patentContent/, patentContent);
      content = content.replace(/methodWay/, methodStr);
      // content = content.replace(/inner/, childStr);
      // console.log("content", content);
      this.allContent = content;
      // console.log("all", this.allContent);
    },
    handleTool(index) {
      this.currentTool = index;
      if (index === 3) {
        this.handleSave("preview");
        return;
      }
      this.$el.querySelector(`#box${index + 1}`).scrollIntoView();
    },
    handleMainEdit() {
      this.mainContent = "";
      this.$nextTick(() => {
        this.mainContent = this.mainContentTemplete;
        this.showMainEdit = true;
      });
    },
    addToRich(type) {
      // 有一个问题。这里找不到他的替换标识了，被编辑的问题所覆盖。要想个解决方案。
      var content = this.allContent;
      this.allContent = "";
      const typeLabel = this.typeLabel;
      console.log("patentName", this.patentName);
      const domainText = this.detailData?.domain.text,
        techAreaText = this.detailData.techArea,
        painPointText = this.detailData?.painPoint.text,
        currentSolutionText = this.detailData?.currentSolution.text,
        pendingDefectText = this.detailData?.pendingDefect.text,
        ideaText = this.detailData?.idea.text,
        endText = `以上仅为本${typeLabel}的较佳实施例而已，并不用以限制本${typeLabel}，凡在本${typeLabel}的精神和原则之内所作的任何修改、等同替换和改进等，均应包含在本${typeLabel}的保护范围之内。`,
        methodDesc = `为了使本${typeLabel}的目的、
            技术方案及优点更加清楚明白，以下结合附图及实施例，对本
            ${typeLabel}进行进一步详细说明。应当理解，此处所描述的具体实施例仅仅用以解释本${typeLabel}，并不用于限定本${typeLabel}。
            `;
      let typeLabel1 = type === "edit" ? "typeLabel1" : typeLabel;
      let typeLabel1Exp = new RegExp(typeLabel1);
      content = content.replace(typeLabel1Exp, `${typeLabel}`);
      let techArea1 = type === "edit" ? "techArea1" : techAreaText;
      let techArea1Exp = new RegExp(techArea1);
      content = content.replace(techArea1Exp, `${techAreaText}`);
      content = content.replace(
        /domainText/,
        `<p style="padding-left:40px">${domainText}</p>`
      );
      content = content.replace(
        /painPointText/,
        `<p style="padding-left:40px">${painPointText}</p>`
      );
      content = content.replace(
        /currentSolutionText/,
        `<p style="padding-left:40px">${currentSolutionText}</p>`
      );
      content = content.replace(
        /pendingDefectText/,
        `<p style="padding-left:40px">${pendingDefectText}</p>`
      );
      // 实现方案
      content = content.replace(/methodDesc/, `<p>${methodDesc}</p>`);
      // 方案概述
      content = content.replace(/ideaText/, `<p>${ideaText}</p>`);
      content = content.replace(/endText/, `<p>${endText}</p>`);
      this.$nextTick(() => {
        this.allContent = content;
        // console.log("this.allContent", this.allContent);
      });
    },
    updatePatentName() {
      const patentName = this.patentName;
      let content = this.allContent;
      this.allContent = "";
      let patentName1 = this.oldPatentName1;
      let patentName2 = `尤其涉及${this.oldPatentName2}`;
      let patentName1Exp = new RegExp(patentName1);
      let patentName2Exp = new RegExp(patentName2);
      console.log({ patentName, patentName1, patentName2 });
      content = content.replace(patentName1Exp, patentName);
      content = content.replace(patentName2Exp, `尤其涉及${patentName}`);
      this.$nextTick(() => {
        this.allContent = content;
        this.handleSave("updatePatentName");
      });
    },
    handleRichText() {
      let zhaiyaoImg = `<h1 class="custom" style="text-align: center;">附 图 摘 要</h1>
                    <hr style="border: 1px solid #000; background: #000;" size="1px" width="100%">
        `;
      if (this.abstractUrl) {
        const imgUrl = baseUrl() + this.abstractUrl;
        zhaiyaoImg += `<p><img src="${imgUrl}" /</p>`;
      }
      let firstSingleName = "";
      if (this.claim[0]) {
        firstSingleName = this.claim[0].name;
      }
      let textStr = `<p><span style="text-decoration: underline;">附图说明</span></p>`;
      let imgStr = "";
      this.drawings.forEach((item) => {
        textStr += `<p>${item.name}是本${this.typeLabel}实施例（或者现有技术）提供的${firstSingleName}的（流程）示意图</p>`;
        const imgUrl = baseUrl() + item.url;
        imgStr += `<p ><img src="${imgUrl}" /><div style="text-align:center;">${item.name}</div></p>`;
      });
      console.log({ textStr, imgStr });
      let content = this.allContent;
      let futushuomingList = this.futushuomingList;

      let futushuomingListExp = new RegExp(futushuomingList);

      content = content.replace(futushuomingListExp, `${textStr}`);
      if(!this.drawingsEdit){
        this.allContent = content;
      }

      const shuomingshuImg = `
              <hr style="border: 1px solid #000; background: #000;" size="1px" width="100%">
              <h1 class="custom" style="text-align: center;">说 明 书 附 图</h1>
              <hr style="border: 1px solid #000; background: #000;" size="1px" width="100%">
              ${imgStr}
        `;
      var richText =
        this.mainContent + zhaiyaoImg + this.allContent + shuomingshuImg;
      // 去除所有的格式
      richText = richText.replace(/color/g, "");
      return richText;
    },
    handleSave(type) {
      // 自动保存或者保存其他数据不提示
      // savesave
      if (
        this.mainTextOverLimit &&
        ["save", "preview", "submit"].includes(type)
      ) {
        this.$message.error("说明书摘要内容不能超过300个字");
      }
      const richText = this.handleRichText();
      const params = {
        id: this.detailData.id,
        patentName: this.patentName,
        description: this.allContent,
        drawingReferences: this.imgMarkList,
        drawings: this.drawings,
        abstract: this.mainContent,
        abstractUrl: this.abstractUrl,
        richText: richText,
      };
      editDescription(params)
        .then((res) => {
          if (type === "save") {
            this.$message.success("保存成功");
          } else if (type === "preview") {
            this.handlePreview();
            return;
          } else if (type === "submit") {
            if (this.mainTextOverLimit) {
              this.$message.error("说明书摘要内容超过300个字不能提交，请修改");
              return;
            }
            this.handleSubmitData();
          } else if (type === "updatePatentName") {
          }
          this.fetchData(this.detailData.id);
        })
        .catch((err) => {
          this.$message.error(err.message || "服务器繁忙，请稍后重试");
        });
    },
    handleSubmitData() {
      this.$confirm("提交后将进入审核流程，文档不能再次编辑", "提示", {
        confirmButtonText: "提交",
        cancelButtonText: "返回编辑",
        type: "warning",
      }).then(() => {
        submitData({
          id: this.detailData.id,
        })
          .then((res) => {
            this.$message.success("提交成功");
            this.$router.push({ path: "case-list" });
          })
          .catch((err) => {
            this.$message.error(err.message);
          });
      });
    },
    handleImgMark() {
      const id = this.imgMarkList.length + 1;
      this.imgMarkList.push({
        name: "",
        id: id,
        nameEdit: 0,
        number: "",
        numberEdit: 0,
        parentId: id,
        children: [],
      });
      console.log("this", this.imgMarkList);
    },
    handleAppendChild(node, data) {
      console.log("node,data", node, data);
      let parentId = data.id;
      let id = +(parentId + "" + (data.children.length + 1));
      data.children.push({
        name: "",
        id: id,
        number: "",
        parentId: parentId,
        children: [],
      });
      console.log("this", this.imgMarkList);
    },
    handleRemoveTreeData(node, data) {
      console.log({ node, data });
      this.$confirm("删除当前数据，会将子级数据一起删除，确定删除吗", "提示", {
        confirmButtonText: "确定删除",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        const parent = node.parent;
        const children = parent.data.children || parent.data;
        const index = children.findIndex((d) => d.id === data.id);
        children.splice(index, 1);
      });
    },
    getRandom(length) {
      var randomStr = "1234567890";
      // "1234567890abcdefghijklnmopqovwrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
      var str = "";
      for (let i = 0; i < length; i++) {
        str += randomStr[parseInt(Math.random() * 65)];
      }
      return str;
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
    handlePreview() {
      // type:1pdf 2docx
      const params = {
        id: this.detailData.id,
        type: 1,
      };
      this.startLoading();
      download_description(params)
        .then((res) => {
          console.log("res", res);
          this.closeLoading();
          window.open(this.fileBaseUrl + res.data.url);
        })
        .catch((err) => {
          this.closeLoading();
        });
    },
    startLoading() {
      this.loading = this.$loading({
        lock: true,
        text: "生成预览中，请耐心等候",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.8)",
      });
    },
    /**关闭loading**/
    closeLoading() {
      this.loading.close();
    },
    treeEdit(node, data, type) {
      // setTimeout(() => {
      //   this.labelValue = "";
      // }, 400);
      if (type === "name") {
        this.$set(data, "nameEdit", 1);
        this.labelValue = data.name;
        this.$nextTick(() => {
          console.log("this.$refs.input", this.$refs, data);
          this.$refs.input.focus();
        });
      } else {
        this.$set(data, "numberEdit", 1);
        this.labelValue = data.number;
        this.$nextTick(() => {
          this.$refs.input.focus();
        });
      }
    },
    submitEdit(node, data, type) {
      console.log("2222");
      if (type === "name") {
        console.log("name点击了保存按钮", this.labelValue);
        if (data.name == this.labelValue) {
          console.log("没有修改");
          this.labelValue = "";
          this.$set(data, "nameEdit", 0);
        } else {
          console.log("1", data, this.labelValue);
          this.$set(data, "name", this.labelValue);
          this.$set(data, "nameEdit", 0);
          console.log("data", data);
          this.labelValue = "";
        }
      } else {
        console.log("num点击了保存按钮");
        if (data.number == this.labelValue) {
          console.log("没有修改");
          this.labelValue = "";
          this.$set(data, "numberEdit", 0);
        } else {
          this.$set(data, "number", this.labelValue);
          this.labelValue = "";
          this.$set(data, "numberEdit", 0);
        }
      }
      console.log("this.imgMarkList", this.imgMarkList);
    },
    addImgTextToRich(type) {
      this.treeDataStr = "";
      this.handleImgMarkList(this.imgMarkList);
      console.log("treeDataStr", this.treeDataStr);
      if (type === "add") {
        console.log("添加到富文本");
        this.handleChangeImgStr(this.treeDataStr);
      } else {
        this.treeDataStrDefalut = `${this.treeDataStr}`;
        console.log("编辑设置默认标识符", this.treeDataStrDefalut);
      }
    },
    handleImgMarkList(data) {
      data.forEach((el) => {
        this.treeDataStr = this.treeDataStr
          ? this.treeDataStr + "，" + el.name + el.number
          : this.treeDataStr + el.name + el.number;
        if (el.children) {
          this.handleImgMarkList(el.children);
        }
      });
    },
    handleChangeImgStr(str) {
      // <p data-str="imgStr"></p>
      let content = this.allContent;
      this.allContent = "";
      const richStr = this.treeDataStrDefalut;
      let aExp = new RegExp("a");
      let stg1Exp = new RegExp(richStr);
      //新增以附图标识为标识符，加回去
      if (richStr === "<p><span>&#x3000;&#x3000;附图说明</span></p>") {
        content = content.replace(
          stg1Exp,
          `<p><span>&#x3000;&#x3000;附图说明</span></p><p>&#x3000;&#x3000;${str}</p>`
        );
      } else {
        // 编辑就覆盖文本
        content = content.replace(stg1Exp, `<p>${str}</p>`);
      }

      this.treeDataStrDefalut = str;
      // console.log("content", content);
      this.$nextTick(() => {
        this.allContent = content;
        // this.handleSave("saveTreeData");
      });
    },
    handleUpload() {
      this.showUpload = true;
    },
    updateUploadFile(data) {
      console.log("data", data);
      this.abstractUrl = data;

      this.handleSave("savePic");
    },
    handleBigPic(url) {
      console.log("url", url);
      this.bigPicUrl = url;
    },
    openFileList(type) {
      this.currentRecordList = this.detailData[type].recordFiles;
      this.currentFileList = this.detailData[type].attachments;
      this.showFileList = true;
    },
  },
};
</script>
<style lang="scss" scoped>
::v-deep .el-tree-node .el-tree-node__content {
  height: 40px;
}
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
  // box-shadow: -2px 2px 100px gainsboro;
  border: 1px solid #f2f3f5;
  padding: 24px;
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
#imgmark {
  margin-top: 20px;
  border-radius: 8px;
  background: #fff;
  border: 1px solid #f2f3f5;
  // box-shadow: -2px 2px 100px gainsboro;
  padding: 24px;
}
#box2 {
  margin-top: 20px;
  border-radius: 8px;
  background: #fff;
  // box-shadow: -2px 2px 100px f2f3f5;
  border: 1px solid #f2f3f5;
  padding: 24px;
}
#box3 {
  margin-top: 20px;
  border-radius: 8px;
  background: #fff;
  // box-shadow: -2px 2px 100px gainsboro;
  border: 1px solid #f2f3f5;
  padding: 24px;
}
.main-add-img {
  display: inline-block;
  // height: 20px;
  padding: 5px 4px 5px 16px;
  background: #f2f3f5;
  font-size: 14px;
}
.addimg {
  cursor: pointer;
  background: #f2f3f5;
  padding: 5px 12px;
  font-size: 14px;
  line-height: 22px;
  // margin-left:10px;
}
.left-tool {
  cursor: pointer;
  position: fixed;
  z-index: 1888;
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
.patent-name-box {
  display: flex;
  margin-bottom: 10px;
  justify-content: space-around;
  align-self: center;
  .patent-name-title {
    flex: 1;
    line-height: 40px;
  }
}
.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
  .custom-tree-row {
    // margin:20px 0;
  }
}

.img-box {
  // display: flex;
  // flex-wrap: wrap;
  display: inline-block;
  width: 81px;
  margin-right: 20px;
  margin-top: 20px;

  .item-content {
    // display: inline-block;
    // margin-right: 20px;
    // margin-top: 20px;
  }
  .item-img {
    width: 81px;
    height: 81px;
    border-radius: 4px;
  }
}
.tool-item {
  display: block;
  width: 150px;
  padding: 5px 20px;
  background: #f2f3f5;
  margin-left: 15px;
  cursor: pointer;
  margin-top: 20px;
}
.tool-label {
  margin-left: 10px;
}
.big-pic {
  position: fixed;
  top: 100px;
  right: 20px;
  width: 182px;
  height: 182px;
  z-index: 9998;
}
.close-bigPic {
  position: relative;
  top: 10px;
  left: -15px;
  font-size: 26px;
  z-index: 9999;
  cursor: pointer;
  color: red;
}
</style>
