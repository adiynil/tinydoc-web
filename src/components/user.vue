<template>
  <div class="component">
    <div class="user">
      <div>
        <div style="float: left; height: 40px">
          <el-avatar
            size="large"
            shape="circle"
            :src="user.avatar ? user.avatar : defaultAvatar"
            fit="fill"
          ></el-avatar>
        </div>
        <div style="height: 40px; margin-left: 50px">
          <div style="color: #606266">{{ user.account }}</div>
          <div>
            <el-link :href="user.site" target="_blank">
              <i>{{ user.site }}</i>
            </el-link>
          </div>
        </div>
      </div>
      <div style="padding: 15px 0 0; color: #606266">
        {{ user.description ? user.description : defaultDescription }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "user",
  components: {},
  data() {
    return {
      defaultAvatar:
        "https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png",
      defaultDescription: "这个人很懒，什么都没有写",
    };
  },
  props: {
    user: Object,
  },
};
</script>

<style scoped lang="scss">
.user {
  padding: 20px;
  border: 1px solid #eee;
  border-radius: 2px;
}
</style>
