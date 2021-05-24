<template>
  <div class="page">
    <el-row v-if="isLogin" :gutter="20">
      <el-col :span="6">
        <SideMenu :active="active" />
      </el-col>
      <el-col :span="18">
        <slot></slot>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import SideMenu from "@/components/SideMenu.vue";
import { mapState } from "vuex";
export default {
  components: {
    SideMenu,
  },
  props: {
    active: String,
  },
  data() {
    return {};
  },
  computed: {
    ...mapState(["current", "isLogin"]),
  },
  methods: {
    init() {},
  },
  mounted() {
    this.init();
  },
};
</script>

<style lang="scss">
@import "@/assets/css/dashboard.scss";
</style>
