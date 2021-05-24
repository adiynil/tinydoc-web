<template>
  <div class="bread-crumb">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item
        v-for="(item, index) in breadCrumb"
        :key="index"
        :to="item.path"
      >
        {{ item.meta.title.split("·")[0].trim() }}
      </el-breadcrumb-item>
    </el-breadcrumb>
  </div>
</template>

<script>
export default {
  components: {},
  data() {
    return {
      breadCrumb: [],
    };
  },
  created() {
    this.breadCrumb = this.$route.matched.filter((item, index, array) => {
      return array.findIndex((el) => el.meta.title == item.meta.title) == index;
    });
  },
};
</script>

<style scoped lang="scss">
</style>
