<template>
  <div class="about">
    <h1>This is an about page</h1>
    <markdown-editor :config="config" :onchange="editorChange" />
  </div>
</template>

<script>
import MarkdownEditor from "../components/MarkdownEditor.vue";
export default {
  name: "About",
  components: {
    MarkdownEditor,
  },
  data() {
    return {
      config: {
        width: "80%",
        height: "500px",
      },
    };
  },
  methods: {
    editorChange(data) {
      console.log(data);
    },
  },
};
</script>

<style scoped lang="">
</style>

