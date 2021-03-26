<template>
  <div class="page">
    <h1>{{ now }}</h1>
    <el-button @click="getCurrent">Current</el-button>
    <el-button @click="login">Login</el-button>
    <el-button @click="register">Register</el-button>
  </div>
</template>

<script>
import api from "../api";

export default {
  name: "User",
  components: {},
  data() {
    return {
      now: "",
    };
  },
  methods: {
    getCurrent() {
      api.user
        .current()
        .then((res) => {
          this.now = res;
        })
        .catch((err) => {
          console.log("getCurrent error", err);
        });
    },
    login() {
      api.user
        .login({ email: "adiynil@qq.com", password: "123456" })
        .then((res) => {
          // this.$Cookie.set("session_id", res.data.token);
          this.$store.commit("setToken", res.data.token);
          this.now = res;
        })
        .catch((err) => {
          console.log("login error", err);
        });
    },
    register() {
      api.user
        .register({
          name: "adiynil",
          email: "adiynil@qq.com",
          password: "123456",
        })
        .then((res) => {
          this.now = res;
        })
        .catch((err) => {
          console.log("register error", err);
        });
    },
  },
  mounted() {},
};
</script>

<style scoped lang="">
</style>
