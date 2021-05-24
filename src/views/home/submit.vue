<template>
  <div class="page">
    <div class="container">
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
      <div class="main">
        <el-row class="info">
          <p style="font-size: 20px">
            <span style="margin-right: 10px">@{{ collection.account }}</span>
            <span style="color: #606266">发布的采集任务</span>
            <span style="margin-left: 10px">{{ collection.title }}</span>
          </p>
          <p style="font-size: 14px; color: #909399">
            <span style="margin-right: 10px">创建于</span>
            <span>{{ formatDate(collection.create_at) }}</span>
          </p>
          <p v-if="!expired">
            <el-tag type="success" size="small">采集中</el-tag>
          </p>
          <p v-if="!expired">
            <span style="margin-right: 10px; color: #606266"
              >距离结束还有：</span
            >
            <span style="">{{ showTime }}</span>
          </p>
          <p v-if="expired">
            <el-tag type="danger" size="small">已过期</el-tag>
          </p>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="18">
            <div class="submit-item">
              <el-input
                ref="name"
                size="small"
                placeholder="请输入你的名字（必填）"
                v-model="form.name"
              ></el-input>
            </div>
            <div class="submit-item">
              <MarkdownEditor
                :config="{ placeholder: '请输入内容...' }"
                :onchange="editorChange"
              />
            </div>
            <div class="submit-item">
              <el-input
                size="small"
                type="textarea"
                placeholder="备注"
                v-model="form.remark"
              ></el-input>
            </div>
            <div class="submit-item">
              <el-button
                type="primary"
                size="medium"
                :disabled="expired"
                @click="onSubmit"
                >立即提交</el-button
              >
            </div>
          </el-col>
        </el-row>
      </div>
    </div>
  </div>
</template>

<script>
import MarkdownEditor from "@/components/MarkdownEditor.vue";
import { collection, collectdoc } from "@/api";
import utils from "@/assets/js/utils";
export default {
  components: { MarkdownEditor },
  data() {
    return {
      inputText: "",
      form: {
        collection_id: "",
        name: "",
        remark: "",
        content: "",
      },
      collection: {},
      expired: false,
      expire_at: "",
      intervalId: "",
      showTime: "",
    };
  },
  computed: {},
  methods: {
    search() {
      this.$router.push(`/book?s=${this.inputText}`);
    },
    formatDate(date) {
      return utils.formatDate(date);
    },
    editorChange({ markdown }) {
      this.form.content = markdown;
    },
    dateAddDays(date, day) {
      let time = new Date(date).getTime() + day * 24 * 60 * 60 * 1000;
      return time;
    },
    show() {
      let nowtime = new Date(), //获取当前时间
        endtime = new Date(this.expire_at); //定义结束时间
      let lefttime = endtime.getTime() - nowtime.getTime(), //距离结束时间的毫秒数
        leftd = utils.PrefixZero(
          Math.floor(lefttime / (1000 * 60 * 60 * 24)),
          2
        ), //计算天数
        lefth = utils.PrefixZero(
          Math.floor((lefttime / (1000 * 60 * 60)) % 24),
          2
        ), //计算小时数
        leftm = utils.PrefixZero(Math.floor((lefttime / (1000 * 60)) % 60), 2), //计算分钟数
        lefts = utils.PrefixZero(Math.floor((lefttime / 1000) % 60), 2); //计算秒数
      if (lefttime < 0) {
        this.expired = true;
        clearInterval(this.intervalId);
      } else this.showTime = `${leftd}天 ${lefth}小时 ${leftm}分钟${lefts}秒`; //返回倒计时的字符串
    },
    onSubmit() {
      if (this.form.name.trim() == "") {
        this.$message("名字不可为空");
        this.$refs.name.focus();
        return;
      }
      if (!this.collection.is_allow_empty && this.form.content.trim() == "") {
        this.$message("内容不可为空");
        return;
      }
      collectdoc
        .insert(this.form)
        .then(() => {
          this.$message({ type: "success", message: "提交成功" });
        })
        .catch((err) =>
          this.$message({ type: "error", message: err.data.message })
        );
    },
    init() {
      this.expire_at = this.dateAddDays(
        this.collection.create_at,
        this.collection.expires_in
      );
      if (this.expire_at < Date.now()) {
        this.expired = true;
      } else {
        this.intervalId = setInterval(() => {
          this.show();
        }, 1000);
      }
    },
  },
  mounted() {
    let { code } = this.$route.params;
    collection
      .getByCode(code)
      .then((res) => {
        if (!res.data) this.$router.push("/error");
        document.title = res.data.title;
        this.form.collection_id = res.data._id;
        this.collection = res.data;
        this.init();
      })
      .catch((err) => console.log(err));
  },
  beforeRouteLeave(to, from, next) {
    clearInterval(this.intervalId);
    next();
  },
};
</script>

<style scoped lang="scss">
@import "@/assets/css/home.scss";
.info {
  p + p {
    margin-top: 10px;
  }
}
.submit-item {
  margin-top: 5px;
}
</style>
