<template>
  <div class="component">
    <div class="sidebar">
      <div class="logo">
        <a href="#">TinyDoc</a>
      </div>
      <div class="search">
        <el-input
          class="search-text"
          v-model="inputText"
          @keyup.enter.native="search"
          placeholder="输入关键字并回车..."
          prefix-icon="el-icon-search"
        ></el-input>
      </div>
      <el-menu
        default-active="/book"
        background-color="#545c64"
        text-color="#fff"
        active-text-color="#67c23a"
        router
      >
        <el-menu-item index="/">
          <i class="el-icon-s-home"></i>
          <span slot="title">首页</span>
        </el-menu-item>
        <el-menu-item index="/explore">
          <i class="el-icon-s-opportunity"></i>
          <span slot="title">发现</span>
        </el-menu-item>
        <el-menu-item index="/book">
          <i class="el-icon-notebook-2"></i>
          <span slot="title">知识库</span>
        </el-menu-item>
        <el-menu-item index="/feedback">
          <i class="el-icon-s-promotion"></i>
          <span slot="title">Feedback</span>
        </el-menu-item>
      </el-menu>
    </div>
  </div>
</template>

<script>
export default {
  name: "HomeMenu",
  components: {},
  data() {
    return {};
  },
};
</script>

<style scoped lang="scss">
</style>
