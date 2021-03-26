<template>
  <div class="markdown-viewer-box">
    <link rel="stylesheet" href="/static/editormd/css/editormd.preview.css" />
    <link rel="stylesheet" :href="'/static/editormd/css/themes/' + themeCode" />
    <div class="layout">
      <div :class="tocClass" class="sidebar">
        <h1>目录</h1>
        <div
          class="markdown-body editormd-preview-container toc-container"
          id="toc-container"
        ></div>
      </div>
      <div class="content" :class="viewerClass">
        <div class="toggle">
          <div>
            <el-button
              icon="el-icon-arrow-up"
              @click="scrollToTop"
              circle
            ></el-button>
          </div>
          <div>
            <el-button
              icon="el-icon-tickets"
              @click="toggle"
              circle
            ></el-button>
          </div>
        </div>
        <div class="viewer" ref="viewer" :id="id"></div>
      </div>
    </div>
  </div>
</template>
<script>
import $ from "jquery";
import { v4 as uuid } from "uuid";
import { viewerConfig } from "../../config/editor.md";

export default {
  name: "MarkdownViewer",
  props: {
    id: {
      type: String,
      default: uuid(),
    },
    config: {
      type: Object,
    },
    toc: {
      type: Boolean,
      default: true,
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
      viewer: null,
      viewerLoaded: false,
      viewerClass: {
        noToc: !this.toc,
      },
      tocClass: {
        hide: !this.toc,
      },
    };
  },
  methods: {
    toggle() {
      this.viewerClass.noToc = !this.viewerClass.noToc;
      this.tocClass.hide = !this.tocClass.hide;
    },
    scrollToTop() {
      const c = document.documentElement.scrollTop || document.body.scrollTop;
      if (c > 0) {
        window.requestAnimationFrame(this.scrollToTop);
        window.scrollTo(0, c - c / 8);
      }
    },
    getConfig: function () {
      // return Object.assign(defaultConfig, this.config);
      // or
      // let o = {
      //   tocContainer: "#custom-toc-container",
      // };
      return { ...viewerConfig, ...this.config };
      // maybe add custom config from back-end
      // return { ...defaultConfig, ...this.config, ...customConfig };
    },
    initViewer: function () {
      let vm = this;
      window.$ = window.jQuery = $;
      Promise.all([
        $.getScript("/static/editormd/lib/marked.min.js"),
        $.getScript("/static/editormd/lib/prettify.min.js"),
        $.getScript("/static/editormd/lib/raphael.min.js"),
        $.getScript("/static/editormd/lib/underscore.min.js"),
        $.getScript("/static/editormd/lib/sequence-diagram.min.js"),
        $.getScript("/static/editormd/lib/flowchart.min.js"),
        $.getScript("/static/editormd/lib/jquery.flowchart.min.js"),
        $.getScript("/static/editormd/editormd.js"),
      ]).then(() => {
        // 涉及dom操作放到$nextTick里面
        vm.$nextTick(() => {
          let viewer;
          let extraConfig = {
            tocContainer: "#toc-container",
            markdown: vm.initData,
          };
          viewer = window.editormd.markdownToHTML(vm.id, {
            ...vm.getConfig(),
            ...extraConfig,
          });
          vm.viewer = viewer;
        });
      });
    },
  },
  mounted: function () {
    let vm = this;
    vm.initViewer();
  },
};
</script>
<style scoped lang="scss">
@import "../assets/css/init.scss";
@import "../assets/css/viewer.scss";
</style>