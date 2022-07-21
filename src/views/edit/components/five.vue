<template>
  <div class="page_five">
    <!-- <div class="page-top">
      <div>权利要求书</div>
      <el-button type="primary" icon="el-icon-plus" @click="handleSingle"
        >添加独权</el-button
      >
    </div> -->
    <div class="page-main no-border-input">
      <div class="box">
        <el-table
          header-cell-class-name="table_header"
          :data="claims"
          style="width: 100%; margin-top: 15px"
          @cell-mouse-enter="mouseEnter"
          @cell-mouse-leave="mouseLeave"
          align="top"
          :max-height="tableHeight"
        >
          <el-table-column prop="realIndex" label="序号" width="100">
            <template slot-scope="scope">
              <div
                :class="[
                  scope.row.no === scope.row.parentNo
                    ? 'sort-index'
                    : 'child-index',
                ]"
              >
                {{ scope.$index + 1 }}
              </div>

              <div
                v-if="scope.row.showTip"
                @click="handleDelete(scope.row)"
                class="row-click"
              >
                删除
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="name" label="权利名称" width="280">
            <template slot-scope="scope">
              <div>
                <div
                  class="name-input"
                  v-if="
                    scope.row.no === scope.row.parentNo &&
                    scope.row.no === scope.row.ancestorNo
                  "
                >
                  <el-input
                    :ref="`input${scope.row.realIndex}`"
                    @input="nameInputChange($event, scope.row, 'name')"
                    type="textarea"
                    :autosize="{ minRows: 1 }"
                    v-model="scope.row.name"
                  ></el-input>
                  <el-button
                    icon="el-icon-plus"
                    style="margin-top: 10px"
                    @click="handleChild(scope.row, scope.$index)"
                    >添加从权</el-button
                  >
                </div>
                <div v-else class="child-name">
                  <div>
                    <span
                      >根据
                      <!-- <span style="color: #165dff">权利要求</span> -->
                    </span>
                    <el-input
                      :ref="`input${scope.row.realIndex}`"
                      @input="nameInputChange($event, scope.row, 'name')"
                      :autosize="{ minRows: 1 }"
                      v-model="scope.row.name"
                      class="child-input"
                    ></el-input>
                  </div>
                  <el-button
                    icon="el-icon-plus"
                    style="margin-top: 10px"
                    @click="handleChild(scope.row, scope.$index)"
                    >添加从权</el-button
                  >
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="" width="770">
             <template slot="header">
              <el-row class="card-head">
                <el-col style="width: 506px">内核</el-col>
                <el-col style="width: 60px">必经</el-col>
                <el-col style="width: 60px">可视</el-col>
                <el-col style="width: 60px">逻辑</el-col>
                <el-col style="width: 60px">备注</el-col>
              </el-row>
            </template>
            <template slot-scope="scope">
              <span v-for="(item, index) in scope.row.claimContent" :key="index" class="operation">
                <span style="width: 506px">
                  <div
                    @mouseenter="
                      kernelMouseEnter(item, index, scope.row.claimContent)
                    "
                    @mouseleave="
                      kernelMouseLeave(item, index, scope.row.claimContent)
                    "
                  >
                    <el-input
                      @input="inputChange"
                      class="kernel"
                      type="textarea"
                      :autosize="{ minRows: 1 }"
                      v-model="item.kernel"
                    ></el-input>
                    <div
                      v-if="item.isShowDelete && index != 0"
                      @click="
                        handleKernelDelete(item, index, scope.row.claimContent)
                      "
                      class="kernel-delete"
                    >
                      删除
                    </div>
                  </div>
                </span>
                <div class="check-row-box">
                  <div
                  >
                    <el-checkbox v-model="item.check.necessaryStep" @change="inputChange"></el-checkbox>
                  </div>
                </div>
                <div class="check-row-box">
                  <div
                  >
                    <el-checkbox v-model="item.check.visible" @change="inputChange"></el-checkbox>
                  </div>
                </div>
                <div class="check-row-box">
                  <div
                  >
                    <el-checkbox v-model="item.check.logic" @change="inputChange"></el-checkbox>
                  </div>
                </div>
                <div class="note-row" style="width: 60px">
                  <div class="note_box" :title="item.note">
                    <img src="@/assets/work_images/flag.svg" alt="" class="note_icon" v-if="item.note === ''" @click="openNote(item, index)">
                    <img src="@/assets/work_images/flag_active.svg" class="note_icon" alt="" v-else @click="openNote(item, index)">
                  </div>
                  <div class="dialog-note" v-show="dialogNote">
                    <div class="note-content">
                      <div class="dialog-title">
                        <span>备注</span>
                      </div>
                      <div class="dialog-con">
                        <el-input
                          @input="inputChange"
                          v-model="noteObj.note"
                          type="textarea"
                          rows="1"
                        ></el-input>
                      </div>
                      <div class="dialog-footer">
                        <el-button @click="closeNote(item)">返回</el-button>
                        <el-button type="primary" @click="closeNote(item)">提交</el-button>
                      </div>
                    </div>
                  </div>
                </div>
              </span>
              <el-button
                  icon="el-icon-plus"
                  @click="handleInner(scope.row, scope.$index, treeData)"
                >
                  添加内核
                </el-button>
            </template>
          </el-table-column>
          <!-- <el-table-column prop="kernel" min-width="150px" label="内核">
            <template slot-scope="scope">
              <span>
                <div
                  @mouseenter="
                    kernelMouseEnter(item, index, scope.row.claimContent)
                  "
                  @mouseleave="
                    kernelMouseLeave(item, index, scope.row.claimContent)
                  "
                  v-for="(item, index) in scope.row.claimContent"
                  :key="index"
                >
                  <el-input
                    @input="inputChange"
                    class="kernel"
                    type="textarea"
                    rows="1"
                    v-model="item.kernel"
                  ></el-input>
                  <div
                    v-if="item.isShowDelete && index != 0"
                    @click="
                      handleKernelDelete(item, index, scope.row.claimContent)
                    "
                    class="kernel-delete"
                  >
                    删除
                  </div>
                </div>
                <el-button
                  icon="el-icon-plus"
                  @click="handleInner(scope.row, scope.$index, treeData)"
                >
                  添加内核
                </el-button>
              </span>
            </template>
          </el-table-column> -->
          <!-- <el-table-column prop="" label="校核" width="270px">
            <template slot-scope="scope">
              <div class="check-row-box">
                <div
                  v-for="(item, index) in scope.row.claimContent"
                  class="check-row"
                  :key="index"
                >
                  <el-checkbox v-model="item.check.necessaryStep" @change="inputChange"
                    >必经</el-checkbox
                  >
                  <el-checkbox v-model="item.check.visible" @change="inputChange">可视</el-checkbox>
                  <el-checkbox v-model="item.check.logic" @change="inputChange">逻辑</el-checkbox>
                </div>
              </div>
            </template>
          </el-table-column> -->
          <!-- <el-table-column prop="" label="必经" width="90px">
            <template slot-scope="scope">
              <div class="check-row-box">
                <div
                  v-for="(item, index) in scope.row.claimContent"
                  class="check-row"
                  :key="index"
                >
                  <el-checkbox v-model="item.check.necessaryStep" @change="inputChange"></el-checkbox>
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="" label="可视" width="90px">
            <template slot-scope="scope">
              <div class="check-row-box">
                <div
                  v-for="(item, index) in scope.row.claimContent"
                  class="check-row"
                  :key="index"
                >
                  <el-checkbox v-model="item.check.visible" @change="inputChange"></el-checkbox>
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="" label="逻辑" width="90px">
            <template slot-scope="scope">
              <div class="check-row-box">
                <div
                  v-for="(item, index) in scope.row.claimContent"
                  class="check-row"
                  :key="index"
                >
                  <el-checkbox v-model="item.check.logic" @change="inputChange"></el-checkbox>
                </div>
              </div>
            </template>
          </el-table-column> -->
          <!-- <el-table-column prop="note" label="备注">
            <template slot-scope="scope">
              <div class="note-row">
                <div
                  v-for="(item, index) in scope.row.claimContent"
                  :key="index"
                >
                  <div class="note_box">
                    <img src="@/assets/work_images/flag.svg" alt="" class="note_icon" v-if="item.note === ''" @click="dialogNote = true">
                    <img src="@/assets/work_images/flag_active.svg" class="note_icon" alt="" v-else @click="dialogNote = true">
                  </div>
                  <el-dialog
                    :visible.sync="dialogNote"
                    width="30%"
                    custom-class="dialog-note"
                  >
                    <div slot="title" class="dialog-title">
                      <span>添加备注</span>
                    </div>
                    <el-input
                      @input="inputChange"
                      v-model="item.note"
                      type="textarea"
                      rows="1"
                    ></el-input>
                    <span slot="footer" class="dialog-footer">
                      <el-button @click="dialogNote = false">返回</el-button>
                      <el-button type="primary" @click="dialogNote = false">提交</el-button>
                    </span>
                  </el-dialog>
                    <el-input
                      @input="inputChange"
                      v-model="item.note"
                      type="textarea"
                      rows="1"
                    ></el-input>
                </div>
              </div>
            </template>
          </el-table-column> -->
          <el-table-column prop="" label="有益效果" width="315">
            <template slot-scope="scope">
              <span class="main-upload">
                <!-- <el-upload
                  :headers="{
                    Authorization: `Bearer ${token}`,
                  }"
                  :show-file-list="false"
                  :action="uploadUrl"
                  :on-success="handleSuccess"
                  :before-upload="(file) => beforeUpload(file, scope.row)"
                > -->
                  <span
                    class="file-list-tool"
                    @click="handleUpload(scope.row)"
                  >
                    <span class="tool-item-file-list">
                      <i class="el-icon-paperclip"></i>
                      <span class="tool-label">点击上传</span>
                    </span>
                    <i class="el-icon-arrow-down custom-arrow-down"></i>
                  </span>
                <!-- </el-upload> -->

                <el-input
                  class="good-input"
                  type="textarea"
                  :autosize="{ minRows: 1 }"
                  @input="nameInputChange($event, scope.row, 'goodEffect')"
                  v-model="scope.row.goodEffect"
                ></el-input>
                <!-- <div v-if="scope.row.attachments" style="margin-top: 10px">
                  <span
                    v-for="(item, index) in scope.row.attachments"
                    :key="index"
                  >
                    <div>
                      {{ item.name }}
                    </div>
                  </span>
                </div> -->
              </span>
            </template>
          </el-table-column>
        </el-table>
        <!-- <el-row class="card-head">
          <el-col style="width: 100px">序号</el-col>
          <el-col style="width: 280px">权力名称</el-col>
          <el-col style="width: 554px">内核</el-col>
          <el-col style="width: 90px">必经</el-col>
          <el-col style="width: 90px">可视</el-col>
          <el-col style="width: 90px">逻辑</el-col>
          <el-col style="width: 294px">备注</el-col>
          <el-col style="width: 255px">有益效果</el-col>
        </el-row> -->
        <!-- <div class="card-list">
          <el-card class="box-card" v-for="(item, index) in claims" :key="item.no">
            <el-row>
              <el-col class="card-realIndex" style="width: 85px">
                <div>
                  {{ index + 1 }}
                </div>
                /* <div
                  v-if="scope.row.showTip"
                  @click="handleDelete(scope.row)"
                  class="row-click"
                >
                  删除
                </div> */
              </el-col>
              <el-col class="card-name" style="width: 280px">
                <div
                  class="name-input"
                  v-if="
                    item.no === item.parentNo &&
                    item.no === item.ancestorNo
                  "
                >
                  <el-input
                    :ref="`input${item.realIndex}`"
                    @input="nameInputChange($event, item, 'name')"
                    type="textarea"
                    rows="1"
                    v-model="item.name"
                  ></el-input>
                  <el-button
                    icon="el-icon-plus"
                    style="margin-top: 10px"
                    @click="handleChild(item, index)"
                    >添加从权</el-button
                  >
                </div>
                <div v-else class="child-name">
                  <div>
                    <span
                      >根据
                      <span style="color: #165dff">权利要求</span>
                    </span>
                    <el-input
                      :ref="`input${item.realIndex}`"
                      @input="nameInputChange($event, item, 'name')"
                      v-model="item.name"
                      class="child-input"
                    ></el-input>
                  </div>
                  <el-button
                    icon="el-icon-plus"
                    style="margin-top: 10px"
                    @click="handleChild(item, index)"
                    >添加从权</el-button
                  >
                </div>
              </el-col>
              <el-col class="card-operation" style="width: 914px" v-for="(row, row_index) in item.claimContent" :key="row_index">
                <div class="card-operation-kernel" style="width: 554px">
                  <div
                    @mouseenter="
                      kernelMouseEnter(li, li_index, row)
                    "
                    @mouseleave="
                      kernelMouseLeave(li, li_index, row)
                    "
                    v-for="(li, li_index) in row"
                    :key="li_index"
                  >
                    <el-input
                      @input="inputChange"
                      class="kernel"
                      type="textarea"
                      rows="1"
                      v-model="li.kernel"
                    ></el-input>
                    <div
                      v-if="li.isShowDelete && li_index != 0"
                      @click="
                        handleKernelDelete(li, li_index, row)
                      "
                      class="kernel-delete"
                    >
                      删除
                    </div>
                  </div>
                  <el-button
                    icon="el-icon-plus"
                    @click="handleInner(item, row_index, treeData)"
                  >
                    添加内核
                  </el-button>
                </div>
                <div class="card-operation-checkout" style="wdith: 90px">
                  <div class="check-row-box">
                    <div
                      class="check-row"
                      v-for="(item, index) in scope.row.claimContent"
                      :key="index"
                    >
                      <el-checkbox v-model="row.check.necessaryStep" @change="inputChange"></el-checkbox>
                    </div>
                  </div>
                </div>
              </el-col>
            </el-row>   
          </el-card>
        </div> -->
      </div>
    </div>
    <!-- <div class="bottom">
      <el-button type="primary" @click="saveData('submit')">提 交</el-button>
      <el-button @click="saveData('last')">上一步</el-button>
      <el-button @click="saveData('save')">保 存</el-button>
    </div> -->
    <file-list
      :fileList="currentFileList"
      v-if="showFileList"
      :show.sync="showFileList"
    />
  </div>
