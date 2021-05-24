<template>
    <div id="app">
        <router-view />
    </div>
</template>
<script>
import { mapActions } from "vuex";

export default {
    methods: {
        ...mapActions(["init"]),
    },
    mounted() {
        this.init();
    },
};
</script>

<style lang="scss">
@import "@/assets/css/init.scss";
@import "@/assets/css/global.scss";
</style>
