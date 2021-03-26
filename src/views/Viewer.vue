<template>
  <div class="home">
    <markdown-viewer
      v-if="ifViewerSourceDataLoaded"
      :toc="true"
      :initData="initData"
    />
  </div>
</template>

<script>
// @ is an alias to /src
import MarkdownViewer from "../components/MarkdownViewer.vue";
import $ from "jquery";

export default {
  name: "Home",
  components: {
    MarkdownViewer,
  },
  data() {
    return {
      ifViewerSourceDataLoaded: false,
      initData: "## data set",
    };
  },
  methods: {},
  mounted() {
    $.get("/static/test.md", (data) => {
      this.initData = data;
      this.ifViewerSourceDataLoaded = true;
    });
  },
};
</script>

<style>
</style>