</template>
<script>
import { cloneDeep } from "lodash";
import { getToken } from "@/utils/auth";
import { uploadFile } from "@/api/upload";
import { uploadFileUrl, baseUrl } from "@/utils/baseUrl";
import fileList from "./fileList_five";
//  不支持import 语法，也就是module引入
const jsDiff = require('diff');
export default {
  props: {
    claimData: {
      type: Array,
      default: () => [],
    },
  },
  components: {
    fileList
  },
  watch: {
    realIndex(n) {
      console.log("realIndex,", n);
    },
    treeData(n) {
      console.log("treeData change", n);
    },
  },
  computed: {
    tableHeight() {
      const page = document.documentElement.clientHeight;
      const height = page - 275;
      return height;
    },
  },
  data() {
    return {
      parentChildren: [],
      uploadUrl: uploadFileUrl(),
      token: this.$store.getters.toke || getToken(),
      realIndex: 1,
      ancestorName: null,
      treeData: [],
      claims: [],
      template: {
        realIndex: 1,
        no: 1,
        parentNo: 1,
        ancestorNo: 1,
        name: "",
        goodEffect: "",
        claimContent: [
          {
            kernel: "", //内核
            check: {
              necessaryStep: false,
              visible: false,
              logic: false,
            },
            note: "", //备注
          },
        ],
        attachments: [],
        children: [],
      },
      dialogNote: false,
      showFileList: false,
      currentFileList: [],
      noteObj: {}
    };
  },
  created() {
    const a= jsDiff.diffChars("我的钓鱼","钓的鱼")
    console.log('jsDiff',a)
    console.log("init", this.claimData);
    if (this.claimData.length) {
      console.log("装载一下树结构");
      this.treeData = [];
      this.realIndex = 0;
      this.handleEditData(this.claimData);
    } else {
      var template = cloneDeep(this.template);
      this.treeData.push(template);
      this.claims = [];
      this.realIndex = 0;
      this.handleArrayData(this.treeData);
    }
  },
  methods: {
    kernelMouseEnter(item, index, data) {
      console.log("kernelMouseMove", item);
      this.$set(item, "isShowDelete", true);
    },
    kernelMouseLeave(item, index, data) {
      this.$set(item, "isShowDelete", false);
    },
    handleKernelDelete(item, index, data){
      console.log({item, index, data})
      data.splice(index,1)
      this.saveData("autoSave");
    },
    handleDelete(row) {
      console.log("row", row, this.treeData);
      //第一级，。
      this.parentChildren = this.treeData;
      this.findTreeData(row.no, this.treeData);
      this.$nextTick(() => {
        console.log("parentChildren", this.parentChildren);
        // return
        let index = this.parentChildren.findIndex((v) => v.no === row.no);
        console.log("index", index);
        this.parentChildren.splice(index, 1);
        console.log("this.treeData", this.treeData);
        this.claims = [];
        this.realIndex = 0;
        this.handleArrayData(this.treeData);
        this.inputChange();
      });
      // console.log(this.treeData);
    },
    findTreeData(no, data) {
      data.forEach((el, index) => {
        if (el.no === no) {
          this.parentChildren = data;
          console.log("找到了", el, index, this.parentChildren);
        } else {
          if (el.children && el.children[0]) {
            console.log("进阿里了？");
            this.findTreeData(no, el.children);
          }
        }
      });
    },
    mouseEnter(row, column, cell, event) {
      if (row.no === 1) return;
      this.$set(row, "showTip", true);
    },
    mouseLeave(row, column, cell, event) {
      if (row.no === 1) return;
      this.$set(row, "showTip", false);
    },
    saveData(type) {
      console.log("before", this.claims);
      this.$emit("saveData", {
        type,
        step: 5,
        claims: this.claims,
      });
    },
    openNote(value) {
      console.log('cccc', value)
      this.noteObj = value
      console.log('sss', this.noteObj)
      this.dialogNote = true
    },
    closeNote(value) {
      console.log('ffff', value)
      this.dialogNote = false
    },
    handleEditData(data) {
      var list = cloneDeep(data);
      list.forEach((item) => {
        console.log("okok", item);
        if (item.parentNo === item.no && item.no === item.ancestorNo) {
          // 子父孙三级相同， 说明是一个，直接push
          // if (item.no === item.ancestorNo) {
          console.log("三级相同");
          if (!item.attachments) {
            item.attachments = [];
          }
          this.treeData.push(item);
          // }
        } else {
          //抽离出来
          this.findSonData(item, this.treeData);
        }
      });
      this.claims = [];
      this.realIndex = 0;
      this.handleArrayData(this.treeData);
      console.log("【treeData】", this.treeData);
    },
    findSonData(curData, treeData) {
      treeData.forEach((child) => {
        if (curData.parentNo === child.no) {
          console.log("我找到爹了", curData.name, child.name, child);
          child.children = child.children ? child.children : [];
          if (!curData.attachments) {
            curData.attachments = [];
          }
          child.children.push(curData);
        } else if (child.children && child.children.length) {
          this.findSonData(curData, child.children);
        }
      });
    },
    handleInner(item, itemIndex, data) {
      data.forEach((child, index) => {
        if (child.no === item.no) {
          console.log("找到啦", child);
          child.claimContent.push({
            kernel: "", //内核
            check: {
              necessaryStep: false,
              visible: false,
              logic: false,
            },
            note: "", //备注
          });
          console.log("add", child);
        } else if (child.children) {
          this.handleInner(item, itemIndex, child.children);
        }
      });
      console.log("treeData", this.treeData);
      this.claims = [];
      this.realIndex = 0;
      this.handleArrayData(this.treeData);
    },
    inputChange() {
      if (this.timer) {
        clearTimeout(this.timer);
      }
      this.timer = setTimeout(() => {
        this.saveData("autoSave");
      }, 1000);
      console.log("this.claims666666666", this.claims);
    },
    nameInputChange(value, row, type) {
      console.log("回填数据", value, row);
      // this.treeData
      this.fillTreeData(value, row, this.treeData, type);
      this.inputChange();
    },
    fillTreeData(value, row, originData, type) {
      originData.forEach((item) => {
        if (item.no === row.no) {
          console.log("我找到了");
          item[type] = value;
        } else if (item.children && item.children.length) {
          console.log("还没有找到，不过继续");
          this.fillTreeData(value, row, item.children, type);
        }
      });
    },
    handleArrayData(data) {
      data.map((item, index) => {
        this.realIndex += 1;
        if (item.no === item.parentNo && item.no === item.ancestorNo) {
          this.ancestorName = this.realIndex;
          this.claims.push(
            Object.assign({}, item, { realIndex: this.realIndex, children: [] })
          );
          console.log("【重置ancestorName】", item, this.ancestorName);
        } else {
          console.log("【我走这里】", item, this.ancestorName);
          // 子孙级的变化就是name变成了 父级的realINdex
          // 如果name有值就不变化
          let obj = {
            realIndex: this.realIndex,
            children: [],
          };
          if (!item.name || item.isAdd) {
            // console.log("我是新增的走这里", data[index - 1]);
            // obj.name = this.ancestorName + "";
          }
          this.claims.push(Object.assign({}, item, obj));
        }
        if (item.children && item.children.length > 0) {
          this.handleArrayData(item.children);
        }
      });
    },
    handleChild(item, itemIndex) {
      const obj = this.claims.find((v) => v.no === item.no);
      console.log("obj", obj);
      var template = cloneDeep(this.template);
      this.handlePushChildData(item, itemIndex, this.treeData);

      this.$nextTick(() => {
        this.claims = [];
        this.realIndex = 0;
        this.handleArrayData(this.treeData);
        console.log("claims", this.claims);
      });
    },
    handlePushChildData(item, itemIndex, data) {
      //找到这个东西
      // 这里也要递归
      var template = cloneDeep(this.template);
      data.forEach((child, index) => {
        if (child.no === item.no) {
          console.log("找到啦", child, item.realIndex);
          child.children = child.children ? child.children : [];
          child.children.push(
            Object.assign({}, template, {
              no: this.claims.length + 1,
              parentNo: item.no,
              ancestorNo: item.ancestorNo,
              name: `权利要求${item.realIndex}`,
              isAdd: true,
            })
          );
        } else if (child.children) {
          this.handlePushChildData(item, itemIndex, child.children);
        }
      });
    },
    handleSingle() {
      var template = cloneDeep(this.template);
      this.treeData.push(
        Object.assign({}, template, {
          realIndex: this.claims.length + 1,
          no: this.claims.length + 1,
          parentNo: this.claims.length + 1,
          ancestorNo: this.claims.length + 1,
          name: "",
        })
      );
      this.claims = [];
      this.realIndex = 0;
      this.handleArrayData(this.treeData);
      let name = `input${this.claims.length}`;
      this.$nextTick(() => {
        this.$refs[name].focus();
      });
    },
    dealTableData() {
      let currentNo = 1;
      this.claims.map((item, index) => {
        if (item.no && index > 0) {
          // console.log("【map No】:", item.no, currentNo);
          if (item.no < currentNo) {
            // console.log("进来了");
            currentNo = item.no;
          } else {
            // console.log("我比他大");
            currentNo = currentNo + 1;
            // console.log('currenNo',currentNo)
            item.no = currentNo;
          }
        }
      });
      // console.log("dealTableData", this.claims);
    },
    getRandom(length) {
      var randomStr =
        "1234567890abcdefghijklnmopqovwrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
      var str = "";
      for (let i = 0; i < length; i++) {
        str += randomStr[parseInt(Math.random() * 65)];
      }
      return str;
    },
    handleSuccess(response, file, fileList) {
      console.log(" this.fileData", this.fileData);
      if (response.code === 0) {
        // 两个数据都要填
        this.fileData.url = response.data.url;
        this.handFindFileFather(
          this.fileData,
          this.uploadFileRow.no,
          this.treeData
        );
        this.uploadFileRow.attachments.push(this.fileData);
        this.inputChange()
        console.log("claims8888888", this.claims, this.uploadFileRow);
      } else if (response.code === 20103) {
        this.$confirm("登录过期,请重新登录", "提示", {
          confirmButtonText: "重新登录",
          cancelButtonText: "取消",
          type: "warning",
        }).then(() => {
          this.$store.dispatch("user/resetToken").then(() => {
            location.reload();
          });
        });
      }
    },
    handFindFileFather(fileData, no, treeData) {
      treeData.map((el) => {
        if (el.no === fileData.no) {
          console.log("找到啦");
          el.attachments.push(fileData);
        } else if (el.children && el.children.length) {
          this.handFindFileFather(fileData, no, el.children);
        }
      });
      console.log("this..t", this.treeData);
    },
    beforeUpload(file, row) {
      console.log("file", file, row);
      const { size, name } = file;
      const { no } = row;
      this.fileData = { size, name };
      this.uploadFileRow = row;
    },
    handleUpload(value) {
      this.showFileList = true
      this.currentFileList = value.attachments
      console.log('bbb', this.fileList);
    }
  },
};
</script>
<style lang="scss">
.page_five {
  width: 1465px;
  margin: 0 auto;
  .el-table td,
  .el-table th {
    vertical-align: inherit !important;
    // position: absolute;
    // top:5px;
  }
  .table_header {
    .cell {
      box-sizing: border-box;
    }
}
}
.el-table {
  position: relative;
}

