<template>
  <div class="markdown-editor-box">
    <link rel="stylesheet" href="/static/editormd/css/editormd.min.css" />
    <link rel="stylesheet" :href="'/static/editormd/css/themes/' + themeCode" />
    <div :id="id"></div>
  </div>
</template>
<script>
import $ from "jquery";
import { v4 as uuid } from "uuid";
import { defaultConfig } from "../../config/editor.md";

export default {
  name: "MarkdownEditor",
  props: {
    id: {
      type: String,
      default: uuid(),
    },
    config: {
      type: Object,
    },
    onchange: {
      // 内容改变时回调，返回（html, markdown, text）
      type: Function,
    },
    themeCode: {
      type: String,
      default: "atelier-forest-light.min.css",
      // preview at https://jmblog.github.io/color-themes-for-google-code-prettify/
      // location /static/editormd/css/themes/
    },
    initData: {
      type: String,
    },
    delay: {
      type: Number,
      default: 0,
    },
  },
  data: function () {
    return {
      editor: null,
      editorLoaded: false,
    };
  },
  methods: {
    getConfig: function () {
      let vm = this;
      // return Object.assign(defaultConfig, this.config);
      // or
      return { ...defaultConfig, ...vm.config };
      // maybe add custom config from back-end
      // return { ...defaultConfig, ...this.config, ...customConfig };
    },
    initEditor: function () {
      let vm = this;
      window.$ = window.jQuery = $;
      // Promise.all()
      // or
      // (async ()=>{ await })();
      Promise.all([$.getScript("/static/editormd/editormd.min.js")]).then(
        () => {
          // 涉及dom操作放到$nextTick里面
          vm.$nextTick(() => {
            let editor = window.editormd(vm.id, vm.getConfig());
            editor.on("load", () => {
              setTimeout(() => {
                vm.editorLoaded = true;
                // initData exist then init data with delay
                vm.initData && editor.setMarkdown(vm.initData);
              }, vm.delay);
            });
            vm.onchange &&
              editor.on("change", () => {
                let html = editor.getPreviewedHTML();
                vm.onchange({
                  markdown: editor.getMarkdown(),
                  html: html,
                  text: window.$(html).text(),
                });
              });
            vm.editor = editor;
          });
        }
      );
    },
  },
  mounted: function () {
    let vm = this;
    vm.initEditor();
  },
  watch: {
    initData: function (newVal) {
      let vm = this;
      if (newVal) {
        vm.editorLoaded && vm.editor.setMarkdown(newVal);
      }
    },
  },
};
</script>