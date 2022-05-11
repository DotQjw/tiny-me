<template>
  <div>
    <editor id="tinymce" v-model="myValue" :init="init" :disabled="disabled">
    </editor>
  </div>
</template>

<script>
import tinymce from "tinymce";
import Editor from "@tinymce/tinymce-vue";
import "tinymce/themes/silver/theme";
// import "tinymce/themes/silver";
// import "tinymce/plugins/paste";
import "tinymce/plugins/image";
import "tinymce/plugins/link";
import "tinymce/plugins/code";
import "tinymce/plugins/table";
import "tinymce/plugins/lists";
import "tinymce/plugins/wordcount";
// import "tinymce/themes/mobile/theme";
// import "tinymce/plugins/colorpicker";
// import "tinymce/plugins/textcolor";
import "tinymce/icons/default";
import "tinymce/models/dom";
import { defaults } from "js-cookie";
export default {
  //powerpaste插件为tinymce的收费插件，下载之后放入static/tinymce/plugins文件夹//该插件作用为复制word文档时批量上传图片，不需要的可以不要
  components: {
    Editor,
  },
  props: {
    //传入一个value，使组件支持v-model绑定
    value: {
      type: String,
      default: "",
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    plugins: {
      type: [String, Array],
      default: "",
      // "lists image table wordcount  code", //插件
    },
    toolbar: {
      type: [String, Array],
      //菜单
      default: "undo redo",
      // "undo redo | formatselect | bold italic forecolor backcolor | alignleft aligncenter alignright  | bullist numlist outdent indent |     | removeformat",
    },
  },
  watch: {
    myValue(n, o) {
      this.$nextTick(() => {
        this.getData(n);
      });
      if (n.includes("color")) {
        // console.log("in");
        // n = n.replace(/color/g, "");
        // this.setData(n);
        // console.log("n", n);
      }
    },
  },
  data() {
    var that = this;
    return {
      myValue: "",
      editorVm: "",
      template:
        '<p class="custom" >这里啥都没有-</p><p>我说的是真的</p><p class="custom" style="display:inline-block;">同行1</p><p class="custom" style="display:inline-block;">同行2</p><p></p><p class="custom">第二个段落</p><p></p><p></p><p></p><p class="custom">第三段</p><p></p>',
      defaultText: [
        "这里啥都没有-",
        "第二个段落",
        "第三段",
        "同行1",
        "同行2",
      ],
      //初始化配置
      init: {
        forced_root_block: "",
        language_url: "tinymce/langs/zh_CN.js", //如果语言包不存在，指定一个语言包路径
        language: "zh_CN", //语言
        skin_url: "tinymce/skins/ui/oxide",
        content_css: "tinymce/skins/content/default/content.css",
        height: "500px",
        selector: "textarea", // change this value according to your HTML
        plugins: this.plugins, //插件
        //以下为powerpaste插件配置
        convert_urls: false,
        // external_plugins: {
        //   powerpaste: `/tinymce/plugins/powerpaste/plugin.min.js`, // 注意这里路径一定要写对！！！一定要写对  然后在puligins里添加
        // },
        end_container_on_empty_block: true,
        powerpaste_word_import: "propmt", // 参数可以是propmt, merge, clear，效果自行切换对比
        powerpaste_html_import: "propmt", // propmt, merge, clear
        powerpaste_allow_local_images: true,
        paste_data_images: true,
        //以上为powerpaste插件配置
        toolbar: this.toolbar, //工具栏
        branding: false, //技术支持(Powered by Tiny || 由Tiny驱动)
        menubar: true, //菜单栏
        menu: {
          file: { title: "文件", items: "newdocument" },
          edit: {
            title: "编辑",
            items: "undo redo | cut copy paste pastetext | selectall",
          },
          insert: { title: "插入", items: "link media | template hr" },
          view: { title: "查看", items: "visualaid" },
          format: {
            title: "格式",
            items:
              "bold italic underline strikethrough superscript subscript | formats | removeformat",
          },
          table: {
            title: "表格",
            items: "inserttable tableprops deletetable | cell row column",
          },
          tools: { title: "工具", items: "spellchecker code" },
        },
        theme: "silver", //主题
        //此处为图片上传处理函数，这个直接用了base64的图片形式上传图片，
        //如需ajax上传可参考https://www.tiny.cloud/docs/configure/file-image-upload/#images_upload_handler
        images_upload_url: "www.baidu.com",
        automatic_uploads: false,
        images_upload_handler: (blobInfo, success, failure) => {
          console.log({ blobInfo, success, failure });
          // console.log(blobInfo, success, failure);
        },
        setup: function (editor) {
          console.log("ID为: " + editor.id + " 的编辑器即将初始化.");
        },
        init_instance_callback: function (editor) {
          console.log("ID为: " + editor.id + " 的编辑器已初始化完成.", editor);
          that.editorVm = editor;
          editor.setContent(that.template);
          this.hasInit = true;
          editor.on("NodeChange Change KeyUp SetContent", () => {
            // console.log('1', editor.getContent())
            this.hasChange = true;
            // this.$emit("input", editor.getContent());
          });
          // 将回车键改为 shift+回车
          editor.on("keydown", function (event) {
            console.log("evemt", event);
            if (event.keyCode === 13) {
              console.log("editor.selection.getNode()", editor);
              if (editor.dom.hasClass(editor.selection.getNode(), "custom")) {
                editor.dom.removeClass(editor.selection.getNode(), "custom");
                console.log("进来");
                // editor.selection.setContent("<p>&nbsp;</p>");
                return false;
              } else {
                console.log("DAOZHELI L");
                return true;
              }
            }
          });
        },
      },
    };
  },
  mounted() {
    // tinymce.init({});
  },
  methods: {
    setData(data) {
      console.log("setData", data);
      this.editorVm.setContent(data);
    },
    getData(data) {
      console.log("data", data);
      const defaultData = data.split("</p>");
      let defaultIndex = 0;
      defaultData.forEach((el) => {
        if (el.includes("custom")) {
          console.log("el 空", el.trim() == '<p class="custom">&nbsp;');
          if (el.trim() == '<p class="custom">&nbsp;') {
            return;
          }
          if (el.trim() === '<p class="custom">&nbsp;') {
            console.log("一摸一样");
            el = el.replace(/class="custom"/, "");
            console.log("el", el);
          } else {
            console.log("elouter", el);
            let text = el.replace(/<p class="custom">/, "");
            console.log("text", text);
            // el = el.replace(/<p style="custom">/,'')
            const obj = this.defaultText.find((v) => {
              // console.log('vvv',v,text)
              return text.trim().includes(v);
            });
            if (!obj) {
              // console.log('模板被改了')
              // this.$mesaage.error('别改模板')
              // console.log('我被改了',el)
              alert("别改模板");
              // console.log('别改模板')
            } else {
              defaultIndex += 1;
            }
            console.log("obj", obj);
            console.log("defaultIndex", defaultIndex);
          }

          // console.log('el',el)
          // let index = 0;
          // console.log('let',index)
          // this.defaultText.forEach(item=>{
          //   if(el.includes(item)){
          //     ++index
          //     // console.log('index+',index++)
          //     console.log('在模板',el,item)
          //   }
          //   // console.log('index inner',index)
          // })
          // console.log('index',index)
        }
      });
      console.log('defaultIndex',defaultIndex,this.defaultText.length)
      // if (defaultIndex < this.defaultText.length) {
      //   alert("出事了");
      // }
    },
  },
};
</script>