.el-textarea__inner:focus {
  border: 1px solid #165dff !important;
}
.page_five .el-table tbody {
  vertical-align: top;
}
.no-border-input {
  .el-textarea__inner {
    margin: 10px 0;
    padding: 5px 2px;
    resize: none;
    // height: 124px !important;
  }
  .el-table tbody tr:hover > td {
    background-color: #fff !important;
  }
  .good-input {
    .el-textarea__inner {
      margin: 10px 0;
      padding: 5px 2px;
      // height: 30px !important;
      // max-height: 124px !important;
    }
  }
  .child-input {
    max-width: 120px;
    .el-input__inner {
      padding: 0 3px;
      border: 1px solid #fff !important;
      color: #165dff;
    }
  }
}
.dialog-note {
  position: fixed;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  background-color: rgba($color: #000000, $alpha: 0.1);
  z-index: 999;
  .note-content {
    width: 520px !important;
    height: 290px;
    position: relative;
    top: 40%;
    left: 35%;
    background-color: #fff;
    .dialog-title {
      box-sizing: border-box;
      border-bottom: 1px solid #E5E6E8;
      padding: 12px 21px;
      text-align: center;
      font-family: 'Nunito Sans';
      font-style: normal;
      font-weight: 600;
      font-size: 16px;
      line-height: 24px;
      color: #1D2129;
    }
    .dialog-con {
      padding: 26px 18px;
      .el-textarea {
        textarea {
          height: 120px;
        }
        .el-textarea__inner {
          margin: 0;
        }
      }
    }
    .dialog-footer {
      box-sizing: border-box;
      border-top: 1px solid #E5E6E8;
      display: flex;
      justify-content: flex-end;
      padding: 16px 20px;
    }
  }
}
.card-head {
  // padding: 15px;
  div {
    box-sizing: border-box;
    padding: 0 10px;
    &:first-child {
      padding-left: 0;
    }
    &:last-child {
      padding-right: 0;
    }
  }
}
.card-list {
  .box-card {
    .el-card__body {
      padding: 15px;
      .card-name {
        .name-input {
          padding: 0 10px;
        }
      }
    }
  }
}
.operation {
  display: flex;
  .note-row {
    .el-textarea {
      .el-textarea__inner {
        margin: 0 !important;
      }
    }
  }
}
</style>
<style lang="scss" scoped>
// .name-input{
//   position: absolute;
//   top:10px;
// }
.page {
  // text-align: center;
  //   padding: 30px 50px;
}
.main-upload {
  // position: absolute;
  // top: 24px;
}
.page-main {
  background: #fff;
  // padding: 30px 50px;
}
.box {
  // border:2px solid red;
  //   width: 400px;
  margin: 0 auto;
  .el-table {
    width: 500px;
    .el-table__body-wrapper {
      .el-table__body {
        .el-table__row {
          margin-bottom: 15px;
        }
      }
    }
  }
}
.custom-label {
  // text-align: center;
  margin: 20px 0;
}
.custom-input {
  //   width: 300px;
}
.right-tool {
  float: right;
  .tool-item {
    display: inline-block;
    padding: 5px 20px;
    background: #f2f3f5;
    margin-right: 10px;
  }
}
.bottom {
  margin-top: 20px;
  text-align: center;
}
.page-top {
  padding: 15px 50px;
  background: #fff;
  margin-bottom: 15px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.check-row {
  // margin: 30px 0;
  // line-height: 124px;
  height: 144px;
  position: relative;
  top: -20px;
}
.note-row,
.check-row-box {
  // padding-bottom: 41px;
  width: 60px;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding: 8px 0;
}
.check-row-box {
  // position: absolute;
  // top: 40px;
}
.note_box {
  img {
    cursor: pointer;
  }
}

.tool-item-file-list {
  display: inline-block;
  padding: 5px 20px;
  line-height: 28px;
  background: #f2f3f5;
  margin-left: 10px;
  border-top-left-radius: 2px;
  border-bottom-left-radius: 2px;
  cursor: pointer;
  border-right: 1px solid #e5e6eb;
  font-family: "Nunito Sans";
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 22px;
  font-family: "Nunito Sans";
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 22px;
  &:hover {
    color: #165dff;
  }
}

// .fisrt-check-row{
//   position: relative;
//   top:-20px;
// }
.sort-index {
  // position: absolute;
  // top: 24px;
}
.row-click {
  position: absolute;
  bottom: 5px;
  left: 10px;
  color: red;
  cursor: pointer;
}
.row-top {
  position: absolute;
  top: 10px;
}
.child-name {
  position: absolute;
  top: 18px;
}
.child-index {
  position: absolute;
  top: 26px;
}
.kernel-delete {
  color: red;
  cursor: pointer;
}
.file-list-tool {
  color: #4e5969;
  &:hover {
    color: #165dff !important;
  }
  .tool-label {
    margin-left: 10px;
  }
}
.custom-arrow-down {
  display: inline-block;
  background: #f2f3f5;
  line-height: 22px;
  border-top-right-radius: 2px;
  border-bottom-right-radius: 2px;
  padding: 5px 11px;
  cursor: pointer;
  position: relative;
  top: 0.5px;
}
</style>
