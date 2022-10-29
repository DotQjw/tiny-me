<template>
  <div class="rich-edit-page">
    <!-- <el-breadcrumb separator="/">
      <el-breadcrumb-item><a @click="gotoIndex">首页</a></el-breadcrumb-item>
      <el-breadcrumb-item><a>说明书编辑</a></el-breadcrumb-item>
      <el-breadcrumb-item>{{
        detailData.proposalName || "-"
      }}</el-breadcrumb-item>
    </el-breadcrumb> -->
    <div class="header-title">
      <div>
        <div @click="gotoIndex" class="icon_back">
          <i class="el-icon-arrow-left"></i>返回
        </div>
        <div class="title-name" :title="proposalName">{{ proposalName }}</div>
      </div>
      <div class="bottom-btn">
        <el-button @click="handleSave('save')" style="color: #1d2129"
          >保 存</el-button
        >
        <el-button @click="handleSave('preview')" style="color: #1d2129"
          >预 览</el-button
        >
        <el-button type="primary" @click="handleSave('submit')"
          >提交审核</el-button
        >
      </div>
    </div>

    <div class="page-con">
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
                ></i
                >mini
                <el-image :src="bigPicUrl"></el-image>
              </div>
              <div class="custom-title">说明书编辑</div>
              <el-button
                v-if="!showTechList"
                size="mini"
                style="margin-bottom: 20px"
                @click="showTechList = true"
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
              <div class="custom-title">技术交底</div>
              <el-button
                size="mini"
                style="margin-bottom: 20px"
                @click="showTechList = false"
                >收起</el-button
              >
            </div>
            <div class="right-content">
              <div class="content-item">
                <div
                  class="content-item-title"
                  @click="handleChangeStatus('techArea')"
                >
                  <span class="right-title">
                    1.技术领域：<span class="right-content-item">
                      {{ detailData.techArea }}</span
                    >
                  </span>
                  <span
                    class="right-warning"
                    v-if="modifiedFields && modifiedFields.includes('techArea')"
                  >
                    <i class="el-icon-warning-outline"></i>
                    有变动
                  </span>
                </div>
              </div>
              <div class="content-item">
                <div class="content-item-title">
                  <span class="right-title"> 2.本专利应用在哪个领域 </span>
                  <span
                    class="right-warning"
                    v-if="modifiedFields && modifiedFields.includes('domain')"
                  >
                    <i class="el-icon-warning-outline"></i>
                    有变动
                  </span>
                </div>
                <div
                  class="content-item-text"
                  @click="handleChangeStatus('domain')"
                >
                  {{ (detailData.domain && detailData.domain.text) || "" }}

                  <div
                    class="file-list-tool"
                    @click="openFileList('domain')"
                    v-if="
                      detailData.domain &&
                      (detailData.domain.attachments.length ||
                        detailData.domain.recordFiles.length)
                    "
                  >
                    <div class="tool-item">
                      <i class="el-icon-paperclip"></i>
                      <span class="tool-label">附件列表</span>
                    </div>
                    <i class="el-icon-arrow-down custom-arrow-down"></i>
                  </div>
                </div>
              </div>
              <div class="content-item">
                <div class="content-item-title">
                  3.该领域存在什么痛点
                  <span
                    class="right-warning"
                    v-if="
                      modifiedFields && modifiedFields.includes('painPoint')
                    "
                  >
                    <i class="el-icon-warning-outline"></i>
                    有变动
                  </span>
                </div>
                <div
                  class="content-item-text"
                  @click="handleChangeStatus('painPoint')"
                >
                  {{
                    (detailData.painPoint && detailData.painPoint.text) || ""
                  }}
                  <div
                    class="file-list-tool"
                    @click="openFileList('painPoint')"
                    v-if="
                      detailData.painPoint &&
                      (detailData.painPoint.attachments.length ||
                        detailData.painPoint.recordFiles.length)
                    "
                  >
                    <div class="tool-item">
                      <i class="el-icon-paperclip"></i>
                      <span class="tool-label">附件列表</span>
                    </div>
                    <i class="el-icon-arrow-down custom-arrow-down"></i>
                  </div>
                </div>
              </div>
              <div class="content-item">
                <div class="content-item-title">
                  4.当前是如何解决这些痛点的
                  <span
                    class="right-warning"
                    v-if="
                      modifiedFields &&
                      modifiedFields.includes('currentSolution')
                    "
                  >
                    <i class="el-icon-warning-outline"></i>
                    有变动
                  </span>
                </div>
                <div
                  class="content-item-text"
                  @click="handleChangeStatus('currentSolution')"
                >
                  {{
                    (detailData.currentSolution &&
                      detailData.currentSolution.text) ||
                    ""
                  }}
                  <div
                    class="file-list-tool"
                    @click="openFileList('currentSolution')"
                    v-if="
                      detailData.currentSolution &&
                      (detailData.currentSolution.attachments.length ||
                        detailData.currentSolution.recordFiles.length)
                    "
                  >
                    <div class="tool-item">
                      <i class="el-icon-paperclip"></i>
                      <span class="tool-label">附件列表</span>
                    </div>
                    <i class="el-icon-arrow-down custom-arrow-down"></i>
                  </div>
                </div>
              </div>
              <div class="content-item">
                <div class="content-item-title">
                  5.解决这些痛点的方案所存在的且本专利要解决的问题有哪些
                  <span
                    class="right-warning"
                    v-if="
                      modifiedFields && modifiedFields.includes('pendingDefect')
                    "
                  >
                    <i class="el-icon-warning-outline"></i>
                    有变动
                  </span>
                </div>
                <div
                  class="content-item-text"
                  @click="handleChangeStatus('pendingDefect')"
                >
                  {{
                    (detailData.pendingDefect &&
                      detailData.pendingDefect.text) ||
                    ""
                  }}

                  <div
                    class="file-list-tool"
                    @click="openFileList('pendingDefect')"
                    v-if="
                      detailData.pendingDefect &&
                      (detailData.pendingDefect.attachments.length ||
                        detailData.pendingDefect.recordFiles.length)
                    "
                  >
                    <div class="tool-item">
                      <i class="el-icon-paperclip"></i>
                      <span class="tool-label">附件列表</span>
                    </div>
                    <i class="el-icon-arrow-down custom-arrow-down"></i>
                  </div>
                </div>
              </div>
              <div class="content-item">
                <div class="content-item-title">
                  6.本专利如何解决上述缺陷的？
                  <span
                    class="right-warning"
                    v-if="
                      modifiedFields &&
                      modifiedFields.includes('fixDefectMethod')
                    "
                  >
                    <i class="el-icon-warning-outline"></i>
                    有变动
                  </span>
                </div>
                <div
                  class="content-item-text"
                  @click="handleChangeStatus('fixDefectMethod')"
                >
                  {{
                    (detailData.fixDefectMethod &&
                      detailData.fixDefectMethod.text) ||
                    ""
                  }}

                  <div
                    class="file-list-tool"
                    @click="openFileList('fixDefectMethod')"
                    v-if="
                      detailData.fixDefectMethod &&
                      (detailData.fixDefectMethod.attachments.length ||
                        detailData.fixDefectMethod.recordFiles.length)
                    "
                  >
                    <div class="tool-item">
                      <i class="el-icon-paperclip"></i>
                      <span class="tool-label">附件列表</span>
                    </div>
                    <i class="el-icon-arrow-down custom-arrow-down"></i>
                  </div>
                </div>
              </div>
              <div class="content-item">
                <div class="content-item-title">
                  7.权利要求书
                  <span
                    class="right-warning"
                    v-if="modifiedFields && modifiedFields.includes('claims')"
                  >
                    <i class="el-icon-warning-outline"></i>
                    有变动
                  </span>
                </div>
                <div
                  class="content-item-text"
                  @click="handleChangeStatus('claims')"
                  v-for="(item, index) in detailData.claim"
                  :key="index"
                >
                  <div class="claim-title">
                    {{ index + 1 }}：{{ item.name }}
                  </div>
                  <div class="kernel-box">
                    <template
                      v-for="(childItem, childIndex) in item.claimContent"
                    >
                      <div class="kernel-item" :key="childIndex">
                        <div class="kernel-item-row">
                          <div>内核{{ childIndex + 1 }}：</div>
                          <div>{{ childItem.kernel }}</div>
                        </div>
                        <div class="kernel-item-note">
                          <div>备注：</div>
                          <div>{{ childItem.note }}</div>
                        </div>
                      </div>
                    </template>
                    <div
                      class="kernel-item-tool"
                      v-if="detailData.claim[index].attachments.length"
                    >
                      <div @click="openClaimFileList(index)">
                        <div class="tool-item tool-item1">
                          <i class="el-icon-paperclip"></i>
                          <span class="tool-label">附件列表</span>
                        </div>
                        <i class="el-icon-arrow-down custom-arrow-down"></i>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div>
          <div class="cut-line"></div>
          <div class="patent-name-box">
            <div class="patent-name-title">专利名称</div>
            <el-button @click="updatePatentName()">添加名称至文档</el-button>
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
          <el-button :loading="replaceLoading" @click="replaceText('add')"
            >替换内容</el-button
          >
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
          <!-- <span
            class="addimg"
            style="margin-right: 10px"
            @click="handleTextToRich"
            >添加文本到文档</span
          > -->
          <el-button style="margin-right: 10px" @click="handleTextToRich">
            添加文本到文档
          </el-button>
          <el-button @click="handleUpload"> 添加附图 </el-button>
          <!-- <div class="main-add-img" v-if="drawings.length">
            <span
              class="el-icon-picture-outline"
              style="font-size: 10px"
              @click="handleUpload"
            ></span>
            <span class="addimg" @click="handleUpload">添加附图</span>
          </div> -->
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
  clearRedPoint,
} from "@/api/table";
export default {
  components: { Editor, uploadFile, draggable, fileList },
  watch: {
    drawings(n, o) {
      n.forEach((el, index) => {
        el.name = `图${index + 1}`;
      });
    },
  },
  data() {
    return {
      claimStr: "",
      changeStatusLoading: false,
      modifiedFields: [],
      replaceLoading: false,
      haveNewContent: false,
      richTextUpdata: 0,
      timer: null,
      abstractUrl: "",
      showFileList: false,
      bigPicUrl: "",
      fileBaseUrl: baseUrl(),
      drawings: [],
      showUpload: false,
      mainTextOverLimit: false,
      treeDataStr: "",
      // 默认标识符
      treeDataStrDefalut: "<p><span>&#x3000;&#x3000;附图说明</span></p>",
      labelValue: "",
      imgMarkList: [],
      patentName: "", //专利名称
      defaultProps: {
        children: "children",
        label: "label",
      },
      typeLabel: "", //类型。1.发明 2。实用新型
      showTechList: true,
      detailData: {},
      toolList: ["正文", "摘要", "附图", "预览"],
      currentTool: 0,
      showMainEdit: false,
      allContent: "",
      allContentTemp: `<h1 class="custom" style="text-align: center;">权  利  要  求  书</h1><hr style="border: 1px solid #000; background: #000;" size="1px" width="100%">
        <p>single</p>
        <h1 class="custom" style="text-align: center;">说 明 书</h1>
        <hr style="border: 1px solid #000; background: #000;" size="1px" width="100%">
        <h2 style="text-align: center;"><strong>patentName1</strong></h2>
        <h3 style="text-decoration: underline;">技术领域</h3>
        <p>&#x3000;&#x3000;本typeLabel1属于techArea1领域，尤其涉及patentName2。</p>
        <h3 style="text-decoration: underline;">背景技术</h3>
        domainText
        painPointText
        currentSolutionText
        pendingDefectText
        patentContent
        <h3 style="text-decoration: underline;">附图说明</h3>
        <p>&#x3000;&#x3000;主要元件符号说明：</p><h3 style="text-decoration: underline;">具体实施方式</h3>
        methodDesc
        ideaText
        methodWay
        endText
        `,
      mainContentTemplete: `<h1 class="custom" style="text-align: center;">说 明 书 摘 要</h1>
                    <hr style="border: 1px solid #000; background: #000;" size="1px" width="100%">
        `,
      mainContent: ``,
      proposalName: "",
    };
  },
  created() {
    this.proposalName = this.$route.query.proposalName;
    if (this.$route.query.id) {
      this.fetchData(this.$route.query.id);
    } else {
      this.$message.warning("缺少必需参数");
    }
  },
  methods: {
    gotoIndex() {
      if (this.haveNewContent) {
        this.$confirm("你可能有尚未保存的更改内容，是否退出", "提示", {
          confirmButtonText: "保存并且退出",
          cancelButtonText: "直接退出",
          type: "warning",
        })
          .then((_) => {
            this.handleSave("quitSave");
          })
          .catch((_) => {
            this.handleQuit();
          });
      } else {
        this.handleQuit();
      }
    },
    handleTextToRich() {
      let textStr = "";
      this.drawings.map((item, index) => {
        textStr += `<p>&#x3000;&#x3000;${item.name}${item.desc}</p>`;
      });
      let content = this.allContent;
      // 清理标签之间的空格。不然正则匹配不到
      content = content.replace(/<\/p>\r?\n|(?<!\n)\r/g, "</p>");
      content = content.replace(/<\/h3>\r?\n|(?<!\n)\r/g, "</h3>");
      let textReg =
        /<h3 style="text-decoration: underline;">附图说明<\/h3>.*?主要元件符号说明：<\/p>/g;
      content = content.replace(textReg, (str) => {
        return `<h3 style="text-decoration: underline;">附图说明</h3>${textStr}<p>&#x3000;&#x3000;主要元件符号说明：</p>`;
      });
      this.$nextTick(() => {
        this.allContent = content;
        this.handleSave("ImgtextToRich");
      });
    },
    handleQuit() {
      this.$router.push({ path: "/case-list", query: { active: "case" } });
    },
    updateRichText(data) {
      this.allContent = data.content;
      this.haveNewContent = true;
      if (this.timer) {
        clearTimeout(this.timer);
      }
      this.timer = setTimeout(() => {
        this.handleSave("autosave");
      }, 1000);
    },
    updateMainRichText(data) {
      this.haveNewContent = true;
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
        this.detailData = res.data;
        this.claim = res.data.claim;
        this.handleClaimToRightText(this.claim);
        this.drawings = res.data.drawings;
        this.typeLabel = res.data.type == "1" ? "发明" : "实用新型";
        this.modifiedFields = res.data.modifiedFields || [];
        this.abstractUrl = res.data.abstractUrl;
        if (res.data.abstract) {
          this.mainContent = res.data.abstract;
          this.showMainEdit = true;
        }
        if (res.data.drawingReferences[0]) {
          this.imgMarkList = res.data.drawingReferences;
        }
        if (res.data.patentName) {
          this.patentName = res.data.patentName;
        }

        if (res.data.description) {
          this.allContent = res.data.description;
          return;
        }
        console.log("新增才会走下面");
        // 处理独权从权
        if (res.data.claim[0]) {
          this.handleClaim(res.data);
          this.addToRich("edit");
        } else {
          this.allContent = this.allContentTemp;
        }
      });
    },
    handleClaimToRightText(data) {
      let name = "",
        methodStr = "",
        kernel = "",
        childKernel = "",
        childName = "",
        note = "",
        index = 0;
      data.forEach((item, dataIndex) => {
        if (item.no === item.parentNo && item.no === item.ancestorNo) {
          // 独权
          name = item.name;
          if (item.claimContent) {
            item.claimContent.forEach((childItem) => {
              kernel = kernel
                ? kernel + "，" + childItem.kernel
                : childItem.kernel;
              note = note ? note + "，" + childItem.note : childItem.note;
            });
            index += 1;
            let indexToHan = this.changeNumToHan(dataIndex + 1);
            let nameStr = `实施例${indexToHan}`;
            methodStr += `${nameStr}<br/>`;
            methodStr += `本${nameStr}提供${name}，${kernel}<br/>`;
            methodStr += `${item.goodEffect}<br/>`;
            methodStr += `${note}`;
            kernel = "";
            note = "";
          }
        } else {
          //从权
          childName = this.changeNumToHan(+item.name);
          if (item.claimContent) {
            item.claimContent.forEach((childItem) => {
              childKernel = childKernel
                ? childKernel + "，" + childItem.kernel
                : childItem.kernel;
              note = note ? note + "，" + childItem.note : childItem.note;
            });
            let noStr = `实施例` + this.changeNumToHan(dataIndex + 1);
            methodStr += `${noStr}<br/>`;
            methodStr += `本${noStr}的${childKernel}<br/>`;
            methodStr += `${item.goodEffect}<br/>`;
            methodStr += `${note}<br/>`;
            index += 1;
            childKernel = "";
            note = "";
          }
        }
      });
      console.log("methodStr", methodStr);
      this.claimStr = methodStr;
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
        ideaText = detail.idea ? detail.idea.text : "",
        patentContent = `<p>${typeLabel}内容</p>
        <p>&#x3000;&#x3000;本${typeLabel}提供${detail.claim[0].name}，旨在解决${detail.pendingDefect?.text}的问题。</p>`;
      detail.claim.forEach((item, dataIndex) => {
        if (item.goodEffect) {
          goodEffect = goodEffect
            ? goodEffect + "，" + item.goodEffect
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
                ? kernel + `<p>&#x3000;&#x3000;${childItem.kernel}</p>`
                : `${childItem.kernel}</p>`;
              note = note ? note + "，" + childItem.note : childItem.note;
            });
            index += 1;
            singleIndex += 1;
            let indexToHan = this.changeNumToHan(dataIndex + 1);
            let singleIndexToHan = this.changeNumToHan(singleIndex);
            let nameStr = `实施例${indexToHan}`;
            methodStr += `<p>${nameStr}</p>`;
            methodStr += `<p>&#x3000;&#x3000;本实施例提供${name}，${kernel}`;
            methodStr += `<p>&#x3000;&#x3000;${item.goodEffect}</p>`;
            methodStr += `<p>&#x3000;&#x3000;${note}</p>`;
            // methodStr += `<p>&#x3000;&#x3000;${detail.fixDefectMethod.text}</p>`;

            if (patentContentBox) {
              //在下一个独权之前，数据拼接走， 把str清空
              patentContent += patentContentBox;
              patentContentBox = "";
            }
            patentContentBox += `<p>&#x3000;&#x3000;第${singleIndexToHan}方面，本${typeLabel}提供的是${name}，${kernel}`;
            console.log("kernel", kernel);
            str += `<p>&#x3000;&#x3000;${index}. ${name}，其特征在于，${kernel}`;
            kernel = "";
            note = "";
          }
        } else {
          //从权
          console.log("item", item);
          childName = this.changeNumToHan(+item.name);
          if (item.claimContent) {
            item.claimContent.forEach((childItem) => {
              // childKernel+=`<p>${childKernel}</p>`
              childKernel = childKernel
                ? childKernel + `<p>&#x3000;&#x3000;${childItem.kernel}</p>`
                : `${childItem.kernel}</p>`;
              note = note ? note + "，" + childItem.note : childItem.note;
            });
            let noStr = `实施例` + this.changeNumToHan(dataIndex + 1);
            methodStr += `<p>${noStr}</p>`;
            methodStr += `<p>&#x3000;&#x3000;本实施例的${childKernel}`;
            methodStr += `<p>&#x3000;&#x3000;${note}</p>`;
            methodStr += `<p>&#x3000;&#x3000;${item.goodEffect}</p>`;
            // methodStr += `<p>&#x3000;&#x3000;${detail.fixDefectMethod.text}</p>`;

            patentContentBox += `<p>&#x3000;&#x3000;可选地，${childKernel}`;

            index += 1;
            str += `<p>&#x3000;&#x3000;${index}. 根据${item.name}所述的${name}，其特征在于，${childKernel}`;
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
      patentContent += `<p>&#x3000;&#x3000;${goodEffect}</p>`;
      patentContent += `<p>&#x3000;&#x3000;${ideaText}</p>`;
      // console.log('patentContent',patentContent)
      content = this.allContentTemp.replace(/single/, str);
      content = content.replace(/patentContent/, patentContent);
      content = content.replace(/methodWay/, methodStr);
      // content = content.replace(/inner/, childStr);
      console.log("content", content);
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
      let patentName = this.patentName;
      let typeLabel = this.typeLabel;
      let techArea = this.detailData.techArea || "";
      let str = `<p>&#x3000;&#x3000;本${typeLabel}属于${techArea}领域，提供${patentName}，`;
      this.detailData.claim.forEach((el, index) => {
        console.log("claim", el);
        // 独权
        if (el.no === el.parentNo && el.no === el.ancestorNo && index === 0) {
          str += el.name;
          el.claimContent.forEach((childItem) => {
            str += childItem.kernel;
          });
          str += el.goodEffect;
        }
      });
      let content = this.mainContentTemplete + str + "</p>";
      this.$nextTick(() => {
        this.mainContent = content;
        this.showMainEdit = true;
      });
    },
    addToRich(type) {
      // 有一个问题。这里找不到他的替换标识了，被编辑的问题所覆盖。要想个解决方案。
      var content = this.allContent;
      this.allContent = "";
      const typeLabel = this.typeLabel;
      const domainText = this.detailData?.domain.text || "",
        techAreaText = this.detailData.techArea,
        painPointText = this.detailData?.painPoint.text,
        currentSolutionText = this.detailData?.currentSolution.text,
        pendingDefectText = this.detailData?.pendingDefect.text,
        ideaText = this.detailData?.idea.text,
        endText = `<p>&#x3000;&#x3000;以上仅为本${typeLabel}的较佳实施例而已，并不用以限制本${typeLabel}，凡在本${typeLabel}的精神和原则之内所作的任何修改、等同替换和改进等，均应包含在本${typeLabel}的保护范围之内。 </p>`,
        methodDesc = `<p>&#x3000;&#x3000;为了使本${typeLabel}的目的、技术方案及优点更加清楚明白，以下结合附图及实施例，对本${typeLabel}进行进一步详细说明。应当理解，此处所描述的具体实施例仅仅用以解释本${typeLabel}，并不用于限定本${typeLabel}。
            </p>`;
      let typeLabel1 = type === "edit" ? "typeLabel1" : typeLabel;
      let typeLabel1Exp = new RegExp(typeLabel1);
      content = content.replace(typeLabel1Exp, `${typeLabel}`);
      let techArea1 = type === "edit" ? "techArea1" : techAreaText;
      let techArea1Exp = new RegExp(techArea1);
      content = content.replace(techArea1Exp, `${techAreaText}`);
      content = content.replace(
        /domainText/,
        `<p>&#x3000;&#x3000;${domainText}</p>`
      );
      content = content.replace(
        /painPointText/,
        `<p>&#x3000;&#x3000;${painPointText}</p>`
      );
      content = content.replace(
        /currentSolutionText/,
        `<p>&#x3000;&#x3000;${currentSolutionText}</p>`
      );
      content = content.replace(
        /pendingDefectText/,
        `<p>&#x3000;&#x3000;${pendingDefectText}</p>`
      );
      // 实现方案
      content = content.replace(/methodDesc/, `${methodDesc}`);
      // 方案概述
      content = content.replace(
        /ideaText/,
        `<p>&#x3000;&#x3000;${ideaText}</p>`
      );
      content = content.replace(/endText/, `${endText}`);
      this.$nextTick(() => {
        this.allContent = content;
        // console.log("this.allContent", this.allContent);
      });
    },
    updatePatentName() {
      const patentName = this.patentName;
      let content = this.allContent;
      this.allContent = "";
      content = content.replace(
        /<hr style="border: 1px solid #000; background: #000;" size="1px" width="100%">\r?\n|(?<!\n)\r/g,
        '<hr style="border: 1px solid #000; background: #000;" size="1px" width="100%">'
      );
      content = content.replace(/<\/h2>\r?\n|(?<!\n)\r/g, "</h2>");
      content = content.replace(/<\/p>\r?\n|(?<!\n)\r/g, "</p>");

      let textReg =
        /<hr style="border: 1px solid #000; background: #000;" size="1px" width="100%">.*?<h3 style="text-decoration: underline;">技术领域<\/h3>/g;
      let text2Reg =
        /尤其涉及.*?<h3 style="text-decoration: underline;">背景技术<\/h3>/g;
      content = content.replace(textReg, (Pstr) => {
        console.log("中间匹配到的字符", Pstr, "||||||", patentName);
        return `<hr style="border: 1px solid #000; background: #000;" size="1px" width="100%"><h2 style="text-align: center;">${patentName}</h2><h3 style="text-decoration: underline;">技术领域</h3>`;
      });
      content = content.replace(text2Reg, (Pstr) => {
        console.log("匹配到的专利名字", Pstr, "||||||", patentName);
        return `尤其涉及${patentName}。</p><h3 style="text-decoration: underline;">背景技术<\/h3>`;
      });
      this.$nextTick(() => {
        this.allContent = content;
        this.handleSave("updatePatentName");
      });
    },
    handleRichText() {
      let zhaiyaoImg = `<h1 class="custom" style="text-align: center;">摘 要 附 图</h1>
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
      let textStr = ``;
      let imgStr = "";
      this.drawings.forEach((item) => {
        textStr += `<p>&#x3000;&#x3000;${item.name}是本${this.typeLabel}实施例（或者现有技术）提供的${firstSingleName}的（流程）示意图</p>`;
        const imgUrl = baseUrl() + item.url;
        imgStr += `<p ><img src="${imgUrl}" /><div style="text-align:center;">${item.name}</div></p>`;
      });

      console.log({ textStr, imgStr, allContent: this.allContent });
      let content = this.allContent;
      // // 清理标签之间的空格。不然正则匹配不到
      // content = content.replace(/<\/p>\r?\n|(?<!\n)\r/g, "</p>");
      // content = content.replace(/<\/h3>\r?\n|(?<!\n)\r/g, "</h3>");
      // let textReg =
      //   /<h3 style="text-decoration: underline;">附图说明<\/h3>.*?主要元件符号说明：<\/p>/g;
      // content = content.replace(textReg, (str) => {
      //   console.log("中间匹配到的字符", str, "||||||", textStr);
      //   return `<h3 style="text-decoration: underline;">附图说明</h3>${textStr}<p>&#x3000;&#x3000;主要元件符号说明：</p>`;
      // });
      this.allContent = content;
      const shuomingshuImg = `
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
      // return
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
      if (type != "autosave") {
        this.allContent = "";
      }
      editDescription(params)
        .then((res) => {
          this.haveNewContent = false;
          if (type === "save") {
            this.$message.success("保存成功");
          } else if (type === "quitSave") {
            this.handleQuit();
            return;
          } else if (type === "preview") {
            this.allContent = params.description;
            this.handlePreview();
            return;
          } else if (type === "submit") {
            if (this.mainTextOverLimit) {
              this.$message.error("说明书摘要内容超过300个字不能提交，请修改");
              return;
            }
            this.handleSubmitData();
          } else if (type === "updatePatentName") {
          } else if (type === "autosave") {
            this.allContent = params.description;
            return;
          } else if (type === "replaceText") {
            this.replaceLoading = false;
          }
          this.fetchData(this.detailData.id);
        })
        .catch((err) => {
          this.haveNewContent = true;
          this.replaceLoading = false;
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
      console.log("添加到富文本");
      this.$nextTick(() => {
        this.handleChangeImgStr(this.treeDataStr);
      });
    },
    replaceText() {
      this.replaceLoading = true;
      let content = this.allContent;
      this.tempContent = content;
      const ccc = this.handleReplaceText(this.imgMarkList);
      this.$nextTick(() => {
        // setTimeout(() => {
        this.allContent = ccc;
        this.handleSave("replaceText");
        // }, 1000);
      });
    },
    handleReplaceText(data) {
      this.tempContent = this.tempContent.replace(
        /<\/p>\r?\n|(?<!\n)\r/g,
        "</p>"
      );
      this.tempContent = this.tempContent.replace(
        /<\/h3>\r?\n|(?<!\n)\r/g,
        "</h3>"
      );
      let textReg = /<p>实施例一<\/p>.*?以上仅为本/g;
      data.forEach((item) => {
        // console.log("item", item);
        this.tempContent = this.tempContent.replace(textReg, (Pstr) => {
          console.log("中间匹配到的字符", Pstr);
          let str = new RegExp(item.name, "g");
          return Pstr.replace(str, item.name + item.number);
          // return `<p>&#x3000;&#x3000;主要元件符号说明：</p><p>&#x3000;&#x3000;${str}。</p><h3 style="text-decoration: underline;">具体实施方式</h3>`;
        });
        if (item.children) {
          console.log("content", this.tempContent);
          this.handleReplaceText(item.children);
        }
      });
      return this.tempContent;
    },
    handleImgMarkList(data) {
      data.forEach((el) => {
        this.treeDataStr = this.treeDataStr
          ? this.treeDataStr + "，" + el.name + "、" + el.number
          : this.treeDataStr + el.name + "、" + el.number;
        if (el.children) {
          this.handleImgMarkList(el.children);
        }
      });
    },
    handleChangeImgStr(str) {
      console.log("str", str);
      let content = this.allContent;
      content = content.replace(/<\/p>\r?\n|(?<!\n)\r/g, "</p>");
      content = content.replace(/<\/h3>\r?\n|(?<!\n)\r/g, "</h3>");
      let textReg =
        /<p>&#x3000;&#x3000;主要元件符号说明：<\/p>.*?具体实施方式<\/h3>/g;
      content = content.replace(textReg, (Pstr) => {
        console.log("中间匹配到的字符", Pstr, "||", str);
        return `<p>&#x3000;&#x3000;主要元件符号说明：</p><p>&#x3000;&#x3000;${str}。</p><h3 style="text-decoration: underline;">具体实施方式</h3>`;
      });
      this.$nextTick(() => {
        this.allContent = content;
        this.handleSave("saveTreeData");
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
    openClaimFileList(index) {
      // console.log({
      //   index,
      //   claim: this.detailData.claim[index],
      // });
      this.currentRecordList = [];
      this.currentFileList = this.detailData.claim[index].attachments;
      this.showFileList = true;
    },
    handleChangeStatus(type) {
      if (!this.modifiedFields.includes(type)) {
        console.log("不在数组内");
        return;
      }
      if (this.changeStatusLoading) {
        return;
      }
      this.changeStatusLoading = true;
      console.log("type", type);
      clearRedPoint({
        id: this.$route.query.id,
        modifiedField: type,
      })
        .then((res) => {
          this.changeStatusLoading = false;
          this.modifiedFields = this.modifiedFields.filter((v) => v != type);
          console.log(
            "this.detailData.modifiedFields",
            this.detailData.modifiedFields
          );
        })
        .catch((_) => {
          this.changeStatusLoading = false;
        });
    },
  },
};
</script>
<style lang="scss" scoped>
::v-deep .el-tree-node .el-tree-node__content {
  height: 40px;
}
.header-title {
  box-sizing: border-box;
  height: 80px;
  padding: 15px 33px 20px 33px;
  display: flex;
  justify-content: space-between;
  width: 100%;
  background-color: #fff;
  border-bottom: 1px solid rgba(0, 0, 0, 0.08);
  .icon_back {
    cursor: pointer;
    width: 60px;
    &:hover {
      color: #165dff;
    }
  }
  .title-name {
    padding: 8px;
    font-family: "PingFang SC";
    font-style: normal;
    font-weight: 500;
    font-size: 24px;
    color: #1d2129;
    width: 418px;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
  }
}
.page-con {
  height: calc(100vh - 144px);
  overflow-y: scroll;
  padding: 0 40px;
}
.rich-edit-page {
  // margin: 0 10px 10px 0;
  // height: 100vh;
  // overflow-y: scroll;
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
  padding: 31px 24px;
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
        // margin-bottom: 20px;
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
        margin: 10px 0 13px 0;
        &-title {
          margin-bottom: 8px;
          font-family: "PingFang SC";
          font-style: normal;
          font-weight: 400;
          font-size: 14px;
          line-height: 20px;
          color: #1d2129;
        }
        &-text {
          margin-left: 14px;
          font-family: "PingFang SC";
          font-style: normal;
          font-weight: 400;
          font-size: 14px;
          line-height: 20px;
          color: #4e5969;
        }
      }
    }
    .first-right-title {
      display: flex;
      align-items: center;
      justify-content: space-between;
      // padding: 5px 0;
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
  margin-bottom: 20px;
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
  // width: 100vw;
  // text-align: center;
  // padding: 15px 0;
  // background: #fff;
  // box-shadow: -2px 2px 100px gainsboro;
  // height: 80px;
  padding-top: 5px;
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
  display: inline-block;
  // width: 150px;
  padding: 5px 16px;
  background: #f2f3f5;
  border-right: 1px solid #e5e6eb;
  border-top-left-radius: 2px;
  border-bottom-left-radius: 2px;
  // margin-left: 15px;
  cursor: pointer;
  margin-top: 14px;
  font-family: "Nunito Sans";
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 22px;
}
.file-list-tool {
  color: #4e5969;
  &:hover {
    color: #165dff;
  }
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
.kernel-box {
  border: 1px solid #e5e6eb;
  border-radius: 4px;
}
.kernel-item {
  border-top: 1px solid #e5e6eb;
  // padding: 15px 25px;
  // margin-bottom: 20px;
}
.kernel-item-row {
  padding: 15px 25px 0;
  display: flex;
  font-family: "Nunito Sans";
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 22px;
  color: #1d2129;
}
.kernel-item-note {
  padding: 15px 25px 10px;
  margin-top: 9px;
  display: flex;
  font-family: "Nunito Sans";
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 22px;
  color: #86909c;
}
.kernel-item-tool {
  border-top: 1px solid #e5e6eb;
  padding-bottom: 10px;
  padding-left: 10px;
  color: #4e5969;
  &:hover {
    color: #165dff;
  }
}
.claim-title {
  color: #1d2129;
  font-family: "Nunito Sans";
  font-style: normal;
  font-weight: 700;
  font-size: 14px;
  line-height: 22px;
  margin-bottom: 8px;
  margin-top: 6px;
}
.right-warning {
  display: inline-block;
  color: red;
  background: #ffece8;
  border-radius: 3px;
  padding: 3px 8px;
  line-height: 20px;
  font-family: "PingFang SC";
  font-style: normal;
  font-weight: 400;
}
.cut-line {
  height: 1px;
  width: 100%;
  background: #f2f3f5;
  margin-top: 10px;
  margin-bottom: 20px;
}
.right-title {
  font-family: "PingFang SC";
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 20px;
  color: #1d2129;
}
.right-content-item {
  font-family: "PingFang SC";
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 20px;
  color: #4e5969;
}
.custom-arrow-down {
  display: inline-block;
  background: #f2f3f5;
  padding: 5px 11px;
  cursor: pointer;
  border-top-right-radius: 2px;
  border-bottom-right-radius: 2px;
  line-height: 22.5px;
  // position: relative;
  // top: 0.5px;
}
</style>
